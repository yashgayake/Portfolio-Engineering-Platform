import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: false
        }
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
}

export function getSupabaseStatus(): { configured: boolean; url: string | null; message: string } {
  const url = process.env.SUPABASE_URL || null;
  const hasKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);

  if (url && hasKey) {
    return {
      configured: true,
      url,
      message: 'Supabase integration configured with project URL.'
    };
  }

  return {
    configured: false,
    url: null,
    message: 'Local embedded PostgreSQL-compatible JSON engine active. Set SUPABASE_URL and SUPABASE_ANON_KEY to enable cloud synchronization.'
  };
}
