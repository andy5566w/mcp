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

# 6) 如果 Cursor 無法連接 MCP，運行診斷腳本
./scripts/check-mcp-config.sh
```
The MCP server prints nothing special; it waits on stdio for a client like Claude Desktop / MCP Inspector / Apps SDK to connect.

## Cursor MCP 設定與常見錯誤

### "No server info found" 錯誤

這個錯誤來自 **Cursor 的 MCP 客戶端**，表示 Cursor 無法找到或連接到你的 MCP 服務器。**這通常不是資料庫連線問題**，而是 Cursor 的 MCP 配置問題。

**重要說明**：
- MCP 服務器在啟動時**不會**檢查資料庫連線（資料庫連線是懶加載的）
- 只有在實際調用工具時才會嘗試連接資料庫
- 如果資料庫連線失敗，會在調用工具時才報錯，而不是啟動時

**解決方法**：

如果手動執行 `npm run dev:mcp` 能正常啟動（看到 "MCP server is running"），但 Cursor 還是顯示 "No server info found"，通常是 Cursor 的 MCP 配置問題：

1. **檢查 CWD（工作目錄）設置** ⚠️ **最常見的問題**
   - 在 Cursor Settings → MCP 中，**必須設置 CWD 為專案根目錄**
   - CWD 應該是：`/Users/caichuixue/playground2/mcp-ecommerce-crud`
   - 如果沒有設置 CWD，Cursor 可能無法找到 `package.json` 和 `node_modules`

2. **確認命令和參數正確**
   - **Command**: `npm`（或使用絕對路徑，如 `/usr/local/bin/npm`）
   - **Args**: 
     - `run`
     - `dev:mcp`
   - 不要使用 `npm run dev:mcp` 作為單一參數

3. **使用診斷腳本檢查配置**
   ```bash
   ./scripts/check-mcp-config.sh
   ```
   這個腳本會檢查所有必要的配置和依賴

4. **檢查 Cursor 的 MCP 日誌**
   - 打開 Cursor 的開發者工具（Help → Toggle Developer Tools）
   - 查看 Console 中的 MCP 相關錯誤訊息
   - 或查看 Cursor 的 MCP 日誌輸出

5. **如果使用 nvm 管理 Node.js** ⚠️ **常見問題**
   - nvm 管理的 Node.js 可能不在系統 PATH 中，Cursor 可能找不到 `npm`
   - **解決方法**：使用絕對路徑
   - 運行 `which npm` 獲取 npm 的絕對路徑
   - 在 Cursor MCP 配置中使用該絕對路徑作為 Command
   - 例如：`/Users/caichuixue/.nvm/versions/node/v24.13.0/bin/npm`
   - 或運行診斷腳本獲取推薦配置：`./scripts/check-mcp-config.sh`

6. **嘗試使用絕對路徑**
   - 如果相對路徑不工作，嘗試使用絕對路徑：
   - **Command**: `/usr/local/bin/npm`（或 `which npm` 的輸出）
   - **Args**: `run`、`dev:mcp`
   - **CWD**: `/Users/caichuixue/playground2/mcp-ecommerce-crud`

7. **重啟 Cursor**
   - 完全關閉 Cursor（不是只關閉窗口）
   - 重新打開 Cursor
   - 等待 MCP 服務器連接（可能需要幾秒鐘）

8. **檢查環境變數**
   - 確保 `.env` 文件在專案根目錄
   - 如果 Cursor 的 MCP 配置有 `env` 選項，可以手動設置環境變數

### "Server not yet created, returning empty offerings" 錯誤

日誌 `Handling ListOfferings action, server stored: false` / `Server not yet created, returning empty offerings` 來自 **Cursor 的 MCP 客戶端**，表示 Cursor 在向你的 MCP server 要 offerings（工具列表）時，還沒有成功建立/儲存與該 server 的連線。常見原因：

1. **啟動指令錯誤**  
   Cursor 必須用「可執行」的指令啟動你的 server。請在 Cursor 的 MCP 設定裡使用下面其中一種方式，並把路徑改成你專案實際位置。

   **方式 A：用專案內的 `npm run dev:mcp`（開發時建議）**  
   在 Cursor Settings → MCP 裡新增 server，例如：
   - **Command**: `npm` 或 `pnpm`
   - **Args**: 
     - `run`
     - `dev:mcp`
   - **CWD**（**必須設置**）：設成此專案根目錄
     - 例如：`/Users/caichuixue/playground2/mcp-ecommerce-crud`
     - 或相對路徑（如果 Cursor 支持）：`${workspaceFolder}`

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
   若看到以下日誌且沒有崩潰，表示 server 本身正常：
   ```
   [ecommerce-mcp] Checking database connection...
   [ecommerce-mcp] Database connection OK
   [ecommerce-mcp] MCP server is running on stdio (ready for ListOfferings)
   ```
   
   若崩潰會印出 `[ecommerce-mcp] uncaughtException` / `Failed to start`，可依錯誤訊息排查：
   - 如果是 `ECONNREFUSED`，表示資料庫連線失敗，請檢查 `.env` 檔案和 MySQL 服務是否運行
   - 如果是其他錯誤，請檢查環境變數和依賴是否正確安裝

4. **資料庫連線檢查**  
   現在 MCP 服務器會在啟動時檢查資料庫連線。如果資料庫連線失敗，服務器會在啟動時就報錯並退出，而不是等到調用工具時才發現問題。這有助於及早發現配置問題。

## Notes
- This is intentionally minimal and tutorial‑friendly.
- All database params come from environment variables.
- You can extend with transactions, pagination, auth, etc.



#package.json
npm link

npm login
npm publish --access public
