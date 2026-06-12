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

Os produtos e configurações ficam salvos no navegador (`localStorage`).

## Configuração

No painel administrativo é possível alterar:
- O número de WhatsApp da loja
- A senha de acesso ao admin

## Observações importantes

1. **Senha do admin:** por ser um site estático, a senha fica no código (lado do cliente)
   e **não oferece segurança real** — serve apenas para evitar acesso casual. Para segurança
   de verdade é necessário um backend/servidor com autenticação.
2. **Dados por dispositivo:** como os produtos ficam no `localStorage`, eles **não sincronizam
   automaticamente entre dispositivos**. Para um catálogo único acessível de qualquer lugar,
   é preciso um banco de dados/backend.
