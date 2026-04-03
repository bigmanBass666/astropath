# 选校推荐页面重构文档

## 项目背景

当前选校页面采用传统算法驱动模式（筛选-列表-分类），需要重构为AI驱动的对话式交互体验。

## 核心转变

| 维度 | 旧模式（算法驱动） | 新模式（AI驱动） |
|------|------------------|----------------|
| 交互方式 | 用户手动筛选条件 | AI询问用户需求 |
| 结果展示 | 一次性展示所有结果 | 分步骤、对话式推荐 |
| 匹配逻辑 | 静态匹配分数 | AI解释为什么推荐 |
| 决策辅助 | 用户自己对比决策 | AI帮助分析利弊 |
| 分类方式 | 冲刺/匹配/保底 | AI优先级排序 |

## 用户确认的设计方案

- **交互形式**: 混合式（先对话了解需求，再展示结果）
- **推荐展示**: AI优先级排序（不按传统分类）
- **AI参与度**: 全程AI陪伴 + 深度分析（可追问，每所学校有AI详细分析）

## 页面流程设计

### Step 1: AI对话收集偏好

```
┌─────────────────────────────────────────────────────────┐
│  🤖 AI选校助手                                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  "你好！我是你的专属选校顾问。我已经了解了你的背景       │
│   （从background assessment获取）                       │
│   为了给你最合适的推荐，请告诉我："                      │
│                                                         │
│  ① "你目前最看重什么？（可多选）"                        │
│     [学校排名] [专业实力] [就业前景] [地理位置] [学费预算] │
│                                                         │
│  ② "有想避开的国家/地区吗？"                             │
│     [无] [美国] [英国] [澳洲] [其他...]                   │
│                                                         │
│  ③ "还有什么特别的要求吗？"（选填）                       │
│     [输入框]                                             │
│                                                         │
│              [开始智能推荐]                               │
└─────────────────────────────────────────────────────────┘
```

**数据收集字段：**
- `priorities`: string[] - 用户看重的维度
- `excludedCountries`: string[] - 想避开的国家
- `specialRequirements`: string - 特殊要求描述

### Step 2: AI推荐结果展示

```
┌─────────────────────────────────────────────────────────┐
│  🤖 "基于你的背景和需求，我为你精选了N所学校..."          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🥇 核心推荐 #1: [学校名称]                        │   │
│  │    AI推荐理由（2-3句话概括）                      │   │
│  │    [查看详情] [为什么推荐这所?] [收藏]            │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🥈 核心推荐 #2: [学校名称]                        │   │
│  │    AI推荐理由                                    │   │
│  │    [查看详情] [为什么推荐这所?] [收藏]            │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🥉 备选方案: [学校名称] ...                       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [💬 告诉AI调整方向]  [🔄 重新填写偏好]                   │
└─────────────────────────────────────────────────────────┘
```

**关键功能：**
- 学校按AI认为的最适合程度排序
- 每个学校卡片显示AI生成的推荐理由摘要
- "为什么推荐这所"按钮触发深度分析
- 支持实时对话调整（"我想去加州的学校"）

### Step 3: 深度分析对话

```
点击"为什么推荐这所"后：

🤖 "为什么推荐[学校名称]？"

"我推荐这所学校基于以下几点：

✅ 匹配点：
   • 你的GPA x.x达到了该校录取者平均水平
   • xxx背景符合该校偏好
   • xxx经历体现了你的潜力

⚠️ 风险提示：
   • 录取率仅x%，需要做好保底准备
   • 建议再提升xxx

📋 申请建议：
   • 重点突出你的xxx经历
   • 推荐信要找xxx
   • 文书要体现xxx"

[还有疑问? 继续追问...]
```

## 技术实现要点

### 1. 数据结构

```typescript
// 用户偏好
interface UserPreference {
  priorities: ('ranking' | 'major' | 'career' | 'location' | 'cost')[]
  excludedCountries: string[]
  specialRequirements: string
}

// AI推荐结果
interface AIRecommendation {
  schoolId: number
  schoolName: string
  aiReason: string // AI生成的推荐理由摘要
  matchScore: number // AI评估的匹配度
  ranking: number // 在推荐列表中的排序
  category: 'core' | 'alternative' // 核心推荐或备选
}

// 深度分析
interface SchoolAnalysis {
  schoolId: number
  matchPoints: string[] // 匹配点
  risks: string[] // 风险提示
  suggestions: string[] // 申请建议
  admissionProbability: string // 录取概率评估
}
```

### 2. AI Prompt设计

**Prompt 1: 生成推荐列表**
```
你是一位资深留学顾问。基于以下信息，为用户推荐最适合的学校：

【用户背景】
- GPA: x.x
- 院校: xxx
- 专业: xxx
- 科研/实习经历: xxx

【用户偏好】
- 最看重: xxx
- 避开国家: xxx
- 特殊要求: xxx

【学校数据库】
（提供所有学校数据）

请输出JSON格式：
{
  "recommendations": [
    {
      "schoolId": 1,
      "ranking": 1,
      "category": "core",
      "aiReason": "推荐理由摘要（2-3句话）",
      "matchScore": 85
    }
  ],
  "summary": "整体推荐策略说明"
}
```

**Prompt 2: 深度分析某所学校**
```
基于用户背景和[学校名称]的信息，生成详细分析：

输出JSON格式：
{
  "matchPoints": ["匹配点1", "匹配点2"...],
  "risks": ["风险1", "风险2"...],
  "suggestions": ["建议1", "建议2"...],
  "admissionProbability": "录取概率评估（如：中等偏上）"
}
```

**Prompt 3: 对话式调整**
```
用户说："[用户输入，如'我想去加州的学校']"

当前推荐列表：[当前列表]

请根据用户反馈，调整推荐列表并说明调整原因。
```

### 3. 组件结构

```
SchoolRecommendation.vue (主页面)
├── components/
│   ├── PreferenceCollector.vue (Step 1: 偏好收集)
│   ├── RecommendationList.vue (Step 2: 推荐列表)
│   ├── SchoolCard.vue (学校卡片)
│   ├── SchoolAnalysisDialog.vue (Step 3: 深度分析)
│   └── ChatInput.vue (对话输入框)
├── composables/
│   └── useAIRecommendation.ts (AI推荐逻辑)
└── types/
    └── recommendation.ts (类型定义)
```

### 4. 关键交互逻辑

```typescript
// 状态管理
const state = reactive({
  step: 'preference' | 'recommendation' | 'analysis',
  userPreference: UserPreference | null,
  recommendations: AIRecommendation[],
  selectedSchool: School | null,
  analysis: SchoolAnalysis | null,
  chatHistory: ChatMessage[]
})

// 流程
1. 用户填写偏好 → 调用AI生成推荐列表 → 显示Step 2
2. 用户点击"为什么推荐" → 调用AI生成分析 → 显示对话框
3. 用户输入调整需求 → 调用AI重新生成 → 更新列表
```

## 需要保留的功能

1. **收藏功能** - 用户可收藏感兴趣的学校
2. **查看详情** - 跳转学校详情页
3. **对比功能** - 可选中多所学校对比

## 需要移除的功能

1. 传统筛选器（国家、专业、排名范围等）
2. 排序选择器
3. 冲刺/匹配/保底分类标签
4. "开始推荐"按钮的算法计算过程

## 文件变更计划

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/views/SchoolRecommendation.vue` | 重写 | 新交互流程 |
| `src/utils/recommendationEngine.js` | 保留 | 学校数据和相关函数 |
| `src/utils/ai-api.js` | 复用 | AI调用接口已存在 |

## 开发检查清单

- [ ] PreferenceCollector组件实现
- [ ] RecommendationList组件实现
- [ ] SchoolCard组件实现
- [ ] SchoolAnalysisDialog组件实现
- [ ] AI Prompt编写和测试
- [ ] 对话式调整功能实现
- [ ] 收藏功能迁移
- [ ] 响应式布局适配
- [ ] 加载状态处理
- [ ] 错误状态处理
