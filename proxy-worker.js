/**
 * Cloudflare Worker: AI API 代理
 * 用途：隐藏 API Key，前端只请求自己的 Worker 地址
 *
 * 部署方法：
 * 1. 注册 Cloudflare (免费)
 * 2. 创建 Worker: Workers & Pages → Create → Create Worker
 * 3. 粘贴此代码，修改下面的 API_KEY 和 BASE_URL
 * 4. 获取 Worker URL，如: https://your-worker.your-account.workers.dev
 */

const API_KEY = '015518e0bc86498dafdc42bf88b1572a.dioiOVESgV9mUg5i';  // 替换为你的智谱 API Key
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';  // 智谱 API 地址

export default {
  async fetch(request, env, ctx) {
    // 只允许 POST 请求
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({
        error: 'Only POST method is allowed'
      }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      // 从请求体获取数据
      const body = await request.json();
      const { messages, model, stream, temperature, max_tokens, enable_thinking, max_thinking_tokens } = body;

      // 构建智谱 API 请求体
      const apiRequestBody = {
        model: model || 'glm-4-7-flash',
        messages: messages,
        stream: stream || false,
        temperature: temperature || 0.7
      };

      // 如果有可选参数，添加到请求体
      if (max_tokens && max_tokens > 0) {
        apiRequestBody.max_tokens = max_tokens;
      }

      // 智谱思考模式支持
      if (enable_thinking) {
        apiRequestBody.enable_thinking = true;
        if (max_thinking_tokens) {
          apiRequestBody.max_thinking_tokens = max_thinking_tokens;
        }
      }

      // 转发请求到智谱 API
      const apiResponse = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(apiRequestBody)
      });

      // 获取响应数据
      const responseData = await apiResponse.text();

      // 如果是流式响应，直接返回
      if (stream) {
        return new Response(responseData, {
          status: apiResponse.status,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache'
          }
        });
      }

      // 非流式响应
      return new Response(responseData, {
        status: apiResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Proxy error: ' + error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};