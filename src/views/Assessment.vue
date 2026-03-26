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
          <el-input v-model="form.basic.language" placeholder="如：雅思7.0 / 托福100" />
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
          <div v-if="form.academic.research.length === 0" class="empty-tip" style="margin-left: 10px; display: inline-block; vertical-align: middle;">暂无科研经历，点击按钮添加</div>
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

      <!-- Tab 标签页 -->
      <el-tabs v-model="practiceTab" class="practice-tabs">
        <!-- 实习经历 Tab -->
        <el-tab-pane label="实习经历" name="internship">
          <div class="tab-header">
            <el-button type="primary" @click="openInternshipDialog">+ 添加实习经历</el-button>
            <div v-if="form.practice.internships.length === 0" class="empty-tip">暂无实习经历，点击按钮添加</div>
            <div v-for="(item, index) in form.practice.internships" :key="'int-'+index" class="list-item enhanced">
              <div class="item-content">
                <div class="item-header">
                  <strong>{{ item.company }}</strong>
                  <el-tag size="small" type="primary">{{ item.position }}</el-tag>
                </div>
                <div class="item-meta">
                  <span class="item-duration"><i class="el-icon-time"></i> {{ item.duration }}</span>
                  <span v-if="item.description" class="item-desc">{{ item.description }}</span>
                </div>
              </div>
              <div class="item-actions">
                <el-button type="primary" size="small" plain @click="editInternship(index)">编辑</el-button>
                <el-button type="danger" size="small" plain @click="deleteInternship(index)">删除</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 竞赛获奖 Tab -->
        <el-tab-pane label="竞赛获奖" name="competition">
          <div class="tab-header">
            <el-button type="primary" @click="openCompetitionDialog">+ 添加竞赛获奖</el-button>
            <div v-if="form.practice.competitions.length === 0" class="empty-tip">暂无竞赛记录，点击按钮添加</div>
            <div v-for="(item, index) in form.practice.competitions" :key="'comp-'+index" class="list-item enhanced">
              <div class="item-content">
                <div class="item-header">
                  <strong>{{ item.name }}</strong>
                  <el-tag size="small" :type="getAwardLevelType(item.level)">{{ item.level }}</el-tag>
                </div>
                <div class="item-meta">
                  <span class="item-award"><i class="el-icon-medal"></i> {{ item.award }}</span>
                  <span v-if="item.time" class="item-time">{{ item.time }}</span>
                </div>
              </div>
              <div class="item-actions">
                <el-button type="primary" size="small" plain @click="editCompetition(index)">编辑</el-button>
                <el-button type="danger" size="small" plain @click="deleteCompetition(index)">删除</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 志愿服务 Tab -->
        <el-tab-pane label="志愿服务" name="volunteer">
          <div class="tab-header">
            <el-button type="primary" @click="openVolunteerDialog">+ 添加志愿服务</el-button>
            <div v-if="form.practice.volunteers.length === 0" class="empty-tip">暂无志愿服务记录，点击按钮添加</div>
            <div v-for="(item, index) in form.practice.volunteers" :key="'vol-'+index" class="list-item enhanced">
              <div class="item-content">
                <div class="item-header">
                  <strong>{{ item.organization }}</strong>
                  <el-tag size="small" type="success">{{ item.role }}</el-tag>
                </div>
                <div class="item-meta">
                  <span class="item-duration"><i class="el-icon-time"></i> {{ item.duration }}</span>
                  <span v-if="item.description" class="item-desc">{{ item.description }}</span>
                </div>
              </div>
              <div class="item-actions">
                <el-button type="primary" size="small" plain @click="editVolunteer(index)">编辑</el-button>
                <el-button type="danger" size="small" plain @click="deleteVolunteer(index)">删除</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="step-actions">
        <el-button @click="prevStep">上一步</el-button>
        <el-button type="primary" @click="generateReport" :loading="isLoading">生成评估报告</el-button>
      </div>
    </el-card>

    <!-- 评估报告 -->
    <el-card v-if="currentStep === 3" class="result-card">
      <template #header>
        <span>竞争力评估报告</span>
      </template>

      <!-- 加载动画 -->
      <div v-if="isLoading" class="loading-container">
        <el-loading :fullscreen="true" tip="正在生成评估报告..."></el-loading>
      </div>

      <div v-else class="report-summary">
        <h3>综合评估结果</h3>
        <p>根据您填写的信息，系统生成了以下评估报告</p>
      </div>
      <div v-if="!isLoading" class="report-content">
        <div class="score-overview">
          <el-rate v-model="overallScore" disabled :max="5" />
          <span class="score-text">竞争力总分: {{ overallScore.toFixed(1) }}/5.0</span>
        </div>

        <!-- GPA评级和语言成绩分析 -->
        <div class="analysis-section">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="analysis-card">
                <h4><i class="el-icon-school"></i> GPA 评级</h4>
                <div class="gpa-analysis">
                  <span class="gpa-value">GPA: {{ form.basic.gpa.toFixed(1) }}</span>
                  <span class="gpa-grade" :class="getGpaGradeClass(form.basic.gpa)">{{ getGpaGrade(form.basic.gpa) }}</span>
                </div>
                <p class="analysis-detail">{{ getGpaComment(form.basic.gpa, form.basic.university) }}</p>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="analysis-card">
                <h4><i class="el-icon-chat-line-round"></i> 语言成绩分析</h4>
                <div class="language-analysis">
                  <span class="lang-text">{{ form.basic.language || '未填写' }}</span>
                  <span class="lang-level" :class="getLanguageScoreClass()">{{ getLanguageLevel() }}</span>
                </div>
                <p class="analysis-detail">{{ getLanguageComment() }}</p>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="radar-chart" ref="radarRef" style="height: 400px;"></div>
        <div class="report-details">
          <h4>详细分析</h4>
          <ul>
            <li><strong>学术能力：</strong>{{ academicScore.toFixed(1) }}/5
              <span class="score-comment">{{ getAcademicComment() }}</span>
            </li>
            <li><strong>语言能力：</strong>{{ languageScore.toFixed(1) }}/5
              <span class="score-comment">{{ getLanguageComment() }}</span>
            </li>
            <li><strong>科研经历：</strong>{{ researchScore.toFixed(1) }}/5
              <span class="score-comment">{{ getResearchComment() }}</span>
            </li>
            <li><strong>实践背景：</strong>{{ practiceScore.toFixed(1) }}/5
              <span class="score-comment">{{ getPracticeComment() }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="!isLoading" class="step-actions">
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

    <!-- 实习经历模态框 -->
    <el-dialog v-model="internshipDialogVisible" :title="isEditingInternship ? '编辑实习经历' : '添加实习经历'" width="500px">
      <el-form :model="currentInternship" :rules="internshipRules" ref="internshipFormRef" label-width="100px">
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="currentInternship.company" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="职位名称" prop="position">
          <el-input v-model="currentInternship.position" placeholder="如：前端工程师实习生、数据分析实习生" />
        </el-form-item>
        <el-form-item label="实习时长" prop="duration">
          <el-input v-model="currentInternship.duration" placeholder="如：3个月、6个月、1年" />
        </el-form-item>
        <el-form-item label="工作描述" prop="description">
          <el-input v-model="currentInternship.description" type="textarea" :rows="3" placeholder="简要描述工作内容和收获（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeInternshipDialog">取消</el-button>
        <el-button type="primary" @click="saveInternship">保存</el-button>
      </template>
    </el-dialog>

    <!-- 竞赛获奖模态框 -->
    <el-dialog v-model="competitionDialogVisible" :title="isEditingCompetition ? '编辑竞赛记录' : '添加竞赛获奖'" width="500px">
      <el-form :model="currentCompetition" :rules="competitionRules" ref="competitionFormRef" label-width="100px">
        <el-form-item label="竞赛名称" prop="name">
          <el-input v-model="currentCompetition.name" placeholder="请输入竞赛名称" />
        </el-form-item>
        <el-form-item label="竞赛级别" prop="level">
          <el-select v-model="currentCompetition.level" placeholder="请选择级别">
            <el-option label="国家级" value="国家级" />
            <el-option label="省级" value="省级" />
            <el-option label="校级" value="校级" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="获奖情况" prop="award">
          <el-input v-model="currentCompetition.award" placeholder="如：一等奖、银奖、优秀奖" />
        </el-form-item>
        <el-form-item label="参赛时间" prop="time">
          <el-input v-model="currentCompetition.time" placeholder="如：2024年3月（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeCompetitionDialog">取消</el-button>
        <el-button type="primary" @click="saveCompetition">保存</el-button>
      </template>
    </el-dialog>

    <!-- 志愿服务模态框 -->
    <el-dialog v-model="volunteerDialogVisible" :title="isEditingVolunteer ? '编辑志愿服务' : '添加志愿服务'" width="500px">
      <el-form :model="currentVolunteer" :rules="volunteerRules" ref="volunteerFormRef" label-width="100px">
        <el-form-item label="组织名称" prop="organization">
          <el-input v-model="currentVolunteer.organization" placeholder="请输入服务组织名称" />
        </el-form-item>
        <el-form-item label="志愿岗位" prop="role">
          <el-input v-model="currentVolunteer.role" placeholder="如：活动志愿者、支教老师、社区服务" />
        </el-form-item>
        <el-form-item label="服务时长" prop="duration">
          <el-input v-model="currentVolunteer.duration" placeholder="如：20小时、1个月" />
        </el-form-item>
        <el-form-item label="服务描述" prop="description">
          <el-input v-model="currentVolunteer.description" type="textarea" :rows="3" placeholder="简要描述服务内容和感受（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeVolunteerDialog">取消</el-button>
        <el-button type="primary" @click="saveVolunteer">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()
const currentStep = ref(0)
const practiceTab = ref('internship')
const basicFormRef = ref(null)
const radarRef = ref(null)
let radarChart = null

// 科研经历模态框
const researchDialogVisible = ref(false)
const isEditingResearch = ref(false)
const editingResearchIndex = ref(-1)
const researchFormRef = ref(null)

// 实习经历模态框
const internshipDialogVisible = ref(false)
const isEditingInternship = ref(false)
const editingInternshipIndex = ref(-1)
const internshipFormRef = ref(null)

// 竞赛获奖模态框
const competitionDialogVisible = ref(false)
const isEditingCompetition = ref(false)
const editingCompetitionIndex = ref(-1)
const competitionFormRef = ref(null)

// 志愿服务模态框
const volunteerDialogVisible = ref(false)
const isEditingVolunteer = ref(false)
const editingVolunteerIndex = ref(-1)
const volunteerFormRef = ref(null)

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

// 实习表单规则和数据
const internshipRules = {
  company: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  position: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入实习时长', trigger: 'blur' }]
}

const currentInternship = reactive({
  company: '',
  position: '',
  duration: '',
  description: ''
})

// 竞赛表单规则和数据
const competitionRules = {
  name: [{ required: true, message: '请输入竞赛名称', trigger: 'blur' }],
  level: [{ required: true, message: '请选择竞赛级别', trigger: 'change' }],
  award: [{ required: true, message: '请输入获奖情况', trigger: 'blur' }]
}

const currentCompetition = reactive({
  name: '',
  level: '国家级',
  award: '',
  time: ''
})

// 志愿服务表单规则和数据
const volunteerRules = {
  organization: [{ required: true, message: '请输入服务组织名称', trigger: 'blur' }],
  role: [{ required: true, message: '请输入志愿岗位', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入服务时长', trigger: 'blur' }]
}

const currentVolunteer = reactive({
  organization: '',
  role: '',
  duration: '',
  description: ''
})

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
    competitions: [],
    volunteers: []
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
  const total = form.practice.internships.length + form.practice.competitions.length + form.practice.volunteers.length
  return Math.min(total * 1.2, 5)
})

const nextStep = async () => {
  if (currentStep.value === 0) {
    if (basicFormRef.value) {
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

// 实习经历管理
const openInternshipDialog = () => {
  isEditingInternship.value = false
  editingInternshipIndex.value = -1
  resetInternshipForm()
  internshipDialogVisible.value = true
}

const editInternship = (index) => {
  const item = form.practice.internships[index]
  currentInternship.company = item.company
  currentInternship.position = item.position
  currentInternship.duration = item.duration
  currentInternship.description = item.description || ''
  isEditingInternship.value = true
  editingInternshipIndex.value = index
  internshipDialogVisible.value = true
}

const saveInternship = async () => {
  await internshipFormRef.value.validate((valid) => {
    if (valid) {
      if (isEditingInternship.value) {
        const index = editingInternshipIndex.value
        form.practice.internships[index] = {
          ...form.practice.internships[index],
          company: currentInternship.company,
          position: currentInternship.position,
          duration: currentInternship.duration,
          description: currentInternship.description
        }
        ElMessage.success('实习经历已更新')
      } else {
        form.practice.internships.push({
          company: currentInternship.company,
          position: currentInternship.position,
          duration: currentInternship.duration,
          description: currentInternship.description
        })
        ElMessage.success('实习经历已添加')
      }
      closeInternshipDialog()
    }
  })
}

const closeInternshipDialog = () => {
  internshipDialogVisible.value = false
  resetInternshipForm()
}

const resetInternshipForm = () => {
  currentInternship.company = ''
  currentInternship.position = ''
  currentInternship.duration = ''
  currentInternship.description = ''
}

const deleteInternship = (index) => {
  ElMessageBox.confirm('确定要删除这条实习经历吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    form.practice.internships.splice(index, 1)
    ElMessage.success('已删除')
  }).catch(() => {})
}

// 竞赛获奖管理
const openCompetitionDialog = () => {
  isEditingCompetition.value = false
  editingCompetitionIndex.value = -1
  resetCompetitionForm()
  competitionDialogVisible.value = true
}

const editCompetition = (index) => {
  const item = form.practice.competitions[index]
  currentCompetition.name = item.name
  currentCompetition.level = item.level
  currentCompetition.award = item.award
  currentCompetition.time = item.time || ''
  isEditingCompetition.value = true
  editingCompetitionIndex.value = index
  competitionDialogVisible.value = true
}

const saveCompetition = async () => {
  await competitionFormRef.value.validate((valid) => {
    if (valid) {
      if (isEditingCompetition.value) {
        const index = editingCompetitionIndex.value
        form.practice.competitions[index] = {
          ...form.practice.competitions[index],
          name: currentCompetition.name,
          level: currentCompetition.level,
          award: currentCompetition.award,
          time: currentCompetition.time
        }
        ElMessage.success('竞赛记录已更新')
      } else {
        form.practice.competitions.push({
          name: currentCompetition.name,
          level: currentCompetition.level,
          award: currentCompetition.award,
          time: currentCompetition.time
        })
        ElMessage.success('竞赛记录已添加')
      }
      closeCompetitionDialog()
    }
  })
}

const closeCompetitionDialog = () => {
  competitionDialogVisible.value = false
  resetCompetitionForm()
}

const resetCompetitionForm = () => {
  currentCompetition.name = ''
  currentCompetition.level = '国家级'
  currentCompetition.award = ''
  currentCompetition.time = ''
}

const deleteCompetition = (index) => {
  ElMessageBox.confirm('确定要删除这条竞赛记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    form.practice.competitions.splice(index, 1)
    ElMessage.success('已删除')
  }).catch(() => {})
}

// 志愿服务管理
const openVolunteerDialog = () => {
  isEditingVolunteer.value = false
  editingVolunteerIndex.value = -1
  resetVolunteerForm()
  volunteerDialogVisible.value = true
}

const editVolunteer = (index) => {
  const item = form.practice.volunteers[index]
  currentVolunteer.organization = item.organization
  currentVolunteer.role = item.role
  currentVolunteer.duration = item.duration
  currentVolunteer.description = item.description || ''
  isEditingVolunteer.value = true
  editingVolunteerIndex.value = index
  volunteerDialogVisible.value = true
}

const saveVolunteer = async () => {
  await volunteerFormRef.value.validate((valid) => {
    if (valid) {
      if (isEditingVolunteer.value) {
        const index = editingVolunteerIndex.value
        form.practice.volunteers[index] = {
          ...form.practice.volunteers[index],
            organization: currentVolunteer.organization,
          role: currentVolunteer.role,
          duration: currentVolunteer.duration,
          description: currentVolunteer.description
        }
        ElMessage.success('志愿服务已更新')
      } else {
        form.practice.volunteers.push({
          organization: currentVolunteer.organization,
          role: currentVolunteer.role,
          duration: currentVolunteer.duration,
          description: currentVolunteer.description
        })
        ElMessage.success('志愿服务已添加')
      }
      closeVolunteerDialog()
    }
  })
}

const closeVolunteerDialog = () => {
  volunteerDialogVisible.value = false
  resetVolunteerForm()
}

const resetVolunteerForm = () => {
  currentVolunteer.organization = ''
  currentVolunteer.role = ''
  currentVolunteer.duration = ''
  currentVolunteer.description = ''
}

const deleteVolunteer = (index) => {
  ElMessageBox.confirm('确定要删除这条志愿服务记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    form.practice.volunteers.splice(index, 1)
    ElMessage.success('已删除')
  }).catch(() => {})
}

// 获取竞赛级别标签类型
const getAwardLevelType = (level) => {
  const types = {
    '国家级': 'danger',
    '省级': 'warning',
    '校级': 'primary',
    '其他': 'info'
  }
  return types[level] || 'info'
}

// GPA 评级
const getGpaGrade = (gpa) => {
  if (gpa >= 3.8) return '优秀'
  if (gpa >= 3.5) return '良好'
  if (gpa >= 3.0) return '中等'
  if (gpa >= 2.5) return '及格'
  return '需提升'
}

const getGpaGradeClass = (gpa) => {
  if (gpa >= 3.8) return 'grade-excellent'
  if (gpa >= 3.5) return 'grade-good'
  if (gpa >= 3.0) return 'grade-medium'
  if (gpa >= 2.5) return 'grade-pass'
  return 'grade-low'
}

const getGpaComment = (gpa, university) => {
  const uniComment = university === '985' ? '985院校背景加分' : university === '211' ? '211院校背景加分' : ''
  if (gpa >= 3.8) return `您的GPA表现非常出色，${uniComment}在申请中具有很强竞争力。`
  if (gpa >= 3.5) return `您的GPA表现良好，${uniComment}申请大多数项目都有不错机会。`
  if (gpa >= 3.0) return `您的GPA处于中等水平，建议通过其他经历弥补。`
  return `您的GPA相对较低，需要重点突出其他优势或考虑提升路径。`
}

// 语言成绩分析
const getLanguageLevel = () => {
  const lang = form.basic.language
  if (!lang) return '未评估'
  if (lang.includes('雅思') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 7) return '优秀'
  if (lang.includes('托福') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 100) return '优秀'
  if (lang.includes('雅思') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 6.5) return '良好'
  if (lang.includes('托福') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 90) return '良好'
  return '需提升'
}

const getLanguageScoreClass = () => {
  const level = getLanguageLevel()
  return level === '优秀' ? 'score-excellent' : level === '良好' ? 'score-good' : 'score-low'
}

const getLanguageComment = () => {
  const lang = form.basic.language
  if (!lang) return '请填写语言成绩以获取详细评估。'
  if (lang.includes('雅思') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 7) return '雅思7分以上满足大部分TOP院校要求。'
  if (lang.includes('托福') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 100) return '托福100分以上竞争力很强。'
  if (lang.includes('雅思') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 6.5) return '雅思6.5分可申请多数院校，建议冲刺更高。'
  if (lang.includes('托福') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 90) return '托福90分基本达标，建议争取更高分数。'
  return '当前语言成绩可能不足，建议备考或考虑语言课程。'
}

// 各维度评语
const getAcademicComment = () => {
  const score = academicScore.value
  if (score >= 4) return '学术背景非常优秀，申请优势明显。'
  if (score >= 3) return '学术背景良好，具备一定竞争力。'
  if (score >= 2) return '学术背景中等，建议补充其他优势。'
  return '学术背景较弱，需要重点突出其他亮点。'
}

const getResearchComment = () => {
  const count = form.academic.research.length
  if (count >= 3) return '科研经历丰富，展现了研究能力。'
  if (count >= 1) return '有一定科研基础，可进一步深化。'
  return '建议增加科研经历以提升竞争力。'
}

const getPracticeComment = () => {
  const total = form.practice.internships.length + form.practice.competitions.length + form.practice.volunteers.length
  if (total >= 5) return '实践经历丰富，展现了综合能力。'
  if (total >= 3) return '有一定实践经验，可继续积累。'
  if (total >= 1) return '实践经验较少，建议补充。'
  return '实践经历空白，强烈建议补充。'
}

const isLoading = ref(false)

const generateReport = async () => {
  isLoading.value = true
  // 模拟3秒加载时间
  await new Promise(resolve => setTimeout(resolve, 3000))
  isLoading.value = false
  currentStep.value = 3
  nextTick(() => {
    renderRadarChart()
  })
}

const renderRadarChart = () => {
  if (!radarRef.value) return

  // 如果已存在图表实例，先销毁
  if (radarChart) {
    radarChart.dispose()
  }

  // 初始化新图表
  radarChart = echarts.init(radarRef.value)

  const chartData = [
    academicScore.value,
    languageScore.value,
    researchScore.value,
    practiceScore.value,
    overallScore.value
  ]

  radarChart.setOption({
    title: {
      text: '竞争力雷达图',
      left: 'center',
      top: 0,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#303133',
        lineHeight: 24
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const data = params.value
        const indicators = ['学术能力', '语言能力', '科研经历', '实践背景', '综合实力']
        let html = '<div style="font-weight:bold;margin-bottom:5px;">各维度得分</div>'
        indicators.forEach((name, index) => {
          html += `<div style="display:flex;justify-content:space-between;gap:15px;">
            <span>${name}:</span>
            <span style="font-weight:bold;color:#667eea;">${data[index].toFixed(1)}/5.0</span>
          </div>`
        })
        return html
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#667eea',
      borderWidth: 1,
      textStyle: {
        color: '#303133',
        fontSize: 12
      },
      padding: [10, 15],
      extraCssText: 'box-shadow: 0 2px 12px rgba(0,0,0,0.15);border-radius:8px;'
    },
    radar: {
      indicator: [
        { name: '学术能力', max: 5 },
        { name: '语言能力', max: 5 },
        { name: '科研经历', max: 5 },
        { name: '实践背景', max: 5 },
        { name: '综合实力', max: 5 }
      ],
      center: ['50%', '58%'],
      shape: 'polygon',
      splitNumber: 5,
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(102, 126, 234, 0.1)', 'rgba(102, 126, 234, 0.15)',
                 'rgba(102, 126, 234, 0.2)', 'rgba(102, 126, 234, 0.25)',
                 'rgba(102, 126, 234, 0.3)']
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.3)'
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.3)'
        }
      },
      axisName: {
        color: '#606266',
        fontSize: 13,
        fontWeight: 'bold',
        padding: [3, 5]
      }
    },
    series: [{
      name: '竞争力',
      type: 'radar',
      data: [{
        value: chartData,
        name: '当前评估',
        areaStyle: {
          color: 'rgba(102, 126, 234, 0.35)'
        },
        lineStyle: {
          width: 2,
          color: 'rgb(102, 126, 234)'
        },
        itemStyle: {
          color: 'rgb(102, 126, 234)',
          borderWidth: 2,
          borderColor: '#fff'
        }
      }],
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    }]
  })
}

// 窗口大小变化时重新调整图表尺寸
const handleResize = () => {
  if (radarChart) {
    radarChart.resize()
  }
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
    isResetting.value = true
    form.basic.name = ''
    form.basic.age = 22
    form.basic.university = ''
    form.basic.gpa = 3.0
    form.basic.language = ''
    form.academic.degree = '本科'
    form.academic.majors = []
    form.academic.averageScore = 80
    form.academic.research = []
    form.practice.internships = []
    form.practice.competitions = []
    form.practice.volunteers = []
    currentStep.value = 0
    practiceTab.value = 'internship'
    localStorage.removeItem('assessment_form')
    // setTimeout 延迟到下一个事件循环，确保 watch 已在 isResetting=true 时执行完毕
    setTimeout(() => { isResetting.value = false }, 0)
  }).catch(() => {})
}

let isLoaded = false
const isResetting = ref(false)

const loadFromStorage = () => {
  const saved = localStorage.getItem('assessment_form')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      if (data.form) {
        Object.assign(form.basic, data.form.basic || {})
        Object.assign(form.academic, data.form.academic || {})
        Object.assign(form.practice, data.form.practice || {})
      }
      if (typeof data.currentStep === 'number') {
        currentStep.value = data.currentStep
      }
      if (data.practiceTab) {
        practiceTab.value = data.practiceTab
      }
    } catch (e) {
      // ignore parse errors
    }
  }
  isLoaded = true
}

// 监听表单数据和步骤变化，自动保存到 localStorage（仅在数据加载完成后生效）
watch(
  [form, currentStep, practiceTab],
  () => {
    if (!isLoaded || isResetting.value) return
    localStorage.setItem('assessment_form', JSON.stringify({
      form: {
        basic: { ...form.basic },
        academic: { ...form.academic },
        practice: {
          internships: [...form.practice.internships],
          competitions: [...form.practice.competitions],
          volunteers: [...form.practice.volunteers]
        }
      },
      currentStep: currentStep.value,
      practiceTab: practiceTab.value
    }))
  },
  { deep: true }
)

// 组件挂载时添加窗口resize监听并恢复数据
onMounted(() => {
  window.addEventListener('resize', handleResize)
  loadFromStorage()
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (radarChart) {
    radarChart.dispose()
    radarChart = null
  }
})
</script>

<style scoped>
.assessment-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.steps-indicator {
  margin-bottom: 30px;
  width: 100%;
}

/* 修复步骤指示器：确保占满整个宽度并正确显示连线 */
:deep(.el-steps) {
  display: flex;
  width: 100%;
}

/* 步骤项样式 */
:deep(.el-step) {
  flex: 1;
  flex-basis: auto !important;
}

/* 修复步骤连线 */
:deep(.el-step__line) {
  position: absolute;
  top: 11px;
  left: 50%;
  right: -50%;
  height: 2px;
  background-color: #c0c4cc;
  z-index: 1;
}

/* 激活状态的连线 */
:deep(.el-step__line-inner) {
  border-width: 1px !important;
  border-style: solid;
  border-color: #67c23a;
  transition: all 0.3s;
}

/* 步骤标题样式 */
:deep(.el-step__title) {
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
}

/* 步骤图标容器 */
:deep(.el-step__head) {
  position: relative;
  z-index: 2;
}

/* 确保步骤指示器在移动端也能正常显示 */
@media (max-width: 768px) {
  :deep(.el-step__title) {
    font-size: 12px;
  }
}

.step-card {
  margin-bottom: 20px;
}

/* 修复 el-radio-button 的 active 状态样式 - 仅选中项 */
:deep(.el-radio-button.is-active .el-radio-button__inner) {
  background-color: #667eea !important;
  border-color: #667eea !important;
  color: #fff !important;
  box-shadow: -1px 0 0 0 #667eea !important;
}

/* 修复 el-checkbox-button 的 active 状态样式 - 仅选中项 */
:deep(.el-checkbox-button.is-checked .el-checkbox-button__inner) {
  background-color: #667eea !important;
  border-color: #667eea !important;
  color: #fff !important;
  box-shadow: -1px 0 0 0 #667eea !important;
}

/* 未选中的 radio button 和 checkbox button 样式 - 白色背景 */
:deep(.el-radio-button:not(.is-active) .el-radio-button__inner),
:deep(.el-checkbox-button:not(.is-checked) .el-checkbox-button__inner) {
  background-color: #fff !important;
  color: #606266 !important;
}

/* 修复 el-radio-button 和 el-checkbox-button 的 hover 状态 */
:deep(.el-radio-button:not(.is-active) .el-radio-button__inner:hover),
:deep(.el-checkbox-button:not(.is-checked) .el-checkbox-button__inner:hover) {
  color: #667eea !important;
}

/* 修复 el-radio-button 和 el-checkbox-button 的 focus 状态 */
:deep(.el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio-button__inner),
:deep(.el-checkbox-button:focus:not(.is-focus):not(:active):not(.is-disabled) .el-checkbox-button__inner) {
  box-shadow: 0 0 2px 2px rgba(102, 126, 234, 0.3) !important;
}

/* 使用 flexbox 确保按钮在容器内水平居中 */
.step-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

/* 统一样式：防止文字换行 + 最小宽度 + 统一高度 */
.step-actions .el-button {
  white-space: nowrap;
  min-width: 100px;
  height: 36px;
  padding: 0 24px;
}

/* 对话框底部按钮：右对齐，间距适当（使用 deep 选择器穿透 teleport） */
:deep(.el-dialog__footer) {
  display: flex !important;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

/* 对话框按钮统一样式 */
:deep(.el-dialog__footer .el-button) {
  white-space: nowrap;
  min-width: 80px;
  height: 36px;
  padding: 0 20px;
}

/* 列表项操作按钮区域 */
.item-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  flex-wrap: nowrap;
}

/* 列表项操作按钮样式 */
.item-actions .el-button {
  white-space: nowrap;
  min-width: 60px;
  height: 32px;
  padding: 0 12px;
}

.gpa-display {
  margin-left: 10px;
  color: #667eea;
  font-weight: bold;
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

/* 加载动画 */
.loading-container {
  text-align: center;
  padding: 60px 0;
}

/* 分析区域 */
.analysis-section {
  margin: 30px 0;
}

.analysis-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.analysis-card h4 {
  margin: 0 0 15px 0;
  color: #667eea;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.analysis-card h4 i {
  font-size: 18px;
}

.gpa-analysis, .language-analysis {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.gpa-value, .lang-text {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.gpa-grade, .lang-level {
  font-size: 18px;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 20px;
}

.grade-excellent { background: #f0f9eb; color: #67c23a; }
.grade-good { background: #ecf5ff; color: #667eea; }
.grade-medium { background: #fdf6ec; color: #e6a23c; }
.grade-pass { background: #fef0f0; color: #f56c6c; }
.grade-low { background: #fef0f0; color: #f56c6c; }

.score-excellent { background: #f0f9eb; color: #67c23a; }
.score-good { background: #ecf5ff; color: #667eea; }
.score-low { background: #fef0f0; color: #f56c6c; }

.analysis-detail {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.score-comment {
  display: block;
  margin-top: 5px;
  font-size: 13px;
  color: #909399;
  font-weight: normal;
}

/* 详细分析区域样式 */
.report-details {
  margin-top: 30px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 12px;
}

.report-details h4 {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.report-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.report-details li {
  padding: 12px 16px;
  margin-bottom: 10px;
  background: #fff;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
}

.report-details li:last-child {
  margin-bottom: 0;
}

.report-details li strong {
  color: #667eea;
  font-weight: 600;
}

/* 雷达图容器样式 */
.radar-chart {
  margin: 20px 0;
  background: #fff;
  border-radius: 12px;
  padding-top: 20px;
}

.practice-tabs {
  margin-top: 10px;
}

.tab-header {
  margin-bottom: 20px;
}

.tab-header .el-button {
  margin-bottom: 15px;
}

.tab-content {
  min-height: 200px;
}

.list-item.enhanced {
  padding: 15px;
  background: #f5f7fa;
  margin: 10px 0;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
}

.list-item.enhanced:hover {
  background: #ecf5ff;
  transform: translateX(5px);
}

.item-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  font-size: 13px;
  color: #606266;
}

.item-meta i {
  margin-right: 4px;
}

.item-desc {
  flex: 1;
  min-width: 200px;
  color: #909399;
  line-height: 1.5;
}

.el-tag {
  font-size: 12px;
}
</style>
