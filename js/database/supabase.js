import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Gunakan URL dan publishable key dari Supabase Project Settings > API.
export const SUPABASE_URL = 'https://zeqqkklvlzvdckvklver.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_0F7XYSx9qT6c6xuKZjRP5g_DK8mIEdU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
