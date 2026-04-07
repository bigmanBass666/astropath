# 首页 (Home.vue) Awwwards 级全屏沉浸式重构方案

> **核心问题**: 当前首页是「土味功能页硬套 Awwwards 壳」——三栏 Feature 卡片、el-button 满天飞、Canvas 星座网络廉价动画、打字机老套路。与已重构的 UniversityDatabase（`ud-` BEM 命名、3D 卡片倾斜、word reveal、chip 筛选）相比，首页是整个项目设计感最弱的页面。
>
> **目标**: 将首页从「功能列表展示页」重构为「沉浸式叙事体验页」，达到浑然天成的 Awwwards 级品质。

---

## 一、设计概念：The Odyssey（智途·旅程）

### 叙事核心
**从迷茫到清晰** — 一个申请者从面对留学选择的困惑，通过平台找到专属路径的情感转变旅程。每次滚动都是翻开旅程的下一页。

### 视觉语言：Editorial New Minimalism（编辑式新极简主义）
- 超大字体作为视觉锚点（非图片驱动）
- 非对称排版（打破居中对齐的单调）
- Bento Grid 不规则网格布局
- 大量留白作为设计元素
- 数据/数字统一用 `--font-family-mono` (JetBrains Mono)

### 交互哲学
**Scroll-driven storytelling** — 滚动驱动的内容揭示，配合 CSS 3D perspective 微交互。

### 技术边界
- **纯 Vue 3 + CSS 实现**，不引入新依赖（无 GSAP、无 Three.js）
- IntersectionObserver 驱动 scroll reveal
- 复用 UniversityDatabase 已验证的 `--mx/--my` 3D tilt 方案
- 全部使用 `variables.css` 已有变量，**零新配色**

---

## 二、页面架构（5 个 Section）

### Section 1: Hero — 「启程」(Departure) 🌟 Wow Moment #1

**替代**: 原 Hero 区域（星座 Canvas + 打字机 + el-button）

| 维度 | 旧 | 新 |
|------|----|----|
| 高度 | `padding: 100px 0 80px`（非全屏） | `calc(100dvh - 64px); margin-top: -20px` |
| 标题 | 52px + 打字机效果 | `clamp(56px, 11vw, 120px)` + word-by-word stagger reveal |
| 背景 | Canvas 星座网络动画 | 纯 CSS 网格 + SVG 噪点纹理 + Amber 光晕 |
| 按钮 | el-button × 2 | 自定义 HTML button（与 UD 搜索按钮同风格） |
| Stats | 独立卡片 + 分隔线 | 内联 mono 文字一行排列 |
| 滚动提示 | 鼠标图标 + "向下滚动" | 精致箭头指示器 |

**结构**:
```
.hp-hero (full-screen)
├── .hp-noise (噪点纹理, fixed overlay)
├── .hp-hero__grid-bg (CSS 网格背景, mask fade)
├── .hp-hero__glow (底部 Amber 径向光晕)
└── .hp-hero__inner
    ├── .hp-hero__label ("ASTROPATH · 2026")
    ├── .hp-hero__title (拆词 → span.word > span.word-inner)
    ├── .hp-hero__sub (固定副标题文案)
    ├── .hp-hero__actions (两个自定义按钮)
    ├── .hp-hero__tags (热门入口标签)
    └── .hp-hero__stats (55+ / 6大 / Multi-AI 内联)
```

**入场动画时序** (累计 ~1.2s):
1. `0.0s` — label fade-in-up
2. `0.15s` — title word-by-word reveal (每个词 delay 0.1s)
3. `0.55s` — subtitle fade-in-up
4. `0.7s` — search/actions fade-in-up
5. `0.85s` — tags fade-in-up
6. `1.0s` — stats fade-in-up

---

### Section 2: Manifesto — 「理念宣言」(What We Believe) 🌟 Wow Moment #2

**替代**: 原 Features 三栏卡片（Awwwards 明确禁止的模式）

**核心转变**: 从「功能介绍」→「态度宣言」

每条 feature 不是卡片描述，而是一条编号的**品牌宣言**：

| 编号 | 宣言标题 | 对应功能 | 路由 |
|------|---------|---------|------|
| 01 | 背景即地图 | 背景评估 | `/assessment` |
| 02 | AI 选校不是搜索 | AI 智能选校 | `/school-recommendation` |
| 03 | 时间可见方可掌控 | 时间规划 | `/timeline` |
| 04 | 材料有序，文书有力 | 材料中心 | `/materials` |
| 05 | 数据面前人人平等 | 院校数据库 | `/university-database` |
| 06 | 多智能体协同思考 | AI 对话 | `/ai-chat` |

**布局**: 交错式单列流（桌面端左右交替，移动端全部左侧）

```
.hp-manifesto
├── .hp-manifesto__header (区域标题)
└── .hp-manifesto__list
    ├── .hp-manifesto__item (奇数: 数字左 + 内容右)
    │   ├── .hp-manifesto__num ("01")
    │   ├── .hp-manifesto__title ("背景即地图")
    │   └── .hp-manifesto__desc (简短说明)
    ├── .hp-manifesto__item (偶数: 内容左 + 数字右)
    │   ...
    └── (共 6 条)
```

**交互**:
- Scroll 进入 viewport 时逐条 fade-in + translateX（左边的从左进入，右边的从右进入）
- Hover: 背景变为 `rgba(15,23,42,0.03)` + 数字放大 1.05 + Amber 下划线展开
- Click: `router.push(path)` 导航

---

### Section 3: Bento Grid — 「能力矩阵」(The Toolkit) 🌟 Wow Moment #3

**替代**: 原 Highlights 四栏（圆形图标 + 流光线条）

**布局**: CSS Grid 不规则 Bento 网格（类似 Apple/Linear 产品页）

```
Desktop (≥1200px) 布局:
┌─────────────────┬──────┬──────────┐
│                 │  02  │    03    │
│       01        ├──────┤          │
│   (AI 对话)      │  04  │          │
│                 ├──────┴──────────┤
│                 │      05         │
├─────────────────┴──────┬──────────┤
│         06                    07  │
└──────────────────────────────────┘
```

每个 Bento 卡片内容:
- **大卡片 (01)**: AI 对话预览 — 标题 + 对话气泡示意 + "立即体验"链接
- **中卡片 (02-05)**: 各功能模块 — 图标 + 名称 + 一句话描述
- **横跨卡片 (06-07)**: 数据展示 / CTA

**技术实现**:
- `grid-template-columns: repeat(4, 1fr)` + `grid-template-rows: auto`
- 每个 card 用 `grid-column: span N` + `grid-row: span M` 控制尺寸
- 复用 UD 的 `--mx/--my` CSS 变量 + `perspective(900px) rotateX()` 做 3D tilt
- `will-change: transform` GPU 加速

---

### Section 4: Proof — 「数据证据」(Numbers That Matter) 🌟 Wow Moment #4

**替代**: 原 Hero stats（移到这里作为独立 section）+ 给页面增加视觉节奏变化

**设计策略**: **深色反转区** — 作为视觉"呼吸点"，打破连续浅色的单调

```
.hp-proof (background: #0F172A, color: white)
├── .hp-proof__inner
│   ├── .hp-proof__label ("BY THE NUMBERS")
│   ├── .hp-proof__items (flex 横排)
│   │   ├── .hp-proof__item
│   │   │   ├── .hp-proof__num ("55+") — clamp(48px, 6vw, 80px)
│   │   │   └── .hp-proof__lbl ("精选院校")
│   │   ├── .hp-proof__item
│   │   │   ├── .hp-proof__num ("6")
│   │   │   └── .hp-proof__lbl ("核心场景")
│   │   └── .hp-proof__item
│   │       ├── .hp-proof__num ("Multi-AI")
│   │       └── .hp-proof__lbl ("智能协同")
│   └── .hp-proof__quote (一句品牌宣言文案)
```

**动画**:
- 进入 viewport 时数字从 0 计数到目标值（仅 55+ 和 6 需要计数，Multi-AI 直接显示）
- 背景: 微妙的 grid pattern（白色低透明度）

---

### Section 5: Invitation — 「开启旅程」(Begin Your Journey)

**替代**: 原 CTA box（渐变背景 + 波浪分隔 + el-button）

**设计**: 全宽沉浸式区域，不是盒子/卡片形式

```
.hp-invitation
├── .hp-invitation__inner
│   ├── .hp-invitation__question ("准备好开始了吗？")
│   ├── .hp-invitation__sub ("30秒完成背景评估，获取专属留学路线图")
│   └── .hp-invitation__cta (单个突出按钮 → /assessment)
└── SiteFooter (保留现有组件)
```

**特点**:
- 无边框、无阴影、无渐变背景
- 极简：文字 + 一个按钮
- 底部自然过渡到 SiteFooter

---

## 三、命名规范

**统一使用 `hp-` 前缀** (Home Page)，BEM 格式，与 `ud-` (UniversityDatabase) 风格一致:

| 元素 | 命名 | 说明 |
|------|------|------|
| 页面根 | `.hp-page` | 最外层容器 |
| 噪点 | `.hp-noise` | 固定噪点纹理层 |
| Hero | `.hp-hero` / `.hp-hero__*` | 全屏首屏 |
| 宣言 | `.hp-manifesto` / `.hp-manifesto__*` | 理念宣言区 |
| Bento | `.hp-bento` / `.hp-bento__*` | 能力矩阵 |
| 证据 | `.hp-proof` / `.hp-proof__*` | 数据证据区 |
| 邀请 | `.hp-invitation` / `.hp-invitation__*` | CTA 区域 |
| 返回顶部 | `.hp-back-to-top` | 浮动按钮 |

---

## 四、保留 vs 移除清单

### ✅ 保留的功能逻辑
- 路由导航: `/assessment`, `/university-database`, 以及 6 个功能模块路由
- 统计数据: `55+精选院校 / 6大核心场景 / Multi-AI智能协同`
- SiteFooter 组件 (`@show-guide="guideVisible = true"`)
- 返回顶部按钮 (scroll > 400px 显示)
- `inject('guideVisible')` 对话框状态
- 固定副标题文案: `"AI 智能解析背景，为你生成专属留学路线图"`

### ❌ 移除的内容
- Canvas 星座网络动画（`networkCanvas`, `initNetworkAnimation` 全部删除）
- 打字机效果（`startTypingEffect`, `typingInterval`, `subtitleIndex` 删除）
- 所有 `<el-button>` 替换为自定义 `<button>`
- 所有 `<el-icon>` + `<el-link>` 替换为内联 SVG 或文字
- Features 三栏 `.features-grid` 布局
- Highlights 四栏 `.highlights-content` 布局
- CTA 波浪 SVG 分隔器
- `shimmer-line`, `card-glow-pulse`, `card-shimmer-sweep`, `line-flow` 等廉价动画
- `.hero-gradient-overlay`, `.hero-glow-decoration` 多层渐变叠加
- `.feature-card::before/::after` 的 shimmer 扫光效果

---

## 五、响应式断点策略

与 UniversityDatabase 完全一致的断点:

| 断点 | Hero 高度 | Bento Grid | Manifesto | Proof |
|------|----------|------------|-----------|-------|
| ≥1200px | `100dvh - 64px` | 4 列不规则 | 双列交错 | 横排 |
| 768–1199px | `100dvh - 56px` | 2 列简化 | 单列左对齐 | 横排(紧凑) |
| ≤767px | `100dvh - 52px` | 单列堆叠 | 单列(紧凑) | 竖排 |

---

## 六、实施步骤

### Step 1: Hero 区域重构
- [ ] 重写 template hero section（全新 HTML 结构）
- [ ] 实现全屏高度 + 正确的 margin-top 抵消
- [ ] CSS 网格背景 + 噪点纹理 + 光晕（纯 CSS）
- [ ] 标题拆词 + word-by-word stagger reveal 动画
- [ ] 自定义 CTA 按钮（与 UD 搜索按钮风格一致）
- [ ] Stats 改为内联 mono 展示
- [ ] 精致滚动指示器
- [ ] 入场动画时序编排

### Step 2: Manifesto 理念宣言区
- [ ] 编写 6 条宣言数据（编号/标题/描述/路由）
- [ ] 交错布局模板 + 样式
- [ ] Scroll-driven 逐条入场动画
- [ ] Hover 微交互（背景 + 数字 + 下划线）
- [ ] 点击导航逻辑

### Step 3: Bento Grid 能力矩阵
- [ ] CSS Grid 不规则布局实现
- [ ] 6-7 个不同尺寸卡片内容
- [ ] 3D perspective tilt hover 效果（复用 --mx/--my 方案）
- [ ] 点击导航到各功能页
- [ ] 响应式适配（4列 → 2列 → 1列）

### Step 4: Proof 数据证据区
- [ ] 深色背景反转区域样式
- [ ] 超大数字展示（clamp 响应式字号）
- [ ] 数字计数动画（IntersectionObserver 触发）
- [ ] 品牌 quote 文案

### Step 5: Invitation CTA + 收尾
- [ ] 沉浸式邀请区（无边框/无阴影/无渐变）
- [ ] 单一行动按钮
- [ ] SiteFooter 保留集成
- [ ] 返回顶部按钮样式统一为 hp- 风格

### Step 6: 响应式 + 动画优化 + 测试验证
- [ ] 三断点完整适配
- [ ] `@media (prefers-reduced-motion: reduce)` 所有动画禁用
- [ ] IntersectionObserver 替代 scroll event（性能优化）
- [ ] 清理无用代码（旧 animation keyframes、旧 JS 逻辑）
- [ ] `npm run typecheck` 通过
- [ ] `npm run lint` 通过
- [ ] 手动浏览器验证（桌面/平板/移动端三尺寸）
- [ ] 配色合规检查（只用 #0F172A / #D97706 / #FFFFFF）

---

## 七、关键参考文件

| 文件 | 参考价值 |
|------|---------|
| [UniversityDatabase.vue](src/views/UniversityDatabase.vue) | Awwwarts 设计语言的黄金标准（hero、card、chip、animation） |
| [variables.css](src/styles/variables.css) | 所有 CSS 变量来源，不可新增变量 |
| [atmosphere.css](src/styles/atmosphere.css) | 噪点纹理、氛围层实现参考 |
| [animations.css](src/styles/animations.css) | 可复用的 keyframes（fadeInUp 等） |
| [App.vue](src/App.vue) | is-home class 处理、layout 约束 |
| [CLAUDE.md](CLAUDE.md) | 踩坑经验（Hero 高度计算、配色约束、测试规范） |
