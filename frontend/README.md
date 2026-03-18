# ✂️ BarberPro — Frontend

Interface web para gestão completa de barbearias, com dashboard de agendamentos, controle de cortes, perfil do barbeiro e assinatura premium integrada com Stripe.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Chakra UI](https://img.shields.io/badge/Chakra%20UI-3.30.0-319795?style=flat&logo=chakraui&logoColor=white)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Execução](#-execução)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Arquitetura e Padrões](#-arquitetura-e-padrões)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Documentação](#-documentação)

---

## 🎯 Sobre o Projeto

O **BarberPro Frontend** é uma aplicação web em Next.js (App Router) que consome a API REST do backend para oferecer gestão completa de barbearias. Desde o cadastro e login até o controle de agendamentos, tipos de cortes e assinatura premium — tudo numa interface responsiva com tema escuro profissional.

### Características principais

- ✅ Arquitetura Next.js com Server Components + Client Components
- ✅ Autenticação JWT com token em cookie (30 dias) e middleware de proteção
- ✅ Gerenciamento de estado global com Context API (AuthContext)
- ✅ Dashboard com listagem e finalização de agendamentos em cards
- ✅ CRUD completo de tipos de cortes com controle de limite por plano
- ✅ Sistema de assinaturas premium integrado com Stripe (checkout e portal)
- ✅ Layout responsivo: Sidebar fixa no desktop, Drawer deslizante no mobile
- ✅ Tema escuro profissional com Chakra UI v3 customizado

---

## 🚀 Tecnologias

| Categoria       | Tecnologia   | Versão | Descrição                                       |
| --------------- | ------------ | ------ | ----------------------------------------------- |
| **Framework**   | Next.js      | 16.1.1 | App Router, SSR, Server Components e middleware |
| **UI**          | React        | 19.2.3 | Biblioteca para construção de interfaces        |
| **Linguagem**   | TypeScript   | 5      | Superset JavaScript com tipagem estática        |
| **Componentes** | Chakra UI    | 3.30.0 | Design system com tema escuro customizado       |
| **Ícones**      | React Icons  | 5.5.0  | Biblioteca de ícones SVG                        |
| **Estilização** | Tailwind CSS | 4      | Framework CSS utility-first (uso híbrido)       |
| **HTTP**        | Axios        | 1.13.2 | Cliente HTTP para comunicação com a API         |
| **Cookies**     | Nookies      | 2.5.2  | Gerenciamento de cookies (token JWT)            |
| **JWT**         | jwt-decode   | 4.0.0  | Decodificação de tokens JWT no cliente          |
| **Pagamentos**  | Stripe       | —      | Gateway de pagamento para assinaturas premium   |
| **Lint**        | ESLint       | 9      | Linter para qualidade do código                 |

---

## ⚙️ Funcionalidades

### 🔐 Autenticação

- Cadastro de novos barbeiros com validação de campos
- Login com email e senha retornando token JWT
- Validação automática de sessão ao carregar a aplicação (`GET /me`)
- Logout com remoção do cookie `@barberpro.token`
- Rotas protegidas via Middleware do Next.js com redirecionamento automático

### 📅 Dashboard (Agenda)

- Listagem de todos os agendamentos em aberto em cards visuais
- Modal de detalhes com informações do cliente e tipo de corte
- Finalização de atendimento com remoção do agendamento
- Dados carregados via SSR (Server Component)

### ✂️ Gerenciamento de Cortes

- Listagem de tipos de corte com filtro por status (ativo/inativo)
- Cadastro de novo tipo de corte (nome e preço)
- Edição de corte existente (nome, preço e status)
- Exclusão de corte (apenas assinantes premium)
- Controle de limite: plano gratuito suporta até 3 modelos

### 📋 Agendamentos

- Formulário para criar novo agendamento (cliente + tipo de corte)
- Seleção de corte a partir dos modelos ativos do barbeiro

### 👤 Perfil

- Visualização e edição de nome e endereço do barbeiro
- Exibição do plano ativo

### 💳 Assinatura Premium

- Comparativo visual entre os planos gratuito e premium
- Checkout Stripe para upgrade para o plano premium
- Portal do cliente Stripe para gerenciamento da assinatura ativa

---

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── @types/
│   │   └── index.ts                         # Interfaces TypeScript centralizadas
│   │
│   ├── app/                                 # App Router — páginas e layouts
│   │   ├── globals.css                      # Estilos globais
│   │   ├── layout.tsx                       # Layout raiz com providers
│   │   ├── page.tsx                         # Redireciona para /dashboard ou /login
│   │   │
│   │   ├── dashboard/                       # 📅 Agenda — agendamentos em aberto
│   │   │   ├── page.tsx                     # Server Component (SSR /schedules)
│   │   │   └── components/
│   │   │       ├── cardAppointment.tsx      # Card visual de cada agendamento
│   │   │       ├── dashboardClient.tsx      # Client Component principal
│   │   │       └── modalAppointment.tsx     # Modal com detalhes e finalização
│   │   │
│   │   ├── haircut/                         # ✂️ Gerenciamento de cortes
│   │   │   ├── page.tsx                     # Lista de cortes (SSR)
│   │   │   ├── new/page.tsx                 # Formulário de novo corte
│   │   │   ├── [id]/page.tsx                # Editar/desativar corte (SSR)
│   │   │   └── components/
│   │   │       ├── cardHaircut.tsx
│   │   │       ├── haircutClient.tsx
│   │   │       ├── haircutDetailsClient.tsx
│   │   │       └── newHaircutClient.tsx
│   │   │
│   │   ├── schedule/                        # 📋 Criar agendamento
│   │   │   ├── page.tsx                     # Server Component (SSR /haircuts)
│   │   │   └── components/
│   │   │       └── scheduleClient.tsx
│   │   │
│   │   ├── profile/                         # 👤 Perfil do barbeiro
│   │   │   ├── page.tsx                     # Server Component (SSR /me)
│   │   │   └── components/
│   │   │       └── profileClient.tsx
│   │   │
│   │   ├── subscription/                    # 💳 Assinatura premium
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       └── subscriptionClient.tsx
│   │   │
│   │   ├── login/                           # 🔐 Autenticação
│   │   │   └── page.tsx
│   │   │
│   │   └── register/                        # ✍️ Cadastro
│   │       └── page.tsx
│   │
│   ├── components/                          # Componentes globais reutilizáveis
│   │   └── sidebar/
│   │       ├── index.tsx                    # Sidebar principal
│   │       ├── linkItems.ts                 # Lista de itens de navegação
│   │       ├── sidebarContent.tsx           # Conteúdo interno da sidebar
│   │       ├── navItem.tsx                  # Item de link individual
│   │       ├── mobileNav.tsx                # Barra superior para mobile
│   │       └── sidebarDrawer.tsx            # Drawer deslizante para mobile
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx                  # Estado global de autenticação
│   │
│   ├── providers/
│   │   ├── app.provider.tsx                 # Provider principal (agrupa todos)
│   │   └── chakra.system.tsx                # Configuração e tema do Chakra UI
│   │
│   ├── services/
│   │   ├── api.ts                           # Factory setupAPIClient (Axios)
│   │   ├── apiClient.ts                     # Instância padrão da API
│   │   └── errors/
│   │       └── AuthTokenError.ts            # Erro customizado de autenticação
│   │
│   └── middleware.ts                        # Middleware de proteção de rotas
│
├── public/                                  # Assets estáticos
│   └── images/
├── .env.example                             # Modelo de variáveis de ambiente
├── package.json                             # Dependências e scripts
├── next.config.ts                           # Configuração do Next.js
├── tsconfig.json                            # Configuração do TypeScript
├── postcss.config.mjs                       # Configuração do PostCSS (Tailwind)
├── eslint.config.mjs                        # Configuração do ESLint
└── README.md
```

---

## 📋 Pré-requisitos

- **Node.js** 20.x ou superior
- **npm**, **yarn**, **pnpm** ou **bun**
- **Backend do BarberPro** rodando (API em `http://localhost:3333`)

---

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/barbearia

# Acesse a pasta do frontend
cd frontend

# Instale as dependências
npm install
```

---

## ⚙️ Configuração

Crie um arquivo `.env.local` na raiz do frontend (ou copie o `.env.example`):

```env
# URL da API Backend
NEXT_PUBLIC_API_URL=http://localhost:3333

# Chave Pública do Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_sua_chave_publica_aqui
```

> **Nota:** Variáveis prefixadas com `NEXT_PUBLIC_` são expostas no bundle do cliente. Consulte [.env.example](./.env.example) para mais detalhes.

---

## 💻 Execução

```bash
# Inicia o servidor de desenvolvimento com hot reload
npm run dev

# Build de produção
npm run build

# Inicia o servidor de produção (após build)
npm run start
```

A aplicação estará disponível em **http://localhost:3000**.

---

## 🗺️ Rotas da Aplicação

| Rota            | Guard   | Página          | Descrição                                 |
| --------------- | ------- | --------------- | ----------------------------------------- |
| `/`             | —       | —               | Redireciona para `/dashboard` ou `/login` |
| `/dashboard`    | Private | Dashboard       | Agendamentos em aberto do barbeiro        |
| `/schedule`     | Private | Schedule        | Formulário de criação de agendamento      |
| `/haircut`      | Private | Haircut List    | Lista de tipos de corte cadastrados       |
| `/haircut/new`  | Private | New Haircut     | Formulário para novo tipo de corte        |
| `/haircut/[id]` | Private | Haircut Details | Editar ou desativar um corte existente    |
| `/profile`      | Private | Profile         | Edição de dados do barbeiro               |
| `/subscription` | Private | Subscription    | Gerenciamento de assinatura premium       |
| `/login`        | Public  | Login           | Tela de autenticação                      |
| `/register`     | Public  | Register        | Tela de cadastro                          |

- **Private**: redireciona para `/login` se o usuário não estiver autenticado
- **Public**: redireciona para `/dashboard` se o usuário já estiver autenticado

---

## 🏗️ Arquitetura e Padrões

### Fluxo de uma Requisição

```
Ação do Usuário → Middleware (Next.js) → Server Component (SSR) → Client Component → API (Axios) → Backend REST → Atualiza Estado → Re-render
```

### Gerenciamento de Estado

| Escopo       | Solução                   | Uso                                           |
| ------------ | ------------------------- | --------------------------------------------- |
| **Global**   | Context API (AuthContext) | Dados do usuário, signIn, signOut, updateUser |
| **Local**    | useState                  | Modais, loading, formulários, dados de página |
| **Servidor** | Server Components (SSR)   | Busca inicial de dados protegida por token    |

### Autenticação

O sistema utiliza JWT armazenado em cookie via `nookies`:

- **Token armazenado** em cookie `@barberpro.token` (validade 30 dias)
- **Middleware** do Next.js protege rotas privadas antes da renderização
- **Interceptor Axios** detecta erros `401` e lança `AuthTokenError`
- **Server Components** leem o cookie para chamadas SSR autenticadas

### Design Escuro (Chakra UI)

```typescript
barber: {
  1000: "#000"      // Preto puro
  900:  "#12131b"   // Background principal
  700:  "#1a1b26"   // Background secundário
  400:  "#1b1c29"   // Cards e inputs
  100:  "#c6c6c6"   // Texto cinza claro
}

button: {
  cta:     "#fba931" // Laranja (CTA — assinar, confirmar)
  default: "#ffffff" // Branco
  gray:    "#dfdfdf" // Cinza claro
  danger:  "#ff4040" // Vermelho (deletar, remover)
}
```

### Layout

O layout das páginas autenticadas segue o padrão: **Sidebar + Conteúdo**.

- **Mobile (< md)**: `MobileNav` no topo com botão hamburger → abre `SidebarDrawer`
- **Desktop (≥ md)**: Sidebar fixa à esquerda (largura 64), conteúdo à direita

---

## 📜 Scripts Disponíveis

| Comando         | Descrição                                      |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Inicia o servidor de desenvolvimento (Next.js) |
| `npm run build` | Compila TypeScript e gera build de produção    |
| `npm run start` | Serve a build de produção                      |
| `npm run lint`  | Executa o ESLint em todos os arquivos          |

---

## 📚 Documentação

A documentação completa do projeto está na pasta `documentation/` na raiz do monorepo:

```
Barbearia/
├── backend/
├── frontend/
└── documentation/
    ├── backend/
    │   ├── ENDPOINTS.md
    │   └── CONTEXTO.md
    └── frontend/
        └── CONTEXTO.md
```

| Documento                                                              | Descrição                                                                                     |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **[📖 CONTEXTO.md (Frontend)](../documentation/frontend/CONTEXTO.md)** | Arquitetura, componentes, fluxos, tema, tipos e convenções do frontend                        |
| **[📖 CONTEXTO.md (Backend)](../documentation/backend/CONTEXTO.md)**   | Arquitetura em camadas, modelagem de dados, regras de negócio e padrões do backend            |
| **[📡 ENDPOINTS.md](../documentation/backend/ENDPOINTS.md)**           | Documentação detalhada de cada endpoint da API: método, body, query params, respostas e erros |
