import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase';
import { requireAuth } from '../middleware/auth';
import { getUserFamily } from '../lib/helpers';
import { AuthRequest } from '../types';

const router = Router();

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatar_url: z.string().url().optional(),
});

// GET /api/users — tous les membres de ma famille
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;

    const membership = await getUserFamily(user.id);
    if (!membership) {
      res.status(403).json({ error: 'Vous n\'appartenez à aucune famille' });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('family_members')
      .select('role, joined_at, user:profiles(id, name, avatar_url, created_at)')
      .eq('family_id', membership.familyId);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json(data ?? []);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id — profil d'un membre
router.get('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const { id } = req.params;

    const membership = await getUserFamily(user.id);
    if (!membership) {
      res.status(403).json({ error: 'Vous n\'appartenez à aucune famille' });
      return;
    }

    const { data: targetMembership } = await supabaseAdmin
      .from('family_members')
      .select('role, joined_at')
      .eq('family_id', membership.familyId)
      .eq('user_id', id)
      .maybeSingle();

    if (!targetMembership) {
      res.status(404).json({ error: 'Utilisateur introuvable dans cette famille' });
      return;
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !profile) {
      res.status(404).json({ error: 'Profil introuvable' });
      return;
    }

    res.json({ ...profile, role: targetMembership.role, joined_at: targetMembership.joined_at });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/:id — mettre à jour son profil
router.put('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const { id } = req.params;
    const body = updateProfileSchema.parse(req.body);

    if (id !== user.id) {
      res.status(403).json({ error: 'Vous ne pouvez modifier que votre propre profil' });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      res.status(400).json({ error: error?.message ?? 'Erreur lors de la mise à jour' });
      return;
    }

    res.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Données invalides', details: error.issues });
      return;
    }
    next(error);
  }
});

// GET /api/users/:id/tasks — tâches assignées à un membre
router.get('/:id/tasks', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;
    const { id } = req.params;

    const membership = await getUserFamily(user.id);
    if (!membership) {
      res.status(403).json({ error: 'Vous n\'appartenez à aucune famille' });
      return;
    }

    const { data: targetMembership } = await supabaseAdmin
      .from('family_members')
      .select('user_id')
      .eq('family_id', membership.familyId)
      .eq('user_id', id)
      .maybeSingle();

    if (!targetMembership) {
      res.status(404).json({ error: 'Utilisateur introuvable dans cette famille' });
      return;
    }

    const { data: assignments } = await supabaseAdmin
      .from('task_assignments')
      .select('task_id')
      .eq('user_id', id);

    const taskIds = (assignments ?? []).map((a: { task_id: string }) => a.task_id);

    if (taskIds.length === 0) {
      res.json([]);
      return;
    }

    const { data: tasks, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .in('id', taskIds)
      .eq('family_id', membership.familyId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json(tasks ?? []);
  } catch (error) {
    next(error);
  }
});

export default router;
