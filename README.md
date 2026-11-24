# Finora

Sistema financeiro para gerenciar cobranças. Você cadastra clientes e serviços e cria ordens de serviço (OS) com o valor, a data e o status de cada uma.

🔗 **Demo:** https://finora-phi-tawny.vercel.app

## Screenshots

![Página inicial](docs/screenshots/s1.png)
![Ordens de serviço](docs/screenshots/s2.png)

## Funcionalidades

- Cadastro e login de usuários, com sessão por cookie `httpOnly` (JWT)
- Gerenciamento de **clientes** (criar, listar, editar e excluir)
- Gerenciamento de **serviços** com preço (criar, listar, editar e excluir)
- **Ordens de serviço**: escolha de cliente e serviços, valor, data, hora e descrição
- Status da OS: `PENDING`, `FINALIZED`
- Rotas protegidas: cada usuário só acessa os próprios dados

## Tecnologias

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Axios
- Lucide React

**Backend**
- Node.js + Express 5
- TypeScript
- Prisma 7 + PostgreSQL
- Zod (validação)
- JWT + bcrypt (autenticação)

**Deploy:** frontend na Vercel e backend na Render.

## Estrutura do projeto

```
finora/
├── frontend/   # Aplicação React (Vite)
└── backend/    # API REST (Express + Prisma)
```

## Como rodar localmente

### Pré-requisitos

- Node.js 20 ou superior
- PostgreSQL rodando localmente (ou uma URL de banco na nuvem)

### 1. Clone o repositório

```bash
git clone https://github.com/MarceloM1g/finora.git
cd finora
```

### 2. Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` dentro de `backend/`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/finora"
JWT_SECRET="uma-chave-secreta-bem-longa"
PORT=3000
```

Rode as migrations, gere o client do Prisma e inicie o servidor:

```bash
npx prisma migrate dev --config prisma7.config.ts
npx prisma generate
npm run dev
```

A API fica em `http://localhost:3000`.

### 3. Frontend

Em outro terminal:

```bash
cd frontend
npm install
```

Crie um arquivo `.env` dentro de `frontend/`:

```env
VITE_API_URL="http://localhost:3000"
```

Inicie o projeto:

```bash
npm run dev
```

O app fica em `http://localhost:5173`.

## Rotas da API

Todas as rotas, exceto `register`, `login` e `logout`, exigem autenticação.

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Criar conta |
| POST | `/auth/login` | Entrar |
| GET | `/auth/me` | Dados do usuário logado |
| POST | `/auth/logout` | Sair |
| GET, POST | `/clients` | Listar e criar clientes |
| PUT, DELETE | `/clients/:id` | Editar e excluir cliente |
| GET, POST | `/services` | Listar e criar serviços |
| PUT, DELETE | `/services/:id` | Editar e excluir serviço |
| GET, POST | `/payments` | Listar e criar ordens de serviço |
| PUT, DELETE | `/payments/:id` | Editar e excluir OS |
| PATCH | `/payments/:id/finalize` | Finalizar OS |

## Scripts

| Pasta | Comando | O que faz |
|-------|---------|-----------|
| backend | `npm run dev` | Servidor em modo desenvolvimento |
| backend | `npm run build` | Gera o Prisma Client e compila o TypeScript |
| backend | `npm start` | Roda a versão compilada |
| frontend | `npm run dev` | Servidor de desenvolvimento do Vite |
| frontend | `npm run build` | Build de produção |
| frontend | `npm run lint` | Análise com ESLint |

## Autor

Feito por [Marcelo](https://github.com/MarceloM1g).