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
    id: 'ann-001',
    title: 'v1.0 正式发布',
    content:
      `智途 AstroPath v1.0 正式提交科创节网页设计大赛！全部核心功能就绪：AI 智能选校、Multi-AI 对话系统、院校数据库、背景评估、时间规划、材料管理六大模块。${SCHOOL_COUNT_DISPLAY} 精选院校数据，覆盖 22 个国家、39 个热门专业。`,
    type: 'important',
    date: '2026-04-05 21:52',
    pinned: true,
  },
  {
    id: 'ann-002',
    title: 'AI 对话系统：Awwwards 级重构',
    content:
      'AI 智能对话模块完成设计美学重构：BEM 命名规范、fractalNoise 噪点纹理、分词逐字动画、ExpoOut 入场曲线、光晕反馈效果、毛玻璃导航栏。同时完善全局流式响应状态管理（useGlobalAIState）、流式通信封装（useAIStream）、Markdown 安全渲染。',
    type: 'feature',
    date: '2026-04-06 04:57',
    pinned: false,
  },
  {
    id: 'ann-003',
    title: 'Cloudflare Pages 部署上线',
    content:
      '项目完成 Cloudflare Pages 部署配置，支持自动 CI/CD 构建与全球 CDN 分发。同时修复类型检查问题，确保生产环境构建零错误通过。',
    type: 'update',
    date: '2026-04-05 22:34',
    pinned: false,
  },
  {
    id: 'ann-004',
    title: '可视化升级：雷达图 + 数字动画',
    content:
      '背景评估模块新增六维竞争力雷达图组件（基于 ECharts），直观展示学术、语言、实践等维度优势；数字动画组件让关键指标以动态方式呈现，提升数据阅读体验与专业感。',
    type: 'feature',
    date: '2026-04-04 08:04',
    pinned: false,
  },
  {
    id: 'ann-005',
    title: '全站 33 个功能模块开发完成',
    content:
      '经过密集开发周期，智途 AstroPath 全部 33 个功能块（F001–F033）实现并验证完毕：首页导航、AI 配置管理、多 Provider 切换、用户背景采集、评估结果生成、选校推荐引擎、院校数据库、时间线规划、材料清单管理、AI 对话系统等核心链路全线贯通。',
    type: 'update',
    date: '2026-03-24 19:07',
    pinned: false,
  },
  {
    id: 'ann-006',
    title: '项目启动：智途 AstroPath 诞生',
    content:
      '智途 AstroPath 项目正式立项启动。完成产品规划，定义 33 个核心功能点，涵盖留学规划全流程：从背景评估 → AI 选校推荐 → 时间线规划 → 材料准备 → 院校数据库 → AI 智能问答，打造一站式智能留学规划平台。',
    type: 'update',
    date: '2026-03-23 20:30',
    pinned: false,
  },
]
