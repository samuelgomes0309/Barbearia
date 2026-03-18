<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge" alt="Licença" />
</p>

# ✂️ BarberPro — Sistema de Gestão para Barbearias

Sistema fullstack para gerenciamento de barbearias com **API REST** e **painel web interativo**. Gerencie modelos de corte, agendamentos de clientes, perfil e assinatura premium integrada com Stripe. Modelo freemium — plano gratuito com até 3 modelos de corte e plano premium com recursos ilimitados. Desenvolvido por **Samuel Gomes da Silva**.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Chakra_UI-319795?style=flat&logo=chakraui&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=flat&logo=stripe&logoColor=white" />
</p>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Stack Tecnológica](#-stack-tecnológica)
- [Modelos de Dados](#-modelos-de-dados)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Monorepo](#-estrutura-do-monorepo)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Endpoints da API](#-endpoints-da-api)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Fluxos Principais](#-fluxos-principais)
- [Documentação Detalhada](#-documentação-detalhada)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 🎯 Visão Geral

O **BarberPro** é um ecossistema completo para gestão de barbearias, dividido em duas aplicações integradas:

| Aplicação    | Público-Alvo | Função                                                                                    |
| ------------ | ------------ | ----------------------------------------------------------------------------------------- |
| **Backend**  | API central  | Gerencia autenticação, modelos de corte, agendamentos e assinaturas via Stripe            |
| **Frontend** | Barbeiros    | Painel web para gestão da agenda, tipos de corte, perfil e controle de assinatura premium |

### Fluxo de Operação

```
  👤 BARBEIRO (Web)                               🔧 API (Backend)
  ┌──────────────────────┐                     ┌──────────────────────┐
  │ • Cadastro / Login   │                     │ • PostgreSQL         │
  │ • Dashboard (agenda) │ ──────────────────▶ │ • Prisma ORM         │
  │ • Modelos de corte   │                     │ • JWT Auth           │
  │ • Agendamentos       │ ◀────────────────── │ • Stripe (pagamentos)│
  │ • Perfil do barbeiro │                     │ • Webhooks Stripe    │
  │ • Assinatura premium │                     │                      │
  └──────────────────────┘                     └──────────────────────┘
            ▲                                          │
            │              REST API (HTTP)             │
            └──────────────────────────────────────────┘
```

---

## 🏗️ Arquitetura do Sistema

```
                    ┌─────────────────────────────┐
                    │       PostgreSQL Database     │
                    │  (users, haircuts, services,  │
                    │   subscriptions)              │
                    └──────────────┬───────────────┘
                                   │ Prisma ORM
                    ┌──────────────▼───────────────┐
                    │     Backend (Node/Express)    │
                    │         Porta: 3333           │
                    │                               │
                    │  ┌─────────┐  ┌───────────┐  │
                    │  │ Routes  │→ │Controllers│  │
                    │  └─────────┘  └─────┬─────┘  │
                    │                     │        │
                    │               ┌─────▼─────┐  │
                    │               │ Services  │  │
                    │               └─────┬─────┘  │
                    │                     │        │
                    │               ┌─────▼─────┐  │
                    │               │  Prisma   │  │
                    │               └───────────┘  │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │     Frontend (Web)            │
                    │     Next.js (App Router)      │
                    │                               │
                    │  • SSR com Server Components  │
                    │  • Login / Cadastro           │
                    │  • Dashboard (agendamentos)   │
                    │  • CRUD de cortes             │
                    │  • Perfil do barbeiro         │
                    │  • Checkout Stripe            │
                    └──────────────────────────────┘
```

### Padrão Arquitetural (Backend)

O backend segue o padrão **MVC adaptado** com camadas bem definidas:

```
┌─────────────────────────────────────────────┐
│                  HTTP Request               │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│              routes.ts                      │
│  Define as rotas e aplica middlewares       │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│          isAuthenticated (middleware)        │
│  Verifica JWT e injeta user_id no request   │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│              Controller                     │
│  Extrai dados do request (body/query/params)│
│  Chama o Service e retorna a resposta HTTP  │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│               Service                       │
│  Toda a regra de negócio fica aqui          │
│  Validações, cálculos e operações no banco  │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│            PrismaClient                     │
│  Acesso ao banco de dados PostgreSQL        │
│  (via @prisma/adapter-pg)                   │
└─────────────────────────────────────────────┘
```

### Padrão Arquitetural (Frontend)

O frontend segue uma arquitetura baseada em **Server Components + Client Components** do Next.js App Router:

```
┌─────────────────────────────────────────────────┐
│               Ação do Usuário                   │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│            middleware.ts (Next.js)              │
│  Verifica cookie e aplica redirecionamentos     │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│        Server Component (page.tsx)              │
│  Lê cookie, instancia API, busca dados via SSR  │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│        Client Component (*Client.tsx)           │
│  Gerencia estado local, interações e formulários│
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│         AuthContext / setupAPIClient            │
│  Estado global de auth — Axios configurado      │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│           Backend REST (Express)                │
│  Processa a requisição e retorna resposta       │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Stack Tecnológica

### Backend

| Tecnologia           | Versão | Função                                |
| -------------------- | ------ | ------------------------------------- |
| Node.js              | ≥ 18   | Runtime JavaScript                    |
| TypeScript           | 5.9    | Tipagem estática                      |
| Express              | 4.19.2 | Framework HTTP                        |
| Prisma               | 7      | ORM com type-safety                   |
| PostgreSQL           | latest | Banco de dados relacional             |
| JWT (jsonwebtoken)   | 9.0.3  | Autenticação via token                |
| bcrypt               | 6.0.0  | Hash de senhas                        |
| Stripe               | 20.1.2 | Checkout, assinaturas e webhooks      |
| express-async-errors | 3.1.1  | Propagação automática de erros async  |
| dotenv               | 17.2.3 | Carregamento de variáveis de ambiente |
| cors                 | 2.8.5  | Liberação de origens cruzadas         |

### Frontend

| Tecnologia   | Versão | Função                                             |
| ------------ | ------ | -------------------------------------------------- |
| Next.js      | 16.1.1 | Framework React com App Router e SSR               |
| React        | 19.2.3 | Biblioteca de UI                                   |
| TypeScript   | 5      | Tipagem estática                                   |
| Chakra UI    | 3.30.0 | Design system com tema customizado                 |
| Tailwind CSS | 4      | Estilização utility-first (uso híbrido com Chakra) |
| Axios        | 1.13.2 | Cliente HTTP                                       |
| Nookies      | 2.5.2  | Gerenciamento de cookies (token JWT)               |
| React Icons  | 5.5.0  | Ícones SVG como componentes React                  |
| ESLint       | 9      | Linter de código                                   |

---

## 🗄️ Modelos de Dados

O banco de dados PostgreSQL contém 4 tabelas gerenciadas pelo Prisma:

```
┌──────────────────────────┐       ┌──────────────────────────────┐
│          users           │       │        subscriptions          │
├──────────────────────────┤       ├──────────────────────────────┤
│ id              UUID (PK)│◄──┐   │ id          String (PK)      │
│ name            String   │   │   │ status      String           │
│ email           String(UQ)│   │   │ priceId     String           │
│ password        String   │   └───│ user_id     UUID (FK, UQ)    │
│ address         String?  │       │ createdAt   DateTime?        │
│ subscription_id String?  │       │ updatedAt   DateTime?        │
│ createdAt       DateTime?│       └──────────────────────────────┘
│ updatedAt       DateTime?│
└───────────┬──────────────┘
            │
            │ 1:N
            │
┌───────────▼──────────────┐       ┌──────────────────────────────┐
│         haircuts         │       │          services             │
├──────────────────────────┤       ├──────────────────────────────┤
│ id          UUID (PK)    │◄──┐   │ id          UUID (PK)        │
│ name        String       │   │   │ customer    String           │
│ price       Float        │   └───│ haircut_id  UUID (FK)        │
│ status      Boolean      │       │ user_id     UUID (FK)        │
│ user_id     UUID (FK)    │       │ createdAt   DateTime?        │
│ createdAt   DateTime?    │       │ updatedAt   DateTime?        │
│ updatedAt   DateTime?    │       └──────────────────────────────┘
└──────────────────────────┘
```

### Relacionamentos

| Relação             | Tipo | Descrição                                             |
| ------------------- | ---- | ----------------------------------------------------- |
| User → Subscription | 1:1  | Cada usuário possui zero ou uma assinatura            |
| User → Haircuts     | 1:N  | Cada usuário possui zero ou mais modelos de corte     |
| User → Services     | 1:N  | Cada usuário possui zero ou mais agendamentos         |
| Haircut → Services  | 1:N  | Cada modelo de corte possui zero ou mais agendamentos |

### Campos Importantes

| Campo             | Modelo       | Descrição                                                    |
| ----------------- | ------------ | ------------------------------------------------------------ |
| `subscription_id` | User         | ID do customer no Stripe (preenchido na primeira assinatura) |
| `status`          | Haircut      | `true` (ativo) ou `false` (desativado)                       |
| `status`          | Subscription | Status da assinatura (`"active"`, `"canceled"`, etc.)        |
| `customer`        | Service      | Nome do cliente agendado                                     |

---

## ⚙️ Funcionalidades

### 🔐 Autenticação

- Cadastro de usuários com hash bcrypt (salt: 8)
- Login com geração de token JWT (expiração: 30 dias)
- Middleware `isAuthenticated` protege todas as rotas privadas
- Mensagem genérica em login inválido para evitar enumeração de usuários
- Persistência de sessão via cookie (`@barberpro.token`)
- Validação automática do token ao abrir a aplicação

### ✂️ Modelos de Corte

- CRUD completo de modelos de corte (nome e preço)
- **Plano Gratuito:** Limite de até 3 modelos cadastrados
- **Plano Premium:** Sem limite de modelos
- Apenas assinantes premium podem deletar cortes
- Filtragem por status (ativo/inativo) na listagem
- Contagem de cortes ativos e inativos

### 📅 Agendamentos

- Criação de agendamentos com nome do cliente e tipo de corte
- Listagem de agendamentos em aberto (ordenados por data de criação)
- Finalização de agendamento (remoção do registro)
- Dados do corte vinculado retornados na listagem

### 💳 Assinaturas (Stripe)

- Checkout integrado com Stripe para upgrade ao plano premium
- Portal de gerenciamento de assinatura (cancelar, alterar cartão)
- Sincronização automática via webhooks Stripe:
  - `checkout.session.completed` → Cria assinatura
  - `customer.subscription.updated` → Atualiza status
  - `customer.subscription.deleted` → Remove assinatura

### 👤 Perfil

- Visualização e edição dos dados do barbeiro (nome e endereço)
- Exibição do status da assinatura

### 📱 Interface Responsiva

- Sidebar fixa em desktop, Drawer deslizante em mobile
- Navegação: Cortes, Agenda, Agendar, Perfil
- Tema dark customizado com Chakra UI
- SSR para carregamento rápido de dados

---

## 📁 Estrutura do Monorepo

```
Barbearia/
│
├── 📄 README.md                  ← Você está aqui
├── 📄 LICENSE                    ← Licença MIT
│
├── 📂 backend/                   ← API REST (Node.js + Express)
│   ├── prisma/                   ← Schema e migrations do Prisma
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── server.ts             ← Ponto de entrada (porta 3333)
│   │   ├── routes.ts             ← Definição de todas as rotas
│   │   ├── base.ts               ← Configuração base do Express
│   │   ├── @types/               ← Extensão de tipos do Express
│   │   │   └── express/index.d.ts
│   │   ├── config/
│   │   │   └── auth.config.ts    ← Configuração JWT
│   │   ├── middlewares/
│   │   │   └── isAuthenticated.ts  ← Middleware JWT
│   │   ├── controllers/
│   │   │   ├── user/             ← CreateUser, SessionUser, DetailUser, UpdateUser
│   │   │   ├── haircut/          ← CRUD + Check + Count
│   │   │   ├── schedule/         ← Create, List, Finish
│   │   │   └── subscription/     ← Subscribe, Portal, WebHooks
│   │   ├── services/
│   │   │   ├── user/             ← Regras de negócio de usuários
│   │   │   ├── haircut/          ← Regras de negócio de cortes
│   │   │   ├── schedule/         ← Regras de negócio de agendamentos
│   │   │   └── subscriptions/    ← Regras de negócio de assinaturas
│   │   ├── prisma/
│   │   │   └── index.ts          ← PrismaClient singleton
│   │   ├── utils/
│   │   │   ├── stripe.ts         ← Instância global do Stripe
│   │   │   └── manageSubscription.ts ← Gerenciamento de assinaturas
│   │   └── generated/prisma/     ← Client Prisma gerado
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma.config.ts
│   └── README.md
│
├── 📂 frontend/                  ← Painel Web (Next.js + Chakra UI)
│   └── src/
│       ├── middleware.ts         ← Proteção de rotas (Next.js middleware)
│       ├── @types/
│       │   └── index.ts          ← Interfaces TypeScript centralizadas
│       ├── app/
│       │   ├── layout.tsx        ← Layout raiz com providers
│       │   ├── page.tsx          ← Redireciona para dashboard/login
│       │   ├── globals.css       ← Estilos globais
│       │   ├── dashboard/        ← Agendamentos em aberto
│       │   ├── haircut/          ← Lista, novo e edição de cortes
│       │   ├── schedule/         ← Criação de agendamentos
│       │   ├── profile/          ← Dados do barbeiro
│       │   ├── subscription/     ← Gerenciamento de assinatura
│       │   ├── login/            ← Tela de autenticação
│       │   └── register/         ← Tela de cadastro
│       ├── components/
│       │   ├── home/             ← Componentes da página inicial
│       │   └── sidebar/          ← Navegação lateral responsiva
│       ├── contexts/
│       │   └── AuthContext.tsx    ← Estado global de autenticação
│       ├── providers/
│       │   ├── app.provider.tsx  ← Agrupa providers da aplicação
│       │   └── chakra.system.tsx ← Tema customizado Chakra UI
│       └── services/
│           ├── api.ts            ← Factory do Axios (setupAPIClient)
│           ├── apiClient.ts      ← Instância Axios padrão
│           └── errors/           ← Tratamento de erros da API
│
└── 📂 documentation/             ← Documentação detalhada
    ├── backend/
    │   ├── CONTEXTO.md           ← Arquitetura e regras de negócio do backend
    │   └── ENDPOINTS.md          ← Referência completa de todos os endpoints
    └── frontend/
        └── CONTEXTO.md           ← Arquitetura e práticas do frontend
```

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Requisito           | Versão Mínima | Verificar Instalação                                                  |
| ------------------- | :-----------: | --------------------------------------------------------------------- |
| **Node.js**         |     18.x      | `node --version`                                                      |
| **npm** ou **yarn** |       —       | `npm --version` / `yarn --version`                                    |
| **PostgreSQL**      |     13.x      | `psql --version`                                                      |
| **Git**             |       —       | `git --version`                                                       |
| **Conta Stripe**    |       —       | Chaves de API em [dashboard.stripe.com](https://dashboard.stripe.com) |

---

## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/samuelgomes0309/barbearia
cd barberpro
```

### 2. Backend

```bash
cd backend

# Instalar dependências
yarn install  # ou npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/barberpro"
JWT_SECRET_KEY="sua_chave_secreta_aqui"
PORT=3333
STRIPE_API_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE="price_..."
STRIPE_SUCCESS_URL="http://localhost:3000/dashboard"
STRIPE_CANCEL_URL="http://localhost:3000/subscription"
```

> 💡 **Dica:** Gere um `JWT_SECRET_KEY` forte com:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

```bash
# Gerar client Prisma e rodar migrations
npx prisma migrate dev

# Iniciar servidor de desenvolvimento
yarn dev
```

O backend estará rodando em `http://localhost:3333`.

### 3. Frontend

```bash
cd frontend

# Instalar dependências
yarn install  # ou npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3333"
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
```

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará acessível em `http://localhost:3000`.

---

## ▶️ Executando o Projeto

### Inicialização Rápida (2 terminais)

**Terminal 1 — Backend:**

```bash
cd backend && yarn dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend && npm run dev
```

### Scripts Disponíveis

| Projeto  | Comando         | Descrição                                    |
| -------- | --------------- | -------------------------------------------- |
| Backend  | `yarn dev`      | Inicia servidor com hot-reload (ts-node-dev) |
| Frontend | `npm run dev`   | Inicia Next.js dev server com HMR            |
| Frontend | `npm run build` | Build de produção                            |
| Frontend | `npm run start` | Inicia servidor de produção                  |
| Frontend | `npm run lint`  | Executa ESLint                               |

---

## 📡 Endpoints da API

> Documentação completa em [documentation/backend/ENDPOINTS.md](documentation/backend/ENDPOINTS.md)

### Visão Geral

| Método   | Rota                      | Descrição                                | Auth |
| -------- | ------------------------- | ---------------------------------------- | :--: |
| `POST`   | `/users`                  | Cadastrar usuário (barbeiro)             |  ❌  |
| `POST`   | `/sessions`               | Autenticar usuário (login)               |  ❌  |
| `GET`    | `/me`                     | Dados do usuário logado                  |  ✅  |
| `PUT`    | `/users`                  | Atualizar perfil (nome/endereço)         |  ✅  |
| `POST`   | `/haircuts`               | Criar modelo de corte                    |  ✅  |
| `GET`    | `/haircuts`               | Listar modelos de corte (filtro: status) |  ✅  |
| `GET`    | `/haircuts/:haircut_id`   | Detalhes de um modelo de corte           |  ✅  |
| `PUT`    | `/haircuts`               | Atualizar modelo de corte                |  ✅  |
| `DELETE` | `/haircuts/:haircut_id`   | Deletar modelo de corte (premium)        |  ✅  |
| `GET`    | `/haircuts/check`         | Verificar status da assinatura           |  ✅  |
| `GET`    | `/haircuts/count`         | Contagem de cortes ativos/inativos       |  ✅  |
| `POST`   | `/schedules`              | Criar agendamento                        |  ✅  |
| `GET`    | `/schedules`              | Listar agendamentos em aberto            |  ✅  |
| `DELETE` | `/schedules/:schedule_id` | Finalizar (remover) agendamento          |  ✅  |
| `POST`   | `/subscribes`             | Iniciar checkout Stripe                  |  ✅  |
| `POST`   | `/create-portal`          | Acessar portal de gerenciamento Stripe   |  ✅  |
| `POST`   | `/webhooks`               | Receber eventos do Stripe (raw body)     |  ❌  |

### Exemplos Rápidos

#### Cadastro

```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Barbeiro", "email": "joao@email.com", "password": "senha123"}'
```

#### Login

```bash
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "password": "senha123"}'
```

#### Criar Modelo de Corte

```bash
curl -X POST http://localhost:3333/haircuts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"name": "Degradê", "price": 45.00}'
```

#### Criar Agendamento

```bash
curl -X POST http://localhost:3333/schedules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"customer": "Carlos Silva", "haircut_id": "UUID_DO_CORTE"}'
```

---

## 🔑 Variáveis de Ambiente

### Backend (`.env`)

| Variável                | Obrigatória | Descrição                                     | Exemplo                                        |
| ----------------------- | :---------: | --------------------------------------------- | ---------------------------------------------- |
| `DATABASE_URL`          |     ✅      | String de conexão PostgreSQL                  | `postgresql://user:pass@localhost:5432/barber` |
| `JWT_SECRET_KEY`        |     ✅      | Chave secreta para tokens JWT                 | `minha_chave_ultra_secreta`                    |
| `PORT`                  |     ✅      | Porta do servidor HTTP                        | `3333`                                         |
| `STRIPE_API_KEY`        |     ✅      | Chave secreta da API do Stripe                | `sk_test_...`                                  |
| `STRIPE_WEBHOOK_SECRET` |     ✅      | Secret para validação de webhooks Stripe      | `whsec_...`                                    |
| `STRIPE_PRICE`          |     ✅      | ID do price da assinatura premium             | `price_...`                                    |
| `STRIPE_SUCCESS_URL`    |     ✅      | URL de redirect após checkout com sucesso     | `http://localhost:3000/dashboard`              |
| `STRIPE_CANCEL_URL`     |     ✅      | URL de redirect após cancelamento do checkout | `http://localhost:3000/subscription`           |

### Frontend (`.env`)

| Variável                        | Obrigatória | Descrição               | Exemplo                 |
| ------------------------------- | :---------: | ----------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL`           |     ✅      | URL base da API backend | `http://localhost:3333` |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` |     ✅      | Chave pública do Stripe | `pk_test_...`           |

---

## 🔄 Fluxos Principais

### Fluxo de Agendamento

```
  ┌───────────────────────────────────────────────────────────────────┐
  │                        CRIAÇÃO                                    │
  │                                                                   │
  │   POST /schedules                                                 │
  │   { customer, haircut_id }                                        │
  │                                                                   │
  │   1. Valida dados obrigatórios                                    │
  │   2. Cria registro na tabela services                             │
  │   3. Retorna agendamento criado                                   │
  └───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │                      VISUALIZAÇÃO                                 │
  │                                                                   │
  │   GET /schedules                                                  │
  │   → Lista agendamentos em aberto (com dados do corte)            │
  │   → Ordenados por data de criação crescente                      │
  └───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │                      FINALIZAÇÃO                                  │
  │                                                                   │
  │   DELETE /schedules/:schedule_id                                  │
  │                                                                   │
  │   1. Valida que o agendamento pertence ao usuário                 │
  │   2. Remove registro da tabela services                           │
  └───────────────────────────────────────────────────────────────────┘
```

### Fluxo de Assinatura (Stripe)

```
  ┌───────────────────────────────────────────────────────────────────┐
  │                     CHECKOUT                                      │
  │                                                                   │
  │   POST /subscribes (autenticado)                                  │
  │                                                                   │
  │   1. Busca usuário no banco                                       │
  │   2. Se não tem subscription_id → cria customer no Stripe         │
  │   3. Cria checkout session com o price configurado                │
  │   4. Retorna { url } → redirect para checkout Stripe              │
  └───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │                    PAGAMENTO                                      │
  │                                                                   │
  │   Usuário realiza pagamento no Stripe                             │
  │   Stripe envia webhook → POST /webhooks                           │
  │                                                                   │
  │   ┌─────────────────────────────────────────────────┐             │
  │   │             Eventos tratados                    │             │
  │   │                                                 │             │
  │   │   checkout.session.completed → Cria assinatura  │             │
  │   │   subscription.updated → Atualiza status        │             │
  │   │   subscription.deleted → Remove assinatura      │             │
  │   └─────────────────────────────────────────────────┘             │
  └───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │                  GERENCIAMENTO                                    │
  │                                                                   │
  │   POST /create-portal (autenticado)                               │
  │                                                                   │
  │   1. Busca subscription_id do usuário                             │
  │   2. Cria billing portal session no Stripe                        │
  │   3. Retorna { url } → redirect para portal Stripe                │
  └───────────────────────────────────────────────────────────────────┘
```

### Modelo Freemium

```
  ┌─────────────────────────────────┬────────────────────────────────┐
  │        PLANO GRATUITO           │         PLANO PREMIUM          │
  ├─────────────────────────────────┼────────────────────────────────┤
  │ Até 3 modelos de corte          │ Modelos de corte ilimitados    │
  │ Apenas ativar/desativar cortes  │ Editar nome, preço e status    │
  │ Não pode deletar cortes         │ Pode deletar cortes            │
  │ Agendamentos ilimitados         │ Agendamentos ilimitados        │
  │ Perfil editável                 │ Perfil editável                │
  └─────────────────────────────────┴────────────────────────────────┘
```

---

## 📚 Documentação Detalhada

Cada parte do projeto possui documentação aprofundada:

| Documento                                                                | Descrição                                                      |
| ------------------------------------------------------------------------ | -------------------------------------------------------------- |
| [documentation/backend/CONTEXTO.md](documentation/backend/CONTEXTO.md)   | Arquitetura, regras de negócio e convenções do backend         |
| [documentation/backend/ENDPOINTS.md](documentation/backend/ENDPOINTS.md) | Referência completa de todos os endpoints com request/response |
| [documentation/frontend/CONTEXTO.md](documentation/frontend/CONTEXTO.md) | Arquitetura, componentes e práticas do frontend                |
| [backend/README.md](backend/README.md)                                   | Guia de instalação e uso do backend                            |
| [frontend/README.md](frontend/README.md)                                 | Guia de instalação e uso do frontend                           |

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** — veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👤 Autor

**Samuel Gomes da Silva**

- GitHub: [@samuelgomes0309](https://github.com/samuelgomes0309)

---
