# Editorial Cards Redesign Plan

## 问题诊断

当前设计「很糟糕」的 5 个核心问题：

1. **卡片与背景无对话** — 纯白卡片浮在纯白背景上，没有深度层次
2. **视觉噪音过多** — 每个卡片包含 10+ 个视觉元素，信息过载
3. **网格机械感** — 3×2 整齐网格像 Excel，没有编辑设计感
4. **Featured 只是贴标签** — BEST MATCH 徽章像促销贴纸
5. **缺乏页面叙事** — Hero 震撼后直接跳到列表，没有过渡

---

## 解决方案：The Editorial Grid（编辑式网格）

**核心概念**：这不是「结果列表」，而是一本「选校特刊」。

### 视觉策略

| 元素 | 当前 | 改进后 |
|------|------|--------|
| 页面背景 | #FFFFFF | #F8FAFC (slate-50) |
| 卡片背景 | #FFFFFF | #FFFFFF (保持) |
| 网格 | 3×2 uniform | Editorial mix (大小交替) |
| 卡片信息 | 全部展示 | 极简 + hover 揭示 |
| Featured | 小徽章 | 封面故事形态 |

### 页面结构

```
┌─────────────────────────────────────────────────────────┐
│  RESULTS HERO (保留现有)                                  │
├─────────────────────────────────────────────────────────┤
│  TRANSITION ZONE (新增)                                   │
│  ┌─────────────────────────────────────────────────┐    │
│  │  04  所核心推荐  ·  基于你的 CS 背景  ·  3.8 GPA   │    │
│  └─────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│  EDITORIAL GRID (重构)                                    │
│  ┌─────────────────┬─────────────────┬─────────────┐    │
│  │                 │    北京大学      │   多伦多     │    │
│  │   BEST MATCH    │      72%        │    82%      │    │
│  │   (封面故事)     │    #14          │   #29       │    │
│  │   全宽或半宽     │   (标准卡片)     │  (标准卡片)  │    │
│  └─────────────────┴─────────────────┴─────────────┘    │
│  ┌─────────────┬─────────────────────────────────────┐    │
│  │   UBC       │         帝国理工                      │    │
│  │   68%       │           91%                         │    │
│  │  (标准)      │        (Featured 2)                   │    │
│  └─────────────┴─────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 实施步骤

### Phase 1: 页面级重构

**文件**: `SchoolRecommendation.vue` + `RecommendationList.vue`

1. **添加 Transition Zone**
   - 位置：Hero 下方、Filter Bar 上方
   - 内容：大数字统计 + 一句话总结
   - 样式：超大数字 (72px) + 细体文字

2. **重构网格系统**
   - 从 `grid-template-columns: repeat(3, 1fr)`
   - 改为 CSS Grid 的 editorial layout
   - 使用 `grid-template-areas` 或动态 class

3. **页面背景色**
   - `.page-results` 背景改为 #F8FAFC
   - 卡片保持 #FFFFFF 创造悬浮感

### Phase 2: 卡片级重构

**文件**: `SchoolCard.vue` (极简版)

1. **默认状态（极简）**
   - 校名（大，900 weight）
   - 匹配度圆环（中号，视觉焦点）
   - 排名（小，mono 字体）
   - 单按钮「探索」

2. **Hover 状态（揭示详情）**
   - 卡片轻微上浮
   - 展开显示：AI 理由、学费、录取率
   - 其他卡片 opacity 0.5（焦点模式）

3. **移除元素**
   - AI INSIGHT 标签
   - 详细数据行（学费/录取率/截止）
   - 双按钮（改为单按钮）
   - 收藏心形（移到 hover 状态）

### Phase 3: Featured 重新定义

**文件**: `SchoolCard.vue` (featured variant)

1. **布局变体**
   - 全宽或半宽（grid-column: span 2/3）
   - 左侧：学校色块/图案
   - 右侧：校名 + 核心匹配理由（一句话）

2. **视觉区分**
   - 不是「更大」，而是「不同结构」
   - 琥珀色左边框 6px
   - 背景微渐变（白 → amber-50）

---

## 设计规范

### 色彩
```css
--page-bg: #F8FAFC;        /* slate-50 */
--card-bg: #FFFFFF;        /* white */
--text-primary: #0F172A;   /* slate-900 */
--text-secondary: #64748B; /* slate-500 */
--text-tertiary: #94A3B8;  /* slate-400 */
--accent: #D97706;         /* amber-600 */
--accent-light: #FFFBEB;   /* amber-50 */
```

### 字体层级
```css
/* 校名 */
font-size: clamp(20px, 2vw, 26px);
font-weight: 900;
letter-spacing: -0.5px;

/* 匹配度 */
font-size: 28px;
font-weight: 900;
font-family: mono;

/* 排名 */
font-size: 12px;
font-weight: 600;
font-family: mono;
color: text-tertiary;

/* AI 理由（hover 显示） */
font-size: 13px;
line-height: 1.6;
color: text-secondary;
```

### 间距
```css
/* 页面 */
--page-padding: 40px;
--section-gap: 48px;

/* 网格 */
--grid-gap: 24px;

/* 卡片内部 */
--card-padding: 28px;
--element-gap: 16px;
```

### 动画
```css
/* 卡片入场 */
animation: cardReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
animation-delay: calc(var(--index) * 0.1s);

/* Hover 上浮 */
transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.4s ease;
transform: translateY(-4px);
box-shadow: 0 20px 40px rgba(15,23,42,0.08);

/* 焦点模式 */
.sibling-cards { opacity: 0.5; transition: opacity 0.3s; }
```

---

## 检查清单

- [ ] Transition Zone 显示正确统计数字
- [ ] 页面背景为 slate-50，卡片悬浮感明显
- [ ] 网格有 editorial 节奏（非 uniform）
- [ ] 默认卡片只显示：校名 + 匹配度 + 排名 + 探索按钮
- [ ] Hover 卡片显示完整信息，其他卡片淡化
- [ ] Featured 卡片是「封面故事」形态，不是「更大」
- [ ] 所有动画流畅，无卡顿
- [ ] 移动端适配良好
