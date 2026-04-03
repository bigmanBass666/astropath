# 全站视觉风格统一方案 — 设计文档 v1.1

> **文档目的**：本文档是"让所有页面拥有首页同等级科技感与高级感"的完整执行指南。
> 新对话中的AI应以此文档为最高依据，配合 `docs/DESIGN_SPEC.md`（v2.4）共同执行。

---

## 零、执行指南（⭐ 每个新对话必读）

### 0.1 支持两种执行模式

**模式A：你只负责一个页面**（推荐，用户每页开一个新对话）

```
你的启动指令模板：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
请阅读 docs/plans/visual-unification-plan.md
和 docs/DESIGN_SPEC.md (v2.4)。

本次任务是：对 [页面名称] 进行视觉风格统一改造。
目标级别：[Subtle / Medium]
对应章节：§3.X

执行步骤：
1. 先检查 src/styles/atmosphere.css 是否已存在
   → 若不存在：先创建它（见 §0.2 基础设施）
   → 若已存在：直接跳到步骤 2
2. 阅读 §3.X 中该页面的完整改动方案
3. 执行改动
4. 启动 dev server 验证效果
5. 截图确认
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**模式B：你负责多个页面**

按 §五 检查清单的 Phase 顺序依次执行。Phase 1（基础设施）只需做一次。

### 0.2 基础设施（首个执行者必须创建）

> ⚠️ **重要**：如果你是第一个执行本方案的对话，你必须先完成以下基础设施创建。
> 后续对话通过检查文件是否存在来判断是否需要跳过此步。

#### 文件1: `src/styles/atmosphere.css`

```css
/* =============================================================
 * 氛围分级系统 (Atmosphere Grading System)
 * 来自: docs/plans/visual-unification-plan.md §2
 * 用法: 在各页面的 <style scoped> 中 @import 或全局引入
 * ============================================================= */

/* ===== Subtle 级氛围 ===== */
/* 适用：Assessment, AIConfig 等表单/配置页 */
.page-atmosphere--subtle {
  position: relative;
  background-color: var(--color-background-alt);
  background-image:
    linear-gradient(90deg, rgba(15, 23, 42, 0.018) 1px, transparent 1px),
    linear-gradient(rgba(15, 23, 42, 0.018) 1px, transparent 1px);
  background-size: 64px 64px, 64px 64px;
}

/* ===== Medium 级氛围 ===== */
/* 适用：UniversityDatabase, SchoolRecommendation, Timeline,
         Materials, SchoolDetail, MajorDetail 等工具/数据/详情页 */
.page-atmosphere--medium {
  position: relative;
  background-color: var(--color-background-alt);
  overflow: hidden;
  background-image:
    linear-gradient(90deg, rgba(15, 23, 42, 0.025) 1px, transparent 1px),
    linear-gradient(rgba(15, 23, 42, 0.025) 1px, transparent 1px);
  background-size: 64px 64px, 64px 64px;
}

.page-atmosphere--medium::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 25% 40%, rgba(217, 119, 6, 0.04) 0%, transparent 55%),
    radial-gradient(ellipse at 75% 60%, rgba(15, 23, 42, 0.035) 0%, transparent 55%);
}

/* ===== 底部渐变过渡（Hero→内容区的缓冲）===== */
.atmosphere-fade-bottom::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(180deg, transparent, var(--color-background));
  pointer-events: none;
}

/* ===== 入场动画 ===== */
.fade-in-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in-up.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.fade-in-up:nth-child(1) { transition-delay: 0s; }
.fade-in-up:nth-child(2) { transition-delay: 0.08s; }
.fade-in-up:nth-child(3) { transition-delay: 0.16s; }
.fade-in-up:nth-child(4) { transition-delay: 0.24s; }
.fade-in-up:nth-child(5) { transition-delay: 0.32s; }
.fade-in-up:nth-child(6) { transition-delay: 0.40s; }

.fade-in {
  opacity: 0;
  transition: opacity 0.4s ease;
}

.fade-in.is-visible {
  opacity: 1;
}

/* ===== 统一页面标题区 ===== */
.page-header {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
}

.page-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  letter-spacing: -1px;
  line-height: var(--leading-tight);
  margin: 0 0 var(--space-4) 0;
}

.page-title::after {
  content: '';
  display: block;
  width: 48px;
  height: 3px;
  background: var(--color-solid);
  margin: var(--space-4) auto 0;
  border-radius: 2px;
}

.page-title.page-title--accent::after {
  background: var(--color-accent);
}

.page-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}
```

#### 文件2: `src/composables/useScrollAnimation.ts`

```typescript
/**
 * 滚动入场动画 composable
 * 用法: const { setupAnimations, sectionRefs } = useScrollAnimation()
 *       template 中: ref="el" 绑定到需要动画的元素
 */
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useScrollAnimation() {
  const sectionRefs = Ref<HTMLElement[]>([])

  let observer: IntersectionObserver | null = null

  const setupAnimations = () => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    onMounted(() => {
      ;(sectionRefs.value as HTMLElement[]).forEach((el: HTMLElement) => {
        if (el) observer!.observe(el)
      })
    })

    onUnmounted(() => {
      if (observer) observer.disconnect()
    })

    return observer
  }

  return { sectionRefs, setupAnimations }
}
```

#### 引入方式

在 `src/main.js` 或各页面中全局引入 atmosphere.css：

```javascript
// main.js 中添加
import './styles/atmosphere.css'
```

或在各页面的 `<style>` 中：

```vue
<style scoped>
@import '@/styles/atmosphere.css';

/* 页面专属样式... */
</style>
```

---

## 一、问题诊断

### 1.1 用户核心诉求

> "首页的设计风格稳定了，但其他页面的设计风格跟首页匹配不上。我想要其他页面的设计风格与首页相匹配——那种科技感、高级感。不是要复制首页的结构，而是整个视觉风格带来的感觉一样。"

**关键约束**：
- ❌ 不是要把其他页面做成和首页一模一样的结构
- ✅ 是要让用户从首页跳到任何页面时，感觉"这是同一个产品"
- ✅ 当前非首页的页面结构本身也需要现代化改造（用户评价：除了首页都丑）

### 1.2 首页"高级感"的视觉DNA拆解

通过逐行分析 [Home.vue](src/views/Home.vue) 的代码，其视觉气质由以下 **5层要素** 构成：

#### 第1层：沉浸式Hero背景（最强科技感来源）

- Canvas 星座网络动画 (.hero-network-bg) — 25节点+动态连线+光晕
- 网格叠加层 (.hero-gradient-overlay) — 80×80网格 + 径向光晕 × 2
- 光晕脉冲装饰 (.hero-glow-decoration) — 左上amber + 右下solid
- 视差滚动效果 — 0.3x反向移动+淡出

**⚠️ 这是 High-Light Zone 专属，仅首页使用。其他页面不复制Canvas。**

#### 第2层：高级排版系统
- 主标题：Playfair Display衬线体, 52px, 700, letter-spacing -1px
- 标题下划线：100px × 4px, accent色, 居中
- 统计数字：Display字体, 36px, 800, solid色

#### 第3层：丰富微交互（仅首页High-Light Zone允许）
- card-glow-pulse 呼吸发光
- card-shimmer-sweep 光泽扫过
- spring曲线弹性hover

#### 第4层：层次丰富的视觉深度
- 图标容器4层阴影（内高光+内阴影+外阴影）

#### 第5层：入场节奏控制
- IntersectionObserver 分阶段触发
- 打字机效果（仅标题）

### 1.3 全部8个页面的差距诊断

| 页面 | 文件路径 | Hero/头部 | 内容区 | 入场动画 | 排版 | 级别 |
|------|---------|----------|--------|---------|------|------|
| Home | views/Home.vue | ✅ Canvas+网格+光晕+视差 | ✅ 多层装饰 | ✅ 打字机+分阶段 | ✅ Display | Rich(不动) |
| UniversityDatabase | views/UniversityDatabase.vue | ⚠️ 有网格无光晕 | ❌ 扁平卡片 | ⚠️ 有fadeUp | ⚠️ 基础 | **Medium** |
| SchoolRecommendation | views/SchoolRecommendation.vue | ❌ 纯色Data Hero | ❌ 冷清统计区 | ⚠️ 有fadeUp | ⚠️ 基础 | **Medium** |
| Assessment | views/Assessment.vue | ❌ 纯色紧凑Hero | ❌ 无氛围 | ⚠️ fadeUp | ✅ 步骤条OK | **Subtle** |
| Timeline | views/Timeline.vue | ❌ 纯色或弱背景 | ❌ 时间线偏朴素 | ❌ 缺失或弱 | ⚠️ 一般 | **Medium** |
| Materials | views/Materials.vue | ❌ 弱或无 | ❌ 文件列表无聊 | ❌ 缺失 | ⚠️ 一般 | **Medium** |
| AIConfig | views/AIConfig.vue | ❌ 无或极简 | ❌ 配置面板枯燥 | ❌ 缺失 | ⚠️ 一般 | **Subtle** |
| SchoolDetail | views/SchoolDetail.vue | ❌ 弗或无 | ❌ 信息堆砌 | ❌ 缺失 | ⚠️ 一般 | **Medium** |
| MajorDetail | views/MajorDetail.vue | ❌ 弱或无 | ❌ 同上 | ❌ 缺失 | ⚠️ 一般 | **Medium** |

---

## 二、解决方案：氛围分级系统 (Atmosphere Grading System)

### 2.1 核心原理

> **不是所有页面需要同等强度的装饰，但所有页面都需要"某种程度的氛围"来建立统一的视觉语言。**
> 首页Canvas是"表演级"(Rich)，其他页面用CSS-only的"氛围级"(Subtle/Medium)即可达80%统一效果。

### 2.2 三级氛围速查

| 级别 | 网格opacity | 光晕 | 动画 | 适用页面 |
|------|-----------|------|------|---------|
| **Subtle** | 0.018 | ❌ 无 | fadeUp 0.5s | Assessment, AIConfig |
| **Medium** | 0.025 | ✅ 双色光晕 | fadeUp 0.6s | 其余6个页面 |
| **Rich** | 0.04 | ✅ 多层+脉冲 | Canvas+视差+打字机 | Home(仅) |

完整CSS定义见 §0.2 `atmosphere.css`。

---

## 三、逐页优化方案（完整代码级指导）

### 3.1 P0 — UniversityDatabase（院校数据库）【Medium】

**文件**: `src/views/UniversityDatabase.vue`
**当前状态**: 有网格背景(db-hero-bg)，缺光晕，内容区扁平

#### 改动 A: Hero 区域增强

**找到现有代码** (约 L18-75):
```html
<section ref="heroRef" class="db-hero" :class="{ 'is-visible': heroVisible }">
  <div class="db-hero-bg" />
  <div class="db-hero-content">
    ...标题/搜索框/标签/统计...
  </div>
</section>
```

**改为**:
```html
<section ref="heroRef" class="db-hero page-atmosphere--medium atmosphere-fade-bottom"
         :class="{ 'is-visible': heroVisible }">
  <div class="db-hero-bg" />
  <div class="db-hero-content">
    <h1 class="db-hero-title page-title">院校数据库</h1>
    <p class="db-hero-subtitle page-subtitle">探索全球顶尖院校，找到最适合你的留学目标</p>
    <!-- 搜索框保持不变 -->
    ...
  </div>
</section>
```

**在 `<style scoped>` 中添加/修改**:

```css
.db-hero {
  padding: var(--space-20) var(--space-10) var(--space-14);
  position: relative;
}

.db-hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* 保留现有网格背景，不需要改 */
}

.db-hero-content {
  position: relative;
  z-index: 2;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}

.db-hero-title {
  /* 移除原有的 ::after 下划线，改用 .page-title 统一版本 */
}

.db-hero-title::after {
  display: none; /* 禁用原有下划线，由 .page-title::after 接管 */
}

/* 搜索框增强 */
.db-hero-search {
  max-width: 560px;
  margin: 0 auto var(--space-6);
  display: flex;
  align-items: center;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg), 0 0 0 1px var(--color-border-light);
  transition: all var(--transition-normal);
  padding: 2px;
  border: 1px solid transparent;
}

.db-hero-search:focus-within {
  border-color: var(--color-solid);
  box-shadow: var(--shadow-xl), 0 0 0 3px rgba(15, 23, 42, 0.08);
}
```

#### 改动 B: 内容区域入场动画

给主内容 section 加 class:

```html
<!-- 找到现有的 db-content section -->
<section ref="contentRef" class="db-content fade-in-up"
         :class="{ 'is-visible': contentVisible }">
```

并在 script 中确保有 IntersectionObserver（如果没有，从 §0.2 引入 useScrollAnimation）。

#### 改动 C: 卡片 hover 统一

```css
.school-card {
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.school-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border);
}

.school-card__top-bar {
  height: 3px;
  background: var(--color-solid);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.school-card:hover .school-card__top-bar {
  opacity: 1;
}
```

#### 改动 D: 筛选器激活态

```css
.filter-chip.is-active {
  background: var(--color-solid) !important;
  color: white !important;
  border-color: var(--color-solid) !important;
}
```

#### 验收标准
- [ ] Hero 区域可见微妙网格纹理
- [ ] Hero 有柔和的光晕感（不明显但能感觉到"不廉价"）
- [ ] Hero 底部有渐变过渡到白色内容区
- [ ] 标题下方有 solid 色下划线
- [ ] 搜索框 focus 时有 solid 色边框+淡光晕
- [ ] 卡片 hover 时上浮 + 阴影加深 + 顶部出现色条
- [ ] 筛选标签激活时为 solid 深色背景白字
- [ ] 内容区滚动进入时有 fadeUp 动画

---

### 3.2 P0 — SchoolRecommendation（AI选校）【Medium】

**文件**: `src/views/SchoolRecommendation.vue`
**当前状态**: Data Hero 纯色背景，统计卡片冷清

#### 改动 A: Data Hero 增强

**找到** `.data-hero` 或 `.preference-hero` section:

```html
<section class="data-hero page-atmosphere--medium atmosphere-fade-bottom">
  <div class="data-hero-content page-header">
    <h1 class="page-title">AI 智能选校结果</h1>
    <p class="page-subtitle">基于您的背景，为您推荐以下院校</p>
  </div>

  <!-- 统计卡片区 -->
  <div class="stats-row fade-in-up">
    <div class="stat-card-mini fade-in-up">...</div>
    <div class="stat-card-mini fade-in-up">...</div>
    <div class="stat-card-mini fade-in-up">...</div>
  </div>

  <!-- 雷达图 -->
  <div class="radar-section fade-in">...</div>
</section>
```

**新增/修改 CSS**:

```css
.data-hero {
  background: var(--color-background-alt);
  padding: var(--space-20) var(--space-10) var(--space-16);
  border-bottom: 1px solid var(--color-border-light);
  position: relative;
}

.data-hero-content {
  text-align: center;
}

/* 统计卡片增强 */
.stat-card-mini {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-border-light);
  transition: all var(--transition-normal);
}

.stat-card-mini::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-solid);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.stat-card-mini:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stat-card-mini:hover::before {
  opacity: 1;
}

.stat-card-mini .value {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-solid);
  letter-spacing: -1px;
  line-height: 1;
}
```

#### 改动 B: 结果卡片区域

确保筛选栏和卡片列表有入场动画:

```html
<div class="filter-bar fade-in-up">...</div>
<div class="results-grid fade-in-up">
  <!-- SchoolCard 组件已由系统修改，确认使用新版样式 -->
</div>
```

#### 改动 C: 筛选 Tab 激活态

```css
.filter-tab.is-active {
  background: var(--color-solid);
  color: white;
}
```

#### 验收标准
- [ ] Data Hero 有网格+光晕背景
- [ ] 标题居中+solid下划线
- [ ] 统计卡片 hover 时顶部出现 solid 色条
- [ ] 统计数字大号粗体 solid 色
- [ ] 筛选 tab 激活态为深色背景
- [ ] 各区块有 fadeUp 入场动画

---

### 3.3 P1 — Assessment（背景评估）【Subtle】

**文件**: `src/views/Assessment.vue`
**当前状态**: Compact Hero 纯色，步骤条功能够但视觉冷清

#### 改动 A: Compact Hero 增强

**找到** `.page-hero` div:

```html
<div class="page-hero page-atmosphere--subtle">
  <div class="hero-inner">
    <div class="hero-top">
      <h1 class="hero-title">背景评估</h1>
      <span class="hero-step-badge">Step {{ currentStep + 1 }} / {{ totalSteps }}</span>
    </div>
    <div class="progress-bar-track">
      <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }" />
    </div>
  </div>
</div>
```

**CSS 更新**:

```css
.page-hero {
  padding: var(--space-12) var(--space-10);
  border-bottom: 1px solid var(--color-border-light);
}

.hero-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.5px;
  line-height: var(--leading-tight);
  margin: 0;
}
```

#### 改动 B: 表单区块卡片化

```css
.form-section {
  animation: fadeUp 0.5s ease both;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  border: 1px solid var(--color-border-light);
  margin-bottom: var(--space-6);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### 改动 C: 按钮统一

```css
.btn-primary {
  background: var(--color-solid);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  padding: 10px 28px;
  min-height: 44px;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.btn-primary:hover {
  background: var(--color-solid-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-weight: 600;
  padding: 10px 28px;
  min-height: 44px;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.btn-secondary:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  transform: translateY(-1px);
}
```

#### 验收标准
- [ ] Hero 区域有极其微妙的网格纹理（几乎不可见但消除了"纯白廉价感"）
- [ ] 步骤侧边栏 current 态有 slate-50 背景
- [ ] 表单每个 step 区块有圆角卡片包裹
- [ ] 按钮 hover 上浮 + 阴影加深
- [ ] 进度条为 solid 色

---

### 3.4 P1 — Timeline（时间规划）【Medium】

**文件**: `src/views/Timeline.vue`

#### 改动 A: Hero 区域

```html
<div class="timeline-page">
  <section class="page-hero page-atmosphere--medium atmosphere-fade-bottom">
    <div class="page-header">
      <h1 class="page-title">时间规划</h1>
      <p class="page-subtitle">动态时间线与任务看板，轻松管理申请进度</p>
    </div>
  </section>

  <!-- 时间线主体内容 -->
  <section class="timeline-body fade-in-up">
    ...
  </section>
</div>
```

#### 改动 B: 时间线视觉增强

```css
/* 时间线容器 */
.timeline-container {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-12) var(--space-6);
}

/* 连接线 — 从实线改为虚线 */
.timeline-connector {
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: repeating-linear-gradient(
    to bottom,
    var(--color-border) 0px,
    var(--color-border) 8px,
    transparent 8px,
    transparent 16px
  );
}

/* 时间节点 */
.timeline-node {
  position: relative;
  padding-left: 60px;
  margin-bottom: var(--space-8);
}

.timeline-node::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 3px solid var(--color-solid);
  box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.08);
  z-index: 2;
}

.timeline-node.completed::before {
  background: var(--color-solid);
}

.timeline-node.current::before {
  background: var(--color-solid);
  box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.15), 0 0 12px rgba(15, 23, 42, 0.2);
}

/* 时间卡片 */
.timeline-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border);
}
```

#### 验收标准
- [ ] Hero 有 Medium 级网格+光晕
- [ ] 时间连接线为虚线（更有设计感）
- [ ] 节点圆点有外圈光晕
- [ ] 当前节点有发光强调
- [ ] 时间卡片 hover 上浮
- [ ] 整体有 fadeUp 入场

---

### 3.5 P2 — Materials（材料中心）【Medium】

**文件**: `src/views/Materials.vue`

#### 改动 A: Hero

```html
<section class="materials-hero page-atmosphere--medium atmosphere-fade-bottom">
  <div class="page-header">
    <h1 class="page-title">材料中心</h1>
    <p class="page-subtitle">文书助手与材料清单，赋能申请全流程</p>
  </div>
</section>
```

#### 改动 B: 文件卡片网格

```css
.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-6);
  padding: var(--space-8) var(--space-10);
}

.material-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.material-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-solid);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.material-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border);
}

.material-card:hover::before {
  opacity: 1;
}

.material-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--color-slate-100);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-4);
  font-size: 24px;
}

.material-card__name {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.material-card__meta {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.material-card__status {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 500;
}

.material-card__status--draft {
  background: var(--color-slate-100);
  color: var(--color-text-tertiary);
}

.material-card__status--ready {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.material-card__status--submitted {
  background: var(--color-solid);
  color: white;
}
```

#### 验收标准
- [ ] Hero Medium 氛围
- [ ] 文件卡片网格布局，响应式自适应列数
- [ ] 卡片 hover 上浮+顶部色条
- [ ] 文件类型图标区域
- [ ] 状态标签（草稿/就绪/已提交）有语义色

---

### 3.6 P2 — AIConfig（AI配置）【Subtle】

**文件**: `src/views/AIConfig.vue`

#### 改动 A: Hero（极简）

```html
<div class="config-page">
  <section class="config-hero page-atmosphere--subtle">
    <div class="page-header">
      <h1 class="page-title">AI 配置</h1>
      <p class="page-subtitle">管理你的AI服务连接与参数设置</p>
    </div>
  </section>

  <section class="config-body fade-in-up">
    ...
  </section>
</div>
```

#### 改动 B: 设置分组卡片化

```css
.config-body {
  max-width: 960px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-10);
}

.config-group {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  margin-bottom: var(--space-6);
}

.config-group__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border-light);
}

.config-group__title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.config-group__title-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--color-slate-100);
  display: flex;
  align-items: center;
  justify-content: center;
}

.config-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.config-field:last-child {
  border-bottom: none;
}

.config-field__label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.config-field__description {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-top: 2px;
}
```

#### 验收标准
- [ ] Hero 有微妙网格（几乎不可见）
- [ ] 设置分组用圆角卡片包裹
- [ ] 每组有图标+标题头部
- [ ] 字段行间有分隔线
- [ ] 整体克制但有呼吸感

---

### 3.7 P3 — SchoolDetail（院校详情）【Medium】

**文件**: `src/views/SchoolDetail.vue`

#### 改动 A: Detail Hero

```html
<div class="detail-page">
  <section class="detail-hero page-atmosphere--medium atmosphere-fade-bottom">
    <div class="detail-hero-inner">
      <div class="detail-breadcrumb">
        <a href="/university-database">← 返回院校库</a>
      </div>
      <div class="detail-hero-main">
        <div class="school-logo-area">
          <!-- 学校 Logo -->
        </div>
        <div class="school-info-area">
          <h1 class="page-title page-title--accent">{{ school.name }}</h1>
          <div class="school-meta-row">
            <span class="meta-item">{{ school.country }}</span>
            <span class="meta-divider">·</span>
            <span class="meta-item">{{ school.ranking }}</span>
            <span class="meta-divider">·</span>
            <span class="meta-item">{{ school.type }}</span>
          </div>
          <p class="page-subtitle">{{ school.description }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 主体: 2fr + 1fr 布局 -->
  <section class="detail-body content-wide fade-in-up">
    <div class="detail-main">
      ...详细信息...
    </div>
    <aside class="detail-sidebar">
      ...操作面板...
    </aside>
  </section>
</div>
```

#### 改动 B: Detail Hero CSS

```css
.detail-hero {
  padding: var(--space-16) var(--space-10) var(--space-12);
  position: relative;
}

.detail-hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.detail-breadcrumb {
  margin-bottom: var(--space-6);
}

.detail-breadcrumb a {
  color: var(--color-text-tertiary);
  font-size: var(--text-sm);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.detail-breadcrumb a:hover {
  color: var(--color-solid);
}

.detail-hero-main {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.school-logo-area {
  width: 96px;
  height: 96px;
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  flex-shrink: 0;
}

.school-info-area {
  flex: 1;
}

.school-meta-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.meta-divider {
  color: var(--color-border);
}

.detail-body {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-8);
  padding: var(--space-12) var(--space-10);
}

.detail-sidebar {
  position: sticky;
  top: calc(64px + var(--space-6));
}

/* 侧边栏快捷信息卡片 */
.sidebar-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-4);
}

.sidebar-card__label {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: var(--space-3);
}

.sidebar-card__value {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-solid);
}
```

#### 验收标准
- [ ] Detail Hero 有 Medium 氛围
- [ ] 面包屑导航
- [ ] 学校Logo + 名称 + 元数据横向排列
- [ ] 标题用 accent 下划线（详情页允许1次accent）
- [ ] 主体 2:1 分栏布局
- [ ] 侧边栏 sticky 定位
- [ ] 快捷信息用卡片展示，数字大号粗体

---

### 3.8 P3 — MajorDetail（专业详情）【Medium】

**文件**: `src/views/MajorDetail.vue`

**改动方案与 SchoolDetail 完全一致**，结构如下：

```html
<div class="detail-page">
  <section class="detail-hero page-atmosphere--medium atmosphere-fade-bottom">
    <div class="detail-hero-inner">
      <div class="detail-breadcrumb">
        <a :href="'/school-detail/' + schoolId">← 返回院校详情</a>
      </div>
      <div class="detail-hero-main">
        <div class="major-icon-area">
          <!-- 专业图标 -->
        </div>
        <div class="major-info-area">
          <h1 class="page-title page-title--accent">{{ major.name }}</h1>
          <div class="school-meta-row">
            <span>{{ schoolName }}</span>
            <span class="meta-divider">·</span>
            <span>{{ major.degree }}</span>
            <span class="meta-divider">·</span>
            <span>{{ major.duration }}</span>
          </div>
          <p class="page-subtitle">{{ major.description }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="detail-body content-wide fade-in-up">
    <div class="detail-main">...</div>
    <aside class="detail-sidebar">...</aside>
  </section>
</div>
```

CSS 直接复用 SchoolDetail 的 `.detail-*` 样式体系。

#### 验收标准
- [ ] 与 SchoolDetail 同级的视觉质感
- [ ] 专业图标替代学校Logo
- [ ] Meta 行显示所属学校+学位+学制
- [ ] 2:1 分栏布局

---

## 四、通用组件规范（跨页面一致性保证）

### 4.1 卡片 Hover 统一

所有可交互卡片必须遵循：

```css
.interactive-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.interactive-card:hover {
  transform: translateY(-2px);     /* 不要超过 -3px */
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border);
}

/* 禁止: scale() / glow阴影 / translateY超过-4px */
```

### 4.2 按钮统一

见 Assessment 方案中的 `.btn-primary` / `.btn-secondary` 定义（§3.3 改动C），所有页面统一使用相同按钮样式。

### 4.3 阴影层级

| 场景 | 使用变量 | 禁止 |
|------|---------|------|
| 默认 | `var(--shadow-sm)` | 自定义值 |
| hover | `var(--shadow-lg)` | glow/multi-layer |
| 浮层 | `var(--shadow-xl)` | — |
| dialog | `var(--shadow-2xl)` | — |

---

## 五、实施检查清单总览

| Phase | 任务 | 状态 | 负责对话 |
|-------|------|------|---------|
| **0** | 创建 `src/styles/atmosphere.css` | ☐ | **首个执行的对话** |
| **0** | 创建 `src/composables/useScrollAnimation.ts` | ☐ | **同上** |
| **0** | 在 main.js 引入 atmosphere.css | ☐ | **同上** |
| **1** | UniversityDatabase [Medium] | ☐ | 对话1 |
| **2** | SchoolRecommendation [Medium] | ☐ | 对话2 |
| **3** | Assessment [Subtle] | ☐ | 对话3 |
| **4** | Timeline [Medium] | ☐ | 对话4 |
| **5** | Materials [Medium] | ☐ | 对话5 |
| **6** | AIConfig [Subtle] | ☐ | 对话6 |
| **7** | SchoolDetail [Medium] | ☐ | 对话7 |
| **8** | MajorDetail [Medium] | ☐ | 对话8 |
| **9** | 全页面视觉走查 | ☐ | 最终验证 |

---

## 六、硬性约束（不可违反）

1. **Home.vue 禁止修改** — 已稳定
2. **内容区零装饰动画** — DESIGN_SPEC.md §7.3 + §9.3
3. **颜色必须用CSS变量** — 禁止硬编码旧色值
4. **Accent 每页 ≤ 3 次** — 稀缺性原则（SchoolDetail/MajorDetail的标题算1次）
5. **移动端同等重要** — 响应式不是事后补救
6. **AIChat.vue 不加氛围** — 沉浸式纯净体验
7. **不要删除现有功能** — 只做视觉/CSS层面的增强

---

## 七、参考文件索引

| 文件 | 作用 |
|------|------|
| [DESIGN_SPEC.md](docs/DESIGN_SPEC.md) | 最高设计规范 v2.4 |
| [Home.vue](src/views/Home.vue) | 视觉DNA参考（只读） |
| [SiteFooter.vue](src/components/common/SiteFooter.vue) | 已统一页脚 |
| [variables.css](src/styles/variables.css) | CSS 变量 |
| [REFACTORING_FRAMEWORK.md](docs/REFACTORING_FRAMEWORK.md) | 页面重构补充 |

---

**文档版本**：v1.1
**更新日期**：2026-04-04
**变更说明**：v1.0 → v1.1 — 新增 §0 执行指南（含基础设施完整代码）、补全 P3-P5 页面具体方案、添加每页验收标准
