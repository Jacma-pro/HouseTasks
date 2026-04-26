import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase';
import { requireAuth } from '../middleware/auth';
import { getUserFamily, logTaskHistory } from '../lib/helpers';
import { AuthRequest } from '../types';

const router = Router();

const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  due_date: z.string().datetime({ offset: true }).optional(),
  assigned_to: z.array(z.string().uuid()).default([]),
  helpers: z.array(z.string().uuid()).default([]),
});

const updateTaskSchema = createTaskSchema.partial();

const statusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
});

function transformTask(task: Record<string, unknown>) {
  const { assigned_users, helper_users, ...rest } = task as Record<string, unknown> & {
    assigned_users: Array<{ user_id: string; user?: { id: string; name: string; avatar_url?: string } }>;
    helper_users: Array<{ user_id: string }>;
  };
  return {
    ...rest,
    assigned_to: (assigned_users ?? []).map((a) => a.user_id),
    assignees: (assigned_users ?? []).map((a) => a.user).filter(Boolean),
    helpers: (helper_users ?? []).map((h) => h.user_id),
  };
}

// GET /api/tasks
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const { status, assigned_to, created_by } = req.query;

    const membership = await getUserFamily(user.id);
    if (!membership) {
      res.status(403).json({ error: 'Vous n\'appartenez à aucune famille' });
      return;
    }

    let query = supabaseAdmin
      .from('tasks')
      .select('*, assigned_users:task_assignments(user_id, user:profiles(id, name, avatar_url)), helper_users:task_dependencies(user_id)')
      .eq('family_id', membership.familyId)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status as string);
    if (created_by) query = query.eq('created_by', created_by as string);

    if (assigned_to) {
      const { data: assignments } = await supabaseAdmin
        .from('task_assignments')
        .select('task_id')
        .eq('user_id', assigned_to as string);
      const taskIds = (assignments ?? []).map((a: { task_id: string }) => a.task_id);
      if (taskIds.length === 0) {
        res.json([]);
        return;
      }
      query = query.in('id', taskIds);
    }

    const { data: tasks, error } = await query;

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json((tasks ?? []).map(transformTask));
  } catch (error) {
    next(error);
  }
});

// GET /api/tasks/:id
router.get('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const { id } = req.params;

    const membership = await getUserFamily(user.id);
    if (!membership) {
      res.status(403).json({ error: 'Vous n\'appartenez à aucune famille' });
      return;
    }

    const { data: task, error } = await supabaseAdmin
      .from('tasks')
      .select(`
        *,
        assigned_users:task_assignments(user_id, user:profiles(id, name, avatar_url)),
        helper_users:task_dependencies(user_id, user:profiles(id, name, avatar_url))
      `)
      .eq('id', id)
      .eq('family_id', membership.familyId)
      .single();

    if (error || !task) {
      res.status(404).json({ error: 'Tâche introuvable' });
      return;
    }

    const { assigned_users, helper_users, ...rest } = task as Record<string, unknown> & {
      assigned_users: Array<{ user_id: string; user: unknown }>;
      helper_users: Array<{ user_id: string; user: unknown }>;
    };

    res.json({
      ...rest,
      assigned_to: assigned_users.map((a) => a.user),
      helpers: helper_users.map((h) => h.user),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks
router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const body = createTaskSchema.parse(req.body);

    const membership = await getUserFamily(user.id);
    if (!membership) {
      res.status(403).json({ error: 'Vous n\'appartenez à aucune famille' });
      return;
    }

    const { data: task, error: taskError } = await supabaseAdmin
      .from('tasks')
      .insert({
        family_id: membership.familyId,
        title: body.title,
        description: body.description,
        priority: body.priority ?? 'medium',
        due_date: body.due_date,
        created_by: user.id,
        status: 'pending',
      })
      .select()
      .single();

    if (taskError || !task) {
      res.status(400).json({ error: taskError?.message ?? 'Erreur lors de la création' });
      return;
    }

    if (body.assigned_to.length > 0) {
      await supabaseAdmin.from('task_assignments').insert(
        body.assigned_to.map((userId) => ({ task_id: task.id, user_id: userId }))
      );
    }

    if (body.helpers.length > 0) {
      await supabaseAdmin.from('task_dependencies').insert(
        body.helpers.map((userId) => ({ task_id: task.id, user_id: userId }))
      );
    }

    await logTaskHistory(task.id, user.id, 'created', undefined, { title: task.title, status: task.status });

    res.status(201).json({ ...task, assigned_to: body.assigned_to, helpers: body.helpers });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Données invalides', details: error.issues });
      return;
    }
    next(error);
  }
});

// PUT /api/tasks/:id
router.put('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const id = req.params.id as string;
    const body = updateTaskSchema.parse(req.body);

    const membership = await getUserFamily(user.id);
    if (!membership) {
      res.status(403).json({ error: 'Vous n\'appartenez à aucune famille' });
      return;
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('family_id', membership.familyId)
      .single();

    if (fetchError || !existing) {
      res.status(404).json({ error: 'Tâche introuvable' });
      return;
    }

    if (existing.created_by !== user.id && membership.role !== 'admin') {
      res.status(403).json({ error: 'Accès non autorisé' });
      return;
    }

    const { data: task, error: updateError } = await supabaseAdmin
      .from('tasks')
      .update({
        title: body.title,
        description: body.description,
        priority: body.priority,
        due_date: body.due_date,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError || !task) {
      res.status(400).json({ error: updateError?.message ?? 'Erreur lors de la mise à jour' });
      return;
    }

    if (body.assigned_to !== undefined) {
      await supabaseAdmin.from('task_assignments').delete().eq('task_id', id);
      if (body.assigned_to.length > 0) {
        await supabaseAdmin.from('task_assignments').insert(
          body.assigned_to.map((userId) => ({ task_id: id, user_id: userId }))
        );
      }
    }

    if (body.helpers !== undefined) {
      await supabaseAdmin.from('task_dependencies').delete().eq('task_id', id);
      if (body.helpers.length > 0) {
        await supabaseAdmin.from('task_dependencies').insert(
          body.helpers.map((userId) => ({ task_id: id, user_id: userId }))
        );
      }
    }

    await logTaskHistory(id, user.id, 'updated', existing, task);

    res.json({ ...task, assigned_to: body.assigned_to ?? [], helpers: body.helpers ?? [] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Données invalides', details: error.issues });
      return;
    }
    next(error);
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const { id } = req.params;

    const membership = await getUserFamily(user.id);
    if (!membership) {
      res.status(403).json({ error: 'Vous n\'appartenez à aucune famille' });
      return;
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('tasks')
      .select('created_by')
      .eq('id', id)
      .eq('family_id', membership.familyId)
      .single();

    if (fetchError || !existing) {
      res.status(404).json({ error: 'Tâche introuvable' });
      return;
    }

    if (existing.created_by !== user.id && membership.role !== 'admin') {
      res.status(403).json({ error: 'Accès non autorisé' });
      return;
    }

    const { error } = await supabaseAdmin.from('tasks').delete().eq('id', id);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// PATCH /api/tasks/:id/status
router.patch('/:id/status', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const id = req.params.id as string;
    const { status } = statusSchema.parse(req.body);

    const membership = await getUserFamily(user.id);
    if (!membership) {
      res.status(403).json({ error: 'Vous n\'appartenez à aucune famille' });
      return;
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('tasks')
      .select('status')
      .eq('id', id)
      .eq('family_id', membership.familyId)
      .single();

    if (fetchError || !existing) {
      res.status(404).json({ error: 'Tâche introuvable' });
      return;
    }

    const updates: Record<string, unknown> = { status };
    if (status === 'completed') updates.completed_at = new Date().toISOString();
    if (existing.status === 'completed' && status !== 'completed') updates.completed_at = null;

    const { data: task, error } = await supabaseAdmin
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !task) {
      res.status(400).json({ error: error?.message ?? 'Erreur lors de la mise à jour' });
      return;
    }

    await logTaskHistory(id, user.id, 'status_changed', { status: existing.status }, { status });

    res.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Données invalides', details: error.issues });
      return;
    }
    next(error);
  }
});

export default router;
