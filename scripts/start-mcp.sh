#!/bin/bash
# MCP 服务器启动脚本
# 确保环境变量正确加载

# 设置错误处理
set -e

# 切换到项目目录
cd /Users/caichuixue/playground2/mcp-ecommerce-crud

# 加载 .env 文件（如果存在）
if [ -f .env ]; then
    # 安全地加载 .env 文件，避免空格和特殊字符问题
    set -a
    source .env
    set +a
fi

# 使用 nvm 的 node（如果 nvm 存在）
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    source "$NVM_DIR/nvm.sh"
fi

# 确保 npm 可用
if ! command -v npm &> /dev/null; then
    echo "[start-mcp] Error: npm not found" >&2
    exit 1
fi

# 运行 MCP 服务器
exec npm run dev:mcp
