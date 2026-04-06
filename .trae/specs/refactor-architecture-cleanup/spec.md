# 架构重构与开发体验优化 Spec

## Why

项目当前存在 3 个巨型组件（UniversityDatabase.vue 2182 行、SchoolRecommendation.vue 1540 行、AIChat.vue 1079 行），加上 Prompt 硬编码重复 4 处、localStorage 读写散落 8 处、路由内嵌 main.js、AIChat 使用 setInterval 轮询反模式等问题，导致**每次修改都需要在千行级别的文件中定位代码，开发体验极差，且容易引入回归 bug**。本次重构旨在通过拆分巨型文件、统一抽象层、消除重复代码，从根本上改善开发体验。

## What Changes

### Phase 1: 巨型组件拆分（止血）
- **拆分 UniversityDatabase.vue**（2182行 → 主文件 < 300行）
  - 提取 `UDHero.vue` — Hero 搜索区（标题、搜索框、标签、统计数字）
  - 提取 `UDSchoolPanel.vue` — 院校搜索 Tab（筛选芯片、卡片网格、列表视图、分页）
  - 提取 `UDMajorPanel.vue` — 专业搜索 Tab（筛选、专业卡片网格、对比功能）
  - 提取 `UDCompareModal.vue` — 专业对比模态框
  - 提取 `UDToast.vue` — 全局 Toast 通知组件
- **拆分 SchoolRecommendation.vue**（1540行 → 主文件 < 400行）
  - 提取 `RecEmptyState.vue` — 空状态引导页
  - 提取 `RecHeroSection.vue` — Hero 区域（数据展示 + Canvas）
  - 提取 `RecResultsHeader.vue` — 结果页头部统计
  - 提取 `RecFilterBar.vue` — 筛选排序栏
- **提取路由配置到独立文件**
  - 创建 `src/router/index.js`，从 `main.js` 中移除路由定义
  - 更新 `main.js` 仅保留插件注册和 app 挂载

### Phase 2: 核心逻辑统一（治本）
- **消除 AIChat setInterval 轮询反模式**
  - 移除 `setInterval` 轮询，改用 `useAIStream` 的 `onStream` 回调直接驱动 UI 更新
  - 简化消息更新逻辑，减少不必要的 reactive 触发
- **统一 Prompt 构建系统**
  - 创建 `src/prompts/` 目录
  - 提取 `formatUserProfile()` 公共函数（消除 4 处重复的用户背景格式化）
  - 提取 `buildRecommendationPrompt()` 到 `src/prompts/recommendationPrompts.ts`
  - 提取 `buildAnalysisPrompt()` 到 `src/prompts/analysisPrompts.ts`
  - 将硬编码在 `ai-api.js` 中的 system prompt 模板迁移到 `src/prompts/systemPrompts.ts`
  - 更新 `ai-api.js` 和 `useAIRecommendation.ts` 引用新模块
- **创建 localStorage 持久化抽象层**
  - 创建 `src/utils/storage.ts`，提供类型安全的 get/set/remove 方法
  - 统一管理所有 localStorage key（定义常量枚举）
  - 迁移 8 处分散的 `localStorage.getItem/setItem` 调用
- **ai-api.js TypeScript 化**
  - 重命名为 `ai-api.ts`
  - 补全函数参数和返回值类型标注
  - 移除 `useAIStream.ts` 中的 `as any` 类型断言
  - 补全 `useAIRecommendation.ts` 中 `assessment: any` 等弱类型

### Phase 3: 项目清理（健美）
- 删除空目录：`src/store/`、`src/assets/`、`src/ui/v1/`、`src/ui/v2/`、`src/ui/v3/`
- 删除备份文件：`src/views/SchoolRecommendation.vue.bak`
- 删除残留目录：`round_1/`、`round_2/`、`round_3/`
- 移除未使用的 `axios` 依赖（package.json 中 ai-api 使用原生 fetch）

## Impact

- Affected code:
  - `src/views/UniversityDatabase.vue` — 主拆分目标
  - `src/views/SchoolRecommendation.vue` — 主拆分目标
  - `src/views/AIChat.vue` — 修复轮询反模式
  - `src/utils/ai-api.js` → `ai-api.ts` — TS 化 + Prompt 迁移
  - `src/composables/useAIStream.ts` — 消除 any 断言
  - `src/composables/useAIRecommendation.ts` — Prompt 抽取 + 类型补全
  - `src/main.js` — 路由提取
  - `package.json` — 移除 axios
- 新增文件：
  - `src/router/index.js`
  - `src/utils/storage.ts`
  - `src/prompts/systemPrompts.ts`
  - `src/prompts/recommendationPrompts.ts`
  - `src/prompts/analysisPrompts.ts`
  - `src/prompts/index.ts`
  - `src/components/university-db/UDHero.vue`
  - `src/components/university-db/UDSchoolPanel.vue`
  - `src/components/university-db/UDMajorPanel.vue`
  - `src/components/university-db/UDCompareModal.vue`
  - `src/components/university-db/UDToast.vue`
  - `src/components/school-rec/RecEmptyState.vue`
  - `src/components/school-rec/RecHeroSection.vue`
  - `src/components/school-rec/RecResultsHeader.vue`
  - `src/components/school-rec/RecFilterBar.vue`

## ADDED Requirements

### Requirement: 组件拆分规范
拆分后的子组件 SHALL 遵循以下规则：
1. 每个 SFC 文件不超过 400 行（含 style）
2. 子组件通过 props 接收数据，通过 emit 向父组件通信
3. 保持原有 BEM 命名风格（`ud-` / `rec-` 前缀）
4. 所有 CSS 变量引用保持不变（不引入新配色）
5. 响应式断点行为与拆分前完全一致

#### Scenario: UniversityDatabase 拆分后功能完整性
- **WHEN** 用户打开 `/university-database` 路由
- **THEN** 页面渲染效果与拆分前完全一致（Hero + 搜索 + 双Tab + 筛选 + 卡片/列表切换 + 分页 + 对比模态框 + Toast）
- **AND** 所有交互正常（收藏、搜索、筛选、排序、对比）

#### Scenario: SchoolRecommendation 拆分后功能完整性
- **WHEN** 用户打开 `/school-recommendation` 路由
- **THEN** 页面渲染效果与拆分前完全一致（空状态 / Hero + 偏好收集 / 结果展示 + 筛选排序 + 对话框）
- **AND** AI 推荐流程正常工作

### Requirement: 路由独立
路由配置 SHALL 从 main.js 提取到 `src/router/index.js`：
1. 保持 Hash 模式（`createWebHashHistory`）
2. 保持所有路由路径、懒加载、meta 不变
3. main.js 仅负责 `createApp → 注册插件 → use(router) → mount`

#### Scenario: 路由提取后导航正常
- **WHEN** 用户在任意页面间导航
- **THEN** 所有路由跳转正常工作，面包屑/高亮状态正确

### Requirement: Prompt 统一管理
系统 SHALL 提供统一的 Prompt 构建层：
1. `formatUserProfile(assessment)` 函数只存在一份，被所有 prompt builder 共享
2. System prompt 模板集中管理在 `src/prompts/systemPrompts.ts`
3. 推荐/分析 prompt 各自有独立的 builder 函数
4. 修改用户背景格式化逻辑只需改一处

#### Scenario: Prompt 修改同步
- **WHEN** 开发者修改了 `formatUserProfile()` 的输出格式
- **THEN** 所有使用该函数的 prompt builder 自动生效（推荐 prompt / 分析 prompt / assessment prompt / chat system prompt）

### Requirement: localStorage 抽象层
系统 SHALL 通过 `src/utils/storage.ts` 统一管理持久化：
1. 定义 `StorageKey` 枚举列举所有 key
2. 提供 `get<T>(key): T | null`、`set<T>(key, value: T): void`、`remove(key): void` 方法
3. 内部做 JSON 序列化/反序列化和 try-catch
4. 所有组件不再直接调用 `localStorage.getItem/setItem`

#### Scenario: 数据持久化一致性
- **WHEN** 任一组件写入收藏列表
- **THEN** 其他页面读取到的收藏列表一致（通过统一 storage 层）

### Requirement: AIChat 流式更新修复
AIChat.vue SHALL 使用回调驱动替代轮询：
1. 移除 `setInterval(pollInterval, ...)` 
2. 在 `stream.generateWithProvider()` 调用时传入 `onStream` 回调
3. 回调内直接更新 `messages[aiIdx]` 的 content 和 reasoning
4. UI 更新频率由 stream chunk 驱动而非定时器

#### Scenario: 流式输出平滑性
- **WHEN** AI 正在流式输出回复
- **THEN** 文字逐段/逐字显示，无闪烁、无跳跃、无 100ms 延迟感

## MODIFIED Requirements

### Requirement: TypeScript 类型安全
现有 JS/TS 混用代码 SHALL 逐步统一为 TypeScript：
1. `ai-api.js` → `ai-api.ts`：所有函数参数和返回值有明确类型
2. `useAIStream.ts`：消除 `as any[]` 和 `as any` 类型断言
3. `useAIRecommendation.ts`：`assessment` 参数从 `any` 改为具体类型接口
4. `vue-tsc --noEmit` 类型检查必须通过（零错误）

## REMOVED Requirements

### Requirement: axios 依赖
**Reason**: 项目中所有 HTTP 请求均使用原生 `fetch`（ai-api.js），axios 未被任何代码 import。
**Migration**: 从 `package.json` 的 dependencies 中移除 `axios`，运行 `npm install` 更新 lock 文件。
