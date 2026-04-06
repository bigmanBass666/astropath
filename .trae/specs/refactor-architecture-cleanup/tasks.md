# Tasks

## Phase 1: 巨型组件拆分（止血）

- [ ] Task 1.1: 提取路由配置到独立文件
  - [ ] 创建 `src/router/index.js`，将 main.js 中的路由定义（createRouter + routes 数组）完整迁移
  - [ ] 更新 `src/main.js`，移除内联路由代码，改为 `import router from './router'` + `app.use(router)`
  - [ ] 验证所有页面导航正常

- [ ] Task 1.2: 拆分 UniversityDatabase.vue — 提取子组件
  - [ ] 创建 `src/components/university-db/UDHero.vue`：提取 Hero 区域（template L18-93 + script 中的 hero 相关逻辑 + 对应 style）
  - [ ] 创建 `src/components/university-db/UDSchoolPanel.vue`：提取院校 Tab（筛选、卡片网格/列表视图、分页）
  - [ ] 创建 `src/components/university-db/UDMajorPanel.vue`：提取专业 Tab（筛选、专业卡片、对比栏、对比模态框）
  - [ ] 创建 `src/components/university-db/UDToast.vue`：提取 Toast 通知（Teleport + 动画样式）
  - [ ] 重构主文件 `UniversityDatabase.vue` 为组合容器（< 300 行），引入上述子组件
  - [ ] 验证所有交互功能正常（搜索、筛选、收藏、分页、对比模态框）

- [ ] Task 1.3: 拆分 SchoolRecommendation.vue — 提取子组件
  - [ ] 创建 `src/components/school-rec/RecEmptyState.vue`：提取空状态引导页
  - [ ] 创建 `src/components/school-rec/RecHeroSection.vue`：提取 Hero 区域（数据展示 + ConstellationCanvas）
  - [ ] 创建 `src/components/school-rec/RecResultsHeader.vue`：提取结果页头部统计（CountUp + 进度条）
  - [ ] 创建 `src/components/school-rec/RecFilterBar.vue`：提取筛选排序栏
  - [ ] 重构主文件 `SchoolRecommendation.vue` 为组合容器（< 400 行），引入上述子组件
  - [ ] 验证 AI 推荐流程完整可用

## Phase 2: 核心逻辑统一（治本）

- [ ] Task 2.1: 修复 AIChat setInterval 轮询反模式
  - [ ] 移除 AIChat.vue 中 `setInterval(pollInterval, ...)` 轮询代码块
  - [ ] 在 `stream.generateWithProvider()` 调用时传入 `onStream` 回调，直接更新 messages[aiIdx]
  - [ ] 简化 stream 初始化，复用已有的 useAIStream 实例而非每次 sendMessage 新建
  - [ ] 验证流式输出效果平滑无闪烁

- [ ] Task 2.2: 统一 Prompt 构建系统
  - [ ] 创建 `src/prompts/formatHelpers.ts`：提取 `formatUserProfile(assessment)` 公共函数
  - [ ] 创建 `src/prompts/systemPrompts.ts`：迁移 ai-api.js 中的 EMPTY_USER_GUIDANCE_PROMPT 和 buildSystemPrompt
  - [ ] 创建 `src/prompts/recommendationPrompts.ts`：从 useAIRecommendation.ts 迁移 buildRecommendationPrompt
  - [ ] 创建 `src/prompts/analysisPrompts.ts`：从 useAIRecommendation.ts 迁移 buildAnalysisPrompt
  - [ ] 创建 `src/prompts/index.ts`：统一导出
  - [ ] 更新 `ai-api.ts` 引用新的 prompts 模块
  - [ ] 更新 `useAIRecommendation.ts` 引用新的 prompts 模块
  - [ ] 验证 AI 推荐和分析功能 prompt 输出与修改前一致

- [ ] Task 2.3: 创建 localStorage 持久化抽象层
  - [ ] 创建 `src/utils/storage.ts`：
    - 定义 `StorageKey` 枚举（SCHOOL_FAVORITES, ASSESSMENT_REPORT, SCHOOL_RECOMMENDATIONS, AI_PROVIDERS, CONVERSATIONS, CHAT_CURRENT_STATE, ASSESSMENT_FORM）
    - 实现 `get<T>(key: StorageKey): T | null`
    - 实现 `set<T>(key: StorageKey, value: T): void`
    - 实现 `remove(key: StorageKey): void`
  - [ ] 迁移 UniversityDatabase.vue 中的 localStorage 调用 → storage.ts
  - [ ] 迁移 SchoolRecommendation.vue 中的 localStorage 调用 → storage.ts
  - [ ] 迁移 AIChat.vue 中的 localStorage 调用 → storage.ts
  - [ ] 迁移 ai-api.ts 中的 localStorage 调用 → storage.ts
  - [ ] 迁移 useAIStream.ts 中的 localStorage 调用 → storage.ts
  - [ ] 验证数据持久化和跨页面读取正常

- [ ] Task 2.4: TypeScript 化核心模块
  - [ ] 重命名 `src/utils/ai-api.js` → `src/utils/ai-api.ts`
  - [ ] 为 ai-api.ts 所有函数补全参数类型和返回值类型（sendMessageToAI, getProviders, buildRequestBody, buildSystemPrompt, buildAssessmentPrompt, testProviderConnection 等）
  - [ ] 清理 useAIStream.ts 中的 `as any[]` / `as any` 类型断言，替换为正确类型
  - [ ] 在 `src/types/` 下创建 `ai.ts` 类型定义文件（ChatMessage, AIStreamOptions, ProviderConfig 等）
  - [ ] 将 useAIRecommendation.ts 的 `assessment: any` 参数改为具体接口类型
  - [ ] 运行 `npm run typecheck` 确保零错误

## Phase 3: 项目清理（健美）

- [ ] Task 3.1: 清理空目录和遗留文件
  - [ ] 删除空目录：`src/store/`, `src/assets/`, `src/ui/v1/`, `src/ui/v2/`, `src/ui/v3/`
  - [ ] 删除备份文件：`src/views/SchoolRecommendation.vue.bak`
  - [ ] 删除残留目录：`round_1/`, `round_2/`, `round_3/`

- [ ] Task 3.2: 移除未使用依赖
  - [ ] 从 `package.json` 的 dependencies 中移除 `axios`
  - [ ] 运行 `npm install` 更新 package-lock.json
  - [ ] 确认项目正常启动和构建

# Task Dependencies
- [Task 1.2] 无依赖，可与 Task 1.1 并行
- [Task 1.3] 无依赖，可与 Task 1.1 并行
- [Task 2.1] 无依赖，可与 Phase 1 并行
- [Task 2.2] 建议在 Task 1.3 之后（理解推荐流程结构后更清晰）
- [Task 2.3] 建议在 Task 1.2 + Task 1.3 之后（需要知道哪些组件用了 localStorage）
- [Task 2.4] 建议在 Task 2.2 之后（类型定义可复用）
- [Task 3.1] 必须在 Phase 1 全部完成后（避免删除正在编辑的文件）
- [Task 3.2] 可随时执行
