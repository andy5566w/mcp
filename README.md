# MCP E-commerce Server

A comprehensive Model Context Protocol (MCP) server for e-commerce product management with CRUD operations, AI-powered descriptions, and database integration.

## Features

- 🛍️ **Complete CRUD Operations** - Create, read, update, delete products
- 🤖 **AI-Powered Descriptions** - Automatic product description generation using MCP sampling
- 📊 **Database Integration** - MySQL database with proper schema
- 🔍 **Smart Search** - Search products by name with pagination
- 📦 **Low Stock Monitoring** - Resource for tracking inventory levels
- 🌐 **Dual Transport Support** - Both stdio and HTTP/SSE transports
- 🔧 **TypeScript** - Fully typed with Zod validation
- 📋 **MCP Resources** - Product catalog and low-stock resources
- 🎯 **MCP Prompts** - Pre-built prompt templates


## Quick start
```bash
# 1) Install deps
npm i

# 2) Prepare env
cp .env.example .env

# 3) Create schema (optional, run in your MySQL)
# See sql/schema.sql

# 4) Run demo (non-MCP) usage
npm run dev:demo

# 5) Run MCP server (stdio transport)
npm run dev:mcp
```
The MCP server prints nothing special; it waits on stdio for a client like Claude Desktop / MCP Inspector / Apps SDK to connect.

## Cursor MCP 設定（為何出現 "Server not yet created, returning empty offerings"）

日誌 `Handling ListOfferings action, server stored: false` / `Server not yet created, returning empty offerings` 來自 **Cursor 的 MCP 客戶端**，表示 Cursor 在向你的 MCP server 要 offerings（工具列表）時，還沒有成功建立/儲存與該 server 的連線。常見原因：

1. **啟動指令錯誤**  
   Cursor 必須用「可執行」的指令啟動你的 server。請在 Cursor 的 MCP 設定裡使用下面其中一種方式，並把路徑改成你專案實際位置。

   **方式 A：用專案內的 `npm run dev:mcp`（開發時建議）**  
   在 Cursor Settings → MCP 裡新增 server，例如：
   - **Command**: `npm` 或 `pnpm`
   - **Args**: `run`、`dev:mcp`
   - **CWD**（若有）：設成此專案根目錄（例如 `.../diu`）

   **方式 B：先 build 再用 node 跑**  
   ```bash
   npm run build
   ```
   然後在 MCP 設定：
   - **Command**: `node`
   - **Args**: `dist/mcp/server.js`（或你專案中的絕對路徑）

   **方式 C：用 npx 跑已發佈的 package**  
   若你已 `npm publish` 且 Cursor 是從專案外啟動：
   - **Command**: `npx`
   - **Args**: `-y`、`mcp-ecommerce-crud`（或你的 package 名稱）

2. **MCP 1.0 啟動競態**  
   Cursor 有時會在 MCP server 還沒完成註冊前就發送 ListOfferings，導致「server 尚未建立」、offerings 為空。若設定正確但偶爾仍出現：
   - 重開 Cursor 或重載 MCP，再試一次。
   - 確認手動執行 `npm run dev:mcp` 時，stderr 會出現 `[ecommerce-mcp] MCP server is running on stdio (ready for ListOfferings)`，代表 server 已就緒。

3. **驗證 server 有啟動**  
   在終端執行：
   ```bash
   npm run dev:mcp
   ```
   若看到 `[ecommerce-mcp] MCP server is running on stdio (ready for ListOfferings)` 且沒有崩潰，表示 server 本身正常；若崩潰會印出 `[ecommerce-mcp] uncaughtException` / `Failed to start`，可依錯誤訊息排查（例如 DB 連線、env 等）。

## Notes
- This is intentionally minimal and tutorial‑friendly.
- All database params come from environment variables.
- You can extend with transactions, pagination, auth, etc.



#package.json
npm link

npm login
npm publish --access public
