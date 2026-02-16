import { createClient } from '@supabase/supabase-js';

// SUAS CHAVES REAIS (Já inseridas)
const supabaseUrl: string = 'https://qdigphmrabgzlbmvqqet.supabase.co'; 
const supabaseKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkaWdwaG1yYWJnemxibXZxcWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjA4NzYsImV4cCI6MjA4MzkzNjg3Nn0.NxniZBWkfxKyWhTIfZ4KVzdWzGeBVldhviEESSlibDI';      

// Verifica se você preencheu os dados corretamente
// Se a URL não for a de exemplo e contiver supabase.co, consideramos configurado.
export const isConfigured = 
  supabaseUrl !== 'https://SUA-URL-AQUI.supabase.co' && 
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co') &&
  supabaseKey !== 'SUA-CHAVE-ANON-AQUI';

// Inicializa o cliente com suas chaves reais
export const supabase = createClient(supabaseUrl, supabaseKey);
