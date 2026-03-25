#!/usr/bin/env bash
set -euo pipefail

# 1. Install dependencies
npm install

# 2. Kill any leftover dev server from a previous session
pkill -f "node.*vite" 2>/dev/null || true
sleep 1

# 3. Start dev server in background, capturing output
npm run dev > /tmp/vite-dev.log 2>&1 &
DEV_PID=$!

# 4. Wait until server is ready, detecting the actual port dynamically
echo "Waiting for server..."
DETECTED_PORT=""
for i in $(seq 1 30); do
  # Try common Vite ports in range 3000-3020
  for port in 3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 3011 3012 3013 3014 3015 3016 3017 3018 3019 3020; do
    if curl -sf "http://localhost:$port/" > /dev/null 2>&1; then
      DETECTED_PORT=$port
      break 2
    fi
  done
  [ $i -eq 30 ] && { echo "SMOKE TEST FAILED: server never started"; kill $DEV_PID 2>/dev/null; exit 1; }
  sleep 2
done

echo "Server ready on port $DETECTED_PORT."

# 5. Basic smoke test — verify the app returns a 200 and key content
BODY=$(curl -sf "http://localhost:$DETECTED_PORT/")
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
