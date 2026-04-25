import { describe, it, expect, beforeAll } from 'vitest';

describe('Connexion Supabase', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let supabaseAdmin: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let supabaseClient: any;
  let envMissing = false;

  beforeAll(async () => {
    if (
      !process.env.SUPABASE_URL ||
      !process.env.SUPABASE_SECRET_KEY ||
      !process.env.SUPABASE_PUBLISHABLE_KEY
    ) {
      envMissing = true;
      console.warn('⚠ Créer backend/.env avec SUPABASE_URL, SUPABASE_SECRET_KEY, SUPABASE_PUBLISHABLE_KEY pour activer ces tests.');
      return;
    }
    ({ supabaseAdmin, supabaseClient } = await import('../../config/supabase'));
  });

  it('supabaseAdmin est défini', ({ skip }) => {
    if (envMissing) return skip();
    expect(supabaseAdmin).toBeDefined();
  });

  it('supabaseClient est défini', ({ skip }) => {
    if (envMissing) return skip();
    expect(supabaseClient).toBeDefined();
  });

  it('peut atteindre la table profiles', async ({ skip }) => {
    if (envMissing) return skip();
    const { error } = await supabaseAdmin.from('profiles').select('id').limit(1);
    expect(error).toBeNull();
  }, 10000);

  it('peut atteindre la table families', async ({ skip }) => {
    if (envMissing) return skip();
    const { error } = await supabaseAdmin.from('families').select('id').limit(1);
    expect(error).toBeNull();
  }, 10000);

  it('peut atteindre la table tasks', async ({ skip }) => {
    if (envMissing) return skip();
    const { error } = await supabaseAdmin.from('tasks').select('id').limit(1);
    expect(error).toBeNull();
  }, 10000);
});
