#!/usr/bin/env bash
set -euo pipefail

echo "=== 一站式智能留学规划平台 - 环境初始化 ==="

# 1. 检查 Node.js 环境
if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js 未安装。请先安装 Node.js 18+ 版本。"
  exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "WARNING: Node.js 版本较低，建议升级到 18+ 版本"
fi

# 2. 安装依赖
echo "📦 正在安装项目依赖..."
npm install

# 3. 停止可能存在的开发服务器
echo "🧹 清理进程..."
pkill -f "vite" 2>/dev/null || true
pkill -f "node.*dev" 2>/dev/null || true
sleep 1

# 4. 环境变量检查
if [ ! -f ".env" ]; then
  echo "⚠️  未找到 .env 文件，使用默认配置..."
  cp .env.example .env 2>/dev/null || true
  echo "请根据需要编辑 .env 文件配置AI API参数"
fi

# 5. 启动开发服务器，捕获输出提取端口
echo "🚀 启动开发服务器..."
npm run dev 2>&1 | tee /tmp/vite.log &
DEV_PID=$!
sleep 3

# 从 Vite 输出中提取实际使用的端口（去除 ANSI 转义码并匹配 Local 行）
ACTUAL_PORT=$(sed -r 's/\x1b\[[0-9;]*m//g' /tmp/vite.log 2>/dev/null | grep 'Local:' | grep -oE 'localhost:[0-9]+' | tail -1 | grep -oE '[0-9]+' | head -1)

if [ -z "$ACTUAL_PORT" ]; then
  echo "❌ 无法检测 Vite 端口"
  kill $DEV_PID 2>/dev/null || true
  exit 1
fi

echo "✅ Vite 使用端口: $ACTUAL_PORT"

# 等待服务器就绪
echo "⏳ 等待服务器就绪..."
MAX_WAIT=60
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
  if curl -sf "http://localhost:${ACTUAL_PORT}/" > /dev/null 2>&1; then
    echo "✅ 服务器已就绪 (Port: ${ACTUAL_PORT})"
    break
  fi
  sleep 2
  WAITED=$((WAITED + 2))
done

if [ $WAITED -ge $MAX_WAIT ]; then
  echo "❌ 启动失败：服务器在 ${MAX_WAIT} 秒内未响应"
  kill $DEV_PID 2>/dev/null || true
  exit 1
fi

# 6. 基础健康检查
echo "🔍 执行健康检查..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${ACTUAL_PORT}/")
if [ "$HTTP_CODE" != "200" ]; then
  echo "❌ 健康检查失败：HTTP ${HTTP_CODE}"
  kill $DEV_PID 2>/dev/null || true
  exit 1
fi

echo "✨ 初始化完成！开发服务正在运行..."
echo "🌐 访问地址: http://localhost:${ACTUAL_PORT}"

wait $DEV_PID
