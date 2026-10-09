import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  'https://sckoyizwlxakphdhhnbw.supabase.co';

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNja295aXp3bHhha3BoZGhobmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NDY1NTMsImV4cCI6MjEwNzAyMjU1M30.pyFa9lpOD8Kp5ezcX6k4V9uufBtj39iwSGq3qwDDsvM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
