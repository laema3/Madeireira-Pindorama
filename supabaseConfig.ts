import { createClient } from '@supabase/supabase-js';

// Substitua por suas chaves do Supabase (obtidas em Project Settings -> API)
const supabaseUrl = 'https://sua-url-aqui.supabase.co';
const supabaseKey = 'sua-chave-anon-public-aqui';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const isConfigured = supabaseUrl !== 'https://sua-url-aqui.supabase.co';