import Anthropic from "@anthropic-ai/sdk";
import fetch from "node-fetch";
import "dotenv/config";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MCP_SERVER_URL = "http://localhost:3000/mcp";

interface MCPResponse {
  jsonrpc: string;
  id: number;
  result?: {
    tools?: Array<{
      name: string;
      description: string;
      inputSchema: any;
    }>;
  };
  error?: any;
}

async function getMCPTools(): Promise<
  Array<{ name: string; description: string; inputSchema: any }>
> {
  console.log("\n Conectando ao MCP Server...");

  const initResponse = await fetch(MCP_SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0.0" },
      },
    }),
  });

  const initData = (await initResponse.json()) as MCPResponse;
  console.log("✅ MCP Server inicializado");

  const listResponse = await fetch(MCP_SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {},
    }),
  });

  const listData = (await listResponse.json()) as MCPResponse;

  if (listData.result?.tools) {
        console.log(`${listData.result.tools.length} tools descobertas:`);
    listData.result.tools.forEach((tool) => {
      console.log(`   - ${tool.name}: ${tool.description}`);
    });
    return listData.result.tools;
  }

  return [];
}

async function callMCPTool(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<string> {
  console.log(`\n Chamando tool: ${toolName}`, toolInput);

  const response = await fetch(MCP_SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: toolInput,
      },
    }),
  });

  const result = await response.json();

  if (result.error) {
    console.error(` Erro ao chamar tool: ${result.error.message}`);
    return `Erro: ${result.error.message}`;
  }

  const toolResult = result.result?.content?.[0]?.text || JSON.stringify(result.result);
  console.log(`Resultado:`, toolResult);

  return toolResult;
}

function convertToolsToClaudeFormat(
  mcpTools: Array<{ name: string; description: string; inputSchema: any }>
) {
  return mcpTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: {
      type: "object",
      properties: tool.inputSchema.properties,
      required: tool.inputSchema.required, 
    },
  }));
}

async function main() {
  console.log(" Iniciando teste de integração Claude + MCP Server\n");

  try {

    const mcpTools = await getMCPTools();

    if (mcpTools.length === 0) {
      console.error("Nenhuma tool encontrada no MCP Server");
      return;
    }

    const claudeTools = convertToolsToClaudeFormat(mcpTools);

    const userMessage =
      "Eu quero agendar um corte de cabelo na barbearia 1. Qual é o corte mais popular? E qual é o horário disponível para 2026-06-06?";

    console.log(`\n Enviando para Claude: "${userMessage}"\n`);

    const messages: Anthropic.MessageParam[] = [
      { role: "user", content: userMessage },
    ];

    console.log(JSON.stringify(claudeTools, null, 2));

    let response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      tools: claudeTools,
      messages: messages,
    });

    console.log(" Resposta inicial de Claude:");

    while (response.stop_reason === "tool_use") {
      const toolUseBlock = response.content.find(
        (block) => block.type === "tool_use"
      );

      if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
        break;
      }

      const toolName = toolUseBlock.name;
      const toolInput = toolUseBlock.input as Record<string, unknown>;

      let toolResult: string;
      try {
          toolResult = await callMCPTool(toolName, toolInput);
      } catch (error) {
          toolResult = `Erro ao executar tool: ${error instanceof Error ? error.message : String(error)}`;
      }

      messages.push({ role: "assistant", content: response.content });
      messages.push({
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUseBlock.id,
            content: toolResult,
          },
        ],
      });

      response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        tools: claudeTools,
        messages: messages,
      });
    }

    const finalText = response.content.find((block) => block.type === "text");
    if (finalText && finalText.type === "text") {
      console.log("\n Resposta final de Claude:");
      console.log(finalText.text);
    }
  } catch (error) {
    console.error(" Erro:", error);
  }
}

main();