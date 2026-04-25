import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

vi.mock('../../config/supabase', () => ({
  supabaseAdmin: {
    auth: {
      getUser: vi.fn(),
    },
  },
  supabaseClient: {},
}));

import { supabaseAdmin } from '../../config/supabase';
import { requireAuth } from '../../middleware/auth';
import type { AuthRequest } from '../../types';

const mockGetUser = supabaseAdmin.auth.getUser as ReturnType<typeof vi.fn>;

function makeReq(authHeader?: string): Request {
  return { headers: { authorization: authHeader } } as unknown as Request;
}

function mockRes() {
  const res = { status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res);
  return res as unknown as Response;
}

describe('requireAuth', () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn() as unknown as NextFunction;
    vi.clearAllMocks();
  });

  it('répond 401 si aucun header Authorization', async () => {
    const res = mockRes();
    await requireAuth(makeReq(), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token manquant' });
    expect(next).not.toHaveBeenCalled();
  });

  it('répond 401 si header ne commence pas par "Bearer "', async () => {
    const res = mockRes();
    await requireAuth(makeReq('Basic abc123'), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token manquant' });
  });

  it('répond 401 si Supabase retourne une erreur', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Token expired' } });
    const res = mockRes();
    await requireAuth(makeReq('Bearer invalid-token'), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token invalide ou expiré' });
    expect(next).not.toHaveBeenCalled();
  });

  it('répond 401 si Supabase retourne user null sans erreur', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    const res = mockRes();
    await requireAuth(makeReq('Bearer some-token'), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('appelle next() et attache req.user si token valide', async () => {
    const fakeUser = { id: 'uuid-123', email: 'alice@test.com' };
    mockGetUser.mockResolvedValue({ data: { user: fakeUser }, error: null });
    const req = makeReq('Bearer valid-token') as AuthRequest;
    const res = mockRes();
    await requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 'uuid-123', email: 'alice@test.com' });
  });
});
