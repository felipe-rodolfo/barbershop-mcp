import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import fetch from "node-fetch";

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
        clientInfo: { name: "barbershop-chat", version: "1.0.0" },
      },
    }),
  });

  const initData = (await initResponse.json()) as MCPResponse;

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
  return listData.result?.tools || [];
}

async function callMCPTool(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<string> {
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

  const result = (await response.json()) as {
    result?: { content?: Array<{ text?: string }> };
    error?: { message: string };
  };

  if (result.error) {
    return `Erro: ${result.error.message}`;
  }

  return result.result?.content?.[0]?.text || JSON.stringify(result.result);
}

function convertToolsToClaudeFormat(
  mcpTools: Array<{ name: string; description: string; inputSchema: any }>
) {
  return mcpTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: {
      type: "object" as const,
      properties: tool.inputSchema.properties,
      required: tool.inputSchema.required,
    },
  }));
}

export async function processChat(userMessage: string): Promise<string> {
  try {
    const mcpTools = await getMCPTools();
    if (mcpTools.length === 0) {
      return "Erro: Nenhuma ferramenta MCP disponível.";
    }

    const claudeTools = convertToolsToClaudeFormat(mcpTools);

    const messages: Anthropic.MessageParam[] = [
      { role: "user", content: userMessage },
    ];

    let response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      tools: claudeTools,
      messages: messages,
    });

    while (response.stop_reason === "tool_use") {
      const toolUseBlocks = response.content.filter(
        (block) => block.type === "tool_use"
      );

      if (toolUseBlocks.length === 0) {
        break;
      }

      messages.push({ role: "assistant", content: response.content });

      const toolResultBlocks: Anthropic.ToolResultBlockParam[] = [];

      for (const toolUseBlock of toolUseBlocks) {
        const toolName = toolUseBlock.name;
        const toolInput = toolUseBlock.input as Record<string, unknown>;

        let toolResult: string;
        try {
          toolResult = await callMCPTool(toolName, toolInput);
        } catch (error) {
          toolResult = `Erro ao executar tool: ${error instanceof Error ? error.message : String(error)}`;
        }

        toolResultBlocks.push({
          type: "tool_result",
          tool_use_id: toolUseBlock.id,
          content: toolResult,
        });
      }

      messages.push({
        role: "user",
        content: toolResultBlocks,
      });

      response = await client.messages.create({
        model: "claude-opus-4-8",
        max_tokens: 1024,
        tools: claudeTools,
        messages: messages,
      });
    }

    const finalText = response.content.find((block) => block.type === "text");
    if (finalText && finalText.type === "text") {
      return finalText.text;
    }

    return "Desculpe, não consegui gerar uma resposta.";
  } catch (error) {
    return `Erro ao processar mensagem: ${error instanceof Error ? error.message : String(error)}`;
  }
}