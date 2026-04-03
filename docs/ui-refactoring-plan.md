# 智途 AstroPath UI 重构实施文档

> 本文档基于 ui-ux-pro-max 插件的设计系统规范编写
> 创建日期: 2026-04-03
> 适用项目: d:\Test\scauzj\liuxue\v1

---

## 📋 目录

1. [项目概述](#1-项目概述)
2. [设计系统规范](#2-设计系统规范)
3. [重构任务清单](#3-重构任务清单)
4. [第一阶段：基础搭建](#4-第一阶段基础搭建)
5. [第二阶段：组件重构](#5-第二阶段组件重构)
6. [第三阶段：页面优化](#6-第三阶段页面优化)
7. [第四阶段：细节打磨](#7-第四阶段细节打磨)
8. [验收标准](#8-验收标准)

---

## 1. 项目概述

### 1.1 技术栈信息
- **框架**: Vue 3 + Vite
- **UI 组件库**: Element Plus 2.4.4
- **图表库**: ECharts 5.4.3
- **当前图标**: @element-plus/icons-vue
- **样式方案**: Scoped CSS

### 1.2 当前存在的问题
1. **使用 Emoji 作为图标** (SchoolCard.vue) - 不专业且跨平台显示不一致
2. **颜色硬编码** - 难以维护，无法统一换肤
3. **缺乏设计系统** - 组件风格不一致
4. **视觉层次不清晰** - 信息密度高但层次感不足
5. **间距系统混乱** - 使用 4px/8px/12px/16px/20px/24px 等多种间距

### 1.3 重构目标
- 建立统一的设计系统
- 使用专业的 SVG 图标替代 Emoji
- 优化视觉层次和交互体验
- 完善响应式设计

---

## 2. 设计系统规范

### 2.1 配色方案

基于 ui-ux-pro-max 插件的 "Educational App" 配色规范：

```css
/* src/styles/variables.css */
:root {
  /* 主色调 - 靛蓝 (专业、可信赖) */
  --color-primary: #4F46E5;
  --color-primary-light: #818CF8;
  --color-primary-dark: #1E1B4B;
  --color-primary-50: #EEF2FF;
  --color-primary-100: #E0E7FF;
  --color-primary-200: #C7D2FE;
  --color-primary-300: #A5B4FC;
  --color-primary-400: #818CF8;
  --color-primary-500: #6366F1;
  --color-primary-600: #4F46E5;
  --color-primary-700: #4338CA;
  --color-primary-800: #3730A3;
  --color-primary-900: #312E81;

  /* 辅助色 - 活力橙 (CTA) */
  --color-accent: #EA580C;
  --color-accent-light: #FB923C;
  --color-accent-dark: #9A3412;

  /* 功能色 */
  --color-success: #059669;
  --color-success-light: #34D399;
  --color-success-bg: #ECFDF5;
  
  --color-warning: #D97706;
  --color-warning-light: #FBBF24;
  --color-warning-bg: #FFFBEB;
  
  --color-danger: #DC2626;
  --color-danger-light: #F87171;
  --color-danger-bg: #FEF2F2;
  
  --color-info: #0891B2;
  --color-info-light: #22D3EE;
  --color-info-bg: #ECFEFF;

  /* 中性色 */
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-surface-elevated: #FFFFFF;
  
  --color-text-primary: #0F172A;
  --color-text-secondary: #64748B;
  --color-text-tertiary: #94A3B8;
  --color-text-inverse: #FFFFFF;
  
  --color-border: #E2E8F0;
  --color-border-light: #F1F5F9;
  --color-divider: #E2E8F0;

  /* 渐变 */
  --gradient-primary: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  --gradient-accent: linear-gradient(135deg, #EA580C 0%, #F97316 100%);
  --gradient-success: linear-gradient(135deg, #059669 0%, #10B981 100%);
  --gradient-gold: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%);
  --gradient-silver: linear-gradient(135deg, #94A3B8 0%, #CBD5E1 100%);
  --gradient-bronze: linear-gradient(135deg, #B45309 0%, #D97706 100%);
}
```

### 2.2 间距系统

```css
:root {
  /* 8px 基准间距系统 */
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}
```

### 2.3 字体规范

```css
:root {
  /* 字体族 */
  --font-family-base: 'Inter', 'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-display: 'Poppins', 'PingFang SC', sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* 字体大小 */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 30px;
  --text-4xl: 36px;
  --text-5xl: 48px;

  /* 字重 */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* 行高 */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### 2.4 阴影系统

```css
:root {
  --shadow-none: none;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  --shadow-glow-primary: 0 0 20px rgba(79, 70, 229, 0.3);
  --shadow-glow-success: 0 0 20px rgba(5, 150, 105, 0.3);
}
```

### 2.5 圆角系统

```css
:root {
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;
}
```

### 2.6 过渡动画

```css
:root {
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
  --transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 3. 重构任务清单

### 3.1 文件结构变更

```
src/
├── styles/
│   ├── variables.css       # CSS 变量定义
│   ├── animations.css      # 动画关键帧
│   ├── utilities.css       # 工具类
│   ├── mixins.scss         # SCSS Mixins (可选)
│   └── index.css           # 样式入口
├── components/
│   └── ui/                 # 基础 UI 组件
│       ├── BaseButton.vue
│       ├── BaseCard.vue
│       ├── BaseIcon.vue
│       └── BaseBadge.vue
└── utils/
    └── icons.js            # 图标映射
```

### 3.2 依赖安装

```bash
# 安装 Phosphor 图标库 (替代 Emoji)
npm install @phosphor-icons/vue

# 安装 clsx (条件类名工具)
npm install clsx
```

---

## 4. 第一阶段：基础搭建

### 4.1 创建样式文件

**文件**: `src/styles/variables.css`

内容见上文 2.1-2.6 节

### 4.2 创建动画文件

**文件**: `src/styles/animations.css`

```css
/* 淡入 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 淡入上移 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 缩放进入 */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 脉冲 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 旋转 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 弹跳 */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 闪烁光标 */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 思考动画 */
@keyframes thinking-bounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.2); opacity: 1; }
}

/* 骨架屏 shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### 4.3 创建工具类文件

**文件**: `src/styles/utilities.css`

```css
/* 布局 */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }

/* 文字 */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.font-medium { font-weight: var(--font-medium); }
.font-semibold { font-weight: var(--font-semibold); }
.font-bold { font-weight: var(--font-bold); }

/* 颜色 */
.text-primary { color: var(--color-text-primary); }
.text-secondary { color: var(--color-text-secondary); }
.text-tertiary { color: var(--color-text-tertiary); }

/* 间距 */
.p-4 { padding: var(--space-4); }
.p-6 { padding: var(--space-6); }
.m-4 { margin: var(--space-4); }
.mt-4 { margin-top: var(--space-4); }
.mb-4 { margin-bottom: var(--space-4); }

/* 其他 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 4.4 更新主入口文件

**文件**: `src/main.js`

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 全局样式
import './styles/variables.css'
import './styles/animations.css'
import './styles/utilities.css'

const app = createApp(App)

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.mount('#app')
```

---

## 5. 第二阶段：组件重构

### 5.1 重构 SchoolCard.vue

**当前问题**:
- 使用 Emoji (🥇🥈🥉) 作为排名图标
- 颜色硬编码

**重构要求**:

1. **安装 Phosphor 图标**
   ```bash
   npm install @phosphor-icons/vue
   ```

2. **替换 Emoji 为 SVG 图标**
   ```vue
   <script setup>
   import { Trophy, Medal, Award, Circle } from '@phosphor-icons/vue'
   
   const rankingIcon = computed(() => {
     const rank = props.recommendation.ranking
     if (rank === 1) return Trophy
     if (rank === 2) return Medal
     if (rank === 3) return Award
     return Circle
   })
   
   const rankingWeight = computed(() => {
     const rank = props.recommendation.ranking
     if (rank <= 3) return 'fill'
     return 'regular'
   })
   </script>
   ```

3. **使用 CSS 变量替换硬编码颜色**
   - 所有颜色值改为使用 CSS 变量
   - 渐变使用变量定义

4. **优化后的完整代码结构**
   ```vue
   <template>
     <div class="school-card" :class="{ 'is-favorite': isFavorite }">
       <!-- 头部 -->
       <div class="card-header">
         <div class="ranking-badge" :class="rankingClass">
           <component 
             :is="rankingIcon" 
             :weight="rankingWeight"
             :size="20"
           />
           <span class="ranking-text">#{{ recommendation.ranking }}</span>
         </div>
         <!-- ... -->
       </div>
       <!-- ... -->
     </div>
   </template>
   ```

### 5.2 重构 SchoolAnalysisDialog.vue

**当前问题**:
- 信息密度高但层次不清晰
- 加载状态简单

**重构要求**:

1. **优化视觉层次**
   ```css
   .analysis-section {
     margin-bottom: var(--space-6);
     padding: var(--space-5);
     border-radius: var(--radius-xl);
     background: var(--color-surface);
     border: 1px solid var(--color-border);
   }
   
   .analysis-section.match {
     background: var(--color-success-bg);
     border-color: var(--color-success);
   }
   
   .analysis-section.risk {
     background: var(--color-warning-bg);
     border-color: var(--color-warning);
   }
   
   .analysis-section.suggestion {
     background: var(--color-info-bg);
     border-color: var(--color-info);
   }
   ```

2. **添加骨架屏加载状态**
   ```vue
   <template>
     <!-- 骨架屏 -->
     <div v-if="loading" class="skeleton-loading">
       <div class="skeleton-header"></div>
       <div class="skeleton-content">
         <div class="skeleton-line"></div>
         <div class="skeleton-line"></div>
         <div class="skeleton-line short"></div>
       </div>
     </div>
   </template>
   
   <style scoped>
   .skeleton-loading {
     padding: var(--space-6);
   }
   
   .skeleton-header {
     height: 60px;
     background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
     background-size: 200% 100%;
     animation: shimmer 1.5s infinite;
     border-radius: var(--radius-lg);
     margin-bottom: var(--space-4);
   }
   
   .skeleton-line {
     height: 16px;
     background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
     background-size: 200% 100%;
     animation: shimmer 1.5s infinite;
     border-radius: var(--radius-md);
     margin-bottom: var(--space-3);
   }
   
   .skeleton-line.short {
     width: 60%;
   }
   </style>
   ```

3. **优化追问输入区域**
   - 使用更明显的视觉区分
   - 添加发送按钮的悬停效果

### 5.3 创建基础 UI 组件

**文件**: `src/components/ui/BaseCard.vue`

```vue
<template>
  <div 
    class="base-card" 
    :class="[
      `elevation-${elevation}`,
      { 'is-hoverable': hoverable, 'is-clickable': clickable }
    ]"
    @click="$emit('click')"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  elevation: {
    type: Number,
    default: 1,
    validator: (v) => [0, 1, 2, 3].includes(v)
  },
  hoverable: Boolean,
  clickable: Boolean
})

defineEmits(['click'])
</script>

<style scoped>
.base-card {
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  transition: all var(--transition-normal);
}

.elevation-0 {
  border: 1px solid var(--color-border);
}

.elevation-1 {
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
}

.elevation-2 {
  box-shadow: var(--shadow-md);
}

.elevation-3 {
  box-shadow: var(--shadow-lg);
}

.is-hoverable:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.is-clickable {
  cursor: pointer;
}

.is-clickable:active {
  transform: scale(0.98);
}
</style>
```

**文件**: `src/components/ui/BaseBadge.vue`

```vue
<template>
  <span 
    class="base-badge" 
    :class="[`variant-${variant}`, `size-${size}`]"
  >
    <component v-if="icon" :is="icon" :size="iconSize" />
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  icon: Object
})

const iconSize = computed(() => {
  const sizes = { sm: 12, md: 14, lg: 16 }
  return sizes[props.size]
})
</script>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-weight: var(--font-medium);
  border-radius: var(--radius-full);
}

/* 尺寸 */
.size-sm {
  padding: 2px 8px;
  font-size: var(--text-xs);
}

.size-md {
  padding: 4px 12px;
  font-size: var(--text-sm);
}

.size-lg {
  padding: 6px 16px;
  font-size: var(--text-base);
}

/* 变体 */
.variant-default {
  background: var(--color-background);
  color: var(--color-text-secondary);
}

.variant-primary {
  background: var(--color-primary-100);
  color: var(--color-primary);
}

.variant-success {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.variant-warning {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.variant-danger {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.variant-info {
  background: var(--color-info-bg);
  color: var(--color-info);
}
</style>
```

---

## 6. 第三阶段：页面优化

### 6.1 优化 Home.vue Hero 区域

**重构要求**:

1. **减少粒子动画数量** (性能优化)
   ```css
   /* 从 6 个减少到 4 个 */
   .particle {
     /* 优化动画性能 */
     will-change: transform;
     transform: translateZ(0);
   }
   ```

2. **优化 CTA 按钮样式**
   ```css
   .cta-button {
     background: var(--color-surface);
     color: var(--color-primary);
     font-weight: var(--font-semibold);
     padding: var(--space-4) var(--space-8);
     border-radius: var(--radius-full);
     box-shadow: var(--shadow-lg);
     transition: all var(--transition-spring);
   }
   
   .cta-button:hover {
     transform: translateY(-2px) scale(1.02);
     box-shadow: var(--shadow-xl), var(--shadow-glow-primary);
   }
   ```

3. **统一 Feature 卡片样式**
   - 使用 BaseCard 组件
   - 统一悬停效果

### 6.2 优化 Assessment.vue

**重构要求**:

1. **优化步骤指示器**
   ```css
   .steps-indicator {
     --el-step-icon-size: 40px;
   }
   
   :deep(.el-step__head) {
     transition: all var(--transition-normal);
   }
   
   :deep(.el-step__title) {
     font-weight: var(--font-medium);
   }
   ```

2. **优化表单输入框**
   ```css
   :deep(.el-input__wrapper) {
     border-radius: var(--radius-lg);
     box-shadow: var(--shadow-sm);
     transition: all var(--transition-fast);
   }
   
   :deep(.el-input__wrapper:hover) {
     box-shadow: var(--shadow-md);
   }
   
   :deep(.el-input__wrapper.is-focus) {
     box-shadow: 0 0 0 3px var(--color-primary-200);
   }
   ```

3. **优化雷达图样式**
   - 使用新的配色方案
   - 增加交互提示

### 6.3 优化 AIChat.vue

**重构要求**:

1. **优化消息气泡样式**
   ```css
   .message-content {
     border-radius: var(--radius-xl);
     padding: var(--space-4) var(--space-5);
     max-width: 80%;
   }
   
   .message-wrapper.is-user .message-content {
     background: var(--gradient-primary);
     color: var(--color-text-inverse);
   }
   
   .message-wrapper:not(.is-user) .message-content {
     background: var(--color-surface);
     border: 1px solid var(--color-border);
     box-shadow: var(--shadow-sm);
   }
   ```

2. **优化输入框区域**
   ```css
   .input-box {
     background: var(--color-surface);
     border-radius: var(--radius-2xl);
     border: 1px solid var(--color-border);
     box-shadow: var(--shadow-md);
     transition: all var(--transition-normal);
   }
   
   .input-box:focus-within {
     border-color: var(--color-primary);
     box-shadow: var(--shadow-lg), 0 0 0 3px var(--color-primary-100);
   }
   ```

---

## 7. 第四阶段：细节打磨

### 7.1 空状态设计

**文件**: `src/components/ui/EmptyState.vue`

```vue
<template>
  <div class="empty-state">
    <div class="empty-icon">
      <component :is="icon" :size="48" />
    </div>
    <h4 class="empty-title">{{ title }}</h4>
    <p class="empty-description">{{ description }}</p>
    <slot name="action" />
  </div>
</template>

<script setup>
defineProps({
  icon: Object,
  title: String,
  description: String
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12) var(--space-6);
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-2xl);
  background: var(--color-primary-50);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-5);
}

.empty-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2);
}

.empty-description {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 400px;
}
</style>
```

### 7.2 加载状态统一

**文件**: `src/components/ui/LoadingState.vue`

```vue
<template>
  <div class="loading-state" :class="`size-${size}`">
    <div class="loading-spinner">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    </div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  text: String
})
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
}

.loading-spinner {
  position: relative;
}

.spinner-ring {
  position: absolute;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: var(--color-primary);
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(1) {
  animation-duration: 1s;
}

.spinner-ring:nth-child(2) {
  animation-duration: 1.2s;
  animation-direction: reverse;
}

.spinner-ring:nth-child(3) {
  animation-duration: 0.8s;
}

/* 尺寸 */
.size-sm .spinner-ring {
  width: 24px;
  height: 24px;
}

.size-md .spinner-ring {
  width: 40px;
  height: 40px;
}

.size-lg .spinner-ring {
  width: 64px;
  height: 64px;
}

.loading-text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}
</style>
```

### 7.3 响应式断点优化

```css
/* 移动端优先 */
.container {
  width: 100%;
  padding: 0 var(--space-4);
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-6);
  }
}

/* 小桌面 */
@media (min-width: 1024px) {
  .container {
    padding: 0 var(--space-8);
  }
}

/* 大桌面 */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-6);
  }
}
```

---

## 8. 验收标准

### 8.1 代码质量
- [ ] 所有颜色使用 CSS 变量，无硬编码
- [ ] 所有 Emoji 替换为 SVG 图标
- [ ] 组件使用统一的间距系统
- [ ] 动画使用 CSS 变量定义的过渡时间

### 8.2 视觉效果
- [ ] 整体风格统一，符合设计系统
- [ ] 视觉层次清晰，信息易于阅读
- [ ] 交互反馈明确（悬停、点击、聚焦）
- [ ] 加载状态美观且统一

### 8.3 响应式
- [ ] 移动端布局正常
- [ ] 平板端布局正常
- [ ] 桌面端布局正常
- [ ] 各断点切换流畅

### 8.4 性能
- [ ] 动画使用 transform/opacity (GPU 加速)
- [ ] 无频繁的 DOM 操作
- [ ] 图片/图标按需加载

---

## 附录

### A. 图标映射表

| 原 Emoji | 替换为 Phosphor 图标 |
|---------|---------------------|
| 🥇 | Trophy (weight: fill) |
| 🥈 | Medal (weight: fill) |
| 🥉 | Award (weight: fill) |
| • | Circle (weight: fill) |

### B. 颜色映射表

| 原颜色值 | 替换为 CSS 变量 |
|---------|----------------|
| #667eea | var(--color-primary) |
| #764ba2 | var(--color-primary-600) |
| #67c23a | var(--color-success) |
| #e6a23c | var(--color-warning) |
| #f56c6c | var(--color-danger) |
| #409eff | var(--color-info) |
| #1a1a2e | var(--color-text-primary) |
| #606266 | var(--color-text-secondary) |
| #909399 | var(--color-text-tertiary) |

### C. 文件变更清单

| 文件路径 | 操作 | 说明 |
|---------|------|------|
| src/styles/variables.css | 新建 | CSS 变量定义 |
| src/styles/animations.css | 新建 | 动画关键帧 |
| src/styles/utilities.css | 新建 | 工具类 |
| src/components/ui/BaseCard.vue | 新建 | 基础卡片组件 |
| src/components/ui/BaseBadge.vue | 新建 | 基础徽章组件 |
| src/components/ui/EmptyState.vue | 新建 | 空状态组件 |
| src/components/ui/LoadingState.vue | 新建 | 加载状态组件 |
| src/components/school-recommendation/SchoolCard.vue | 修改 | 替换 Emoji |
| src/components/school-recommendation/SchoolAnalysisDialog.vue | 修改 | 优化样式 |
| src/main.js | 修改 | 引入新样式 |
| package.json | 修改 | 添加 Phosphor 依赖 |

---

**文档结束**

如有疑问，请参考 ui-ux-pro-max 插件文档或 Element Plus 官方文档。
