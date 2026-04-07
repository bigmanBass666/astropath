# 🌊 Assessment V3 — 全屏沉浸式单页应用架构升级

> **设计哲学**：从「填写表单」到「参与一场关于自己的探索之旅」
>
> **核心理念**：「呼吸式沉浸」(Breathable Immersion) — 让内容自然呼吸，而非强制全屏

---

## 一、问题诊断

### 当前 V2 架构的残留问题

| 问题 | 现状 | 影响 |
|------|------|------|
| **表单被「关在笼子里」** | Identity/Academics/Experience 都包裹在白色圆角卡片内 | 视觉张力不足，与 Hero/CTA 的沉浸感割裂 |
| **空间利用不充分** | 表单区域 max-width 限制过窄（~680px） | 大屏幕上两侧留白过多，显得小气 |
| **Progress Orbit 占空间** | 右侧固定导航占用 ~60px 宽度 | 移动端体验不佳，视觉噪音 |
| **章节间节奏平淡** | 所有 Chapter 用相同的 header + card 模板 | 缺乏情绪起伏，像「填空题」而非「探索旅程」 |
| **表单交互平庸** | 标准的 Element Plus 输入框样式 | 与 Awwwards 设计语言不匹配 |

### 用户核心诉求
1. ✨ **全屏沉浸感** — 整个页面应该像一个「产品展示页」，而不是「管理后台」
- 🎨 **表单服务于设计** — 每个输入字段都是设计元素，不是 UI 组件

---

## 二、架构方案：呼吸式沉浸 (Breathable Immersion)

### 2.1 空间节奏设计

```
┌─────────────────────────────────────────┐
│  HERO (100dvh)                          │ ← 深吸一口气：全屏入场
│  - Wave 标题动画                        │
│  - Metric CountUp                       │
│  - Scroll Hint 弹跳                     │
├─────────────────────────────────────────┤
│  CHAPTER 1: IDENTITY (auto-height)      │ ← 平稳呼吸：自然流动
│  - 全宽透明背景                         │
│  - 超大 Name 输入框                     │
│  - Floating Label Chips                 │
│  - GPA Ring + 光晕                      │
├─────────────────────────────────────────┤
│  CHAPTER 2: ACADEMICS (auto-height)     │
│  - Segmented Control (Degree)           │
│  - Capsule Cloud (Majors)               │
│  - Research Timeline                    │
├─────────────────────────────────────────┤
│  CHAPTER 3: EXPERIENCE (auto-height)    │
│  - Sticky Tabs 导航                     │
│  - 三轨时间线                           │
├─────────────────────────────────────────┤
│  CTA IMMERSIVE (anchor)                 │ ← 屏住呼吸：聚焦行动
│  - 深色渐变背景                         │
│  - 脉冲光晕                             │
│  - Magnetic Button                      │
├─────────────────────────────────────────┤
│  REPORT: REVEAL MOMENT                  │ ← 呼出：释放信息
│  - Stage ① Score Reveal                │
│  - Stage ② Radar Expand                │
│  - Stage ③ Dimension Cascade            │
│  - Stage ④ AI Panel                    │
└─────────────────────────────────────────┘
         ↑
    Bottom Progress Bar (固定底部)
```

### 2.2 关键决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 章节高度 | **自适应** (非强制 100vh) | 表单内容高度不固定，强制全屏会导致留白或截断 |
| 表单容器 | **去除白色卡片外壳** | 让表单融入页面，成为「内容」而非「组件」 |
| 导航方式 | **Progress Orbit → Bottom Progress Bar** | 更现代、更节省空间、移动端友好 |
| 背景系统 | **动态渐变** (浅→中→深→深) | 引导用户情绪流，制造节奏变化 |
| 输入框样式 | **Focus Glow + Floating Label** | 提升交互品质，匹配 Awwwards 语言 |

---

## 三、详细改造计划

### Phase 1: 全局布局重构 ⚡ 最高优先级

#### 1.1 Progress Orbit → Bottom Progress Bar

**现状**：
```html
<nav class="orbit"> <!-- 右侧固定，垂直排列4个节点 --> </nav>
```

**目标**：
```html
<div class="progress-bar"> <!-- 底部固定，水平进度条 + 章节标题 --> </div>
```

**设计规格**：
- 固定在 `bottom: 0, left: 0, right: 0`
- 高度：`56px` (桌面) / `48px` (移动)
- 背景：`rgba(255, 255, 255, 0.92)` + `backdrop-filter: blur(12px)`
- 进度条：Amber 渐变 (`#D97706 → #F59E0B`)
- 当前章节标题：左侧显示（如「01 身份信息」）
- 完成节点显示 ✓ 图标

#### 1.2 去除卡片边界

**改动清单**：

| 组件 | 现状 | 目标 |
|------|------|------|
| `.identity-card` | 白色背景 + border-radius: 24px | 透明背景 + 无边框 |
| `.academics-card` | 白色背景 + border-radius: 20px | 透明背景 + 无边框 |
| `.experience-content` | 包裹在 chapter 内 | 保持，但增加 padding |

**新的 spacing 系统**：
```css
.chapter {
  padding: 80px 120px; /* 从 40px 48px 增加 */
}

@media (max-width: 1200px) {
  .chapter { padding: 60px 64px; }
}

@media (max-width: 767px) {
  .chapter { padding: 40px 24px; }
}
```

#### 1.3 背景渐变系统

```css
/* Hero 区域：浅色 */
.hero { background: linear-gradient(165deg, #FAFBFC 0%, #F1F5F9 40%, #fff 100%); }

/* Form 区域：极浅灰 → 白色过渡 */
.chapter--identity { background: linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%); }
.chapter--academics { background: #FAFBFC; }
.chapter--experience { background: linear-gradient(180deg, #FAFBFC 0%, #F8FAFC 100%); }

/* CTA + Report：深色 */
.cta-immersive { background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); }
.chapter--report { background: #F8FAFC; }
```

---

### Phase 2: Hero 升级 🎬

#### 2.1 标题动画：Wave Reveal

**效果**：标题文字逐字从下方淡入，带轻微波浪延迟

```css
.ht-line--1, .ht-line--2 {
  animation: waveReveal 1s var(--ease-expo) both;
}

.ht-line--1 { animation-delay: 0.15s; }
.ht-line--2 { animation-delay: 0.35s; }

@keyframes waveReveal {
  from { opacity: 0; transform: translateY(30px) scale(0.97); filter: blur(8px); }
  to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
```

#### 2.2 Metric 数字：CountUp 动画

**效果**：页面加载时，数字从 0 滚动到目标值

```javascript
// 使用现有的 animateScore 逻辑复用
const animateMetric = (el, target, duration = 1500) => {
  const start = 0
  const startTime = performance.now()
  
  const tick = (now) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
    el.textContent = Math.round(start + (target - start) * eased)
    
    if (progress < 1) requestAnimationFrame(tick)
  }
  
  requestAnimationFrame(tick)
}
```

#### 2.3 Scroll Hint 升级

**现状**：简单的文字 + 线条
**目标**：鼠标滚轮图标 + 弹跳动画

```html
<div class="hero-scroll-hint">
  <svg class="hsm-wheel" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="8" y="3" width="8" height="14" rx="4" />
    <circle cx="12" cy="9" r="1" fill="currentColor" />
  </svg>
  <span>向下滚动</span>
</div>
```

```css
.hsm-wheel { animation: wheelBounce 2s ease-in-out infinite; }

@keyframes wheelBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}
```

---

### Phase 3: Identity 表单改造 📝

#### 3.1 Name 输入框：超大尺寸 + 浮动标签

**现状**：标准 el-input，宽度受限
**目标**：全宽大输入框，label 在有值时浮动到上方

```html
<div class="id-name-immersive">
  <div class="ini-floating-label" :class="{ active: form.basic.name }">你的姓名</div>
  <el-input v-model="form.basic.name" placeholder=" " size="large" class="ini-input-hero" />
</div>
```

```css
.ini-input-hero :deep(.el-input__wrapper) {
  padding: 20px 24px;
  font-size: 20px;
  border-radius: 16px;
  transition: all 0.35s var(--ease-expo);
}

.ini-input-hero :deep(.el-input__wrapper:focus-within) {
  box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.08), 0 8px 32px rgba(217, 119, 6, 0.12);
  border-color: #D97706;
}

.ini-floating-label {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #94A3B8;
  pointer-events: none;
  transition: all 0.25s var(--ease-expo);
}

.ini-floating-label.active {
  top: 0;
  transform: translateY(-50%) scale(0.85);
  font-size: 13px;
  color: #D97706;
  background: #fff;
  padding: 0 8px;
}
```

#### 3.2 Age/University Chips → 悬浮卡片

**现状**：图标 + 标签 + 控件水平排列
**目标**：更大的触控区域，悬浮时提升

```css
.id-chip {
  flex: 1;
  padding: 24px;
  background: rgba(248, 250, 252, 0.6);
  border: 1px solid #E2E8F0;
  border-radius: 18px;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.id-chip:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
  border-color: rgba(15, 23, 42, 0.1);
}
```

#### 3.3 GPA Ring 增强

**保留现有 SVG Ring**，增加：
- 拖拽时的 **弹性反馈** (Spring physics)
- 数值更新时的 **脉冲光晕**

```css
.gpa-ring-wrap:hover .gpa-progress {
  filter: drop-shadow(0 0 12px rgba(217, 119, 6, 0.4));
}

.gpa-val-text {
  transition: all 0.3s var(--ease-back);
}

/* 数值变化时的闪烁效果 */
.gpa-updating .gpa-val-text {
  animation: gpaPulse 0.4s ease-out;
}

@keyframes gpaPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); color: #D97706; }
  100% { transform: scale(1); }
}
```

---

### Phase 4: Academics 表单改造 🎓

#### 4.1 Degree Pills → Segmented Control

**现状**：圆角按钮组
**目标**：iOS 风格分段控制器

```css
.deg-pills {
  display: flex;
  background: #F1F5F9;
  border-radius: 12px;
  padding: 4px;
  gap: 0;
}

.deg-pill {
  flex: 1;
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #64748B;
  font-weight: 500;
  transition: all 0.35s var(--ease-expo);
}

.deg-pill.active {
  background: #0F172A;
  color: #fff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
}
```

#### 4.2 Major Tags → Capsule Cloud

**现状**：标准按钮标签
**目标**：胶囊云，选中态 Amber 填充 + 弹跳

```css
.tc-tag {
  padding: 10px 20px;
  border-radius: 100px;
  border: 1.5px solid #E2E8F0;
  background: transparent;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tc-tag.on {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.1), rgba(217, 119, 6, 0.05));
  border-color: #D97706;
  color: #92400E;
  transform: scale(1.05);
}

.tc-tag:hover:not(.on) {
  border-color: #CBD5E1;
  transform: translateY(-2px);
}
```

#### 4.3 Score Input → 大号数字 + 滑块

**现状**：el-input-number
**目标**：更大尺寸 + 视觉强化

```css
.ac-score {
  display: flex;
  align-items: center;
  gap: 20px;
}

.ac-score :deep(.el-input-number) {
  width: 140px;
}

.ac-score :deep(.el-input__inner) {
  font-size: 28px;
  font-weight: 800;
  font-family: var(--font-family-mono);
  text-align: center;
}

.si-suffix {
  font-size: 18px;
  color: #94A3B8;
  font-weight: 500;
}
```

---

### Phase 5: Experience 表单改造 💼

#### 5.1 Track Tabs → Sticky Navigation

**现状**：普通按钮组
**目标**：全宽粘性导航，切换时滑动指示器

```css
.track-tabs {
  position: sticky;
  top: 72px; /* header height + margin */
  z-index: 30;
  background: rgba(248, 250, 252, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #E2E8F0;
  padding: 0 24px;
  margin: 0 -24px 32px;
}

.track-tab-indicator {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: #D97706;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

#### 5.2 Timeline Entries 入场动画

```css
.timeline-entry {
  opacity: 0;
  transform: translateX(-20px);
  animation: entrySlideIn 0.5s var(--ease-expo) forwards;
}

.timeline-entry:nth-child(1) { animation-delay: 0ms; }
.timeline-entry:nth-child(2) { animation-delay: 80ms; }
.timeline-entry:nth-child(3) { animation-delay: 160ms; }
.timeline-entry:nth-child(4) { animation-delay: 240ms; }

@keyframes entrySlideIn {
  to { opacity: 1; transform: translateX(0); }
}
```

---

### Phase 6: 微交互增强 ✨

#### 6.1 输入框 Focus Glow

所有 `el-input` 和 `el-select` 的 focus 状态统一增加 Amber 光晕：

```css
.ap :deep(.el-input__wrapper:focus-within),
.ap :deep(.el-select .el-input__wrapper:focus-within) {
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.08), 0 4px 20px rgba(217, 119, 6, 0.08) !important;
  border-color: #D97706 !important;
}
```

#### 6.2 CTA Magnetic Button

鼠标靠近时，按钮轻微跟随（使用 @mousemove 事件）：

```javascript
const ctaRef = ref(null)

const handleCtaMove = (e) => {
  if (!ctaRef.value) return
  const rect = ctaRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  
  ctaRef.value.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`
}

const handleCtaLeave = () => {
  if (!ctaRef.value) return
  ctaRef.value.style.transform = 'translate(0, 0)'
}
```

#### 6.3 表单字段 Stagger 入场

每个 Chapter 的表单字段依次入场：

```javascript
onMounted(() => {
  // 使用 IntersectionObserver 监听每个 chapter
  // 当进入视口时，为子元素添加 stagger delay
})
```

```css
.form-field {
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--field-delay, 0ms);
}

.chapter-visible .form-field {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 四、保护清单（不改动）

以下模块在 V2 中已经完美，V3 不做任何修改：

- ✅ **Reveal Moment 4 阶段报告系统**（Stage ①②③④）
- ✅ **AI Stream 逻辑**（aiStream, callAIAnalysis, retry/stop/pause/resume）
- ✅ **数据模型**（form reactive 对象结构）
- ✅ **localStorage 持久化**（loadFromStorage, watch, saveReport）
- ✅ **resetForm 完整逻辑**
- ✅ **配色系统**（仅使用 #0F172A / #D97706 / #FFFFFF）
- ✅ **字体系统**（JetBrains Mono for data）
- ✅ **动画曲线**（Expo Out, Back Out）
- ✅ **无障碍支持**（prefers-reduced-motion）

---

## 五、实施优先级

| 优先级 | Phase | 内容 | 预期影响 |
|--------|-------|------|---------|
| 🔴 P0 | Phase 1 | 全局布局重构（去卡片、Progress Bar、背景渐变） | **架构级改变，影响全局视觉效果** |
| 🟠 P1 | Phase 2 | Hero 升级（Wave 标题、CountUp、Scroll Hint） | **首屏冲击力大幅提升** |
| 🟡 P2 | Phase 3 | Identity 表单改造（浮动标签、Chips 增强） | **表单品质跃升** |
| 🟢 P3 | Phase 4 | Academics 表单改造（Segmented Control、Capsule Cloud） | **交互现代化** |
| 🔵 P4 | Phase 5 | Experience 表单改造（Sticky Tabs、Timeline 动画） | **细节打磨** |
| 🟣 P5 | Phase 6 | 微交互增强（Focus Glow、Magnetic Button、Stagger） | **Awwwards 级细节** |

---

## 六、预期效果对比

### V2 vs V3 视觉对比

| 维度 | V2 | V3 |
|------|-----|-----|
| **整体感觉** | 「功能页面套了 Awwwards 壳」 | **「关于自己的探索之旅」** |
| **Hero** | 静态大标题 | **Wave 动画 + CountUp + 滚轮提示** |
| **表单** | 白色卡片内排列 | **全宽透明背景 + 浮动标签 + 光晕反馈** |
| **导航** | 右侧垂直 Orbit | **底部水平 Progress Bar** |
| **节奏** | 平淡均匀 | **浅→深渐变 + CTA 锚点 + Report 释放** |
| **交互** | 标准 Element Plus | **Glow Focus + Magnetic Button + Stagger** |

### 用户情绪流设计

```
V2: 打开页面 → 看到大标题 → 向下滚动 → 看到表单卡片 → 填写 → 点按钮 → 看报告
     😐              😐            😐          😐           😐        🤩      🤩

V3: 打开页面 → WOW! 标题动画 → 数字跳动 → 滚动提示吸引 → 
     全宽表单优雅展开 → 输入框发光 → 选择器流畅 → 
     CTA 脉冲召唤 → 点击 → Reveal Moment 震撼登场
     🤯           😍          ✨           💫             🎯
     ✨            🤩           💫           🔥             🏆
```

---

## 七、技术风险与缓解

| 风险 | 等级 | 缓解措施 |
|------|------|---------|
| 去卡片后层次感丢失 | 低 | 使用 spacing + 微妙的背景色差异 + 分隔线 |
| Progress Bar 移动端遮挡内容 | 中 | 设置 z-index 层级，内容区域增加 bottom padding |
| Floating Label 兼容性 | 低 | 纯 CSS 实现，无 JS 依赖 |
| Stagger 动画性能 | 低 | 使用 transform + opacity（GPU 加速） |
| 背景渐变导致滚动卡顿 | 低 | 使用 will-change + GPU 合成层 |

---

## 八、验收标准

### 自动化检查
- [ ] `npm run typecheck` 通过（0 errors）
- [ ] `npm run lint` 通过（0 new errors/warnings）

### 手动验证
- [ ] Hero 全屏显示，标题有 Wave 动画
- [ ] Metric 数字有 CountUp 效果
- [ ] Scroll Hint 显示滚轮图标 + 弹跳
- [ ] Identity 表单无边框，全宽展示
- [ ] Name 输入框有浮动标签效果
- [ ] Age/University Chips hover 时提升
- [ ] GPA Ring 拖拽时有光晕反馈
- [ ] Degree Pills 是 Segmented Control 样式
- [ ] Major Tags 选中时 Amber 填充 + 弹跳
- [ ] 底部 Progress Bar 正确显示进度和当前章节
- [ ] Track Tabs 是粘性导航
- [ ] Timeline Entries 有入场动画
- [ ] 输入框 focus 时有 Amber 光晕
- [ ] CTA 按钮有磁场效果
- [ ] 背景从 Hero 到 CTA 有明显的深浅过渡
- [ ] 移动端 (< 767px) 布局正常，Progress Bar 不遮挡内容
- [ ] `prefers-reduced-motion` 下所有动画禁用

---

*文档版本: v3.0*
*创建时间: 2026-04-07*
*架构师: AI Assistant (Awwwards Designer + Super Architect)*
