// DUO OS — Supabase Client & Realtime Bridge
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'duo_supabase_url';
const STORAGE_KEY_ANON = 'duo_supabase_anon_key';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = localStorage.getItem(STORAGE_KEY_URL) || '';
  const storedKey = localStorage.getItem(STORAGE_KEY_ANON) || '';

  return {
    url: storedUrl || envUrl,
    anonKey: storedKey || envKey
  };
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
  else localStorage.removeItem(STORAGE_KEY_URL);

  if (anonKey) localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
  else localStorage.removeItem(STORAGE_KEY_ANON);

  cachedClient = null; // reset instance
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 20);
}

export function getSupabase(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const { url, anonKey } = getSupabaseCredentials();
  if (url && anonKey && url.startsWith('http')) {
    try {
      cachedClient = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
      return cachedClient;
    } catch (err) {
      console.warn('[DUO OS] Could not initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}
