# Guia de Ativação Real - Madeireira Pindorama

Siga este passo a passo para ativar o sistema de banco de dados e fotos.

## 1. Banco de Dados (SQL)
No **SQL Editor** do Supabase, apague tudo e execute este bloco completo para garantir que todas as colunas existem:

```sql
-- Criar tabelas básicas
create table if not exists categories ( id uuid default gen_random_uuid() primary key, name text not null );
create table if not exists products ( id uuid default gen_random_uuid() primary key, name text not null, description text, price text, category text, image text, created_at timestamp with time zone default now() );
create table if not exists partners ( id uuid default gen_random_uuid() primary key, name text not null, logo text );
create table if not exists projects ( id uuid default gen_random_uuid() primary key, title text not null, location text, image text );
create table if not exists banners ( id uuid default gen_random_uuid() primary key, image text not null );
create table if not exists settings ( id bigint primary key default 1, "siteName" text, whatsapp text, address text, hoursWeek text, instagram text, logo text, phone text, email text, hoursSat text, facebook text );

-- Inserir configuração inicial se não existir
insert into settings (id, "siteName", whatsapp) 
values (1, 'PINDORAMA', '5534999999999') 
on conflict (id) do nothing;
```

## 2. CONFIGURAÇÃO OBRIGATÓRIA: Storage (Fotos)
O erro "Bucket not found" acontece porque você ainda não criou a pasta no Supabase.

1. No menu lateral do Supabase, clique em **Storage** (ícone de um balde).
2. Clique no botão **"New Bucket"**.
3. No campo "Name", digite exatamente: **images** (em minúsculo).
4. **MUITO IMPORTANTE:** Ative a chave **"Public bucket"**. Se ficar privado, as fotos não aparecem no site.
5. Clique em **Save**.

## 3. Liberar Envios (Policies)
1. Ainda no menu **Storage**, clique em **Policies**.
2. Clique em **New Policy** no bucket `images`.
3. Escolha **"For full customization"**.
4. Em "Policy Name", escreva: **Acesso Total**.
5. Em "Allowed Operations", marque **TODAS** (SELECT, INSERT, UPDATE, DELETE).
6. Em "Target Roles", deixe `anon` e `authenticated`.
7. No campo de texto da regra, apague o que estiver lá e escreva apenas: `true`
8. Clique em **Review** e depois **Save**.

---
**PRONTO:** Agora você pode voltar ao seu painel ADM e clicar em "Selecionar Foto". O erro de bucket terá sumido!