# Story 项目故事页面 - 实施计划

> **文档性质**: 实施计划文档  
> **基于**: 设计原则交接文档 + 功能规格文档 + Awwwards设计Skill  
> **目标**: 创建Awwwards级别的项目故事展示页面

---

## 一、设计概念确立

### 1.1 叙事核心 (Narrative Core)
**"从星尘到星辰——一段代码与梦想的旅程"**

页面讲述智途AstroPath从一个想法到比赛作品的完整历程，以"宇宙探索"为隐喻：
- 项目启动 = 星尘凝聚
- 技术选型 = 建造飞船
- 功能开发 = 探索星球
- 设计迭代 = 打磨航行器
- 比赛日 = 抵达目的地

### 1.2 视觉语言 (Visual Language)
**"档案式排版 + 电影沉浸"混合风格**

- 深色背景 (#0F172A) 营造宇宙感
- 金色强调 (#D97706) 象征星辰光芒
- 大量留白与极端字号的对比
- 时间线作为视觉主轴贯穿全页

### 1.3 交互哲学 (Interaction Philosophy)
**"每一次滚动都是穿越时间的一次跳跃"**

- 纵向滚动驱动时间线前进
- 每个里程碑是一个"星球"，滚动到达时激活
- 数据可视化以动画形式从0增长到实际值
- 平滑的视差效果增强沉浸感

### 1.4 技术野心 (Technical Ambition)
- **GSAP ScrollTrigger** - 滚动驱动动画叙事
- **Canvas粒子系统** - 星空背景效果
- **CSS动画** - 数字增长、进度条填充
- **Intersection Observer** - 视口触发动画

---

## 二、场景 (Scene) 规划

遵循"全屏沉浸式"原则，页面分为以下场景：

### Scene 0: Hero / 入口
- **尺寸**: 100vw × 100vh
- **内容**:
  - 顶部声明: "以下内容，由AI书写"
  - 主标题: "智途 AstroPath"
  - 副标题: "一站式智能留学规划平台"
  - 开发周期展示
  - 比赛信息
  - 向下滚动提示
- **背景**: Canvas星空粒子动画
- **交互**: 滚动进入Scene 1

### Scene 1: 开发历程时间线
- **尺寸**: 100vw × auto (可滚动)
- **内容**: 垂直时间线展示6个关键节点
  1. 项目启动 - 最初的想法与动机
  2. 技术选型 - Vue 3 + Vite + Element Plus
  3. 核心功能开发 - 5大功能模块
  4. 设计迭代 - 从初稿到Awwwards标准
  5. 比赛准备 - 答辩与演示
  6. 比赛日 - 展示与等待
- **交互**: 滚动时节点依次激活，展开详情

### Scene 2: 量化的心血 (数据展示)
- **尺寸**: 100vw × 100vh
- **内容**:
  - 代码统计卡片 (行数、文件数、组件数)
  - Git提交数据 (提交次数、开发天数、最活跃日期)
  - 内容数据 (院校数、专业数、AI角色数)
- **交互**: 数字从0动画增长到实际值

### Scene 3: 技术亮点
- **尺寸**: 100vw × auto
- **内容**: 5个技术亮点的卡片展示
  - AI流式响应架构
  - 多Provider AI配置系统
  - Composable状态管理
  - 氛围分级设计系统
  - 响应式布局适配
- **交互**: 卡片悬停3D倾斜效果

### Scene 4: 致谢与感言
- **尺寸**: 100vw × 100vh
- **内容**:
  - 致谢开源社区与设计灵感
  - 开发者感言 (第三人称)
  - 返回首页按钮
- **背景**: 渐隐的星空

---

## 三、设计系统

### 3.1 色彩系统
```css
/* 严格遵循项目配色 */
--c-bg: #0F172A;           /* Slate-900 主背景 */
--c-bg-light: #1E293B;     /* Slate-800 卡片背景 */
--c-text: #F8FAFC;         /* Slate-50 主文字 */
--c-text-muted: #94A3B8;   /* Slate-400 次要文字 */
--c-accent: #D97706;       /* Amber-600 强调色 */
--c-accent-light: #F59E0B; /* Amber-500 高亮 */
```

### 3.2 字体系统
```css
/* 展示字体 */
--font-display: 'JetBrains Mono', monospace;

/* 字号层级 */
--text-hero: clamp(4rem, 12vw, 10rem);     /* Hero标题 */
--text-h1: clamp(2rem, 5vw, 4rem);         /* 场景标题 */
--text-h2: clamp(1.5rem, 3vw, 2.5rem);     /* 节点标题 */
--text-body: 1rem;                          /* 正文 */
--text-small: 0.875rem;                     /* 辅助文字 */
```

### 3.3 动画曲线
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-in-out-expo: cubic-bezier(0.87, 0, 0.13, 1);
```

---

## 四、数据结构

### 4.1 时间线数据
```typescript
interface TimelineNode {
  id: number;
  date: string;
  title: string;
  description: string;
  details: string[];
  icon: string;
}
```

### 4.2 统计数据
```typescript
interface ProjectStats {
  code: {
    lines: number;
    files: number;
    components: number;
  };
  git: {
    commits: number;
    days: number;
    mostActiveDate: string;
  };
  content: {
    schools: number;
    majors: number;
    aiAgents: number;
  };
}
```

### 4.3 技术亮点
```typescript
interface TechHighlight {
  id: number;
  title: string;
  description: string;
  tags: string[];
}
```

---

## 五、组件规划

### 5.1 页面组件
```
Story.vue (主页面)
├── StarBackground.vue (Canvas星空背景)
├── StoryHero.vue (Scene 0)
├── TimelineSection.vue (Scene 1)
│   └── TimelineNode.vue (时间线节点)
├── StatsSection.vue (Scene 2)
│   ├── StatCard.vue (统计卡片)
│   └── CountUp.vue (数字增长动画)
├── TechHighlights.vue (Scene 3)
│   └── HighlightCard.vue (亮点卡片)
└── ClosingSection.vue (Scene 4)
```

### 5.2 可复用动画组件
- `FadeInUp.vue` - 淡入上移动画
- `CountUp.vue` - 数字增长动画
- `ParallaxWrapper.vue` - 视差效果包装器

---

## 六、文件结构

```
src/
├── views/
│   └── Story.vue                 # 主页面
├── components/
│   └── story/
│       ├── StarBackground.vue    # 星空背景
│       ├── StoryHero.vue         # Hero场景
│       ├── TimelineSection.vue   # 时间线
│       ├── TimelineNode.vue      # 时间线节点
│       ├── StatsSection.vue      # 统计数据
│       ├── StatCard.vue          # 统计卡片
│       ├── TechHighlights.vue    # 技术亮点
│       ├── HighlightCard.vue     # 亮点卡片
│       └── ClosingSection.vue    # 结尾场景
├── composables/
│   └── useCountUp.ts             # 数字动画composable
├── data/
│   └── storyData.ts              # 故事页面数据
└── router/
    └── index.ts                  # 添加路由配置
```

---

## 七、路由配置

```typescript
{
  path: '/story',
  name: 'Story',
  component: () => import('@/views/Story.vue'),
  meta: { title: '项目故事' }
}
```

---

## 八、依赖项

### 8.1 已有依赖 (无需安装)
- Vue 3
- GSAP (假设已安装，如未需安装)
- Element Plus

### 8.2 可能需要安装
```bash
npm install gsap @gsap/vue
```

---

## 九、实现步骤

### Phase 1: 基础结构
1. 创建 `Story.vue` 主页面框架
2. 配置路由 `/story`
3. 创建 `storyData.ts` 数据文件

### Phase 2: 场景组件
4. 实现 `StarBackground.vue` Canvas背景
5. 实现 `StoryHero.vue` Hero场景
6. 实现 `TimelineSection.vue` 时间线
7. 实现 `StatsSection.vue` 数据统计
8. 实现 `TechHighlights.vue` 技术亮点
9. 实现 `ClosingSection.vue` 结尾

### Phase 3: 动画与交互
10. 添加GSAP ScrollTrigger滚动动画
11. 实现数字增长动画
12. 添加视差效果
13. 实现场景切换过渡

### Phase 4: 优化与测试
14. 添加 `prefers-reduced-motion` 支持
15. 移动端适配
16. 性能优化
17. 测试与调试

---

## 十、关键实现细节

### 10.1 星空背景
```typescript
// Canvas粒子系统
- 粒子数量: 100-150
- 粒子颜色: rgba(217, 119, 6, 0.3) - 金色微光
- 连线距离: 100px
- 鼠标交互: 粒子轻微排斥
```

### 10.2 时间线动画
```typescript
// ScrollTrigger配置
{
  trigger: ".timeline-node",
  start: "top 80%",
  end: "top 50%",
  toggleActions: "play none none reverse"
}
```

### 10.3 数字增长动画
```typescript
// 从0增长到目标值
duration: 2000ms
easing: easeOutExpo
separator: "," // 千分位分隔符
```

### 10.4 无障碍支持
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 十一、文案内容

### Hero文案
- 声明: "以下内容，由AI书写"
- 主标题: "智途 AstroPath"
- 副标题: "一站式智能留学规划平台"
- 描述: "从首次commit到比赛日的完整旅程"

### 时间线文案 (6个节点)
1. **项目启动** - "一切从一个想法开始"
2. **技术选型** - "选择最适合的航行器"
3. **核心功能** - "构建五大核心模块"
4. **设计迭代** - "从可用到卓越"
5. **比赛准备** - "最后的冲刺"
6. **比赛日** - "展示与等待"

### 感言文案
> "这不仅仅是一个比赛项目，而是一次完整的自我证明。每一行代码都承载着对技术的敬畏，每一次迭代都代表着对完美的追求。"

---

## 十二、检查清单

### 视觉品质
- [ ] 全屏沉浸式场景设计
- [ ] 配色严格遵循 Slate-900 + Amber-600
- [ ] 使用 JetBrains Mono 作为数据/数字字体
- [ ] 噪点纹理叠加层

### 技术质量
- [ ] Canvas星空背景性能优化
- [ ] GSAP动画使用will-change
- [ ] 图片/资源懒加载
- [ ] 支持prefers-reduced-motion

### 创意完整性
- [ ] 第一屏足够震撼
- [ ] 时间线有明确的"Wow Moment"
- [ ] 数字增长动画令人印象深刻
- [ ] 整体视觉语言统一

### 功能完整
- [ ] 所有6个时间线节点完整展示
- [ ] 统计数据准确
- [ ] 技术亮点描述清晰
- [ ] 返回首页按钮可用

---

*本计划遵循设计原则交接文档的两个核心原则：全屏沉浸式 + 设计与功能有机融合。*
