# AI 流式输出统一服务使用指南 v2.1

## 概述

这套统一服务解决了以下问题：
- ✅ 自动开启深度思考模式（可配置）
- ✅ 流式输出显示
- ✅ 思考过程折叠/展开
- ✅ 状态持久化（localStorage，永久保留）
- ✅ 离开页面后状态不丢失
- ✅ 错误处理和自动重试
- ✅ 中止请求
- ✅ **请求队列和并发控制**
- ✅ **Markdown 渲染和代码高亮**
- ✅ **统一的配置管理**
- ✅ **等待状态渐进式指示器** (v2.1 新增)

## 架构

```
src/composables/
├── useGlobalAIState.ts   # 全局状态管理（队列、并发、持久化）
├── useAIStream.ts        # 流式 AI 服务（重试、错误处理）
└── useAIConfig.ts        # AI 配置管理（Provider、全局配置）

src/components/common/
└── AIStreamDisplay.vue   # 通用的流式显示组件（Markdown、代码高亮）
```

## 快速开始

### 1. 基础用法

```vue
<template>
  <div>
    <!-- 使用通用显示组件 -->
    <AIStreamDisplay
      :content="content"
      :reasoning="reasoning"
      :is-streaming="isStreaming"
      :is-thinking="isThinking"
      :show-reasoning="showReasoning"
      :can-retry="canRetry"
      :retry-count="retryCount"
      :max-retries="maxRetries"
      @retry="retry"
    />
    
    <!-- 发送按钮 -->
    <el-button 
      :loading="isLoading" 
      :disabled="isQueued"
      @click="handleGenerate"
    >
      {{ isQueued ? `排队中 (${queuePosition})` : '生成' }}
    </el-button>
    
    <!-- 停止按钮 -->
    <el-button 
      v-if="isStreaming" 
      @click="stop"
    >
      停止
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useAIStream } from '@/composables/useAIStream'
import AIStreamDisplay from '@/components/common/AIStreamDisplay.vue'

const {
  content,
  reasoning,
  showReasoning,
  isStreaming,
  isThinking,
  isQueued,
  isLoading,
  queuePosition,
  canRetry,
  retryCount,
  maxRetries,
  generate,
  stop,
  retry
} = useAIStream({
  taskId: 'my-ai-task-001',
  enableThinking: true,  // 或 false，不设置则使用全局配置
  autoRetry: true,       // 自动重试
  priority: 0,           // 优先级，数字越大越优先
  onComplete: (content, reasoning) => {
    console.log('生成完成:', content)
  },
  onError: (error) => {
    console.error('生成失败:', error)
  },
  onQueueChange: (position) => {
    console.log('排队位置:', position)
  }
})

const handleGenerate = async () => {
  const messages = [
    { role: 'user', content: '你好，请介绍一下自己' }
  ]
  
  try {
    await generate(messages)
  } catch (e) {
    console.error(e)
  }
}
</script>
```

### 2. 使用指定 Provider

```typescript
const { generateWithProvider } = useAIStream({
  taskId: 'my-task'
})

// 使用指定的 provider
await generateWithProvider('provider-id', messages, {
  temperature: 0.8,
  maxTokens: 4000
})
```

### 3. 状态恢复（离开页面后回来）

```vue
<script setup>
const { restore, isCompleted, content } = useAIStream({
  taskId: 'persistent-task',
  autoRestore: true  // 默认为 true
})

onMounted(() => {
  // 手动恢复状态
  const restored = restore()
  if (restored) {
    console.log('恢复了之前的结果:', content.value)
  }
})
</script>
```

### 4. 全局配置管理

```typescript
import { useAIConfig } from '@/composables/useAIConfig'
import { useGlobalAIState } from '@/composables/useGlobalAIState'

// AI Provider 管理
const {
  getProviders,
  addProvider,
  updateProvider,
  removeProvider,
  getDefaultProvider,
  setDefaultProvider,
  isConfigured
} = useAIConfig()

// 全局配置
const globalState = useGlobalAIState()
const { setConfig, getConfig } = globalState

// 设置全局配置
setConfig({
  defaultEnableThinking: true,  // 默认开启深度思考
  defaultTemperature: 0.7,      // 默认温度
  defaultMaxTokens: 4096,       // 默认最大 token
  maxConcurrent: 3,             // 最大并发数
  retryAttempts: 3,             // 重试次数
  retryDelay: 1000,             // 重试延迟（毫秒）
  timeout: 60000                // 超时时间（毫秒）
})

// 获取当前配置
const config = getConfig()
```

### 5. 请求队列和并发控制

```typescript
// 当并发请求超过 maxConcurrent 时，请求会自动排队
const task1 = useAIStream({ taskId: 'task-1', priority: 1 })
const task2 = useAIStream({ taskId: 'task-2', priority: 2 })  // 优先级更高
const task3 = useAIStream({ taskId: 'task-3', priority: 0 })

// 监听排队状态
const { isQueued, queuePosition, onQueueChange } = useAIStream({
  taskId: 'my-task',
  onQueueChange: (position) => {
    console.log(`当前排队位置: ${position}`)
  }
})
```

### 6. 手动控制思考过程显示

```vue
<template>
  <div>
    <el-button @click="toggleReasoning">
      {{ showReasoning ? '隐藏' : '显示' }}思考过程
    </el-button>
    
    <AIStreamDisplay
      :content="content"
      :reasoning="reasoning"
      :show-reasoning="showReasoning"
    />
  </div>
</template>

<script setup>
const { showReasoning, toggleReasoning, setShowReasoning } = useAIStream({
  taskId: 'my-task'
})

// 或者直接设置
setShowReasoning(false)
</script>
```

## API 参考

### useAIStream(options)

#### 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| taskId | string | 必填 | 任务唯一标识 |
| enableThinking | boolean | 全局设置 | 是否开启深度思考 |
| collapseReasoningOnContent | boolean | true | 收到正式内容时折叠思考过程 |
| autoRestore | boolean | true | 自动恢复状态 |
| autoRetry | boolean | false | 是否自动重试 |
| priority | number | 0 | 优先级，数字越大越优先 |
| onComplete | function | - | 完成回调 |
| onError | function | - | 错误回调 |
| onStream | function | - | 流式更新回调 |
| onStateChange | function | - | 状态变化回调 |
| onQueueChange | function | - | 排队位置变化回调 |

#### 返回值

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| state | computed | 当前状态（idle/queued/connecting/thinking/streaming/completed/error） |
| content | computed | 正式内容 |
| reasoning | computed | 思考过程 |
| error | computed | 错误信息 |
| showReasoning | computed | 是否显示思考过程 |
| isStreaming | computed | 是否正在输出 |
| isThinking | computed | 是否正在思考 |
| **isConnecting** | **computed (v2.1)** | **是否正在连接 API** |
| isQueued | computed | 是否在排队 |
| isCompleted | computed | 是否完成 |
| hasError | computed | 是否有错误 |
| hasContent | computed | 是否有内容 |
| hasReasoning | computed | 是否有思考过程 |
| isLoading | computed | 是否加载中（包括连接、排队） |
| **waitingPhase** | **computed (v2.1)** | **等待阶段：connecting / processing / ready** |
| queuePosition | computed | 排队位置 |
| canRetry | computed | 是否可以重试 |
| retryCount | computed | 已重试次数 |
| maxRetries | computed | 最大重试次数 |
| generate | function | 发起请求（使用默认 provider） |
| generateWithProvider | function | 使用指定 provider 发起请求 |
| stop | function | 停止生成 |
| reset | function | 重置状态 |
| retry | function | 手动重试 |
| toggleReasoning | function | 切换思考过程显示 |
| setShowReasoning | function | 设置思考过程显示 |
| restore | function | 手动恢复状态 |

### AIStreamDisplay 组件

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| content | string | '' | 正式内容（支持 Markdown） |
| reasoning | string | '' | 思考过程 |
| error | string | '' | 错误信息 |
| isStreaming | boolean | false | 是否正在输出 |
| isThinking | boolean | false | 是否正在思考 |
| isQueued | boolean | false | 是否在排队 |
| showReasoning | boolean | true | 是否显示思考过程 |
| queuePosition | number | 0 | 排队位置 |
| canRetry | boolean | false | 是否可以重试 |
| retryCount | number | 0 | 已重试次数 |
| maxRetries | number | 3 | 最大重试次数 |
| defaultExpanded | boolean | true | 思考过程默认是否展开 |

#### Events

| 事件 | 说明 |
|------|------|
| toggle-reasoning | 点击思考过程标题时触发 |
| retry | 点击重试按钮时触发 |

### useAIConfig()

#### 返回值

| 方法 | 说明 |
|------|------|
| getProviders() | 获取所有 AI Provider |
| saveProviders(providers) | 保存 Provider 列表 |
| addProvider(provider) | 添加新 Provider |
| updateProvider(id, updates) | 更新 Provider |
| removeProvider(id) | 删除 Provider |
| getDefaultProvider() | 获取默认 Provider |
| setDefaultProvider(id) | 设置默认 Provider |
| getGlobalConfig() | 获取全局配置 |
| setGlobalConfig(config) | 设置全局配置 |
| isConfigured() | 检查是否已配置 |
| validateProvider(provider) | 验证 Provider 配置 |
| exportConfig() | 导出配置为 JSON |
| importConfig(json) | 从 JSON 导入配置 |

### useGlobalAIState()

#### 返回值

| 方法 | 说明 |
|------|------|
| getTask(taskId) | 获取任务 |
| hasTask(taskId) | 检查任务是否存在 |
| isTaskActive(taskId) | 检查任务是否活跃 |
| canStartTask() | 检查是否可以开始新任务 |
| getQueuePosition(taskId) | 获取排队位置 |
| clearAllTasks() | 清空所有任务 |
| setDefaultEnableThinking(value) | 设置默认开启思考 |
| getDefaultEnableThinking() | 获取默认开启思考设置 |
| getActiveTasks() | 获取活跃任务列表 |
| getQueuedTasks() | 获取排队任务列表 |

## 最佳实践

### 1. TaskId 命名规范

```typescript
// 推荐：使用功能模块 + 具体功能作为 taskId
const TASK_ID = 'school-recommendation-analysis'
const TASK_ID = 'essay-polish'
const TASK_ID = 'chat-session-123'
```

### 2. 页面离开后恢复

```vue
<script setup>
const { restore, isCompleted, content } = useAIStream({
  taskId: 'important-task',
  autoRestore: true
})

onMounted(() => {
  if (restore()) {
    ElMessage.success('已恢复之前的进度')
  }
})
</script>
```

### 3. 清理不需要的任务

```typescript
import { useGlobalAIState } from '@/composables/useGlobalAIState'

const globalState = useGlobalAIState()

// 删除单个任务
globalState.removeTask('old-task-id')

// 清空所有任务
globalState.clearAllTasks()
```

### 4. 处理并发限制

```typescript
// 当 API 有并发限制时，设置合适的 maxConcurrent
const globalState = useGlobalAIState()
globalState.setConfig({
  maxConcurrent: 1  // 同时只允许一个请求
})
```

### 5. 错误处理和重试

```vue
<template>
  <AIStreamDisplay
    :content="content"
    :error="error"
    :can-retry="canRetry"
    :retry-count="retryCount"
    :max-retries="maxRetries"
    @retry="handleRetry"
  />
</template>

<script setup>
const { canRetry, retry } = useAIStream({
  taskId: 'my-task',
  autoRetry: false,  // 手动控制重试
  onError: (error) => {
    if (canRetry.value) {
      ElMessage.warning(`请求失败，可以重试`)
    }
  }
})

const handleRetry = async () => {
  try {
    await retry()
  } catch (e) {
    ElMessage.error('重试失败')
  }
}
</script>
```

## 新功能（v2.0）

### 1. 请求队列和并发控制

当同时发起多个 AI 请求时，系统会自动管理请求队列：
- 超过 `maxConcurrent` 的请求会自动排队
- 支持优先级排序，优先级高的请求先执行
- 实时显示排队位置

### 2. 自动重试机制

```typescript
// 自动重试（指数退避）
const { retryCount, maxRetries } = useAIStream({
  taskId: 'my-task',
  autoRetry: true  // 失败后自动重试，最多 3 次
})

// 手动重试
const { canRetry, retry } = useAIStream({
  taskId: 'my-task',
  autoRetry: false
})

if (canRetry.value) {
  await retry()
}
```

### 3. Markdown 渲染

`AIStreamDisplay` 组件现在支持：
- 标题（h1-h6）
- 列表（有序、无序）
- 代码块（带语法高亮样式）
- 引用块
- 表格
- 链接

### 4. 统一配置管理

```typescript
// 在应用启动时设置全局配置
import { useGlobalAIState } from '@/composables/useGlobalAIState'

const globalState = useGlobalAIState()
globalState.setConfig({
  defaultEnableThinking: true,  // 除了 AI Chat，其他页面默认开启
  maxConcurrent: 3,
  retryAttempts: 3,
  waitingState: {               // 等待状态配置 (v2.1)
    phases: {
      connecting: { text: '正在连接...', delay: 800 },
      processing: { text: 'AI 正在分析...', delay: 0 }
    },
    showDots: true,             // 显示跳动圆点动画
    showSkeleton: true          // 显示骨架屏效果
  }
})
```

## ⚡ 核心规则：所有 AI 页面必须遵循的骨架规范

> **重要**：这是本项目中所有使用 AI 功能的页面必须遵循的基本规则。

### 规则 1：等待状态渐进式指示器（必选）

当用户发送消息后、AI 开始输出内容前，**禁止显示空白气泡**。必须显示等待状态指示器：

```
时间线：
[用户发送] ──▶ [connecting: "正在连接..."] ──▶ [processing: "AI 正在分析..."] ──▶ [流式输出开始]
                ↑ 跳动圆点动画                    ↑ 跳动圆点动画                 隐藏指示器，显示实际内容
```

#### 实现方式

```vue
<template>
  <div class="message-text">
    <!-- 等待状态：渐进式指示器 -->
    <div
      v-if="isLoading && isLastMessage(msg) && !msg.content && !msg.reasoning"
      class="waiting-indicator"
    >
      <div class="waiting-dots">
        <span class="dot" />
        <span class="dot" />
        <span class="dot" />
      </div>
      <span class="waiting-text">{{ waitingText }}</span>
    </div>
    <!-- 实际内容 -->
    <template v-else>
      <span v-html="renderMarkdown(msg.content)" />
      <span v-if="isGenerating && isLastMessage(msg)" class="typing-cursor" />
    </template>
  </div>
</template>

<script setup>
const { isLoading, waitingPhase, isGenerating } = useAIStream({ taskId: 'xxx' })

const waitingText = computed(() => {
  if (waitingPhase.value === 'connecting') return '正在连接...'
  if (waitingPhase.value === 'processing') return 'AI 正在分析...'
  return ''
})
</script>
```

#### 状态说明

| waitingPhase | 含义 | 显示文字 | 触发条件 |
|-------------|------|---------|---------|
| `connecting` | 正在连接 API | "正在连接..." | 发起请求后，首个 chunk 到达前 |
| `processing` | AI 正在处理 | "AI 正在分析..." | 连接成功，思考中或等待首字节 |
| `ready` | 有内容了 | (隐藏) | 收到 content 或 reasoning |

### 规则 2：深度思考模式控制

| 页面 | 默认值 | 说明 |
|------|--------|------|
| **AI Chat** (`/ai-chat`) | `false` | 追求响应速度 |
| **其他所有 AI 页面** | `true` | 追求回答质量 |

```typescript
// AI Chat 页面 - 显式关闭
useAIStream({
  taskId: 'chat-xxx',
  enableThinking: false  // 关闭思考模式，提升速度
})

// 其他页面 - 不传或传 true，使用全局默认值
useAIStream({
  taskId: 'recommendation-xxx'
  // enableThinking 不设置 → 使用全局默认 true
})
```

### 规则 3：enableThinking=false 时完全禁用模型思考

不仅仅是隐藏 UI，而是 **API 层面禁用思考模式**：

```javascript
// ai-api.js buildRequestBody 中：
if (options.enableThinking) {
  baseBody.thinking = { type: 'enabled' }   // 开启
} else {
  baseBody.thinking = { type: 'disabled' }  // 完全禁用！
}
```

这确保关闭思考时，模型不会浪费时间生成 `reasoning_content`。

### 规则 4：自动滚动与用户交互

- 默认启用 `autoScroll: true`
- 用户上滚超过 **300px** → 锁定自动滚动
- 用户滚回底部 **150px** 内 → 恢复自动滚动
- 这确保用户可以自由查看历史内容

### 规则 5：组件图标必须使用 markRaw

```vue
<script setup>
import { markRaw } from 'vue'
import { School, Document } from '@element-plus/icons-vue'

// ✅ 正确：防止 Vue 将组件变成响应式对象
const agents = ref([
  { icon: markRaw(School), ... },
  { icon: markRaw(Document), ... }
])
</script>
```
