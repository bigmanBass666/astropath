# 智途 AstroPath — 项目上下文手册

> **重要**: 本文件是项目的核心文档，**硬性约束（配色/安全/文案/评分等）见下方「核心约束」章节**，违反即扣分。本手册聚焦：架构细节、文件索引、开发规范、踩坑经验。

---

## 项目概览

| 项目 | 说明 |
|------|------|
| **项目名称** | 智途 AstroPath（一站式智能留学规划平台） |
| **技术栈** | Vue 3 + Vite + Element Plus + Pinia + Vue Router |
| **比赛** | 人工智能学院第四届科创节网页设计大赛（2026/4/7） |
| **评分** | 设计40 + 功能30 + **创新30（AI交互）** + 展示10 |
| **开发优先级** | AI 交互相关优化 > 其他所有功能（创新性30分是关键得分点） |
| **设计美学** | **Awwwards 级别** — 追求极致视觉与交互体验 |

---

## 核心约束（违反即扣分）

### 配色系统
- 主色 `#0F172A`（Slate-900）— 唯一交互色
- 强调色 `#D97706`（Amber-600）— 唯一彩色点缀，极度克制
- 背景 `#FFFFFF` 白色为主
- 变量定义: `src/styles/variables.css`
- **严禁引入任何新配色**

### 安全红线
- `AIConfig.vue` 内含硬编码 API Key
- **严禁 git 提交、严禁公开暴露**


---

## Awwwards 设计规范（项目级设计美学）

本项目采用 **Awwwards 级别**设计语言，整个网站需遵循以下规范：

### 视觉语言

**排版系统**:
- 数据/数字/标签 → `var(--font-family-mono)` (JetBrains Mono)
- **禁止使用** Inter / Roboto / Arial / Helvetica
- Hero 字体应超大醒目，层级分明

**纹理质感**: 全页 SVG fractalNoise 叠加层，`opacity: 0.03`

**动画曲线**:
- 入场动画: `cubic-bezier(0.16, 1, 0.3, 1)` — Expo Out
- 悬停微交互: `cubic-bezier(0.34, 1.56, 0.64, 1)` — Back Out

### 交互模式

- 筛选芯片激活态 → 边框强调 + `rgba(15,23,42,0.06)` 底色
- 卡片悬停 → CSS 3D perspective 倾斜（`--mx/--my` 变量驱动）

### 禁止事项（AI 网站特征）

- ❌ 蓝白通用配色
- ❌ 三栏 features section 布局
- ❌ 渐变 hero banner
- ❌ Inter/Roboto 字体
- ❌ 卡片 + 圆角 + 阴影的过度使用
- ❌ 底部版权信息作为唯一 footer

### 无障碍

所有包含动画的页面/组件**必须**添加：

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0.01ms !important; }
}
```

---


---

## 踩坑经验库

### 2. Awwwards 设计规范（继续补充）

项目采用 Awwwards 级设计语言，新页面/组件需遵循：

**命名**: BEM 格式，统一 `ud-` 前缀（如 `.ud-card__accent--danger`）

**字体**:
- 数据/数字/标签 → `var(--font-family-mono)` (JetBrains Mono)
- **禁止使用** Inter / Roboto

**纹理**: 全页 SVG fractalNoise 叠加层，`opacity: 0.03`

**动画曲线**:
- 入场动画: `cubic-bezier(0.16, 1, 0.3, 1)` — Expo Out
- 悬停微交互: `cubic-bezier(0.34, 1.56, 0.64, 1)` — Back Out

**交互模式**:
- 筛选芯片激活态 → 边框强调 + `rgba(15,23,42,0.06)` 底色，不用实色填充
- 卡片悬停 → CSS 3D perspective 倾斜（`--mx/--my` 变量驱动）

**禁止事项**:
- ❌ 蓝白通用配色
- ❌ 三栏 features section 布局
- ❌ 渐变 hero banner
- ❌ Inter/Roboto 字体

### 3. 无障碍：减少动画偏好

所有包含动画的页面/组件**必须**添加：

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0.01ms !important; }
}
```

---

## 开发命令

```bash
npm run dev                  # 启动开发服务器 (http://localhost:3000)
npm run build                # 生产构建
npm run preview              # 预览构建产物
npm run lint                 # ESLint 检查并自动修复
npm run typecheck            # TypeScript 类型检查 (vue-tsc --noEmit)
npm run precommit            # 提交前类型检查（git hook 调用）
```
