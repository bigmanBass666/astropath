<template>
  <div class="materials-page">
    <h2 class="page-title">申请材料中心</h2>

    <!-- 选项卡 -->
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="文书助手" name="essay">
        <!-- 文书类型选择界面 -->
        <div v-if="!selectedEssayType" class="essay-type-selection">
          <h3 class="section-title">选择文书类型</h3>
          <div class="essay-types-grid">
            <div
              v-for="type in essayTypes"
              :key="type.value"
              class="essay-type-card"
              @click="selectEssayType(type.value)"
            >
              <div class="card-icon">{{ type.icon }}</div>
              <h4>{{ type.label }}</h4>
              <p>{{ type.description }}</p>
            </div>
          </div>
        </div>

        <!-- 模板选择界面 -->
        <div v-else-if="!selectedTemplate" class="template-selection">
          <div class="template-header">
            <el-button @click="selectedEssayType = null" type="text" size="small">
              ← 返回文书类型选择
            </el-button>
            <h3>{{ getEssayTypeLabel(selectedEssayType) }} - 选择模板</h3>
          </div>

          <!-- 核心要点提示 -->
          <el-alert
            v-if="essayKeyPoints[selectedEssayType]"
            :title="'核心要点提示'"
            :type="'info'"
            :closable="false"
            show-icon
            class="key-points-alert"
          >
            <template #default>
              <ul class="key-points-list">
                <li v-for="(point, index) in essayKeyPoints[selectedEssayType]" :key="index">
                  {{ point }}
                </li>
              </ul>
            </template>
          </el-alert>

          <div class="templates-grid">
            <div
              v-for="template in getTemplatesForType(selectedEssayType)"
              :key="template.id"
              class="template-card"
              @click="selectTemplate(template)"
            >
              <div class="template-name">{{ template.name }}</div>
              <div class="template-desc">{{ template.description }}</div>
              <div class="template-actions">
                <el-button type="primary" size="small">使用此模板</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 文书编辑器 -->
        <div v-else class="essay-editor">
          <div class="editor-header">
            <el-button @click="backToTemplates" type="text" size="small">
              ← 返回模板选择
            </el-button>
            <span class="current-essay-info">
              {{ getEssayTypeLabel(selectedEssayType) }} - {{ selectedTemplate.name }}
            </span>
          </div>

          <div class="editor-toolbar">
            <el-button-group>
              <el-button size="small" @click="backToTemplates">← 返回</el-button>
            </el-button-group>
            <span class="essay-type-badge">
              {{ getEssayTypeLabel(selectedEssayType) }} | {{ selectedTemplate?.name }}
            </span>
            <el-select v-model="currentEssayType" placeholder="选择文书类型" style="width: 150px;">
              <el-option label="个人陈述" value="ps" />
              <el-option label="简历" value="cv" />
              <el-option label="推荐信" value="reference" />
              <el-option label="研究计划" value="research" />
            </el-select>
            <el-select v-model="selectedProvider" placeholder="选择AI提供商" style="width: 150px;">
              <el-option v-for="p in providers" :key="p.id" :label="p.name" :value="p.id" />
            </el-select>
            <el-button-group>
              <el-button size="small" @click="formatDoc('bold')">加粗</el-button>
              <el-button size="small" @click="formatDoc('italic')">斜体</el-button>
              <el-button size="small" @click="formatDoc('h2')">标题</el-button>
              <el-button size="small" @click="formatDoc('list')">列表</el-button>
            </el-button-group>
            <el-button size="small" type="primary" @click="saveVersion">保存版本</el-button>
            <el-button size="small" @click="showVersions">历史版本</el-button>
            <el-button size="small" type="success" @click="exportPDF">导出PDF</el-button>
          </div>

          <!-- AI辅助区域 -->
          <div class="ai-assistant">
            <div class="ai-input-row">
              <el-input
                v-model="aiPrompt"
                type="textarea"
                :rows="2"
                placeholder="输入AI指令，如：帮我扩写第一段，突出科研经历"
                :disabled="isGenerating"
              />
              <el-button
                type="primary"
                @click="generateWithAI"
                :loading="isGenerating"
                style="margin-left: 10px;"
              >
                {{ isGenerating ? '生成中...' : 'AI生成' }}
              </el-button>
            </div>
          </div>

          <div class="editor-content">
            <textarea v-model="essayContent" placeholder="在此编辑文书内容，可以使用AI生成辅助..."></textarea>
          </div>
          <div class="word-count">
            字数统计: {{ essayContent.length }} | 预计阅读时间: {{ Math.ceil(essayContent.length / 400) }}分钟
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="材料清单" name="checklist">
        <div class="checklist-page">
          <el-card class="progress-card">
            <div class="progress-header">
              <h3>材料准备进度</h3>
              <el-progress :percentage="completionRate" :color="progressColor" />
            </div>
          </el-card>

          <el-card class="checklist-card">
            <div class="checklist-actions">
              <el-button type="primary" @click="exportCSV">导出清单</el-button>
              <el-button @click="generateReport">生成检查报告</el-button>
              <el-button @click="resetChecklist">重置</el-button>
            </div>

            <el-collapse v-model="activeCategory">
              <el-collapse-item v-for="category in categories" :key="category.id"
                :name="category.id" :title="category.name">
                <el-table :data="getCategoryItems(category.id)" style="width: 100%">
                  <el-table-column width="60">
                    <template #default="{ row }">
                      <el-checkbox v-model="row.completed" @change="updateProgress" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="材料名称" />
                  <el-table-column prop="note" label="备注" />
                  <el-table-column label="操作" width="100">
                    <template #default="{ row, $index }">
                      <el-button size="small" type="text" @click="editItem(category.id, $index)">编辑</el-button>
                      <el-button size="small" type="text" @click="removeItem(category.id, $index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </el-card>

          <el-button class="add-custom-btn" type="primary" plain @click="addCustomItem">
            <el-icon><Plus /></el-icon>
            添加自定义材料
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加自定义材料对话框 -->
    <el-dialog v-model="itemDialogVisible" title="添加自定义材料" width="400px">
      <el-form :model="newItem" label-width="80px">
        <el-form-item label="材料名称">
          <el-input v-model="newItem.name" placeholder="如：作品集" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="newItem.note" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="itemDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddItem">添加</el-button>
      </template>
    </el-dialog>

    <!-- 历史版本对话框 -->
    <el-dialog v-model="versionsVisible" title="文书历史版本" width="600px">
      <el-table :data="versions" style="width: 100%">
        <el-table-column prop="date" label="保存时间" width="180" />
        <el-table-column prop="note" label="版本备注" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" type="primary" text @click="previewVersion(row)">预览</el-button>
            <el-button size="small" type="success" text @click="restoreVersion(row)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getProviders, sendMessageToAI } from '@/utils/ai-api'

const activeTab = ref('essay')
const currentEssayType = ref('ps')
const essayContent = ref('')
const itemDialogVisible = ref(false)
const versionsVisible = ref(false)
const activeCategory = ref(['required'])
const selectedProvider = ref(null)
const aiPrompt = ref('')
const isGenerating = ref(false)

// 新增：文书类型选择状态
const selectedEssayType = ref(null)
const selectedTemplate = ref(null)

// 文书类型定义
const essayTypes = [
  {
    value: 'ps',
    label: '个人陈述',
    description: '阐述你的学术背景、研究兴趣和职业目标',
    icon: '📝'
  },
  {
    value: 'cv',
    label: '简历',
    description: '展示你的教育背景、工作经历和技能成就',
    icon: '📄'
  },
  {
    value: 'reference',
    label: '推荐信',
    description: '由推荐人撰写，评价你的能力和潜力',
    icon: '✉️'
  },
  {
    value: 'research',
    label: '研究计划',
    description: '描述你的研究方向和计划 (适用于研究型学位)',
    icon: '🔬'
  }
]

// 模板数据
const essayTemplates = {
  ps: [
    {
      id: 'ps-basic',
      name: '标准个人陈述模板',
      description: '包含引言、学术背景、研究经历、职业目标、结语',
      content: `个人陈述

引言：
（在此处简要介绍自己，说明申请的专业和学校）

学术背景：
（描述你的本科/研究生学习经历，重点课程和成绩）

研究经历：
（列举参与的研究项目，你的角色和贡献）

职业目标：
（说明短期和长期职业规划）

为什么选择该项目：
（阐述你对学校/项目的了解和选择理由）

结语：
（总结并表达热情）
`
    },
    {
      id: 'ps-scholarship',
      name: '奖学金申请专用',
      description: '强调学术成就和领导力，适合申请全额奖学金',
      content: `个人陈述 - 奖学金申请

尊敬的评审委员会：

作为一名追求卓越的学生，我怀着对[专业领域]的深厚热情申请[学校]的[专业]项目，并恳请获得奖学金支持。

学术成就：
（详细列出GPA、排名、重要奖项等）

领导力与社会服务：
（描述学生工作、志愿者经历、社会影响）

研究潜力：
（展示已发表论文、研究项目、创新能力）

未来贡献：
（说明你将如何回馈学术社区）

结语：
`
    }
  ],
  cv: [
    {
      id: 'cv-basic',
      name: '标准简历模板',
      description: '清晰的一页简历格式，适合大部分申请',
      content: `简历

个人信息
姓名：[你的姓名]
邮箱：[你的邮箱]
电话：[你的电话]
地址：[你的地址]

教育背景
[学校名称] | [学位] | [时间范围]
- 专业：[专业名称]
- GPA：[GPA] / 排名：[排名]
- 相关课程：[课程1], [课程2], [课程3]

工作/实习经历
[公司/机构] | [职位] | [时间范围]
- 职责和成就描述
- 使用STAR原则展现能力

项目经历
[项目名称] | [时间范围]
- 项目描述
- 你的角色
- 技术栈/方法
- 成果

技能
- 语言：[英语等]
- 技术：[编程语言、软件等]
- 证书：[相关证书]

荣誉奖项
- [奖项名称] | [颁发机构] | [时间]
`
    }
  ],
  reference: [
    {
      id: 'ref-academic',
      name: '学术推荐信模板',
      description: '由教授撰写，侧重学术能力和研究潜力',
      content: `推荐信

尊敬的招生委员会：

作为[学校名称]的[教授职位]，我荣幸地推荐我的学生[学生姓名]申请贵校[专业名称]项目。

我与该生的认识时间：________
我指导该生的课程/项目：________

学术表现：
- 课程表现：________
- 研究能力：________
- 创新思维：________

个人品质：
- 学习态度：________
- 团队合作：________
- 领导力：________

推荐程度：
我毫无保留地推荐该生加入贵校项目，相信他能做出重要贡献。

如有任何疑问，请随时与我联系。

此致
敬礼

[推荐人姓名]
[职位]
[学校]
[联系方式]
`
    }
  ],
  research: [
    {
      id: 'rp-basic',
      name: '标准研究计划模板',
      description: '适合PhD申请的研究计划框架',
      content: `研究计划

标题：[研究课题名称]

摘要（约300字）：
- 研究问题
- 研究方法
- 预期成果

1. 研究背景与问题
- 领域现状
- 待解决的关键问题
- 研究意义

2. 文献综述
- 关键文献梳理
- 研究空白
- 本研究定位

3. 研究目标与问题
- 主要研究问题
- 子问题
- 研究假设

4. 研究方法
- 研究设计
- 数据收集
- 分析方法

5. 预期成果
- 学术贡献
- 实践价值
- 可能的创新点

6. 时间规划
- 第一年：________
- 第二年：________
- 第三年：________

参考文献：
`
    }
  ]
}

// 核心要点提示（基于申请专业）
const essayKeyPoints = {
  ps: [
    '突出你的独特性和与专业的匹配度',
    '用具体事例支撑你的能力阐述',
    '展现你对专业的热情和理解',
    '说明为什么选择这所学校/这个项目',
    '保持真诚，避免过度包装',
    '字数控制在500-800词（英国）或650词以内（美国）'
  ],
  cv: [
    '保持在一页以内（除非经历丰富）',
    '使用清晰的排版和一致的格式',
    '按时间倒序排列经历',
    '使用动词开头描述职责',
    '量化成果（如"提高20%"）',
    '针对不同项目定制简历内容'
  ],
  reference: [
    '推荐人应熟悉你的学术或工作表现',
    '选择能评价你核心能力的推荐人',
    '提供推荐人所需材料（简历、PS等）',
    '提前2-3个月礼貌请求',
    '提醒推荐人截止日期',
    '推荐信内容应与PS相互呼应'
  ],
  research: [
    '选择你真正感兴趣且有基础的领域',
    '研究问题应明确、可行',
    '充分展示对相关文献的了解',
    '方法论描述应具体可行',
    '与目标导师研究方向匹配',
    '体现你对该领域的深入思考'
  ]
}

const newItem = reactive({
  name: '',
  note: '',
  category: 'required'
})

// 加载AI提供商
const providers = computed(() => {
  const saved = localStorage.getItem('ai_providers')
  return saved ? JSON.parse(saved) : []
})

// 初始化默认provider
onMounted(() => {
  const saved = localStorage.getItem('ai_providers')
  if (saved) {
    const parsed = JSON.parse(saved)
    if (parsed.length > 0) {
      selectedProvider.value = parsed[0].id
    }
  }
})

// 获取文书类型标签
const getEssayTypeLabel = (type) => {
  const found = essayTypes.find(t => t.value === type)
  return found ? found.label : '文书'
}

// 获取指定类型的模板
const getTemplatesForType = (type) => {
  return essayTemplates[type] || []
}

// 选择文书类型
const selectEssayType = (type) => {
  selectedEssayType.value = type
  // 重置模板选择
  selectedTemplate.value = null
}

// 选择模板
const selectTemplate = (template) => {
  selectedTemplate.value = template
  // 加载模板内容到编辑器
  essayContent.value = template.content
}

// 返回模板选择
const backToTemplates = () => {
  selectedTemplate.value = null
}

// 完成后返回模板选择
const finishWithEssay = () => {
  // 保存当前文书到历史版本
  saveVersion()
  selectedTemplate.value = null
}

const categories = ref([
  { id: 'required', name: '必需材料' },
  { id: 'recommended', name: '推荐材料' },
  { id: 'optional', name: '可选材料' }
])

const allItems = ref({
  required: [
    { name: '本科成绩单（中英文）', completed: false, note: '' },
    { name: '学位证明（中英文）', completed: false, note: '' },
    { name: '语言成绩单', completed: false, note: '雅思/托福成绩' },
    { name: '个人陈述(PS)', completed: false, note: '' },
    { name: '简历(CV)', completed: false, note: '' },
    { name: '推荐信(2-3封)', completed: false, note: '' }
  ],
  recommended: [
    { name: '研究计划(RP)', completed: false, note: '申请研究型学位需要' },
    { name: '作品集', completed: false, note: '设计/建筑/艺术类' },
    { name: 'Writing Sample', completed: false, note: '人文社科类' },
    { name: 'GRE/GMAT成绩', completed: false, note: '部分学校要求' }
  ],
  optional: [
    { name: '竞赛获奖证书', completed: false, note: '' },
    { name: '实习证明', completed: false, note: '' },
    { name: '志愿者服务证明', completed: false, note: '' },
    { name: '专利/论文发表', completed: false, note: '' }
  ]
})

const versions = ref([
  { date: '2025-01-10 14:30', note: '初稿', content: '' },
  { date: '2025-01-12 10:20', note: '修改版', content: '' }
])

const completionRate = computed(() => {
  const all = Object.values(allItems.value).flat()
  const completed = all.filter(i => i.completed).length
  return Math.round((completed / all.length) * 100)
})

const progressColor = computed(() => {
  const rate = completionRate.value
  if (rate >= 80) return '#67c23a'
  if (rate >= 50) return '#e6a23c'
  return '#f56c6c'
})

const getCategoryItems = (catId) => {
  return allItems.value[catId] || []
}

const updateProgress = () => {
  console.log('Progress updated:', completionRate.value)
}

const addCustomItem = () => {
  newItem.category = activeCategory.value[0] || 'required'
  itemDialogVisible.value = true
}

const confirmAddItem = () => {
  if (!newItem.name) {
    ElMessage.warning('请输入材料名称')
    return
  }
  allItems.value[newItem.category].push({
    name: newItem.name,
    completed: false,
    note: newItem.note
  })
  ElMessage.success('已添加')
  itemDialogVisible.value = false
  Object.assign(newItem, { name: '', note: '', category: 'required' })
}

const editItem = (categoryId, index) => {
  const item = allItems.value[categoryId][index]
  ElMessage.info(`编辑: ${item.name}`)
  // 实际实现需要编辑对话框
}

const removeItem = (categoryId, index) => {
  allItems.value[categoryId].splice(index, 1)
  ElMessage.success('已删除')
}

const formatDoc = (format) => {
  if (format === 'bold') {
    essayContent.value = `**${essayContent.value}**`
  } else if (format === 'italic') {
    essayContent.value = `*${essayContent.value}*`
  } else if (format === 'h2') {
    essayContent.value = `## ${essayContent.value}`
  } else if (format === 'list') {
    essayContent.value = essayContent.value.split('\n').map(l => `- ${l}`).join('\n')
  }
}

const saveVersion = () => {
  versions.value.unshift({
    date: new Date().toLocaleString('zh-CN'),
    note: `版本 ${versions.value.length + 1}`,
    content: essayContent.value
  })
  ElMessage.success('版本已保存')
}

// AI生成文书内容
const generateWithAI = async () => {
  if (!selectedProvider.value) {
    ElMessage.warning('请先配置AI提供商')
    return
  }

  if (!aiPrompt.value.trim()) {
    ElMessage.warning('请输入AI指令')
    return
  }

  const currentContent = essayContent.value
  isGenerating.value = true

  try {
    const systemPrompt = `你是一位文书写作导师，帮助用户改进和润色留学申请文书。
根据用户的指令和当前文书内容，提供具体的修改建议或直接生成内容。
用户当前的文书类型：${getEssayTypeName(currentEssayType.value)}`

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `当前文书内容：\n${currentContent || '(空)'}\n\n我的指令：${aiPrompt.value}` }
    ]

    const response = await sendMessageToAI(selectedProvider.value, messages, {
      temperature: 0.7,
      maxTokens: 1500
    })

    essayContent.value = response.content
    aiPrompt.value = ''
    ElMessage.success('AI生成完成')
  } catch (error) {
    ElMessage.error(`生成失败: ${error.message}`)
  } finally {
    isGenerating.value = false
  }
}

const getEssayTypeName = (type) => {
  const names = {
    ps: '个人陈述',
    cv: '简历',
    reference: '推荐信',
    research: '研究计划'
  }
  return names[type] || '文书'
}

const showVersions = () => {
  versionsVisible.value = true
}

const previewVersion = (version) => {
  essayContent.value = version.content
  versionsVisible.value = false
  ElMessage.success('已加载历史版本')
}

const restoreVersion = (version) => {
  essayContent.value = version.content
  versionsVisible.value = false
  ElMessage.success('已恢复到此版本')
}

const exportPDF = () => {
  ElMessage.info('导出PDF功能（需要后端支持或jsPDF库）')
}

const exportCSV = () => {
  ElMessage.info('导出CSV功能')
}

const generateReport = () => {
  const total = Object.values(allItems.value).flat().length
  const completed = completionRate.value
  ElMessage.success(`您已完成 ${completed}% 的材料准备 (${Math.round(total * completed / 100)}/${total})`)
}

const resetChecklist = () => {
  Object.keys(allItems.value).forEach(cat => {
    allItems.value[cat].forEach(item => {
      item.completed = false
    })
  })
  ElMessage.success('清单已重置')
}

onMounted(() => {
  const savedEssays = localStorage.getItem('essay_versions')
  if (savedEssays) {
    versions.value = JSON.parse(savedEssays)
  }
  const savedChecklist = localStorage.getItem('materials_checklist')
  if (savedChecklist) {
    Object.assign(allItems.value, JSON.parse(savedChecklist))
  }
})
</script>

<style scoped>
.materials-page {
  max-width: 1000px;
  margin: 0 auto;
}

.editor-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.editor-content {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  min-height: 400px;
}

.editor-content textarea {
  width: 100%;
  min-height: 400px;
  padding: 15px;
  border: none;
  outline: none;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
}

.word-count {
  text-align: right;
  color: #909399;
  font-size: 13px;
  margin-top: 8px;
}

.progress-card {
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checklist-actions {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.checklist-card {
  margin-bottom: 20px;
}

.add-custom-btn {
  width: 100%;
  margin-top: 15px;
  border-style: dashed !important;
}

/* AI助手样式 */
.ai-assistant {
  margin-bottom: 15px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.ai-input-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.ai-input-row .el-input {
  flex: 1;
}

/* 文书类型选择样式 */
.essay-type-selection {
  padding: 20px 0;
}

.section-title {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

.essay-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.essay-type-card {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.essay-type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
}

.essay-type-card .card-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.essay-type-card h4 {
  font-size: 18px;
  margin: 0 0 10px 0;
  color: #303133;
}

.essay-type-card p {
  font-size: 14px;
  color: #606266;
  margin: 0;
  line-height: 1.6;
}

/* 模板选择样式 */
.template-selection {
  padding: 20px 0;
}

.template-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.template-header h3 {
  margin: 0;
  color: #303133;
}

.current-essay-info {
  margin-left: auto;
  color: #409eff;
  font-weight: 500;
}

.key-points-alert {
  margin-bottom: 25px;
}

.key-points-list {
  margin: 0;
  padding-left: 20px;
}

.key-points-list li {
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
}

.key-points-list li:last-child {
  margin-bottom: 0;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.template-card {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.template-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 10px;
}

.template-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 15px;
  line-height: 1.5;
}

.template-actions {
  text-align: right;
}

/* 编辑器头部样式 */
.editor-header {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 15px;
}

.editor-header .current-essay-info {
  margin-left: 20px;
  font-weight: 500;
  color: #303133;
}

.essay-type-badge {
  margin-left: auto;
  margin-right: 20px;
  padding: 4px 12px;
  background: #ecf5ff;
  color: #409eff;
  border-radius: 4px;
  font-size: 13px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .essay-types-grid {
    grid-template-columns: 1fr;
  }

  .templates-grid {
    grid-template-columns: 1fr;
  }
}

/* 文书类型选择样式 */
.essay-type-selection {
  padding: 20px 0;
}

.section-title {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

.essay-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.essay-type-card {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.essay-type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
}

.essay-type-card .card-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.essay-type-card h4 {
  font-size: 18px;
  margin: 0 0 10px 0;
  color: #303133;
}

.essay-type-card p {
  font-size: 14px;
  color: #606266;
  margin: 0;
  line-height: 1.6;
}

/* 模板选择样式 */
.template-selection {
  padding: 20px 0;
}

.template-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.template-header h3 {
  margin: 0;
  color: #303133;
}

.current-essay-info {
  margin-left: auto;
  color: #409eff;
  font-weight: 500;
}

.key-points-alert {
  margin-bottom: 25px;
}

.key-points-list {
  margin: 0;
  padding-left: 20px;
}

.key-points-list li {
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
}

.key-points-list li:last-child {
  margin-bottom: 0;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.template-card {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.template-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 10px;
}

.template-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 15px;
  line-height: 1.5;
}

.template-actions {
  text-align: right;
}

/* 编辑器头部样式 */
.editor-header {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 15px;
}

.editor-header .current-essay-info {
  margin-left: 20px;
  font-weight: 500;
  color: #303133;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .essay-types-grid {
    grid-template-columns: 1fr;
  }

  .templates-grid {
    grid-template-columns: 1fr;
  }
}
</style>
