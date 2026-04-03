# 智途 AstroPath 设计规范文档

> 本文档定义了智途 AstroPath 留学规划平台的完整设计系统，用于指导所有页面的视觉风格统一。

---

## 一、设计理念

### 1.1 风格定位：学术优雅 (Academic Elegance)

**核心关键词**：专业、可信赖、科技感、人文关怀

设计灵感来源于：
- **学术期刊**：沉稳的深蓝色调，传达专业与权威
- **古典印刷**：衬线字体标题，体现学术气质
- **现代科技**：星座网络动画、几何线条，展现AI智能属性
- **暖金点缀**：成就感的金色元素，象征留学成功

### 1.2 设计原则

1. **克制优雅**：避免过度装饰，用留白和层次传达品质
2. **渐进增强**：基础功能简洁可用，高级交互锦上添花
3. **一致性**：所有页面共享相同的设计语言
4. **响应式优先**：移动端体验与桌面端同等重要

---

## 二、色彩系统

### 2.1 主色调 - 学术深蓝

```css
--color-primary: #1E3A5F;        /* 主色 - 用于标题、重要按钮、导航 */
--color-primary-light: #2D5A8E;  /* 浅主色 - 用于悬停状态 */
--color-primary-dark: #0F1F33;   /* 深主色 - 用于页脚、深色背景 */
```

**色阶（用于渐变和层次）**：
```css
--color-primary-50: #F0F4F8;     /* 最浅 - 背景填充 */
--color-primary-100: #D9E2EC;    /* 浅 - 卡片背景 */
--color-primary-200: #BCCCDC;    /* 中浅 - 边框、分隔线 */
--color-primary-300: #9FB3C8;    /* 中 - 次要文字 */
--color-primary-400: #829AB1;    /* 中深 - 图标 */
--color-primary-500: #627D98;    /* 标准 - 辅助元素 */
```

### 2.2 辅助色 - 暖金

```css
--color-accent: #B8860B;         /* 金色 - 用于强调、成就标识 */
--color-accent-light: #D4AF37;   /* 浅金 - 用于渐变终点 */
--color-accent-dark: #8B6914;    /* 深金 - 用于悬停状态 */
```

**使用场景**：
- CTA按钮渐变
- 重要数据高亮
- 成就/徽章颜色
- 页脚链接悬停

### 2.3 中性色

```css
--color-background: #FAFAFA;           /* 页面背景 */
--color-background-warm: #F5F3F0;      /* 暖色背景（交替区域） */
--color-surface: #FFFFFF;              /* 卡片/组件背景 */
--color-text-primary: #1A1A1A;         /* 主要文字 */
--color-text-secondary: #525252;       /* 次要文字 */
--color-text-tertiary: #737373;        /* 辅助说明文字 */
--color-border: #E5E5E5;               /* 边框 */
```

### 2.4 功能色

```css
--color-success: #2E7D32;              /* 成功 - 绿色 */
--color-warning: #F57C00;              /* 警告 - 橙色 */
--color-danger: #C62828;               /* 危险 - 红色 */
--color-info: #1565C0;                 /* 信息 - 蓝色 */
```

### 2.5 渐变定义

```css
/* 主渐变 - 用于主要按钮、标题装饰线 */
--gradient-primary: linear-gradient(135deg, #1E3A5F 0%, #2D5A8E 100%);

/* 金色渐变 - 用于CTA按钮、强调元素 */
--gradient-accent: linear-gradient(135deg, #B8860B 0%, #D4AF37 100%);

/* Hero背景渐变 */
--gradient-hero: linear-gradient(180deg, #F5F3F0 0%, #FFFFFF 100%);
```

---

## 三、字体系统

### 3.1 字体家族

```css
/* 正文字体 - 无衬线 */
--font-family-base: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;

/* 标题字体 - 衬线（学术气质） */
--font-family-display: 'Playfair Display', 'Noto Serif SC', Georgia, serif;

/* 代码字体 */
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### 3.2 字号规范

| 用途 | 变量 | 值 | 使用场景 |
|------|------|-----|---------|
| 超小号 | --text-xs | 12px | 辅助说明、标签 |
| 小号 | --text-sm | 14px | 次要内容、卡片描述 |
| 正文 | --text-base | 16px | 正文内容 |
| 大号正文 | --text-lg | 18px | 重要段落 |
| 小标题 | --text-xl | 20px | 卡片标题 |
| 中标题 | --text-2xl | 24px | 区块副标题 |
| 大标题 | --text-3xl | 30px | 页面主标题 |
| 超大标题 | --text-4xl | 36px | Hero标题 |
| 巨大标题 | --text-5xl | 48px | 特殊展示 |

### 3.3 字重

```css
--font-normal: 400;      /* 正文 */
--font-medium: 500;      /* 强调文字 */
--font-semibold: 600;    /* 小标题 */
--font-bold: 700;        /* 大标题 */
```

### 3.4 行高

```css
--leading-tight: 1.25;    /* 标题 */
--leading-normal: 1.5;    /* 正文 */
--leading-relaxed: 1.75;  /* 长文本 */
```

---

## 四、间距系统

### 4.1 基础间距（8px基准）

```css
--space-1: 4px;    /* 极小间距 */
--space-2: 8px;    /* 元素内间距 */
--space-3: 12px;   /* 紧凑间距 */
--space-4: 16px;   /* 标准间距 */
--space-5: 20px;   /* 中等间距 */
--space-6: 24px;   /* 区块间距 */
--space-8: 32px;   /* 大间距 */
--space-10: 40px;  /* 区块内边距 */
--space-12: 48px;  /* 大区块间距 */
--space-16: 64px;  /* 区块间距 */
--space-20: 80px;  /* 大区块间距 */
--space-24: 96px;  /* 页面区块间距 */
```

### 4.2 页面布局间距

```css
/* 内容区最大宽度 */
max-width: 1400px;

/* 内容区内边距 */
padding: 0 var(--space-10);  /* 桌面端 */
padding: 0 var(--space-5);   /* 移动端 */

/* Section上下间距 */
padding: var(--space-24) var(--space-10);  /* 桌面端 */
padding: var(--space-12) var(--space-5);   /* 移动端 */
```

---

## 五、阴影与圆角

### 5.1 阴影系统（克制优雅）

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.04);           /* 微阴影 */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.06);        /* 标准阴影 */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.06);      /* 悬浮阴影 */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.06);      /* 大阴影 */
--shadow-glow-primary: 0 0 20px rgba(30, 58, 95, 0.15); /* 主色光晕 */
```

### 5.2 圆角系统

```css
--radius-sm: 4px;    /* 小圆角 - 按钮、标签 */
--radius-md: 6px;    /* 中圆角 - 输入框 */
--radius-lg: 8px;    /* 大圆角 - 卡片 */
--radius-xl: 12px;   /* 超大圆角 - 大卡片 */
--radius-2xl: 16px;  /* 特大圆角 - 特色卡片 */
--radius-full: 9999px; /* 圆形 */
```

---

## 六、动画效果

### 6.1 过渡时间

```css
--transition-fast: 150ms ease;      /* 快速反馈 */
--transition-normal: 250ms ease;    /* 标准过渡 */
--transition-slow: 350ms ease;      /* 慢速过渡 */
--transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);  /* 弹性效果 */
```

### 6.2 常用动画

**淡入上移**（滚动进入动画）：
```css
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
```

**光晕脉冲**（Hero背景装饰）：
```css
@keyframes glow-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}
```

**线条闪光**（按钮悬停效果）：
```css
@keyframes shimmer-line {
  0% { left: -100%; }
  100% { left: 100%; }
}
```

### 6.3 滚动动画触发

```javascript
// 使用 Intersection Observer 或滚动监听
// 当元素进入视口 80% 时触发动画
const rect = element.getBoundingClientRect();
if (rect.top < windowHeight * 0.8) {
  element.classList.add('is-visible');
}
```

```css
/* 初始状态 */
.section {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}

/* 可见状态 */
.section.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 七、组件设计规范

### 7.1 按钮规范

**主要按钮（CTA）**：
```css
.cta-button {
  background: var(--gradient-primary);
  color: white;
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-10);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  border: none;
  transition: all var(--transition-spring);
  box-shadow: var(--shadow-md);
  min-width: 160px;
}

.cta-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-lg), var(--shadow-glow-primary);
}
```

**次要按钮**：
```css
.secondary-button {
  background: transparent;
  color: var(--color-primary);
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-10);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  border: 2px solid var(--color-primary);
  transition: all var(--transition-spring);
}

.secondary-button:hover {
  background: var(--color-primary-50);
  border-color: var(--color-primary-light);
  transform: translateY(-2px);
}
```

**金色强调按钮**：
```css
.accent-button {
  background: var(--gradient-accent);
  color: white;
  box-shadow: 0 4px 15px rgba(184, 134, 11, 0.3);
}

.accent-button:hover {
  box-shadow: 0 10px 30px rgba(184, 134, 11, 0.4);
  animation: pulse-glow 2s ease-in-out infinite;
}
```

### 7.2 卡片规范

**标准卡片**：
```css
.card {
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  padding: var(--space-10) var(--space-8);
  box-shadow: var(--shadow-sm);
  border: 1px solid transparent;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-200);
}
```

**图标容器**：
```css
.icon-wrapper {
  width: 88px;
  height: 88px;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-primary-100) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card:hover .icon-wrapper {
  background: linear-gradient(135deg, var(--color-primary-100) 0%, var(--color-primary-200) 100%);
  transform: scale(1.1);
  box-shadow: 0 10px 30px rgba(30, 58, 95, 0.15);
}
```

### 7.3 标题装饰

**页面标题带装饰线**：
```css
.section-title {
  text-align: center;
  font-size: var(--text-3xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-12);
  font-weight: var(--font-bold);
  font-family: var(--font-family-display);
}

.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: var(--gradient-primary);
  margin: var(--space-4) auto 0;
  border-radius: var(--radius-sm);
}
```

### 7.4 表单元素

**输入框**：
```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  transition: all var(--transition-fast);
  background: var(--color-surface);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
}
```

---

## 八、页面结构规范

### 8.1 标准页面布局

```
┌─────────────────────────────────────────┐
│              导航栏 (Header)              │
├─────────────────────────────────────────┤
│                                         │
│           Hero/页面标题区域               │
│     (可选：背景动画、统计数据等)           │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│              主要内容区域                 │
│           (多个Section组成)              │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│            CTA行动召唤区域               │
│         (引导用户进行下一步)              │
│                                         │
├─────────────────────────────────────────┤
│              页脚 (Footer)               │
└─────────────────────────────────────────┘
```

### 8.2 Section规范

**标准Section**：
```css
.section {
  padding: var(--space-24) var(--space-10);
  opacity: 0;
  transform: translateY(40px);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}

.section.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

**交替背景色**：
```css
/* 第一个区域 - 白色背景 */
.section-1 { background: var(--color-background); }

/* 第二个区域 - 暖色背景 */
.section-2 { background: linear-gradient(180deg, var(--color-surface) 0%, var(--color-background-warm) 100%); }

/* 第三个区域 - 白色背景 */
.section-3 { background: var(--color-background); }
```

### 8.3 容器宽度

```css
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-10);
  box-sizing: border-box;
}
```

---

## 九、Hero区域特效

### 9.1 星座网络背景（Canvas动画）

```javascript
// 节点配置
const nodeCount = 25;              // 节点数量
const connectionDistance = 150;    // 连线距离阈值

// 节点样式
nodeStyle: {
  radius: Math.random() * 2 + 2,   // 2-4px
  color: 'rgba(30, 58, 95, 0.3)',  // 主色半透明
  glowColor: 'rgba(30, 58, 95, 0.1)'
}

// 连线样式
lineStyle: {
  color: 'rgba(30, 58, 95, 0.08)',
  maxOpacity: 0.15
}

// 运动参数
velocity: {
  vx: (Math.random() - 0.5) * 0.3,  // 缓慢移动
  vy: (Math.random() - 0.5) * 0.3
}
```

### 9.2 渐变叠加层

```css
.hero-gradient-overlay {
  position: absolute;
  inset: 0;
  background:
    /* 动态网格背景 */
    linear-gradient(90deg, rgba(30, 58, 95, 0.04) 1px, transparent 1px),
    linear-gradient(rgba(30, 58, 95, 0.04) 1px, transparent 1px),
    /* 径向渐变光晕 */
    radial-gradient(ellipse at 30% 50%, rgba(30, 58, 95, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 50%, rgba(184, 134, 11, 0.04) 0%, transparent 50%),
    /* 底部渐变过渡 */
    linear-gradient(180deg, transparent 0%, rgba(30, 58, 95, 0.02) 100%);
  background-size:
    80px 80px,
    80px 80px,
    100% 100%,
    100% 100%,
    100% 100%;
  animation: gradient-shift 8s ease-in-out infinite alternate;
}
```

### 9.3 光晕装饰

```css
.hero-glow-decoration::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  top: -200px;
  left: -100px;
  background: radial-gradient(circle, rgba(184, 134, 11, 0.08) 0%, transparent 70%);
  animation: glow-pulse 10s ease-in-out infinite;
}

.hero-glow-decoration::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  bottom: -100px;
  right: -50px;
  background: radial-gradient(circle, rgba(30, 58, 95, 0.06) 0%, transparent 70%);
  animation: glow-pulse 12s ease-in-out infinite reverse;
}
```

---

## 十、响应式设计

### 10.1 断点定义

```css
/* 大屏桌面 */
@media (min-width: 1200px) { }

/* 桌面 */
@media (max-width: 1199px) { }

/* 平板 */
@media (max-width: 992px) { }

/* 大手机 */
@media (max-width: 768px) { }

/* 手机 */
@media (max-width: 576px) { }
```

### 10.2 响应式调整规则

**字体缩放**：
```css
/* 桌面端 */
.hero-title { font-size: 52px; }
.section-title { font-size: var(--text-3xl); }

/* 移动端 */
@media (max-width: 768px) {
  .hero-title { font-size: var(--text-3xl); }
  .section-title { font-size: var(--text-2xl); }
}
```

**间距缩放**：
```css
/* 桌面端 */
.section { padding: var(--space-24) var(--space-10); }

/* 移动端 */
@media (max-width: 768px) {
  .section { padding: var(--space-12) var(--space-5); }
}
```

**网格布局**：
```css
/* 功能卡片网格 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 桌面：3列 */
  gap: var(--space-6);
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);  /* 平板：保持3列但缩小 */
    gap: var(--space-4);
  }
}

@media (max-width: 576px) {
  .features-grid {
    grid-template-columns: 1fr;  /* 手机：单列 */
  }
}
```

---

## 十一、各页面应用指南

### 11.1 背景评估页面 (/assessment)

**页面结构**：
- Hero区域：简洁标题 + 进度指示器
- 表单区域：分步骤表单，每步一个卡片
- 侧边栏：评估进度、已填写信息预览

**设计要点**：
- 表单卡片使用 `var(--color-surface)` 背景
- 当前步骤高亮使用 `var(--color-primary)`
- 进度条使用 `var(--gradient-primary)`
- 完成状态使用 `var(--color-success)`

### 11.2 AI选校页面 (/school-recommendation)

**页面结构**：
- Hero区域：评估结果摘要 + 雷达图
- 推荐列表：院校卡片网格
- 筛选侧边栏：多维度筛选器

**设计要点**：
- 雷达图使用主色调
- 院校卡片包含：Logo、名称、排名、匹配度
- 匹配度使用金色渐变高亮
- 筛选器使用折叠面板

### 11.3 时间规划页面 (/timeline)

**页面结构**：
- Hero区域：总体进度概览
- 时间线区域：垂直时间线
- 任务看板：看板式任务管理

**设计要点**：
- 时间线节点使用圆形图标
- 已完成：`var(--color-success)`
- 进行中：`var(--color-primary)`
- 待开始：`var(--color-text-tertiary)`
- 连接线使用渐变

### 11.4 材料中心页面 (/materials)

**页面结构**：
- Hero区域：材料完成度统计
- 材料列表：分类卡片
- 文书助手：AI对话界面

**设计要点**：
- 材料分类使用图标 + 颜色区分
- 完成状态使用进度条
- AI对话界面参考聊天应用设计

### 11.5 院校数据库页面 (/university-database)

**页面结构**：
- 搜索Hero：大搜索框 + 热门标签
- 筛选区域：多维度筛选
- 结果列表：表格/卡片切换视图
- 详情弹窗：院校详细信息

**设计要点**：
- 搜索框使用大尺寸、圆角
- 筛选标签使用 `var(--color-primary-100)` 背景
- 表格使用斑马纹
- 详情弹窗使用侧滑面板

### 11.6 AI对话页面 (/ai-chat)

**页面结构**：
- 左侧：对话历史列表
- 右侧：当前对话界面
- 顶部：AI角色选择器

**设计要点**：
- 对话气泡：用户右对齐（主色），AI左对齐（灰色）
- AI思考状态使用三点动画
- 代码块使用 `var(--font-family-mono)`
- 支持Markdown渲染

---

## 十二、图标使用规范

### 12.1 图标来源

使用 Element Plus Icons (@element-plus/icons-vue)

### 12.2 图标尺寸

| 场景 | 尺寸 |
|------|------|
| 导航图标 | 20px |
| 卡片图标 | 44px |
| 功能图标 | 48px |
| 大展示图标 | 64px |

### 12.3 图标颜色

```css
/* 默认状态 */
color: var(--color-primary);

/* 悬停状态 */
color: var(--color-primary-light);

/* 禁用状态 */
color: var(--color-text-tertiary);
```

---

## 十三、可访问性规范

### 13.1 颜色对比度

- 正文文字与背景：至少 4.5:1
- 大标题与背景：至少 3:1
- 交互元素：明显的视觉反馈

### 13.2 焦点状态

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### 13.3 动画考虑

```css
/* 尊重用户减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 十四、设计检查清单

在完成每个页面设计后，请检查以下项目：

### 视觉一致性
- [ ] 使用了正确的色彩变量
- [ ] 字体使用符合规范（标题衬线、正文无衬线）
- [ ] 间距使用 8px 基准系统
- [ ] 圆角使用预定义变量

### 交互体验
- [ ] 所有可交互元素有悬停状态
- [ ] 过渡动画流畅（使用预定义时间）
- [ ] 滚动进入动画正确触发
- [ ] 按钮有点击反馈

### 响应式
- [ ] 移动端布局正确
- [ ] 字体大小适配
- [ ] 间距适配
- [ ] 图片/卡片适配

### 可访问性
- [ ] 颜色对比度足够
- [ ] 焦点状态可见
- [ ] 表单有正确标签
- [ ] 图片有替代文字

---

## 十五、CSS变量快速参考

```css
/* === 颜色 === */
--color-primary: #1E3A5F;
--color-primary-light: #2D5A8E;
--color-accent: #B8860B;
--color-accent-light: #D4AF37;
--color-background: #FAFAFA;
--color-surface: #FFFFFF;
--color-text-primary: #1A1A1A;
--color-text-secondary: #525252;
--color-border: #E5E5E5;

/* === 间距 === */
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-24: 96px;

/* === 字体 === */
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 30px;
--font-family-base: 'Inter', sans-serif;
--font-family-display: 'Playfair Display', serif;

/* === 圆角 === */
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-2xl: 16px;

/* === 阴影 === */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.06);

/* === 过渡 === */
--transition-fast: 150ms ease;
--transition-normal: 250ms ease;
--transition-slow: 350ms ease;
--transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);

/* === 渐变 === */
--gradient-primary: linear-gradient(135deg, #1E3A5F 0%, #2D5A8E 100%);
--gradient-accent: linear-gradient(135deg, #B8860B 0%, #D4AF37 100%);
```

---

**文档版本**：1.0  
**最后更新**：2026年4月  
**维护者**：智途 AstroPath 设计团队
