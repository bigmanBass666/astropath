# Assessment 页面沉浸式重构计划

> **目标**: 将"土表单套 Awwwards 壳"的体验，重构为浑然天成的沉浸式叙事旅程
> **方案**: 沉浸式叙事旅程 (Immersive Narrative Journey)
> **核心理念**: "不是在填表单，而是在构建你的留学故事"

---

## 一、问题诊断

### 当前页面的核心缺陷

| 问题 | 具体表现 |
|------|---------|
| **视觉断层** | Hero 区域（光球/圆环/几何线条）是电影级设计，一滚下去就是标准 Element Plus 表单，两种语言完全不搭 |
| **交互陈旧** | 4步 Stepper 向导是最传统的表单模式，每个步骤就是字段排列，零创意 |
| **弹窗疲劳** | 4个 el-dialog（科研/实习/竞赛/志愿）每次拉出上下文，打断心流 |
| **无情感旅程** | 背景评估本应是自我探索之旅，现在像填 Excel 表格 |
| **组件痕迹** | 大量 `:deep()` 覆盖但底层仍是标准组件（slider滑块、dialog标题栏） |
| **报告割裂** | Step 4 Bento Dashboard 设计不错，但和前3步像两个产品 |

### 为什么需要重构（不只是修修补补）

当前问题的根源是**架构层面**的：Stepper + Dialog + 标准表单组件 这个组合从根本上决定了体验上限。仅靠样式调整无法解决。

---

## 二、设计方案：沉浸式叙事旅程

### 2.1 整体架构变化

```
Before (当前):                          After (重构后):
┌──────────────┐                        ┌────────────────────┐
│   HERO       │                        │   HERO (融合过渡)    │
│  (装饰性)     │   ← 视觉断层 →           │        ↓ 渐变融合     │
├──────────────┤                        ├────────────────────┤
│ [Stepper]    │                        │ ═══ Chapter 1 ═══  │
│ ┌─────────┐  │                        │  身份卡片 (Identity) │
│ │ Step 0  │  │   ← 标准表单 →           │  · 大字号姓名输入     │
│ │ 表单字段  │  │                        │  · 数据芯片(年龄/院校) │
│ └─────────┘  │                        │  · 环形GPA进度环      │
│ ┌─────────┐  │                        │  · 语言成绩行         │
│ │ Step 1  │  │                        ├────────────────────┤
│ │ 更多字段  │  │   ← 弹窗CRUD →          │ ═══ Chapter 2 ═══  │
│ └─────────┘  │                        │  学术面板 (Academics)│
│ ...         │                        │  · 学历Pill选择      │
│ [4 dialogs] │                        │  · 专业浮动标签云     │
└──────────────┘                        │  · 内联科研时间线     │
                                        ├────────────────────┤
                                 [Orbit] │ ═══ Chapter 3 ═══  │
                                  ↑      │  经历时间线 (Exp.)   │
                               进度轨道    │  · 三轨平行时间线     │
                                        │  · 内联编辑节点       │
                                        ├────────────────────┤
                                        │ ═══ Report ═══      │
                                        │  Bento Dashboard    │
                                        └────────────────────┘
```

**关键变化：**
- ❌ 移除 Stepper 导航栏
- ✅ 新增右侧固定 **Progress Orbit**（进度轨道）— 圆形节点连线 + 微光
- ❌ 移除所有 el-dialog（4个）
- ✅ 全部改为 **Inline Expandable Panel**（内联可展开面板）
- ✅ 章节间平滑滚动过渡 + IntersectionObserver 入场动画

### 2.2 Progress Orbit（进度轨道）

位置：页面右侧固定，垂直居中偏上
样式：
- 细线连接 4 个圆形节点
- 当前章节节点：`#0F172A` 实心 + 外发光（box-shadow glow）
- 已完成章节：`#0F172A` 实心 + 内嵌 ✓ 图标
- 未到达章节：空心描边 + 半透明
- 使用 `IntersectionObserver` 监听各章节可见性，自动切换激活状态
- 点击节点可滚动到对应章节

### 2.3 各章节详细设计

#### Chapter 1: Identity（身份）— 替代原 Step 0

**视觉概念**: 一张精致的数字身份卡

| 元素 | 当前设计 | 重构设计 |
|------|---------|---------|
| 姓名 | 居中 el-input | 保留大字号输入，增加 placeholder 动画效果 |
| 年龄+院校 | 两列 grid + el-select/el-input-number | "数据芯片" — 带图标的紧凑卡片，点击展开选择 |
| GPA | el-slider 线性滑块 | **环形进度环 (SVG Circular Ring)** — 拖动/点击调整，中心显示数字 |
| 语言成绩 | 标准 el-input | 单行紧凑输入，左侧带语言图标 |

布局：居中单列卡片（max-width: 640px），内部元素纵向排列，间距呼吸感强
底部操作："下一步"按钮改为全宽主色按钮，带箭头图标

#### Chapter 2: Academics（学术）— 替代原 Step 1

**视觉概念**: 交互式学术能力图谱

| 元素 | 当前设计 | 重构设计 |
|------|---------|---------|
| 学历 | Pill 按钮组 | 保留，增加选中时的 scale 弹跳动画 + 光晕扩散 |
| 专业方向 | 标签云 | 浮动标签 — hover 时轻微上浮 + 背景色渐变填充 |
| 均分 | el-input-number | 内嵌数字显示 + 小型调节控件 |
| 科研经历 | 列表 + Dialog CRUD | **内联可折叠时间线** — 每项为时间线节点，点击原地展开编辑面板 |

科研经历的内联编辑面板：
- 默认显示为折叠的时间线节点（项目名 + 角色 + 时长）
- 点击后原地展开为编辑表单（不弹窗）
- 编辑完成后收起，显示更新后的摘要
- "添加"按钮变为时间线末尾的虚线框 "+" 节点

#### Chapter 3: Experience（经历）— 替代原 Step 2

**视觉概念**: 三条平行的生命时间线

| 元素 | 当前设计 | 重构设计 |
|------|---------|---------|
| Tab切换 | 顶部 Pill Tabs | 底部/侧边导航条风格，带滑动指示器 |
| 实习列表 | 列表 + Dialog | 时间线节点卡片，内联编辑 |
| 竞赛列表 | 列表 + Dialog | 时间线节点卡片，获奖级别彩色标签 |
| 志愿列表 | 列表 + Dialog | 时间线节点卡片，绿色调标识 |

三轨时间线的视觉区分：
- 实习轨：`#0F172A` 主色调节点
- 竞赛轨：`#D97706` 强调色节点
- 志愿轨：淡绿 `#059669` 节点（唯一使用功能色的地方，语义合理）

每轨末尾有虚线 "+" 按钮，点击展开内联添加表单

#### Chapter 4: Report（报告）— 优化原 Step 3

Bento Dashboard 核心设计保留（已足够好），增强项：

- **入场动画**: Staggered reveal — 各卡片依次从下方淡入上移
- **分数动画**: 数字滚动效果增强（已有基础，优化缓动曲线）
- **AI 分析区域**: 增加 typing cursor 的光晕脉冲效果
- **雷达图**: 增加数据点 hover 高亮联动

---

## 三、交互创新亮点总结

| # | 创新点 | 描述 | 创新价值 |
|---|--------|------|---------|
| 1 | Progress Orbit | 右侧圆形进度轨道替代传统 Stepper | 导航体验革新 |
| 2 | Circular GPA Ring | SVG 环形进度条替代线性 slider | 输入方式创新 |
| 3 | Inline Edit Panels | 零弹窗，所有 CRUD 内联完成 | 心流保持 |
| 4 | Timeline Nodes | 时间线节点式的经历展示 | 信息可视化 |
| 5 | Smooth Scroll Chapters | IntersectionObserver 驱动的章节切换 | 沉浸感提升 |
| 6 | Live Data Preview | 实时数据摘要预览（可选） | 即时反馈 |

---

## 四、技术实施计划

### 4.1 实施阶段

#### Phase 1: 架构骨架重构
- [ ] 移除 Stepper 组件模板和样式
- [ ] 创建 Progress Orbit 组件（纯 HTML/CSS）
- [ ] 将 4 个 step section 改为 chapter section（v-show → CSS scroll-snap 或自然滚动）
- [ ] 实现 IntersectionObserver 章节追踪逻辑
- [ ] Hero 与 Chapter 1 的视觉融合过渡

#### Phase 2: Chapter 1 — Identity 重设计
- [ ] 重写姓名输入区域样式（增加 focus 动画）
- [ ] 将年龄+院校改为"数据芯片"布局
- [ ] **实现 SVG 环形 GPA 进度环组件**（替换 el-slider）
- [ ] 语言成绩输入行优化
- [ ] 章节整体排版和间距调优

#### Phase 3: Chapter 2 — Academics 重设计
- [ ] 学历 Pill 选择器动画增强
- [ ] 专业标签云微交互（hover float）
- [ ] 均分显示区域重设计
- [ ] **将科研经历从 Dialog 改为内联时间线面板**
- [ ] 科研条目的展开/收起/编辑/删除交互实现

#### Phase 4: Chapter 3 — Experience 重设计
- [ ] Tab 切换器重新设计（导航条风格）
- [ ] **三轨时间线布局实现**
- [ ] 实习/竞赛/志愿各自的内联编辑节点
- [ ] 添加新条目的内联表单面板
- [ ] 三轨的视觉差异化处理

#### Phase 5: Report + 全局打磨
- [ ] Bento Dashboard staggered 入场动画
- [ ] 分数动画曲线优化
- [ ] AI 区域视觉效果增强
- [ ] 所有 form field 的微交互统一（focus/hover/blur transition）
- [ ] Progress Orbit 的 click-to-scroll 功能
- [ ] 章节间的 scroll 行为优化

#### Phase 6: 响应式适配 + 测试
- [ ] 桌面端 (≥1200px) 完整验证
- [ ] 平板端 (768-1199px) Orbit 隐藏/简化 + 布局调整
- [ ] 移动端 (≤767px) 单列布局 + 触控优化
- [ ] `npm run typecheck` 通过
- [ ] `npm run lint` 通过
- [ ] 手动功能验证（按 CLAUDE.md 测试规范 C 类）

### 4.2 代码变更范围

| 文件 | 变更程度 | 说明 |
|------|---------|------|
| `src/views/Assessment.vue` template | ~90% 重写 | 整体结构从 Stepper 改为 Scroll Chapters |
| `src/views/Assessment.vue` style | ~95% 重写 | 全新的设计系统样式 |
| `src/views/Assessment.vue` script | ~15% 调整 | 新增 Orbit 状态管理、内联面板状态、GPA ring 逻辑 |
| 新增依赖 | 无 | 纯 CSS + SVG 实现，无需新 npm 包 |
| 其他文件 | 不变 | 数据流、AI调用、路由等完全保留 |

### 4.3 保留不变的核心逻辑

- ✅ `form` reactive 对象结构（basic / academic / practice）
- ✅ localStorage 持久化（loadFromStorage / watch 自动保存）
- ✅ AI 分析流程（useAIStream + useActiveStream + buildAssessmentPrompt）
- ✅ 评分计算（overallScore / academicScore / languageScore 等）
- ✅ ECharts 雷达图渲染
- ✅ Markdown 渲染
- ✅ 跳转到 SchoolRecommendation 的数据传递路径
- ✅ 所有校验规则（basicRules / researchRules 等）

---

## 五、设计规范约束检查

| 约束项 | 是否符合 | 说明 |
|--------|---------|------|
| 配色系统 (#0F172A / #D97706 / #FFF) | ✅ | 仅在语义必要处使用功能色（竞赛级别/志愿标识） |
| 院校数量 55+ | ✅ | 不涉及此页面 |
| 固定副标题文案 | ✅ | Hero 区域保留原文案 |
| BEM 命名 + ud-/ap- 前缀 | ✅ | 保持 ap- 前缀一致性 |
| 字体规范 (JetBrains Mono 数字) | ✅ | GPA/分数等数字使用 mono 字体 |
| 噪点纹理叠加层 | ✅ | 保留 .ap-noise |
| 动画曲线 (Expo Out / Back Out) | ✅ | 统一使用 --ease-expo / --ease-back |
| 减少动画偏好 | ✅ | 添加 @media (prefers-reduced-motion) |
| 安全红线 | ✅ | 不涉及 API Key |

---

## 六、风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 环形 GPA 交互复杂度 | 中 | 先实现点击版本，拖动版本作为增强 |
| 内联面板状态管理 | 低 | 每个 panel 用独立的 ref 控制展开状态 |
| 移动端 Orbit 布局 | 低 | 移动端自动隐藏 Orbit，改用顶部迷你进度条 |
| 滚动行为与表单验证冲突 | 低 | 保留 nextStep/prevStep 逻辑用于"下一步"按钮，同时支持自由滚动浏览 |
