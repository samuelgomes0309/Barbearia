# 💈 BarberShop — Backend

API REST para gestão de barbearias, com controle de cortes, agendamentos, clientes e assinaturas premium via Stripe.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19.2-000000?style=flat&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-4169E1?style=flat&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-20.1.2-635BFF?style=flat&logo=stripe&logoColor=white)

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
- [Rotas](#-rotas)
- [Serviços e Arquitetura](#-serviços-e-arquitetura)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Documentação](#-documentação)

---

## 🎯 Sobre o Projeto

O **BarberShop Backend** é uma API REST para gestão completa de barbearias. O sistema cobre desde o cadastro e autenticação de barbeiros até o controle detalhado de modelos de corte, agendamentos de clientes e assinaturas premium com integração Stripe.

### Características principais

- ✅ Arquitetura em camadas — Controller → Service → Prisma
- ✅ Autenticação JWT com middleware de proteção de rotas
- ✅ Hashing seguro de senhas com bcrypt
- ✅ Modelo freemium com limite de cortes no plano gratuito
- ✅ Integração completa com Stripe (checkout, portal, webhooks)
- ✅ Tratamento global de erros centralizado no `server.ts`
- ✅ Tratamento especial de body para webhooks Stripe (raw)
- ✅ Prisma com adaptador nativo PostgreSQL (`@prisma/adapter-pg`)

---

## 🚀 Tecnologias

| Categoria           | Tecnologia           | Versão | Descrição                                  |
| ------------------- | -------------------- | ------ | ------------------------------------------ |
| **Core**            | Node.js              | 18+    | Ambiente de execução JavaScript            |
| **Linguagem**       | TypeScript           | 5.9    | Superset JavaScript com tipagem estática   |
| **Framework**       | Express              | 4.19.2 | Framework web minimalista e flexível       |
| **ORM**             | Prisma               | 7      | ORM moderno com migrations e client tipado |
| **Banco**           | PostgreSQL           | latest | Banco de dados relacional                  |
| **Auth**            | jsonwebtoken         | 9.0.3  | Geração e verificação de tokens JWT        |
| **Segurança**       | bcrypt               | 6.0.0  | Hashing seguro de senhas                   |
| **Pagamentos**      | Stripe               | 20.1.2 | Checkout, assinaturas e webhooks           |
| **Utilitários**     | cors                 | 2.8.5  | Liberação de Cross-Origin Resource Sharing |
| **Utilitários**     | dotenv               | 17.2.3 | Carregamento de variáveis de ambiente      |
| **Utilitários**     | express-async-errors | 3.1.1  | Propagação automática de erros assíncronos |
| **Utilitários**     | colors               | 1.4.0  | Colorização de logs no terminal            |
| **Desenvolvimento** | ts-node-dev          | 2.0.0  | Execução de TypeScript com hot reload      |

---

## ⚙️ Funcionalidades

### 🔐 Autenticação

- Registro de novos barbeiros com senha hasheada via bcrypt
- Login com email e senha retornando token JWT (validade: 30 dias)
- Middleware `isAuthenticated` protegendo todas as rotas privadas
- Token enviado no header `Authorization: Bearer <token>`

### 👤 Usuários

- Consulta dos dados do usuário autenticado (com status de assinatura)
- Atualização de perfil (nome e endereço da barbearia)

### ✂️ Cortes

- Criação de modelos de corte com nome e preço
- Listagem com filtro por status (ativo/inativo)
- Detalhes de um corte específico
- Atualização com permissões baseadas no plano:
  - **Gratuito:** Apenas ativar/desativar cortes
  - **Premium:** Alterar nome, preço e status
- Exclusão de cortes (exclusivo premium)
- Contagem de cortes ativos e inativos
- Verificação de status da assinatura
- **Limite:** Até **3 modelos** no plano gratuito, ilimitado no premium

### 📅 Agendamentos

- Criação de agendamento vinculando cliente + modelo de corte
- Listagem com dados do corte vinculado (fila de atendimento)
- Finalização (remoção) de agendamentos concluídos

### 💳 Assinaturas

- Checkout de assinatura premium via Stripe
- Portal de gerenciamento Stripe (cancelar, trocar cartão)
- Webhooks automáticos para sincronização de status

---

## 📁 Estrutura do Projeto

```
backend/
├── prisma/
│   ├── schema.prisma                        # Modelos User, Subscription, Haircut e Service
│   └── migrations/                          # Histórico de migrations SQL
│       ├── migration_lock.toml
│       └── 20251225170653_create_tables/
│
├── src/
│   ├── server.ts                            # Ponto de entrada e middleware global de erros
│   ├── routes.ts                            # Definição de todas as rotas
│   ├── base.ts                              # Template base para controllers e services
│   │
│   ├── @types/
│   │   └── express/
│   │       └── index.d.ts                   # Extensão do Request com user_id
│   │
│   ├── config/
│   │   └── auth.config.ts                   # Configuração do JWT (secret + expiresIn)
│   │
│   ├── controllers/                         # Camada de entrada HTTP
│   │   ├── user/
│   │   │   ├── CreateUserController.ts
│   │   │   ├── SessionUserController.ts
│   │   │   ├── DetailUserController.ts
│   │   │   └── UpdateUserController.ts
│   │   ├── haircut/
│   │   │   ├── CreateHaircutController.ts
│   │   │   ├── ListHaircutsController.ts
│   │   │   ├── UpdateHaircutController.ts
│   │   │   ├── DeleteHaircutController.ts
│   │   │   ├── DetailHaircutController.ts
│   │   │   ├── CheckSubscriptionController.ts
│   │   │   └── CountHaircutController.ts
│   │   ├── schedule/
│   │   │   ├── CreateScheduleController.ts
│   │   │   ├── ListScheduleController.ts
│   │   │   └── FinishScheduleController.ts
│   │   └── subscription/
│   │       ├── SubscribeController.ts
│   │       ├── CreatePortalController.ts
│   │       └── WebHooksController.ts
│   │
│   ├── services/                            # Camada de regras de negócio
│   │   ├── user/
│   │   │   ├── CreateUserService.ts
│   │   │   ├── SessionUserService.ts
│   │   │   ├── DetailUserService.ts
│   │   │   └── UpdateUserService.ts
│   │   ├── haircut/
│   │   │   ├── CreateHaircutService.ts
│   │   │   ├── ListHaircutService.ts
│   │   │   ├── UpdateHaircutService.ts
│   │   │   ├── DeleteHaircutService.ts
│   │   │   ├── DetailHaircutService.ts
│   │   │   ├── CheckSubscriptionService.ts
│   │   │   └── CountHaircutService.ts
│   │   ├── schedule/
│   │   │   ├── CreateScheduleService.ts
│   │   │   ├── ListScheduleService.ts
│   │   │   └── FinishScheduleService.ts
│   │   └── subscriptions/
│   │       ├── SubscribeService.ts
│   │       └── CreatePortalService.ts
│   │
│   ├── middlewares/
│   │   └── isAuthenticated.ts               # Validação do token JWT
│   │
│   ├── prisma/
│   │   └── index.ts                         # Instância global do PrismaClient (com adapter-pg)
│   │
│   ├── utils/
│   │   ├── stripe.ts                        # Instância global do client Stripe
│   │   └── manageSubscription.ts            # Lógica de criar/atualizar/deletar assinaturas
│   │
│   └── generated/
│       └── prisma/                          # Client gerado automaticamente pelo Prisma
│
├── .env                                     # Variáveis de ambiente (git ignored)
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

---

## 📋 Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** ou **yarn**
- **PostgreSQL** rodando localmente ou em nuvem
- **Conta Stripe** com chaves de API configuradas

---

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/samuelgomes0309/barbearia

# Acesse a pasta do projeto
cd backend

# Instale as dependências
npm install
```

---

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# String de conexão com o banco PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Chave secreta para assinar tokens JWT
JWT_SECRET_KEY="sua-chave-secreta-aqui"

# Porta do servidor
PORT=3333

# Stripe
STRIPE_API_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE="price_..."
STRIPE_SUCCESS_URL="http://localhost:3000/dashboard"
STRIPE_CANCEL_URL="http://localhost:3000/subscription"
```

---

## 💻 Execução

```bash
# Inicia o servidor de desenvolvimento com hot reload
npm run dev

# Aplica as migrations e cria as tabelas no banco
npx prisma migrate dev

# Abre o Prisma Studio (interface visual do banco)
npx prisma studio
```

O servidor ficará disponível em **http://localhost:3333**.

---

## 🗺️ Rotas

### Usuários

| Rota        | Método | Protegida | Controller              | Descrição                            |
| ----------- | ------ | --------- | ----------------------- | ------------------------------------ |
| `/users`    | `POST` | ❌        | `CreateUserController`  | Cria um novo barbeiro                |
| `/sessions` | `POST` | ❌        | `SessionUserController` | Autentica e retorna token JWT        |
| `/me`       | `GET`  | ✅        | `DetailUserController`  | Retorna dados do usuário autenticado |
| `/users`    | `PUT`  | ✅        | `UpdateUserController`  | Atualiza perfil (nome/endereço)      |

### Cortes

| Rota                    | Método   | Protegida | Controller                    | Descrição                             |
| ----------------------- | -------- | --------- | ----------------------------- | ------------------------------------- |
| `/haircuts`             | `POST`   | ✅        | `CreateHaircutController`     | Cria novo modelo de corte             |
| `/haircuts`             | `GET`    | ✅        | `ListHaircutsController`      | Lista cortes filtrados por status     |
| `/haircuts/:haircut_id` | `GET`    | ✅        | `DetailHaircutController`     | Retorna detalhes de um corte          |
| `/haircuts`             | `PUT`    | ✅        | `UpdateHaircutController`     | Atualiza corte (permissões por plano) |
| `/haircuts/:haircut_id` | `DELETE` | ✅        | `DeleteHaircutController`     | Remove corte (apenas premium)         |
| `/haircuts/check`       | `GET`    | ✅        | `CheckSubscriptionController` | Verifica status da assinatura         |
| `/haircuts/count`       | `GET`    | ✅        | `CountHaircutController`      | Contagem de cortes ativos e inativos  |

### Agendamentos

| Rota                      | Método   | Protegida | Controller                 | Descrição                             |
| ------------------------- | -------- | --------- | -------------------------- | ------------------------------------- |
| `/schedules`              | `POST`   | ✅        | `CreateScheduleController` | Cria agendamento (cliente + corte)    |
| `/schedules`              | `GET`    | ✅        | `ListScheduleController`   | Lista agendamentos com dados do corte |
| `/schedules/:schedule_id` | `DELETE` | ✅        | `FinishScheduleController` | Finaliza (remove) agendamento         |

### Assinaturas

| Rota             | Método | Protegida | Controller               | Descrição                           |
| ---------------- | ------ | --------- | ------------------------ | ----------------------------------- |
| `/subscribes`    | `POST` | ✅        | `SubscribeController`    | Inicia checkout Stripe              |
| `/create-portal` | `POST` | ✅        | `CreatePortalController` | Gera URL do billing portal Stripe   |
| `/webhooks`      | `POST` | ❌\*      | `WebHooksController`     | Recebe eventos do Stripe (raw body) |

> \* Autenticado via assinatura Stripe, não via JWT.

---

## 🏗️ Serviços e Arquitetura

O fluxo de uma requisição segue sempre o padrão:

```
Request → Router → [isAuthenticated?] → Controller → Service → Prisma (DB)
```

### Services de Usuário

| Service              | Método    | Endpoint         | Descrição                                            |
| -------------------- | --------- | ---------------- | ---------------------------------------------------- |
| `CreateUserService`  | `execute` | `POST /users`    | Valida email único, hasheia a senha e cria o usuário |
| `SessionUserService` | `execute` | `POST /sessions` | Valida credenciais e assina token JWT de 30 dias     |
| `DetailUserService`  | `execute` | `GET /me`        | Busca dados do usuário com status de assinatura      |
| `UpdateUserService`  | `execute` | `PUT /users`     | Atualiza nome e/ou endereço do barbeiro              |

### Services de Corte

| Service                    | Método    | Endpoint               | Descrição                                       |
| -------------------------- | --------- | ---------------------- | ----------------------------------------------- |
| `CreateHaircutService`     | `execute` | `POST /haircuts`       | Verifica limite do plano e cria o corte         |
| `ListHaircutsService`      | `execute` | `GET /haircuts`        | Lista cortes filtrados por status               |
| `DetailHaircutService`     | `execute` | `GET /haircuts/:id`    | Retorna detalhes de um corte específico         |
| `UpdateHaircutService`     | `execute` | `PUT /haircuts`        | Verifica plano e aplica atualizações permitidas |
| `DeleteHaircutService`     | `execute` | `DELETE /haircuts/:id` | Verifica se é premium e deleta o corte          |
| `CheckSubscriptionService` | `execute` | `GET /haircuts/check`  | Retorna status da assinatura do usuário         |
| `CountHaircutService`      | `execute` | `GET /haircuts/count`  | Contagem paralela de cortes ativos e inativos   |

### Services de Agendamento

| Service                 | Método    | Endpoint                | Descrição                                 |
| ----------------------- | --------- | ----------------------- | ----------------------------------------- |
| `CreateScheduleService` | `execute` | `POST /schedules`       | Valida dados e cria o agendamento         |
| `ListScheduleService`   | `execute` | `GET /schedules`        | Lista agendamentos com dados do corte     |
| `FinishScheduleService` | `execute` | `DELETE /schedules/:id` | Valida propriedade e remove o agendamento |

### Services de Assinatura

| Service               | Método    | Endpoint              | Descrição                                              |
| --------------------- | --------- | --------------------- | ------------------------------------------------------ |
| `SubscribeService`    | `execute` | `POST /subscribes`    | Cria customer Stripe se necessário e gera checkout URL |
| `CreatePortalService` | `execute` | `POST /create-portal` | Gera URL do billing portal do Stripe                   |

### Verificação de Plano Premium

```
Plano Gratuito: Até 3 modelos de corte, edição apenas de status
Plano Premium:  Cortes ilimitados, edição completa, permissão para deletar
```

---

## 📜 Scripts Disponíveis

| Comando                     | Descrição                                        |
| --------------------------- | ------------------------------------------------ |
| `npm run dev`               | Inicia o servidor com hot reload (ts-node-dev)   |
| `npx prisma migrate dev`    | Cria e aplica migrations no banco de dados       |
| `npx prisma migrate deploy` | Aplica migrations em ambiente de produção        |
| `npx prisma studio`         | Abre interface visual do banco (localhost:5555)  |
| `npx prisma generate`       | Regenera o Prisma Client após mudanças no schema |

---

## 📚 Documentação

A documentação completa do projeto está na pasta `documentation/backend` na raiz do monorepo:

```
Barbearia/
├── backend/
├── frontend/
└── documentation/
    └── backend/
          ├── ENDPOINTS.md    # Todos os endpoints com exemplos de request/response
          └── CONTEXTO.md     # Arquitetura, modelagem, regras de negócio e convenções
```

| Documento                                                    | Descrição                                                                                                                         |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| **[📡 ENDPOINTS.md](../documentation/backend/ENDPOINTS.md)** | Documentação detalhada de cada endpoint: método, autenticação, body, query params, path params, respostas e erros                 |
| **[📖 CONTEXTO.md](../documentation/backend/CONTEXTO.md)**   | Contexto técnico completo: arquitetura em camadas, modelagem de dados, regras de negócio, fluxo de autenticação, Stripe e padrões |

---

## 📋 Pré-requisitos

- Node.js >= 16
- PostgreSQL instalado e rodando
- Conta no Stripe (modo test)
- Yarn ou npm

---

## ⚙️ Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd backend
```

### 2. Instale as dependências

```bash
yarn install
# ou
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
PORT=3333
DATABASE_URL="postgresql://usuario:senha@localhost:5432/barber?schema=public"
JWT_SECRET_KEY=sua_chave_secreta_aqui
STRIPE_API_KEY=sk_test_sua_chave
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_sua_chave
STRIPE_PRICE=price_seu_price_id
STRIPE_SUCCESS_URL=http://localhost:3000/subscription
STRIPE_CANCEL_URL=http://localhost:3000/subscription
STRIPE_WEBHOOK_SECRET=whsec_sua_chave
```

### 4. Execute as migrations do banco

```bash
npx prisma migrate dev
```

### 5. Inicie o servidor

```bash
yarn dev
```

O servidor estará rodando em `http://localhost:3333` 🎉

---

## 📚 Documentação

- **[ENDPOINTS.md](./ENDPOINTS.md)** - Documentação completa de todos os endpoints
- **[CONTEXT.md](./CONTEXT.md)** - Contexto do projeto e arquitetura

---

## 🗂️ Estrutura do Projeto

```
src/
├── @types/              # Tipos TypeScript customizados
├── config/              # Configurações (JWT, etc)
├── controllers/         # Controladores (recebem requisições)
│   ├── user/           # Usuários
│   ├── haircut/        # Cortes
│   ├── schedule/       # Agendamentos
│   └── subscription/   # Assinaturas
├── services/           # Lógica de negócio
├── middlewares/        # Middlewares (autenticação)
├── prisma/             # Cliente Prisma
├── utils/              # Utilitários
├── routes.ts           # Definição de rotas
└── server.ts           # Servidor Express
```

---

## 🔐 Autenticação

A API usa **JWT (JSON Web Tokens)** para autenticação. Após o login, inclua o token no header:

```bash
Authorization: Bearer seu_token_jwt
```

---

## 💾 Banco de Dados

### Modelos

- **User**: Barbeiros cadastrados
- **Subscription**: Assinaturas premium
- **Haircut**: Modelos de corte
- **Service**: Agendamentos realizados

### Diagrama de Relacionamentos

```
User 1---1 Subscription
User 1---N Haircut
User 1---N Service
Haircut 1---N Service
```

---

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
yarn dev

# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate dev

# Abrir Prisma Studio (visualizar banco)
npx prisma studio

# Formatar código
npx prettier --write .
```

---

## 🌐 Endpoints Principais

### Autenticação

- `POST /users` - Criar conta
- `POST /sessions` - Login
- `GET /me` - Perfil do usuário

### Cortes

- `POST /haircut` - Criar corte
- `GET /haircuts` - Listar cortes
- `PUT /haircut` - Atualizar corte
- `DELETE /haircut/:id` - Deletar corte

### Agendamentos

- `POST /schedule` - Criar agendamento
- `GET /schedules` - Listar agendamentos
- `DELETE /schedule/:id` - Finalizar agendamento

### Assinaturas

- `POST /subscribe` - Criar sessão de checkout
- `POST /create-portal` - Portal de gerenciamento
- `POST /webhooks` - Webhook do Stripe

📖 **[Ver documentação completa](./ENDPOINTS.md)**

---

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ JWT com chave secreta
- ✅ Validação de webhooks do Stripe
- ✅ CORS configurado
- ✅ Tratamento de erros centralizado
- ✅ Variáveis sensíveis em .env

---

## 🚧 Configuração do Stripe

### 1. Crie uma conta no Stripe

Acesse [stripe.com](https://stripe.com) e faça login.

### 2. Obtenha as chaves de API

Em **Developers > API Keys**, copie:

- Publishable key (começa com `pk_test_`)
- Secret key (começa com `sk_test_`)

### 3. Crie um produto e preço

1. Vá em **Products** > **Add Product**
2. Configure o produto (ex: "Plano Premium")
3. Adicione um preço recorrente (ex: R$ 29,90/mês)
4. Copie o Price ID (começa com `price_`)

### 4. Configure o webhook

1. Vá em **Developers > Webhooks** > **Add endpoint**
2. URL: `https://seu-dominio.com/webhooks`
3. Eventos para ouvir:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copie o Signing secret (começa com `whsec_`)

---

## 🐛 Tratamento de Erros

A API retorna erros estruturados:

```json
{
	"error": "Mensagem descritiva do erro"
}
```

### Códigos de Status

- `200` - Sucesso
- `400` - Erro de validação/regra de negócio
- `401` - Não autenticado
- `500` - Erro interno do servidor

---

## 📝 Exemplo de Uso

### 1. Criar um usuário

```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### 2. Fazer login

```bash
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### 3. Criar um corte

```bash
curl -X POST http://localhost:3333/haircut \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "name": "Corte Degradê",
    "price": 35.00
  }'
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

Desenvolvido com 💙 para facilitar a gestão de barbearias.

---

## 📞 Suporte

Para dúvidas ou problemas:

- Consulte a [documentação de endpoints](./ENDPOINTS.md)
- Consulte o [contexto do projeto](./CONTEXT.md)
- Abra uma issue no repositório

---
