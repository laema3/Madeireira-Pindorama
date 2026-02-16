import { createClient } from '@supabase/supabase-js';

/**
 * INSTRUÇÕES:
 * 1. Acesse https://supabase.com
 * 2. Vá em Settings -> API
 * 3. Copie a "Project URL" e a "anon public" key e cole abaixo
 */

// SUBSTITUA PELAS SUAS CHAVES REAIS
const supabaseUrl: string = 'https://substitua-pela-sua-url.supabase.co'; 
const supabaseKey: string = 'substitua-pela-sua-chave-anon';      

// Esta lógica verifica se você alterou as strings padrão acima
export const isConfigured = 
  supabaseUrl !== 'https://substitua-pela-sua-url.supabase.co' && 
  supabaseUrl.includes('.supabase.co');

// Inicializa o cliente. Se não configurado, usa valores temporários para não quebrar o site.
export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder-url.supabase.co', 
  isConfigured ? supabaseKey : 'placeholder-key'
);