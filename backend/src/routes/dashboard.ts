import { Router, Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { requireAuth } from '../middleware/auth';
import { getUserFamily } from '../lib/helpers';
import { AuthRequest } from '../types';

const router = Router();

// GET /api/dashboard
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user } = req as AuthRequest;

    const membership = await getUserFamily(user.id);
    if (!membership) {
      res.status(403).json({ error: 'Vous n\'appartenez à aucune famille' });
      return;
    }

    const { familyId } = membership;
    const now = new Date();
    const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      familyResult,
      membersResult,
      tasksResult,
      myAssignmentsResult,
    ] = await Promise.all([
      supabaseAdmin.from('families').select('*').eq('id', familyId).single(),
      supabaseAdmin
        .from('family_members')
        .select('role, joined_at, user:profiles(id, name, avatar_url)')
        .eq('family_id', familyId),
      supabaseAdmin
        .from('tasks')
        .select('id, title, status, priority, due_date, created_by, created_at')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('task_assignments')
        .select('task_id')
        .eq('user_id', user.id),
    ]);

    const familyTaskIds = (tasksResult.data ?? []).map((t: { id: string }) => t.id);

    const recentHistoryResult = familyTaskIds.length > 0
      ? await supabaseAdmin
          .from('task_history')
          .select('id, action, created_at, changed_by, task:tasks(id, title), changer:profiles(id, name)')
          .in('task_id', familyTaskIds)
          .order('created_at', { ascending: false })
          .limit(10)
      : { data: [] };

    const tasks = tasksResult.data ?? [];
    const myTaskIds = new Set((myAssignmentsResult.data ?? []).map((a: { task_id: string }) => a.task_id));

    const stats = {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      cancelled: tasks.filter((t) => t.status === 'cancelled').length,
    };

    const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

    const dueSoon = tasks.filter(
      (t) => t.due_date && t.due_date <= in7days && !['completed', 'cancelled'].includes(t.status)
    );

    const myTasks = tasks.filter((t) => myTaskIds.has(t.id));

    const active = tasks
      .filter((t) => t.status === 'pending' || t.status === 'in_progress')
      .sort((a, b) => {
        const pDiff = (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1);
        if (pDiff !== 0) return pDiff;
        if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
        if (a.due_date) return -1;
        if (b.due_date) return 1;
        return 0;
      })
      .slice(0, 8);

    res.json({
      family: familyResult.data,
      members: membersResult.data ?? [],
      tasks: {
        stats,
        due_soon: dueSoon,
        my_tasks: myTasks,
        active,
      },
      recent_activity: recentHistoryResult.data ?? [],
    });
  } catch (error) {
    next(error);
  }
});

export default router;
