# 智途 AstroPath 设计风格指南 v2.2

> **大道至简 · 全宽优先 · 策略性装饰** — 不是"什么都没有"的贫乏极简，而是在正确的地方华丽，在其他地方极度克制。全站采用全宽布局策略，充分利用屏幕空间。
>
> 本文档是所有页面重构的"宪法"。AI 在重构任何页面时，必须以本文档为最高依据。

---

## 一、设计哲学

### 1.1 核心定位：Slate + Amber 单色极简

- **主色系**：Slate 灰阶（#0F172A ~ #F8FAFC）— 承担 95% 的视觉工作
- **强调色**：Amber（#D97706）— 仅承担 5% 的点缀，极度克制
- **设计语言对标**：Apple / Stripe / Linear / Vercel 级别的克制与精致

### 1.2 高光区理论 (High-Light Zone Theory)

整个网站分为两类区域，装饰力度截然不同：

```
┌─────────────────────────────────────────────┐
│  ★ 高光区 (High-Light Zone)                  │
│                                             │
│  · Hero 首屏区域                             │
│    → Canvas 星座动画 ✓   渐变叠加层 ✓         │
│    → 光晕脉冲动画 ✓     视差滚动 ✓           │
│                                             │
│  · 页脚 (Footer)                             │
│    → 动态光线 ✓       星点闪烁 ✓             │
│    → Logo 微动效 ✓     波浪过渡 ✓            │
│                                             │
│  · 品牌 Logo                                 │
│    → 流苏摆动 ✓       星星脉冲 ✓             │
│    → 光环呼吸 ✓                              │
├─────────────────────────────────────────────┤
│                                             │
│  ◎ 内容区 (Content Zone) — 极简法则          │
│                                             │
│  · 功能卡片 / 列表 / 表格 / 表单              │
│  · CTA 行动召唤区                            │
│  · 数据展示 / 统计面板                       │
│  · 导航 / 侧边栏 / 标签页                    │
│  · 对话框 / 弹窗 / 抽屉                     │
│                                             │
│  内容区规则:                                 │
│  → 零装饰动画（无 shimmer/pulse/flow）        │
│  → 零渐变按钮背景（纯色 solid）               │
│  → 零渐变文字（纯色 text）                   │
│  → 零多层发光阴影（单层系统阴影）             │
│  → 靠间距、层次、字体权重传达信息层级          │
│                                             │
├─────────────────────────────────────────────┤
│  ★ 高光区 (High-Light Zone)                  │
│  · 页脚 — 同上                               │
└─────────────────────────────────────────────┘
```

### 1.3 设计原则

| 原则 | 解释 |
|------|------|
| **克制即高级** | 少即是多。每加一个效果前先问：去掉它会不会更好？ |
| **变量优先** | 绝对禁止硬编码颜色值。所有颜色必须使用 CSS 变量 |
| **功能决定形式** | 装饰服务于信息层级，不为了好看而装饰 |
| **一致性高于创意** | 所有页面共享同一套设计语言，不搞"每个页面不同风格" |
| **移动端同等重要** | 响应式不是事后补救，而是从设计之初就考虑 |

### 1.4 对标参考

| 品牌 | 学习什么 | 应用场景 |
|------|---------|---------|
| **Apple** | 大胆留白、Hero 排版节奏、字体层次对比 | 整体页面布局、首屏设计 |
| **Stripe** | 字体精致度、代码美学、表单设计细节 | 数据展示、表单页、文档型内容 |
| **Linear** | 微交互精准克制、导航设计、空状态优雅 | 侧边栏、标签切换、操作反馈 |
| **Vercel** | 技术产品优雅感、渐变的极简用法 | 院校数据库等工具型页面 |
| **Notion** | 圆角温度感、柔和阴影、空状态设计 | 表单页、空状态、设置面板 |

---

## 二、色彩系统与用法规则

### 2.1 变量速查表

所有颜色变量定义于 `src/styles/variables.css`。

#### 主色系（唯一交互色）

```css
--color-solid: #0F172A;          /* 主交互色 — 按钮、活跃态、主要文字 */
--color-solid-hover: #1E293B;    /* 悬停态 — 仅用于 hover */
```

#### 强调色（唯一彩色，极度克制）

```css
--color-accent: #D97706;         /* 强调色 — 下划线、活跃指示器、排名徽章 */
--color-accent-light: #FBBF24;   /* 点缀色 — Footer链接hover、社交图标hover */
--color-accent-subtle: #FEF3C7;  /* 背景色 — 警告背景、微妙高亮 */
```

#### 功能色（标准语义）

```css
--color-success: #059669;        /* 成功 */
--color-success-light: #10B981;
--color-success-bg: #ECFDF5;

--color-warning: #D97706;        /* 警告 */
--color-warning-light: #FBBF24;
--color-warning-bg: #FFFBEB;

--color-danger: #DC2626;         /* 危险 */
--color-danger-light: #EF4444;
--color-danger-bg: #FEF2F2;

--color-info: #0284C7;           /* 信息 */
--color-info-light: #38BDF8;
--color-info-bg: #F0F9FF;
```

#### 中性色（全灰阶，无色偏）

```css
--color-background: #FFFFFF;           /* 页面背景 */
--color-background-alt: #F8FAFC;      /* 交替区域背景 */
--color-surface: #FFFFFF;              /* 卡片/组件背景 */
--color-surface-elevated: #FFFFFF;     /* 浮层背景 */
--color-surface-muted: #F8FAFC;        /* 弱化表面 */

--color-text-primary: #0F172A;         /* 主要文字 */
--color-text-secondary: #475569;       /* 次要文字 */
--color-text-tertiary: #94A3B8;        /* 辅助说明 */
--color-text-inverse: #FFFFFF;         /* 反色文字（深底白字） */
--color-text-muted: #CBD5E1;           /* 弱化文字 */

--color-border: #E2E8F0;               /* 默认边框 */
--color-border-strong: #0F172A;        /* 强调边框 */
--color-border-light: #F1F5F9;         /* 弱化边框 */
--color-divider: #E2E8F0;              /* 分隔线 */
```

#### Slate 色阶（用于图标背景、悬停状态、层次变化）

```css
--color-slate-50:  #F8FAFC;   /* 最浅 — 背景 */
--color-slate-100: #F1F5F9;   /* 浅 — 卡片悬停背景 */
--color-slate-200: #E2E8F0;   /* 中浅 — 边框 */
--color-slate-300: #CBD5E1;   /* 中 — 占位符、禁用态 */
--color-slate-400: #94A3B8;   /* 中深 — 图标默认色 */
--color-slate-500: #64748B;   /* 标准 — 次要图标 */
--color-slate-600: #475569;   /* 深标 — 重要图标 */
--color-slate-700: #334155;   /* 深沉 — 图标容器背景 */
--color-slate-800: #1E293B;   /* 很深 — 悬停填充 */
--color-slate-900: #0F172A;   /* 最深 = --color-solid */
```

#### 渐变（极简，仅保留必要的）

```css
--gradient-hero: linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%);
/* 这是唯一允许使用的渐变，仅用于 Hero 区域背景过渡 */
```

### 2.2 色彩用法规则表 ⭐ 核心章节

这是本指南最重要的部分。每种颜色的使用都有严格规则。

#### `--color-solid` (#0F172A) — 你的主力色

| 属性 | 说明 |
|------|------|
| **身份** | 主交互色，承担 90% 的视觉重量 |
| **使用场景** | 主要按钮背景、主要文字颜色、活跃导航项、强边框、标题下划线、重要数据数字 |
| **禁止场景** | 不用作大面积背景色（用 slate-50/100）、不用作纯装饰线条 |
| **每页频次** | 无限制 — 这是你的基础色 |

#### `--color-solid-hover` (#1E293B)

| 属性 | 说明 |
|------|------|
| **身份** | 悬停态专用色 |
| **使用场景** | 仅用于 `--color-solid` 元素的 hover 状态（按钮、链接、卡片） |
| **禁止场景** | 不作为独立背景色使用、不用于静态元素 |
| **每页频次** | 与 solid 配对出现，不单独计数 |

#### `--color-accent` (#D97706) — 稀缺资源

| 属性 | 说明 |
|------|------|
| **身份** | 强调色，全站的"火花" |
| **使用场景** | Section 标题下划线（每页 1 次）、活跃导航指示器（全局 1 次）、排名徽章（金/银/铜 → accent 变体）、Footer 小标题下划线 |
| **禁止场景** | 不做按钮背景（那是 solid 的事）、不做大面积填充、不在同一页面出现超过 3 次 |
| **每页频次** | **≤ 3 次**。超过这个数就失去了"稀缺性"，变成廉价色 |

#### `--color-accent-light` (#FBBF24) — 更稀缺的点缀

| 属性 | 说明 |
|------|------|
| **身份** | 点缀色，几乎只出现在高光区 |
| **使用场景** | Footer 链接 hover、社交图标 hover、Logo 流苏/星星颜色、高光区的光晕核心色 |
| **禁止场景** | 内容区几乎不用、不做文字颜色（对比度不够） |
| **每页频次** | **≤ 2 次** |

#### `--color-accent-subtle` (#FEF3C7)

| 属性 | 说明 |
|------|------|
| **身份** | 背景色，最温和的 accent 表达 |
| **使用场景** | Warning 提示框背景、微妙的行高亮、输入框 focus 光晕的极淡版本 |
| **禁止场景** | 不做文字色、不做边框色 |
| **每页频次** | 按需使用（因为是淡色，不会喧宾夺主） |

#### `--color-slate-*` 色阶 — 工作马

| 属性 | 说明 |
|------|------|
| **身份** | 工作色，承担所有"非重点"的视觉需求 |
| **使用场景** | 图标容器背景、卡片 hover 态背景、次要边框、占位符文字、禁用态、section 交替背景、表格斑马纹、标签/chip 背景 |
| **每页频次** | 无限制 — 这是你最安全的选择 |

### 2.3 色彩搭配公式

```
一个典型的页面色彩分布：

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  白色/灰白背景 (background/surface)     60%
  Slate 灰阶 (文字/边框/图标/容器)       30%
  Solid (#0F172A) (按钮/标题/活跃态)      8%
  Accent (#D97706) (下划线/徽章/指示)     2%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  如果 Accent 超过 5% → 太多了，删减
  如果 Solid 低于 5%  → 缺少焦点，加强
```

### 2.4 功能色使用规范

| 场景 | 使用变量 | 示例 |
|------|---------|------|
| 操作成功 | `--color-success` + `--color-success-bg` | "保存成功" 提示、完成状态标签 |
| 警告提示 | `--color-warning` + `--color-warning-bg` | 表单校验警告、注意提示 |
| 错误/危险 | `--color-danger` + `--danger-bg` | 删除确认、错误提示、失败状态 |
| 信息提示 | `--color-info` + `--info-bg` | 帮助说明、新增标记 |

**注意**：功能色仅用于语义明确的反馈场景，不用于装饰。

---

## 三、字体排版

### 3.1 字体家族

```css
/* 正文字体 — 用于 99% 的内容 */
--font-family-base: 'Inter', 'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;

/* 展示字体 — 仅限 3 种场景（见下方） */
--font-family-display: 'Playfair Display', 'Noto Serif SC', 'Songti SC', Georgia, serif;

/* 等宽字体 — 代码、数据、序号 */
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### 3.2 Display 字体的 3 种合法使用场景

Display 字体（衬线体）是稀缺资源，**仅在以下场景使用**：

| # | 场景 | 示例 |
|---|------|------|
| 1 | **Hero 主标题** | 首页大标题 "一站式智能留学规划" |
| 2 | **CTA 区域标题** | "准备好开始您的留学规划了吗？" |
| 3 | **品牌名称** | Footer 中的 "智途 AstroPath"、Logo 旁的品牌名 |

**禁止场景**：
- ❌ 卡片标题（用 base 字体 + semibold/bold）
- ❌ Section 区块标题（用 base 字体 + bold）
- ❌ 正文段落（永远不用）
- ❌ 按钮文字（永远不用）
- ❌ 导航菜单（永远不用）
- ❌ 表格头部（永远不用）

### 3.3 字号层级

| 级别 | 变量 | 值 | 使用场景 | 字重 | 字间距 |
|------|------|-----|---------|------|--------|
| 超大展示 | `--text-6xl` | 64px | Hero 主标题（桌面端） | 700 (bold) | -1.5px |
| 巨大标题 | `--text-5xl` | 48px | 特殊展示标题 | 700 | -1px |
| 大标题 | `--text-4xl` | 36px | 页面主标题 | 700 | -1px |
| 中标题 | `--text-3xl` | 30px | Section 标题 | 700 | -0.5px |
| 小标题 | `--text-2xl` | 24px | 区块副标题、卡片组标题 | 600 | -0.5px |
| 子标题 | `--text-xl` | 20px | 卡片标题、重要段落引导句 | 600 | 0 |
| 大正文 | `--text-lg` | 18px | 重要段落正文、副标题描述 | 500 | 0 |
| 正文 | `--text-base` | 16px | 标准正文、列表内容 | 400 | 0 |
| 小号 | `--text-sm` | 14px | 次要说明、辅助文本、表格内容 | 400 | 0.25px |
| 超小号 | `--text-xs` | 12px | 标签、版权信息、时间戳、序号 | 500 | 0.5px |

### 3.4 字重使用规则

| 字重 | 值 | 使用场景 |
|------|-----|---------|
| Normal | 400 | 正文、长段落、说明文字 |
| Medium | 500 | 需要轻微强调的文字、标签文字、超小号字体 |
| Semibold | 600 | 卡片标题、按钮文字、导航项、小标题 |
| Bold | 700 | Hero 标题、Section 标题、CTA 标题、关键数据数字 |

**规则**：不要在同一行内混用超过 2 种字重。不要对中文使用 >700 的字重（会显得笨重）。

### 3.5 行高规范

| 场景 | 变量 | 值 | 使用场景 |
|------|------|-----|---------|
| 紧凑 | `--leading-tight` | 1.25 | 大标题（避免松散） |
| 标准 | `--leading-normal` | 1.5 | 正文、UI 元素 |
| 宽松 | `--leading-relaxed` | 1.75 | 长篇阅读内容 |

### 3.6 中文排版特殊处理

- **中英文混排**：在中文和英文/数字之间自动添加 `0.25em` 空格（可通过 CSS `text-autospace` 或 JS 处理）
- **避免孤字**：中文段落尽量避免行首/行尾的单个字符（可通过 `text-wrap: balance` 缓解）
- **字体回退链**：PingFang SC (macOS/iOS) → Microsoft YaHei (Windows) → -apple-system (fallback) → sans-serif

---

## 四、间距与布局

### 4.1 8px 基准网格系统

所有间距必须是 4 的倍数（8px 基准的子集或倍数）：

```css
--space-0:  0;       /* 无间距 */
--space-1:  4px;     /* 极微小间距（图标与文字间） */
--space-2:  8px;     /* 紧凑间距（相关元素内间距） */
--space-3:  12px;    /* 小间距（标签内边距） */
--space-4:  16px;    /* 标准间距（卡片内边距、相邻元素） */
--space-5:  20px;    /* 中间距（区块内边距） */
--space-6:  24px;    /* 区块间距（卡片网格 gap） */
--space-8:  32px;    /* 大间距（section 内部子区间隔） */
--space-10: 40px;    /* 更大间距（容器左右 padding） */
--space-12: 48px;    /* 大区块间距 */
--space-16: 64px;    /* 区块之间 */
--space-20: 80px;    /* 大区块之间 */
--space-24: 96px;    /* Section 上下 padding（桌面端） */
```

### 4.2 留白哲学

**"留白即高级"** — 这是 Apple 设计的核心秘密。

| 做法 | 效果 |
|------|------|
| ✅ 卡片内部 padding ≥ 24px | 呼吸感、高级感 |
| ✅ Section 上下 padding ≥ 80px（移动端 ≥ 48px） | 不拥挤、有层次 |
| ✅ 标题与下方内容的间距 ≥ 24px | 清晰的信息分组 |
| ✅ 相邻内容组之间的间距 > 组内间距 | 隐式分组 |
| ❌ 元素紧贴边缘（padding < 16px） | 廉价、局促 |
| ❌ 所有地方间距一样 | 缺乏节奏、平淡 |

### 4.3 容器宽度（全宽优先策略）

> **设计决策：全站采用全宽优先布局，充分利用屏幕空间。**
> Hero 区域和表格/数据展示区域应尽量铺开，仅表单/阅读区保持舒适行宽。

```css
/* ====== 页面根容器 — 仅左右 padding，不限制宽度 ====== */
.page-root {
  width: 100%;
  padding: 0 var(--space-10);    /* 左右各 40px 呼吸空间 */
  box-sizing: border-box;
}

/* ====== Hero 区域 — 真正的全宽 ====== */
.hero-full {
  width: 100%;
  padding: var(--space-16) var(--space-10);  /* 大量纵向留白 */
}

/* ====== 内容区域 — 宽松但不无边 ====== */
.content-wide {
  max-width: 1440px;             /* 一般内容区 */
  margin: 0 auto;
  padding: 0 var(--space-6);     /* 内部再缩一点 */
}

/* ====== 数据展示区 — 表格/图表/卡片网格，最宽 ====== */
.data-full {
  max-width: 1600px;             /* 数据展示可以更宽 */
  margin: 0 auto;
}

/* ====== 表单/阅读区 — 保持舒适行宽（可读性底线）===== */
.form-comfortable {
  max-width: 960px;              /* 表单不铺太宽，保证填写体验 */
  margin: 0 auto;
}
```

#### 容器选择决策树

```
这个页面区域用什么容器？
│
├─ 是 Hero / CTA 区域？
│   └─ → hero-full（100% 全宽 + 大量纵向 padding）
│
├─ 是表格 / 图表 / 卡片网格？
│   └─ → data-full（1600px，最大化信息密度）
│
├─ 是表单 / 纯文本阅读？
│   └─ → form-comfortable（960px 居中，保证 45~75 字符/行）
│
├─ 是一般内容区（功能介绍、设置面板等）？
│   └─ → content-wide（1440px，宽松但有序）
│
└─ 是 Sidebar 布局页面？（AIChat 等）
    └─ → 不用容器，Sidebar + Main 自然分割
```

#### 各容器适用页面速查

| 容器 | max-width | 适用场景 | 典型页面 |
|------|-----------|---------|---------|
| `hero-full` | 100% | 首屏、CTA、Footer Transition | 所有页面的 Hero |
| `data-full` | 1600px | 表格、ECharts 图标、卡片网格 | UniversityDatabase, Timeline, AIConfig(表格区) |
| `content-wide` | 1440px | 一般内容、详情页信息区 | SchoolDetail, MajorDetail, Materials, SchoolRecommendation |
| `form-comfortable` | 960px | 表单填写、偏好收集 | Assessment, AIConfig(表单区), PreferenceCollector |
| 无容器 | 100% | Sidebar 分割布局 | AIChat |

### 4.4 Section 节奏

一个典型页面的垂直节奏：

```
Header (固定高度)
  ↓
Hero (min-height: 80vh 或按内容自适应)
  ↓  padding: 96px 40px (桌面) / 48px 20px (移动)
Section A (Features / 主要内容)
  ↓  padding: 96px 40px / 48px 20px
  ↓  background: white 或 --color-background-alt
Section B (Highlights / 次要内容)
  ↓  padding: 96px 40px / 48px 20px
  ↓  background: 交替使用 white / alt
CTA Section
  ↓  padding: 96px 40px / 48px 20px
  ↓  background: --color-background-alt
Footer Transition (波浪/渐变过渡)
  ↓  height: 150px
Footer
  ↓  padding: 96px 40px 0 / 48px 20px
  ↓  background: --color-solid (深色)
```

---

## 五、阴影与层级

### 5.1 阴影层级定义

```css
--shadow-none: none;
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.04);
--shadow-glow-accent: 0 0 20px rgba(217, 119, 6, 0.15);  /* 仅高光区可用 */
```

### 5.2 阴影使用决策树

```
这个元素需要阴影吗？
│
├─ 是悬浮/浮层元素？（Dropdown、Modal、Tooltip）
│   └─ → shadow-xl 或 shadow-2xl
│
├─ 是卡片？
│   ├─ 默认状态 → shadow-sm（几乎看不见，暗示可交互）
│   ├─ Hover 状态 → shadow-lg（提升层级）
│   └─ ❌ 不要用 glow 类阴影
│
├─ 是按钮？
│   ├─ 默认状态 → shadow-md 或 shadow-none（扁平也 OK）
│   ├─ Hover 状态 → shadow-lg
│   └─ ❌ 不要用多层发光阴影
│
├─ 是输入框？
│   └─ Focus 时用 box-shadow: 0 0 0 3px rgba(15,23,42,0.08)
│       （不是彩色光晕，是极淡的 solid 色）
│
└─ 否则
    └─ → 不用阴影，靠边框和间距区分
```

### 5.3 阴影哲学

> **"Shadows define depth, not decoration."**
> 阴影的作用是告诉用户"这个东西浮起来了"，而不是"这个东西在发光"。

- ✅ 单层、方向一致的自然阴影（光源来自左上方）
- ✅ Hover 时阴影加深（暗示 Z 轴提升）
- ❌ 多层叠加的霓虹/发光效果（`box-shadow: 0 0 20px rgba(...)`）
- ❌ 彩色阴影（除了 `--shadow-glow-accent` 且仅限高光区）
- ❌ 内阴影 + 外阴影同时使用

---

## 六、圆角与边框

### 6.1 圆角等级分配

```css
--radius-none: 0;        /* 直角 — 表格单元格、分割线 */
--radius-sm: 4px;        /* 小圆角 — 按钮、标签、输入框 */
--radius-md: 6px;        /* 中圆角 — 下拉菜单、小型卡片 */
--radius-lg: 8px;        /* 大圆角 — 主要按钮、标准卡片 */
--radius-xl: 12px;       /* 超大圆角 — 大型卡片、Modal */
--radius-2xl: 16px;      /* 特大圆角 — 特色卡片、Hero 内元素 */
--radius-3xl: 24px;      /* 超特大 — 极少数场景（如通知 Toast） */
--radius-full: 9999px;   /* 圆形 — 头像、图标容器、Pill 标签 */
```

### 6.2 按元素类型的圆角规范

| 元素类型 | 推荐圆角 | 最大值 | 说明 |
|---------|---------|--------|------|
| 按钮（主要/次要） | `--radius-lg` (8px) | 8px | 不要太大，保持专业感 |
| 按钮（Ghost/Pill） | `--radius-full` (9999px) | — | 胶囊形仅用于次要操作 |
| 输入框 / Select | `--radius-md` (6px) | 8px | 略小于按钮 |
| 标准卡片 | `--radius-xl` (12px) | 16px | 信息密度高的卡片可以更大 |
| 特色/展示卡片 | `--radius-2xl` (16px) | 16px | Feature 卡片级别 |
| Modal / Dialog | `--radius-xl` (12px) | 16px | 保持克制 |
| Tag / Badge / Chip | `--radius-full` | — | 胶囊形 |
| 头像 | `--radius-full` | — | 圆形 |
| 图标容器 | `--radius-xl` (12px) | 16px | 方形容器 |
| Tooltip | `--radius-md` (6px) | 8px | 小巧精致 |
| Toast / Notification | `--radius-lg` (8px) | 12px | 适中即可 |

### 6.3 边框哲学

**"能用留白解决就不要用边框。"**

| 决策 | 做法 |
|------|------|
| 卡片之间需要区分？ | 用 `--shadow-sm` 或背景色差异，而非粗边框 |
| 卡片需要可见边界？ | 用 `1px solid var(--color-border)` 最细边框 |
| 需要强调边界？ | 用 `1.5px solid var(--color-border-strong)` |
| 分隔内容组？ | 用 `border-top: 1px solid var(--color-divider)` + 充足上下间距 |
| Input focus 状态？ | 不加边框变色，改用 `box-shadow: 0 0 0 3px rgba(15,23,42,0.08)` |
| Active / Selected 状态？ | 可用 `2px solid var(--color-solid)` 或背景色填充 |

**禁止**：
- ❌ `border-width > 2px`（太粗糙）
- ❌ `border-style: dashed/dotted`（除非是装饰性的虚线圈，且在高光区）
- ❌ 双边框（border + outline 同时使用）
- ❌ 彩色边框（除 active/selected/error 等语义场景外）

---

## 七、动画与动效

### 7.1 三级动画层级

```
Level 1: 入场动画 (Entry Animation)
├── 触发方式: Intersection Observer（进入视口时触发）
├── 效果: opacity 0→1 + translateY(20px→0)
├── 时长: 0.6s ease
├── 适用: 所有 Section、卡片列表、数据面板
└── 备注: 内容区唯一的"装饰级"动画

Level 2: 微交互 (Micro-interaction)
├── 触发方式: 用户 hover / click / focus
├── 效果:
│   ├── Button: translateY(-1px) + background 变深
│   ├── Card: translateY(-2px~4px) + shadow 加深
│   ├── Link: color 变深 + 下划线 width 0→100%
│   ├── Icon: scale(1.05)~1.1 + 轻微旋转(可选)
│   └── Input: border-color 变深 + focus ring 出现
├── 时长: 150ms~250ms ease
└── 适用: 所有可交互元素

Level 3: 装饰动画 (Decorative Animation) ⚠️ 仅限高光区
├── 触发方式: 自动循环 / 用户触发（scroll 等）
├── 效果:
│   ├── Canvas 粒子/连线网络（Hero）
│   ├── 光晕脉冲 glow-pulse（Hero/Footer）
│   ├── 星点闪烁 star-twinkle（Footer）
│   ├── 波浪起伏 wave-breathe（Footer 过渡）
│   ├── Logo 微动效（流苏摆动、星星脉冲）
│   └── 光线流动 glow-line-move（Footer 顶部）
├── 时长: 3s~12s（缓慢、不抢注意力）
└── 适用: ★ 仅 Hero + Footer + Logo ★
```

### 7.2 时间曲线规范

```css
/* 标准 — 99% 的场景用这个 */
--transition-fast: 150ms ease;
--transition-normal: 250ms ease;
--transition-slow: 350ms ease;

/* 弹性 — 仅用于图标的微型交互（如 Feature 图标 hover 时的轻微弹跳） */
--transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

**曲线选择规则**：

| 场景 | 推荐曲线 | 原因 |
|------|---------|------|
| 颜色变化 | `ease` | 自然过渡 |
| 透明度变化 | `ease` | 柔和淡入淡出 |
| 位移 (translateY) | `ease` 或 `ease-out` | 干净利落 |
| 阴影变化 | `ease` | 平滑过渡 |
| 图标缩放/旋转 | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 有趣但不夸张 |
| 其他一切 | `ease` | 安全选择 |

### 7.3 内容区动画禁令

以下动画**绝对不允许**出现在内容区（Content Zone）：

| 禁止动画 | 原因 | 替代方案 |
|---------|------|---------|
| Shimmer 光泽扫过 | AI味浓、分散注意力 | 静态或 fadeUp 入场 |
| Pulse 呼吸发光 | 显得廉价 | Hover 时 shadow 加深 |
| Flow 流动光线 | 过度装饰 | 静态线条或删除 |
| Rotate 旋转虚线 | 游戏感 | 静态虚线或不显示 |
| Float 漂浮粒子 | 与内容无关 | 删除 |
| Scale 放大缩小（非图标） | 不自然 | translateY 替代 |
| Bounce 弹跳 | 不专业 | ease 曲线的位移 |
| Gradient-shift 渐变游走 | 分散注意力 | 静态纯色 |

### 7.4 减弱动画支持

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 八、组件设计规范

### 8.1 按钮

#### Primary Button（主要操作）

```css
.primary-button {
  background: var(--color-solid);
  color: var(--color-text-inverse);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  padding: 10px 24px;
  border-radius: var(--radius-lg);
  border: none;
  min-height: 44px;           /* 触控友好 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.primary-button:hover {
  background: var(--color-solid-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.primary-button:active {
  transform: translateY(0);
}
```

**要点**：
- ✅ 纯色背景（`var(--color-solid)`），**不是渐变**
- ✅ Hover 仅 `translateY(-1px)`，**不是 -4px~-8px**
- ✅ 阴影用系统变量，**不是自定义发光效果**

#### Secondary Button（次要操作）

```css
.secondary-button {
  background: transparent;
  color: var(--color-text-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  padding: 10px 24px;
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--color-border);
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.secondary-button:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  transform: translateY(-1px);
}
```

#### Ghost Button（幽灵按钮）

```css
.ghost-button {
  background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  padding: 8px 16px;
  border-radius: var(--radius-md);
  border: none;
  min-height: 36px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.ghost-button:hover {
  background: var(--color-slate-100);
  color: var(--color-text-primary);
}
```

#### Accent Button（强调按钮 — 极少使用）

```css
.accent-button {
  background: var(--color-accent);
  color: white;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  padding: 10px 24px;
  border-radius: var(--radius-lg);
  border: none;
  min-height: 44px;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-md);
}

.accent-button:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}
```

**使用限制**：Accent 按钮每页最多出现 **1 次**。它是"最重要的那个操作"。

### 8.2 卡片

#### Content Card（内容卡片）

```css
.card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.card:hover {
  border-color: var(--color-border);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

**规则**：
- 默认用 `--shadow-sm`（几乎不可见），hover 升级到 `--shadow-lg`
- Hover 位移 `-2px`（不是 `-8px`）
- 边框用 `--color-border-light`（最淡），hover 加深到 `--color-border`
- **不加** shimmer、pulse、gradient overlay 等装饰

#### Action Card（行动卡片 — 可点击）

```css
.action-card {
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  padding: var(--space-8) var(--space-6);
  border: 1px solid transparent;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.action-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-slate-200);
  background: var(--color-surface-elevated);
}
```

#### Stat Card（统计卡片）

```css
.stat-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 1px solid var(--color-border-light);
}

.stat-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-solid);
  letter-spacing: -1px;
  line-height: 1;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-2);
}
```

### 8.3 表单元素

#### Input 输入框

```css
.input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
  min-height: 44px;
}

.input:focus {
  outline: none;
  border-color: var(--color-solid);
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}

.input::placeholder {
  color: var(--color-text-muted);
}
```

**要点**：
- Focus 时光晕用 `rgba(15, 23, 42, 0.08)`（极淡的 solid 色），**不是彩色**
- Min-height 44px 保证触控友好
- Border-color 从 `--color-border` 变为 `--color-solid`

#### Search Bar 搜索框（Hero 级别）

```css
.search-bar {
  display: flex;
  align-items: center;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 4px 4px 4px 20px;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-normal);
  max-width: 640px;
}

.search-bar:focus-within {
  border-color: var(--color-solid);
  box-shadow: var(--shadow-xl);
}
```

### 8.4 徽章与标签

#### Badge 徽章

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  letter-spacing: 0.5px;
}

.badge-solid {
  background: var(--color-solid);
  color: white;
}

.badge-accent {
  background: var(--color-accent-subtle);
  color: var(--color-accent);
}

.badge-success { background: var(--color-success-bg); color: var(--color-success); }
.badge-warning { background: var(--color-warning-bg); color: var(--color-warning); }
.badge-danger  { background: var(--color-danger-bg);  color: var(--color-danger); }
.badge-info    { background: var(--color-info-bg);    color: var(--color-info); }
```

#### Tag 标签（可点击/可关闭）

```css
.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 6px 12px;
  background: var(--color-slate-100);
  color: var(--color-slate-700);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tag:hover {
  background: var(--color-slate-200);
  border-color: var(--color-slate-300);
}

.tag-active {
  background: var(--color-solid);
  color: white;
  border-color: var(--color-solid);
}
```

### 8.5 表格

```css
.table-container {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.table-header {
  background: var(--color-surface-muted);
  border-bottom: 1px solid var(--color-border);
}

.table-header th {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 16px;
  text-align: left;
}

.table-row {
  border-bottom: 1px solid var(--color-border-light);
  transition: background var(--transition-fast);
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: var(--color-slate-50);
}

.table-cell {
  padding: 14px 16px;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
}
```

### 8.6 Section 标题

```css
.section-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: var(--space-12);
  letter-spacing: -0.5px;
  line-height: var(--leading-tight);
}

.section-title::after {
  content: '';
  display: block;
  width: 48px;
  height: 3px;
  background: var(--color-solid);     /* 或 var(--color-accent) — 每页限 1 个 accent 下划线 */
  margin: var(--space-4) auto 0;
  border-radius: 2px;
}
```

**规则**：
- 一个页面中只有 **1 个** section 标题可以用 `--color-accent` 下划线
- 其余全部用 `--color-solid`
- 下划线宽度 40~60px，高度 2~3px
- **不要**在下划线上加 shimmer/flow 动画

### 8.7 空状态 (Empty State)

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16) var(--space-8);
  text-align: center;
}

.empty-state-icon {
  font-size: 48px;
  color: var(--color-slate-300);
  margin-bottom: var(--space-6);
}

.empty-state-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.empty-state-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  max-width: 320px;
  margin-bottom: var(--space-6);
}
```

**风格**：温暖但克制。用 slate-300 的柔和色调，不要过于冷冰冰。

### 8.8 自定义下拉选择器 (Custom Select)

> **强制要求**：禁止使用原生 `<select>` 元素。浏览器原生的下拉面板无法通过 CSS 控制样式（字体/颜色/圆角/阴影），会严重破坏设计系统一致性。
>
> **实现方式**：使用 `h()` 渲染函数构建内联组件（见 §14.2），或提取为独立 `.vue` 单文件组件。

#### 结构规范

```
┌───────────────────────────────────────┐
│  [占位文字 / 已选项]               ▾  │  ← 触发器 (button, 44px min-height)
├───────────────────────────────────────┤
│  ┌─────────────────────────────────┐ │
│  │ ○ 选项 A                       │ │  ← 下拉面板 (ul, absolute定位)
│  │ ● 选项 B  (active 高亮)        │ │     solid 色边框 + shadow-lg
│  │ ○ 选项 C                       │ │     max-height: 220px 可滚动
│  └─────────────────────────────────┘ │
└───────────────────────────────────────┘
```

#### CSS 规范

```css
/* 触发器 — 与 form-input 保持一致的视觉语言 */
.custom-select-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: 10px 14px;                    /* 与 form-input 一致 */
  border: 1px solid var(--color-border); /* 与 form-input 一致 */
  border-radius: var(--radius-md);       /* 与 form-input 一致 */
  font-size: var(--text-base);           /* 与 form-input 一致 */
  background: var(--color-surface);
  color: var(--color-text-primary);
  cursor: pointer;
  min-height: 44px;                      /* 触控目标 ≥44px */
}

/* Focus 状态 — 使用极淡 solid 光晕 */
.custom-select-trigger:focus {
  outline: none;
  border-color: var(--color-solid);
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}

/* 展开状态 — 底部圆角归零，与下拉面板无缝衔接 */
.custom-select--open .custom-select-trigger {
  border-color: var(--color-solid);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}

/* 下拉面板 — 强调交互边界 */
.custom-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  margin-top: -1px;                        /* 消除与触发器的间隙 */
  background: var(--color-surface);
  border: 1px solid var(--color-solid);   /* solid 色 = 强调交互边界 */
  border-top: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  box-shadow: var(--shadow-lg);           /* 浮层阴影 */
  list-style: none;
  padding: var(--space-2) 0;
  max-height: 220px;                      /* 防止过长 */
  overflow-y: auto;
}

/* 选项项 */
.custom-select-option {
  padding: 10px 14px;                     /* 与触发器 padding 一致 */
  font-size: var(--text-base);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.custom-select-option:hover {
  background: var(--color-slate-50);      /* 极淡 hover */
}

/* 已选中项 */
.custom-select-option--active {
  color: var(--color-solid);              /* solid 色强调 */
  font-weight: var(--font-semibold);
  background: rgba(15, 23, 42, 0.04);      /* 极淡底色 */
}
```

#### 交互规范

| 行为 | 规范 |
|------|------|
| **打开方式** | 点击触发器 toggle |
| **关闭方式** | ① 点击选项 ② 点击外部区域 ③ 按 Escape |
| **箭头动画** | 展开 `rotate(180deg)`，`transition: transform 200ms` |
| **入场动画** | 下拉面板 `translateY(-4px) → 0` + `opacity 0→1`，150ms ease |
| **退场动画** | 反向，100ms ease |
| **ARIA** | `aria-expanded` / `role="listbox"` / `role="option"` / `aria-selected` |

#### 箭头图标规范

```svg
<!-- 12×12 viewBox, stroke-based, round caps -->
<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M3 5L6 8L9 5" 
        stroke="currentColor" 
        stroke-width="1.5" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>
</svg>
```
- 颜色：`currentColor`（继承 `--color-text-muted`）
- 线宽：`1.5`
- 线帽/线交：`round`

---

## 十四、Vue 工程规范

> 本章补充 DESIGN_SPEC 中与 Vue SFC 架构强相关的工程约束。这些规则直接影响「代码能否正确渲染」和「样式能否生效」，是设计系统落地的技术前提。

### 14.1 Scoped CSS 样式穿透 (`:deep()`)

#### 问题背景

Vue `<style scoped>` 会给每个选择器添加属性选择器后缀（如 `[data-v-abc123]`），确保样式只作用于当前组件的 DOM。但子组件的根元素**没有父组件的 `data-v-*` 属性**，导致父组件中针对子元素编写的样式全部失效。

#### 规则

| 场景 | 写法 | 示例 |
|------|------|------|
| **样式需要穿透到子组件内部** | **必须加 `:deep()`** | `:deep(.custom-select-trigger) { ... }` |
| **样式只作用于当前组件 DOM** | 正常写法即可 | `.form-input { ... }` |
| **全局样式（不受 scoped 影响）** | 用 `:global()` 或单独 `<style>` 块 | `:global(.modal-backdrop) { ... }` |

#### 典型必须使用 `:deep()` 的场景

1. **内联定义的子组件**（Options API `components` 内嵌套）
2. **第三方 UI 库组件覆盖样式**
3. **Teleport 传送内容的样式控制**

```css
/* ✅ 正确：scoped 样式穿透到 CustomSelect 子组件 */
:deep(.custom-select-trigger) { min-height: 44px; }
:deep(.custom-select-dropdown) { box-shadow: var(--shadow-lg); }

/* ❌ 错误：子组件匹配不到这个选择器 */
.custom-select-trigger { min-height: 44px; }  /* 永远不会生效！ */
```

### 14.2 内联组件的渲染方式选择

当需要在单文件内快速定义小型可复用组件时（如 CustomSelect、Toast），有三种方式：

#### 方式对比

| 方式 | 语法 | 运行时依赖 | 适用场景 |
|------|------|-----------|---------|
| **SFC 字符串模板** | `template: \`<div>...\`` | **需要 Runtime Compiler** | ❌ 本项目不可用 |
| **`h()` 渲染函数** | `render() { return h('div', ...) }` | **无需编译器** | ✅ 推荐：内联小型组件 |
| **独立 .vue 文件** | `<template><div>...</div></template>` | Vite 编译时处理 | ✅ 推荐：复杂/复用组件 |

#### 本项目的硬性约束

```
Vite 默认配置 → @vitejs/plugin-vue → runtime-only 模式
                        ↓
          不包含 Vue Template Compiler
                        ↓
    template: `...` 字符串不会被编译 → 组件渲染为空
```

**结论：本项目所有内联组件必须使用 `h()` 渲染函数，禁止使用 `template` 字符串。**

#### `h()` 最佳实践模板

```javascript
import { h, Transition } from 'vue'

export default {
  components: {
    MyInlineComponent: {
      props: { modelValue: String },
      emits: ['update:modelValue'],
      data() { return { open: false } },
      methods: {
        toggle() { this.open = !this.open }
      },
      render() {
        // 1. class 用数组形式支持动态类名
        // 2. 事件用 onClick/onInput（非 @click）
        // 3. Transition 组件包裹条件内容
        return h('div', {
          class: ['my-component', { 'my-component--open': this.open }]
        }, [
          h('button', {
            class: 'my-trigger',
            onClick: () => this.toggle()
          }, this.modelValue || 'Placeholder'),
          
          h(Transition, { name: 'my-dropdown' }, () => {
            if (!this.open) return null
            return h('ul', { class: 'my-list' }, [...])
          })
        ])
      }
    }
  }
}
```

#### `h()` 注意事项

| 要点 | 说明 |
|------|------|
| **class** | 用数组 `['base', { active }]` 支持动态类名；对象 `{ class: 'str' }` 只支持静态 |
| **事件** | `onClick` / `onInput` / `onKeydown`（camelCase），不是 `@click` |
| **v-if** | 在 render 函数中用 `if (!cond) return null` 替代 |
| **v-for** | 用 `.map()` 替代 |
| **Transition** | 从 vue 导入 `Transition`，用函数式子节点 `() => node \| null` |
| **SVG** | 用嵌套 `h()` 创建 SVG 元素，属性用 camelCase（`strokeWidth` → `stroke-width`） |
| **slot** | 内联组件一般不用 slot；如需用 `this.$slots.default?.()` |

### 14.3 自定义通知系统 (Toast / Notification)

> **推荐做法**：不依赖 Element Plus 的 `ElMessage`，自行实现轻量 Toast 系统。原因：
> 1. 完全可控 DOM 层级（z-index、位置）
> 2. 样式 100% 遵循设计系统变量
> 3. 无外部依赖，减少 bundle 体积
> 4. 避免 Element Plus CSS 未加载时的渲染异常

#### 结构规范

```html
<!-- Teleport 到 body，脱离正常文档流 -->
<Teleport to="body">
  <div class="toast-notification toast-success">
    <span class="toast-icon">✓</span>
    <span class="toast-message">操作成功</span>
  </div>
</Teleport>
```

#### CSS 规范

```css
.toast-notification {
  position: fixed;
  top: 24px;                              /* 顶部居中悬浮 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;                          /* 最高层级 */
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 12px 20px;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  box-shadow: var(--shadow-lg);
  animation: toast-in 250ms ease;         /* 入场动画 */
}

@keyframes toast-in {
  from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
```

#### 四种类型配色

| 类型 | 类名 | 背景色 | 图标 | 使用场景 |
|------|------|--------|------|---------|
| 成功 | `.toast-success` | `var(--color-success)` | ✓ | 保存/连接成功/操作确认 |
| 错误 | `.toast-error` | `var(--color-danger)` | ✕ | 连接失败/验证错误 |
| 警告 | `.toast-warning` | `var(--color-warning)` | ! | 缺少字段/风险提示 |
| 信息 | `.toast-info` | `var(--color-solid)` | ℹ | 已存在/默认值提示 |

#### JS 调用接口

```javascript
const toast = reactive({ visible: false, message: '', type: 'info' })
let timer = null

function showToast(message, type = 'info', duration = 3000) {
  if (timer) clearTimeout(timer)
  toast.message = message
  toast.type = type
  toast.visible = true
  timer = setTimeout(() => { toast.visible = false }, duration)
}

// 组件卸载时清理
onUnmounted(() => { if (timer) clearTimeout(timer) })
```

#### 移动端适配

```css
@media (max-width: 767px) {
  .toast-notification {
    left: 16px;
    right: 16px;
    transform: none;              /* 取消居中，贴边显示 */
  }
  .toast-message { white-space: normal; }  /* 允许换行 */
}
```

---

## 九、反模式清单 ⭐

> **本章是 AI 重构的核心参考。每一条都是"绝对不要做"的铁律。**

### 9.1 颜色反模式

| # | ❌ 反模式 | ✅ 正确做法 | 原因 |
|---|----------|------------|------|
| 1 | `background: linear-gradient(135deg, #1E3A5F, #2D5A8E)` 按钮背景 | `background: var(--color-solid)` | 渐变按钮是 AI 模板风的最大标志 |
| 2 | `background: linear-gradient(135deg, #B8860B, #D4AF37)` 金色按钮 | `background: var(--color-solid)` 或 `var(--color-accent)` | 金色渐变显得廉价，像微商海报 |
| 3 | `background: -webkit-linear-gradient(...); -webkit-background-clip: text;` 渐变文字 | `color: var(--color-solid)` | 渐变文字降低可读性，且是 AI 模板标配 |
| 4 | 硬编码 `#1E3A5F` / `#2D5A8A` / `#0F1F33`（旧蓝色系） | `var(--color-solid)` / `var(--color-slate-*)` | 违反变量优先原则 |
| 5 | 硬编码 `#B8860B` / `#D4AF37` / `#8B6914`（旧金色系） | `var(--color-accent)` / `var(--color-accent-light)` | 同上 |
| 6 | `rgba(30, 58, 95, ...)` 或 `rgba(184, 134, 11, ...)` 硬编码 | `rgba(15, 23, 42, ...)` 基于 solid 色值 | 旧色值的半透明变体同样要替换 |

### 9.2 阴影反模式

| # | ❌ 反模式 | ✅ 正确做法 |
|---|----------|------------|
| 7 | `box-shadow: 0 0 20px rgba(30, 58, 95, 0.15), 0 0 40px rgba(...)` 多层发光 | `box-shadow: var(--shadow-lg)` 单层自然阴影 |
| 8 | `box-shadow: 0 4px 15px rgba(184, 134, 11, 0.3)` 金色发光 | `box-shadow: var(--shadow-md)` 或 `--shadow-lg` |
| 9 | `box-shadow: var(--shadow-sm), 0 0 0 0 rgba(...), 0 0 20px ...` 3+ 层叠加 | 最多 2 层（base + hover state） |

### 9.3 动画反模式

| # | ❌ 反模式 | ✅ 正确做法 | 出现位置 |
|---|----------|------------|---------|
| 10 | `@keyframes shimmer-line { left: -100% → 100% }` 光泽扫过 | 删除，或改为 fadeUp 入场 | 卡片、按钮、标题下划线 |
| 11 | `@keyframes card-shimmer-sweep` 卡片光泽扫过 | 删除 | Feature 卡片 |
| 12 | `@keyframes card-glow-pulse` 呼吸光晕 | 删除 | 卡片默认状态 |
| 13 | `@keyframes line-flow` 流动光线 | 删除 | Highlights 连接线 |
| 14 | `@keyframes pulse-glow` 按钮脉冲发光 | 删除 | Accent 按钮 |
| 15 | `@keyframes gradient-shift` 背景渐变游走 | 删除或改静态渐变 | Hero 叠加层（高光区可保留） |
| 16 | `transform: scale(1.02)` / `scale(1.1)` 非 icon 元素 hover | `transform: translateY(-1px ~ -3px)` | 卡片、按钮 |
| 17 | `animation: xxx 2s ease-in-out infinite` 内容区无限循环 | 仅保留 `:hover` 和 `IntersectionObserver` 触发的动画 | 内容区所有元素 |

### 9.4 布局与排版反模式

| # | ❌ 反模式 | ✅ 正确做法 |
|---|----------|------------|
| 18 | Display 字体（Playfair Display）用在卡片标题/导航/表格头 | 用 Inter + semibold/bold |
| 19 | `letter-spacing: 2px+` 大段文字的字间距 | 正文 `letter-spacing: 0`；标题最多 `-1px` 或 `0.5px` |
| 20 | `line-height < 1.4` 的紧凑行高 | 标题 `1.25`，正文 `1.5`，长文 `1.75` |
| 21 | `font-weight: 800+` 的中文文字 | 中文最大 700（bold） |
| 22 | `border-radius: 20px+` 在功能元素上 | 按钮 ≤ 8px，卡片 ≤ 16px |
| 23 | `padding < 16px` 的卡片内边距 | 卡片最小 padding 24px（移动端 16px） |

### 9.5 通用反模式

| # | ❌ 反模式 | ✅ 正确做法 |
|---|----------|------------|
| 24 | `::before` + `::after` 双伪元素做复杂装饰 | 最多用一个伪元素，且仅用于简单装饰（如下划线、角标） |
| 25 | `filter: drop-shadow()` 做 CSS 发光 | 用标准 `box-shadow` |
| 26 | `backdrop-filter: blur()` 做毛玻璃（非必要场景） | 用实色背景 `var(--color-surface)` |
| 27 | `mix-blend-mode` 做混合特效 | 不使用（除非高光区的特殊效果） |
| 28 | `z-index: 100+` 乱用 | 定义清晰的 z-index 层级体系 |
| 29 | 内联组件使用 `template: \`<div>...\`` 字符串 | 使用 `h()` 渲染函数或独立 `.vue` 文件（见 §14.2） |
| 30 | 子组件样式不加 `:deep()` 穿透符 | 必须使用 `:deep(.child-class)` （见 §14.1） |
| 31 | 原生 `<select>` / `<input type="file">` 等不可样式化元素 | 用自定义组件替换：CustomSelect / 自定义上传（见 §8.8） |
| 32 | 依赖 Element Plus 的 `ElMessage` / `ElNotification` | 用自定义 Toast 系统（Teleport + 设计系统变量，见 §14.3） |

### 9.6 Vue 工程反模式

> 本章反模式直接导致**功能失效**（组件不渲染、样式丢失），比视觉层面的反模式更严重。

| # | ❌ 反模式 | ✅ 正确做法 | 后果 |
|---|----------|------------|------|
| 33 | Options API 组件内写 `template: \`...\`` | `render() { return h('div', ...) }` | **组件渲染为空，页面元素消失** |
| 34 | scoped 样式写 `.child-class {}` 期望穿透子组件 | `:deep(.child-class) {}` | **子组件样式全部失效，无样式的"隐形"元素** |
| 35 | `ElMessage.success('...')` 在移除 Element Plus 组件后仍使用 | 自定义 `showToast(msg, type)` + Teleport | **Toast 不显示或样式异常** |
| 36 | `<select>` 配合 `appearance: none` 当作"美化方案" | 完全自定义 CustomSelect 组件 | **下拉面板仍是浏览器原生渲染** |

---

## 十、页面类型分类

### 10.1 落地页/营销页 (Landing Page)

**代表页面**：Home.vue（首页）

**风格特征**：
- Hero 区域：大气排版 + Canvas 动画（高光区）
- Feature/Highlight/CTA：保留现有装饰（用户已确认稳定）
- Footer：完整的高光区装饰
- **整体**：这是全站最有"表演欲"的页面

**重构注意事项**：
- 首页已基本稳定，仅需统一旧硬编码颜色为新变量
- 不改变现有布局结构和装饰效果

### 10.2 工具页/功能页 (Tool Page)

**代表页面**：UniversityDatabase.vue（院校数据库）、Materials.vue（材料中心）、Assessment.vue（背景评估）

**风格特征**：
- **严格的内容区法则**
- 搜索栏/筛选器：干净的输入框 + tag/chip 筛选标签
- 结果展示：表格或卡片网格，hover 微交互
- 分页：简洁的页码控件
- 空状态：温暖的 empty-state 设计
- **零装饰动画**（fadeUp 入场除外）

**重构重点**：
- 搜索按钮：渐变背景 → `var(--color-solid)`
- 筛选标签：旧蓝色背景 → `var(--color-slate-100)`
- 表格/卡片：去除多余阴影和装饰
- Section 标题：统一用 solid 下划线
- 所有硬编码颜色 → CSS 变量

### 10.3 数据展示页 (Data Page)

**代表页面**：SchoolRecommendation.vue（AI选校）、SchoolDetail.vue（院校详情）、MajorDetail.vue（专业详情）

**风格特征**：
- 数据可视化：雷达图、进度条、匹配度指标
- 信息层级清晰：标题 → 关键数据 → 详细信息 → 操作按钮
- 卡片组织信息模块
- 统计数字用 `--color-solid` + display 字体权重 bold

**重构重点**：
- 匹配度/排名：金色渐变 → `var(--color-accent)` 纯色
- 进度条：渐变色 → `var(--color-solid)` 或功能色
- 详情弹窗/侧滑面板：干净的分隔和间距
- Tab 切换：底部下划线指示器，用 `--color-solid` 或 `--color-accent`

### 10.4 对话页 (Chat Page)

**代表页面**：AIChat.vue（AI 对话）

**风格特征**：
- 聊天气泡：用户消息右对齐（solid 背景），AI 消息左对齐（slate-50 背景）
- 输入框：底部固定，简洁设计
- 侧边栏：对话历史列表，当前对话高亮
- Agent 选择器：头像 + 名称 + 角色描述

**重构重点**：
- 气泡颜色：旧蓝色 → `var(--color-solid)`
- 发送按钮：渐变 → `var(--color-solid)`
- Avatar 边框/背景：统一变量
- Markdown 渲染样式：代码块用 mono 字体 + slate-900 背景

### 10.5 弹窗/对话框 (Dialog/Modal)

**风格特征**：
- 半透明遮罩：`rgba(15, 23, 42, 0.4)`（基于 solid 色）
- 弹窗本身：白色背景 + `--shadow-2xl` + `--radius-xl`
- Header：标题 + 关闭按钮（icon only）
- Body：充足 padding
- Footer（可选）：主操作按钮右对齐，次要操作左对齐

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  max-width: 560px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  padding: var(--space-8);
}
```

---

## 十一、布局设计模式

> 本章定义页面级布局的通用模式。颜色决定"好不好看"，布局决定"专不专业"。两者同等重要。

### 11.1 页面骨架决策树

```
这个页面的核心任务是什么？
│
├─ 浏览/探索（用户在找东西）
│   └─ → 工具页布局（见 11.2）
│       搜索栏 + 筛选器 + 结果列表
│
├─ 填写/输入（用户在提交信息）
│   └─ → 表单页布局（见 11.3）
│       步骤指示 + 表单区域 + 辅助面板
│
├─ 消费/阅读（用户在看内容）
│   ├─ 数据/分析类 → 数据展示布局（见 11.4）
│   │   统计概览 + 可视化 + 详细信息
│   └─ 对话/交互类 → 对话页布局（见 11.5）
│       会话列表 + 消息区 + 输入区
│
└─ 触发/行动（用户要做决定）
    └─ → 落地页布局（Home.vue 已稳定）
        Hero + 功能展示 + CTA
```

### 11.2 工具页布局模式 (Tool Page Layout)

**适用页面**：院校数据库、材料中心、时间规划

#### 整体结构

```
┌──────────────────────────────────────────────────────┐
│  Header (导航栏 — 固定高度 ~64px)                     │
├──────────┬───────────────────────────────────────────┤
│          │  Page Hero                                  │
│          │  ┌─────────────────────────────────────┐   │
│  Sidebar │  │  标题: "院校数据库"                    │   │
│  (可选)   │  │  副标题: "探索全球顶尖院校..."         │   │
│          │  │  [======== 搜索框 =========] [搜索]   │   │
│  · 首页   │  │  [标签1] [标签2] [标签3] ...         │   │
│  · 选校   │  └─────────────────────────────────────┘   │
│  · 材料   │                                              │
│  · 时间   │  ── 筛选工具栏 (可选) ──                      │
│  · 对话   │  [分类 ▾] [地区 ▾] [排名 ▾]  [视图切换]     │
│  · 数据库 │                                              │
│          │  ┌─────────────────────────────────────┐   │
│          │  │                                     │   │
│          │  │        结果列表 / 卡片网格            │   │
│          │  │                                     │   │
│          │  │                                     │   │
│          │  └─────────────────────────────────────┘   │
│          │                                              │
│          │  [← 上一页]  第 3 / 24 页  [下一页 →]      │
│          │                                              │
├──────────┴───────────────────────────────────────────┤
│  Footer                                                │
└──────────────────────────────────────────────────────┘
```

#### 关键尺寸规范

| 元素 | 尺寸 | 说明 |
|------|------|------|
| **Sidebar 宽度** | 240px (收起时 64px) | 固定宽度，不随屏幕缩放 |
| **Sidebar 与主内容间距** | 0 (紧贴) 或 16px | 用 border 分隔，不用间距 |
| **Hero 高度** | 280px ~ 360px | 不需要全屏，比首页 Hero 矮 |
| **搜索框最大宽度** | 640px | 居中放置，不撑满 |
| **筛选工具栏高度** | 56px | 紧凑一行 |
| **结果区最小高度** | calc(100vh - header - hero - toolbar - footer) | 保证填满剩余空间 |
| **内容区左右 padding** | 40px (桌面) / 20px (平板) / 16px (手机) | 见 4.3 |

#### Sidebar 设计规范

```css
.sidebar {
  width: 240px;
  height: calc(100vh - 64px);
  background: var(--color-surface);
  border-right: 1px solid var(--color-border-light);
  position: fixed;
  left: 0;
  top: 64px;
  overflow-y: auto;
  padding: var(--space-6) 0;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 10px var(--space-6);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  text-decoration: none;
  transition: all var(--transition-fast);
  position: relative;
}

.sidebar-nav-item:hover {
  color: var(--color-text-primary);
  background: var(--color-slate-50);
}

.sidebar-nav-item.is-active {
  color: var(--color-solid);
  background: var(--color-slate-100);
  font-weight: var(--font-semibold);
}

.sidebar-nav-item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 3px;
  background: var(--color-solid);
  border-radius: 0 2px 2px 0;
}
```

**规则**：
- ✅ Active 状态用左侧 3px solid 色条指示（不是背景色填充整行）
- ✅ 图标用 `--color-slate-500`，active 时变 `--color-solid`
- ✅ 导航项之间不用分隔线，靠间距分组
- ❌ 不要做 Sidebar 展开收起动画（直接切换即可）

#### 非 Sidebar 页面的主内容区

如果页面没有 Sidebar（如 Assessment 表单页、AIConfig 配置页），主内容区的居中策略：

```css
/* 一般内容页 — 宽松布局 */
.main-content {
  max-width: 1440px;             /* content-wide 级别 */
  margin: 0 auto;
  padding: 0 var(--space-10);
}

/* 表单/阅读区 — 保持舒适行宽 */
.main-content-narrow {
  max-width: 960px;              /* form-comfortable 级别 */
  margin: 0 auto;
}

/* 数据展示区 — 最宽 */
.main-content-data {
  max-width: 1600px;             /* data-full 级别 */
  margin: 0 auto;
}
```

> **同一页面内可以混合使用不同宽度的区域。** 例如 AIConfig 页面：
> - 页面根容器 `1440px`（content-wide）
> - 表格区域跟随根容器或独立设为 `1560px`（data-full）
> - 表单区域独立收窄为 `680px` 居中（form-comfortable）

### 11.3 表单页布局模式 (Form Page Layout)

**适用页面**：背景评估 (Assessment)

#### 分步表单布局

```
┌────────────────────────────────────────────────────────┐
│  Header                                                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌─ Page Hero (紧凑型) ─────────────────────────────┐  │
│  │  背景评估                        Step 2 / 5       │  │
│  │  ████████████░░░░░░░░░  40%                      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌──────────────────┬──────────────────────────────┐  │
│  │                  │                              │  │
│  │  Step Sidebar    │     Form Content             │  │
│  │  (步骤导航)       │                              │  │
│  │                  │   ┌────────────────────┐     │  │
│  │  ① 基本信息 ✓    │   │ 字段标签            │     │  │
│  │  ② 学术成绩 ● ←  │   │ [输入框            ]     │  │
│  │  ③ 语言成绩 ○    │   │                    │     │  │
│  │  ④ 科研经历 ○    │   │ 字段标签            │     │  │
│  │  ⑤ 实践背景 ○    │   │ [选择框          ▾]     │  │
│  │                  │   │                    │     │  │
│  │                  │   │ 字段标签            │     │  │
│  │                  │   │ [多行文本框        ]     │  │
│  │                  │   │                    │     │  │
│  │                  │   └────────────────────┘     │  │
│  │                  │                              │  │
│  │                  │   [  上一步  ]  [  下一步 → ] │  │
│  │                  │                              │  │
│  └──────────────────┴──────────────────────────────┘  │
│                                                        │
├────────────────────────────────────────────────────────┤
│  Footer                                                 │
└────────────────────────────────────────────────────────┘
```

#### 尺寸规范

| 元素 | 尺寸 |
|------|------|
| Step Sidebar 宽度 | 200px ~ 240px |
| Step Sidebar 与表单间距 | 48px |
| 表单区域最大宽度 | 600px（保证可读性） |
| 单个字段上下间距 | 24px |
| 字段标签与输入框间距 | 8px |
| 输入框高度 | 44px（标准）或 48px（多行） |
| 按钮组与上一个字段的间距 | 32px |

#### Step Indicator（步骤指示器）设计

```css
.step-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.step-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.step-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  background: var(--color-slate-100);
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

/* 已完成 */
.step-item.completed { color: var(--color-text-secondary); }
.step-item.completed .step-number {
  background: var(--color-solid);
  color: white;
}

/* 当前步骤 */
.step-item.current {
  color: var(--color-solid);
  font-weight: var(--font-semibold);
  background: var(--color-slate-50);
}
.step-item.current .step-number {
  background: var(--color-solid);
  color: white;
  box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.1);
}

/* 未到达 */
.step-item.pending { cursor: default; }
```

### 11.4 数据展示页布局模式 (Data Display Layout)

**适用页面**：AI选校、院校详情、专业详情

#### 结果概览 + 详情布局

```
┌──────────────────────────────────────────────────────────┐
│  Header                                                   │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─ Page Hero (数据概览型) ──────────────────────────┐   │
│  │                                                    │   │
│  │  AI智能选校结果                                      │   │
│  │                                                     │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐              │   │
│  │  │ 匹配度   │ │ 推荐数   │ │ 保底数   │              │   │
│  │  │  92%    │ │   8所   │ │   5所   │              │   │
│  │  └─────────┘ └─────────┘ └─────────┘              │   │
│  │                                                     │   │
│  │  ┌──────────────────────────────────────────┐     │   │
│  │  │         竞争力雷达图                       │     │   │
│  │  │         (Canvas/SVG 渲染)                 │     │   │
│  │  └──────────────────────────────────────────┘     │   │
│  │                                                     │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  ── 操作栏 ──                                            │
│  [全部] [冲刺] [匹配] [保底]    排序: [匹配度 ▾]  [网格/列表]│
│                                                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │  学校卡片    │ │  学校卡片    │ │  学校卡片    │        │
│  │             │ │             │ │             │        │
│  │  Logo  名称  │ │  Logo  名称  │ │  Logo  名称  │        │
│  │  排名  匹配度 │ │  排名  匹配度 │ │  排名  匹配度 │        │
│  │  [查看详情→] │ │  [查看详情→] │ │  [查看详情→] │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
│                                                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │  学校卡片    │ │  学校卡片    │ │  学校卡片    │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
│                                                           │
├──────────────────────────────────────────────────────────┤
│  Footer                                                   │
└──────────────────────────────────────────────────────────┘
```

#### 统计卡片 (Stat Card) 在概览区的排列

```css
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);   /* 3列等宽 */
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.stat-card-mini {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  text-align: center;
}

.stat-card-mini .value {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-solid);
  letter-spacing: -1px;
  line-height: 1;
}

.stat-card-mini .label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-2);
}
```

#### 结果卡片网格

```css
.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);   /* 桌面端 3 列 */
  gap: var(--space-6);
}

@media (max-width: 1024px) {
  .results-grid { grid-template-columns: repeat(2, 1fr); }  /* 平板 2 列 */
}

@media (max-width: 640px) {
  .results-grid { grid-template-columns: 1fr; }             /* 手机 1 列 */
}
```

### 11.5 对话页布局模式 (Chat Page Layout)

**适用页面**：AI 对话

```
┌────────────┬────────────────────────────────────────────┐
│            │  Header (对话页有独立的顶部栏)               │
│  侧边栏    ├────────────────────────────────────────────┤
│            │                                            │
│  对话历史   │         消息区域                           │
│            │                                            │
│  ────────  │     ┌──────────────────────────┐          │
│            │     │  AI: 您好！我是留学顾问...  │          │
│  🔍 搜索   │     └──────────────────────────┘          │
│            │                                            │
│  📋 今天   │     ┌──────────────────────────┐          │
│            │     │  用户: 我想申请CS专业     │          │
│  · 对话1 ✓ │     └──────────────────────────┘          │
│  · 对话2   │                                            │
│  · 对话3   │     ┌──────────────────────────┐          │
│            │     │  AI: CS是非常热门的方向... │          │
│  ────────  │     │  🤔 思考中...              │          │
│            │     └──────────────────────────┘          │
│  Agent     │                                            │
│  选择器    │                                            │
│            │                                            │
│  · 顾问 ●  │                                            │
│  · 选校    │         (自动滚动到底部)                    │
│  · 文书    │                                            │
│  · 规划    ├────────────────────────────────────────────┤
│            │  ┌──────────────────────────────────────┐  │
│            │  │ [    输入消息...              ] [发送] │  │
│            │  └──────────────────────────────────────┘  │
└────────────┴────────────────────────────────────────────┘
```

#### 尺寸规范

| 元素 | 尺寸 |
|------|------|
| 侧边栏宽度 | 280px（比功能页稍宽，因为要显示对话标题） |
| 消息区域最大宽度 | 800px（居中于右侧区域） |
| 气泡最大宽度 | 70% 的消息区域宽度 |
| 输入框区域高度 | 72px（含按钮） |
| 消息上下间距 | 16px |
| 同一组消息的时间戳间距 | 32px |

### 11.6 网格系统进阶

#### 列数选择指南

| 内容类型 | 桌面端列数 | 平板端 | 手机端 | 说明 |
|---------|-----------|--------|--------|------|
| 功能卡片 (Feature) | 3 | 3 | 1 | Home.vue 风格 |
| 结果卡片 (Result) | 3 | 2 | 1 | 院校/专业卡片 |
| 统计卡片 (Stat) | 3~4 | 2~3 | 2 | 数据概览 |
| 列表项 (List) | 1 | 1 | 1 | 始终单列 |
| 表格 (Table) | 1 | 1 | 横向滚动 | 特殊处理 |
| 表单字段 (Form) | 1 | 1 | 1 | 始终单列（相关字段可用 2 列） |

#### 断点与响应式策略

```css
/* 超大屏 ≥ 1600px — 充分展开 */
@media (min-width: 1600px) {
  .results-grid { grid-template-columns: repeat(3, 1fr); }
  .content-wide { max-width: 1560px; }
  .data-full   { max-width: 1760px; }
}

/* 标准桌面大屏 1200~1599px — 主要适配区间 */
@media (min-width: 1200px) and (max-width: 1599px) {
  .results-grid { grid-template-columns: repeat(3, 1fr); }
  .content-wide { max-width: 1160px; }
  .data-full   { max-width: 1360px; }
}

/* 平板 — 开始缩减 */
@media (min-width: 768px) and (max-width: 1199px) {
  .results-grid { grid-template-columns: repeat(2, 1fr); }
  .content-wide,
  .data-full   { max-width: 100%; }
  /* Sidebar 可收缩为图标模式 */
}

/* 手机 — 单列优先 */
@media (max-width: 767px) {
  .results-grid { grid-template-columns: 1fr; }
  .container { padding: 0 var(--space-5); }
  /* Sidebar 变为底部 Tab 或抽屉 */
}
```

#### 非对称布局（特色场景）

当需要视觉焦点时，可以使用非对称比例：

```css
/* 2:1 主次布局 — 详情页常用 */
.asymmetric-2-1 {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-8);
}

/* 3:1 强调布局 — 数据+操作 */
.asymmetric-3-1 {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: var(--space-8);
}

/* 1:2 反向布局 — 侧边信息+主内容 */
.asymmetric-1-2 {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-8);
}
```

**使用场景**：
- 院校详情页：左侧 2fr 信息 + 右侧 1fr 操作面板
- 专业详情页：左侧 1fr 基本信息 + 右侧 2fr 详细数据

---

### 11.6 全局页脚规范 (SiteFooter) ⭐

> **本章是全局页脚的单一权威规范。** 所有非沉浸式页面（除 AI 聊天外）必须使用统一的 `SiteFooter` 组件。

#### 11.6.1 页脚显示规则

| 页面类型 | 路由示例 | 是否显示 SiteFooter | 原因 |
|---------|---------|-------------------|------|
| 首页 | `/` | ✅ 显示（组件内部渲染） | 首页自身引入 `SiteFooter` |
| 工具页 | `/assessment`, `/timeline`, `/materials`, `/university-database` 等 | ✅ 显示（App.vue 注入） | 标准内容页面 |
| 详情页 | `/school-detail/:id`, `/major-detail/:id` | ✅ 显示（App.vue 注入） | 标准内容页面 |
| 配置页 | `/ai-config` | ✅ 显示（App.vue 注入） | 标准内容页面 |
| **AI 对话** | `/ai-chat` | ❌ 不显示 | 沉浸式全屏体验，无头无尾 |

**实现位置**：[App.vue](src/App.vue) 通过 `v-if="!isImmersivePage && !isHomePage"` 控制注入，首页 [Home.vue](src/views/Home.vue) 自行引入。

#### 11.6.2 组件架构

```
SiteFooter.vue (src/components/common/SiteFooter.vue)
├── 波浪过渡区域 (.footer-transition)
│   ├── wave-layer-3 (最底层, opacity:0.3, 10s 呼吸动画)
│   ├── wave-layer-2 (中层, opacity:0.5, 6s 反向呼吸)
│   └── wave-layer-1 (顶层, solid 色, 8s 呼吸)
│   └── transition-stars (12 个随机星点)
├── 页脚主体 (.site-footer)
│   ├── footer-glow-line (顶部动态光线, 4s 滑动渐变)
│   ├── footer-stars (20 个背景星点, twinkle 动画)
│   └── .container → .footer-content (grid: 1.5fr 1fr 1fr 1fr)
│       ├── footer-brand (品牌 Logo SVG + 标题 + 描述)
│       ├── footer-links (快速链接 × 6)
│       ├── footer-help (帮助支持 × 3, 含 emit 事件)
│       └── footer-contact (联系方式 + 社交链接 × 3)
│   └── .footer-bottom (版权声明)
```

#### 11.6.3 事件接口

```vue
<!-- 父组件使用方式 -->
<SiteFooter
  @show-guide="handleShowGuide"
  @show-contact="handleShowContact"
/>
```

| 事件名 | 触发条件 | 父组件处理 |
|--------|---------|-----------|
| `show-guide` | 点击「使用指南」链接 | App.vue: `guideVisible = true`; Home.vue: `guideVisible = true` |
| `show-contact` | 点击「联系我们」链接 | App.vue: `contactVisible = true` |

#### 11.6.4 装饰层设计原则

页脚属于 **高光区 (High-Light Zone)**，允许以下装饰元素：

| 装饰元素 | 类型 | 动画 | 用途 |
|---------|------|------|------|
| 多层波浪过渡 | SVG path | `wave-breathe` 缩放呼吸 (6~10s) | 内容区→深色页脚的视觉缓冲 |
| 顶部发光线 | CSS gradient | `glow-line-move` 滑动 (4s) | 品质感边界强调 |
| 星空粒子 | 绝对定位 div | `star-twinkle` 闪烁 (2~4s) | 深色背景上的层次感 |
| 自定义 Logo SVG | 内联 SVG | `tassel-swing` 摆动 (3s) + hover 放大脉冲 | 品牌识别度强化 |
| 社交图标 hover | border + transform | translateY(-3px) + scale(1.2) | 交互反馈 |

> **注意**：以上装饰仅限页脚（高光区）。内容区的表格、表单、卡片等仍遵循 §9 反模式清单。

#### 11.6.5 响应式断点

| 断点 | grid 列数 | 布局变化 |
|------|----------|---------|
| ≥ 993px | 4 列 (1.5fr 1fr 1fr 1fr) | 完整布局，标题下划线左对齐 |
| 576px ~ 992px | 2 列 (1fr 1fr) | 折半显示 |
| ≤ 576px | 1 列 | 单列居中，标题下划线居中，链接 flex 横排 |

---

## 十二、页面布局模板

> 本章提供 5 类页面的完整 ASCII 线框图模板。AI 重构时可直接参考这些模板进行排版。

### 12.1 工具页完整模板 (UniversityDatabase / Materials)

```
╔══════════════════════════════════════════════════════════╗
║  ══ Header (fixed, h:64px, bg: white, border-bottom) ══  ║
╠═══════════╦═════════════════════════════════════════════╣
║           ║  ═══ Page Hero (h:300~360px) ═══           ║
║  Sidebar  ║                                               ║
║  (w:240)  ║        院校数据库                            ║
║           ║   探索全球顶尖院校，找到最适合你的目标          ║
║  ○ 首页    ║                                               ║
║  ○ 背景评估 ║   ┌──────────────────────────┐[🔍][搜索]   ║
║  ● 院校数据库║   │                          │           ║
║  ○ AI选校   ║   └──────────────────────────┘           ║
║  ○ 时间规划 ║   [#计算机] [#商科] [#工程] [#艺术] ...     ║
║  ○ 材料中心 ║                                               ║
║  ○ AI对话  ║  ═══ Filter Bar (h:56px) ═══                ║
║           ║  [国家 ▾] [排名 ▾] [学费 ▾]    [☰网格][☷列表]║
║  ───────  ║                                               ║
║           ║  ═══ Results Area ═══                        ║
║           ║                                               ║
║           ║  ┌──────────┐ ┌──────────┐ ┌──────────┐     ║
║           ║  │ 🏫 Logo  │ │ 🏫 Logo  │ │ 🏫 Logo  │     ║
║           ║  │ MIT      │ │ Stanford │ │ Oxford   │     ║
║           ║  │ #1 全球  │ │ #3 全球  │ │ #2 英国  │     ║
║           ║  │ 匹配 95% │ │ 匹配 89% │ │ 匹配 91% │     ║
║           ║  │ [详情 →] │ │ [详情 →] │ │ [详情 →] │     ║
║           ║  └──────────┘ └──────────┘ └──────────┘     ║
║           ║                                               ║
║           ║  ┌──────────┐ ┌──────────┐ ┌──────────┐     ║
║           ║  │ 🏫 Logo  │ │ 🏫 Logo  │ │ 🏫 Logo  │     ║
║           ║  │ Cambridge│ │ ETH      │ │ UCL      │     ║
║           ║  └──────────┘ └──────────┘ └──────────┘     ║
║           ║                                               ║
║           ║  [◄ 上一页]    第 3 / 24 页    [下一页 ►]    ║
╠═══════════╩═════════════════════════════════════════════╣
║  ══ Footer (bg: --color-solid, 全宽深色) ══              ║
╚══════════════════════════════════════════════════════════╝
```

### 12.2 表单页完整模板 (Assessment)

```
╔══════════════════════════════════════════════════════════╗
║  ══ Header (fixed, h:64px) ══                          ║
╠═════════════════════════════════════════════════════════╣
║                                                         ║
║  ═══ Compact Hero (h:160px, 居中) ═══                  ║
║                                                         ║
║                   背景评估              Step 2 / 5       ║
║            ████████████░░░░░░░  40%                      ║
║                                                         ║
╠═════════════════╦═══════════════════════════════════════╣
║                 ║                                           ║
║  Step Sidebar  ║   Form Content (max-w: 600px, 居中)      ║
║  (w:220)       ║                                           ║
║                 ║   ┌──────────────────────────────┐      ║
║  ①基本信息  ✓   ║   │ 学术成绩                        │      ║
║                 ║   └──────────────────────────────┘      ║
║  ②学术成绩  ●←  ║                                           ║
║                 ║   GPA                               ┌──────┐║
║  ③语言成绩  ○   ║   └────────────────────────────────┤ 3.8  │║
║                 ║                                       └──────┘║
║  ④科研经历  ○   ║                                           ║
║                 ║   本科院校                           ┌──────┐║
║  ⑤实践背景  ○   ║   └────────────────────────────────┤清华  │║
║                 ║                                       └──────┘║
║                 ║                                           ║
║                 ║   专业名称                           ┌──────┐║
║                 ║   └────────────────────────────────┤CS    │║
║                 ║                                       └──────┘║
║                 ║                                           ║
║                 ║   排名/奖项                           ┌──────┐║
║                 ║   └────────────────────────────────┤前5%  │║
║                 ║                                       └──────┘║
║                 ║                                           ║
║                 ║          [  ← 上一步  ]  [  下一步 →  ]  ║
║                 ║                                           ║
╠═════════════════╩═════════════════════════════════════════╣
║  ══ Footer ══                                           ║
╚══════════════════════════════════════════════════════════╝
```

### 12.3 数据展示页完整模板 (SchoolRecommendation)

```
╔══════════════════════════════════════════════════════════╗
║  ══ Header ══                                           ║
╠═════════════════════════════════════════════════════════╣
║                                                         ║
║  ═══ Data Hero (h:420px) ═══                           ║
║                                                         ║
║                  AI 智能选校结果                         ║
║           基于您的背景，为您推荐以下院校                   ║
║                                                         ║
║    ┌──────────┐  ┌──────────┐  ┌──────────┐            ║
║    │  匹配度   │  │  推荐数   │  │  保底数   │            ║
║    │   92%   │  │   8 所   │  │   5 所   │            ║
║    └──────────┘  └──────────┘  └──────────┘            ║
║                                                         ║
║         ┌─────────────────────────────┐                 ║
║         │                             │                 ║
║         │      ◆ 竞争力雷达图 ◆       │                 ║
║         │                             │                 ║
║         └─────────────────────────────┘                 ║
║                                                         ║
╠═════════════════════════════════════════════════════════╣
║  [全部] [冲刺校] [匹配校] [保底校]   排序:[匹配度▾] [网格/列表]║
║                                                         ║
║  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    ║
║  │ 🏫           │ │ 🏫           │ │ 🏫           │    ║
║  │ MIT          │ │ Stanford     │ │ UC Berkeley  │    ║
║  │ ──────────── │ │ ──────────── │ │ ──────────── │    ║
║  │ #1 全球综合  │ │ #3 全球综合  │ │ #4 全球综合  │    ║
║  │ 匹配度: 95%  │ │ 匹配度: 89%  │ │ 匹配度: 86%  │    ║
║  │             │ │             │ │             │    ║
║  │ CS #1       │ │ CS #5       │ │ CS #8       │    ║
║  │ 学费: $58k  │ │ 学费: $62k  │ │ 学费: $44k  │    ║
║  │             │ │             │ │             │    ║
║  │ [查看详情 →] │ │ [查看详情 →] │ │ [查看详情 →] │    ║
║  └──────────────┘ └──────────────┘ └──────────────┘    ║
║                                                         ║
║  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    ║
║  │ 🏫 CMU       │ │ 🏫 Caltech   │ │ 🏫 Cornell   │    ║
║  │ ...          │ │ ...          │ │ ...          │    ║
║  └──────────────┘ └──────────────┘ └──────────────┘    ║
║                                                         ║
╠═════════════════════════════════════════════════════════╣
║  ══ Footer ══                                           ║
╚══════════════════════════════════════════════════════════╝
```

### 12.4 对话页完整模板 (AIChat)

```
╔══════════╦═══════════════════════════════════════════════╗
║          ║  ══ Chat Header (h:60px) ═══                 ║
║  History  ║  [+ 新建对话]          [Agent: 顾问 ▾] [设置] ║
║  Panel   ╠═══════════════════════════════════════════════╣
║  (w:280) ║                                                  ║
║          ║           欢迎回来！                            ║
║  🔍搜索  ║     我是您的留学顾问，有什么可以帮助您？          ║
║          ║                                                  ║
║  今天     ║   ┌──────────────────────────────────────┐     ║
║  ───────  ║   │ 👤  您好，我想了解一下美国CS项目      │     ║
║          ║   │    14:32                              │     ║
║  · 选校咨询║   └──────────────────────────────────────┘     ║
║  · 文书修改║                                                  ║
║  · 签证问题║   ┌──────────────────────────────────────┐     ║
║          ║   │ 🤖  美国CS项目是全球最热门的选择之一...  │     ║
║  昨天     ║   │                                          │     ║
║  ───────  ║   │ 根据最新排名，Top10 的院校包括：         │     ║
║          ║   │ 1. MIT  2. Stanford  3. CMU ...          │     ║
║  · 语言准备║   │                                          │     ║
║  · 实习推荐║   │ 您目前的GPA和语言成绩如何？             │     ║
║          ║   └──────────────────────────────────────┘     ║
║  Agent   ║                                                  ║
║  ───────  ║   ┌──────────────────────────────────────┐     ║
║          ║   │ 👤  我的GPA是3.8，托福105              │     ║
║  ●顾问    ║   └──────────────────────────────────────┘     ║
║  ○选校    ║                                                  ║
║  ○文书    ║   ┌──────────────────────────────────────┐     ║
║  ○规划    ║   │ 🤖  非常优秀的成绩！根据这个背景...    │     ║
║          ║   │    🤔 正在思考中...                    │     ║
║          ║   └──────────────────────────────────────┘     ║
║          ║                                                  ║
║          ║ ═══════════════════════════════════════════    ║
║          ║ │ [💎输入消息...                    ] [发送 ↑] │    ║
║          ║ ═══════════════════════════════════════════    ║
╚══════════╩═══════════════════════════════════════════════╝
```

### 12.5 详情页/弹窗完整模板 (SchoolDetail / Dialog)

```
╔══════════════════════════════════════════════════════════╗
║  ══ Header ══                                           ║
╠═════════════════════════════════════════════════════════╣
║                                                         ║
║  ═══ Detail Hero (紧凑型, h:200px) ═══                  ║
║                                                         ║
║  [← 返回]         Massachusetts Institute of Technology  ║
║                                                             ║
║  MIT  │  Cambridge, Massachusetts, USA                    ║
║        │  #1 QS World University Rankings 2026           ║
║  🏫    │  Private Research University  ·  Established 1861║
║                                                             ║
╠═════════════════════════════════════════════════════════╣
║                                                         ║
║  ┌─────────────────────┬──────────────────────────────┐  ║
║  │                     │                              │  ║
║  │  信息主体 (flex:2)  │  操作面板 (flex:1)           │  ║
║  │                     │                              │  ║
║  │  ┌───────────────┐ │  ┌──────────────────────┐   │  ║
║  │  │ 学校简介       │ │  │ 快速信息              │   │  ║
║  │  │ MIT是世界...   │ │  │ 类型: 私立研究型      │   │  ║
║  │  │               │ │  │ 学生: 11,500          │   │  ║
║  │  │               │ │  │ 师生比: 3:1           │   │  ║
║  │  └───────────────┘ │  │ 录取率: 6.7%          │   │  ║
║  │                     │  │ 学费: $57,986/年       │   │  ║
║  │  ┌───────────────┐ │  └──────────────────────┘   │  ║
║  │  │ 学术声誉       │ │                              │  ║
║  │  │ ★★★★★ 5.0    │ │  ┌──────────────────────┐   │  ║
║  │  │               │ │  │ 匹配度分析             │   │  ║
║  │  └───────────────┘ │  │ ██████████░░  85%     │   │  ║
║  │                     │  │                        │   │  ║
║  │  ┌───────────────┐ │  │ [加入对比]  [开始申请] │   │  ║
║  │  │ 热门专业       │ │  └──────────────────────┘   │  ║
║  │  │ #1 CS          │ │                              │  ║
║  │  │ #2 EE          │ │  ┌──────────────────────┐   │  ║
║  │  │ #3 Math        │ │  │ 相关推荐              │   │  ║
║  │  │ #4 Physics     │ │  │ · Stanford            │   │  ║
║  │  └───────────────┘ │  │ · Berkeley             │   │  ║
║  │                     │  │ · CMU                  │   │  ║
║  └─────────────────────┴──────────────────────────────┘  ║
║                                                         ║
╠═════════════════════════════════════════════════════════╣
║  ══ Footer ══                                           ║
╚══════════════════════════════════════════════════════════╝
```

---

## 十三、视觉层级与动线

> 本章解决"用户第一眼看哪里、第二眼看哪里"的问题。没有动线设计的页面，即使每个组件都符合规范，整体看起来也是平散的。

### 13.1 三级视觉层级系统

每个页面必须建立清晰的三级层级：

```
Level 1: 主要焦点 (Primary Focus)
├── 用户必须第一时间看到的信息
├── 只能有 1 个（唯一性是关键）
├── 手段: 最大字号 + 最重字重 + --color-solid + 最多留白
└── 示例: 页面标题、关键数据数字、主要 CTA 按钮

Level 2: 支持信息 (Supporting Info)
├── 用户看完焦点后自然看到的信息
├── 可以有 2~4 个（形成信息组）
├── 手段: 中等字号 + 正常字重 + --color-text-secondary + 标准间距
└── 示例: 副标题、描述文字、统计卡片的 label、表格内容

Level 3: 辅助细节 (Auxiliary Details)
├── 用户主动寻找时才需要的信息
├── 数量不限（但要有组织）
├── 手法: 小字号 + 浅色文字 + --color-text-tertiary/muted + 紧凑间距
└── 示例: 脚注、时间戳、帮助提示、次要操作链接
```

#### 层级实现手段优先级

| 手段 | 层级影响 | 使用成本 | 推荐度 |
|------|---------|---------|--------|
| **尺寸大小** | ⭐⭐⭐⭐⭐ | 零 | 最有效，首选 |
| **色彩对比** | ⭐⭐⭐⭐ | 低 | solid vs secondary vs tertiary |
| **空间位置** | ⭐⭐⭐⭐ | 零 | 左上角 > 其他位置 |
| **字重粗细** | ⭐⭐⭐ | 零 | bold vs semibold vs normal |
| **留白包围** | ⭐⭐⭐ | 零 | 焦点元素周围加大 spacing |
| **边框/背景** | ⭐⭐ | 低 | 仅用于需要强化的元素 |

**黄金法则**：永远先用"大小"建立层级，再用"颜色"强化层级。不要反过来。

### 13.2 阅读动线模式 (Reading Patterns)

#### F 型动线 — 适用于文字密集页面

```
用户的视线轨迹（热度递减）：
 
  1st ████░░░░░░░░░  ← 横扫：标题、第一行最重要
  2nd ████░░░░░░░░░  ← 横扫：副标题、关键信息
  3rd ██░░░░░░░░░░░  ↓ 竖扫：左侧列表、导航
  4th ██░░░░░░░░░░░  ← 短横扫：中间段落开头
  5th ░░░░░░░░░░░░░  ← 注意力快速衰减
```

**应用**：
- 把最重要的信息放在左上角区域
- 每段的第一句承载最重要的信息（新闻式写作）
- 左侧放导航/索引，右侧放详细内容
- 适用于：院校详情页、文章页、说明文档

#### Z 型动线 — 适用于布局均衡页面

```
视线轨迹：
 
  1st →████████████████←  横扫顶部（标题 + Hero）
       ↘                ╲
  2nd   ░░░░░░░░░░░░░░░  斜向右下（视觉引导线）
         ↙              ╱
  3rd →████████████████←  横扫中部（主要内容首屏）
       ↘                ╲
  4th   ░░░░░░░░░░░░░░░  继续向下...
```

**应用**：
- 重要 CTA 放在对角线末端（右下角区域）
- 利用对角线方向引导视线从标题流向 CTA
- 适用于：落地页、营销页、Home.vue

#### 中心辐射型 — 适用于数据展示页面

```
         中心焦点
           ↓
    ┌──────┼──────┐
    │      │      │
    ↓      ↓      ↓
  数据A  数据B  数据C
    │      │      │
    ↓      ↓      ↓
  详情A  详情B  详情C
```

**应用**：
- 中心放核心指标（如雷达图、总评分）
- 周围环绕支撑数据（统计卡片）
- 再外围放详细信息（卡片列表）
- 适用于：AI选校结果页、评估报告页

### 13.3 信息密度管理

#### 密度等级定义

| 密度等级 | 适用场景 | 特征 |
|---------|---------|------|
| **稀疏 (Sparse)** | Hero 区域、CTA 区域 | 大量留白、少量大元素、呼吸感强 |
| **舒适 (Comfortable)** | 功能介绍、空状态 | 标准间距、信息层次分明、不拥挤 |
| **标准 (Standard)** | 表单、设置面板 | 合理间距、信息完整但不压抑 |
| **紧凑 (Compact)** | 数据表格、列表视图 | 间距略小、信息密度高但可读 |
| **密集 (Dense)** | Dashboard 监控面板 | 最小间距、最大化信息展示 |

#### 同一页面内的密度变化（节奏感）

```
一个优秀页面的密度剖面：

↑ 高
│                                    ████████  表格/列表区 (Compact)
│                                 ██
│                                ██
│                               ██
│                              ██  标准内容区 (Comfortable)
│                             ██
│                            ██
│                           ██
│                         ██    Hero/CTA 区 (Sparse)
│                       ██
│                      ██
│                     ██
└──────────────────────────────────────────────────→ 页面滚动

规律: Sparse → Comfortable → Compact → (循环)
避免: 全程同密度（单调）或 随机跳变（混乱）
```

### 13.4 留白即设计 (Whitespace as Design Element)

留白不是"空白"，而是**最廉价且最有效的分组工具**。

#### 留白的四种功能

| 功能 | 做法 | 示例 |
|------|------|------|
| **分组 (Grouping)** | 相关元素靠近，不相关元素拉开 | 卡片内部 padding 24px，卡片之间 gap 24px |
| **强调 (Emphasis)** | 目标元素周围增加留白 | Section 标题下方 48px 留白，让标题"悬浮" |
| **呼吸 (Breathing)** | 大面积均匀留白 | Hero 区域 96px 上下 padding |
| **导向 (Direction)** | 不对称留白引导视线 | 左侧留白多 → 视线向右移动 |

#### 微间距 vs 宏间距

```css
/* 微间距 — 元素内部的紧密关系 */
.icon-and-text { gap: var(--space-2); }      /* 8px: 图标和文字 */
.label-and-input { gap: var(--space-2); }    /* 8px: 标签和输入框 */
.tag-items { gap: var(--space-2); }           /* 8px: 标签之间 */

/* 中间距 — 元素之间的正常关系 */
.card-inner-padding { padding: var(--space-8); } /* 16px: 卡片内 */
.field-spacing { margin-bottom: var(--space-6); } /* 24px: 字段之间 */
.section-element-gap { gap: var(--space-8); }    /* 32px: 区块内子元素 */

/* 宏间距 — 区块之间的分隔关系 */
.section-padding { padding: var(--space-24) 0; }  /* 96px: Section 之间 */
.title-to-content { margin-bottom: var(--space-12); } /* 48px: 标题到内容 */
.hero-bottom-margin { margin-bottom: var(--space-16); } /* 64px: Hero 底部 */
```

### 13.5 对齐与网格 (Alignment & Grid)

#### 严格对齐原则

> **"如果两个元素的左边缘看起来'差不多对齐'，那它们就不对齐。"**

- ✅ 所有文本基线严格水平对齐
- ✅ 卡片顶部严格对齐（不管内容高度是否一致）
- ✅ 表格列严格垂直对齐
- ✅ 按钮组基准线对齐
- ❌ "差不多"对齐（人眼会立刻察觉 1~2px 的偏差）
- ❌ 居中对齐不同长度的文本块（左对齐更易读）

#### 隐形网格思维

即使不画出来，所有元素都应该落在隐形的网格交叉点上：

```
每行的 baseline 都要对齐到 8px 网格线：

  行1: ───────────  (y = 0px)
  
  行2: ───────────  (y = 48px)
  
  行3: ───────────  (y = 104px)
  
  行4: ───────────  (y = 160px)
  
  所有元素的上下边缘都落在 8px 的倍数线上
  这样即使元素高度不同，视觉上也会感觉"整齐"
```

### 13.6 页面视觉检查清单

完成任何页面后，按以下顺序做视觉走查：

**第一步：闭眼后睁眼，第一眼看到了什么？**
- [ ] 是否一眼就能识别页面主题？（标题够不够突出）
- [ ] 第一视线落点是否是你期望的主要焦点？
- [ ] 有没有一个元素在和焦点"抢戏"？如果有，削弱它

**第二步：视线自然流动路径**
- [ ] 从标题 → 副标题 → 主要内容 → CTA，路径是否顺畅？
- [ ] 有没有任何地方视线会"卡住"或"迷路"？
- [ ] 次要信息是否会误抢主要信息的注意力？

**第三步：层级清晰度**
- [ ] 把页面模糊到看不清文字，只看色块——层级还清晰吗？
- [ ] Level 1 / Level 2 / Level 3 能否明确区分？
- [ ] 是否存在两个同级元素却用了不同强度？

**第四步：呼吸感**
- [ ] 是否有任何区域感觉"窒息"（太密）？→ 增加间距
- [ ] 是否有任何区域感觉"空洞"（太松）？→ 收紧或加内容
- [ ] 页面从头滚到尾，密度变化是否有节奏？

**第五步：对齐检查**
- [ ] 截图后拉辅助线，所有元素是否严格对齐？
- [ ] 卡片顶部是否在同一水平线？
- [ ] 文本基线是否统一？

---

## 附录 A：CSS 变量快速参考卡

```css
/* === 颜色 === */
--color-solid: #0F172A;              /* 主交互色 — 无限使用 */
--color-solid-hover: #1E293B;        /* hover 专用 */
--color-accent: #D97706;             /* 强调色 — ≤3次/页 */
--color-accent-light: #FBBF24;       /* 点缀色 — ≤2次/页 */
--color-accent-subtle: #FEF3C7;      /* 背景色 */

--color-slate-50 ~ --color-slate-900; /* 灰阶工作色 — 无限使用 */

/* === 间距 === */
--space-4: 16px;   --space-6: 24px;   --space-8: 32px;
--space-10: 40px;  --space-12: 48px;  --space-24: 96px;

/* === 字体 === */
--font-family-base: 'Inter', 'PingFang SC', ...;     /* 99% 内容 */
--font-family-display: 'Playfair Display', ...;       /* 仅 Hero/CTA/品牌名 */
--font-family-mono: 'JetBrains Mono', ...;            /* 代码/数据 */

--text-xs: 12px;  --text-sm: 14px;  --text-base: 16px;
--text-lg: 18px;  --text-xl: 20px;  --text-2xl: 24px;
--text-3xl: 30px; --text-4xl: 36px; --text-5xl: 48px;

/* === 圆角 === */
--radius-sm: 4px;  --radius-md: 6px;  --radius-lg: 8px;
--radius-xl: 12px; --radius-2xl: 16px;

/* === 阴影 === */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 6px rgba(0,0,0,0.06);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.06);

/* === 过渡 === */
--transition-fast: 150ms ease;
--transition-normal: 250ms ease;
--transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## 附录 B：重构检查清单

在 AI 重构完每个页面后，逐项检查：

### 颜色一致性
- [ ] 零硬编码颜色值（无 `#1E3A5F`、`#B8860B`、`#D4AF37`、`rgba(30,58,95,...)`、`rgba(184,134,11,...)`）
- [ ] 所有颜色使用 `var(--color-*)` 变量
- [ ] Accent 色使用 ≤ 3 次/页
- [ ] 按钮背景为纯色 `var(--color-solid)`，非渐变

### 反模式排查
- [ ] 无渐变按钮背景（`linear-gradient` 做按钮 bg）
- [ ] 无渐变文字（`background-clip: text`）
- [ ] 无多层发光阴影
- [ ] 内容区无装饰动画（shimmer/pulse/flow）
- [ ] 无 `scale()` hover（非图标元素）
- [ ] Display 字体仅用于 Hero/CTA/品牌名

### 布局与层级
- [ ] 页面骨架符合第十一章对应类型的布局模式（工具页/表单页/数据展示页/对话页）
- [ ] Sidebar 宽度 240px、Active 状态用左侧 3px 色条指示
- [ ] Hero 区域高度合理（工具页 280~360px、表单页 160px、数据展示页 420px）
- [ ] 内容区使用正确的网格列数（桌面端 3 列卡片 / 平板 2 列 / 手机 1 列）
- [ ] 建立了清晰的三级视觉层级（L1 焦点唯一 / L2 支持信息 / L3 辅助细节）
- [ ] 页面密度有节奏变化（Sparse → Comfortable → Compact，非全程一致）
- [ ] 所有元素严格对齐（无"差不多"对齐）
- [ ] 留白使用正确：微间距 8px / 中间距 16~32px / 宏间距 48~96px

### 组件规范
- [ ] 按钮符合 8.1 规范
- [ ] 卡片符合 8.2 规范
- [ ] 表单元素符合 8.3 规范
- [ Section 标题符合 8.6 规范
- [ ] 空状态符合 8.7 规范
- [ ] 自定义 Select 下拉组件符合 8.8 规范（禁止原生 `<select>`）
- [ ] Toast 通知系统符合 14.3 规范（禁止依赖 ElMessage）

### 响应式
- [ ] 移动端布局正确
- [ ] 字体大小适配
- [ ] 间距适配（移动端减半）
- [ ] 触控目标 ≥ 44px

### 可访问性
- [ ] 颜色对比度 ≥ 4.5:1（正文）
- [ ] Focus 状态可见
- [ ] 减弱动画已支持

### Vue 工程规范 (§14)
- [ ] 内联组件使用 `h()` 渲染函数，禁止 `template` 字符串（反模式 #33）
- [ ] 子组件样式使用 `:deep()` 穿透符（反模式 #34）
- [ ] 禁止原生 `<select>`，使用 CustomSelect 组件（反模式 #31, #36）
- [ ] Toast 通知使用自定义系统 + Teleport，不依赖 ElMessage（反模式 #32, #35）
- [ ] Toast 在 onUnmounted 时清理 timer，避免内存泄漏
- [ ] 测试中/加载中状态按钮 disabled 防重复点击

### 视觉走查（完成设计后执行）
- [ ] 闭眼睁眼测试：第一眼看到的是否是预期焦点？
- [ ] 视线流动路径：标题→内容→CTA 是否顺畅？
- [ ] 模糊测试：只看色块时层级是否依然清晰？
- [ ] 密度节奏：滚动全程是否有疏密变化？
- [ ] 对齐检查：拉辅助线验证严格对齐

---

**文档版本**：v2.4
**设计哲学**：Slate + Amber 单色极简 · 全宽优先布局 · 策略性装饰 · 全域设计感 · Vue 工程约束 · 统一页脚
**对标参考**：Apple / Stripe / Linear / Vercel
**最后更新**：2026年4月

---

## 变更日志 (Changelog)

| 版本 | 日期 | 核心变更 |
|------|------|---------|
| **v2.4** | 2026-04 | **§11.6 全局页脚规范 (SiteFooter)**（页脚统一策略：波浪过渡/发光线/星空动画/自定义Logo，组件化提取，显示规则表，事件接口，装饰层设计原则，响应式断点）<br>新增 `SiteFooter.vue` 共享组件替代旧 `app-footer` |
| v2.3 | 2026-04 | **§8.8 自定义 Select 下拉组件规范**（禁止原生 `<select>`，含结构/CSS/交互/图标完整规范）<br>**§14 Vue 工程规范**（`:deep()` 样式穿透 / `h()` 渲染函数 vs template 字符串 / 自定义 Toast 系统）<br>**§9.6 Vue 工程反模式**（#33~#36，直接导致功能失效的工程级反模式）<br>附录 B 新增「Vue 工程规范」检查项 |
| v2.2 | 2026-04 | 容器体系重构（全宽优先）：5 级容器体系、混合宽度布局、data-full 负 margin 突破技巧、断点系统升级为 1600/1200/768 |
| v2.1 | 2026-04 | §11 布局设计模式 + §12 页面模板 + §13 视觉层级与动线：Page Hero、三级视觉层级、信息密度节奏、留白分组、严格对齐网格 |
| v2.0 | 2026-04 | 基础版：色彩系统(第二章)、组件规范(第八章)、反模式清单(第九章)、页面类型分类(第十章) |
