import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

vi.mock('../../config/supabase', () => ({
  supabaseAdmin: { auth: { getUser: vi.fn() }, from: vi.fn() },
  supabaseClient: { auth: { signInWithPassword: vi.fn() } },
}));

import app from '../../app';

describe('GET /health', () => {
  it('répond 200 avec { status: "ok" }', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
