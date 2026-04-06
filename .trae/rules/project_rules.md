# 智途 AstroPath — 项目规则

## 基本信息
- **项目**: 智途 AstroPath（一站式智能留学规划平台）
- **技术栈**: Vue 3 + Vite + Element Plus + Pinia + Vue Router
- **比赛**: 人工智能学院第四届科创节网页设计大赛（2026/4/7）
- **评分**: 设计40 + 功能30 + **创新30（AI交互）** + 展示10

## 硬性约束（违反即扣分）

### 配色系统
- 主色 `#0F172A`（Slate-900）— 唯一交互色
- 强调色 `#D97706`（Amber-600）— 唯一彩色点缀，极度克制
- 背景 `#FFFFFF` 白色为主
- 变量定义: `src/styles/variables.css`
- **严禁引入任何新配色**

### 数据与文案
- 院校数量必须写 **55+**，不得夸大
- 固定副标题: "AI 智能解析背景，为你生成专属留学路线图"
- 固定数据亮点: "55+精选院校 / 6大核心场景 / Multi-AI智能协同"
- Multi-AI 等术语保持英文原样，不翻译

### 安全红线
- `AIConfig.vue` 内含硬编码 API Key
- **严禁 git 提交、严禁公开暴露**

### 开发优先级
- AI 交互相关优化 > 其他所有功能（创新性30分是关键得分点）

### 测试与提交
- 完成功能后**必须通过完整测试流程**才算结束（详见 claude.md「测试规范」）
- 按**功能单独 git commit**，禁止攒一起整体提交

## 路由结构
首页(/) → /assessment → /school-recommendation → /timeline → /materials → /university-database → /ai-chat → /ai-config
详情页: /school-detail/:id → /major-detail/:id

## 扩展阅读
详细架构说明、文件索引、踩坑经验、设计规范 → 见 `claude.md`
