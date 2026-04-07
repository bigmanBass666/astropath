# 院校推荐结果页 — Awwwards 级重构计划

## 一、创意概念：从「功能展示」到「智能报告的优雅揭晓」

### 叙事核心（Narrative Core）
> **"AI 已完成分析，这是一份为你量身定制的留学路线图"**

页面不是在"展示搜索结果"，而是在**递交给用户一份精心编排的报告**。每一次滚动都是报告的新一页被揭开。

### 视觉语言（Visual Language）
延续 PreferenceCollector 已建立的 **全屏分步向导** 设计语言：
- 超大字号作为视觉锚点（`clamp(48px, 7vw, 96px)`）
- 背景数字水印（`wiz-bg-numeral` 模式）
- 径向光晕氛围层
- BEM 命名 + `ud-` 前缀（与院校库一致）
- 仅使用 `#0F172A` / `#D97706` / Slate 灰阶

### 交互哲学
**「滚动即揭示」** — 每个区块随滚动依次入场，形成从概览→细节的递进式信息架构。

---

## 二、当前问题诊断

### 2.1 Results Hero（结果首屏）
| 问题 | 描述 |
|------|------|
| 标题不够震撼 | `clamp(36px, 5.5vw, 64px)` 对比 PreferenceCollector 的 `88px` 偏小 |
| Stats 展示平庸 | 简单 flex 横排，缺少视觉张力 |
| 缺少装饰元素 | 无背景水印、无光晕、无动态感 |
| 与偏好页风格断裂 | Hero 用了完全不同的设计语言 |

### 2.2 Filter Bar（筛选栏）
| 问题 | 描述 |
|------|------|
| 标准工具栏感 | 就是普通的按钮组 + 下拉框，没有设计感 |
| 与内容割裂 | 独立的 sticky bar，像硬贴上去的 |
| 缺少玻璃态/融合 | 可以用 backdrop-blend 融入页面 |

### 2.3 RecommendationList（推荐列表容器）
| 问题 | 描述 |
|------|------|
| Intro Block 太素 | 白色圆角卡片 + 图标 + 文字，非常模板化 |
| 分区标题平淡 | `★ 核心推荐` + count badge，缺乏设计层次 |
| 卡片网格规整 | 3列等宽网格，所有卡片一样大，无主次之分 |
| 备选区仅降低透明度 | `opacity: 0.92` 太偷懒，应该有独立的视觉处理 |

### 2.4 SchoolCard（学校卡片）⭐ 核心改造对象
| 问题 | 描述 |
|------|------|
| 信息密度均匀 | 排名、名称、标签、理由、匹配度、详情、操作——全部等权重呈现 |
| 匹配度不够突出 | 只是一个小进度条，应该是卡片的视觉焦点 |
| AI 推荐理由被埋没 | 小字灰色文字，但这是 AI 产品最核心的差异点 |
| 所有卡片同尺寸 | Top 1 应该有特殊待遇（Featured Card） |
| 缺少悬停深度 | 只有 translateY，可以加 3D tilt |

### 2.5 SchoolAnalysisDialog（分析弹窗）
| 问题 | 描述 |
|------|------|
| **重度依赖 Element Plus** | `el-dialog` + `el-tag` + `el-input` + `el-button` — 完全破坏 Awwwards 风格 |
| 默认样式未覆盖 | 圆角、阴影、字体全是 Element Plus 默认值 |
| 流式输出区简陋 | 简单 `<pre>` 标签，无打字机效果 |
| 追问输入用 el-input | 与页面其他输入框风格不统一 |

### 2.6 整体页面节奏
```
当前：Hero(普通) → FilterBar(工具条) → IntroBlock(白卡片) → Cards(网格) → Footer(操作)
理想：Hero(电影级) → [Filter融入] → FeaturedCard(主角) → CardGrid(群演) → AIInteraction(对话感)
```

---

## 三、改造方案（按组件逐一详述）

### 3.1 Results Hero 重构 → `page-results` 区域

**目标**：打造一个"报告封面"级别的首屏，让用户第一眼就感受到 AI 的专业性和结果的珍贵感。

**布局变更**：
```
┌──────────────────────────────────────────────────────┐
│  ┌─ 装饰性背景 ──────────────────────────────────┐  │
│  │  大数字水印 "RESULTS" / 径向光晕 / 网格纹理   │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─ 左侧：文案区 ────┐  ┌─ 右侧：Stats 可视化 ─┐  │
│  │                    │  │                       │  │
│  │  ✓ 推荐           │  │   ┌───────────┐      │  │
│  │                    │  │   │   87%     │      │  │
│  │  AI 智能选校       │  │   │ 综合匹配度 │      │  │
│  │  结果报告          │  │   └───────────┘      │  │
│  │                    │  │                       │  │
│  │  基于你的背景...    │  │   6 所核心  │ 3 所备选│  │
│  │                    │  │                       │  │
│  └────────────────────┘  └───────────────────────┘  │
│                                                      │
│  ══════════════════ 渐变分隔线 ════════════════════  │
└──────────────────────────────────────────────────────┘
```

**具体改动**：
- 标题字号提升到 `clamp(44px, 6vw, 72px)`，副标题 `clamp(28px, 4vw, 44px)` 使用 Amber 色
- Stats 区改为**圆形/弧形仪表盘风格**或**大号数字 + 细线**组合
- 添加 `results-bg-numeral` 超大装饰文字（类似 PreferenceCollector 的 `01`/`02`/`03`）
- 添加 `results-glow` 径向光晕
- Badge 行保留但重新设计为胶囊链样式
- 过渡动画：标题逐词 reveal，stats 数字 CountUp 时序错开

### 3.2 Filter Bar 重构 → 融入式筛选

**目标**：让筛选不再是独立工具条，而是内容的一部分。

**方案**：将筛选器移入 Hero 底部或 Intro Block 顶部，采用**芯片导航**形式：

```css
/* 新方案：融入式筛选 */
.results-filter-fusion {
  display: flex;
  gap: 8px;
  padding: 6px;
  background: #F8FAFC;
  border-radius: 16px;  /* 胶囊形容器 */
  width: fit-content;
}

.filter-pill {
  padding: 10px 24px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  /* active: solid bg + shadow */
}
```

- 移除 sticky 定位（或改为极淡的 glass morphism：`backdrop-filter: blur(20px)` + 半透明白底）
- 排序选择器重写为自定义下拉（不用原生 `<select>`）

### 3.3 RecommendationList 重构

#### 3.3.1 Intro Block → 报告摘要面板
- 从白色卡片变为**左侧 accent 条 + 大面积留白**的设计
- 文案字号加大，行高加宽
- AI Summary 文字可以用引用样式（左侧竖线 + 斜体）

#### 3.3.2 Section Headers → 带编号的大标题
```
★ CORE                              6 所
─────────────────────────────────────
```
改为：
```
┌─ 01 ──────────────────────────────────┐
│  核心推荐                              │
│  AI 匹配度 ≥ 70% 的最优选             │
└───────────────────────────────────────┘
```

#### 3.3.3 Card Grid → 不对称布局
- **Featured Card**（匹配度最高的第1张）：跨 2 列，更大尺寸，特殊边框
- 其余卡片：标准尺寸，2-3列网格
- 备选区域：整体降调处理（不同背景色或边框样式），不是简单 opacity

### 3.4 SchoolCard 重构 ⭐ 最重要

**新卡片结构**：
```
┌─────────────────────────────────────────┐
│ ░ 左侧彩色指示条 (3px, gradient)        │
│                                         │
│  [#12 MIT]                    [☆ 收藏] │
│                                         │
│  Massachusetts Institute of Technology  │  ← 字号加大到 21-23px
│                                         │
│  🇺🇸 美国 · #1 · CS · Engineering    │
│                                         │
│  ┌─ AI 推荐理由 ────────────────────┐  │
│  │ 你的 GPA 3.9 与 MIT 录取中位... │  │  ← 加大区域，更易读
│  └──────────────────────────────────┘  │
│                                         │
│         ╭────────╮                     │
│  匹配度  │  92%  │  ← 圆形/弧形仪表   │
│         ╰────────╯                     │
│  ████████████████████░░ 92%            │
│                                         │
│  ──────────── ──────────── ────        │
│  $57,590/年   4.1% 录取率              │
│                                         │
│  [▶ 查看详情]  [？ 为什么推荐]          │
└─────────────────────────────────────────┘
```

**关键改动点**：
1. **匹配度可视化升级**：从细长条改为**半圆弧形仪表盘**（CSS `conic-gradient`），数字居中显示
2. **AI 推荐理由区域扩大**：padding 增加，字号从 13px → 14-15px，行高 1.7
3. **学校名字体加大**：19px → 22px，weight 800 → 900
4. **Featured Card 特殊处理**（index === 0 的 core 卡片）：
   - 尺寸放大（更多 padding）
   - 左侧指示条加粗到 4px + glow
   - 顶部添加 "BEST MATCH" 小标签
   - 微妙的金色光晕背景
5. **悬停效果增强**：
   - CSS 3D perspective tilt（`--mx/--my` 变量驱动，与院校库一致）
   - 匹配度弧形仪表在 hover 时做填充动画
6. **详情区分隔线优化**：用更细腻的双线或点状分隔

### 3.5 SchoolAnalysisDialog 完全重写 ⭐ 第二重要

**目标**：彻底抛弃 Element Plus Dialog，用完全自定义的模态框。

**新设计方案**：
```
┌─ 全屏遮罩 (backdrop-blur) ──────────────────────┐
│                                                  │
│     ┌─ 自定义对话框 ──────────────────────┐      │
│     │                                      │      │
│     │  ┌─ 学校头部 ──────────────────┐    │      │
│     │  │ MIT                         │    │      │
│     │  │ 🇺🇸 美国 · #1 · 4.1% 录取  │    │      │
│     │  └──────────────────────────────┘    │      │
│     │                                      │      │
│     │  ┌─ 录取概率评估 ──────────────┐    │      │
│     │  │     ████████░░  高 (85%)    │    │      │
│     │  └──────────────────────────────┘    │      │
│     │                                      │      │
│     │  ✓ 匹配点                           │      │
│     │  ├ GPA 达到录取中位数以上            │      │
│     │  ├ 科研经历与项目方向高度契合        │      │
│     │  └ ...                               │      │
│     │                                      │      │
│     │  ⚠ 风险提示                         │      │
│     │  ├ 竞争极度激烈                     │      │
│     │  └ ...                               │      │
│     │                                      │      │
│     │  💡 申请建议                         │      │
│     │  ├ ...                               │      │
│     │                                      │      │
│     │  ┌─ 追问输入 ──────────────────┐    │      │
│     │  │ [还有疑问？继续追问...]  ▶  │    │      │
│     │  └──────────────────────────────┘    │      │
│     │                                      │      │
│     │        [关闭]  [查看详情 →]          │      │
│     └──────────────────────────────────────┘      │
│                                                  │
└──────────────────────────────────────────────────┘
```

**实现要点**：
- 用 `Teleport` + 自定义 div 替代 `el-dialog`
- 遮罩层：`background: rgba(15,23,42,0.4); backdrop-filter: blur(8px)`
- 面板：居中，max-width 720px，圆角 24px，自定义滚动条
- 各分析分区（匹配点/风险/建议）用不同左边框颜色区分
- 流式输出区：打字机效果（CSS animation 逐步显示字符或用 JS 控制）
- 输入框复用 PreferenceCollector 的 `stage-textarea` 风格
- 按钮：复用 `gen-btn` 风格

### 3.6 页面级过渡与微交互

| 交互点 | 当前 | 改造后 |
|--------|------|--------|
| 页面进入动画 | Vue Transition fade+blur | 标题逐词 reveal + stats CountUp 错开 + 卡片依次入场 |
| 卡片入场 | 无（一次性渲染） | IntersectionObserver 触发，stagger 0.1s |
| 筛选切换 | 即时切换 | 卡片 grid 做 300ms 的 fade reflow |
| 收藏点击 | 图标变色 | 心形图标 scale 弹跳 + 粒子飞散（纯 CSS） |
| 悬停卡片 | translateY(-8px) | 3D perspective tilt（--mx/--my） |
| 匹配度数值 | 静态 | CountUp 动画（进入视口时触发） |

---

## 四、实施步骤

### Step 1: Results Hero 重构
**文件**: [SchoolRecommendation.vue](src/views/SchoolRecommendation.vue) — `.results-hero` 和 `.stats-showcase` 区域
- 重写 `.results-hero` 模板和样式
- 添加背景装饰（numeral + glow）
- 标题字号提升，Stats 可视化升级
- 入场动画

### Step 2: Filter Bar 融入式重写
**文件**: [SchoolRecommendation.vue](src/views/SchoolRecommendation.vue) — `.filter-bar` 区域
- 重写为胶囊芯片导航
- 自定义排序下拉
- glass morphism 背景

### Step 3: RecommendationList 容器重构
**文件**: [RecommendationList.vue](src/components/school-recommendation/RecommendationList.vue)
- Intro Block → 报告摘要面板
- Section Headers → 带编号大标题
- 卡片网格 → 支持 Featured Card 不对称布局
- 整体滚动入场动画

### Step 4: SchoolCard 核心重构 ⭐
**文件**: [SchoolCard.vue](src/components/school-recommendation/SchoolCard.vue)
- 匹配度 → conic-gradient 半圆仪表
- AI 推荐理由区域扩大
- 学校名/元数据字号调整
- Featured Card 特殊样式（index=0）
- 3D tilt 悬停效果
- 收藏动画增强

### Step 5: SchoolAnalysisDialog 完全重写 ⭐
**文件**: [SchoolAnalysisDialog.vue](src/components/school-recommendation/SchoolAnalysisDialog.vue)
- 移除 el-dialog 依赖，改用 Teleport + 自定义模态框
- 全新样式系统（与 PreferenceCollector 风格统一）
- 流式输出区美化
- 追问输入框统一样式

### Step 6: 页面过渡动画协调
**文件**: [SchoolRecommendation.vue](src/views/SchoolRecommendation.vue)
- `page-transition` 动画增强
- 结果页各区块 IntersectionObserver 交错入场
- CountUp 组件触发时机优化

### Step 7: 响应式适配 + 验证
- 三断点（1200 / 1024 / 768）完整测试
- `npm run typecheck` + `npm run lint`
- 浏览器手动验证（按 CLAUDE.md 测试规范 D 类）

---

## 五、不改什么

- **数据流/逻辑**：所有 props/emits/computed 保持不变
- **API 调用**：不改动任何请求逻辑
- **路由结构**：不影响 `/school-recommendation` 路由
- **PreferenceCollector**：已完成的重构不动
- **UniversityDatabase**：院校库页面不动
- **配色系统**：严格只用 `#0F172A` / `#D97706` / Slate / White

---

## 六、预期视觉效果对比

```
=== 重构前 ===                          === 重构后 ===

┌─ 标准工具风 ─┐                      ┌─ 电影报告风 ──────────────┐
│ [全部][核心]  │                      │                             │
│ 排序 ▼        │                      │   AI 智能选校               │
├───────────────┤                      │   结果报告                   │
│ ✓ 推荐完成    │                      │                             │
│ 基于你的背景.. │                      │   87%  6所  3所            │
├───────────────┤                      │   (仪表盘) (大数字)          │
│ ★ 核心推荐 6所 │                      ═══════════════════════════   │
│ [card][card]  │                      │                             │
│ [card][card]  │                      │  ┌─ BEST MATCH ─────────┐  │
│ [card][card]  │                      │  │  MIT (Featured!)     │  │
├───────────────┤                      │  │  ◉ 92%  (弧形仪表)    │  │
│ 备选方案 3所   │                      │  │  AI推荐理由(大区域)   │  │
│ [card][card]  │                      │  │  [查看] [分析]        │  │
│ [card]        │                      │  └───────────────────────┘  │
├───────────────┤                      │                             │
│ [告诉AI...] [►]│                      │  [card] [card] [card]     │
│ [重填] [对比]  │                      │  [card] [card] [card]     │
└───────────────┘                      └─────────────────────────────┘
```
