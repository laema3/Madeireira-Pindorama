# Guia de Ativação Real - Madeireira Pindorama

Siga este passo a passo rigorosamente para ativar seu banco de dados.

## 1. Banco de Dados (Supabase)
1. Crie sua conta em [supabase.com](https://supabase.com/).
2. Crie um novo projeto (ex: "Pindorama-Site").
3. No menu lateral, clique no ícone **SQL Editor**.
4. Clique em **"+ New Query"**.
5. **IMPORTANTE:** Copie apenas o código SQL abaixo. Não copie as palavras "```sql" ou as crases finais.

### COPIE DAQUI PARA BAIXO:
```sql
create table categories ( id uuid default gen_random_uuid() primary key, name text not null );
create table subcategories ( id uuid default gen_random_uuid() primary key, name text not null, "categoryId" uuid references categories(id) on delete cascade );
create table products ( id uuid default gen_random_uuid() primary key, name text not null, description text, price text, category text, image text, created_at timestamp with time zone default now() );
create table brands ( id uuid default gen_random_uuid() primary key, name text not null, logo text );
create table partners ( id uuid default gen_random_uuid() primary key, name text not null, logo text );
create table videos ( id uuid default gen_random_uuid() primary key, title text not null, "youtubeId" text not null );
create table settings ( id bigint primary key default 1, "siteName" text, logo text, phone text, whatsapp text, email text, address text, instagram text, facebook text, "pixelId" text, "googleTag" text, "instagramPixel" text );
insert into settings (id, "siteName", whatsapp) values (1, 'PINDORAMA', '5534999999999') on conflict (id) do nothing;
```

## 2. Permissões de Leitura (Público)
Para que os visitantes vejam seus produtos sem precisar de login:
1. Vá em **Table Editor** no menu lateral.
2. Para cada tabela (products, categories, etc), clique em **"RLS Disabled"** no topo da tela para desativar a segurança de linha (apenas se for um site institucional simples). 
3. *Ou*, em **Authentication -> Policies**, crie uma política de "Enable read access for all users" para cada tabela.

## 3. Conexão do Código
1. Vá em **Project Settings -> API**.
2. Copie a **URL** e a **anon public key**.
3. Abra o arquivo `supabaseConfig.ts` e cole nos campos correspondentes.

---
**DICA:** Assim que você salvar o arquivo `supabaseConfig.ts` com as chaves certas, o seu Painel ADM no site mostrará a luz verde "Cloud Sync: On".