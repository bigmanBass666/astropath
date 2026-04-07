/**
 * Story 页面数据
 * 包含时间线、统计数据、技术亮点等内容
 */

// 时间线节点数据
export interface TimelineNode {
  id: number
  date: string
  title: string
  description: string
  details: string[]
  icon: string
}

export const timelineNodes: TimelineNode[] = [
  {
    id: 1,
    date: '2025年2月',
    title: '项目启动',
    description: '比赛催生的一次技术实践',
    details: [
      '人工智能学院第四届科创节网页设计大赛的契机',
      '决定以留学规划为主题，打造一个完整的Web应用',
      '确立了"AI驱动、数据支撑、体验优先"的核心方向'
    ],
    icon: 'Sparkles'
  },
  {
    id: 2,
    date: '2025年2月',
    title: '技术选型',
    description: '选择最适合的航行器',
    details: [
      '前端框架：Vue 3 + Composition API，拥抱响应式编程',
      '构建工具：Vite，极速的开发体验',
      'UI组件库：Element Plus，稳定可靠的企业级组件',
      '状态管理：Pinia，简洁高效的全局状态方案'
    ],
    icon: 'Tools'
  },
  {
    id: 3,
    date: '2025年3月',
    title: '核心功能开发',
    description: '构建五大核心模块',
    details: [
      '背景评估：AI智能解析，生成专属竞争力报告',
      'AI选校：多维度匹配算法，精准推荐院校',
      '时间规划：可视化时间轴，科学规划申请节奏',
      '材料中心：智能文书辅助，提升申请材料质量',
      'AI对话：多角色智能体，7×24小时答疑解惑'
    ],
    icon: 'Code'
  },
  {
    id: 4,
    date: '2025年3月',
    title: '设计迭代',
    description: '从可用到卓越',
    details: [
      '初稿：功能优先，快速验证核心流程',
      '迭代：引入Awwwards级设计标准',
      '打磨：全屏沉浸式体验，设计与功能有机融合',
      '定稿：Slate-900 + Amber-600配色，极致克制美学'
    ],
    icon: 'Palette'
  },
  {
    id: 5,
    date: '2025年4月',
    title: '比赛准备',
    description: '最后的冲刺',
    details: [
      '撰写答辩稿，提炼项目核心价值',
      '设计演示流程，确保每一个环节流畅',
      '最终优化：性能调优、细节打磨、Bug修复',
      '模拟答辩，反复演练，力求完美呈现'
    ],
    icon: 'Target'
  },
  {
    id: 6,
    date: '2026年4月7日',
    title: '比赛日',
    description: '展示与等待',
    details: [
      '人工智能学院第四届科创节网页设计大赛',
      '上台展示，讲述智途的故事',
      '等待评委的评判与结果',
      '无论结果如何，这都是一次完整的自我证明'
    ],
    icon: 'Trophy'
  }
]

// 统计数据
export interface ProjectStats {
  code: {
    lines: number
    files: number
    components: number
  }
  git: {
    commits: number
    days: number
    mostActiveDate: string
  }
  content: {
    schools: number
    majors: number
    aiAgents: number
  }
}

export const projectStats: ProjectStats = {
  code: {
    lines: 14985,
    files: 73,
    components: 24
  },
  git: {
    commits: 214,
    days: 15,
    mostActiveDate: '2026-03-25'
  },
  content: {
    schools: 101,
    majors: 50,
    aiAgents: 5
  }
}

// 技术亮点
export interface TechHighlight {
  id: number
  title: string
  description: string
  tags: string[]
}

export const techHighlights: TechHighlight[] = [
  {
    id: 1,
    title: 'AI流式响应架构',
    description: '基于SSE的实时流式响应，支持思考模式与队列管理，让AI对话如丝般顺滑。',
    tags: ['SSE', 'Stream', 'Queue']
  },
  {
    id: 2,
    title: '多Provider AI配置',
    description: '灵活配置多个AI服务提供商，支持智谱、OpenAI等，一键切换，无缝衔接。',
    tags: ['Multi-Provider', 'Config', 'API']
  },
  {
    id: 3,
    title: 'Composable状态管理',
    description: '采用Vue 3 Composition API设计模式，状态逻辑复用，代码清晰可维护。',
    tags: ['Vue3', 'Composition', 'State']
  },
  {
    id: 4,
    title: '氛围分级设计系统',
    description: '从专注到沉浸，三级氛围模式适配不同使用场景，打造极致用户体验。',
    tags: ['Design', 'UX', 'Theme']
  },
  {
    id: 5,
    title: '响应式布局适配',
    description: '从桌面到移动端，全平台完美适配，随时随地规划留学之路。',
    tags: ['Responsive', 'Mobile', 'Layout']
  }
]

// 致谢内容
export const acknowledgments = {
  openSource: [
    'Vue.js 团队 - 渐进式JavaScript框架',
    'Element Plus 团队 - 优秀的Vue 3组件库',
    'Vite 团队 - 下一代前端构建工具',
    'GSAP 团队 - 专业级Web动画库'
  ],
  inspiration: [
    'Awwwards - 网页设计灵感源泉',
    'Dribbble - 设计师创意社区',
    'GitHub - 开源代码托管平台'
  ]
}

// 开发者感言
export const closingWords = {
  title: '这不是结束',
  subtitle: '而是一次完整的自我证明',
  content: `这不仅仅是一个比赛项目，而是一次完整的自我证明。

每一行代码都承载着对技术的敬畏，每一次迭代都代表着对完美的追求。

从最初的想法到最终的呈现，智途 AstroPath 见证了无数个深夜的调试、无数次设计的推翻重来、无数个细节的反复打磨。

感谢这段旅程中的每一次挑战，它们让我们成长。
感谢这段旅程中的每一次坚持，它们让我们强大。

无论比赛结果如何，这都已经是一次胜利——
因为我们完成了对自己的承诺。`,
  signature: '智途 AstroPath 开发团队'
}
