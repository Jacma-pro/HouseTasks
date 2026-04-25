import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../config/supabase', () => ({
  supabaseAdmin: {
    from: vi.fn(),
  },
  supabaseClient: {},
}));

import { supabaseAdmin } from '../../config/supabase';
import { getUserFamily, logTaskHistory } from '../../lib/helpers';

const mockFrom = supabaseAdmin.from as ReturnType<typeof vi.fn>;

function chainMock(finalResult: unknown) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue(finalResult),
    insert: vi.fn().mockResolvedValue(finalResult),
  };
  return chain;
}

describe('getUserFamily', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne null si Supabase retourne une erreur', async () => {
    mockFrom.mockReturnValue(chainMock({ data: null, error: { message: 'DB error' } }));
    expect(await getUserFamily('user-1')).toBeNull();
  });

  it('retourne null si data est null (utilisateur sans famille)', async () => {
    mockFrom.mockReturnValue(chainMock({ data: null, error: null }));
    expect(await getUserFamily('user-1')).toBeNull();
  });

  it('retourne { familyId, role } si la famille existe', async () => {
    mockFrom.mockReturnValue(
      chainMock({ data: { family_id: 'family-42', role: 'admin' }, error: null })
    );
    const result = await getUserFamily('user-1');
    expect(result).toEqual({ familyId: 'family-42', role: 'admin' });
  });

  it('interroge la table family_members', async () => {
    mockFrom.mockReturnValue(chainMock({ data: null, error: null }));
    await getUserFamily('user-1');
    expect(mockFrom).toHaveBeenCalledWith('family_members');
  });
});

describe('logTaskHistory', () => {
  beforeEach(() => vi.clearAllMocks());

  it('insère un enregistrement dans task_history', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({ insert: mockInsert });

    await logTaskHistory('task-1', 'user-1', 'created', undefined, { title: 'Test', status: 'pending' });

    expect(mockFrom).toHaveBeenCalledWith('task_history');
    expect(mockInsert).toHaveBeenCalledWith({
      task_id: 'task-1',
      changed_by: 'user-1',
      action: 'created',
      old_value: null,
      new_value: { title: 'Test', status: 'pending' },
    });
  });

  it('passe old_value null si non fourni', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({ insert: mockInsert });

    await logTaskHistory('task-2', 'user-2', 'deleted');

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ old_value: null, new_value: null })
    );
  });

  it('gère toutes les actions valides', async () => {
    const actions = ['created', 'assigned', 'status_changed', 'updated', 'deleted'] as const;
    for (const action of actions) {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      mockFrom.mockReturnValue({ insert: mockInsert });
      await expect(logTaskHistory('task-1', 'user-1', action)).resolves.toBeUndefined();
    }
  });
});
