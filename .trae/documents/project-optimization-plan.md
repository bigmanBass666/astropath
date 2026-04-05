# 智途 AstroPath — 全面优化计划

> 基于对项目 52 个源文件的深度扫描，从架构、代码质量、工程化、性能、安全五个维度进行的全面诊断。

---

## 一、项目现状快照

| 维度 | 数据 |
|------|------|
| 源文件总数 | 52 个（.vue × 11, .ts × 16, .js × 7, .css × 5） |
| 最大文件 | [UniversityDatabase.vue](src/views/UniversityDatabase.vue) — **~2595 行**（模板 846 + 脚本 279 + 样式 1470） |
| 次大文件 | [Home.vue](src/views/Home.vue) — **~1442 行**（模板 194 + 脚本 293 + 样式 955） |
| `any` 类型使用 | **22 处**（集中在 useAIRecommendation 18 处 + useAIStream 4 处） |
| localStorage 散落 | **58 处调用**，分布在 **11 个文件**中 |
| console 残留 | **15 处**（error/warn/log） |
| 硬编码颜色 | 多处违反配色规范（`#DC2626`, `#059669`, `#0284C7` 等） |

---

## 二、🔴 紧急问题（严重影响开发体验与可维护性）

### P0-1：路由配置「裸奔」在 main.js 中
**现状**：[main.js](src/main.js#L15-L76) 中直接定义了全部路由（62 行），没有独立的 `src/router/` 目录。
**影响**：
- 路由无法被 IDE 正确导航和自动补全
- 无法添加路由守卫、懒加载元数据等扩展
- 违反 Vue 项目标准实践，新开发者困惑
**修复方案**：提取到 `src/router/index.ts`，main.js 只做一行 import。

### P0-2：localStorage 「狂野西部」模式 — 58 处散落调用
**现状**：11 个文件各自直接读写 localStorage，key 命名不统一（`school_favorites` / `assessment_form` / `CHAT_STATE_KEY` / `ai_providers` ...），无类型保护，无错误处理统一化。
**涉及文件**：
- [UniversityDatabase.vue](src/views/UniversityDatabase.vue#L1043-L1106) — 4 处
- [SchoolDetail.vue](src/views/SchoolDetail.vue#L504-L596) — 3 处
- [SchoolRecommendation.vue](src/views/SchoolRecommendation.vue#L516-L674) — 7 处
- [AIChat.vue](src/views/AIChat.vue#L553-L699) — 8 处
- [Assessment.vue](src/views/Assessment.vue#L1450-L1482) — 4 处
- [Materials.vue](src/views/Materials.vue#L1235-L1694) — 12 处
- [Timeline.vue](src/views/Timeline.vue#L708-L727) — 2 处
- 以及 composables 和 utils 中的多处...

**修复方案**：创建 `src/composables/useStorage.ts` 统一封装，提供类型安全的 get/set/remove，支持命名空间前缀、JSON 自动序列化、默认值、错误兜底。

### P0-3：巨型组件 — UniversityDatabase.vue 2595 行
**现状**：单文件包含完整的模板（院校搜索 + 专业搜索 + 对比模态框 + Toast）、全部逻辑、**1470 行 scoped CSS**。
**影响**：
- 编辑器性能差、Git 冲突概率极高
- 逻辑和 UI 耦合无法复用
- 团队协作时锁文件严重
**修复方案**：拆分为至少 5 个子组件 + 抽取 composable：

```
UniversityDatabase.vue (容器，<100 行)
├── HeroSection.vue          (Hero 搜索区)
├── SchoolPanel.vue          (院校筛选 + 卡片/列表)
├── MajorPanel.vue           (专业筛选 + 卡片)
├── CompareModal.vue         (对比对话框)
├── useDatabaseFilters.ts    (筛选/分页/排序逻辑)
└── useToast.ts              (Toast 通知 → 提升为全局公用)
```

### P0-4：TypeScript 类型安全形同虚设 — 22 处 `any`
**现状核心区域**：
- [useAIRecommendation.ts](src/composables/useAIRecommendation.ts) — **18 处 any**，参数全标 any
- [useAIStream.ts](src/composables/useAIStream.ts#L146-L231) — **4 处 any**

**修复方案**：
1. 为数据模型创建 `src/types/` 类型定义文件（School, Major, AssessmentForm 等）
2. 将 `useAIRecommendation.ts` 的 any 逐步替换为具体类型
3. `useAIStream.ts` 的 messages/options 定义为泛型接口

---

## 三、🟡 重要问题（影响代码质量和开发效率）

### P1-1：重复代码泛滥（DRY 违反）

| 重复模式 | 出现位置 | 次数 |
|----------|---------|------|
| 收藏/取消收藏逻辑 | UniversityDatabase, SchoolDetail, SchoolRecommendation | **3 份** |
| Provider 加载逻辑 | AIChat, Assessment, Materials, useAIStream, ai-api | **5 份** |
| 卡片 3D 悬停倾斜 | onCardHover vs onMajorHover | **2 份几乎相同** |
| 空 User Guidance Prompt | ai-api.js L10-19 vs useGlobalAIState.ts L115-125 | **2 份完全重复** |
| Toast 通知实现 | UniversityDatabase 内联 | 可抽取为公共组件 |

**修复方案**：
- 收藏逻辑 → `composables/useFavorites.ts`
- Provider 加载 → 已有 `useAIConfig.ts`，但各页面未统一使用
- 悬停倾斜 → `composables/useTiltEffect.ts`
- Prompt → 统一到 `src/prompts/` 目录或 ai-api.js 单一来源

### P1-2：数据源架构混乱
**现状**：
- [schools.js](src/data/schools.js) 只是 re-export：`export { schoolsData } from '@/data/schoolsData'`
- [schoolsData.js](src/data/schoolsData.js) 是实际数据（JS 对象数组，无类型）
- [majors.js](src/data/majors.js) 专业数据（同样无类型）
- **没有 .ts 版本的数据模型定义**
- matchEngine.js 和 recommendationEngine.js 各自重新定义了匹配逻辑

**影响**：新增字段时需要改 N 个地方，无编译期校验。

**修复方案**：
1. 创建 `src/types/school.ts` / `src/types/major.ts` 接口
2. 数据文件迁移为 `.ts` 并标注类型
3. 合并 `schools.js` → 直接导入 `schoolsData`

### P1-3：样式系统违规
**现状**：
- [UniversityDatabase.vue](src/views/UniversityDatabase.vue) 的 scoped CSS 中大量硬编码颜色值：
  - `#DC2626` (danger red), `#059669` (success green), `#0284C7` (info blue), `#F59E0B` (amber)
  - 这些违反项目规则「主色 #0F172A + 强调色 #D97706」
- Home.vue 使用了渐变背景 `var(--gradient-hero)` 但变量未在 variables.css 中统一定义
- 两套设计语言并存：Home/Timeline 等用「旧风格」(CSS 变量 + Element Plus)，UniversityDatabase 用「Awwwards 风格」(ud- 前缀 BEM)

**修复方案**：
1. 将 Awwwards 页面的语义色映射回 CSS 变量体系（如 `--color-danger: #DC2626` 在 variables.css 中定义）
2. 或明确两套设计语言的边界，避免混用

### P1-4：工程化缺失
| 缺失项 | 影响 | 建议 |
|--------|------|------|
| 无 `.env` 文件 | API 地址、Feature Flag 等硬编码 | 创建 `.env` / `.env.development`，用 `import.meta.env.VITE_*` |
| 无 Prettier | 团队格式不统一 | 添加 `prettier.config.js` |
| `checkJs: false` | js 文件无类型检查 | 改为 `true`（需先补类型） |
| `window.$router = router` | 全局污染，仅为了测试 | 改用 Playwright 自带的路由访问方式 |
| 存在 `.bak` 文件 | SchoolRecommendation.vue.bak 不应入库 | 加入 `.gitignore` |
| 无 404 路由 | 用户输入错误 URL 白屏 | 添加 catch-all 路由 |

### P1-5：错误处理不一致
**现状**：
- 部分 localStorage 操作有 try-catch（如 Assessment.vue L1480），部分没有
- AI 流式错误的 AbortError 判断链过长（[useAIStream.ts](src/composables/useAIStream.ts#L264-L269) — 5 行判断一个 abort）
- 部分 catch 块是空的 `catch {}`（Assessment.vue L1452, SchoolDetail.vue L589）

**修复方案**：
1. 统一存储层（P0-2 解决后自动消除大部分）
2. 提取 `isAbortError(err)` 工具函数
3. 空catch 至少 `console.warn` 或移除

---

## 四、🟢 优化建议（锦上添花）

### P2-1：性能优化
- **Home.vue Canvas 动画**：星座网络动画持续运行 requestAnimationFrame，离开视口时应 pause
- **长列表虚拟滚动**：院校列表 55+ 条目，考虑 `vue-virtual-scroller`
- **ECharts 按需引入**：当前全量引入 echarts，应改为按需注册组件
- **图片懒加载**：院校详情页的图片可用 `loading="lazy"`

### P2-2：可访问性 (a11y)
- 部分交互元素缺少 `aria-label`（已有部分，但不完整）
- 键盘导航：Tab 导航、卡片点击需验证键盘可达
- 颜色对比度：部分灰色文字（如 `--color-text-tertiary`）需验证 WCAG AA

### P2-3：安全性加固
- [Materials.vue](src/views/Materials.vue) 使用 `editorRef.value.innerHTML` 读写内容 → XSS 风险点
- AIConfig.vue 的 API Key 安全（已知规则，需确保不在提交中出现真实 key）
- 建议 CSP meta 标签限制

### P2-4：组件库沉淀
以下模式已出现 ≥2 次，应提升为一等公民组件：
- `useToast` / `<ToastProvider>` — 替代各页内联实现
- `useFavorites` — 收藏功能统一
- `useTiltEffect` — 3D 卡片悬停效果
- `<EmptyState>` / `<LoadingState>` — 已存在但未被 UniversityDatabase 使用（自己写了一套 ud-empty）

---

## 五、重构路线图（按优先级排序）

### Phase 1：基础设施（预计改善开发体验 50%）
1. **提取路由模块** — `src/router/index.ts`，从 main.js 分离
2. **创建存储抽象层** — `src/composables/useStorage.ts`，统一 58 处 localStorage
3. **添加 .env 支持** — 环境变量管理
4. **清理 .bak 文件 + gitignore 更新**

### Phase 2：类型安全（预计减少 runtime bug 30%）
5. **创建数据类型定义** — `src/types/index.ts`（School, Major, AssessmentForm, AIProvider...）
6. **消灭 any** — 从 useAIRecommendation（18处）和 useAIStream（4处）开始
7. **数据文件 .ts 化** — schoolsData.js / majors.js 加类型注解
8. **开启 checkJs: true**

### Phase 3：组件拆分（预计提升可维护性 40%）
9. **拆分 UniversityDatabase.vue** — 2595行 → 容器 + 5个子组件
10. **拆分 Home.vue** — 提取 Hero / Features / Highlights / CTA 子组件
11. **提取公共 composable** — useFavorites / useTiltEffect / useToast
12. **消除重复代码** — Provider 加载、Prompt 文本等

### Phase 4：工程化完善（预计提升团队协作 30%）
13. **添加 Prettier 配置** + 格式化脚本
14. **添加 404 路由** + 路由守卫骨架
15. **清理 console 残留**（保留 _debug 条件的，删除直接的 console.error）
16. **样式审计** — 统一配色变量引用

### Phase 5：性能与体验（可选，看剩余时间）
17. Canvas 动画优化（Visibility API 控制）
18. ECharts 按需引入
19. a11y 审计与修复

---

## 六、风险提示

| 操作 | 风险等级 | 说明 |
|------|---------|------|
| 路由提取 | 🟢 低 | 纯移动，行为不变 |
| localStorage 统一 | 🟡 中 | 需逐一替换，可能影响存量用户数据（key 变化） |
| 组件拆分 | 🟡 中 | 大范围改动，需逐个页面回归测试 |
| 类型替换 any | 🟡 中 | 可能暴露现有隐式类型兼容问题 |
| 样式变量统一 | 🔴 高 | 视觉回归风险最大，需逐一比对截图 |

**建议执行顺序**：Phase 1 → Phase 2 → Phase 5(17-19 小优化) → Phase 3 → Phase 4
（Phase 4 样式审计放最后，因为视觉风险最高且非阻塞）
