# Barbershop MCP

> Um chatbot de atendimento para barbearias construído com **Model Context Protocol (MCP)**, demonstrando integração entre Claude IA, um MCP Server em Node.js e uma API Laravel.

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-11-red.svg)](https://laravel.com/)
[![MCP](https://img.shields.io/badge/MCP-Protocol-orange.svg)](https://modelcontextprotocol.io/)

## 📌 Visão Geral

O projeto implementa um **chatbot inteligente de atendimento para barbearias** que, via Claude:
- ✅ Consulta os cortes disponíveis em uma barbearia
- ✅ Consulta horários disponíveis para uma data
- ✅ Cria um novo agendamento
- ✅ Responde em linguagem natural com base nesses dados
- ✅ Usa políticas e informações da barbearia (ex: cancelamento) como contexto via **MCP Resources**

Funciona através de um **MCP Server** que atua como intermediário entre Claude e a API da barbearia, expondo **Tools** e **Resources** que o modelo pode usar de forma padronizada (protocolo MCP via JSON-RPC). Um chat web em React consome esse MCP Server através de um endpoint HTTP dedicado (`/chat`).

---

## 🚦 Status do Projeto

| Componente | Status |
|---|---|
| API Laravel (`/api/v1/...`) | ✅ Funcionando |
| MCP Server (3 tools) | ✅ Funcionando |
| MCP Resources (política de cancelamento) | ✅ Funcionando |
| Endpoint de chat (`/chat`, Claude + MCP) | ✅ Funcionando |
| Frontend (chat web) | ✅ Funcionando (`frontend`) |
| Demo via CLI (Claude + MCP) | ✅ Funcionando (`test-claude.ts`) |
| Documentação adicional (`docs/`) | 🚧 Em andamento ([`docs/architecture.md`](docs/architecture.md)) |

> A forma mais simples de "ver o projeto rodando" é via o [chat web em `frontend/`](frontend) — uma interface React que conversa com o endpoint `/chat` do MCP Server. Também é possível rodar [`mcp-server/test-claude.ts`](mcp-server/test-claude.ts), um script CLI que conecta diretamente ao MCP Server via protocolo MCP. Veja os passos 4 e 5 do Quick Start.

---

## 🏗️ Arquitetura

```
┌────────────────────────────┐      ┌─────────────────────────────────┐
│   Frontend (React + Vite)   │      │        test-claude.ts            │
│   Chat web (Tailwind)       │      │   Demo CLI (cliente MCP direto)  │
└──────────────┬───────────────┘      └────────────────┬──────────────────┘
               │ HTTP POST /chat                       │ JSON-RPC / MCP
               │                                        │
┌──────────────▼────────────────────────────────────────▼──────────────┐
│                  MCP Server (Node.js + TypeScript)                    │
│  • /chat        → chat-handler.ts orquestra Claude + tools/resources  │
│  • /mcp         → endpoint MCP (JSON-RPC)                             │
│  • Tools:     getHaircuts, getTimeSlot, createAppointment             │
│  • Resources: cancellationPolicy (política de cancelamento)           │
└───────────────┬─────────────────────────────────────┬─────────────────┘
                 │ Anthropic SDK                       │ HTTP API (/api/v1)
                 │                                      │
┌────────────────▼─────────────────┐      ┌─────────────▼───────────────────┐
│            Claude API             │      │           Laravel API            │
│        (Anthropic - Nuvem)        │      │  Barbershops, Haircuts,          │
│                                    │      │  TimeSlots, Appointments         │
│                                    │      │  SQLite (dev)                    │
└────────────────────────────────────┘      └───────────────────────────────────┘
```

> Detalhes do fluxo completo (chat web vs. demo CLI, e como os MCP Resources são injetados no contexto do Claude) em [`docs/architecture.md`](docs/architecture.md).

---

## 🛠️ Tech Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **IA** | Claude (Anthropic) | API |
| **MCP Server** | Node.js + TypeScript | 20+ |
| **Backend** | Laravel | 11+ |
| **Banco de Dados** | SQLite (dev) | - |

---

## 📁 Estrutura do Monorepo

```
barbershop-mcp/
├── backend/
│   └── laravel-api/
│       ├── app/
│       │   ├── Http/Controllers/Api/   # Barbershop, Haircut, TimeSlot, Appointment
│       │   └── Models/
│       ├── database/
│       │   ├── migrations/
│       │   └── seeders/                # Barbershop, Haircut, TimeSlot
│       ├── routes/api.php              # rotas /api/v1/...
│       └── .env.example
│
├── mcp-server/
│   ├── src/
│   │   ├── index.ts                    # entrada do MCP Server
│   │   ├── server.ts                   # registro das tools/resources MCP, rotas /mcp e /chat
│   │   ├── chat-handler.ts             # orquestra Claude + MCP para o endpoint /chat
│   │   ├── tools/
│   │   │   ├── getHaircuts.ts
│   │   │   ├── getTimeSlot.ts
│   │   │   └── createAppointment.ts
│   │   ├── resources/
│   │   │   └── cancellation-policy.ts  # MCP Resource: política de cancelamento
│   │   └── utils/
│   │       └── api-client.ts           # cliente HTTP para a API Laravel
│   ├── test-claude.ts                  # demo CLI: Claude + MCP Server
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Chat.jsx                # UI de chat, consome POST /chat
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   └── architecture.md                 # fluxos de chat e MCP Resources em detalhe
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 20+
- PHP 8.2+ e Composer
- Chave de API do Claude (Anthropic) — [console.anthropic.com](https://console.anthropic.com/)

### 1. Clone e navegue
```bash
git clone https://github.com/felipe-rodolfo/barbershop-mcp.git
cd barbershop-mcp
```

### 2. Setup do Backend (Laravel)
```bash
cd backend/laravel-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
A API ficará disponível em `http://localhost:8000/api/v1`.

### 3. Setup do MCP Server (Node.js)
Em um novo terminal:
```bash
cd mcp-server
npm install
cp .env.example .env
```
Edite `mcp-server/.env` e preencha sua `ANTHROPIC_API_KEY`. O valor padrão de `LARAVEL_API_BASE_URL` (`http://localhost:8000/api/v1`) já aponta para a API do passo 2.

```bash
npm run dev
```
O MCP Server ficará disponível em `http://localhost:3000/mcp`.

### 4. Setup do Frontend (chat web)
Com o backend (passo 2) e o MCP Server (passo 3) rodando, em um novo terminal:
```bash
cd frontend
npm install
npm run dev
```
O frontend ficará disponível em `http://localhost:5173` e já está configurado para conversar com o MCP Server em `http://localhost:3000/chat`.

### 5. (Alternativo) Rodar a demo via CLI (Claude + MCP)
Com o backend (passo 2) e o MCP Server (passo 3) rodando, em um novo terminal:
```bash
cd mcp-server
npx tsx test-claude.ts
```
O script conecta no MCP Server, lista as tools disponíveis, envia uma mensagem de exemplo para o Claude e mostra o resultado completo do fluxo de tool-use (consulta de cortes, horários, etc).

> ℹ️ Se você alterar arquivos em `mcp-server/src/`, rode `npm run build` antes de usar `npm start` (que executa `dist/`). `npm run dev` já roda direto do TypeScript.

---

## 🤝 Contribuições

Este é um projeto educacional. Sugestões, bug reports e pull requests são bem-vindos.

---

## 📝 Licença

MIT.

---

## 📞 Suporte

Dúvidas sobre MCP? Confira:
- [Documentação oficial MCP](https://modelcontextprotocol.io/)
- [Exemplos de MCP Servers](https://github.com/modelcontextprotocol/servers)
- Issues neste repositório

---

**Feito com ❤️ por Felipe | Brasil**
