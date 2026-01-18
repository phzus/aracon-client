import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Replace these values with your actual Supabase credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

if (!SUPABASE_URL || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
  console.warn('⚠️ Supabase URL not configured. Please set VITE_SUPABASE_URL environment variable.');
}

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn('⚠️ Supabase Anon Key not configured. Please set VITE_SUPABASE_ANON_KEY environment variable.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
