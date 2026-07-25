import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
if (!supabaseUrl || !supabaseAnonKey) {
  // Warn during compile but don't crash if vars are not populated yet
  console.warn('Supabase credentials missing. Ensure environment variables are set.');
}

// Standard Anon Client for general read/write actions (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Server-friendly session handling
  },
});
