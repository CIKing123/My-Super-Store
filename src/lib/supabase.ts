import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing from environment variables!')
    console.log('VITE_SUPABASE_URL:', supabaseUrl)
    console.log('VITE_SUPABASE_KEY:', supabaseKey ? 'Set' : 'Not Set')
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')
