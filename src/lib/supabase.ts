<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing from environment variables!')
    console.log('VITE_SUPABASE_URL:', supabaseUrl)
    console.log('VITE_SUPABASE_KEY:', supabaseKey ? 'Set' : 'Not Set')
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')
=======
import { createClient } from '@supabase/supabase-js';

// Credentials provided by user
const supabaseUrl = 'https://hoieogginmsfmoarubuu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvaWVvZ2dpbm1zZm1vYXJ1YnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODM0OTEsImV4cCI6MjA4MTM1OTQ5MX0.5HAcivBIN_fv06Qs4iRjKDNowN204aucVKiwqQBVtkw';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
>>>>>>> f995c4147209a2d4e3b058401cbf6907ab8e3ad2
