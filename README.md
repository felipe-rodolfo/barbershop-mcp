# Barbershop MCP

> Um chatbot de atendimento para barbearias construído com **Model Context Protocol (MCP)**, demonstrando integração entre Claude IA, Node.js MCP Server e Laravel backend em uma arquitetura de monorepo.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-11-red.svg)](https://laravel.com/)
[![MCP](https://img.shields.io/badge/MCP-Protocol-orange.svg)](https://modelcontextprotocol.io/)

## 📌 Visão Geral

O projeto implementa um **chatbot inteligente de atendimento para barbearias** que:
- ✅ Responde dúvidas sobre serviços, horários e valores
- ✅ Consulta agenda em tempo real
- ✅ Marca consultas diretamente no sistema
- ✅ Oferece recomendações de cortes

Funciona através de um **MCP Server** que atua como intermediário entre Claude e a aplicação, oferecendo **Tools** (ações) e **Resources** (dados) de forma padronizada.

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                  Claude API                         │
│            (Anthropic - Nuvem)                      │
└────────────────────┬────────────────────────────────┘
                     │
            HTTP/SSE Transport
                (JSON-RPC Protocol)
                     │
┌────────────────────▼────────────────────────────────┐
│          MCP Server (Node.js)                       │
│  • Tools: createAppointment, getAvailableSlots     │
│  • Resources: haircuts, schedule, customer history │
└────────────────┬─────────────────────────────────────┘
                 │ HTTP API
                 │
┌────────────────▼─────────────────────────────────────┐
│      Laravel Backend API                            │
│  • Banco de dados (appointments, customers)         │
│  • Lógica de negócio                               │
│  • Autenticação e validações                        │
└──────────────────────────────────────────────────────┘

Frontend (React) → Claude (via widget/chat)
                 ↓
          MCP Server
                 ↓
          Laravel API
                 ↓
          Banco de dados
```

---

## 🛠️ Tech Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **IA** | Claude (Anthropic) | API |
| **MCP Server** | Node.js + TypeScript | 20+ |
| **Backend** | Laravel | 11+ |
| **Frontend** | React | 18+ |
| **Banco de Dados** | PostgreSQL | - |

---

## 📁 Estrutura do Monorepo

```
barbershop-mcp/
├── backend/
│   └── laravel-api/
│       ├── app/
│       ├── routes/
│       ├── database/
│       └── .env.example
│
├── mcp-server/
│   ├── src/
│   │   ├── index.ts              # Entrada principal do MCP Server
│   │   ├── server.ts             # Implementação do servidor MCP
│   │   ├── tools/
│   │   │   ├── createAppointment.ts
│   │   │   ├── getAvailableTimeSlots.ts
│   │   │   └── getHaircuts.ts
│   │   ├── resources/
│   │   │   ├── barbershopSchedule.ts
│   │   │   └── customerHistory.ts
│   │   └── utils/
│   │       └── api-client.ts     # Cliente HTTP para Laravel
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   └── react-app/
│       ├── src/
│       ├── public/
│       └── package.json
│
├── docs/
│   ├── MCP_EXPLAINED.md          # Guia didático sobre MCP
│   ├── ARCHITECTURE.md           # Detalhes da arquitetura
│   └── SETUP.md                  # Instruções de setup
│
├── .gitignore
├── README.md
└── package.json (root)
```

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 20+
- PHP 8.2+
- Composer
- npm ou yarn
- Chave de API do Claude (Anthropic)

### Instalação

#### 1. Clone e navegue
```bash
git clone https://github.com/felipe-rodolfo/barbershop-mcp.git
cd barbershop-mcp
```

#### 2. Setup do Backend (Laravel)
```bash
cd backend/laravel-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

#### 3. Setup do MCP Server (Node.js)
```bash
cd mcp-server
npm install
cp .env.example .env
npm run build
npm run dev
```

#### 4. Setup do Frontend (React)
```bash
cd frontend/react-app
npm install
npm start
```

---

## 📖 Documentação

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Detalhes técnicos da arquitetura (em progresso)
- **[SETUP.md](docs/SETUP.md)** - Instruções passo a passo (em progresso)

---

## 🤝 Contribuições

Este é um projeto educacional. Sugestões, bug reports e pull requests são bem-vindos!

Leia [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

---

## 📝 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 📞 Suporte

Dúvidas sobre MCP? Confira:
- [Documentação oficial MCP](https://modelcontextprotocol.io/)
- [Exemplos de MCP Servers](https://github.com/modelcontextprotocol/servers)
- Issues neste repositório

---

**Feito com ❤️ por Felipe | Brasil**