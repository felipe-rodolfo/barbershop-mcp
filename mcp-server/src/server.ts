import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {z} from "zod";
import { getHaircuts } from "./tools/getHaircuts.js";

const server = new McpServer({
    name: 'babershop-mcp',
    version: "1.0.0"
});

server.registerTool(
    "getHaircuts",
    {
        title: "Get Haircuts",
        description: "Get all available haircuts for a barbershop",
        inputSchema: {
            barbershop_id: z.number().describe("The barbershop ID")
        }
    },
    async ({ barbershop_id}) => {
        const result = getHaircuts(barbershop_id);
        return {
            content: [{type: "text", text: JSON.stringify(result)}]
        };
    }
);

async function startServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

startServer();

export {server};