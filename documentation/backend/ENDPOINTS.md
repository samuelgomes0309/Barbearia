# 📡 ENDPOINTS — BarberShop API

Documentação completa de todos os endpoints da API REST do sistema de gestão para barbearias.

> **Base URL:** `http://localhost:3333`
> **Autenticação:** JWT via header `Authorization: Bearer <token>`

---

## 📋 Índice

- [Usuários](#-usuários)
  - [POST /users](#post-users)
  - [POST /sessions](#post-sessions)
  - [GET /me](#get-me)
  - [PUT /users](#put-users)
- [Cortes](#-cortes)
  - [POST /haircuts](#post-haircuts)
  - [GET /haircuts](#get-haircuts)
  - [GET /haircuts/:haircut_id](#get-haircutshaircut_id)
  - [PUT /haircuts](#put-haircuts)
  - [DELETE /haircuts/:haircut_id](#delete-haircutshaircut_id)
  - [GET /haircuts/check](#get-haircutscheck)
  - [GET /haircuts/count](#get-haircutscount)
- [Agendamentos](#-agendamentos)
  - [POST /schedules](#post-schedules)
  - [GET /schedules](#get-schedules)
  - [DELETE /schedules/:schedule_id](#delete-schedulesschedule_id)
- [Assinaturas](#-assinaturas)
  - [POST /subscribes](#post-subscribes)
  - [POST /create-portal](#post-create-portal)
  - [POST /webhooks](#post-webhooks)
- [Códigos de Status](#-códigos-de-status)

---

## 👤 Usuários

---

### POST /users

Cria um novo usuário (barbeiro) no sistema.

- **Autenticação:** ❌ Não requerida
- **Controller:** `CreateUserController`
- **Service:** `CreateUserService`

#### Request Body

```json
{
	"name": "João Barbeiro",
	"email": "joao@example.com",
	"password": "senha123"
}
```

| Campo      | Tipo   | Obrigatório | Descrição             |
| ---------- | ------ | ----------- | --------------------- |
| `name`     | string | ✅          | Nome do barbeiro      |
| `email`    | string | ✅          | Email único           |
| `password` | string | ✅          | Senha (será hasheada) |

#### Response — 200 OK

```json
{
	"id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
	"name": "João Barbeiro",
	"email": "joao@example.com",
	"address": null
}
```

#### Erros

| Status | Mensagem                       | Causa                               |
| ------ | ------------------------------ | ----------------------------------- |
| `400`  | `"DATA NOT FILLED IN."`        | Algum campo obrigatório não enviado |
| `400`  | `"USER/EMAIL ALREADY EXISTS."` | Email já cadastrado no sistema      |

---

### POST /sessions

Autentica um usuário e retorna um token JWT.

- **Autenticação:** ❌ Não requerida
- **Controller:** `SessionUserController`
- **Service:** `SessionUserService`

#### Request Body

```json
{
	"email": "joao@example.com",
	"password": "senha123"
}
```

| Campo      | Tipo   | Obrigatório | Descrição        |
| ---------- | ------ | ----------- | ---------------- |
| `email`    | string | ✅          | Email do usuário |
| `password` | string | ✅          | Senha do usuário |

#### Response — 200 OK

```json
{
	"id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
	"name": "João Barbeiro",
	"email": "joao@example.com",
	"address": "Rua das Flores, 123",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"subscriptions": {
		"id": "sub_1234567890",
		"status": "active"
	}
}
```

| Campo           | Tipo        | Descrição                                     |
| --------------- | ----------- | --------------------------------------------- |
| `id`            | string      | UUID do usuário                               |
| `name`          | string      | Nome do usuário                               |
| `email`         | string      | Email do usuário                              |
| `address`       | string/null | Endereço da barbearia                         |
| `token`         | string      | JWT com validade de **30 dias**               |
| `subscriptions` | object/null | Dados da assinatura (`id` e `status`) ou null |

#### Erros

| Status | Mensagem                    | Causa                                                        |
| ------ | --------------------------- | ------------------------------------------------------------ |
| `400`  | `"INVALID EMAIL/PASSWORD."` | Campos não enviados, email não encontrado ou senha incorreta |

---

### GET /me

Retorna os dados do usuário atualmente autenticado.

- **Autenticação:** ✅ Requerida
- **Controller:** `DetailUserController`
- **Service:** `DetailUserService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response — 200 OK

```json
{
	"id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
	"name": "João Barbeiro",
	"email": "joao@example.com",
	"address": "Rua das Flores, 123",
	"subscriptions": {
		"id": "sub_1234567890",
		"status": "active"
	}
}
```

| Campo           | Tipo        | Descrição                                     |
| --------------- | ----------- | --------------------------------------------- |
| `id`            | string      | UUID do usuário                               |
| `name`          | string      | Nome do usuário                               |
| `email`         | string      | Email do usuário                              |
| `address`       | string/null | Endereço da barbearia                         |
| `subscriptions` | object/null | Dados da assinatura (`id` e `status`) ou null |

#### Erros

| Status | Mensagem          | Causa                           |
| ------ | ----------------- | ------------------------------- |
| `401`  | `"Unauthorized"`  | Token inválido ou não enviado   |
| `400`  | `"INVALID USER."` | Usuário não encontrado no banco |

---

### PUT /users

Atualiza os dados do perfil do usuário autenticado.

- **Autenticação:** ✅ Requerida
- **Controller:** `UpdateUserController`
- **Service:** `UpdateUserService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Request Body

```json
{
	"name": "João da Silva",
	"address": "Rua Nova, 456"
}
```

| Campo     | Tipo   | Obrigatório | Descrição                  |
| --------- | ------ | ----------- | -------------------------- |
| `name`    | string | ❌\*        | Novo nome do usuário       |
| `address` | string | ❌\*        | Novo endereço da barbearia |

> \* Pelo menos um dos campos deve ser fornecido.

#### Response — 200 OK

```json
{
	"id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
	"name": "João da Silva",
	"email": "joao@example.com",
	"address": "Rua Nova, 456"
}
```

#### Erros

| Status | Mensagem                         | Causa                                   |
| ------ | -------------------------------- | --------------------------------------- |
| `401`  | `"Unauthorized"`                 | Token inválido ou não enviado           |
| `400`  | `"NO DATA PROVIDED FOR UPDATE."` | Nenhum campo (`name`/`address`) enviado |
| `400`  | `"USER NOT FOUND."`              | Usuário do token não existe no banco    |
| `400`  | `"ERROR UPDATING USER."`         | Erro inesperado na atualização          |

---

## ✂️ Cortes

---

### POST /haircuts

Cria um novo modelo de corte para o barbeiro autenticado.

- **Autenticação:** ✅ Requerida
- **Controller:** `CreateHaircutController`
- **Service:** `CreateHaircutService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Request Body

```json
{
	"name": "Degradê",
	"price": 45.0
}
```

| Campo   | Tipo          | Obrigatório | Descrição                 |
| ------- | ------------- | ----------- | ------------------------- |
| `name`  | string        | ✅          | Nome do modelo de corte   |
| `price` | number/string | ✅          | Preço do corte (positivo) |

#### Response — 200 OK

```json
{
	"id": "uuid-do-corte",
	"name": "Degradê",
	"price": 45.0,
	"status": true,
	"user_id": "uuid-do-usuario",
	"createdAt": "2026-03-17T10:00:00.000Z",
	"updatedAt": "2026-03-17T10:00:00.000Z"
}
```

> **Nota:** Usuários do plano gratuito podem cadastrar no máximo **3 modelos** de corte. Assinantes premium não possuem limite.

#### Erros

| Status | Mensagem                                                             | Causa                                       |
| ------ | -------------------------------------------------------------------- | ------------------------------------------- |
| `401`  | `"Unauthorized"`                                                     | Token inválido ou não enviado               |
| `400`  | `"INVALID NAME/PRICE."`                                              | Nome vazio, preço ausente, zero ou negativo |
| `400`  | `"FREE PLAN LIMIT REACHED. UPGRADE TO PRO TO CREATE MORE HAIRCUTS."` | Plano gratuito com 3+ cortes cadastrados    |

---

### GET /haircuts

Lista os modelos de corte do barbeiro autenticado, filtrados por status.

- **Autenticação:** ✅ Requerida
- **Controller:** `ListHaircutsController`
- **Service:** `ListHaircutsService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Query Parameters

| Parâmetro | Tipo   | Obrigatório | Padrão | Descrição                                     |
| --------- | ------ | ----------- | ------ | --------------------------------------------- |
| `status`  | string | ❌          | `true` | `"true"` para ativos, `"false"` para inativos |

#### Exemplo de Requisição

```
GET /haircuts?status=true
```

#### Response — 200 OK

```json
[
	{
		"id": "uuid-do-corte-1",
		"name": "Degradê",
		"price": 45.0,
		"status": true,
		"user_id": "uuid-do-usuario",
		"createdAt": "2026-03-17T10:00:00.000Z",
		"updatedAt": "2026-03-17T10:00:00.000Z"
	},
	{
		"id": "uuid-do-corte-2",
		"name": "Social",
		"price": 35.0,
		"status": true,
		"user_id": "uuid-do-usuario",
		"createdAt": "2026-03-16T10:00:00.000Z",
		"updatedAt": "2026-03-16T10:00:00.000Z"
	}
]
```

> Ordenado alfabeticamente por `name` em ordem crescente (A-Z).

#### Erros

| Status | Mensagem         | Causa                         |
| ------ | ---------------- | ----------------------------- |
| `401`  | `"Unauthorized"` | Token inválido ou não enviado |

---

### GET /haircuts/:haircut_id

Retorna os detalhes de um modelo de corte específico.

- **Autenticação:** ✅ Requerida
- **Controller:** `DetailHaircutController`
- **Service:** `DetailHaircutService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Path Parameters

| Parâmetro    | Tipo   | Obrigatório | Descrição               |
| ------------ | ------ | ----------- | ----------------------- |
| `haircut_id` | string | ✅          | UUID do modelo de corte |

#### Exemplo de Requisição

```
GET /haircuts/uuid-do-corte
```

#### Response — 200 OK

```json
{
	"id": "uuid-do-corte",
	"name": "Degradê",
	"price": 45.0,
	"status": true,
	"user_id": "uuid-do-usuario",
	"createdAt": "2026-03-17T10:00:00.000Z",
	"updatedAt": "2026-03-17T10:00:00.000Z"
}
```

> Retorna `null` se o corte não for encontrado ou não pertencer ao usuário.

#### Erros

| Status | Mensagem          | Causa                         |
| ------ | ----------------- | ----------------------------- |
| `401`  | `"Unauthorized"`  | Token inválido ou não enviado |
| `400`  | `"INVALID DATA."` | `haircut_id` não fornecido    |

---

### PUT /haircuts

Atualiza um modelo de corte existente. As permissões variam conforme o plano:

- **Plano Premium:** Pode alterar `name`, `price` e `status`
- **Plano Gratuito:** Pode alterar apenas `status`

---

- **Autenticação:** ✅ Requerida
- **Controller:** `UpdateHaircutController`
- **Service:** `UpdateHaircutService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Request Body

```json
{
	"haircut_id": "uuid-do-corte",
	"name": "Degradê Premium",
	"price": 55.0,
	"status": true
}
```

| Campo        | Tipo          | Obrigatório | Descrição                                      |
| ------------ | ------------- | ----------- | ---------------------------------------------- |
| `haircut_id` | string        | ✅          | UUID do corte a ser atualizado                 |
| `name`       | string        | ❌          | Novo nome (apenas Premium)                     |
| `price`      | number/string | ❌          | Novo preço (apenas Premium, deve ser positivo) |
| `status`     | boolean       | ❌          | Ativar/desativar corte (todos os planos)       |

#### Response — 200 OK (Premium)

```json
{
	"id": "uuid-do-corte",
	"name": "Degradê Premium",
	"price": 55.0,
	"status": true,
	"user_id": "uuid-do-usuario",
	"createdAt": "2026-03-17T10:00:00.000Z",
	"updatedAt": "2026-03-17T12:00:00.000Z"
}
```

#### Response — 200 OK (Gratuito)

```json
{
	"id": "uuid-do-corte",
	"name": "Degradê",
	"price": 45.0,
	"status": false,
	"user_id": "uuid-do-usuario",
	"createdAt": "2026-03-17T10:00:00.000Z",
	"updatedAt": "2026-03-17T12:00:00.000Z"
}
```

> No plano gratuito, apenas o campo `status` é considerado na atualização.

#### Erros

| Status | Mensagem            | Causa                                      |
| ------ | ------------------- | ------------------------------------------ |
| `401`  | `"Unauthorized"`    | Token inválido ou não enviado              |
| `400`  | `"INVALID DATA."`   | `haircut_id` não fornecido                 |
| `400`  | `"USER NOT FOUND."` | Usuário do token não existe no banco       |
| `400`  | `"INVALID PRICE."`  | Preço inválido, zero ou negativo (Premium) |

---

### DELETE /haircuts/:haircut_id

Remove um modelo de corte. **Exclusivo para assinantes premium.**

- **Autenticação:** ✅ Requerida
- **Controller:** `DeleteHaircutController`
- **Service:** `DeleteHaircutService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Path Parameters

| Parâmetro    | Tipo   | Obrigatório | Descrição                         |
| ------------ | ------ | ----------- | --------------------------------- |
| `haircut_id` | string | ✅          | UUID do modelo de corte a remover |

#### Exemplo de Requisição

```
DELETE /haircuts/uuid-do-corte
```

#### Response — 200 OK

```json
{
	"message": "Haircut deleted successfully"
}
```

#### Erros

| Status | Mensagem               | Causa                                       |
| ------ | ---------------------- | ------------------------------------------- |
| `401`  | `"Unauthorized"`       | Token inválido ou não enviado               |
| `400`  | `"INVALID DATA."`      | `haircut_id` não fornecido                  |
| `400`  | `"NOT AUTHORIZED."`    | Usuário não é premium (assinatura inativa)  |
| `400`  | `"HAIRCUT NOT FOUND."` | Corte não existe ou não pertence ao usuário |

---

### GET /haircuts/check

Verifica o status da assinatura do usuário autenticado.

- **Autenticação:** ✅ Requerida
- **Controller:** `CheckSubscriptionController`
- **Service:** `CheckSubscriptionService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response — 200 OK (com assinatura)

```json
{
	"subscriptions": {
		"id": "sub_1234567890",
		"status": "active"
	}
}
```

#### Response — 200 OK (sem assinatura)

```json
{
	"subscriptions": null
}
```

#### Erros

| Status | Mensagem         | Causa                         |
| ------ | ---------------- | ----------------------------- |
| `401`  | `"Unauthorized"` | Token inválido ou não enviado |

---

### GET /haircuts/count

Retorna a contagem de modelos de corte ativos e inativos do barbeiro.

- **Autenticação:** ✅ Requerida
- **Controller:** `CountHaircutController`
- **Service:** `CountHaircutService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response — 200 OK

```json
{
	"Actives": {
		"count": 5
	},
	"Inactives": {
		"count": 2
	}
}
```

| Campo             | Tipo   | Descrição                     |
| ----------------- | ------ | ----------------------------- |
| `Actives.count`   | number | Quantidade de cortes ativos   |
| `Inactives.count` | number | Quantidade de cortes inativos |

#### Erros

| Status | Mensagem         | Causa                         |
| ------ | ---------------- | ----------------------------- |
| `401`  | `"Unauthorized"` | Token inválido ou não enviado |

---

## 📅 Agendamentos

---

### POST /schedules

Cria um novo agendamento vinculando um cliente a um modelo de corte.

- **Autenticação:** ✅ Requerida
- **Controller:** `CreateScheduleController`
- **Service:** `CreateScheduleService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Request Body

```json
{
	"customer": "Carlos Silva",
	"haircut_id": "uuid-do-corte"
}
```

| Campo        | Tipo   | Obrigatório | Descrição                         |
| ------------ | ------ | ----------- | --------------------------------- |
| `customer`   | string | ✅          | Nome do cliente                   |
| `haircut_id` | string | ✅          | UUID do modelo de corte escolhido |

#### Response — 200 OK

```json
{
	"id": "uuid-do-agendamento",
	"customer": "Carlos Silva",
	"haircut_id": "uuid-do-corte",
	"user_id": "uuid-do-usuario",
	"createdAt": "2026-03-17T10:00:00.000Z",
	"updatedAt": "2026-03-17T10:00:00.000Z"
}
```

#### Erros

| Status | Mensagem          | Causa                                    |
| ------ | ----------------- | ---------------------------------------- |
| `401`  | `"Unauthorized"`  | Token inválido ou não enviado            |
| `400`  | `"INVALID DATA."` | `customer` ou `haircut_id` não fornecido |

---

### GET /schedules

Lista todos os agendamentos do barbeiro autenticado, incluindo dados do corte vinculado.

- **Autenticação:** ✅ Requerida
- **Controller:** `ListScheduleController`
- **Service:** `ListScheduleService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response — 200 OK

```json
[
	{
		"id": "uuid-do-agendamento",
		"customer": "Carlos Silva",
		"haircut": {
			"id": "uuid-do-corte",
			"name": "Degradê",
			"price": 45.0,
			"status": true,
			"user_id": "uuid-do-usuario",
			"createdAt": "2026-03-17T10:00:00.000Z",
			"updatedAt": "2026-03-17T10:00:00.000Z"
		}
	}
]
```

| Campo      | Tipo   | Descrição                          |
| ---------- | ------ | ---------------------------------- |
| `id`       | string | UUID do agendamento                |
| `customer` | string | Nome do cliente                    |
| `haircut`  | object | Dados completos do modelo de corte |

> Ordenado por `createdAt` em ordem crescente (mais antigos primeiro — fila de atendimento).

#### Erros

| Status | Mensagem         | Causa                         |
| ------ | ---------------- | ----------------------------- |
| `401`  | `"Unauthorized"` | Token inválido ou não enviado |

---

### DELETE /schedules/:schedule_id

Finaliza (remove) um agendamento concluído.

- **Autenticação:** ✅ Requerida
- **Controller:** `FinishScheduleController`
- **Service:** `FinishScheduleService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Path Parameters

| Parâmetro     | Tipo   | Obrigatório | Descrição                       |
| ------------- | ------ | ----------- | ------------------------------- |
| `schedule_id` | string | ✅          | UUID do agendamento a finalizar |

#### Exemplo de Requisição

```
DELETE /schedules/uuid-do-agendamento
```

#### Response — 200 OK

```json
{
	"message": "Schedule finish successfully"
}
```

#### Erros

| Status | Mensagem                                  | Causa                                              |
| ------ | ----------------------------------------- | -------------------------------------------------- |
| `401`  | `"Unauthorized"`                          | Token inválido ou não enviado                      |
| `400`  | `"INVALID SCHEDULE DATA."`                | `schedule_id` não fornecido                        |
| `400`  | `"SCHEDULE NOT FOUND OR NOT AUTHORIZED."` | Agendamento não existe ou pertence a outro usuário |

---

## 💳 Assinaturas

---

### POST /subscribes

Inicia o fluxo de checkout para assinar o plano premium via Stripe.

- **Autenticação:** ✅ Requerida
- **Controller:** `SubscribeController`
- **Service:** `SubscribeService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response — 200 OK

```json
{
	"url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

| Campo | Tipo   | Descrição                                       |
| ----- | ------ | ----------------------------------------------- |
| `url` | string | URL do checkout Stripe para redirect do cliente |

> **Nota:** Na primeira assinatura, um customer Stripe é criado automaticamente e o `subscription_id` é salvo no perfil do usuário.

#### Erros

| Status | Mensagem            | Causa                         |
| ------ | ------------------- | ----------------------------- |
| `401`  | `"Unauthorized"`    | Token inválido ou não enviado |
| `400`  | `"USER NOT FOUND."` | Usuário do token não existe   |

---

### POST /create-portal

Gera a URL do portal de gerenciamento de assinatura no Stripe (cancelar, trocar cartão, etc.).

- **Autenticação:** ✅ Requerida
- **Controller:** `CreatePortalController`
- **Service:** `CreatePortalService`

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response — 200 OK

```json
{
	"url": "https://billing.stripe.com/p/session/test_..."
}
```

| Campo | Tipo   | Descrição                                             |
| ----- | ------ | ----------------------------------------------------- |
| `url` | string | URL do billing portal Stripe para redirect do cliente |

#### Erros

| Status | Mensagem                               | Causa                                 |
| ------ | -------------------------------------- | ------------------------------------- |
| `401`  | `"Unauthorized"`                       | Token inválido ou não enviado         |
| `400`  | `"USER NOT FOUND."`                    | Usuário do token não existe           |
| `400`  | `"USER DOES NOT HAVE A SUBSCRIPTION."` | Usuário nunca realizou uma assinatura |

---

### POST /webhooks

Endpoint que recebe eventos do Stripe para sincronizar o status das assinaturas.

- **Autenticação:** ❌ Não requerida (autenticado via assinatura Stripe)
- **Controller:** `WebHooksController`
- **Content-Type:** `application/json` (raw body)

#### Eventos Processados

| Evento Stripe                   | Ação Realizada                              |
| ------------------------------- | ------------------------------------------- |
| `checkout.session.completed`    | Cria registro na tabela `subscriptions`     |
| `customer.subscription.updated` | Atualiza `status` e `priceId` da assinatura |
| `customer.subscription.deleted` | Remove registro da tabela `subscriptions`   |

#### Response — 200 OK

Sem body de resposta (mínimo necessário para o Stripe confirmar recebimento).

#### Erros

| Status | Mensagem               | Causa                         |
| ------ | ---------------------- | ----------------------------- |
| `400`  | `"Webhook Error: ..."` | Assinatura do evento inválida |

> **Nota:** Este endpoint não utiliza `express.json()` — o body é recebido como `raw` para que a verificação da assinatura do Stripe funcione corretamente.

---

## 🔢 Códigos de Status

| Código | Significado  | Quando ocorre                                               |
| ------ | ------------ | ----------------------------------------------------------- |
| `200`  | OK           | Requisição processada com sucesso                           |
| `400`  | Bad Request  | Erro de validação ou regra de negócio (ver `error` no body) |
| `401`  | Unauthorized | Token ausente ou inválido no middleware                     |
| `500`  | Server Error | Erro inesperado no servidor                                 |

### Formato de Erro (400)

```json
{
	"error": "Mensagem descritiva do erro"
}
```

### Formato de Erro (401)

```json
{
	"error": "Unauthorized"
}
```

### Formato de Erro (500)

```json
{
	"status": "error",
	"message": "Internal server error."
}
```
