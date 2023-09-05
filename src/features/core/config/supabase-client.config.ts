import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClientComponentClient({
  supabaseUrl,
  supabaseKey,
  isSingleton: true,
});
