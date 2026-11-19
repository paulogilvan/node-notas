# API de Notas

API REST para gerenciar notas (CRUD), feita com Node.js, TypeScript, Express, Drizzle ORM, Zod e PostgreSQL.

## Requisitos

- Node.js 20.6 ou superior
- Docker e Docker Compose (o Docker Desktop precisa estar aberto)

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Criar o arquivo de variáveis de ambiente
cp .env.example .env

# 3. Subir o PostgreSQL (porta 6000)
docker compose up -d

# 4. Criar a tabela e popular com notas de exemplo
npm run db:migrate
npm run db:seed

# 5. Iniciar a API com hot reload
npm run dev
```

A API fica disponível em `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `PORT` | Porta da API | `3000` |
| `DATABASE_URL` | Conexão com o PostgreSQL | `postgres://notes:notes@localhost:6000/notes` |

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia a API com hot reload |
| `npm run build` | Compila para `./dist` |
| `npm start` | Roda a versão compilada (após o build) |
| `npm run db:generate` | Gera migrations a partir do schema |
| `npm run db:migrate` | Aplica as migrations no banco |
| `npm run db:seed` | Insere notas de exemplo (do usuário `seed@example.com` / `123456`) |

## Endpoints

| Método | Rota | Descrição | Sucesso | Erros |
|---|---|---|---|---|
| POST | `/notes` | Cria nota | `201` | `400` |
| GET | `/notes` | Lista as notas do usuário autenticado | `200` | — |
| GET | `/notes/:id` | Busca uma nota | `200` | `400`, `404` |
| PUT | `/notes/:id` | Edita título e/ou conteúdo | `200` | `400`, `404` |
| DELETE | `/notes/:id` | Exclui nota | `204` | `400`, `404` |

Regras:
- Todas as rotas `/notes` exigem o header `Authorization: Bearer <token>` (token obtido em `POST /auth/login`). Sem token ou com token inválido, retornam `401`.
- Cada nota pertence ao usuário que a criou. O usuário só lista, busca, edita e exclui as próprias notas; uma nota de outro usuário responde `404`.
- `POST`: `title` e `content` são obrigatórios (mínimo 1 caractere).
- `PUT`: `title` e `content` são opcionais, mas ao menos um deve ser informado.
- `:id` deve ser um UUID válido.

Erros retornam JSON: `{ "error": "mensagem" }`. Erros de validação incluem também `issues` com os detalhes do Zod.

### Exemplos

```bash
# Listar
curl localhost:3000/notes

# Criar
curl -X POST localhost:3000/notes \
  -H "content-type: application/json" \
  -d '{"title":"Teste","content":"Olá"}'

# Buscar
curl localhost:3000/notes/<id>

# Editar
curl -X PUT localhost:3000/notes/<id> \
  -H "content-type: application/json" \
  -d '{"title":"Novo título"}'

# Excluir
curl -X DELETE localhost:3000/notes/<id>
```

## Estrutura

```
src/
├── server.ts        # app Express, middlewares e listen
├── env.ts           # validação das variáveis de ambiente
├── db/              # conexão, schema e seed
├── routes/          # definição das rotas
├── middlewares/     # middlewares (ex.: autenticação)
├── controllers/     # valida a entrada e responde HTTP
├── schemas/         # schemas Zod
├── services/        # acesso ao banco de dados
└── types/           # extensões de tipos (ex.: req.userId)
drizzle/             # migrations geradas
```

## Banco de dados

```bash
docker compose down        # para o banco (mantém os dados)
docker compose down -v     # para o banco e apaga os dados
```
