# Checklist

## Phase 1: 巨型组件拆分

- [ ] 路由提取：`src/router/index.js` 存在且包含完整路由定义（10 个路由 + 懒加载）
- [ ] 路由提取：`src/main.js` 不再包含 `createRouter` / `createWebHashHistory` / routes 数组
- [ ] 路由提取：所有页面导航正常（首页 → assessment → school-recommendation → timeline → materials → university-database → ai-chat → ai-config）
- [ ] 路由提取：详情页跳转正常（/school-detail/:id, /major-detail/:id）

- [ ] UniversityDatabase 拆分：主文件 `UniversityDatabase.vue` < 400 行
- [ ] UniversityDatabase 拆分：`UDHero.vue` 独立存在，包含标题、搜索框、标签、统计数字
- [ ] UniversityDatabase 拆分：`UDSchoolPanel.vue` 独立存在，包含院校筛选、卡片网格、列表视图、分页
- [ ] UniversityDatabase 拆分：`UDMajorPanel.vue` 独立存在，包含专业筛选、专业卡片、对比功能
- [ ] UniversityDatabase 拆分：`UDCompareModal.vue` 独立存在，包含专业对比表格模态框
- [ ] UniversityDatabase 拆分：`UDToast.vue` 独立存在，包含 Toast 通知（Teleport + 动画）
- [ ] UniversityDatabase 拆分：搜索功能正常（关键词搜索 + 标签搜索）
- [ ] UniversityDatabase 拆分：筛选芯片交互正常（国家/排名/专业筛选激活态切换）
- [ ] UniversityDatabase 拆分：卡片/列表视图切换正常
- [ ] UniversityDatabase 拆分：收藏功能正常（localStorage 读写一致）
- [ ] UniversityDatabase 拆分：分页器正常工作
- [ ] UniversityDatabase 拆分：专业对比模态框打开/关闭/数据展示正常
- [ ] UniversityDatabase 拆分：Toast 通知显示/消失正常
- [ ] UniversityDatabase 拆分：响应式布局在桌面端(≥1200px)/平板端(768-1199px)/移动端(≤767px) 正常

- [ ] SchoolRecommendation 拆分：主文件 `SchoolRecommendation.vue` < 500 行
- [ ] SchoolRecommendation 拆分：`RecEmptyState.vue` 独立存在
- [ ] SchoolRecommendation 拆分：`RecHeroSection.vue` 独立存在（含 Canvas 数据可视化）
- [ ] SchoolRecommendation 拆分：`RecResultsHeader.vue` 独立存在（含 CountUp 动画数字）
- [ ] SchoolRecommendation 拆分：`RecFilterBar.vue` 独立存在（含筛选按钮和排序下拉）
- [ ] SchoolRecommendation 拆分：空状态页渲染正确（无评估时显示引导）
- [ ] SchoolRecommendation 拆分：偏好收集 → AI 推荐 → 结果展示流程完整可用
- [ ] SchoolRecommendation 拆分：结果筛选（全部/核心/备选）和排序正常
- [ ] SchoolRecommendation 拆分：学校分析对话框打开和流式输出正常

## Phase 2: 核心逻辑统一

- [ ] AIChat 修复：`AIChat.vue` 中不存在 `setInterval` 轮询代码
- [ ] AIChat 修复：发送消息后流式输出逐字/逐段显示平滑
- [ ] AIChat 修复：思考过程（reasoning）展开/折叠正常
- [ ] AIChat 修复：停止生成按钮正常工作
- [ ] AIChat 修复：重新生成最后一条回复正常
- [ ] AIChat 修复：对话历史保存和恢复正常（切换页面再回来不丢失）

- [ ] Prompt 统一：`src/prompts/formatHelpers.ts` 存在且导出 `formatUserProfile`
- [ ] Prompt 统一：`src/prompts/systemPrompts.ts` 存在且包含所有 system prompt 模板
- [ ] Prompt 统一：`src/prompts/recommendationPrompts.ts` 存在且导出 `buildRecommendationPrompt`
- [ ] Prompt 统一：`src/prompts/analysisPrompts.ts` 存在且导出 `buildAnalysisPrompt`
- [ ] Prompt 统一：`src/prompts/index.ts` 存在并统一导出
- [ ] Prompt 统一：ai-api.js(ts) 和 useAIRecommendation.ts 均从 prompts 模块导入，不再内联 prompt 字符串
- [ ] Prompt 统一：AI 推荐功能输出与修改前一致（推荐学校数量、匹配度、分类合理）
- [ ] Prompt 统一：AI 分析功能输出与修改前一致（差距分析、风险提示、建议）

- [ ] Storage 抽象：`src/utils/storage.ts` 存在且定义 StorageKey 枚举
- [ ] Storage 抽象：提供 get/set/remove 三个泛型方法，内部做 JSON 序列化和 try-catch
- [ ] Storage 抽象：UniversityDatabase.vue 中无直接 `localStorage.getItem/setItem` 调用
- [ ] Storage 抽象：SchoolRecommendation.vue 中无直接 `localStorage.getItem/setItem` 调用
- [ ] Storage 抽象：AIChat.vue 中无直接 `localStorage.getItem/setItem` 调用
- [ ] Storage 抽象：ai-api.ts 中无直接 `localStorage.getItem/setItem` 调用
- [ ] Storage 抽象：useAIStream.ts 中无直接 `localStorage.getItem/setItem` 调用
- [ ] Storage 抽象：收藏列表跨页面一致性（院校库收藏 ↔ 推荐页收藏同步）
- [ ] Storage 抽置：对话历史刷新后恢复正常

- [ ] TS 化：`src/utils/ai-api.js` 已重命名为 `ai-api.ts`（原文件不存在）
- [ ] TS 化：ai-api.ts 所有导出函数有完整的参数类型和返回值类型
- [ ] TS 化：useAIStream.ts 中无 `as any` 类型断言
- [ ] TS 化：`src/types/ai.ts` 存在且包含核心类型定义
- [ ] TS 化：useAIRecommendation.ts 的 assessment 参数有具体类型（非 any）
- [ ] TS 化：`npm run typecheck` 通过，零错误

## Phase 3: 项目清理

- [ ] 清理：`src/store/` 目录已删除
- [ ] 清理：`src/assets/` 目录已删除
- [ ] 清理：`src/ui/v1/`, `v2/`, `v3/` 目录已删除
- [ ] 清理：`src/views/SchoolRecommendation.vue.bak` 已删除
- [ ] 清理：`round_1/`, `round_2/`, `round_3/` 目录已删除
- [ ] 清理：`package.json` dependencies 中不再包含 `axios`
- [ ] 清理：`npm run dev` 启动成功，无报错
- [ ] 清理：`npm run build` 构建成功，无报错
- [ ] 清理：`npm run lint` 通过，零 error

## 全局验证

- [ ] 所有页面正常渲染，无白屏、无控制台报错
- [ ] 配色合规：未引入新颜色（仅使用 #0F172A / #D97706 / #FFFFFF 及已有 CSS 变量）
- [ ] AI 功能完整链路：配置 API Key → 对话/推荐/分析 均正常
- [ ] 减少动画偏好：@media (prefers-reduced-motion) 规则保留
