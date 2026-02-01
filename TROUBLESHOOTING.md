# MCP 服务器故障排查指南

## 当前状态

✅ **服务器本身可以正常启动**
- 手动运行 `npm run dev:mcp` 成功
- 数据库连接正常
- 所有依赖都已安装

✅ **MCP 配置看起来正确**
- Command: 使用绝对路径的 npm
- Args: `run`, `dev:mcp`
- CWD: 已设置为项目根目录

## 如果 Cursor 仍然无法连接

### 步骤 1: 查看详细的错误日志

1. **打开 Cursor 开发者工具**
   - `Help → Toggle Developer Tools`
   - 或按 `Cmd+Option+I` (macOS)

2. **查看 Console 标签页**
   - 查找包含 "MCP" 或 "ecommerce" 的错误信息
   - 截图或复制完整的错误信息

3. **查看 Cursor 日志文件**
   ```bash
   # 查看最近的日志
   tail -f ~/Library/Logs/Cursor/*.log
   ```

### 步骤 2: 尝试替代配置

如果当前配置不工作，可以尝试以下替代方案：

#### 方案 A: 使用 shell 脚本（推荐）

修改 `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "ecommerce-products-mcp": {
      "type": "stdio",
      "command": "/bin/bash",
      "args": [
        "/Users/caichuixue/playground2/mcp-ecommerce-crud/scripts/start-mcp.sh"
      ],
      "cwd": "/Users/caichuixue/playground2/mcp-ecommerce-crud",
      "env": {}
    }
  }
}
```

#### 方案 B: 直接使用 node + tsx

```json
{
  "mcpServers": {
    "ecommerce-products-mcp": {
      "type": "stdio",
      "command": "/Users/caichuixue/.nvm/versions/node/v24.13.0/bin/node",
      "args": [
        "/Users/caichuixue/playground2/mcp-ecommerce-crud/node_modules/.bin/tsx",
        "/Users/caichuixue/playground2/mcp-ecommerce-crud/src/mcp/server.ts"
      ],
      "cwd": "/Users/caichuixue/playground2/mcp-ecommerce-crud",
      "env": {}
    }
  }
}
```

### 步骤 3: 完全重启 Cursor

1. **完全退出 Cursor**
   - 使用 `Cmd+Q` 或 `Cursor → Quit Cursor`
   - 不要只关闭窗口

2. **等待几秒钟**

3. **重新打开 Cursor**

4. **等待 10-15 秒**让 MCP 服务器连接

### 步骤 4: 检查 Cursor 版本

确保使用最新版本的 Cursor：
- `Cursor → About Cursor` 查看版本
- 如果有更新，请更新到最新版本

### 步骤 5: 验证服务器输出

在终端运行：
```bash
cd /Users/caichuixue/playground2/mcp-ecommerce-crud
npm run dev:mcp
```

应该看到：
```
[ecommerce-mcp] Starting MCP server...
[ecommerce-mcp] Working directory: /Users/caichuixue/playground2/mcp-ecommerce-crud
[ecommerce-mcp] Node version: v24.13.0
[ecommerce-mcp] Checking database connection...
[ecommerce-mcp] Database connection OK
[ecommerce-mcp] Initializing MCP transport...
[ecommerce-mcp] MCP server is running on stdio (ready for ListOfferings)
```

## 常见错误和解决方案

### "Connection closed" 错误

**含义**: 服务器启动后立即退出

**可能原因**:
1. 数据库连接失败
2. 代码错误导致崩溃
3. 环境变量问题

**解决方法**:
- 查看服务器启动日志（应该在 Cursor 的开发者工具中）
- 检查 `.env` 文件是否存在且配置正确
- 确认 MySQL 服务正在运行

### "No server info found" 错误

**含义**: Cursor 无法找到或连接到 MCP 服务器

**可能原因**:
1. CWD 未设置
2. Command 路径错误
3. Cursor 的 MCP 客户端问题

**解决方法**:
- 确认 `cwd` 字段已设置
- 使用绝对路径作为 command
- 完全重启 Cursor

## 获取帮助

如果以上步骤都无法解决问题，请提供：

1. **Cursor 开发者工具中的完整错误信息**
2. **MCP 配置文件的完整内容** (`~/.cursor/mcp.json`)
3. **手动运行 `npm run dev:mcp` 的输出**
4. **Cursor 版本信息**

这些信息有助于进一步诊断问题。
