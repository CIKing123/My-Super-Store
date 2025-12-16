import { createClient } from '@supabase/supabase-js';

// Credentials provided by user
const supabaseUrl = 'https://hoieogginmsfmoarubuu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvaWVvZ2dpbm1zZm1vYXJ1YnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODM0OTEsImV4cCI6MjA4MTM1OTQ5MX0.5HAcivBIN_fv06Qs4iRjKDNowN204aucVKiwqQBVtkw';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
