import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {z} from "zod";
import { getHaircuts } from "./tools/getHaircuts.js";
import { getTimeSlot } from "./tools/getTimeSlot.js";

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

server.registerTool(
    'getTimeSlot',
    {
        title: 'Get Time Slot',
        description: 'Get time available for a barbershop',
        inputSchema: {
            barbershop_id: z.number().describe("The barbershop ID"),
            date: z.string().describe("Date in YYYY-MM-DD formart"),
        }
    },
    async ({barbershop_id, date}) => {
        const result = getTimeSlot(barbershop_id, date);
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