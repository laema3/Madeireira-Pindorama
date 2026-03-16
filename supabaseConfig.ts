import { createClient } from '@supabase/supabase-js';

// Suas chaves reais vinculadas ao projeto qdigphmrabgzlbmvqqet
const supabaseUrl: string = 'https://qdigphmrabgzlbmvqqet.supabase.co'; 
const supabaseKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkaWdwaG1yYWJnemxibXZxcWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjA4NzYsImV4cCI6MjA4MzkzNjg3Nn0.NxniZBWkfxKyWhTIfZ4KVzdWzGeBVldhviEESSlibDI';      

export const isConfigured = true;

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseKey) : null as any;
