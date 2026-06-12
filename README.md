# BDGstore — Catálogo

Catálogo de ferramentas, eletrodomésticos e produtos no geral, com botões de compra
que levam direto ao WhatsApp da loja.

## Arquivos

| Arquivo        | Função                                                        |
|----------------|--------------------------------------------------------------|
| `index.html`   | Catálogo (página do cliente)                                 |
| `admin.html`   | Painel administrativo (cadastro de produtos) — acesso separado |
| `styles.css`   | Estilo compartilhado                                          |
| `shared.js`    | Dados e lógica compartilhados (produtos, WhatsApp, etc.)     |

## Como usar

- **Cliente:** abra `index.html`.
- **Administrador:** abra `admin.html` (login com senha) para cadastrar/editar produtos.

Os produtos e imagens ficam no **Supabase** (banco de dados + storage), então são
compartilhados entre todos os dispositivos. O login do admin usa **Supabase Auth**.

## Configuração

Antes de usar, configure o backend seguindo o **[SETUP.md](SETUP.md)**:
criar o projeto Supabase, a tabela `products`, o bucket de imagens, o usuário admin
e colar a URL/anon key no `shared.js`.

No painel administrativo é possível alterar:
- O número de WhatsApp da loja (salvo localmente)

## Segurança

- Login real via Supabase Auth (e-mail/senha com JWT).
- Escrita no banco e upload de imagens só com sessão autenticada (Row Level Security).
- A `anon key` é pública por design; nunca exponha a `service_role` key no frontend.
- A página `admin.html` não tem link no catálogo — acesso por URL direta apenas.
