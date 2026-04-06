import axios from 'axios'

const API_KEY = '015518e0bc86498dafdc42bf88b1572a.dioiOVESgV9mUg5i'
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4'

async function testModel(modelName, enableThinking = false) {
  console.log(`\n========== 测试模型: ${modelName} (thinking: ${enableThinking}) ==========`)

  try {
    const requestBody = {
      model: modelName,
      messages: [
        { role: 'user', content: '你好，请回复"测试成功"' }
      ],
      temperature: 0.7,
      max_tokens: 100,
      stream: false
    }

    // 只有国内模型才添加 thinking 字段
    if (enableThinking) {
      requestBody.thinking = { type: 'enabled' }
    }

    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        timeout: 30000
      }
    )

    console.log(`✅ ${modelName} ${enableThinking ? '(thinking开启)' : '(thinking关闭)'} 调用成功`)
    console.log(`   响应内容: ${response.data.choices?.[0]?.message?.content?.substring(0, 50)}...`)
    if (response.data.usage) {
      console.log(`   Token使用:`, JSON.stringify(response.data.usage, null, 2))
    }
    return { success: true, data: response.data }

  } catch (error) {
    console.error(`❌ ${modelName} ${enableThinking ? '(thinking开启)' : '(thinking关闭)'} 调用失败`)
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
  console.log('🚀 开始测试智谱AI thinking 功能')
  console.log(`API Key: ${API_KEY.substring(0, 20)}...`)
  console.log(`Base URL: ${BASE_URL}`)

  // 测试目标模型
  const model = 'glm-z1-flash'

  // 测试不开启 thinking
  const result1 = await testModel(model, false)
  // 等待1秒
  await new Promise(resolve => setTimeout(resolve, 1000))
  // 测试开启 thinking
  const result2 = await testModel(model, true)

  console.log('\n========== 测试汇总 ==========')
  console.log(`${result1.success ? '✅' : '❌'} ${model} (thinking关闭): ${result1.success ? '通过' : '失败'}`)
  console.log(`${result2.success ? '✅' : '❌'} ${model} (thinking开启): ${result2.success ? '通过' : '失败'}`)

  if (!result2.success && result1.success) {
    console.log(`\n💡 建议: ${model} 支持 thinking 但参数格式可能需要调整`)
  }
}

runTests().catch(console.error)
