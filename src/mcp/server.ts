import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ProductService } from "../services/ProductService.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { log, setupErrorHandlers } from "../utils/logger.js";
import { checkDatabaseConnection } from "../utils/db-check.js";

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

const ProductGetByIdInput = z.object({
  id: z.number().int().positive(),
});

const ProductListInput = z.object({
  limit: z.number().int().nonnegative().optional().default(50),
  offset: z.number().int().nonnegative().optional().default(0),
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

// @ts-ignore - Type instantiation depth issue with nested nullable/optional types in Zod schema
server.registerTool(
  "get_product_by_id",
  {
    title: "Get Product by ID",
    description: "get a product by id from the database",
    inputSchema: ProductGetByIdInput.shape as any,
  },
  // @ts-ignore - Type inference issues with Zod schema and MCP types
  async (args: any) => {
    const { id } = args as z.infer<typeof ProductGetByIdInput>;
    const product = await svc.getProductById(id);
    return {
      content: [
        {
          type: "text" as const,
          text: product ? JSON.stringify(product, null, 2) : "Product not found"
        }
      ],
      isError: !product
    };
  }
);

// @ts-ignore - Type instantiation depth issue with nested nullable/optional types in Zod schema
server.registerTool(
  "list_products",
  {
    title: "List Products",
    description: "list products from the database with pagination",
    inputSchema: ProductListInput.shape as any,
  },
  // @ts-ignore - Type inference issues with Zod schema and MCP types
  async (args: any) => {
    const { limit, offset } = args as z.infer<typeof ProductListInput>;
    const products = await svc.listProducts(limit, offset);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(products, null, 2)
        }
      ],
      isError: false
    };
  }
);

// 啟動 MCP 服務器
(async () => {
  try {
    // 檢查資料庫連線（可選，但建議在啟動時驗證）
    await checkDatabaseConnection();

    const transport = new StdioServerTransport();
    await server.connect(transport);
    log('MCP server is running on stdio (ready for ListOfferings)');
  } catch (err) {
    log(`Failed to start: ${err instanceof Error ? err.message : String(err)}`);
    console.error(err);
    process.exit(1);
  }
})();
