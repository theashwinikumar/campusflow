import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-supabase-url-here';

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Placeholder flag — when true, the app uses mock data
export const IS_DEMO_MODE = !isConfigured;
