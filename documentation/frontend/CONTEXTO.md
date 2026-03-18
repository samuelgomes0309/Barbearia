# 📖 CONTEXTO TÉCNICO — BarberPro Frontend

Documento de referência técnica do frontend do sistema de gestão para barbearias. Descreve a arquitetura, componentes, fluxos, autenticação, tema e convenções do projeto.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Roteamento e Proteção](#-roteamento-e-proteção)
- [Autenticação (AuthContext)](#-autenticação-authcontext)
- [Comunicação com a API](#-comunicação-com-a-api)
- [Páginas da Aplicação](#-páginas-da-aplicação)
- [Componentes Reutilizáveis](#-componentes-reutilizáveis)
- [Tipos TypeScript](#-tipos-typescript)
- [Tema e Estilização](#-tema-e-estilização)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Convenções e Padrões](#-convenções-e-padrões)

---

## 🎯 Visão Geral

O **BarberPro Frontend** é uma aplicação web em Next.js (App Router) que consome a API REST do backend. A interface permite que barbeiros gerenciem seus agendamentos, tipos de cortes, perfil e assinatura premium integrada com Stripe. O sistema implementa SSR com Server Components para carregamento de dados e Client Components para interações do usuário.

### Domínios da aplicação

| Domínio          | Responsabilidade                                                  |
| ---------------- | ----------------------------------------------------------------- |
| **Autenticação** | Cadastro, login, persistência de sessão via cookie e logout       |
| **Dashboard**    | Visualização e gestão dos agendamentos em aberto                  |
| **Cortes**       | CRUD de modelos de corte com controle de limite por plano         |
| **Agendamentos** | Criação de novas entradas na agenda (cliente + tipo de corte)     |
| **Perfil**       | Atualização de nome e endereço do barbeiro                        |
| **Assinatura**   | Checkout Stripe e acesso ao portal de gerenciamento da assinatura |

---

## 🚀 Stack Tecnológica

| Camada       | Tecnologia   | Versão | Papel                                            |
| ------------ | ------------ | ------ | ------------------------------------------------ |
| Framework    | Next.js      | 16.1.1 | App Router, SSR, Server Components e middleware  |
| UI           | React        | 19.2.3 | Renderização de componentes                      |
| Linguagem    | TypeScript   | 5      | Tipagem estática e segurança em desenvolvimento  |
| Componentes  | Chakra UI    | 3.30.0 | Design system com tema customizado               |
| Ícones       | React Icons  | 5.5.0  | Ícones SVG como componentes React                |
| Estilização  | Tailwind CSS | 4      | Classes utilitárias CSS (uso híbrido com Chakra) |
| HTTP         | Axios        | 1.13.2 | Cliente HTTP para chamadas à API backend         |
| Autenticação | Nookies      | 2.5.2  | Gerenciamento de cookies (token JWT)             |
| JWT          | jwt-decode   | 4.0.0  | Decodificação de tokens JWT no cliente           |
| Lint         | ESLint       | 9      | Linter para qualidade e padronização do código   |

---

## 🏗️ Arquitetura

### Visão Geral do Fluxo

```
┌─────────────────────────────────────────────────┐
│               Ação do Usuário                   │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│            middleware.ts (Next.js)              │
│  Verifica cookie do token e aplica redirecionamentos │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│        Server Component (page.tsx)              │
│  Lê cookie, instancia API, busca dados do SSR   │
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

### Estrutura de Camadas

| Camada          | Diretório           | Responsabilidade                                             |
| --------------- | ------------------- | ------------------------------------------------------------ |
| **Middleware**  | `middleware.ts`     | Protege rotas privadas e redireciona visitors autenticados   |
| **Layout**      | `app/layout.tsx`    | Provider global (Chakra, Auth) e estrutura raiz da aplicação |
| **Páginas**     | `app/*/page.tsx`    | Server Components — buscam dados via SSR                     |
| **Clientes**    | `app/*/components/` | Client Components — interatividade e formulários             |
| **Componentes** | `components/`       | Elementos de UI globais reutilizáveis (Sidebar)              |
| **Contexto**    | `contexts/`         | Estado global da aplicação (autenticação)                    |
| **Providers**   | `providers/`        | Agrupa e configura todos os providers da aplicação           |
| **Serviços**    | `services/`         | Instância Axios configurada e factory de clientes da API     |
| **Tipos**       | `@types/`           | Interfaces TypeScript centralizadas                          |

### Padrão Server Component + Client Component

```typescript
// 1. Server Component (page.tsx) — carrega dados com SSR
export default async function Page() {
  const token = (await cookies()).get("@barberpro.token")?.value;
  const apiClient = setupAPIClient({ token });
  const data = await apiClient.get("/endpoint");
  return <PageClient data={data} />;
}

// 2. Client Component (*Client.tsx) — gerencia interatividade
"use client";
export default function PageClient({ data }) {
  const [state, setState] = useState(data);
  // handlers, formulários, modais...
}
```

---

## 🛣️ Roteamento e Proteção

### Middleware (`middleware.ts`)

O middleware do Next.js é executado na borda e aplica as regras de roteamento antes de qualquer renderização.

**Regras de Roteamento:**

| Rota              | Sem Token       | Com Token       |
| ----------------- | --------------- | --------------- |
| `/`               | → `/login`      | → `/dashboard`  |
| `/dashboard/*`    | → `/login`      | Acesso liberado |
| `/schedule/*`     | → `/login`      | Acesso liberado |
| `/subscription/*` | → `/login`      | Acesso liberado |
| `/login`          | Acesso liberado | → `/dashboard`  |
| `/register`       | Acesso liberado | → `/dashboard`  |

**Matcher configurado:**

```typescript
matcher: [
	"/",
	"/dashboard/:path*",
	"/schedule/:path*",
	"/subscription/:path*",
	"/login",
	"/register",
];
```

> **Nota:** As rotas `/haircut` e `/profile` **não estão no matcher** do middleware, portanto a proteção nelas é realizada pelos próprios componentes via `AuthContext`.

### Rotas da Aplicação

| Rota            | Tipo      | Página          | Descrição                            |
| --------------- | --------- | --------------- | ------------------------------------ |
| `/`             | —         | —               | Redireciona para dashboard ou login  |
| `/dashboard`    | Privada   | Dashboard       | Agendamentos em aberto               |
| `/schedule`     | Privada   | Schedule        | Criação de novo agendamento          |
| `/haircut`      | Privada\* | Haircut List    | Lista de tipos de corte              |
| `/haircut/new`  | Privada\* | New Haircut     | Formulário de novo corte             |
| `/haircut/[id]` | Privada\* | Haircut Details | Editar/desativar corte existente     |
| `/profile`      | Privada\* | Profile         | Dados e edição do perfil do barbeiro |
| `/subscription` | Privada   | Subscription    | Gerenciamento de assinatura          |
| `/login`        | Pública   | Login           | Tela de autenticação                 |
| `/register`     | Pública   | Register        | Tela de cadastro                     |

_\* Protegidas via componente, não pelo middleware._

---

## 🔐 Autenticação (AuthContext)

### Visão Geral

O `AuthContext` é o contexto global que gerencia todo o estado de autenticação. Ele é provido pelo `AuthProvider` (em `providers/app.provider.tsx`) e consumido via `useContext(AuthContext)`.

### Interface do Contexto

```typescript
interface AuthContextData {
	user: UserProps;
	isAuthenticated: boolean;
	signIn: ({ email, password }: SignInProps) => Promise<void>;
	signUp: ({ email, name, password }: SignUpProps) => Promise<void>;
	signOut: () => Promise<void>;
	updateUser?: ({ name, address }: UpdateUserProps) => void;
}
```

### Interface do Usuário

```typescript
interface UserProps {
	id: string;
	name: string;
	email: string;
	address: string | null;
	subscriptions?: SubscriptionProps | null;
}
```

### Fluxo Completo de Autenticação

```
1. App carrega → AuthProvider monta
      │
2. useEffect lê cookie "@barberpro.token"
      │
3a. Se não há token → user permanece null
      │
3b. Se há token → GET /me com token no header
      │
4a. Se API aceita → seta user com dados retornados
4b. Se API rejeita → chama signOut() (limpa cookie + redireciona)
      │
5. isAuthenticated = !!user → guards/componentes liberam acesso
```

### Métodos

#### `signIn({ email, password }): Promise<void>`

1. Envia `POST /sessions` com `{ email, password }`
2. Recebe `{ id, name, email, address, token, subscriptions }`
3. Seta `user` no estado, configura header `Authorization` no Axios
4. Salva token no cookie `@barberpro.token` (validade 30 dias)
5. Redireciona para `/dashboard`

#### `signUp({ name, email, password }): Promise<void>`

1. Envia `POST /users` com `{ name, email, password }`
2. Em caso de sucesso, redireciona para `/login`

#### `signOut(): Promise<void>`

1. Remove cookie `@barberpro.token` via `destroyCookie`
2. Seta `user` como `null`
3. Redireciona para `/login`

#### `updateUser({ name, address }): void`

1. Envia `PUT /users` com `{ name, address }`
2. Ignora a requisição se algum campo estiver vazio

### Persistência do Token

| Ação               | Cookie                                                        |
| ------------------ | ------------------------------------------------------------- |
| Login bem-sucedido | `setCookie(null, "@barberpro.token", token, { maxAge: 30d })` |
| Logout             | `destroyCookie(null, "@barberpro.token")`                     |
| Validação ao abrir | `parseCookies()` → `"@barberpro.token"`                       |

---

## 📡 Comunicação com a API

### `setupAPIClient` (`services/api.ts`)

Função factory que cria instâncias configuradas do Axios:

```typescript
setupAPIClient({ context?, token? })
```

- Aceita token diretamente **ou** lê do cookie via `parseCookies(context)`
- Configura `baseURL` a partir de `NEXT_PUBLIC_API_URL`
- Adiciona `Authorization: Bearer {token}` em todas as requisições
- **Interceptor de resposta**: Detecta erro `401` e lança `AuthTokenError`

### Uso em Server Components

```typescript
const token = (await cookies()).get("@barberpro.token")?.value;
const apiClient = setupAPIClient({ token });
const response = await apiClient.get("/endpoint");
```

### Uso em Client Components

```typescript
import { api } from "@/services/apiClient";
const response = await api.post("/endpoint", data);
```

### Chamadas à API por Página

| Página       | Endpoint                    | Método | Contexto           |
| ------------ | --------------------------- | ------ | ------------------ |
| Dashboard    | `GET /schedules`            | GET    | SSR (page.tsx)     |
| Dashboard    | `DELETE /schedules/:id`     | DELETE | Client (modal)     |
| Haircut List | `GET /haircuts`             | GET    | SSR (page.tsx)     |
| Haircut List | `GET /haircuts/check`       | GET    | SSR (page.tsx)     |
| Haircut List | `GET /haircuts/count`       | GET    | SSR (page.tsx)     |
| New Haircut  | `POST /haircuts`            | POST   | Client (form)      |
| Haircut [id] | `GET /haircuts/:id`         | GET    | SSR (page.tsx)     |
| Haircut [id] | `PUT /haircuts`             | PUT    | Client (form)      |
| Haircut [id] | `DELETE /haircuts/:id`      | DELETE | Client (botão)     |
| Schedule     | `GET /haircuts?status=true` | GET    | SSR (page.tsx)     |
| Schedule     | `POST /schedules`           | POST   | Client (form)      |
| Profile      | `GET /me`                   | GET    | SSR (page.tsx)     |
| Profile      | `PUT /users`                | PUT    | Client (form)      |
| Subscription | `POST /subscribes`          | POST   | Client (botão)     |
| Subscription | `POST /create-portal`       | POST   | Client (botão)     |
| AuthContext  | `POST /sessions`            | POST   | Client (signIn)    |
| AuthContext  | `POST /users`               | POST   | Client (signUp)    |
| AuthContext  | `GET /me`                   | GET    | Client (useEffect) |

---

## 📄 Páginas da Aplicação

### Dashboard (`app/dashboard/`)

Página principal. Exibe todos os agendamentos em aberto do barbeiro.

**Carregamento SSR:** Busca `GET /schedules` com token do cookie ao montar.

**Componentes:**
| Componente | Arquivo | Descrição |
| ------------------- | ------------------------- | -------------------------------------------------- |
| `DashboardClient` | `dashboardClient.tsx` | Client Component principal com lista e interações |
| `CardAppointment` | `cardAppointment.tsx` | Card individual de agendamento (cliente + corte) |
| `ModalAppointment` | `modalAppointment.tsx` | Modal com detalhes e ações (finalizar agendamento) |

**Fluxo de finalização:**

```
1. Usuário clica no card → abre ModalAppointment
2. Clica em "Finalizar" → DELETE /schedules/:id
3. Lista é atualizada localmente (remove o item)
```

---

### Cortes (`app/haircut/`)

CRUD completo de modelos de corte com controle de limite por plano.

**Sub-rotas:**

- `/haircut` — Lista todos os cortes (com filtro por status)
- `/haircut/new` — Formulário para criar novo corte
- `/haircut/[id]` — Editar nome/preço/status ou deletar corte

**Regra de limite:**

- **Plano Gratuito:** máximo 3 modelos cadastrados. `GET /haircuts/check` retorna se o limite foi atingido.
- **Plano Premium:** sem limite.

**Edição de cortes:**

- Usuários sem assinatura premium podem apenas alterar o `status` (ativar/desativar)
- Assinantes premium podem editar `name`, `price` e `status`, além de deletar o corte

---

### Agendamentos (`app/schedule/`)

Formulário para criação de novos agendamentos.

**Carregamento SSR:** Busca `GET /haircuts?status=true` para popular o select de cortes.

**Fluxo de criação:**

```
1. Usuário preenche o nome do cliente
2. Seleciona o tipo de corte na lista (somente cortes ativos)
3. Submete o formulário → POST /schedules { customer, haircut_id }
4. Sucesso → redireciona para /dashboard
```

---

### Perfil (`app/profile/`)

Permite ao barbeiro atualizar seus dados pessoais.

**Carregamento SSR:** Busca `GET /me` para preencher o formulário com dados atuais.

**Campos editáveis:** `name` e `address`

---

### Assinatura (`app/subscription/`)

Gerenciamento do plano do barbeiro.

**Plano Gratuito → Checkout:**

```
1. Clica em "Assinar" → POST /subscribes
2. Recebe URL do checkout Stripe
3. Redireciona para a página de pagamento do Stripe
```

**Plano Premium → Portal:**

```
1. Clica em "Gerenciar assinatura" → POST /create-portal
2. Recebe URL do portal do cliente Stripe
3. Redireciona para o portal de gerenciamento
```

---

### Login (`app/login/`)

Formulário de autenticação. Chama `signIn()` do `AuthContext`. Em caso de sucesso, o próprio `signIn` redireciona para `/dashboard`.

---

### Register (`app/register/`)

Formulário de cadastro. Chama `signUp()` do `AuthContext`. Em caso de sucesso, o próprio `signUp` redireciona para `/login`.

---

## 🧩 Componentes Reutilizáveis

### Sidebar (`components/sidebar/`)

Sistema de navegação lateral presente em todas as páginas autenticadas.

| Arquivo              | Descrição                                           |
| -------------------- | --------------------------------------------------- |
| `index.tsx`          | Componente principal — monta Drawer ou sidebar fixa |
| `linkItems.ts`       | Array com itens de navegação (nome, ícone, rota)    |
| `sidebarContent.tsx` | Conteúdo interno da sidebar (logo + links + logout) |
| `navItem.tsx`        | Item individual de navegação com ícone e label      |
| `mobileNav.tsx`      | Barra superior mobile com botão para abrir Drawer   |
| `sidebarDrawer.tsx`  | Drawer deslizante para mobile                       |

**Itens de Navegação:**

| Ícone         | Label   | Rota         |
| ------------- | ------- | ------------ |
| `FiScissors`  | Cortes  | `/haircut`   |
| `FiCalendar`  | Agenda  | `/dashboard` |
| `FiClipboard` | Agendar | `/schedule`  |
| `FiSettings`  | Perfil  | `/profile`   |

**Responsividade:**

- **Mobile (< md):** `MobileNav` exibe barra superior com botão hamburger → abre `SidebarDrawer`
- **Desktop (≥ md):** Sidebar fixa à esquerda (largura 64)

---

## 📦 Tipos TypeScript

Todos os tipos estão centralizados em `src/@types/index.ts`.

### Usuário

```typescript
interface UserProps {
	id: string;
	name: string;
	email: string;
	address: string | null;
	subscriptions?: SubscriptionProps | null;
}
```

### Assinatura

```typescript
interface SubscriptionProps {
	id: string;
	status: string; // "active" | outros status do Stripe
}
```

### Corte

```typescript
interface HaircutProps {
	id: string;
	name: string;
	price: number;
	status: boolean;
	user_id: string;
}
```

### Agendamento

```typescript
interface AppointmentProps {
	id: string;
	customer: string;
	haircut: HaircutProps;
}
```

### Sidebar

```typescript
interface SidebarItemProps {
	name: string;
	icon: IconType;
	route: string;
}
interface NavItemProps {
	icon: IconType;
	children: string;
	route: string;
}
interface MobielNavProps extends FlexProps {
	onopen: () => void;
}
interface SidebarProps extends BoxProps {
	onclose: () => void;
}
```

---

## 🎨 Tema e Estilização

### Sistema de Design (Chakra UI v3)

O tema é configurado em `providers/chakra.system.tsx` com cores customizadas:

```typescript
barber: {
  1000: "#000"      // Preto puro
  900:  "#12131b"   // Background principal
  700:  "#1a1b26"   // Background secundário
  400:  "#1b1c29"   // Background de inputs e cards
  100:  "#c6c6c6"   // Texto cinza claro
}

button: {
  cta:     "#fba931" // Laranja (Call to Action — assinar, confirmar)
  default: "#ffffff" // Branco
  gray:    "#dfdfdf" // Cinza claro
  danger:  "#ff4040" // Vermelho (ações destrutivas — deletar, remover)
}
```

### Responsividade

O layout segue abordagem **mobile-first** com breakpoints do Chakra UI:

| Viewport       | Sidebar                             | Navegação             |
| -------------- | ----------------------------------- | --------------------- |
| Mobile (< md)  | Drawer deslizante (oculta)          | `MobileNav` no topo   |
| Desktop (≥ md) | Coluna fixa à esquerda (largura 64) | Links sempre visíveis |

### Tailwind CSS (uso híbrido)

Tailwind CSS v4 é utilizado para complementar o Chakra UI em situações pontuais onde classes utilitárias são mais práticas. A configuração está em `postcss.config.mjs`.

---

## ⚙️ Variáveis de Ambiente

| Variável                        | Obrigatória | Exemplo                 | Descrição               |
| ------------------------------- | ----------- | ----------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL`           | ✅          | `http://localhost:3333` | URL base da API backend |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | ✅          | `pk_test_...`           | Chave pública do Stripe |

> Variáveis prefixadas com `NEXT_PUBLIC_` são expostas no bundle do cliente.

---

## 📐 Convenções e Padrões

### Nomenclatura

| Contexto                   | Padrão      | Exemplo                                     |
| -------------------------- | ----------- | ------------------------------------------- |
| Componentes React          | PascalCase  | `CardAppointment`, `SidebarContent`         |
| Arquivos de componente     | camelCase   | `cardAppointment.tsx`, `sidebarContent.tsx` |
| Server Component (página)  | `page.tsx`  | `app/dashboard/page.tsx`                    |
| Client Component (prefixo) | camelCase   | `dashboardClient.tsx`, `scheduleClient.tsx` |
| Interfaces                 | PascalCase  | `UserProps`, `HaircutProps`                 |
| Contextos                  | PascalCase  | `AuthContext`                               |
| Variáveis de ambiente      | UPPER_SNAKE | `NEXT_PUBLIC_API_URL`                       |
| Cookie de autenticação     | kebab-case  | `@barberpro.token`                          |

### Estrutura de uma Página Privada

Todas as páginas autenticadas seguem o padrão Server Component + Client Component:

```typescript
// app/exemplo/page.tsx (Server Component)
import { cookies } from "next/headers";
import { setupAPIClient } from "@/services/api";

export default async function ExemploPage() {
  const token = (await cookies()).get("@barberpro.token")?.value;
  const apiClient = setupAPIClient({ token });
  const { data } = await apiClient.get("/endpoint");
  return <ExemploClient data={data} />;
}

// app/exemplo/components/exemploClient.tsx (Client Component)
"use client";
export default function ExemploClient({ data }) {
  // Sidebar + conteúdo interativo
}
```

### Padrão de Layout Autenticado

Todas as páginas privadas incluem a `Sidebar` no layout:

```tsx
<Flex direction={{ base: "column", md: "row" }} h="100vh" bg="barber.900">
	<Sidebar />
	<Box flex={1} p={4}>
		<Header />
		{/* Conteúdo da página */}
	</Box>
</Flex>
```

### Scripts Disponíveis

| Comando         | Descrição                                      |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Inicia o servidor de desenvolvimento (Next.js) |
| `npm run build` | Compila TypeScript e gera build de produção    |
| `npm run start` | Inicia o servidor de produção                  |
| `npm run lint`  | Executa o ESLint em todos os arquivos          |
