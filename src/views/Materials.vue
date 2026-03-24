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
            <el-button-group class="format-group">
              <el-button size="small" @click="formatDoc('bold')" title="加粗">
                <strong>B</strong>
              </el-button>
              <el-button size="small" @click="formatDoc('italic')" title="斜体">
                <em>I</em>
              </el-button>
              <el-button size="small" @click="formatDoc('underline')" title="下划线">
                <u>U</u>
              </el-button>
            </el-button-group>
            <el-button-group class="format-group">
              <el-button size="small" @click="formatDoc('h1')" title="一级标题">H1</el-button>
              <el-button size="small" @click="formatDoc('h2')" title="二级标题">H2</el-button>
              <el-button size="small" @click="formatDoc('h3')" title="三级标题">H3</el-button>
            </el-button-group>
            <el-button-group class="format-group">
              <el-button size="small" @click="formatDoc('ul')" title="无序列表">☰</el-button>
              <el-button size="small" @click="formatDoc('ol')" title="有序列表">1.</el-button>
            </el-button-group>
            <el-button-group class="format-group">
              <el-button size="small" @click="formatDoc('undo')" title="撤销">↶</el-button>
              <el-button size="small" @click="formatDoc('redo')" title="重做">↷</el-button>
            </el-button-group>
            <el-button size="small" @click="showWordCountDialog">字数统计</el-button>
            <el-button size="small" type="primary" @click="showVersionNoteDialog">保存版本</el-button>
            <el-button size="small" @click="showVersions">历史版本</el-button>
            <el-button size="small" type="success" @click="previewAndExportPDF">导出PDF</el-button>
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
            <div
              ref="editorRef"
              class="rich-editor"
              contenteditable="true"
              @input="onEditorInput"
              @keydown="onEditorKeydown"
              :data-placeholder="'在此编辑文书内容，可以使用AI生成辅助...'"
            ></div>
          </div>
          <div class="word-count">
            <span>字数统计: {{ wordCount }} 字 | 预计阅读时间: {{ Math.ceil(wordCount / 400) }}分钟</span>
            <el-button size="small" type="text" @click="showWordCountDialog">详细统计</el-button>
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
                <el-table :data="getCategoryItems(category.id)" style="width: 100%" class="materials-checklist-table">
                  <el-table-column width="50">
                    <template #default="{ row }">
                      <el-checkbox v-model="row.completed" @change="updateProgress" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="材料名称" min-width="200" show-overflow-tooltip />
                  <el-table-column prop="note" label="备注" min-width="160" show-overflow-tooltip />
                  <el-table-column label="操作" width="110">
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

    <!-- 编辑材料对话框 -->
    <el-dialog v-model="editItemDialogVisible" title="编辑材料" width="400px">
      <el-form :model="editingItem" label-width="80px">
        <el-form-item label="材料名称">
          <el-input v-model="editingItem.name" placeholder="材料名称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editingItem.note" type="textarea" placeholder="备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editItemDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEditItem">保存修改</el-button>
      </template>
    </el-dialog>

    <!-- 检查报告对话框 -->
    <el-dialog v-model="reportVisible" title="材料准备检查报告" width="600px">
      <div class="report-content">
        <el-card class="report-summary-card">
          <div class="report-summary">
            <div class="summary-stat">
              <div class="stat-value" style="color: #67c23a;">{{ completedCount }}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="summary-stat">
              <div class="stat-value" style="color: #e6a23c;">{{ pendingCount }}</div>
              <div class="stat-label">未完成</div>
            </div>
            <div class="summary-stat">
              <div class="stat-value" style="color: #667eea;">{{ completionRate }}%</div>
              <div class="stat-label">完成率</div>
            </div>
          </div>
          <el-progress :percentage="completionRate" :color="progressColor" style="margin-top: 15px;" />
        </el-card>

        <div v-if="pendingItems.length > 0" class="pending-section">
          <h4 class="pending-title">⚠️ 待完成材料 ({{ pendingItems.length }}项)</h4>
          <el-table :data="pendingItems" size="small" border class="pending-items-table">
            <el-table-column prop="name" label="材料名称" min-width="200" show-overflow-tooltip />
            <el-table-column prop="categoryName" label="分类" width="100" />
            <el-table-column prop="note" label="备注" min-width="160" show-overflow-tooltip />
            <el-table-column label="操作" width="80">
              <template #default="{ row }">
                <el-button size="small" type="success" text @click="markCompleted(row)">完成</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-empty v-else description="所有材料已准备完成！🎉" />

        <div v-if="completedItems.length > 0" class="completed-section">
          <h4 class="completed-title">✅ 已完成材料 ({{ completedItems.length }}项)</h4>
          <div class="completed-list">
            <el-tag v-for="item in completedItems" :key="item.name" type="success" style="margin: 4px;">
              {{ item.name }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 添加自定义材料对话框 -->
    <el-dialog v-model="itemDialogVisible" title="添加自定义材料" width="400px">
      <el-form :model="newItem" label-width="80px">
        <el-form-item label="材料名称">
          <el-input v-model="newItem.name" placeholder="如：作品集" />
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select v-model="newItem.category" style="width: 100%;">
            <el-option label="必需材料" value="required" />
            <el-option label="推荐材料" value="recommended" />
            <el-option label="可选材料" value="optional" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="newItem.note" type="textarea" placeholder="备注信息（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="itemDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddItem">添加</el-button>
      </template>
    </el-dialog>

    <!-- 历史版本对话框 -->
    <el-dialog v-model="versionsVisible" title="文书历史版本" width="600px">
      <el-table :data="versions" style="width: 100%" class="versions-table">
        <el-table-column prop="date" label="保存时间" width="180" />
        <el-table-column prop="note" label="版本备注" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button size="small" type="primary" text @click="previewVersion(row)">预览</el-button>
            <el-button size="small" type="success" text @click="restoreVersion(row)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 版本备注对话框 -->
    <el-dialog v-model="versionNoteVisible" title="保存版本" width="400px">
      <el-form :model="versionNote" label-width="80px">
        <el-form-item label="版本备注">
          <el-input
            v-model="versionNote.text"
            placeholder="请输入版本备注，如：初稿、修改版、终稿..."
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="versionNoteVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSaveVersion">保存</el-button>
      </template>
    </el-dialog>

    <!-- 字数统计对话框 -->
    <el-dialog v-model="wordCountVisible" title="字数统计详情" width="500px">
      <div class="word-count-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="总字符数">
            {{ essayContent.length }} 个字符
          </el-descriptions-item>
          <el-descriptions-item label="中文字符">
            {{ charStats.zh }} 个
          </el-descriptions-item>
          <el-descriptions-item label="英文字母">
            {{ charStats.en }} 个
          </el-descriptions-item>
          <el-descriptions-item label="数字">
            {{ charStats.digits }} 个
          </el-descriptions-item>
          <el-descriptions-item label="标点符号">
            {{ charStats.punct }} 个
          </el-descriptions-item>
          <el-descriptions-item label="空格">
            {{ charStats.space }} 个
          </el-descriptions-item>
          <el-descriptions-item label="换行符">
            {{ charStats.newline }} 个
          </el-descriptions-item>
          <el-descriptions-item label="估计词数（英文）">
            {{ charStats.en }} 词
          </el-descriptions-item>
          <el-descriptions-item label="预计阅读时间">
            {{ Math.ceil(wordCount / 400) }} 分钟
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- PDF预览对话框 -->
    <el-dialog v-model="pdfPreviewVisible" title="PDF预览" width="700px" fullscreen>
      <div class="pdf-preview-wrapper" ref="pdfPreviewRef">
        <div class="pdf-document">
          <div class="pdf-header">
            <h1>{{ getEssayTypeLabel(selectedEssayType) }}</h1>
            <p class="pdf-template-info">{{ selectedTemplate?.name }}</p>
          </div>
          <div class="pdf-body" v-html="renderedContent"></div>
        </div>
      </div>
      <template #footer>
        <el-button @click="pdfPreviewVisible = false">关闭预览</el-button>
        <el-button type="primary" @click="downloadPDF">下载PDF</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getProviders, sendMessageToAI } from '@/utils/ai-api'
import { jsPDF } from 'jspdf'
import 'jspdf/dist/jspdf.umd.min.js'

const activeTab = ref('essay')
const currentEssayType = ref('ps')
const essayContent = ref('')
const itemDialogVisible = ref(false)
const editItemDialogVisible = ref(false)
const editingItem = reactive({ name: '', note: '', category: '', index: -1 })
const reportVisible = ref(false)
const versionsVisible = ref(false)
const activeCategory = ref(['required'])
const selectedProvider = ref(null)
const aiPrompt = ref('')
const isGenerating = ref(false)
const editorRef = ref(null)
const versionNoteVisible = ref(false)
const wordCountVisible = ref(false)
const pdfPreviewVisible = ref(false)
const pdfPreviewRef = ref(null)
const versionNote = reactive({ text: '' })
const renderedContent = ref('')

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
  // 从localStorage恢复编辑器内容
  const savedContent = localStorage.getItem('essay_current_content')
  if (savedContent && editorRef.value) {
    editorRef.value.innerHTML = savedContent
  }
  // 从localStorage恢复历史版本
  const savedEssays = localStorage.getItem('essay_versions')
  if (savedEssays) {
    versions.value = JSON.parse(savedEssays)
  }
  const savedChecklist = localStorage.getItem('materials_checklist')
  if (savedChecklist) {
    Object.assign(allItems.value, JSON.parse(savedChecklist))
  }
})

// 字数统计计算
const wordCount = computed(() => {
  return essayContent.value.replace(/\s/g, '').length
})

// 字符详细统计
const charStats = computed(() => {
  const text = essayContent.value
  const zh = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const en = (text.match(/[a-zA-Z]/g) || []).length
  const digits = (text.match(/[0-9]/g) || []).length
  const punct = (text.match(/[^\u4e00-\u9fff a-zA-Z0-9\n\r]/g) || []).length
  const space = (text.match(/[ ]/g) || []).length
  const newline = (text.match(/\n/g) || []).length
  return { zh, en, digits, punct, space, newline }
})

// 编辑器内容变化处理
const onEditorInput = () => {
  if (editorRef.value) {
    essayContent.value = editorRef.value.innerText || ''
    // 自动保存到localStorage
    localStorage.setItem('essay_current_content', editorRef.value.innerHTML)
  }
}

// 编辑器按键处理
const onEditorKeydown = (e) => {
  // Tab键插入缩进
  if (e.key === 'Tab') {
    e.preventDefault()
    document.execCommand('insertText', false, '    ')
  }
}

// 格式化文档（支持富文本选区操作）
const formatDoc = (format) => {
  const selection = window.getSelection()
  if (!selection.rangeCount) return

  switch (format) {
    case 'bold':
      document.execCommand('bold', false)
      break
    case 'italic':
      document.execCommand('italic', false)
      break
    case 'underline':
      document.execCommand('underline', false)
      break
    case 'h1':
      document.execCommand('formatBlock', false, '<h1>')
      break
    case 'h2':
      document.execCommand('formatBlock', false, '<h2>')
      break
    case 'h3':
      document.execCommand('formatBlock', false, '<h3>')
      break
    case 'ul':
      document.execCommand('insertUnorderedList', false)
      break
    case 'ol':
      document.execCommand('insertOrderedList', false)
      break
    case 'undo':
      document.execCommand('undo', false)
      break
    case 'redo':
      document.execCommand('redo', false)
      break
  }

  // 触发input事件更新内容
  nextTick(() => {
    if (editorRef.value) {
      essayContent.value = editorRef.value.innerText || ''
      localStorage.setItem('essay_current_content', editorRef.value.innerHTML)
    }
  })
}

// 显示字数统计对话框
const showWordCountDialog = () => {
  wordCountVisible.value = true
}

// 显示版本保存对话框
const showVersionNoteDialog = () => {
  versionNote.text = `版本 ${versions.value.length + 1}`
  versionNoteVisible.value = true
}

// 确认保存版本
const confirmSaveVersion = () => {
  if (!essayContent.value.trim()) {
    ElMessage.warning('文书内容为空，无法保存')
    return
  }
  versions.value.unshift({
    date: new Date().toLocaleString('zh-CN'),
    note: versionNote.text || `版本 ${versions.value.length + 1}`,
    content: essayContent.value
  })
  localStorage.setItem('essay_versions', JSON.stringify(versions.value))
  ElMessage.success('版本已保存')
  versionNoteVisible.value = false
  versionNote.text = ''
}

// 旧版本保存方法（保持兼容）
const saveVersion = () => {
  showVersionNoteDialog()
}

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
  // 设置富文本编辑器内容
  nextTick(() => {
    if (editorRef.value) {
      editorRef.value.innerHTML = template.content.split('\n').map(line => {
        if (line.trim()) return `<p>${line}</p>`
        return '<p><br></p>'
      }).join('')
      localStorage.setItem('essay_current_content', editorRef.value.innerHTML)
    }
  })
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
  localStorage.setItem('materials_checklist', JSON.stringify(allItems.value))
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
  localStorage.setItem('materials_checklist', JSON.stringify(allItems.value))
  ElMessage.success('已添加')
  itemDialogVisible.value = false
  Object.assign(newItem, { name: '', note: '', category: 'required' })
}

const editItem = (categoryId, index) => {
  const item = allItems.value[categoryId][index]
  editingItem.name = item.name
  editingItem.note = item.note
  editingItem.category = categoryId
  editingItem.index = index
  editItemDialogVisible.value = true
}

const confirmEditItem = () => {
  if (!editingItem.name) {
    ElMessage.warning('请输入材料名称')
    return
  }
  allItems.value[editingItem.category][editingItem.index].name = editingItem.name
  allItems.value[editingItem.category][editingItem.index].note = editingItem.note
  localStorage.setItem('materials_checklist', JSON.stringify(allItems.value))
  ElMessage.success('材料已更新')
  editItemDialogVisible.value = false
}

const markCompleted = (row) => {
  row.completed = true
  updateProgress()
  ElMessage.success('已标记为完成')
}

const completedItems = computed(() => {
  const items = []
  const catNames = { required: '必需材料', recommended: '推荐材料', optional: '可选材料' }
  for (const [cat, catName] of Object.entries(catNames)) {
    for (const item of allItems.value[cat] || []) {
      if (item.completed) {
        items.push({ ...item, categoryName: catName })
      }
    }
  }
  return items
})

const pendingItems = computed(() => {
  const items = []
  const catNames = { required: '必需材料', recommended: '推荐材料', optional: '可选材料' }
  for (const [cat, catName] of Object.entries(catNames)) {
    for (const item of allItems.value[cat] || []) {
      if (!item.completed) {
        items.push({ ...item, categoryName: catName })
      }
    }
  }
  return items
})

const completedCount = computed(() => completedItems.value.length)
const pendingCount = computed(() => pendingItems.value.length)

const removeItem = (categoryId, index) => {
  allItems.value[categoryId].splice(index, 1)
  localStorage.setItem('materials_checklist', JSON.stringify(allItems.value))
  ElMessage.success('已删除')
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
    // 更新编辑器内容
    nextTick(() => {
      if (editorRef.value) {
        editorRef.value.innerHTML = response.content.split('\n').map(line => {
          if (line.trim()) return `<p>${line}</p>`
          return '<p><br></p>'
        }).join('')
        localStorage.setItem('essay_current_content', editorRef.value.innerHTML)
      }
    })
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
  nextTick(() => {
    if (editorRef.value && version.content) {
      editorRef.value.innerHTML = version.content.split('\n').map(line => {
        if (line.trim()) return `<p>${line}</p>`
        return '<p><br></p>'
      }).join('')
    }
  })
  versionsVisible.value = false
  ElMessage.success('已加载历史版本预览')
}

const restoreVersion = (version) => {
  essayContent.value = version.content
  nextTick(() => {
    if (editorRef.value && version.content) {
      editorRef.value.innerHTML = version.content.split('\n').map(line => {
        if (line.trim()) return `<p>${line}</p>`
        return '<p><br></p>'
      }).join('')
      localStorage.setItem('essay_current_content', editorRef.value.innerHTML)
    }
  })
  versionsVisible.value = false
  ElMessage.success('已恢复到此版本')
}

// PDF预览和导出
const previewAndExportPDF = () => {
  if (!essayContent.value.trim()) {
    ElMessage.warning('文书内容为空，无法导出')
    return
  }
  // 将文本内容转换为HTML格式用于预览
  renderedContent.value = essayContent.value.split('\n').map(line => {
    if (line.trim()) {
      // 处理标题格式（## 开头的行）
      if (line.startsWith('## ')) {
        return `<h2>${line.substring(3)}</h2>`
      }
      if (line.startsWith('# ')) {
        return `<h1>${line.substring(2)}</h1>`
      }
      // 处理列表（- 开头的行）
      if (line.trim().startsWith('- ')) {
        return `<li>${line.trim().substring(2)}</li>`
      }
      // 处理加粗 *文字*
      const processed = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
      return `<p>${processed}</p>`
    }
    return '<p><br></p>'
  }).join('')
  pdfPreviewVisible.value = true
}

const downloadPDF = () => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - 2 * margin
  let y = margin

  // 添加标题
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  const title = getEssayTypeLabel(selectedEssayType.value)
  doc.text(title, pageWidth / 2, y, { align: 'center' })
  y += 10

  // 添加模板信息
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(selectedTemplate.value?.name || '', pageWidth / 2, y, { align: 'center' })
  y += 10

  // 添加分隔线
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  // 添加正文内容
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  const lines = essayContent.value.split('\n')
  for (const line of lines) {
    if (!line.trim()) {
      y += 5 // 空行
      continue
    }

    // 处理标题
    let text = line.trim()
    let fontSize = 11
    let isBold = false

    if (line.startsWith('## ')) {
      text = line.substring(3).trim()
      fontSize = 14
      isBold = true
    } else if (line.startsWith('# ')) {
      text = line.substring(2).trim()
      fontSize = 16
      isBold = true
    } else if (line.trim().startsWith('- ')) {
      text = '• ' + line.trim().substring(2)
    }

    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')

    // 换行处理
    const splitText = doc.splitTextToSize(text, maxWidth)
    for (const part of splitText) {
      if (y + 6 > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(part, margin, y)
      y += fontSize * 0.5 + 2
    }
    y += 2
  }

  // 添加页脚
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 150)
    doc.text(`第 ${i} / ${totalPages} 页`, pageWidth / 2, pageHeight - 10, { align: 'center' })
    doc.text('智能留学规划平台 - 文书导出', margin, pageHeight - 10)
  }

  const fileName = `${getEssayTypeLabel(selectedEssayType.value)}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.pdf`
  doc.save(fileName)
  ElMessage.success(`PDF已下载: ${fileName}`)
}

const exportPDF = () => {
  previewAndExportPDF()
}

const exportCSV = () => {
  const rows = []
  rows.push(['材料名称', '类别', '状态', '备注'])
  for (const [cat, catName] of [['required', '必需材料'], ['recommended', '推荐材料'], ['optional', '可选材料']]) {
    for (const item of allItems.value[cat]) {
      rows.push([item.name, catName, item.completed ? '已完成' : '未完成', item.note])
    }
  }

  const csvContent = rows.map(r => r.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n')
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `材料清单_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('CSV已导出')
}

const generateReport = () => {
  reportVisible.value = true
}

const resetChecklist = () => {
  ElMessageBox.confirm('确定要重置所有材料清单吗？这将清除所有勾选状态。', '确认重置', {
    confirmButtonText: '确定重置',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    Object.keys(allItems.value).forEach(cat => {
      allItems.value[cat].forEach(item => {
        item.completed = false
      })
    })
    localStorage.setItem('materials_checklist', JSON.stringify(allItems.value))
    ElMessage.success('清单已重置')
  }).catch(() => {})
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
  max-width: 1200px;
  margin: 0 auto;
}

.editor-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.format-group {
  display: flex;
  gap: 2px;
}

.word-count {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #909399;
  font-size: 13px;
  margin-top: 8px;
}

.editor-content {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  min-height: 400px;
}

.rich-editor {
  width: 100%;
  min-height: 400px;
  padding: 15px;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
  background: white;
  border-radius: 8px;
}

.rich-editor:focus {
  outline: none;
}

.rich-editor:empty::before {
  content: attr(data-placeholder);
  color: #c0c4cc;
  pointer-events: none;
}

.rich-editor h1 {
  font-size: 20px;
  font-weight: bold;
  margin: 12px 0 8px 0;
  color: #303133;
  border-bottom: 2px solid #409eff;
  padding-bottom: 6px;
}

.rich-editor h2 {
  font-size: 17px;
  font-weight: bold;
  margin: 10px 0 6px 0;
  color: #303133;
}

.rich-editor h3 {
  font-size: 15px;
  font-weight: bold;
  margin: 8px 0 4px 0;
  color: #606266;
}

.rich-editor p {
  margin: 4px 0;
  text-indent: 2em;
}

.rich-editor ul, .rich-editor ol {
  margin: 6px 0;
  padding-left: 30px;
}

.rich-editor li {
  margin: 3px 0;
}

.rich-editor strong {
  font-weight: bold;
  color: #409eff;
}

.rich-editor em {
  font-style: italic;
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

/* 检查报告对话框样式 */
.report-content {
  max-height: 60vh;
  overflow-y: auto;
}

.report-summary-card {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
}

.report-summary {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}

.summary-stat {
  text-align: center;
}

.summary-stat .stat-value {
  font-size: 32px;
  font-weight: bold;
}

.summary-stat .stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.pending-section {
  margin-top: 20px;
}

.pending-title {
  margin-bottom: 12px;
  color: #e6a23c;
}

.completed-section {
  margin-top: 20px;
}

.completed-title {
  margin-bottom: 12px;
  color: #67c23a;
}

.completed-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* PDF预览样式 */
.pdf-preview-wrapper {
  background: #f5f5f5;
  padding: 20px;
  min-height: 500px;
  display: flex;
  justify-content: center;
}

.pdf-document {
  background: white;
  width: 100%;
  max-width: 700px;
  padding: 40px 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-height: 600px;
}

.pdf-header h1 {
  text-align: center;
  font-size: 24px;
  color: #303133;
  margin-bottom: 8px;
}

.pdf-template-info {
  text-align: center;
  font-size: 13px;
  color: #909399;
  margin-bottom: 20px;
}

.pdf-body {
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
}

.pdf-body h1 {
  font-size: 18px;
  font-weight: bold;
  margin: 16px 0 8px 0;
  color: #303133;
}

.pdf-body h2 {
  font-size: 16px;
  font-weight: bold;
  margin: 14px 0 6px 0;
}

.pdf-body p {
  margin: 6px 0;
  text-indent: 2em;
}

.pdf-body ul, .pdf-body ol {
  padding-left: 30px;
  margin: 8px 0;
}

/* 字数统计对话框 */
.word-count-detail {
  padding: 10px 0;
}

.word-count-detail .el-descriptions {
  margin-top: 10px;
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

/* 表格样式：操作按钮不换行，保持单行 */
.materials-checklist-table :deep(.el-table__body .cell),
.pending-items-table :deep(.el-table__body .cell),
.versions-table :deep(.el-table__body .cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.materials-checklist-table :deep(.el-table__body .el-button),
.pending-items-table :deep(.el-table__body .el-button),
.versions-table :deep(.el-table__body .el-button) {
  flex-shrink: 0;
}
</style>
