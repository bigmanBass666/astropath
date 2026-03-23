<template>
  <div class="assessment-page">
    <h2 class="page-title">背景评估</h2>

    <!-- 步骤指示器 -->
    <el-steps :active="currentStep" finish-status="success" class="steps-indicator">
      <el-step title="基础信息" />
      <el-step title="学术背景" />
      <el-step title="实践经历" />
    </el-steps>

    <!-- 步骤1：基础信息 -->
    <el-card v-if="currentStep === 0" class="step-card">
      <template #header>
        <span>学生基础信息</span>
      </template>
      <el-form :model="form.basic" :rules="basicRules" ref="basicFormRef" label-width="120px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.basic.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.basic.age" :min="16" :max="50" />
        </el-form-item>
        <el-form-item label="在读院校" prop="university">
          <el-select v-model="form.basic.university" placeholder="请选择或输入">
            <el-option label="985院校" value="985" />
            <el-option label="211院校" value="211" />
            <el-option label="普通本科" value="regular" />
            <el-option label="海外院校" value="overseas" />
          </el-select>
        </el-form-item>
        <el-form-item label="GPA" prop="gpa">
          <el-slider v-model="form.basic.gpa" :min="0" :max="4" :step="0.1" show-stops />
          <span class="gpa-display">当前GPA: {{ form.basic.gpa.toFixed(1) }}</span>
        </el-form-item>
        <el-form-item label="语言成绩" prop="language">
          <el-input v-model="form.language" placeholder="如：雅思7.0 / 托福100" />
        </el-form-item>
      </el-form>
      <div class="step-actions">
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </div>
    </el-card>

    <!-- 步骤2：学术背景 -->
    <el-card v-if="currentStep === 1" class="step-card">
      <template #header>
        <span>学术背景</span>
      </template>
      <el-form :model="form.academic" label-width="120px">
        <el-form-item label="学历层次">
          <el-radio-group v-model="form.academic.degree">
            <el-radio-button label="本科" />
            <el-radio-button label="硕士" />
            <el-radio-button label="博士" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="专业方向">
          <el-checkbox-group v-model="form.academic.majors">
            <el-checkbox-button label="理工" />
            <el-checkbox-button label="商科" />
            <el-checkbox-button label="人文" />
            <el-checkbox-button label="社科" />
            <el-checkbox-button label="艺术" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="均分">
          <el-input-number v-model="form.academic.averageScore" :min="0" :max="100" />
          <span class="score-display">/ 100</span>
        </el-form-item>
        <el-form-item label="科研经历">
          <el-button type="primary" @click="openResearchDialog">+ 添加科研经历</el-button>
          <div v-if="form.academic.research.length === 0" class="empty-tip">暂无科研经历，点击按钮添加</div>
          <div v-for="(item, index) in form.academic.research" :key="index" class="list-item">
            <div class="item-content">
              <strong>{{ item.name }}</strong>
              <span class="item-role">{{ item.role }}</span>
              <span class="item-duration">{{ item.duration }}</span>
              <span v-if="item.achievements" class="item-achievements">{{ item.achievements }}</span>
            </div>
            <div class="item-actions">
              <el-button type="primary" size="small" @click="editResearch(index)">编辑</el-button>
              <el-button type="danger" size="small" @click="removeResearch(index)">删除</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="step-actions">
        <el-button @click="prevStep">上一步</el-button>
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </div>
    </el-card>

    <!-- 步骤3：实践经历 -->
    <el-card v-if="currentStep === 2" class="step-card">
      <template #header>
        <span>实践经历</span>
      </template>
      <el-form>
        <el-form-item label="实习经历">
          <el-button @click="addInternship">+ 添加实习</el-button>
          <div v-if="form.practice.internships.length === 0" class="empty-tip">暂无实习经历</div>
          <div v-for="(item, index) in form.practice.internships" :key="index" class="list-item">
            {{ item.company }} - {{ item.position }}
            <el-button type="text" size="small" @click="removeInternship(index)">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item label="竞赛获奖">
          <el-button @click="addCompetition">+ 添加竞赛</el-button>
          <div v-if="form.practice.competitions.length === 0" class="empty-tip">暂无竞赛记录</div>
          <div v-for="(item, index) in form.practice.competitions" :key="index" class="list-item">
            {{ item.name }} - {{ item.award }}
            <el-button type="text" size="small" @click="removeCompetition(index)">删除</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div class="step-actions">
        <el-button @click="prevStep">上一步</el-button>
        <el-button type="primary" @click="generateReport">生成评估报告</el-button>
      </div>
    </el-card>

    <!-- 评估报告 -->
    <el-card v-if="currentStep === 3" class="result-card">
      <template #header>
        <span>竞争力评估报告</span>
      </template>
      <div class="report-summary">
        <h3>综合评估结果</h3>
        <p>根据您填写的信息，系统生成了以下评估报告</p>
      </div>
      <div class="report-content">
        <div class="score-overview">
          <el-rate v-model="overallScore" disabled :max="5" />
          <span class="score-text">竞争力总分: {{ overallScore.toFixed(1) }}/5.0</span>
        </div>
        <div class="radar-chart" ref="radarRef" style="height: 400px;"></div>
        <div class="report-details">
          <h4>详细分析</h4>
          <ul>
            <li><strong>学术能力：</strong>{{ academicScore.toFixed(1) }}/5 (院校背景+均分)</li>
            <li><strong>语言能力：</strong>{{ languageScore.toFixed(1) }}/5</li>
            <li><strong>科研经历：</strong>{{ researchScore.toFixed(1) }}/5</li>
            <li><strong>实践背景：</strong>{{ practiceScore.toFixed(1) }}/5</li>
          </ul>
        </div>
      </div>
      <div class="step-actions">
        <el-button type="primary" @click="saveReport">保存评估结果</el-button>
        <el-button @click="resetForm">重新填写</el-button>
      </div>
    </el-card>
    <!-- 科研经历模态框 -->
    <el-dialog v-model="researchDialogVisible" :title="isEditingResearch ? '编辑科研经历' : '添加科研经历'" width="500px">
      <el-form :model="currentResearch" :rules="researchRules" ref="researchFormRef" label-width="100px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="currentResearch.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="担任角色" prop="role">
          <el-input v-model="currentResearch.role" placeholder="如：项目负责人、核心成员、参与者" />
        </el-form-item>
        <el-form-item label="项目时长" prop="duration">
          <el-input v-model="currentResearch.duration" placeholder="如：3个月、半年、1年" />
        </el-form-item>
        <el-form-item label="项目成果" prop="achievements">
          <el-input v-model="currentResearch.achievements" type="textarea" :rows="3" placeholder="描述项目成果、发表论文、获奖情况等" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeResearchDialog">取消</el-button>
        <el-button type="primary" @click="saveResearch">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()
const currentStep = ref(0)
const basicFormRef = ref(null)
const radarRef = ref(null)
const researchDialogVisible = ref(false)
const isEditingResearch = ref(false)
const editingResearchIndex = ref(-1)
const researchFormRef = ref(null)

const basicRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  university: [{ required: true, message: '请选择院校', trigger: 'change' }],
  gpa: [{ required: true, message: '请选择GPA', trigger: 'change' }]
}

const researchRules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  role: [{ required: true, message: '请选择担任角色', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入项目时长', trigger: 'blur' }]
}

const form = reactive({
  basic: {
    name: '',
    age: 22,
    university: '',
    gpa: 3.0,
    language: ''
  },
  academic: {
    degree: '本科',
    majors: [],
    averageScore: 80,
    research: []
  },
  practice: {
    internships: [],
    competitions: []
  }
})

// 科研经历模态表单
const currentResearch = reactive({
  name: '',
  role: '',
  duration: '',
  achievements: ''
})

// 计算各维度分数
const overallScore = computed(() => {
  const scores = [academicScore.value, languageScore.value, researchScore.value, practiceScore.value]
  return scores.reduce((a, b) => a + b, 0) / scores.length
})

const languageScore = computed(() => {
  const lang = form.basic.language
  if (!lang) return 2.5
  if (lang.includes('雅思') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 7) return 5
  if (lang.includes('托福') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 100) return 5
  return 3
})

const academicScore = computed(() => {
  const uniScore = { '985': 1.5, '211': 1.2, 'regular': 1, 'overseas': 1.3 }
  const score1 = uniScore[form.basic.university] || 1
  const score2 = form.academic.averageScore / 100 * 3
  return score1 + score2
})

const researchScore = computed(() => {
  return Math.min(form.academic.research.length * 1.5, 5)
})

const practiceScore = computed(() => {
  const total = form.practice.internships.length + form.practice.competitions.length
  return Math.min(total * 1.2, 5)
})

const nextStep = async () => {
  if (currentStep.value === 0) {
    await basicFormRef.value.validate((valid) => {
      if (valid) {
        currentStep.value++
      } else {
        ElMessage.warning('请完善必填字段')
      }
    })
  } else {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--
}

// 科研经历管理
const openResearchDialog = () => {
  isEditingResearch.value = false
  editingResearchIndex.value = -1
  resetResearchForm()
  researchDialogVisible.value = true
}

const editResearch = (index) => {
  const item = form.academic.research[index]
  currentResearch.name = item.name
  currentResearch.role = item.role
  currentResearch.duration = item.duration
  currentResearch.achievements = item.achievements || ''
  isEditingResearch.value = true
  editingResearchIndex.value = index
  researchDialogVisible.value = true
}

const saveResearch = async () => {
  await researchFormRef.value.validate((valid) => {
    if (valid) {
      if (isEditingResearch.value) {
        // 编辑模式：更新现有记录
        const index = editingResearchIndex.value
        form.academic.research[index] = {
          ...form.academic.research[index],
          name: currentResearch.name,
          role: currentResearch.role,
          duration: currentResearch.duration,
          achievements: currentResearch.achievements
        }
        ElMessage.success('科研经历已更新')
      } else {
        // 新增模式：添加新记录
        form.academic.research.push({
          name: currentResearch.name,
          role: currentResearch.role,
          duration: currentResearch.duration,
          achievements: currentResearch.achievements
        })
        ElMessage.success('科研经历已添加')
      }
      closeResearchDialog()
    }
  })
}

const closeResearchDialog = () => {
  researchDialogVisible.value = false
  resetResearchForm()
}

const resetResearchForm = () => {
  currentResearch.name = ''
  currentResearch.role = ''
  currentResearch.duration = ''
  currentResearch.achievements = ''
}

const removeResearch = (index) => {
  ElMessageBox.confirm('确定要删除这条科研经历吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    form.academic.research.splice(index, 1)
    ElMessage.success('已删除')
  }).catch(() => {})
}

// 实践经历管理
const addInternship = () => {
  form.practice.internships.push({ company: '未命名公司', position: '实习生', duration: '3个月' })
}

const removeInternship = (index) => {
  form.practice.internships.splice(index, 1)
}

const addCompetition = () => {
  form.practice.competitions.push({ name: '未命名竞赛', award: '参与奖' })
}

const removeCompetition = (index) => {
  form.practice.competitions.splice(index, 1)
}

const generateReport = () => {
  currentStep.value = 3
  nextTick(() => {
    renderRadarChart()
  })
}

const renderRadarChart = () => {
  if (!radarRef.value) return
  const chart = echarts.init(radarRef.value)
  chart.setOption({
    title: { text: '竞争力雷达图' },
    radar: {
      indicator: [
        { name: '学术能力', max: 5 },
        { name: '语言能力', max: 5 },
        { name: '科研经历', max: 5 },
        { name: '实践背景', max: 5 },
        { name: '综合实力', max: 5 }
      ]
    },
    series: [{
      name: '竞争力',
      type: 'radar',
      data: [{
        value: [
          academicScore.value,
          languageScore.value,
          researchScore.value,
          practiceScore.value,
          overallScore.value
        ],
        areaStyle: { color: 'rgba(102, 126, 234, 0.3)' }
      }]
    }]
  })
}

const saveReport = () => {
  const report = {
    ...form,
    scores: {
      overall: overallScore.value,
      academic: academicScore.value,
      language: languageScore.value,
      research: researchScore.value,
      practice: practiceScore.value
    },
    savedAt: new Date().toISOString()
  }
  localStorage.setItem('assessment_report', JSON.stringify(report))
  ElMessage.success('评估报告已保存')
}

const resetForm = () => {
  ElMessageBox.confirm('确定要重新填写吗？当前数据将丢失', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    Object.assign(form, {
      basic: { name: '', age: 22, university: '', gpa: 3.0, language: '' },
      academic: { degree: '本科', majors: [], averageScore: 80, research: [] },
      practice: { internships: [], competitions: [] }
    })
    currentStep.value = 0
  }).catch(() => {})
}
</script>

<style scoped>
.assessment-page {
  max-width: 900px;
  margin: 0 auto;
}

.steps-indicator {
  margin-bottom: 30px;
}

.step-card {
  margin-bottom: 20px;
}

.gpa-display {
  margin-left: 10px;
  color: #667eea;
  font-weight: bold;
}

.step-actions {
  margin-top: 30px;
  text-align: center;
}

.empty-tip {
  color: #909399;
  font-size: 14px;
  margin-top: 10px;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: #f5f7fa;
  margin: 5px 0;
  border-radius: 6px;
}

.score-overview {
  text-align: center;
  margin-bottom: 30px;
}

.score-text {
  display: block;
  margin-top: 10px;
  font-size: 18px;
  color: #667eea;
  font-weight: bold;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  background: #f5f7fa;
  margin: 8px 0;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.item-content strong {
  font-size: 14px;
  color: #303133;
}

.item-role {
  font-size: 12px;
  color: #409eff;
  background: #ecf5ff;
  padding: 2px 8px;
  border-radius: 4px;
  align-self: flex-start;
}

.item-duration {
  font-size: 12px;
  color: #909399;
}

.item-achievements {
  font-size: 12px;
  color: #67c23a;
  margin-top: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-actions {
  display: flex;
  gap: 8px;
}
</style>
