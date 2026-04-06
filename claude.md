# 智途 AstroPath — 项目上下文手册

> 本文件是 `project_rules.md` 的补充手册。**硬性约束（配色/安全/文案等）见 rules 文件**，本文件聚焦：架构细节、文件索引、踩坑经验、设计规范。

---

## 布局架构

本项目页面被 App.vue 的 Element Plus 容器包裹：

```html
<el-container class="app-container">
  <el-header>              <!-- 固定导航栏 ~64px -->
  <el-main class="app-main"><!-- padding: 20px -->
    <router-view />        <!-- 页面内容渲染于此 -->
  </el-main>
</el-container>
```

**影响**: 页面内全屏高度计算必须减去 header 高度 + 抵消 main padding（详见下方踩坑 #1）。

## 工程化信息

- **路由模式**: Hash 模式 (`createWebHashHistory`)，无需服务器配置即可运行
- **Git Hooks**: pre-commit 自动执行 `vue-tsc --noEmit` 类型检查
- **样式架构**: CSS 变量驱动，5 个分层 CSS 文件按顺序加载
- **测试策略**: 当前**不使用单元测试框架**（vitest/jest），采用 typecheck + lint + 手动验证三轨制（详见下方「测试规范」）。playwright 已安装但未配置，**不要自行初始化测试框架**

## 核心路由

| 路由 | 组件 | 说明 |
|------|------|------|
| `/` | Home.vue | 首页入口 |
| `/assessment` | Assessment.vue | 用户背景信息采集 |
| `/school-recommendation` | SchoolRecommendation.vue | AI 驱动的院校推荐 |
| `/timeline` | Timeline.vue | 留学准备时间线 |
| `/materials` | Materials.vue | 申请材料清单管理 |
| `/university-database` | UniversityDatabase.vue | 院校库（Awwwards 级重构） |
| `/ai-chat` | AIChat.vue | Multi-AI 智能对话 |
| `/ai-config` | AIConfig.vue | API Key 配置（含敏感信息） |
| `/school-detail/:id` | SchoolDetail.vue | 院校详情页 |
| `/major-detail/:id` | MajorDetail.vue | 专业详情页 |

## 关键依赖说明

| 依赖 | 用途 | 使用位置 |
|------|------|---------|
| `echarts` + `vue-echarts` | 数据可视化图表 | 首页统计、选校结果图表 |
| `html2canvas` + `jspdf` | 页面截图导出 PDF | 材料中心导出功能 |
| `marked` + `dompurify` | Markdown 渲染（防 XSS） | AI 对话消息展示 |
| `axios` | HTTP 请求 | AI API 调用（`ai-api.js`） |
| `@phosphor-icons/vue` | 图标库 | 全局图标系统 |
| `clsx` | 条件类名合并 | 样式动态切换 |

## 完整文件索引

### 页面组件 `src/views/`

| 文件 | 用途 |
|------|------|
| `Home.vue` | 首页 |
| `Assessment.vue` | 背景评估 |
| `SchoolRecommendation.vue` | AI 选校推荐 |
| `Timeline.vue` | 时间规划 |
| `Materials.vue` | 材料中心 |
| `UniversityDatabase.vue` | 院校数据库（Awwwards 级） |
| `AIChat.vue` | AI 对话 |
| `AIConfig.vue` | AI 配置（含 API Key） |
| `SchoolDetail.vue` | 院校详情 |
| `MajorDetail.vue` | 专业详情 |

### 状态管理 `src/composables/`

| 文件 | 用途 |
|------|------|
| `useGlobalAIState.ts` | AI 流式响应全局状态（核心） |
| `useAIConfig.ts` | AI 配置管理（API Key 等） |
| `useAIStream.ts` | AI 流式通信逻辑封装 |
| `useAIRecommendation.ts` | AI 选校推荐流程编排 |
| `useActiveStream.ts` | 当前活跃流式会话管理 |
| `useGlobalRecommendationState.ts` | 推荐结果全局状态 |
| `useScrollAnimation.ts` | 滚动触发动画 composable |

### 工具函数 `src/utils/`

| 文件 | 用途 |
|------|------|
| `ai-api.js` | **AI API 通信核心**（请求构建、错误处理） |
| `streamParser.ts` | AI 流式响应解析器 |
| `recommendationEngine.js` | 推荐引擎逻辑（55 所院校匹配） |
| `matchEngine.js` | 院校-专业匹配算法 |
| `markdown.ts` | Markdown 处理工具 |

### 数据源 `src/data/`

| 文件 | 用途 |
|------|------|
| `schools.js` | 55 所院校基础数据 |
| `schoolsData.js` | 院校扩展数据 |
| `majors.js` | 专业数据源 |

### 样式系统 `src/styles/`

| 文件 | 用途 |
|------|------|
| `variables.css` | 设计系统变量（Slate+Amber 配色、字体） |
| `index.css` | 全局样式入口 / Reset |
| `animations.css` | 动画关键帧与过渡类 |
| `utilities.css` | 工具类（间距、显示等） |
| `atmosphere.css` | 氛围层（噪点纹理、光效叠加） |

### 其他关键文件

| 文件 | 用途 |
|------|------|
| `src/App.vue` | 根布局（el-container + el-header + el-main） |
| `src/main.js` | 入口文件（路由注册、插件配置） |
| `docs/competition.md` | 比赛详细评分规则 |

---

## 踩坑经验库

### 1. Hero 全屏高度计算陷阱（高频踩坑！）

**症状**: 设置 `height: 100vh` / `100dvh` 后，要么底部溢出露出一截，要么不够填满留白。

**根因**: 页面在 `el-main` 内渲染，被 header + padding 吃掉了空间。

**正确写法**:

```css
.hero-section {
  height: calc(100dvh - 64px);   /* 减去 el-header */
  margin-top: -20px;             /* 抵消 app-main padding */
}

@media (max-width: 1199px) {
  .hero-section { height: calc(100dvh - 56px); margin-top: -14px; }
}
@media (max-width: 767px) {
  .hero-section { height: calc(100dvh - 52px); margin-top: -10px; }
}
```

**Checklist**:
- [ ] 用 `100dvh` 而非 `100vh`（适配移动端地址栏收起）
- [ ] 减去当前断点下 el-header 的实际高度
- [ ] 用负 margin 抵消 app-main 的 padding
- [ ] 各断点同步调整，不能只写一个值

### 2. Awwwards 设计规范（院校库及后续页面）

项目采用 Awwwards 级设计语言，新页面/组件需遵循：

**命名**: BEM 格式，统一 `ud-` 前缀（如 `.ud-card__accent--danger`）

**字体**:
- 数据/数字/标签 → `var(--font-family-mono)` (JetBrains Mono)
- **禁止使用** Inter / Roboto

**纹理**: 全页 SVG fractalNoise 叠加层，`opacity: 0.03`

**动画曲线**:
- 入场动画: `cubic-bezier(0.16, 1, 0.3, 1)` — Expo Out
- 悬停微交互: `cubic-bezier(0.34, 1.56, 0.64, 1)` — Back Out

**交互模式**:
- 筛选芯片激活态 → 边框强调 + `rgba(15,23,42,0.06)` 底色，不用实色填充
- 卡片悬停 → CSS 3D perspective 倾斜（`--mx/--my` 变量驱动）

**禁止事项**:
- ❌ 蓝白通用配色
- ❌ 三栏 features section 布局
- ❌ 渐变 hero banner
- ❌ Inter/Roboto 字体

### 3. 无障碍：减少动画偏好

所有包含动画的页面/组件**必须**添加：

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0.01ms !important; }
}
```

---

## 开发命令

```bash
npm run dev                  # 启动开发服务器 (http://localhost:3000)
npm run build                # 生产构建
npm run preview              # 预览构建产物
npm run lint                 # ESLint 检查并自动修复
npm run typecheck            # TypeScript 类型检查 (vue-tsc --noEmit)
npm run precommit            # 提交前类型检查（git hook 调用）
```

---

## 测试规范

> **当前项目无自动化测试框架**（playwright 已安装但未配置），采用「自动化检查 + 手动验证」双轨制。

### 第一阶段：自动化检查（必跑，命令行执行）

完成任何代码修改后，**必须依次执行以下两条命令并确保通过**：

```bash
npm run typecheck            # 1. TypeScript 类型检查 — 零错误才能继续
npm run lint                 # 2. ESLint 代码检查 — 零 error（warning 可忽略）
```

> `typecheck` 也在 git pre-commit 钩子中自动运行，但不要依赖它——提前跑可以更快发现问题。

### 第二阶段：手动功能验证（浏览器实测）

根据所修改的功能类型，执行对应的验证清单：

#### A. 页面/组件类改动（通用必做）

- [ ] **页面正常渲染**: 打开对应路由，无白屏、无控制台报错（F12 → Console）
- [ ] **布局正确**: Hero 区域全屏、内容不溢出、不出现意外滚动条
- [ ] **响应式**: 缩放浏览器窗口到以下尺寸验证布局不崩：
  - 桌面端 ≥ 1200px
  - 平板端 768px–1199px
  - 移动端 ≤ 767px
- [ ] **配色合规**: 未引入新颜色（只用 `#0F172A` / `#D97706` / `#FFFFFF`）
- [ ] **交互反馈**: 按钮 hover/active 有视觉反馈，点击有响应

#### B. 表单/输入类改动

- [ ] **正常输入**: 填写各字段，提交成功
- [ ] **空值/边界**: 留空必填项、输入超长文本、特殊字符
- [ ] **表单校验**: 错误提示正确显示
- [ ] **数据持久化**: 刷新页面后数据是否保留（如适用）

#### C. AI 功能类改动（重点！创新分核心）

- [ ] **配置页 (`/ai-config`)**: API Key 保存后刷新仍存在（localStorage）
- [ ] **对话页 (`/ai-chat`)**:
  - 发送消息后有流式输出效果（逐字/逐段显示）
  - 流式过程中停止按钮可用
  - 对话历史保留（切换页面再回来不丢失）
  - Markdown 渲染正确（代码块、列表、加粗等）
- [ ] **选校推荐 (`/school-recommendation`)**: AI 推荐结果能正常加载和展示
- [ ] **异常情况**: 断网 / API Key 无效 / 超时 时有友好错误提示，不白屏崩溃

#### D. 数据展示类改动（院校库、详情页）

- [ ] **数据准确性**: 列表数量与数据源一致（55+ 院校）
- [ ] **筛选/搜索**: 输入关键词后结果正确过滤
- [ ] **详情跳转**: 点击卡片/链接能正确跳转到 `/school-detail/:id` 或 `/major-detail/:id`
- [ ] **空状态**: 无匹配结果时显示空状态提示

#### E. 导出/PDF 类改动（材料中心）

- [ ] **导出功能**: PDF 生成成功、文件可打开、中文不乱码
- [ ] **样式还原**: 导出内容的排版与页面一致

### 第三阶段：交叉验证

- [ ] **导航栏**: 所有页面间互相跳转正常，面包屑/高亮状态正确
- [ ] **全局搜索/功能入口**: 各模块间的数据联动正常（如评估结果→选校推荐）
- [ ] **性能感知**: 页面切换无明显卡顿，首屏加载 < 3s（本地开发环境）

### 测试未通过的处理

1. 自动化检查失败 → **修复后再测，不得跳过**
2. 手动验证发现 bug → 记录 → 修复 → **回归测试**（重跑受影响的 checklist 项）
3. 全部通过后才算功能完成 → git commit
