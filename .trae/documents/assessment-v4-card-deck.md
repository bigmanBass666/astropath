# 🎬 Assessment V4 — 全屏卡片组 + 电影级翻页动画

> **设计哲学**：从「滚动页面」到「交互式产品演示」
>
> **核心理念**：「每一页都是一场精心编排的演出」— 不是表单，而是探索之旅

---

## 一、问题诊断

### V3 的根本性局限

用户的核心诉求是：**每一部分全屏 + 按钮导航 + 翻页动画**

V3 虽然做了大量视觉升级，但 **交互范式仍然是滚动驱动**：
- 用户仍然需要滚动来查看内容
- 不同章节之间没有明确的「切换」感
- 无法控制用户看到内容的节奏和顺序
- 缺乏电影级的转场体验

**V4 要解决的根本问题：将交互模型从 Scroll → Card Deck**

---

## 二、架构方案：Full-Screen Card Deck

### 2.1 核心概念

```
┌──────────────────────────────────────────┐
│                                          │
│           ┌────────────────────┐         │
│           │                    │  ←      │
│           │   CARD 0: HERO     │  导     │
│           │   (100dvh 全屏)    │  航     │
│           │                    │  栏     │
│           └────────────────────┘  (固定) │
│                                          │
│  ← 按钮点击 → 动画过渡 → 下一张卡片 →    │
│                                          │
│           ┌────────────────────┐         │
│           │                    │         │
│           │  CARD 1: IDENTITY  │         │
│           │   (100dvh 全屏)    │         │
│           │                    │         │
│           └────────────────────┘         │
│                                          │
└──────────────────────────────────────────┘
```

**关键特性**：
- ✅ 每张卡片严格 `100dvh`（全屏）
- ✅ `position: fixed; inset: 0` 堆叠布局
- ✅ **禁用滚动** (`overflow: hidden` on body)
- ✅ 纯按钮/键盘导航
- ✅ 电影级 CSS 转场动画

### 2.2 5 张卡片定义

| # | 卡片名称 | 内容 | 内部 CTA |
|---|---------|------|---------|
| **0** | HERO | 大标题 Wave 动画 + Metric + Scroll Hint 替换为 CTA | 「开始评估 →」 |
| **1** | IDENTITY | 姓名(超大输入框) + 年龄/学校 Chips + GPA Ring + 语言 | 「继续 →」 |
| **2** | ACADEMICS | 学位 Segmented Control + 专业 Capsule Cloud + 均分 + 科研时间线 | 「继续 →」 |
| **3** | EXPERIENCE+CTA | 三轨 Sticky Tabs 时间线 + **沉浸式 CTA** | 「✨ 生成 AI 分析报告」 |
| **4** | REPORT | Reveal Moment 4 阶段（保持 V2/V3 设计不变） | 终点，无导航 |

### 2.3 转场动画系统 — 5 组独特效果

#### 转场引擎参数

```javascript
const TRANSITION = {
  duration: 600,        // 标准 600ms
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)', // Expo Out
}
```

#### Card 0 → 1 (Hero → Identity): 「幕布升起」

```
Hero 卡片:
  transform: translateY(-40px) scale(0.95)
  opacity: 1 → 0
  filter: blur(4px)  // 渐隐时模糊

Identity 卡片:
  初始: translateY(60px) scale(0.97) opacity:0
  结束: translateY(0) scale(1) opacity:1
  内部元素 stagger 入场:
    - 标题: delay 0ms
    - Name 输入框: delay 120ms
    - Age/University Chips: delay 200ms
    - GPA Ring: delay 280ms
    - Language: delay 340ms
```

#### Card 1 → 2 (Identity → Academics): 「弹性滑入」

```
Identity 卡片:
  transform: translateX(-30px) rotate(-2deg)
  opacity: 1 → 0

Academics 卡片:
  初始: translateX(60px) opacity:0
  中间: translateX(-10px) overshoot (t=400ms)
  结束: translateX(0) opacity:1
  Degree Pills 弹跳入场 (Back Out 曲线)
  Major Tags cascade 选中态演示
```

#### Card 2 → 3 (Academics → Experience): «吸入/绽放»

```
Academics 卡片:
  transform: scale(0.8)
  opacity: 1 → 0
  border-radius: 0 → 40px (圆角化消失)

Experience 卡片:
  初始: scale(1.15) opacity:0
  结束: scale(1) opacity:1
  Track Tabs 从底部滑上
  Timeline entries cascade 展开
```

#### Card 3 → 4 (Experience → Report): 「穿越隧道」

```
Experience 卡片:
  transform: translateY(80px)
  opacity: 1 → 0
  filter: blur(12px)

Report 卡片:
  初始: translateY(-20px) scale(1.02) opacity:0
  结束: translateY(0) scale(1) opacity:1
  触发 Reveal Moment 序列！
  Stage ① Score Reveal 自动播放...
```

#### 反向转场 (Backward): 所有反向使用镜像对称的动画

---

## 三、DOM 结构设计

### 3.1 新模板结构

```html
<template>
  <div class="ap" :class="{ 'ap--transitioning': isTransitioning }">
    <div class="ap-noise" />

    <!-- ═══ CARD DECK ═══ -->
    <div class="card-deck">

      <!-- Card 0: Hero -->
      <section
        class="deck-card"
        :class="cardClass(0)"
        data-card="hero"
      >
        <!-- Hero 内容（保留现有）-->
        <!-- 新增: 底部 CTA 按钮「开始评估 →」 -->
      </section>

      <!-- Card 1: Identity -->
      <section
        class="deck-card deck-card--form"
        :class="cardClass(1)"
        data-card="identity"
      >
        <!-- Identity 表单内容 -->
        <!-- 新增: 底部 CTA 按钮「继续 →」 -->
      </section>

      <!-- Card 2: Academics -->
      <section
        class="deck-card deck-card--form"
        :class="cardClass(2)"
        data-card="academics"
      >
        <!-- Academics 表单内容 -->
        <!-- 新增: 底部 CTA 按钮「继续 →」 -->
      </section>

      <!-- Card 3: Experience + CTA -->
      <section
        class="deck-card deck-card--form"
        :class="cardClass(3)"
        data-card="experience"
      >
        <!-- Experience 内容 + CTA -->
      </section>

      <!-- Card 4: Report -->
      <section
        class="deck-card deck-card--report"
        :class="cardClass(4)"
        data-card="report"
      >
        <!-- Reveal Moment 报告内容 -->
      </section>

    </div>

    <!-- ═══ DECK NAVIGATION ═══ -->
    <nav class="deck-nav" v-show="currentCard < 4 || reportGenerated">
      <button
        class="deck-nav-btn deck-nav-btn--prev"
        :disabled="currentCard === 0 || isTransitioning"
        @click="prevCard"
      >
        <svg><!-- 左箭头 --></svg>
      </button>

      <div class="deck-dots">
        <button
          v-for="(card, i) in cards"
          :key="i"
          class="deck-dot"
          :class="{ active: currentCard === i, done: currentCard > i }"
          @click="goToCard(i)"
        />
      </div>

      <button
        class="deck-nav-btn deck-nav-btn--next"
        :disabled="currentCard >= cards.length - 1 || isTransitioning"
        @click="nextCard"
      >
        <svg><!-- 右箭头 --></svg>
      </button>
    </nav>
  </div>
</template>
```

### 3.2 卡片 Class 计算逻辑

```javascript
const cardClass = (index) => {
  const classes = []
  
  if (index === currentCard.value) {
    classes.push('deck-card--active')
  } else if (index < currentCard.value) {
    classes.push('deck-card--prev')
  } else {
    classes.push('deck-card--next')
  }
  
  if (exitingCard.value === index) {
    classes.push(`deck-card--exit-${exitDirection.value}`)
  }
  
  if (enteringCard.value === index) {
    classes.push(`deck-card--enter-${enterDirection.value}`)
  }
  
  return classes
}
```

---

## 四、状态机与脚本逻辑

### 4.1 核心状态

```javascript
const currentCard = ref(0)
const isTransitioning = ref(false)
const exitDirection = ref('')   // 'up' | 'left' | 'zoom-out' | 'down'
const enterDirection = ref('') // 'from-down' | 'from-right' | 'zoom-in'
const exitingCard = ref(null)
const enteringCard = ref(null)

const cards = [
  { id: 'hero', label: '首页' },
  { id: 'identity', label: '身份信息' },
  { id: 'academics', label: '学术背景' },
  { id: 'experience', label: '实践经历' },
  { id: 'report', label: '分析报告' }
]
```

### 4.2 导航方法

```javascript
const nextCard = async () => {
  if (isTransitioning.value || currentCard.value >= cards.length - 1) return
  
  // 可选：验证当前卡片必填项
  if (!await validateCurrentCard()) return
  
  await goToCard(currentCard.value + 1, 'forward')
}

const prevCard = async () => {
  if (isTransitioning.value || currentCard.value <= 0) return
  await goToCard(currentCard.value - 1, 'backward')
}

const goToCard = async (targetIndex, direction = 'forward') => {
  if (isTransitioning.value || targetIndex === currentCard.value) return
  if (targetIndex < 0 || targetIndex >= cards.length) return
  
  isTransitioning.value = true
  const fromIndex = currentCard.value
  
  // 设置方向特定的退出/进入类名
  setTransitionClasses(fromIndex, targetIndex, direction)
  
  currentCard.value = targetIndex
  
  // 等待动画完成
  await new Promise(r => setTimeout(r, TRANSITION.duration))
  
  // 清理动画类
  clearTransitionClasses()
  isTransitioning.value = false
}
```

### 4.3 方向映射（每对卡片的独特转场）

```javascript
const TRANSITION_MAP = {
  '0>1': { exit: 'up', enter: 'from-down' },       // Hero→Identity: 幕布升起
  '1>2': { exit: 'left', enter: 'from-right' },     // Identity→Academics: 弹性滑动
  '2>3': { exit: 'zoom-out', enter: 'zoom-in' },     // Academics→Exp: 吸入绽放
  '3>4': { exit: 'down-blur', enter: 'from-top' },   // Exp→Report: 隧道穿越
  // 反向
  '1<0': { exit: 'down', enter: 'from-up' },
  '2<1': { exit: 'right', enter: 'from-left' },
  '3<2': { exit: 'zoom-out-rev', enter: 'zoom-in-rev' },
  '4<3': { exit: 'up-blur', enter: 'from-bottom' },
}

function setTransitionClasses(from, to, direction) {
  const key = direction === 'forward' ? `${from}>${to}` : `${to}<${from}`
  const map = TRANSITION_MAP[key] || { exit: 'fade-out', enter: 'fade-in' }
  
  exitingCard.value = from
  enteringCard.value = to
  exitDirection.value = map.exit
  enterDirection.value = map.enter
}
```

### 4.4 键盘支持

```javascript
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const handleKeydown = (e) => {
  if (isTransitioning.value) return
  
  switch(e.key) {
    case 'ArrowRight':
    case 'Enter':
    case ' ': // Space
      e.preventDefault()
      nextCard()
      break
    case 'ArrowLeft':
      e.preventDefault()
      prevCard()
      break
  }
}
```

### 4.5 触摸滑动支持（移动端）

```javascript
let touchStartX = 0
let touchStartY = 0

const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

const handleTouchEnd = (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX
  const dy = e.changedTouches[0].clientY - touchStartY
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)
  
  // 水平滑动 > 垂直滑动，且距离 > 50px
  if (absDx > absDy && absDx > 50) {
    if (dx > 0) prevCard()  // 右滑 → 上一张
    else nextCard()         // 左滑 → 下一张
  }
}
```

---

## 五、CSS 转场动画系统

### 5.1 卡片基础样式

```css
/* ═══ Card Deck 容器 ═══ */
.card-deck {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
}

/* ═══ 单张卡片 — Fixed 全屏堆叠 ═══ */
.deck-card {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  overflow-y: auto; /* 卡片内部可滚动（表单内容多时） */
  overflow-x: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;
  
  /* 默认隐藏 */
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  
  /* GPU 加速 */
  will-change: transform, opacity;
  transition: none; /* 由 JS 控制动画 */
}

/* 当前活动卡片 */
.deck-card--active {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  z-index: 10;
  position: relative; /* 活动卡片脱离 fixed，允许正常文档流 */
  transform: none;
}

/* 之前的卡片（左侧待命）*/
.deck-card--prev {
  z-index: 1;
}

/* 之后的卡片（右侧待命）*/
.deck-card--next {
  z-index: 1;
}
```

### 5.2 退出动画类

```css
/* 向上退出 (Hero→Identity) */
.deck-card--exit-up {
  z-index: 11 !important;
  animation: cardExitUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes cardExitUp {
  to {
    transform: translateY(-40px) scale(0.95);
    opacity: 0;
    filter: blur(4px);
  }
}

/* 向左退出 (Identity→Academics) */
.deck-card--exit-left {
  z-index: 11 !important;
  animation: cardExitLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes cardExitLeft {
  to {
    transform: translateX(-30px) rotate(-2deg);
    opacity: 0;
  }
}

/* 缩小退出 (Academics→Experience) */
.deck-card--exit-zoom-out {
  z-index: 11 !important;
  animation: cardExitZoomOut 0.55s cubic-bezier(0.7, 0, 0.3, 1) forwards;
}
@keyframes cardExitZoomOut {
  to {
    transform: scale(0.8);
    opacity: 0;
    border-radius: 40px;
  }
}

/* 向下模糊退出 (Experience→Report) */
.deck-card--exit-down-blur {
  z-index: 11 !important;
  animation: cardExitDownBlur 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes cardExitDownBlur {
  to {
    transform: translateY(80px);
    opacity: 0;
    filter: blur(12px);
  }
}
```

### 5.3 进入动画类

```css
/* 从下方进入 (Hero→Identity) */
.deck-card--enter-from-down {
  z-index: 12 !important;
  animation: cardEnterFromDown 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes cardEnterFromDown {
  from {
    transform: translateY(60px) scale(0.97);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* 从右进入 (Identity→Academics) */
.deck-card--enter-from-right {
  z-index: 12 !important;
  animation: cardEnterFromRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes cardEnterFromRight {
  from {
    transform: translateX(60px);
    opacity: 0;
  }
  50% {
    transform: translateX(-8px); /* overshoot */
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 放大进入 (Academics→Experience) */
.deck-card--enter-zoom-in {
  z-index: 12 !important;
  animation: cardEnterZoomIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes cardEnterZoomIn {
  from {
    transform: scale(1.15);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 从上方进入 (Experience→Report) */
.deck-card--enter-from-top {
  z-index: 12 !important;
  animation: cardEnterFromTop 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes cardEnterFromTop {
  from {
    transform: translateY(-20px) scale(1.02);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
```

### 5.4 底部导航栏

```css
/* ═══ DECK NAVIGATION ═══ */
.deck-nav {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 28px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
}

.deck-nav-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  background: #fff;
  color: #64748B;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.deck-nav-btn:hover:not(:disabled) {
  border-color: #94A3B8;
  color: #0F172A;
  background: #FAFBFC;
  transform: scale(1.08);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.deck-nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
}

/* 进度点 */
.deck-dots {
  display: flex;
  gap: 8px;
}

.deck-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #CBD5E1;
  background: transparent;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 0;
}

.deck-dot:hover:not(.active):not(.done) {
  border-color: #94A3B8;
  transform: scale(1.2);
}

.deck-dot.active {
  background: #D97706;
  border-color: #D97706;
  box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.15);
  transform: scale(1.15);
}

.deck-dot.done {
  background: #0F172A;
  border-color: #0F172A;
}

@media (max-width: 767px) {
  .deck-nav {
    bottom: 16px;
    padding: 10px 20px;
    gap: 14px;
    border-radius: 16px;
  }

  .deck-nav-btn {
    width: 38px;
    height: 38px;
    border-radius: 10px;
  }

  .deck-dot {
    width: 8px;
    height: 8px;
  }
}
```

### 5.5 每张卡片内部的「下一步」按钮

```css
/* ═══ Card Internal CTA ═══ */
.card-cta {
  display: flex;
  justify-content: center;
  margin-top: auto;
  padding: 32px 0 48px;
}

.btn-card-next {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  background: linear-gradient(135deg, #0F172A, #1E293B);
  border: none;
  border-radius: 14px;
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.2);
}

.btn-card-next:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.25);
}

.btn-card-next svg {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-card-next:hover svg {
  transform: translateX(4px);
}
```

---

## 六、每张卡片的具体改造

### 6.1 Card 0: Hero

**改动点**：
- 移除 `.hero-scroll-hint`（不再需要滚动提示）
- 在 `.hero-inner` 底部添加 **「开始评估 →」** CTA 按钮
- 点击触发 `nextCard()`
- 保持现有 Wave 动画和视觉效果

```html
<!-- 在 hero-metric 之后添加 -->
<div class="hero-cta">
  <button class="btn-hero-start" @click="nextCard">
    开始评估
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
  </button>
</div>
```

### 6.2 Card 1: Identity

**改动点**：
- 整体变为全屏居中布局（max-width: 720px, margin: auto）
- 在表单底部添加 **「继续 →」** CTA
- 点击前可选验证姓名和学校是否填写
- 保持所有现有表单组件（Name 输入框、Chips、GPA Ring 等）

### 6.3 Card 2: Academics

**改动点**：
- 同样全屏居中布局
- 底部 **「继续 →」** CTA
- 保持 Segmented Control、Capsule Cloud、Research Timeline

### 6.4 Card 3: Experience + CTA

**改动点**：
- 三轨时间线占据主要空间
- 底部保留现有的 **沉浸式 CTA**（生成 AI 分析报告）
- CTA 点击调用 `generateReport()` 然后 `goToCard(4)`

### 6.5 Card 4: Report

**改动点**：
- **完全保持现有 Reveal Moment 设计**
- 只需确保在 `deck-card--report` 容器内正常渲染
- 隐藏底部导航栏（或显示为完成状态）

---

## 七、保护清单（不改动）

以下模块在 V2/V3 中已完美，V4 **完全不修改**：

- ✅ AI Stream 逻辑（aiStream, callAIAnalysis, retry/stop/pause/resume）
- ✅ Reveal Moment 4 阶段报告系统（Score/Radar/Dimensions/AI Panel）
- ✅ 数据模型 form reactive 对象结构
- ✅ localStorage 持久化逻辑（loadFromStorage, watch, saveReport）
- ✅ resetForm 完整逻辑
- ✅ GPA Ring SVG 组件
- ✅ Research/Internship/Competition/Volunteer CRUD
- ✅ 配色系统 (#0F172A / #D97706 / #FFFFFF)
- ✅ 字体系统 (JetBrains Mono for data)
- ✅ 动画曲线 (Expo Out, Back Out)
- ✅ Element Plus Deep Overrides (Amber Focus Glow)
- ✅ 无障碍支持 (prefers-reduced-motion)

---

## 八、实施阶段

| Phase | 内容 | 复杂度 |
|-------|------|--------|
| **P1** | Card Deck 容器架构 — fixed 堆叠 + currentCard 状态 | 🔴 高 |
| **P2** | 底部导航栏 + goToCard/nextCard/prevCard 方法 | 🔴 高 |
| **P3** | 转场动画引擎 — 5 组 exit/enter CSS @keyframes | 🔴 高 |
| **P4** | 每张卡片内部 CTA 按钮添加 + Hero CTA 改造 | 🟡 中 |
| **P5** | 键盘导航 + 触摸滑动支持 | 🟢 低 |
| **P6** | typecheck + lint + 浏览器完整测试 | 🔴 必须 |

---

## 九、验收标准

### 自动化检查
- [ ] `npm run typecheck` 通过（0 errors）
- [ ] `npm run lint` 通过（0 new issues）

### 手动验证
- [ ] 页面加载后只显示 Card 0 (Hero)，其他卡片隐藏
- [ ] 点击「开始评估」→ Card 1 以「从下方进入」动画出现
- [ ] Hero 以「向上模糊退出」动画消失
- [ ] Card 1 表单可正常填写（输入、选择、拖拽 GPA）
- [ ] 点击「继续」→ Card 2 以「弹性滑入」动画出现
- [ ] Card 2 表单可正常操作
- [ ] 点击「继续」→ Card 3 以「放大进入」动画出现
- [ ] 三轨时间线正常工作
- [ ] 点击「生成 AI 分析报告」→ Card 4 以「隧道穿越」动画出现
- [ ] Reveal Moment 4 阶段正常播放
- [ ] 底部导航栏正确显示当前进度
- [ ] 点击进度点可直接跳转到对应卡片
- [ ] 返回按钮可以回到上一张卡片（带反向动画）
- [ ] 键盘 Arrow Left/Right 可以切换卡片
- [ ] 移动端触摸左右滑动可以切换卡片
- [ ] 转场期间重复点击不会导致问题
- [ ] 配色合规（仅 #0F172A / #D97706 / #FFFFFF）
- [ ] 三个断点响应式正常（桌面/平板/移动）

---

*文档版本: v4.0*
*创建时间: 2026-04-07*
*架构师: AI Assistant (Awwwards Designer + Super Architect)*
