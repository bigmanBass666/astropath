// 测试智谱AI连通性和模型切换
// 运行: node test-zhipu-connectivity.js

import axios from 'axios'

const API_KEY = '015518e0bc86498dafdc42bf88b1572a.dioiOVESgV9mUg5i'
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4'

async function testModel(modelName) {
  console.log(`\n========== 测试模型: ${modelName} ==========`)

  try {
    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: modelName,
        messages: [
          { role: 'user', content: '你好，请回复"测试成功"' }
        ],
        temperature: 0.7,
        max_tokens: 100,
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        timeout: 30000 // 30秒超时
      }
    )

    console.log(`✅ ${modelName} 调用成功`)
    console.log(`   响应内容: ${response.data.choices?.[0]?.message?.content?.substring(0, 50)}...`)
    console.log(`   Token使用:`, response.data.usage)
    return { success: true, data: response.data }

  } catch (error) {
    console.error(`❌ ${modelName} 调用失败`)
    if (error.response) {
      console.error(`   状态码: ${error.response.status}`)
      console.error(`   错误信息: ${JSON.stringify(error.response.data)}`)
    } else {
      console.error(`   错误: ${error.message}`)
    }
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('🚀 开始测试智谱AI连通性')
  console.log(`API Key: ${API_KEY.substring(0, 20)}...`)
  console.log(`Base URL: ${BASE_URL}`)

  // 测试列表
  const models = [
    'glm-z1-flash',     // 新切换的模型（50并发+思考）
    'glm-4-flash',      // 高并发无思考（200并发）
    'glm-4-air',        // 高并发备选（100并发）
    'glm-4.7-flash',    // 原来的模型（1并发）
  ]

  const results = []

  for (const model of models) {
    const result = await testModel(model)
    results.push({ model, ...result })
    // 间隔1秒，避免触发限流
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n========== 测试汇总 ==========')
  results.forEach(r => {
    const status = r.success ? '✅' : '❌'
    console.log(`${status} ${r.model}: ${r.success ? '通过' : '失败'}`)
  })

  // 输出建议
  const workingModels = results.filter(r => r.success).map(r => r.model)
  if (workingModels.includes('glm-4-flash')) {
    console.log('\n✨ 推荐使用: glm-4-flash (200并发，性能好)')
  } else if (workingModels.length > 0) {
    console.log(`\n⚠️  可用模型: ${workingModels.join(', ')}`)
  } else {
    console.log('\n❌ 所有模型都无法连接，请检查网络或API Key')
  }
}

runTests().catch(console.error)
