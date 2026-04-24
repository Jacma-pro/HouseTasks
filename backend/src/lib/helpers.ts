import { supabaseAdmin } from '../config/supabase';

export async function getUserFamily(userId: string): Promise<{ familyId: string; role: string } | null> {
  const { data, error } = await supabaseAdmin
    .from('family_members')
    .select('family_id, role')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;
  return { familyId: data.family_id, role: data.role };
}

export async function logTaskHistory(
  taskId: string,
  changedBy: string,
  action: 'created' | 'assigned' | 'status_changed' | 'updated' | 'deleted',
  oldValue?: Record<string, unknown>,
  newValue?: Record<string, unknown>
): Promise<void> {
  await supabaseAdmin.from('task_history').insert({
    task_id: taskId,
    changed_by: changedBy,
    action,
    old_value: oldValue ?? null,
    new_value: newValue ?? null,
  });
}
