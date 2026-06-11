# Arquitetura

Este documento detalha como as peças do projeto se conectam: o MCP Server, suas Tools e Resources, e os dois clientes que existem hoje (o chat web e o script de demo via CLI).

## Componentes

- **Laravel API** (`backend/laravel-api`): expõe `/api/v1/barbershops`, `/haircuts`, `/timeslots` e `/appointments`. Fonte de dados real (SQLite em dev).
- **MCP Server** (`mcp-server`): processo Node.js/Express com duas responsabilidades:
  - `/mcp`: endpoint MCP padrão (JSON-RPC), expõe **Tools** e **Resources** para qualquer cliente MCP.
  - `/chat`: endpoint HTTP simples (`POST { message }`) usado pelo frontend, que internamente atua como um cliente MCP e fala com a Claude API.
- **Frontend** (`frontend`): SPA React + Tailwind com um único componente de chat (`src/components/Chat.jsx`) que envia mensagens para `POST /chat`.
- **test-claude.ts**: script CLI alternativo que fala diretamente com `/mcp` via protocolo MCP (sem passar pelo `/chat`), útil para inspecionar tools/resources e o ciclo de tool-use no terminal.

## Fluxo via chat web (`/chat`)

1. O usuário digita uma mensagem no frontend (`Chat.jsx`), que faz `POST http://localhost:3000/chat`.
2. `server.ts` repassa para `chat-handler.ts` (`processChat`).
3. `processChat`:
   - Inicializa uma sessão MCP e lista as **Tools** disponíveis (`tools/list`), convertendo para o formato esperado pela Claude API.
   - Lista e lê todas as **Resources** disponíveis (`resources/list` + `resources/read`) e monta um `system prompt` com o conteúdo de cada uma (ex: política de cancelamento).
   - Envia a mensagem do usuário para a Claude API (`claude-opus-4-8`) junto com `tools` e o `system` prompt.
   - Caso a resposta tenha `stop_reason === "tool_use"`, executa cada tool chamada via `tools/call` no MCP Server, devolve os resultados ao Claude e repete até obter uma resposta final em texto.
4. O texto final é devolvido ao frontend e exibido no chat.

## Fluxo via demo CLI (`test-claude.ts`)

Mesmo princípio do passo 3 acima, mas o orquestrador é o próprio script CLI: ele fala diretamente com `/mcp` (sem o endpoint `/chat`), o que é útil para depurar o protocolo MCP isoladamente.

## MCP Resources

Resources são uma forma de fornecer **contexto somente-leitura** ao modelo, sem que ele precise "chamar" nada — o conteúdo é injetado no `system prompt` antes da conversa começar.

Hoje existe um Resource registrado:

- **`cancellationPolicy`** (`mcp-server/src/resources/cancellation-policy.ts`)
  - URI: `resource://barbershop/cancellation-policy`
  - Conteúdo: política de cancelamento/reagendamento da barbearia (prazos, taxas, exceções).
  - Registrado em `server.ts` via `server.registerResource(...)`.

Para adicionar um novo Resource (ex: horário de funcionamento, endereço, formas de pagamento):

1. Criar um arquivo em `mcp-server/src/resources/` exportando `{ uri, name, description, mimeType, content }`.
2. Registrar com `server.registerResource(...)` em `server.ts`, seguindo o mesmo padrão de `cancellationPolicy`.
3. Nenhuma mudança é necessária em `chat-handler.ts` — `getMCPResourcesContext()` já lista e injeta todos os Resources registrados automaticamente.

## Tools

As três Tools (`getHaircuts`, `getTimeSlot`, `createAppointment`) são as únicas formas pelas quais o modelo pode **agir** (consultar dados específicos por parâmetro ou criar um agendamento). Cada uma faz uma chamada HTTP para a Laravel API via `utils/api-client.ts`.
