export interface Announcement {
  id: string
  title: string
  content: string
  type: 'update' | 'feature' | 'important'
  date: string
  pinned: boolean
}

const SCHOOL_COUNT_DISPLAY = '100+'

export const announcements: Announcement[] = [
  {
    id: 'ann-final',
    title: '🏁 比赛圆满落幕，项目正式归档',
    content:
      '感谢各位评审与观众的关注！智途 AstroPath 已顺利完成科创节网页设计大赛全部展示与评审环节，即日起正式停止维护。本项目所有代码与设计已归档，不再进行新功能开发。如有需要，欢迎参考项目架构与设计思路。',
    type: 'important',
    date: '2026-04-07 21:07',
    pinned: true,
  },
  {
    id: 'ann-007',
    title: 'v2.1 动态波纹网格 Hero 背景',
    content:
      '院校数据库页面全新升级 Canvas 动画效果：60px 网格系统 + 正弦波纹起伏，鼠标交互产生涟漪波纹效果，鼠标附近网格点有脉冲光点。与 Assessment 页面粒子效果形成差异化设计，为用户提供沉浸式浏览体验。',
    type: 'feature',
    date: '2026-04-07 18:26',
    pinned: true,
  },
  {
    id: 'ann-006',
    title: 'v2.0 Awwwards 级沉浸式评估重设计',
    content:
      '背景评估页面完成里程碑式重构：5 场景沉浸式架构（Hero/Identity/Academics/Experience/Report）、Canvas 粒子背景与鼠标交互、磁吸按钮与 Stagger 动画、非对称布局设计、可折叠 AI 面板与 FAB 悬浮按钮。严格遵循 Slate-900 + Amber-600 配色规范。',
    type: 'feature',
    date: '2026-04-07 11:26',
    pinned: true,
  },
  {
    id: 'ann-005',
    title: 'v1.5 架构重构：组件拆分 + 类型安全',
    content:
      'Phase 3 重构完成！提取 useDatabaseState.ts composable，UniversityDatabase.vue script 279行→67行（减少 76%）。useAIRecommendation.ts 消灭 18 处 any 类型，useAIStream.ts 新增 StreamMessage/GenerateOptions 接口。typecheck 0 error，lint 无新增 error。',
    type: 'update',
    date: '2026-04-06 07:33',
    pinned: false,
  },
  {
    id: 'ann-004',
    title: 'v1.0 正式发布',
    content:
      `智途 AstroPath v1.0 正式提交科创节网页设计大赛！全部核心功能就绪：AI 智能选校、Multi-AI 对话系统、院校数据库、背景评估、时间规划、材料管理六大模块。${SCHOOL_COUNT_DISPLAY} 精选院校数据，覆盖 22 个国家、39 个热门专业。`,
    type: 'important',
    date: '2026-04-05 21:52',
    pinned: false,
  },
  {
    id: 'ann-003',
    title: '可视化升级：雷达图 + 数字动画',
    content:
      '背景评估模块新增六维竞争力雷达图组件（基于 ECharts），直观展示学术、语言、实践等维度优势；数字动画组件让关键指标以动态方式呈现，提升数据阅读体验与专业感。',
    type: 'feature',
    date: '2026-04-04 08:04',
    pinned: false,
  },
  {
    id: 'ann-002',
    title: '项目启动：智途 AstroPath 诞生',
    content:
      '智途 AstroPath 项目正式立项启动。完成产品规划，定义 33 个核心功能点，涵盖留学规划全流程：从背景评估 → AI 选校推荐 → 时间线规划 → 材料准备 → 院校数据库 → AI 智能问答，打造一站式智能留学规划平台。',
    type: 'update',
    date: '2026-03-23 20:30',
    pinned: false,
  },
]
