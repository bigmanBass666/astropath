#!/usr/bin/env bash
set -euo pipefail

# 1. Install dependencies
npm install

# 2. Kill any leftover dev server from a previous session
pkill -f "node.*vite" 2>/dev/null || true
sleep 1

# 3. Start dev server in background
npm run dev &
DEV_PID=$!

# 4. Wait until server is ready (retry for up to 60 seconds)
echo "Waiting for server..."
for i in $(seq 1 30); do
  curl -sf http://localhost:5173/ && { echo "Server ready."; break; }
  [ $i -eq 30 ] && { echo "SMOKE TEST FAILED: server never started"; kill $DEV_PID 2>/dev/null; exit 1; }
  sleep 2
done

# 5. Basic smoke test — verify the app returns a 200 and key content
BODY=$(curl -sf http://localhost:5173/)
echo "$BODY" | grep -q "留学" \
  && echo "SMOKE TEST PASSED" \
  || { echo "SMOKE TEST FAILED: expected content not found"; kill $DEV_PID 2>/dev/null; exit 1; }

# ⚠️  CRITICAL: DO NOT add `wait $DEV_PID` here.
#
# The dev server must keep running in the background after init.sh exits so the
# coding agent can use it for browser testing.  `wait $DEV_PID` would block
# forever because the dev server never exits on its own — this hangs the entire
# claude session and forces a timeout.
#
# The harness manages session lifetime; init.sh only starts the server.
