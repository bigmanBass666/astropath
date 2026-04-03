# AIChat 页面视觉升级方案 — 设计文档

> **文档目的**：将 AIChat 从"功能可用但丑陋"升级为"科技感+高级感"的沉浸式对话体验。
> 新对话中的AI应以此文档为最高依据，配合 `docs/DESIGN_SPEC.md`（v2.4）共同执行。

---

## 零、执行指南

### 启动指令模板

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
请阅读 docs/plans/aichat-visual-upgrade-plan.md
和 docs/DESIGN_SPEC.md (v2.4)。

本次任务：对 AIChat.vue 进行全面视觉升级。
目标：让对话界面有 ChatGPT/Claude 级别的科技感和高级感。

执行步骤：
1. 阅读本文档 §一~§五 的完整改动方案
2. 按区域逐步改造（Sidebar → Header → Welcome → Messages → Input）
3. 启动 dev server 验证每个区域的改动
4. 最终全页面截图确认
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 一、问题诊断

### 1.1 当前状态总览

**文件**: `src/views/AIChat.vue`（~600行，template 220行 + script 230行 + style 150行）

**布局结构**（保持不变）：
```
┌──────────────┬─────────────────────────────┐
│   Sidebar    │      Chat Header            │
│  (280px)     ├─────────────────────────────┤
│              │                             │
│  - 返回按钮   │     Messages Area           │
│  - 搜索框    │     (Welcome / Chat)        │
│  - 对话列表   │                             │
│  - 智能体列表 │                             │
│              ├─────────────────────────────┤
│              │      Input Section           │
└──────────────┴─────────────────────────────┘
```

### 1.2 具体问题清单

| 区域 | 当前状态 | 问题 | 目标 |
|------|---------|------|------|
| **整体** | 纯白背景 `var(--color-background)` | 太素、无层次感 | 微妙的深色渐变或纹理 |
| **Sidebar** | 基础列表 + 扁平卡片 | 像管理后台的导航栏 | 更精致的侧边栏，有呼吸感 |
| **Header** | 单行图标+文字 | 过于简陋 | 更有存在感的标题区 |
| **Welcome** | 居中文字 + prompt按钮 | 像表单提交页 | 有仪式感的欢迎界面 |
| **消息气泡** | 灰底圆角矩形 (slate-50) | 太普通，像短信界面 | 更精致的消息气泡设计 |
| **用户气泡** | solid色填充 | 还可以但缺少细节 | 加微妙光泽/阴影 |
| **输入区** | textarea + 工具栏 | 功能够但不够精致 | 更现代的输入框设计 |
| **微交互** | 基础 hover 变色 | 缺少弹性/反馈感 | spring曲线 + 微位移 |

### 1.3 设计定位

> AIChat 是**沉浸式全屏页面**（`position:fixed; z-index:100`），不使用 atmosphere.css 的氛围系统。
>
> 但这不等于"可以丑"。参考产品：**ChatGPT / Claude / Perplexity** —— 它们没有花哨装饰，但每个像素都经过精心打磨。

**核心原则：克制中的高级感**
- ❌ 不加 Canvas 动画/粒子/光晕（不是 Hero 页）
- ✅ 在间距、圆角、阴影、字体、色彩比例上下功夫
- ✅ 微交互要精致（不是夸张）

---

## 二、逐区改造方案

### 2.1 整体容器 — 背景升级

**当前**: `.ai-chat-page { background: var(--color-background) }` — 纯白

**改为**: 极微妙的深色渐变，营造"空间感"

```css
.ai-chat-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 100;

  /* 核心：从极浅灰到白色的微妙渐变 */
  background:
    radial-gradient(ellipse at 0% 0%, rgba(15, 23, 42, 0.02) 0%, transparent 50%),
    linear-gradient(180deg, #FAFBFC 0%, var(--color-background) 100%);
}
```

**验收**: 背景看起来不是纯白，而是有极其微妙的深度。用户可能说不出来哪里变了，但感觉"更舒服"。

---

### 2.2 Sidebar 升级

#### A. Sidebar 容器

```css
.sidebar {
  width: 280px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  /* 改前: background: var(--color-surface); border-right: 1px solid ... */
  /* 改后: */
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-right: 1px solid rgba(15, 23, 42, 0.06);
}
```

**关键变化**: `backdrop-filter: blur(12px)` + 半透明白色 → **毛玻璃效果**，这是现代AI产品的标志性语言。

#### B. Sidebar Header

```css
.sidebar-header {
  padding: var(--space-4) var(--space-5);
  display: flex;
  align-items: center;
  justify-content: space-between;

  /* 改前: border-bottom: 1px solid var(--color-border-light); min-height: 60px */
  /* 改后: 无边框，用间距分隔 */
}

.back-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: white;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.back-btn:hover {
  background: var(--color-solid);
  color: white;
  border-color: var(--color-solid);
  transform: translateX(-2px);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.12);
}
```

#### C. 对话列表项 — 增加 hover 弹性

```css
.conversation-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-3);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-bottom: 2px;
  position: relative;
}

.conversation-item:hover {
  background: var(--color-slate-50);
  transform: translateX(3px);
}

.conversation-item.is-active {
  background: var(--color-slate-100);

  /* 左侧激活指示条 */
}

.conversation-item.is-active::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: var(--color-solid);
  border-radius: 2px;
}
```

#### D. 智能体选择器 — 卡片化增强

```css
.agent-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid transparent;
}

.agent-item:hover {
  background: var(--color-slate-50);
  border-color: var(--color-border-light);
}

.agent-item.is-active {
  background: white;
  border-color: var(--color-solid);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

/* agent-icon 保持现有逻辑不变 */
```

---

### 2.3 Chat Header 升级

```css
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-6);

  /* 改前: border-bottom + background: surface */
  /* 改后: 极简，无边框 */
  background: transparent;
  border-bottom: 1px solid rgba(15, 23, 42, 0.05);
}

.header-agent-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.header-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(currentAgent.color, 0.3);
}

.header-name {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
}

.model-selector {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: white;
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.model-selector:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}
```

**关键变化**:
- Header 底部边框更淡 (`rgba(..., 0.05)` vs `var(--color-border-light)`)
- 图标加大到 36px + 投影
- model-selector 用 `border-radius: var(--radius-full)` （胶囊形）
- hover 加了微妙的投影

---

### 2.4 Welcome Screen 升级 ⭐ 最重要

这是用户进入 AIChat 后**第一眼看到的东西**，决定了第一印象。

#### A. Welcome 整体布局

**改前**: 简单居中文字 + prompt 列表

**改后**: 有层次的欢迎界面

```html
<!-- template 改造 -->
<div class="welcome-screen">
  <div class="welcome-content">
    <!-- Agent 头像 + 名称（大） -->
    <div class="welcome-avatar">
      <div class="avatar-ring">
        <div class="avatar-inner" :style="{ background: currentAgent?.color }">
          <el-icon :size="28"><component :is="currentAgent?.icon" /></el-icon>
        </div>
      </div>
    </div>

    <h2 class="welcome-title">{{ currentAgent.name }}</h2>
    <p class="welcome-subtitle">{{ currentAgent.role }}</p>
    <p class="welcome-desc">{{ currentAgent.welcome }}</p>

    <div class="quick-prompts">
      <p class="prompts-label">快速开始</p>
      <div class="prompts-grid">
        <button v-for="(prompt, idx) in currentAgent.quickPrompts" :key="idx"
                class="prompt-card"
                @click="useQuickPrompt(prompt)">
          <span class="prompt-text">{{ prompt }}</span>
          <el-icon :size="14"><ArrowRight /></el-icon>
        </button>
      </div>
    </div>
  </div>
</div>
```

#### B. Welcome CSS

```css
.welcome-screen {
  min-height: calc(100% - 48px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-10);
}

.welcome-content {
  text-align: center;
  max-width: 640px;
  width: 100%;
  animation: welcomeFadeIn 0.6s ease both;
}

@keyframes welcomeFadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== Avatar 区域 ===== */
.welcome-avatar {
  margin-bottom: var(--space-6);
  display: flex;
  justify-content: center;
}

.avatar-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, var(--color-solid), var(--color-accent));
  animation: avatarPulse 3s ease-in-out infinite;
}

@keyframes avatarPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(217, 119, 6, 0.15); }
  50% { box-shadow: 0 0 0 12px rgba(217, 119, 6, 0); }
}

.avatar-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: var(--color-solid);
}

/* ===== 文字区域 ===== */
.welcome-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
  letter-spacing: -0.5px;
}

.welcome-subtitle {
  font-size: var(--text-base);
  color: var(--color-accent);
  font-weight: 500;
  margin: 0 0 var(--space-5) 0;
}

.welcome-desc {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-10) 0;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

/* ===== Prompt 卡片网格 ===== */
.quick-prompts {
  text-align: left;
}

.prompts-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-tertiary);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin: 0 0 var(--space-4) 0;
  text-align: center;
}

.prompts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.prompt-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-align: left;
}

.prompt-card:hover {
  border-color: var(--color-solid);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
  transform: translateY(-2px);
}

.prompt-card .prompt-text {
  flex: 1;
}

.prompt-card .el-icon {
  color: var(--color-text-tertiary);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.prompt-card:hover .el-icon {
  color: var(--color-solid);
  transform: translateX(3px);
}

@media (max-width: 480px) {
  .prompts-grid {
    grid-template-columns: 1fr;
  }
}
```

**验收标准**:
- [ ] 大头像带渐变光环环 + pulse 动画
- [ ] 标题下方副标题用 accent 色（唯一一处 accent 使用）
- [ ] Prompt 按钮改为 2列网格卡片
- [ ] 卡片 hover 上浮 + 阴影 + 箭头右移
- [ ] 整体有 fadeUp 入场动画

---

### 2.5 消息气泡升级 ⭐ 核心体验

消息气泡是对话页面的**核心交互元素**，使用频率最高，必须最精致。

#### A. AI 消息气泡

```css
.message-wrapper {
  margin-bottom: var(--space-5);
  display: flex;
  justify-content: flex-start;
  animation: msgFadeIn 0.35s ease both;
}

@keyframes msgFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-wrapper.is-user {
  justify-content: flex-end;
}

.message {
  display: flex;
  gap: var(--space-3);
  max-width: 72%;
}

.message-wrapper.is-user .message {
  flex-direction: row-reverse;
}

/* ===== Avatar ===== */
.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* ===== AI 消息内容 ===== */
.message-content {
  background: white;
  border-radius: var(--radius-2xl);
  padding: var(--space-4) var(--space-5);
  border: 1px solid var(--color-border-light);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);

  /* 关键：左上角尖角效果（可选） */
  position: relative;
}

.message-content::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 14px;
  width: 14px;
  height: 14px;
  background: inherit;
  border-left: inherit;
  border-bottom: inherit;
  border-radius: 0 0 0 6px;
  transform: rotate(45deg);
  clip-path: polygon(0% 0%, 100% 0%, 0% 100%);
}

/* ===== 用户消息内容 ===== */
.message-wrapper.is-user .message-content {
  background: var(--color-solid);
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.15);

  /* 用户消息右上角尖角 */
}

.message-wrapper.is-user .message-content::before {
  left: auto;
  right: -7px;
  border-left: none;
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-radius: 0 0 6px 0;
  clip-path: polygon(100% 0%, 0% 100%, 100% 100%);
  background: var(--color-solid);
}
```

#### B. 消息文字样式优化

```css
.message-text {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--color-text-primary);
}

.message-wrapper.is-user .message-text {
  color: white;
}

.message-text :deep(p) {
  margin: 0 0 var(--space-3) 0;
}

.message-text :deep(p:last-child) {
  margin-bottom: 0;
}

.message-text :deep(ul),
.message-text :deep(ol) {
  margin: var(--space-3) 0;
  padding-left: var(--space-6);
}

.message-text :deep(li) {
  margin-bottom: var(--space-1);
}

.message-text :deep(code) {
  background: var(--color-slate-100);
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
  font-family: var(--font-family-mono);
  font-size: var(--text-xs);
  border: 1px solid var(--color-border-light);
}

.message-wrapper.is-user .message-text :deep(code) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.15);
}
```

#### C. 思考过程块（Reasoning Block）美化

```css
.reasoning-block {
  margin-bottom: var(--space-3);
  background: linear-gradient(135deg, var(--color-accent-subtle), #FFF8F0);
  border: 1px solid var(--color-accent);
  border-left: 3px solid var(--color-accent);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.reasoning-block.is-thinking {
  background: linear-gradient(135deg, var(--color-info-bg), #F0F7FF);
  border-color: var(--color-info);
  border-left-color: var(--color-info);
}

.reasoning-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-accent);
  user-select: none;
  transition: background 0.2s ease;
}

.reasoning-block.is-thinking .reasoning-header {
  color: var(--color-info);
}

.reasoning-header:hover {
  background: rgba(0, 0, 0, 0.03);
}

.thinking-badge {
  padding: 2px var(--space-2);
  background: var(--color-info);
  color: white;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3px;
  animation: thinkingPulse 1.5s ease-in-out infinite;
}

@keyframes thinkingPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.reasoning-toggle {
  margin-left: auto;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.reasoning-toggle.is-expanded {
  transform: rotate(180deg);
}

.reasoning-body {
  padding: var(--space-4) var(--space-4) 0;
  font-size: var(--text-xs);
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 0;
  padding-top: var(--space-3);
}
```

#### D. 操作按钮条

```css
.message-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  opacity: 0;
  transform: translateY(-4px);
  transition: all 0.25s ease;
}

.message-content:hover .message-actions {
  opacity: 1;
  transform: translateY(0);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-text-tertiary);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--color-slate-100);
  color: var(--color-text-secondary);
}

.action-btn.is-active {
  color: var(--color-solid);
  background: rgba(15, 23, 42, 0.06);
}

.regenerate-btn {
  margin-left: var(--space-2);
  padding-left: var(--space-3);
  border-left: 1px solid var(--color-border-light);
  font-weight: 500;
}
```

**验收标准**:
- [ ] AI 消息白底 + 细边框 + 微妙投影
- [ ] 用户消息 solid 深色 + 较强投影
- [ ] 消息气泡有入场动画 (fadeUp)
- [ ] 思考块有左侧彩色竖条 + 渐变背景
- [ ] "进行中" badge 有脉冲动画
- [ ] 操作按钮 hover 时平滑出现

---

### 2.6 输入区域升级

```css
.input-section {
  padding: var(--space-4) var(--space-6) var(--space-5);
  background: transparent;
}

.input-container {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.input-container:focus-within {
  border-color: var(--color-solid);
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.06), 0 4px 16px rgba(15, 23, 42, 0.08);
}

.chat-textarea {
  width: 100%;
  min-height: 24px;
  max-height: 200px;
  border: none;
  outline: none;
  resize: none;
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--color-text-primary);
  background: transparent;
  font-family: var(--font-family-base);
  padding: var(--space-4) var(--space-5);
}

.chat-textarea::placeholder {
  color: var(--color-text-muted);
}

.input-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-4);
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  background: var(--color-slate-50);
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toolbar-btn:hover:not(:disabled) {
  background: var(--color-slate-100);
  color: var(--color-text-primary);
}

.toolbar-btn.is-active {
  background: rgba(15, 23, 42, 0.06);
  color: var(--color-solid);
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: var(--radius-lg);
  background: var(--color-slate-200);
  color: var(--color-text-muted);
  cursor: not-allowed;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.send-btn.is-active {
  background: var(--color-solid);
  color: white;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.2);
}

.send-btn.is-active:hover {
  background: var(--color-solid-hover);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);
}

.send-btn.is-stop {
  background: var(--color-danger);
  color: white;
  cursor: pointer;
}

.send-btn.is-stop:hover {
  background: var(--color-danger-light);
}
```

**关键变化**:
- `border-radius: var(--radius-2xl)` (更大的圆角)
- `box-shadow` 默认态也有微妙投影
- focus-within 双层光晕（内圈 + 外圈）
- send 按钮 hover 时 `scale(1.05)` + 加强投影
- toolbar 按钮改用 `border-radius: var(--radius-full)` (胶囊形)

---

## 三、响应式适配

```css
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .chat-messages {
    padding: var(--space-4);
  }

  .input-section {
    padding: var(--space-3) var(--space-4);
  }

  .message {
    max-width: 90%;
  }

  .welcome-title {
    font-size: var(--text-2xl);
  }

  .avatar-ring {
    width: 64px;
    height: 64px;
  }

  .prompts-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 四、实施检查清单

| # | 区域 | 关键改动 | 验收 |
|---|------|---------|------|
| 1 | 整体背景 | 径向渐变 + 线性渐变叠加 | 不是纯白 |
| 2 | Sidebar | 毛玻璃 + 激活指示条 + spring hover | 有现代感 |
| 3 | Chat Header | 图标加大 + 投影 + 胶囊选择器 | 不简陋 |
| 4 | Welcome Screen | 大头像光环 + 2列prompt网格 + 入场动画 | 有仪式感 |
| 5 | AI 消息气泡 | 白底 + 尖角 + 投影 + 入场动画 | 精致 |
| 6 | 用户消息气泡 | solid色 + 强投影 | 高级 |
| 7 | Reasoning Block | 左侧彩条 + 渐变背景 + badge脉冲 | 科技感 |
| 8 | 输入区 | 超大圆角 + 双层focus光晕 | 现代 |
| 9 | 发送按钮 | scale hover + 投影 | 有反馈感 |
| 10 | 移动端 | sidebar隐藏 + 单列prompt | 正常 |

---

## 五、硬性约束

1. **不动 template 结构逻辑** — 只改 CSS 和少量装饰性 HTML（如 Welcome 区的大头像）
2. **不动 script 逻辑** — 所有 JS 功能完全保留
3. **颜色必须用 CSS 变量** — 禁止硬编码
4. **Accent 色仅用于 Welcome 副标题 + reasoning block** — ≤ 2处
5. **保持沉浸式全屏** — `position: fixed; z-index: 100` 不变
6. **不引入新依赖** — 纯 CSS 实现，不需要新 npm 包
7. **移动端同等重要**

---

## 六、参考文件索引

| 文件 | 作用 |
|------|------|
| [DESIGN_SPEC.md](docs/DESIGN_SPEC.md) | 最高设计规范 v2.4 |
| [visual-unification-plan.md](docs/plans/visual-unification-plan.md) | 其他8个页面的改造方案（对比参考） |
| [Home.vue](src/views/Home.vue) | 视觉DNA参考（排版/间距/微交互风格） |

---

**文档版本**：v1.0
**创建日期**：2026-04-04
**适用范围**：AIChat.vue 视觉升级（独立于其他8个页面的改造计划）
