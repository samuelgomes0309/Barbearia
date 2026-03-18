# 📖 CONTEXTO TÉCNICO — BarberShop API

Documento de referência técnica do backend do sistema de gestão para barbearias. Descreve a arquitetura, modelagem de dados, regras de negócio, fluxos e convenções do projeto.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Modelagem de Dados](#-modelagem-de-dados)
- [Regras de Negócio](#-regras-de-negócio)
- [Sistema de Autenticação](#-sistema-de-autenticação)
- [Sistema de Assinaturas (Stripe)](#-sistema-de-assinaturas-stripe)
- [Módulos do Sistema](#-módulos-do-sistema)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Convenções e Padrões](#-convenções-e-padrões)

---

## 🎯 Visão Geral

O **BarberShop Backend** é uma API REST para gestão de barbearias. Cada barbeiro (usuário) possui sua conta isolada, com modelos de cortes, agendamentos de clientes e controle de assinatura premium via Stripe. O sistema implementa um modelo freemium — usuários gratuitos têm limite de 3 modelos de corte, enquanto assinantes premium possuem recursos ilimitados e acesso a funcionalidades exclusivas.

### Domínios da aplicação

| Domínio          | Responsabilidade                                                      |
| ---------------- | --------------------------------------------------------------------- |
| **Usuários**     | Cadastro, autenticação, consulta e atualização de perfil              |
| **Cortes**       | CRUD de modelos de corte com controle de limite por plano             |
| **Agendamentos** | Criação, listagem e finalização de atendimentos                       |
| **Assinaturas**  | Checkout Stripe, portal de gerenciamento e sincronização via webhooks |

---

## 🚀 Stack Tecnológica

| Camada         | Tecnologia           | Versão | Papel                                           |
| -------------- | -------------------- | ------ | ----------------------------------------------- |
| Runtime        | Node.js              | 18+    | Ambiente de execução                            |
| Linguagem      | TypeScript           | 5.9    | Tipagem estática e segurança em desenvolvimento |
| Framework HTTP | Express              | 4.19.2 | Roteamento e middlewares                        |
| ORM            | Prisma               | 7      | Acesso ao banco, migrations e client tipado     |
| DB Adapter     | @prisma/adapter-pg   | 7      | Adaptador PostgreSQL nativo para Prisma         |
| Banco de Dados | PostgreSQL           | latest | Persistência relacional                         |
| Autenticação   | jsonwebtoken         | 9.0.3  | Geração e verificação de tokens JWT             |
| Hash de senhas | bcrypt               | 6.0.0  | Criptografia segura de senhas (salt 8)          |
| Pagamentos     | Stripe               | 20.1.2 | Checkout, assinaturas e webhooks                |
| CORS           | cors                 | 2.8.5  | Liberação de origens cruzadas                   |
| Env vars       | dotenv               | 17.2.3 | Carregamento do arquivo `.env`                  |
| Async errors   | express-async-errors | 3.1.1  | Propagação automática de erros em async/await   |
| Console        | colors               | 1.4.0  | Colorização de logs no terminal                 |
| Dev            | ts-node-dev          | 2.0.0  | Hot reload em desenvolvimento                   |

---

## 🏗️ Arquitetura

### Padrão de Camadas

O projeto segue uma arquitetura em camadas bem definida:

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

### Tratamento Global de Erros

Todos os erros de regra de negócio são lançados com `throw new Error("mensagem")` dentro dos Services. O middleware global em `server.ts` os captura e retorna a resposta padronizada:

```typescript
// server.ts
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
	if (error instanceof Error) {
		return res.status(400).json({ error: error.message });
	}
	return res
		.status(500)
		.json({ status: "error", message: "Internal server error." });
});
```

Isso é possível graças ao `express-async-errors`, que intercepta erros lançados em funções `async` e os encaminha para o middleware.

### Tratamento Especial de Body (Webhooks)

O `server.ts` contém uma lógica condicional para parsing do body da requisição: a rota `/webhooks` recebe o body como `raw` (necessário para validação da assinatura Stripe), enquanto todas as demais rotas utilizam `express.json()`.

```typescript
app.use((req, res, next) => {
	if (req.originalUrl === "/webhooks") {
		next();
	} else {
		express.json()(req, res, next);
	}
});
```

---

## 🗄️ Modelagem de Dados

### Diagrama de Relacionamento

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

**Relacionamentos:**

- Um usuário possui zero ou uma assinatura (`1:1` via `user_id` unique)
- Um usuário possui zero ou mais cortes (`1:N`)
- Um usuário possui zero ou mais agendamentos (`1:N`)
- Um corte possui zero ou mais agendamentos (`1:N`)

### Tabela `users`

| Campo             | Tipo      | Constraints      | Descrição                                                    |
| ----------------- | --------- | ---------------- | ------------------------------------------------------------ |
| `id`              | String    | PK, UUID, auto   | Identificador único gerado automaticamente                   |
| `name`            | String    | NOT NULL         | Nome do barbeiro                                             |
| `email`           | String    | NOT NULL, UNIQUE | Email — chave de autenticação                                |
| `password`        | String    | NOT NULL         | Senha armazenada como **hash bcrypt**                        |
| `address`         | String?   | NULLABLE         | Endereço da barbearia (opcional)                             |
| `subscription_id` | String?   | NULLABLE         | ID do customer no Stripe (preenchido na primeira assinatura) |
| `createdAt`       | DateTime? | default now()    | Data de criação do registro                                  |
| `updatedAt`       | DateTime? | @updatedAt       | Data da última atualização                                   |

### Tabela `subscriptions`

| Campo       | Tipo      | Constraints   | Descrição                                         |
| ----------- | --------- | ------------- | ------------------------------------------------- |
| `id`        | String    | PK            | ID da subscription no Stripe                      |
| `status`    | String    | NOT NULL      | Status da assinatura (`active`, `canceled`, etc.) |
| `priceId`   | String    | NOT NULL      | ID do price no Stripe                             |
| `user_id`   | String    | FK, UNIQUE    | Vínculo 1:1 com o usuário                         |
| `createdAt` | DateTime? | default now() | Data de criação do registro                       |
| `updatedAt` | DateTime? | @updatedAt    | Data da última atualização                        |

### Tabela `haircuts`

| Campo       | Tipo      | Constraints            | Descrição                                  |
| ----------- | --------- | ---------------------- | ------------------------------------------ |
| `id`        | String    | PK, UUID, auto         | Identificador único gerado automaticamente |
| `name`      | String    | NOT NULL               | Nome do modelo de corte                    |
| `price`     | Float     | NOT NULL               | Preço do corte                             |
| `status`    | Boolean   | NOT NULL, default true | Se o corte está ativo ou desativado        |
| `user_id`   | String    | FK → users.id          | Vínculo com o barbeiro dono do corte       |
| `createdAt` | DateTime? | default now()          | Data de criação do registro                |
| `updatedAt` | DateTime? | @updatedAt             | Data da última atualização                 |

### Tabela `services` (agendamentos)

| Campo        | Tipo      | Constraints      | Descrição                                  |
| ------------ | --------- | ---------------- | ------------------------------------------ |
| `id`         | String    | PK, UUID, auto   | Identificador único gerado automaticamente |
| `customer`   | String    | NOT NULL         | Nome do cliente agendado                   |
| `haircut_id` | String    | FK → haircuts.id | Modelo de corte escolhido                  |
| `user_id`    | String    | FK → users.id    | Barbeiro responsável pelo agendamento      |
| `createdAt`  | DateTime? | default now()    | Data de criação do registro                |
| `updatedAt`  | DateTime? | @updatedAt       | Data da última atualização                 |

---

## 📐 Regras de Negócio

### Cadastro de Usuário

- Os campos `name`, `email` e `password` são obrigatórios
- O campo `email` deve ser único no sistema
- A senha é hasheada com `bcrypt` antes de ser persistida (salt: 8)
- Não é possível criar dois usuários com o mesmo email

### Atualização de Perfil

- Pelo menos um campo (`name` ou `address`) deve ser fornecido
- Apenas o próprio usuário pode atualizar seus dados (via `user_id` do token)

### Autenticação

- Login realizado com `email` + `password`
- Senha comparada com o hash armazenado via `bcrypt.compare`
- Em caso de email não encontrado ou senha incorreta, a mensagem retornada é sempre a mesma (`"INVALID EMAIL/PASSWORD."`) — isso evita enumeração de usuários
- Token JWT gerado com validade de **30 dias**, assinado com `JWT_SECRET_KEY`
- Payload do token: `{ email, name, sub: user_id }`

### Modelos de Corte

- O nome é obrigatório e o preço deve ser um número positivo
- **Plano Gratuito:** Limite de até **3 modelos** de corte cadastrados
- **Plano Premium:** Sem limite de modelos de corte
- Apenas assinantes premium podem **deletar** cortes
- Usuários sem assinatura podem apenas alterar o `status` (ativar/desativar) de um corte
- Assinantes premium podem alterar `name`, `price` e `status`
- Cortes podem ser listados filtrando por `status` (ativo/inativo)

### Agendamentos

- O nome do cliente (`customer`) e o `haircut_id` são obrigatórios
- Agendamentos são listados em ordem crescente de criação (mais antigos primeiro)
- A listagem retorna os dados do corte vinculado ao agendamento
- "Finalizar" um agendamento significa removê-lo do banco (operação destrutiva)
- O agendamento deve pertencer ao usuário para ser finalizado

### Assinaturas (Stripe)

- Um customer Stripe é criado na primeira vez que o usuário tenta assinar
- O `subscription_id` (customer ID do Stripe) é salvo no campo `subscription_id` da tabela `users`
- Os webhooks do Stripe sincronizam automaticamente o status da assinatura:
  - `checkout.session.completed` → Cria o registro de subscription
  - `customer.subscription.updated` → Atualiza status e preço
  - `customer.subscription.deleted` → Remove o registro de subscription

---

## 🔐 Sistema de Autenticação

### Fluxo Completo

```
1. Cliente: POST /sessions { email, password }
      │
2. SessionUserService: verifica email no banco
      │
3. SessionUserService: compara senha com bcrypt.compare
      │
4. SessionUserService: gera JWT (sub = user_id, exp = 30d)
      │
5. Resposta: { id, name, email, address, token, subscriptions }
      │
6. Próximas requisições: Authorization: Bearer <token>
      │
7. isAuthenticated: verify(token, JWT_SECRET_KEY)
      │
8. isAuthenticated: injeta req.user_id = sub
      │
9. Controller → Service: usa req.user_id para isolar dados
```

### Middleware `isAuthenticated`

Localizado em `src/middlewares/isAuthenticated.ts`. Aplicado em todas as rotas privadas:

```typescript
const { authorization } = req.headers;
if (!authorization) {
	return res.status(401).json({ error: "Unauthorized" });
}

const [, token] = authorization.split(" ");

try {
	const { sub } = jwt.verify(token, authConfig.jwt.secret) as TokenPayload;
	req.user_id = sub;
	return next();
} catch (error) {
	return res.status(401).json({ error: "Unauthorized" });
}
```

A configuração do JWT é centralizada em `src/config/auth.config.ts`:

```typescript
export default {
	jwt: {
		secret: process.env.JWT_SECRET_KEY!,
		expiresIn: "30d" as StringValue,
	},
};
```

A interface `Request` do Express é extendida em `src/@types/express/index.d.ts` para incluir `user_id`:

```typescript
declare namespace Express {
	export interface Request {
		user_id: string;
	}
}
```

---

## 💳 Sistema de Assinaturas (Stripe)

### Fluxo de Assinatura

```
1. Cliente: POST /subscribes (autenticado)
      │
2. SubscribeService: busca usuário no banco
      │
3. Se não tem subscription_id → cria customer no Stripe
      │
4. Cria checkout session no Stripe com o price configurado
      │
5. Retorna { url } para redirect ao checkout do Stripe
      │
6. Usuário completa o pagamento no Stripe
      │
7. Stripe envia webhook → POST /webhooks
      │
8. WebHooksController: valida assinatura do evento
      │
9. saveSubscription: cria/atualiza/deleta registro na tabela subscriptions
```

### Fluxo do Portal de Gerenciamento

```
1. Cliente: POST /create-portal (autenticado)
      │
2. CreatePortalService: busca subscription_id do usuário
      │
3. Cria billing portal session no Stripe
      │
4. Retorna { url } para redirect ao portal Stripe
```

### Eventos Tratados pelo Webhook

| Evento Stripe                   | Ação                                      |
| ------------------------------- | ----------------------------------------- |
| `checkout.session.completed`    | Cria registro na tabela `subscriptions`   |
| `customer.subscription.updated` | Atualiza `status` e `priceId`             |
| `customer.subscription.deleted` | Remove registro da tabela `subscriptions` |

---

## 📦 Módulos do Sistema

### Módulo de Usuários

| Arquivo                    | Responsabilidade                                               |
| -------------------------- | -------------------------------------------------------------- |
| `CreateUserController.ts`  | Extrai `name`, `email`, `password` do body e chama o service   |
| `CreateUserService.ts`     | Valida campos obrigatórios, unicidade de email, hasheia senha  |
| `SessionUserController.ts` | Extrai `email`, `password` do body e chama o service           |
| `SessionUserService.ts`    | Valida credenciais, gera e retorna o token JWT + dados do user |
| `DetailUserController.ts`  | Lê `user_id` do request e chama o service                      |
| `DetailUserService.ts`     | Busca e retorna os dados do usuário com status de assinatura   |
| `UpdateUserController.ts`  | Extrai `name`, `address` do body e chama o service             |
| `UpdateUserService.ts`     | Valida dados e atualiza nome e/ou endereço do usuário          |

### Módulo de Cortes

| Arquivo                          | Responsabilidade                                                   |
| -------------------------------- | ------------------------------------------------------------------ |
| `CreateHaircutController.ts`     | Extrai `name`, `price` do body e chama o service                   |
| `CreateHaircutService.ts`        | Valida dados, verifica limite do plano e cria o corte              |
| `ListHaircutsController.ts`      | Extrai `status` da query e chama o service                         |
| `ListHaircutService.ts`          | Retorna os cortes do usuário filtrados por status                  |
| `UpdateHaircutController.ts`     | Extrai campos do body e chama o service                            |
| `UpdateHaircutService.ts`        | Verifica plano e aplica atualizações conforme permissões           |
| `DeleteHaircutController.ts`     | Extrai `haircut_id` dos params e chama o service                   |
| `DeleteHaircutService.ts`        | Verifica se é premium, valida propriedade e deleta o corte         |
| `DetailHaircutController.ts`     | Extrai `haircut_id` dos params e chama o service                   |
| `DetailHaircutService.ts`        | Retorna os detalhes de um corte específico do usuário              |
| `CheckSubscriptionController.ts` | Chama o service com `user_id`                                      |
| `CheckSubscriptionService.ts`    | Retorna o status da assinatura do usuário                          |
| `CountHaircutController.ts`      | Chama o service com `user_id`                                      |
| `CountHaircutService.ts`         | Retorna contagem de cortes ativos e inativos (consultas paralelas) |

### Módulo de Agendamentos

| Arquivo                       | Responsabilidade                                          |
| ----------------------------- | --------------------------------------------------------- |
| `CreateScheduleController.ts` | Extrai `customer`, `haircut_id` do body e chama o service |
| `CreateScheduleService.ts`    | Valida dados e cria o agendamento                         |
| `ListScheduleController.ts`   | Chama o service com `user_id`                             |
| `ListScheduleService.ts`      | Retorna agendamentos com dados do corte vinculado         |
| `FinishScheduleController.ts` | Extrai `schedule_id` dos params e chama o service         |
| `FinishScheduleService.ts`    | Valida propriedade e remove o agendamento (finaliza)      |

### Módulo de Assinaturas

| Arquivo                     | Responsabilidade                                            |
| --------------------------- | ----------------------------------------------------------- |
| `SubscribeController.ts`    | Chama o service com `user_id`                               |
| `SubscribeService.ts`       | Cria customer Stripe se necessário e gera checkout session  |
| `CreatePortalController.ts` | Chama o service com `user_id`                               |
| `CreatePortalService.ts`    | Gera URL do billing portal do Stripe                        |
| `WebHooksController.ts`     | Valida assinatura Stripe e processa eventos de subscription |

### Utilitários

| Arquivo                       | Responsabilidade                                             |
| ----------------------------- | ------------------------------------------------------------ |
| `utils/stripe.ts`             | Instância global do client Stripe                            |
| `utils/manageSubscription.ts` | Lógica centralizada para criar/atualizar/deletar assinaturas |

---

## ⚙️ Variáveis de Ambiente

| Variável                | Obrigatória | Exemplo                                        | Descrição                                     |
| ----------------------- | ----------- | ---------------------------------------------- | --------------------------------------------- |
| `DATABASE_URL`          | ✅          | `postgresql://user:pass@localhost:5432/barber` | String de conexão com o PostgreSQL            |
| `JWT_SECRET_KEY`        | ✅          | `minha-chave-secreta-256bits`                  | Chave para assinar e verificar tokens JWT     |
| `PORT`                  | ✅          | `3333`                                         | Porta em que o servidor HTTP escuta           |
| `STRIPE_API_KEY`        | ✅          | `sk_test_...`                                  | Chave secreta da API do Stripe                |
| `STRIPE_WEBHOOK_SECRET` | ✅          | `whsec_...`                                    | Secret para validação de webhooks Stripe      |
| `STRIPE_PRICE`          | ✅          | `price_...`                                    | ID do price da assinatura premium             |
| `STRIPE_SUCCESS_URL`    | ✅          | `http://localhost:3000/dashboard`              | URL de redirect após checkout com sucesso     |
| `STRIPE_CANCEL_URL`     | ✅          | `http://localhost:3000/subscription`           | URL de redirect após cancelamento do checkout |

> **Boa prática:** Gere um JWT_SECRET_KEY forte com:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

## 📐 Convenções e Padrões

### Nomenclatura

| Contexto           | Padrão      | Exemplo                            |
| ------------------ | ----------- | ---------------------------------- |
| Classes            | PascalCase  | `CreateUserService`                |
| Arquivos de classe | PascalCase  | `CreateHaircutController.ts`       |
| Arquivos de config | camelCase   | `index.ts`, `auth.config.ts`       |
| Variáveis          | camelCase   | `user_id`, `passwordHash`          |
| Rotas              | kebab-case  | `/haircuts`, `/create-portal`      |
| Env vars           | UPPER_SNAKE | `JWT_SECRET_KEY`, `STRIPE_API_KEY` |

### Mensagens de Erro Padronizadas

| Situação                                    | Mensagem                                                             |
| ------------------------------------------- | -------------------------------------------------------------------- |
| Campos não preenchidos no cadastro          | `"DATA NOT FILLED IN."`                                              |
| Email já cadastrado                         | `"USER/EMAIL ALREADY EXISTS."`                                       |
| Credencial inválida (email ou senha)        | `"INVALID EMAIL/PASSWORD."`                                          |
| Usuário inválido ou não encontrado          | `"INVALID USER."` / `"USER NOT FOUND."`                              |
| Nenhum dado fornecido para atualização      | `"NO DATA PROVIDED FOR UPDATE."`                                     |
| Nome ou preço inválido no corte             | `"INVALID NAME/PRICE."`                                              |
| Preço inválido na atualização               | `"INVALID PRICE."`                                                   |
| Limite do plano gratuito atingido           | `"FREE PLAN LIMIT REACHED. UPGRADE TO PRO TO CREATE MORE HAIRCUTS."` |
| Dados inválidos (genérico)                  | `"INVALID DATA."`                                                    |
| Não autorizado para deletar corte           | `"NOT AUTHORIZED."`                                                  |
| Corte não encontrado                        | `"HAIRCUT NOT FOUND."`                                               |
| Agendamento não encontrado ou sem permissão | `"SCHEDULE NOT FOUND OR NOT AUTHORIZED."`                            |
| Agendamento inválido                        | `"INVALID SCHEDULE DATA."`                                           |
| Usuário não encontrado (assinatura)         | `"USER NOT FOUND."`                                                  |
| Usuário sem assinatura para portal          | `"USER DOES NOT HAVE A SUBSCRIPTION."`                               |
| Token ausente ou inválido                   | `"Unauthorized"` (status 401)                                        |

### Estrutura de um Service

```typescript
class XxxService {
  async execute({ param1, param2 }: XxxRequest) {
    // 1. Validações de entrada
    if (!param1) throw new Error("Mensagem de erro");

    // 2. Consultas ao banco (verificação de permissões/plano se necessário)
    const user = await prismaClient.user.findUnique({ where: { id: user_id }, include: { subscriptions: true } });

    // 3. Regra de negócio (verificação de plano, limites, etc.)
    const isPro = user?.subscriptions?.status === "active";

    // 4. Persistência
    const result = await prismaClient.model.create({ data: { ... } });

    // 5. Retorno
    return result;
  }
}
```

### Verificação de Plano Premium

O padrão para verificar se o usuário é assinante premium é consistente em todo o projeto:

```typescript
const user = await prismaClient.user.findUnique({
	where: { id: user_id },
	include: { subscriptions: true },
});

const isPro = user?.subscriptions?.status === "active";
```

Esse padrão é usado nos services de criação, atualização e exclusão de cortes para aplicar regras específicas de cada plano.
