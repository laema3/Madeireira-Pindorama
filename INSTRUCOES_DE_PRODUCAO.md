# Guia de Configuração - Madeireira Pindorama (Supabase Edition)

Siga estes passos para ativar seu banco de dados Supabase.

## 1. No Console do Supabase
1. **Criar Projeto**: [supabase.com](https://supabase.com/) -> New Project.
2. **Criar Tabelas (SQL Editor)**:
   Cole e execute este código no SQL Editor para criar a estrutura:
   ```sql
   create table categories (
     id uuid default gen_random_uuid() primary key,
     name text not null
   );

   create table products (
     id uuid default gen_random_uuid() primary key,
     name text not null,
     description text,
     price text,
     category text,
     image text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   create table settings (
     id bigint primary key default 1,
     siteName text,
     phone text,
     whatsapp text,
     email text,
     address text,
     hoursWeek text,
     hoursSat text,
     instagram text,
     facebook text
   );
   ```
3. **Obter Chaves**: 
   - Vá em **Project Settings** -> **API**.
   - Copie a `Project URL` e a `anon public API key`.

## 2. No seu Código
Substitua os valores no arquivo `supabaseConfig.ts`.

## 3. Segurança (RLS)
Por padrão, o Supabase bloqueia tudo. No menu **Table Editor**, você pode desativar o "RLS" (Row Level Security) para testes iniciais, ou configurar políticas de leitura pública.

---
*Dúvidas? Consulte seu Engenheiro de Software.*