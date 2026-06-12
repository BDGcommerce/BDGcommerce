# Setup do Supabase — BDGstore

Siga estes passos para colocar o catálogo com backend (login seguro + produtos
compartilhados entre todos os dispositivos).

## 1. Criar conta e projeto
Acesse https://supabase.com → **New Project** → dê um nome (ex.: `bdgstore`) →
defina uma senha de banco → crie. Depois, em **Project Settings → API**, anote:
- a **Project URL**
- a **anon public key**

## 2. Criar a tabela products
No Supabase, vá em **SQL Editor** e execute:

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text default 'Geral',
  badge text,
  price text,
  price_old text,
  installments integer,
  image text,
  "desc" text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table products enable row level security;

-- Leitura pública (catálogo)
create policy "Leitura pública" on products
  for select using (true);

-- Escrita apenas autenticado (admin)
create policy "Escrita autenticada" on products
  for all using (auth.role() = 'authenticated');
```

> Obs.: `desc` é palavra reservada no SQL, por isso a coluna é criada como `"desc"`
> (entre aspas). O acesso pela aplicação continua normal.

## 3. Criar o bucket de imagens
No Supabase → **Storage → New Bucket** → nome: `product-images` → marque como
**Public** → criar.

Depois, no **SQL Editor**, execute as políticas de Storage:

```sql
-- Permitir upload de imagens apenas para autenticados
create policy "Upload autenticado" on storage.objects
  for insert with check (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Leitura pública das imagens
create policy "Leitura pública imagens" on storage.objects
  for select using (bucket_id = 'product-images');
```

## 4. Criar o usuário admin
No Supabase → **Authentication → Users → Add User** → informe e-mail e senha.
Exemplo: `admin@bdgstore.com` / uma senha forte de sua escolha.

> Esse é o login que você usará na página `admin.html`.

## 5. Colar as chaves no código
No arquivo **`shared.js`**, no topo, substitua:
- `COLE_SUA_URL_AQUI` → pela **Project URL** (ex.: `https://xyzxyz.supabase.co`)
- `COLE_SUA_ANON_KEY_AQUI` → pela **anon public key**

Salve e faça commit/push.

## 6. Ativar o GitHub Pages
No repositório do GitHub → **Settings → Pages** → Branch: **main** →
Folder: **/ (root)** → **Save**.
O site ficará em: `https://bdgcommerce.github.io/BDGcommerce/`

## Segurança
- A **anon key é pública por design** — ela só permite o que as políticas (RLS) liberam.
- **NUNCA** coloque a `service_role` key no frontend.
- O `admin.html` não tem link no catálogo — acesso por URL direta apenas.
- Autenticação real via **Supabase Auth** (e-mail/senha com JWT).
