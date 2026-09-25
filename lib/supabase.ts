import { createClient } from '@supabase/supabase-js';

// Fallbacks let the app BUILD when Supabase env vars are absent (e.g. the public
// /demo deploy, which never touches Supabase). When the real env vars are set,
// the clients behave exactly as before. The placeholders are non-functional at
// runtime — any actual Supabase call needs real env vars configured.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key (for webhooks, admin operations)
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key'
  );
}
