# 智途 AstroPath — 项目规则

## 项目信息
- **名称**: 智途 AstroPath，一站式智能留学规划平台
- **技术栈**: Vue 3 + Vite + Element Plus + Pinia + Vue Router
- **比赛**: 人工智能学院第四届科创节网页设计大赛（2026/4/7）
- **评分**: 设计40 + 功能30 + **创新30（AI交互）** + 展示10
- **详细规则**: `docs/competition.md`

## 硬性约束
- **设计系统**: Slate+Amber极简双色，主色#0F172A 强调色#D97706（见`src/styles/variables.css`），严禁引入新配色
- **数据诚实**: 院校数量用真实值55+，不夸大
- **文案规范**: 副标题"AI 智能解析背景，为你生成专属留学路线图"；数据亮点"55+精选院校 / 6大核心场景 / Multi-AI智能协同"
- **中英混排**: Multi-AI 等术语保持原样不翻译
- **安全**: `AIConfig.vue`有硬编码API Key，严禁提交git或公开暴露
- **优先级**: AI交互相关优化 > 其他功能（创新性30分是关键得分点）

## 核心模块
首页 → 背景评估(/assessment) → AI选校(/school-recommendation) → 时间规划(/timeline) → 材料中心(/materials) → 院校库(/university-database) → AI对话(/ai-chat) → AI配置(/ai-config)

## 关键文件
- 院校数据: `src/utils/recommendationEngine.js`(55所)
- AI流式状态: `src/composables/useGlobalAIState.ts`
- AI配置管理: `src/composables/useAIConfig.ts`
