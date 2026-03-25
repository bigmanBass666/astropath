#!/usr/bin/env bash
set -euo pipefail

# 1. 安装依赖（仅在 node_modules 不存在时执行）
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# 2. 终止之前会话遗留的任何开发服务器
pkill -f "node.*vite" 2>/dev/null || true
pkill -f "vite.*server" 2>/dev/null || true
sleep 1

# 3. 在后台启动开发服务器
echo "Starting Vite dev server..."
npm run dev &
DEV_PID=$!

# 4. 等待服务器就绪（最多重试 60 秒）
echo "Waiting for server..."
for i in $(seq 1 30); do
  curl -sf http://localhost:5173/ && { echo "Server ready."; break; }
  [ $i -eq 30 ] && { echo "SMOKE TEST FAILED: server never started"; kill $DEV_PID 2>/dev/null; exit 1; }
  sleep 2
done

# 5. 基本冒烟测试 — 验证应用返回 200 和关键内容
BODY=$(curl -sf http://localhost:5173/)
echo "$BODY" | grep -q "留学规划平台" \
  && echo "SMOKE TEST PASSED" \
  || { echo "SMOKE TEST FAILED: expected content not found"; kill $DEV_PID 2>/dev/null; exit 1; }

# ⚠️ 关键：不要在此处添加 `wait $DEV_PID`。
#
# 开发服务器必须在 init.sh 退出后继续在后台运行，以便编码代理可以
# 将其用于浏览器测试。`wait $DEV_PID` 会永久阻塞 — 这是因为开发服务器
# 从不自行退出 — 这会挂起整个 Claude 会话并强制超时。
#
# 装备 (harness) 管理会话生命周期；init.sh 只启动服务器。
