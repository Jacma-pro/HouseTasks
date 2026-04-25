import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

vi.mock('../../config/supabase', () => ({
  supabaseAdmin: {
    auth: {
      getUser: vi.fn(),
      admin: {
        createUser: vi.fn(),
        deleteUser: vi.fn(),
        signOut: vi.fn(),
      },
    },
    from: vi.fn(),
  },
  supabaseClient: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

import app from '../../app';
import { supabaseAdmin, supabaseClient } from '../../config/supabase';

const mockGetUser = supabaseAdmin.auth.getUser as ReturnType<typeof vi.fn>;
const mockCreateUser = supabaseAdmin.auth.admin.createUser as ReturnType<typeof vi.fn>;
const mockSignIn = supabaseClient.auth.signInWithPassword as ReturnType<typeof vi.fn>;
const mockFrom = supabaseAdmin.from as ReturnType<typeof vi.fn>;

function profileChain(result: unknown) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue(result),
    single: vi.fn().mockResolvedValue(result),
  };
}

describe('POST /api/auth/register — validation', () => {
  it('répond 400 si le body est vide', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('répond 400 si email invalide', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'pas-un-email', password: 'password123', name: 'Alice' });
    expect(res.status).toBe(400);
  });

  it('répond 400 si mot de passe trop court', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'alice@test.com', password: 'court', name: 'Alice' });
    expect(res.status).toBe(400);
  });

  it('répond 400 si name manquant', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'alice@test.com', password: 'password123' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/register — logique', () => {
  beforeEach(() => vi.clearAllMocks());

  it('répond 400 si Supabase retourne une erreur à la création', async () => {
    mockCreateUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Email déjà utilisé' },
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'alice@test.com', password: 'password123', name: 'Alice' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email déjà utilisé');
  });

  it('répond 201 après création réussie', async () => {
    const fakeUser = { id: 'uuid-alice', email: 'alice@test.com' };
    mockCreateUser.mockResolvedValue({ data: { user: fakeUser }, error: null });
    mockFrom.mockReturnValue(profileChain({ error: null }));
    mockSignIn.mockResolvedValue({
      data: { session: { access_token: 'tok', refresh_token: 'ref' }, user: fakeUser },
      error: null,
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'alice@test.com', password: 'password123', name: 'Alice' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body.user.email).toBe('alice@test.com');
  });
});

describe('POST /api/auth/login — validation', () => {
  it('répond 400 si body vide', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('répond 400 si email invalide', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid', password: 'pass' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login — logique', () => {
  beforeEach(() => vi.clearAllMocks());

  it('répond 401 si credentials incorrects', async () => {
    mockSignIn.mockResolvedValue({ data: { session: null }, error: { message: 'Invalid login' } });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@test.com', password: 'wrong' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Email ou mot de passe incorrect');
  });
});

describe('GET /api/auth/me — authentification', () => {
  beforeEach(() => vi.clearAllMocks());

  it('répond 401 sans token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Token manquant');
  });

  it('répond 401 avec un token invalide', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid token' } });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer bad-token');

    expect(res.status).toBe(401);
  });

  it('répond 404 si profil introuvable après auth valide', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'uuid-1', email: 'alice@test.com' } },
      error: null,
    });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(404);
  });
});
