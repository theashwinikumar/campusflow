import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Improved check: Must be a valid HTTPS URL and not the placeholder
const isValidUrl = (url) => {
  try {
    return url && url.startsWith('https://') && url.includes('.supabase.co') && url !== 'your-supabase-url-here';
  } catch {
    return false;
  }
};

const isConfigured = isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey.length > 20;

if (!isConfigured && supabaseUrl && supabaseUrl !== 'your-supabase-url-here') {
  console.warn('Invalid Supabase configuration detected. Falling back to Demo Mode. Please check your .env file.');
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const IS_DEMO_MODE = !isConfigured;
