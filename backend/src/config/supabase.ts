import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseSecretKey || !supabasePublishableKey) {
  throw new Error('Variables d\'environnement Supabase manquantes');
}

// Client admin (service role) — bypass RLS, opérations DB et vérification JWT
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Client auth (publishable key) — sign in / sign out utilisateur
export const supabaseClient = createClient(supabaseUrl, supabasePublishableKey);
