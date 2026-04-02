/**
 * AI API 调用工具模块
 * 支持多provider切换：OpenAI、Anthropic、国内供应商、其他
 */

// 自定义错误类
export class AIError extends Error {
  constructor(type, message, details = null) {
    super(message)
    this.name = 'AIError'
    this.type = type // 'network' | 'auth' | 'config' | 'unsupported' | 'api'
    this.details = details
  }
}

// 获取所有已配置的provider
export function getProviders() {
  const saved = localStorage.getItem('ai_providers')
  return saved ? JSON.parse(saved) : []
}

// 根据ID获取provider配置
export function getProviderById(id) {
  const providers = getProviders()
  return providers.find(p => p.id === id)
}

// 发送消息到AI API
export async function sendMessageToAI(providerId, messages, options = {}) {
  const provider = getProviderById(providerId)

  if (!provider) {
    throw new AIError('config', 'AI服务提供商未找到，请检查配置')
  }

  if (!provider.apiKey || !provider.baseUrl) {
    throw new AIError('config', 'AI服务配置不完整，请完善API Key和Base URL')
  }

  // 检查provider类型支持
  const supportedTypes = ['openai', 'anthropic', 'domestic', 'other']
  if (!supportedTypes.includes(provider.type)) {
    throw new AIError('unsupported', `暂不支持该AI服务商类型: ${provider.type}，请选择其他提供商或配置为"其他"类型`)
  }

  // 构建请求体（根据provider类型）
  const requestBody = buildRequestBody(provider, messages, options)

  try {
    // 发送请求 - 思考模式需要更长的超时时间
    const controller = new AbortController()
    const timeout = options.enableThinking ? 120000 : 60000 // 思考模式120秒，普通模式60秒
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()

      // 根据状态码区分错误类型
      if (response.status === 401 || response.status === 403) {
        throw new AIError('auth', `API认证失败 (${response.status})，请检查您的API Key是否正确`, errorText)
      } else if (response.status >= 500) {
        throw new AIError('api', `AI服务端错误 (${response.status})，请稍后重试或更换服务商`, errorText)
      } else {
        throw new AIError('api', `请求失败: ${response.status} - ${errorText}`)
      }
    }

    // 处理流式或非流式响应
    if (options.stream) {
      const contentType = response.headers.get('content-type') || ''
      console.log('[AI API] Response content-type:', contentType)
      
      // 检查是否是流式响应
      if (contentType.includes('text/event-stream') || contentType.includes('application/stream+json')) {
        return handleStreamResponse(response)
      } else {
        // API 可能不支持流式输出，返回的是普通 JSON
        console.log('[AI API] API did not return stream format, falling back to normal response')
        return handleNonStreamAsStream(response)
      }
    } else {
      return handleNormalResponse(response)
    }
  } catch (error) {
    // 网络错误或请求失败
    if (error.name === 'AbortError') {
      throw new AIError('network', '请求超时，请检查网络连接或稍后重试')
    } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new AIError('network', '网络连接失败，请检查您的网络设置')
    } else if (error instanceof AIError) {
      throw error // 重新抛出已分类的AI错误
    } else {
      throw new AIError('api', `请求异常: ${error.message}`)
    }
  }
}

// 构建请求体
function buildRequestBody(provider, messages, options) {
  console.log('[AI API] buildRequestBody options:', options)
  
  const baseBody = {
    model: provider.model || 'gpt-3.5-turbo',
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 1000,
    stream: options.stream || false
  }

  // 智谱 AI 思考模式控制
  if (options.enableThinking) {
    // 开启思考模式
    baseBody.enable_thinking = true
  } else {
    // 明确关闭思考模式 - 智谱 AI 默认可能开启
    baseBody.enable_thinking = false
  }

  // Anthropic需要特殊的消息格式处理
  if (provider.type === 'anthropic') {
    const anthropicBody = {
      model: provider.model || 'claude-3-opus-20240229',
      messages: messages.filter(m => m.role !== 'system').map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      system: messages.find(m => m.role === 'system')?.content || '',
      max_tokens: options.maxTokens || 1000,
      stream: options.stream || false
    }
    // Anthropic 的思考模式
    if (options.enableThinking) {
      anthropicBody.thinking = { type: 'enabled', budget_tokens: 10000 }
    }
    return anthropicBody
  }

  console.log('[AI API] Final request body:', baseBody)
  return baseBody
}

// 处理普通响应
async function handleNormalResponse(response) {
  const data = await response.json()
  return {
    success: true,
    content: data.choices?.[0]?.message?.content || '',
    usage: data.usage
  }
}

// 将非流式响应转换为流式输出（模拟打字效果）
async function* handleNonStreamAsStream(response) {
  const data = await response.json()
  const fullContent = data.choices?.[0]?.message?.content || ''
  
  console.log('[AI API] Converting non-stream response to stream, content length:', fullContent.length)
  
  if (!fullContent) {
    return
  }
  
  // 按字符或词组分割，模拟流式输出
  // 使用词组分割会更自然
  const chunks = splitIntoChunks(fullContent)
  
  for (let i = 0; i < chunks.length; i++) {
    // 添加小延迟，模拟打字效果
    await new Promise(resolve => setTimeout(resolve, 15))
    yield { type: 'content', content: chunks[i] }
  }
}

// 将文本分割成适合流式输出的块
function splitIntoChunks(text) {
  const chunks = []
  let currentChunk = ''
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    currentChunk += char
    
    // 在标点符号、空格或换行处分隔
    const shouldSplit = 
      char === '。' || 
      char === '，' || 
      char === '、' || 
      char === '；' || 
      char === '：' || 
      char === '！' || 
      char === '？' || 
      char === '.' || 
      char === ',' || 
      char === ' ' || 
      char === '\n' ||
      currentChunk.length >= 5
    
    if (shouldSplit && currentChunk.length > 0) {
      chunks.push(currentChunk)
      currentChunk = ''
    }
  }
  
  // 添加剩余内容
  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }
  
  return chunks
}

// 处理流式响应
async function* handleStreamResponse(response) {
  console.log('[AI API] Starting stream response handling')
  console.log('[AI API] Response headers:', Object.fromEntries(response.headers.entries()))
  
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let chunkCount = 0

  while (true) {
    const { done, value } = await reader.read()
    console.log('[AI API] Read chunk:', { done, valueLength: value?.length })
    
    if (done) {
      console.log('[AI API] Stream done, total chunks:', chunkCount)
      break
    }

    const decodedValue = decoder.decode(value, { stream: true })
    console.log('[AI API] Decoded value:', decodedValue.substring(0, 200))
    
    buffer += decodedValue
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue
      
      console.log('[AI API] Processing line:', trimmedLine.substring(0, 100))
      
      // 尝试多种格式解析
      let data = null
      
      // 格式1: 标准 SSE 格式 "data: {...}"
      if (trimmedLine.startsWith('data: ')) {
        data = trimmedLine.slice(6)
      }
      // 格式2: 无空格的 SSE 格式 "data:{...}"
      else if (trimmedLine.startsWith('data:')) {
        data = trimmedLine.slice(5).trim()
      }
      // 格式3: 直接是 JSON 对象
      else if (trimmedLine.startsWith('{') && trimmedLine.endsWith('}')) {
        data = trimmedLine
      }
      
      if (data) {
        if (data === '[DONE]') {
          console.log('[AI API] Received [DONE] signal')
          return
        }

        try {
          const parsed = JSON.parse(data)
          console.log('[AI API] Parsed data:', parsed)
          
          // 处理推理内容（智谱 AI 的 reasoning_content）
          const reasoningContent = parsed.choices?.[0]?.delta?.reasoning_content
          if (reasoningContent) {
            chunkCount++
            console.log('[AI API] Yielding reasoning chunk #', chunkCount, ':', reasoningContent)
            yield { type: 'reasoning', content: reasoningContent }
          }
          
          // 处理正常内容
          const content = 
            parsed.choices?.[0]?.delta?.content ||  // OpenAI 流式格式
            parsed.choices?.[0]?.message?.content || // OpenAI 非流式格式
            parsed.delta?.text ||                     // 某些 API 格式
            parsed.text ||                            // 简单文本格式
            parsed.content                            // 其他格式
          
          if (content) {
            chunkCount++
            console.log('[AI API] Yielding content chunk #', chunkCount, ':', content)
            yield { type: 'content', content }
          }
        } catch (e) {
          console.warn('[AI API] Failed to parse SSE data:', data, e)
        }
      }
    }
  }
  
  // 处理剩余的 buffer
  if (buffer.trim()) {
    let data = null
    if (buffer.startsWith('data: ')) {
      data = buffer.slice(6)
    } else if (buffer.startsWith('data:')) {
      data = buffer.slice(5).trim()
    } else if (buffer.startsWith('{')) {
      data = buffer
    }
    
    if (data && data !== '[DONE]') {
      try {
        const parsed = JSON.parse(data)
        
        // 处理推理内容
        const reasoningContent = parsed.choices?.[0]?.delta?.reasoning_content
        if (reasoningContent) {
          yield { type: 'reasoning', content: reasoningContent }
        }
        
        // 处理正常内容
        const content = 
          parsed.choices?.[0]?.delta?.content ||
          parsed.choices?.[0]?.message?.content ||
          parsed.delta?.text ||
          parsed.text ||
          parsed.content
        
        if (content) {
          yield { type: 'content', content }
        }
      } catch (e) {
        console.warn('[AI API] Failed to parse remaining buffer:', buffer, e)
      }
    }
  }
}

// 测试provider连接
export async function testProviderConnection(providerId) {
  const provider = getProviderById(providerId)

  if (!provider) {
    return { success: false, error: 'Provider未找到', errorType: 'config' }
  }

  if (!provider.apiKey || !provider.baseUrl) {
    return { success: false, error: '配置不完整', errorType: 'config' }
  }

  try {
    const testMessages = [
      { role: 'user', content: 'Hello, this is a test connection.' }
    ]

    const response = await sendMessageToAI(providerId, testMessages, {
      maxTokens: 10
    })

    return { success: true, response }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      errorType: error instanceof AIError ? error.type : 'unknown'
    }
  }
}

// 为不同智能体构建系统提示词
export function buildSystemPrompt(agentId) {
  const prompts = {
    consultant: `你是一位专业的留学顾问，帮助用户解答关于出国留学的整体规划问题。
你的回答应该专业、全面、实用，涵盖选校、申请、时间规划等方面。`,
    essay: `你是一位文书导师，专注于帮助用户改进和润色留学申请文书。
你的建议应该具体、可操作，关注个人陈述、简历、推荐信的写作技巧。`,
    selection: `你是一位选校专家，根据用户的背景和目标提供选校建议。
你需要考虑用户的GPA、语言成绩、科研和实践经历，给出冲刺、适中和保底三个档次的学校推荐。`,
    visa: `你是一位签证申请助手，帮助用户了解签证申请流程和注意事项。
你需要针对不同国家（美国、英国、澳洲、加拿大等）提供具体的签证指导。`
  }

  return prompts[agentId] || '你是一个有用的助手。'
}

// 生成评估报告提示词
export function buildAssessmentPrompt(formData, scores) {
  const researchDetails = formData.academic.research.length > 0 
    ? formData.academic.research.map(r => `${r.name}（${r.role}，${r.duration}）`).join('、')
    : '无'
  const internshipDetails = formData.practice.internships.length > 0
    ? formData.practice.internships.map(i => `${i.company}（${i.position}）`).join('、')
    : '无'
  const competitionDetails = formData.practice.competitions.length > 0
    ? formData.practice.competitions.map(c => `${c.name}（${c.level}-${c.award}）`).join('、')
    : '无'

  return `你是一位资深的留学申请顾问，拥有丰富的申请评估经验。请基于以下学生背景信息，生成一份专业、详细、有针对性的竞争力评估报告。

【重要】请直接输出最终的评估报告，不要输出你的思考过程、分析步骤或任何中间推理内容。直接以"# 留学申请竞争力评估报告"开头，输出完整的报告内容。

## 学生背景信息

**基础信息：**
- 姓名：${formData.basic.name || '未填写'}
- 年龄：${formData.basic.age}岁
- 在读院校：${formData.basic.university === '985' ? '985院校' : formData.basic.university === '211' ? '211院校' : formData.basic.university === 'overseas' ? '海外院校' : '普通本科'}
- GPA：${formData.basic.gpa.toFixed(1)}/4.0
- 语言成绩：${formData.basic.language || '未填写'}

**学术背景：**
- 学历层次：${formData.academic.degree}
- 专业方向：${formData.academic.majors.length > 0 ? formData.academic.majors.join('、') : '未选择'}
- 均分：${formData.academic.averageScore}/100

**科研经历：** ${researchDetails}

**实习经历：** ${internshipDetails}

**竞赛获奖：** ${competitionDetails}

**志愿服务：** ${formData.practice.volunteers.length > 0 ? formData.practice.volunteers.map(v => `${v.organization}（${v.role}）`).join('、') : '无'}

## 系统初步评分（仅供参考）

- 学术能力：${scores.academic.toFixed(1)}/5.0
- 语言能力：${scores.language.toFixed(1)}/5.0
- 科研经历：${scores.research.toFixed(1)}/5.0
- 实践背景：${scores.practice.toFixed(1)}/5.0
- 综合评分：${scores.overall.toFixed(1)}/5.0

---

请生成一份详细的评估报告，包含以下内容（使用Markdown格式）：

### 1. 综合竞争力评价
用2-3句话概括该学生的整体竞争力水平，指出最突出的优势和需要改进的方面。

### 2. 各维度详细分析

**学术背景分析：**
- 院校背景和GPA的竞争力评估
- 针对目标院校的学术要求差距分析

**语言能力分析：**
- 当前语言成绩的竞争力
- 是否需要重考或提升的建议

**科研经历分析：**
- 科研经历的含金量评估
- 如何在申请中突出科研亮点

**实践背景分析：**
- 实习、竞赛、志愿服务的综合评价
- 这些经历对申请的加分作用

### 3. 改进建议
列出3-5条具体、可操作的改进建议，帮助学生在申请前提升竞争力。

### 4. 选校方向建议
根据学生背景，推荐申请方向：
- 冲刺院校类型（建议2-3所）
- 匹配院校类型（建议3-5所）
- 保底院校类型（建议2-3所）

注意：
- 分析要具体、有针对性，避免泛泛而谈
- 建议要切实可行，考虑时间成本
- 如果某些信息未填写，请合理推断或给出通用建议`
}
