import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ProductService } from "../services/ProductService.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";


const server = new McpServer({
  name: "ecommerce-custom-mcp",
  version: "1.0.0"
});

const svc = new ProductService();

const ProductSchema = z.object({
  id: z.number().int().positive().optional(),
  sku: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  price: z.union([z.string(), z.number()]),
  quantity: z.number().int(),
  created_at: z.union([z.string(), z.date()]).optional(),
  updated_at: z.union([z.string(), z.date()]).optional()
});
const ProductCreateInput = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.number().nonnegative(),
  quantity: z.number().int().nonnegative(),
});

// @ts-ignore - Type instantiation depth issue with nested nullable/optional types in Zod schema
server.registerTool(
  "add_product",
  {
    title: "Add Product",
    description: "add a new product to the database",
    inputSchema: ProductCreateInput.shape as any,
  },
  // @ts-ignore - Type inference issues with Zod schema and MCP types
  async (args: any) => {
    const { sku, name, description, price, quantity } = args as z.infer<typeof ProductCreateInput>;
    try {
      // 呼叫業務邏輯
      const created = await svc.addProduct({ sku, name, description, price, quantity });

      // 【關鍵重點】回傳格式必須符合 MCP CallToolResult
      return {
        content: [
          {
            type: "text" as const,
            // 必須將物件轉為 JSON 字串，LLM 才能讀取結構化資料
            text: JSON.stringify(created, null, 2)
          }
        ],
        // isError: false // 預設為 false，若有錯誤可設為 true
      };
    } catch (error) {
      // 錯誤處理範例
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to create product: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ],
        isError: true // 告訴 LLM 這次執行是失敗的
      };
    }
  }
);

// Log to stderr so Cursor MCP logs show startup/errors (stdout is used for MCP protocol)
const log = (msg: string) => console.error(`[ecommerce-mcp] ${msg}`);

process.on('uncaughtException', (err) => {
  log(`uncaughtException: ${err.message}`);
  console.error(err);
});
process.on('unhandledRejection', (reason, p) => {
  log(`unhandledRejection: ${String(reason)}`);
});

// start communication with the client
(async () => {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    log('MCP server is running on stdio (ready for ListOfferings)');
  } catch (err) {
    log(`Failed to start: ${err instanceof Error ? err.message : String(err)}`);
    console.error(err);
    process.exit(1);
  }
})();
