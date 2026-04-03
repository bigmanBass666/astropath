<template>
  <div class="timeline-page">
    <!-- ===== Hero 区域 ===== -->
    <section class="hero-section">
      <div class="container hero-content">
        <h1 class="hero-title">
          时间规划与任务管理
        </h1>
        <p class="hero-subtitle">
          AI 智能解析背景，为你生成专属留学路线图 — 分阶段追踪每个关键节点
        </p>
        <div class="hero-stats">
          <div class="stat-card">
            <div class="stat-value">{{ totalTasks }}</div>
            <div class="stat-label">总任务数</div>
          </div>
          <div class="stat-divider" />
          <div class="stat-card">
            <div class="stat-value stat-value-accent">{{ completedTasks }}</div>
            <div class="stat-label">已完成</div>
          </div>
          <div class="stat-divider" />
          <div class="stat-card">
            <div class="stat-value">{{ overallProgress }}<span class="stat-suffix">%</span></div>
            <div class="stat-label">整体进度</div>
          </div>
          <div class="stat-divider" />
          <div class="stat-card">
            <div class="stat-value stat-value-warning">{{ upcomingTasksCount }}</div>
            <div class="stat-label">即将到期</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 主内容区 ===== -->
    <section class="main-section">
      <div class="data-container">
        <!-- 工具栏 -->
        <div class="toolbar">
          <div class="toolbar-left">
            <div class="view-switcher">
              <button
                v-for="view in viewOptions"
                :key="view.value"
                class="view-btn"
                :class="{ active: currentView === view.value }"
                @click="currentView = view.value"
              >
                {{ view.label }}
              </button>
            </div>
            <select
              v-model="mode"
              class="mode-select"
              @change="handleModeChange"
            >
              <option value="compact">
                紧凑
              </option>
              <option value="normal">
                常规
              </option>
              <option value="relaxed">
                宽松
              </option>
            </select>
          </div>
          <div class="toolbar-right">
            <button
              class="btn btn-ghost"
              @click="deleteAllTasks"
            >
              <el-icon><Delete /></el-icon>
              删除所有任务
            </button>
            <button
              class="btn btn-ghost"
              @click="resetAllTasks"
            >
              <el-icon><RefreshRight /></el-icon>
              重置所有任务
            </button>
            <button
              class="btn btn-primary"
              @click="generateSampleTasks"
            >
              <el-icon><DocumentAdd /></el-icon>
              生成示例任务
            </button>
          </div>
        </div>

        <!-- ECharts 图表视图 -->
        <div
          v-if="currentView === 'chart'"
          class="chart-area animate-on-scroll"
        >
          <div class="chart-card">
            <h3 class="card-title">
              时间规划图表
            </h3>
            <div
              ref="chartRef"
              class="chart-canvas"
            />
          </div>
        </div>

        <!-- 时间线视图 -->
        <div
          v-else-if="currentView === 'timeline'"
          class="timeline-area animate-on-scroll"
        >
          <div class="timeline-card">
            <div class="timeline-layout">
              <!-- 左侧时间线 -->
              <div class="timeline-container">
                <div
                  v-for="milestone in milestones"
                  :key="milestone.id"
                  class="milestone-item"
                  :class="{
                    'is-overdue': isOverdue(milestone.deadline),
                    'is-selected': selectedMilestone?.id === milestone.id
                  }"
                  @click="selectMilestone(milestone)"
                >
                  <div class="milestone-marker">
                    <el-icon :color="getStatusColor(milestone.status)">
                      <CircleCheck />
                    </el-icon>
                  </div>
                  <div class="milestone-content">
                    <div class="milestone-header">
                      <h4>{{ milestone.title }}</h4>
                      <span
                        class="status-tag"
                        :class="'status-' + milestone.status"
                      >
                        {{ getStatusLabel(milestone.status) }}
                      </span>
                    </div>
                    <p class="milestone-date">
                      {{ formatDate(milestone.deadline) }}
                    </p>
                    <p class="milestone-desc">
                      {{ milestone.description }}
                    </p>
                    <div class="milestone-progress">
                      <div class="progress-bar">
                        <div
                          class="progress-fill"
                          :style="{ width: getMilestoneProgress(milestone) + '%' }"
                        />
                      </div>
                      <span class="progress-text">{{ getMilestoneProgress(milestone) }}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 右侧详情面板 -->
              <div
                v-if="selectedMilestone"
                class="detail-panel"
              >
                <div class="detail-header">
                  <h3>{{ selectedMilestone.title }}</h3>
                  <span class="detail-date">{{ formatDate(selectedMilestone.deadline) }}</span>
                </div>
                <p class="detail-desc">
                  {{ selectedMilestone.description }}
                </p>

                <div class="detail-tasks">
                  <div class="tasks-summary">
                    <span class="tasks-count">
                      任务清单 · {{ selectedMilestone.tasks.filter(t => !t.completed).length }}/{{ selectedMilestone.tasks.length }} 未完成
                    </span>
                  </div>
                  <ul class="task-list">
                    <li
                      v-for="task in selectedMilestone.tasks"
                      :key="task.id"
                      class="task-item"
                      :class="{ completed: task.completed }"
                    >
                      <label class="task-checkbox">
                        <input
                          type="checkbox"
                          :checked="task.completed"
                          @change="toggleTask(selectedMilestone.id, task.id)"
                        >
                        <span class="checkbox-custom" />
                      </label>
                      <span class="task-name">{{ task.title }}</span>
                      <span
                        v-if="isUrgent(task.deadline) && !task.completed"
                        class="tag tag-danger"
                      >即将到期</span>
                      <span
                        v-else-if="isOverdue(task.deadline) && !task.completed"
                        class="tag tag-danger"
                      >已逾期</span>
                    </li>
                  </ul>
                  <p
                    v-if="selectedMilestone.tasks.length === 0"
                    class="empty-tasks"
                  >
                    暂无任务
                  </p>
                </div>

                <div class="panel-actions">
                  <button
                    class="btn btn-secondary btn-sm"
                    @click="showAddTaskToMilestone"
                  >
                    <el-icon><Plus /></el-icon>
                    添加任务
                  </button>
                </div>
              </div>

              <!-- 空状态提示 -->
              <div
                v-else
                class="empty-selection"
              >
                <div class="empty-icon">
                  <el-icon :size="48"><CircleCheck /></el-icon>
                </div>
                <p class="empty-title">点击左侧里程碑查看详情</p>
                <p class="empty-desc">选择任意阶段以查看和管理关联的任务</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 看板视图 -->
        <div
          v-else
          class="kanban-area animate-on-scroll"
        >
          <div class="kanban-toolbar">
            <div class="kanban-toolbar-left">
              <button
                v-if="!showOnlyUpcoming"
                class="btn btn-outline btn-sm"
                @click="showUpcomingTasks"
              >
                <el-icon><Bell /></el-icon>
                查看即将到期 (7天)
              </button>
              <button
                v-else
                class="btn btn-secondary btn-sm"
                @click="showAllTasks"
              >
                <el-icon><Back /></el-icon>
                显示全部任务
              </button>
              <span
                v-if="upcomingTasksCount > 0 && !showOnlyUpcoming"
                class="upcoming-hint"
              >
                有 {{ upcomingTasksCount }} 个任务即将到期
              </span>
            </div>
          </div>
          <div class="kanban-board">
            <div
              v-for="column in columns"
              :key="column.id"
              class="kanban-column"
            >
              <div class="column-header">
                <h4>{{ column.title }}</h4>
                <span class="column-count">{{ getColumnTasks(column.id).length }}</span>
              </div>
              <div class="column-content">
                <div
                  v-for="task in getVisibleTasks(column.id)"
                  :key="task.id"
                  class="task-card"
                  :class="{
                    'is-urgent': isUrgent(task.deadline),
                    'is-soon': isSoon(task.deadline),
                    'is-overdue': isOverdue(task.deadline)
                  }"
                  draggable="true"
                  @dragstart="dragStart(task, column.id)"
                  @drop="drop(task, column.id)"
                  @dragover.prevent
                >
                  <div class="task-card-header">
                    <span class="task-title">{{ task.title }}</span>
                    <div class="task-tags">
                      <span
                        v-if="isOverdue(task.deadline)"
                        class="tag tag-danger"
                      >已逾期</span>
                      <span
                        v-else-if="task.reminderEnabled && isSoon(task.deadline)"
                        class="tag tag-warning"
                      >即将到期</span>
                      <span
                        v-else-if="isUrgent(task.deadline)"
                        class="tag tag-warning"
                      >紧急</span>
                      <span
                        v-if="task.reminderEnabled && !isOverdue(task.deadline)"
                        class="tag tag-info"
                      >提醒</span>
                    </div>
                  </div>
                  <div class="task-card-meta">
                    <span class="task-meta-item">{{ getMilestoneTitle(task.milestoneId) }}</span>
                    <span class="task-meta-sep">·</span>
                    <span class="task-meta-item"><el-icon><Calendar /></el-icon> {{ formatDate(task.deadline) }}</span>
                  </div>
                  <div class="task-actions">
                    <button
                      class="btn btn-ghost btn-xs"
                      @click="editTask(task)"
                    >
                      编辑
                    </button>
                    <button
                      class="btn btn-ghost btn-xs btn-danger-text"
                      @click="deleteTask(task.id)"
                    >
                      删除
                    </button>
                  </div>
                </div>
                <button
                  v-if="getHiddenCount(column.id) > 0"
                  class="expand-btn"
                  @click="toggleColumnExpand(column.id)"
                >
                  <el-icon><ArrowDown /></el-icon>
                  {{ isColumnExpanded(column.id) ? '收起' : `展开剩余 ${getHiddenCount(column.id)} 个` }}
                </button>
                <button
                  v-else-if="isColumnExpanded(column.id) && getColumnTasks(column.id).length > VISIBLE_TASK_COUNT"
                  class="expand-btn expand-btn-collapse"
                  @click="toggleColumnExpand(column.id)"
                >
                  <el-icon><ArrowUp /></el-icon>
                  收起
                </button>
                <button
                  class="add-task-btn"
                  @click="showAddTask(column.id)"
                >
                  <el-icon><Plus /></el-icon>
                  添加任务
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 添加/编辑任务对话框 -->
    <Teleport to="body">
      <Transition name="dialog-fade">
        <div
          v-if="taskDialogVisible"
          class="modal-overlay"
          @click.self="taskDialogVisible = false"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h3>{{ editingTask ? '编辑任务' : '添加任务' }}</h3>
              <button
                class="modal-close"
                @click="taskDialogVisible = false"
              >
                ×
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">任务标题</label>
                <input
                  v-model="taskForm.title"
                  type="text"
                  class="form-input"
                  placeholder="请输入任务标题"
                >
              </div>
              <div class="form-group">
                <label class="form-label">所属阶段</label>
                <select
                  v-model="taskForm.milestoneId"
                  class="form-input form-select"
                >
                  <option
                    v-for="m in milestones"
                    :key="m.id"
                    :value="m.id"
                  >
                    {{ m.title }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">截止日期</label>
                <input
                  v-model="taskForm.deadline"
                  type="date"
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">优先级</label>
                <div class="priority-options">
                  <button
                    v-for="p in priorityOptions"
                    :key="p.value"
                    class="priority-btn"
                    :class="{ active: taskForm.priority === p.value }"
                    @click="taskForm.priority = p.value"
                  >
                    {{ p.label }}
                  </button>
                </div>
              </div>
              <div class="form-group">
                <label class="form-checkbox-label">
                  <input
                    v-model="taskForm.reminderEnabled"
                    type="checkbox"
                    class="form-checkbox"
                  >
                  启用提醒
                </label>
              </div>
              <div
                v-if="taskForm.reminderEnabled"
                class="form-group"
              >
                <label class="form-label">提前提醒</label>
                <select
                  v-model="taskForm.reminderDays"
                  class="form-input form-select"
                >
                  <option :value="1">
                    提前1天
                  </option>
                  <option :value="3">
                    提前3天
                  </option>
                  <option :value="7">
                    提前7天
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">描述</label>
                <textarea
                  v-model="taskForm.description"
                  class="form-input form-textarea"
                  rows="3"
                  placeholder="可选：添加任务描述..."
                />
              </div>
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-ghost"
                @click="taskDialogVisible = false"
              >
                取消
              </button>
              <button
                class="btn btn-primary"
                @click="saveTask"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheck, Calendar, Plus, Bell, Back, RefreshRight, DocumentAdd, Delete, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const currentView = ref('chart')
const mode = ref('normal')
const taskDialogVisible = ref(false)
const editingTask = ref(null)
const selectedMilestone = ref(null)
const showOnlyUpcoming = ref(false)
const expandedColumns = ref({})
const VISIBLE_TASK_COUNT = 8
const notificationPermission = ref('default')
const chartRef = ref(null)
let chartInstance = null
const taskForm = reactive({
  title: '',
  milestoneId: 1,
  deadline: null,
  priority: 'medium',
  description: '',
  reminderEnabled: false,
  reminderDays: 1
})

const viewOptions = [
  { label: '图表视图', value: 'chart' },
  { label: '时间线', value: 'timeline' },
  { label: '任务看板', value: 'kanban' }
]

const priorityOptions = [
  { label: '低', value: 'low' },
  { label: '中', value: 'medium' },
  { label: '高', value: 'high' }
]

let isLoaded = false
const isSaving = ref(false)

const MODE_OFFSETS = {
  compact: -30,
  normal: 0,
  relaxed: 30
}

const MILESTONE_TEMPLATES = [
  { id: 1, title: '背景提升', status: 'pending', description: '加强科研、实习、语言成绩' },
  { id: 2, title: '选校定位', status: 'pending', description: '确定目标院校和专业' },
  { id: 3, title: '文书准备', status: 'pending', description: '准备PS、CV、推荐信' },
  { id: 4, title: '网申提交', status: 'pending', description: '提交申请材料' },
  { id: 5, title: '面试准备', status: 'pending', description: '准备面试并参加' },
  { id: 6, title: '录取决策', status: 'pending', description: '选择学校并确认入学' },
  { id: 7, title: '签证办理', status: 'pending', description: '办理签证手续' }
]

const STORAGE_KEY = 'timeline_data'

const loadFromStorage = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const data = JSON.parse(saved)
      if (data.milestones && Array.isArray(data.milestones) && data.milestones.length > 0) {
        milestones.value = data.milestones
      }
      if (data.tasks && Array.isArray(data.tasks)) {
        tasks.value = data.tasks
      }
      if (data.mode && ['compact', 'normal', 'relaxed'].includes(data.mode)) {
        mode.value = data.mode
      }
      if (data.currentView && ['chart', 'timeline', 'kanban'].includes(data.currentView)) {
        currentView.value = data.currentView
      }
    } catch (e) {
      console.warn('Failed to parse timeline data from localStorage:', e)
    }
  }
  isLoaded = true
}

const saveToStorage = () => {
  if (isSaving.value) return
  isSaving.value = true
  try {
    const data = {
      milestones: milestones.value,
      tasks: tasks.value,
      mode: mode.value,
      currentView: currentView.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } finally {
    setTimeout(() => {
      isSaving.value = false
    }, 0)
  }
}

const today = new Date()

const PHASE_INTERVALS = {
  1: 90,
  2: 75,
  3: 90,
  4: 45,
  5: 75,
  6: 60
}

const calculateMilestoneDate = (baseDate, milestoneId) => {
  const offset = MODE_OFFSETS[mode.value]
  const date = new Date(baseDate)
  for (let i = 1; i < milestoneId; i++) {
    const interval = PHASE_INTERVALS[i] || 60
    date.setDate(date.getDate() + interval)
  }
  date.setDate(date.getDate() + offset)
  return formatDateString(date)
}

const formatDateString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const generateMilestones = () => {
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() + 15)

  return MILESTONE_TEMPLATES.map(template => ({
    ...template,
    deadline: calculateMilestoneDate(startDate, template.id),
    tasks: template.id === 1 ? [
      { id: 101, title: '完成背景评估', milestoneId: template.id, status: 'done', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: true, reminderEnabled: false, reminderDays: 1 },
      { id: 102, title: '提交科研项目申请', milestoneId: template.id, status: 'done', deadline: calculateMilestoneDate(startDate, template.id), priority: 'medium', completed: true, reminderEnabled: false, reminderDays: 1 },
      { id: 103, title: '参加暑期实习', milestoneId: template.id, status: 'in-progress', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 3 },
      { id: 104, title: '托福/雅思备考', milestoneId: template.id, status: 'in-progress', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 7 },
      { id: 105, title: 'GRE/GMAT准备', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'medium', completed: false, reminderEnabled: false, reminderDays: 1 },
      { id: 106, title: '发表论文或项目成果', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'medium', completed: false, reminderEnabled: false, reminderDays: 1 }
    ] : template.id === 2 ? [
      { id: 201, title: '选校清单初版', milestoneId: template.id, status: 'done', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: true, reminderEnabled: false, reminderDays: 1 },
      { id: 202, title: '专业方向确认', milestoneId: template.id, status: 'in-progress', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 3 },
      { id: 203, title: '研究目标院校课程设置', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'medium', completed: false, reminderEnabled: false, reminderDays: 1 },
      { id: 204, title: '了解教授研究方向', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'medium', completed: false, reminderEnabled: false, reminderDays: 1 },
      { id: 205, title: '确定推荐人名单', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 7 },
      { id: 206, title: '最终选校名单确定', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 7 }
    ] : template.id === 3 ? [
      { id: 301, title: '个人陈述(PS)初稿', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 7 },
      { id: 302, title: '简历(CV)制作', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 7 },
      { id: 303, title: '联系推荐人', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 3 },
      { id: 304, title: '推荐信跟进', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'medium', completed: false, reminderEnabled: false, reminderDays: 1 },
      { id: 305, title: '文书修改润色', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 7 },
      { id: 306, title: '成绩单认证', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'medium', completed: false, reminderEnabled: false, reminderDays: 1 }
    ] : template.id === 4 ? [
      { id: 401, title: '注册网申账号', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 3 },
      { id: 402, title: '填写申请表', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 7 },
      { id: 403, title: '上传申请材料', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 7 },
      { id: 404, title: '支付申请费用', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'medium', completed: false, reminderEnabled: false, reminderDays: 1 },
      { id: 405, title: '确认材料完整性', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 3 }
    ] : template.id === 5 ? [
      { id: 501, title: '面试技巧培训', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 7 },
      { id: 502, title: '模拟面试练习', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 7 },
      { id: 503, title: '准备常见问题答案', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'medium', completed: false, reminderEnabled: false, reminderDays: 1 },
      { id: 504, title: '参加正式面试', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 3 },
      { id: 505, title: '发送感谢邮件', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'medium', completed: false, reminderEnabled: false, reminderDays: 1 }
    ] : template.id === 6 ? [
      { id: 601, title: '等待录取通知', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 7 },
      { id: 602, title: '收到录取结果汇总', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 7 },
      { id: 603, title: '对比分析各校offer', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 3 },
      { id: 604, title: '缴纳留位费', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 3 },
      { id: 605, title: '确认入学意向', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 7 }
    ] : template.id === 7 ? [
      { id: 701, title: '准备签证材料', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 7 },
      { id: 702, title: '预约签证面试', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 7 },
      { id: 703, title: '参加签证面试', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: true, reminderDays: 3 },
      { id: 704, title: '体检和疫苗接种', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'medium', completed: false, reminderEnabled: false, reminderDays: 1 },
      { id: 705, title: '购买机票', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'medium', completed: false, reminderEnabled: false, reminderDays: 1 },
      { id: 706, title: '安排住宿', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'medium', completed: false, reminderEnabled: false, reminderDays: 1 },
      { id: 707, title: '行李准备', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'low', completed: false, reminderEnabled: false, reminderDays: 1 }
    ] : []
  }))
}

const milestones = ref(generateMilestones())

const tasks = ref([
  { id: 1, title: '完成背景评估', milestoneId: 1, status: 'done', deadline: milestones.value[0]?.deadline || '', priority: 'high', reminderEnabled: false, reminderDays: 1 },
  { id: 2, title: '选校清单初版', milestoneId: 2, status: 'todo', deadline: milestones.value[1]?.deadline || '', priority: 'high', reminderEnabled: false, reminderDays: 1 },
  { id: 3, title: '文书大纲', milestoneId: 3, status: 'todo', deadline: milestones.value[2]?.deadline || '', priority: 'medium', reminderEnabled: false, reminderDays: 1 }
])

const columns = [
  { id: 'todo', title: '待处理' },
  { id: 'in-progress', title: '进行中' },
  { id: 'done', title: '已完成' }
]

const totalTasks = computed(() => {
  return tasks.value.length
})

const completedTasks = computed(() => {
  return tasks.value.filter(t => t.status === 'done').length
})

const overallProgress = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

const isOverdue = (date) => {
  return new Date(date) < new Date(today)
}

const isUrgent = (date) => {
  const targetDate = new Date(date)
  const now = new Date()
  const diffDays = Math.floor((targetDate - now) / (1000 * 60 * 60 * 24))
  return diffDays <= 7 && diffDays > 0
}

const isSoon = (date) => {
  const targetDate = new Date(date)
  const now = new Date()
  const diffDays = Math.floor((targetDate - now) / (1000 * 60 * 60 * 24))
  return diffDays <= 3 && diffDays > 0
}

const formatDate = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

const getStatusColor = (status) => {
  const colors = { completed: '#059669', 'in-progress': '#D97706', pending: '#64748B' }
  return colors[status] || '#64748B'
}

const getStatusLabel = (status) => {
  const labels = { completed: '已完成', 'in-progress': '进行中', pending: '待开始' }
  return labels[status] || status
}

const getMilestoneTitle = (id) => {
  const m = milestones.value.find(m => m.id === id)
  return m ? m.title : 'Unknown'
}

const getMilestoneProgress = (milestone) => {
  const total = milestone.tasks.length
  if (total === 0) return 0
  const completed = milestone.tasks.filter(t => t.completed).length
  return Math.round((completed / total) * 100)
}

const showUpcomingTasks = () => {
  showOnlyUpcoming.value = true
  ElMessage.info('已筛选出7天内到期的任务')
}

const showAllTasks = () => {
  showOnlyUpcoming.value = false
}

const toggleColumnExpand = (columnId) => {
  expandedColumns.value[columnId] = !expandedColumns.value[columnId]
}

const isColumnExpanded = (columnId) => {
  return !!expandedColumns.value[columnId]
}

const getVisibleTasks = (columnId) => {
  const allTasks = getColumnTasks(columnId)
  if (isColumnExpanded(columnId)) return allTasks
  return allTasks.slice(0, VISIBLE_TASK_COUNT)
}

const getHiddenCount = (columnId) => {
  const allTasks = getColumnTasks(columnId)
  const hidden = allTasks.length - VISIBLE_TASK_COUNT
  return hidden > 0 ? hidden : 0
}

const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    ElMessage.warning('当前浏览器不支持通知功能')
    return 'unsupported'
  }
  if (Notification.permission === 'granted') {
    notificationPermission.value = 'granted'
    return 'granted'
  }
  if (Notification.permission === 'denied') {
    notificationPermission.value = 'denied'
    ElMessage.warning('通知权限已被拒绝，请在浏览器设置中启用')
    return 'denied'
  }
  try {
    const permission = await Notification.requestPermission()
    notificationPermission.value = permission
    return permission
  } catch (_e) {
    ElMessage.error('请求通知权限失败')
    return 'error'
  }
}

const sendTaskNotification = (task, daysBefore) => {
  if (notificationPermission.value !== 'granted') return
  const milestone = milestones.value.find(m => m.id === task.milestoneId)
  const milestoneTitle = milestone ? milestone.title : '未知阶段'
  new Notification('留学规划任务提醒', {
    body: `任务"${task.title}"还有${daysBefore}天到期（阶段：${milestoneTitle}）`,
    icon: '/favicon.ico',
    tag: `task-reminder-${task.id}`
  })
}

const checkTaskReminders = () => {
  const now = new Date()
  tasks.value.forEach(task => {
    if (!task.reminderEnabled || task.completed) return
    const deadline = new Date(task.deadline)
    const diffDays = Math.floor((deadline - now) / (1000 * 60 * 60 * 24))
    const reminderDays = task.reminderDays || 1
    if (diffDays === reminderDays || (diffDays === 0 && reminderDays === 0)) {
      sendTaskNotification(task, reminderDays)
    }
  })
}

watch([milestones, tasks, mode, currentView], () => {
  if (isLoaded && !isSaving.value) {
    saveToStorage()
  }
}, { deep: true })

onUnmounted(() => {})

const getColumnTasks = (columnId) => {
  let filtered = tasks.value.filter(t => t.status === columnId)
  if (showOnlyUpcoming.value) {
    filtered = filtered.filter(t => isUpcoming(t.deadline))
  }
  return filtered
}

const isUpcoming = (date) => {
  const targetDate = new Date(date)
  const now = new Date()
  const diffDays = Math.floor((targetDate - now) / (1000 * 60 * 60 * 24))
  return diffDays <= 7 && diffDays > 0
}

const upcomingTasksCount = computed(() => {
  return tasks.value.filter(t => t.status !== 'done' && isUpcoming(t.deadline)).length
})

const selectMilestone = (milestone) => {
  selectedMilestone.value = milestone
}

const handleModeChange = () => {
  milestones.value = generateMilestones()
  tasks.value.forEach(task => {
    const milestone = milestones.value.find(m => m.id === task.milestoneId)
    if (milestone) {
      task.deadline = milestone.deadline
    }
  })
  ElMessage.success(`已切换到${mode.value === 'compact' ? '紧凑' : mode.value === 'relaxed' ? '宽松' : '常规'}模式`)
}

const deleteAllTasks = () => {
  ElMessageBox.confirm(
    '确定要删除所有任务吗？此操作不可恢复！',
    '确认删除',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'error'
    }
  ).then(() => {
    tasks.value = []
    milestones.value.forEach(milestone => {
      milestone.tasks = []
    })
    ElMessage.success('已删除所有任务')
    updateChart()
  }).catch(() => {})
}

const resetAllTasks = () => {
  ElMessageBox.confirm(
    '确定要重置所有任务吗？这将清除所有数据并恢复到初始状态。',
    '确认重置',
    {
      confirmButtonText: '确定重置',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    localStorage.removeItem(STORAGE_KEY)
    milestones.value = generateMilestones()
    tasks.value = []
    selectedMilestone.value = milestones.value[0] || null
    ElMessage.success('已重置所有任务')
    updateChart()
  }).catch(() => {})
}

const generateSampleTasks = () => {
  ElMessageBox.confirm(
    '确定要生成示例任务吗？这将重新生成所有里程碑的示例任务。',
    '确认生成',
    {
      confirmButtonText: '确定生成',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    milestones.value = generateMilestones()
    tasks.value = []
    milestones.value.forEach(milestone => {
      milestone.tasks.forEach(task => {
        tasks.value.push({
          ...task,
          status: task.completed ? 'done' : task.status || 'todo'
        })
      })
    })
    selectedMilestone.value = milestones.value[0] || null
    ElMessage.success(`已生成 ${tasks.value.length} 个示例任务`)
    updateChart()
  }).catch(() => {})
}

const toggleTask = (milestoneId, taskId) => {
  const milestone = milestones.value.find(m => m.id === milestoneId)
  if (!milestone) return
  
  const mTask = milestone.tasks.find(t => t.id === taskId)
  if (!mTask) return
  
  mTask.completed = !mTask.completed
  
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.status = mTask.completed ? 'done' : 'todo'
  }
  
  ElMessage.success('任务状态已更新')
  updateChart()
}

const dragStart = (task, fromColumn) => {
  task._dragFrom = fromColumn
}

const drop = (task, toColumn) => {
  if (task._dragFrom !== toColumn) {
    task.status = toColumn
    ElMessage.success('任务已移动')
  }
}

const showAddTaskToMilestone = () => {
  if (!selectedMilestone.value) return
  editingTask.value = null
  Object.assign(taskForm, {
    title: '',
    milestoneId: selectedMilestone.value.id,
    deadline: selectedMilestone.value.deadline,
    priority: 'medium',
    description: '',
    reminderEnabled: false,
    reminderDays: 1
  })
  taskDialogVisible.value = true
}

const showAddTask = (columnId) => {
  editingTask.value = null
  const milestone = milestones.value.find(m => {
    const task = tasks.value.find(t => t.milestoneId === m.id)
    return task && task.status === columnId
  }) || milestones.value[0]
  Object.assign(taskForm, {
    title: '',
    milestoneId: milestone.id,
    deadline: milestone.deadline,
    priority: 'medium',
    description: '',
    reminderEnabled: false,
    reminderDays: 1
  })
  taskDialogVisible.value = true
}

const editTask = (task) => {
  editingTask.value = task
  Object.assign(taskForm, {
    title: task.title,
    milestoneId: task.milestoneId,
    deadline: task.deadline,
    priority: task.priority,
    description: task.description,
    reminderEnabled: task.reminderEnabled || false,
    reminderDays: task.reminderDays || 1
  })
  taskDialogVisible.value = true
}

const saveTask = () => {
  if (!taskForm.title) {
    ElMessage.warning('请输入任务标题')
    return
  }

  const deadline = taskForm.deadline || milestones.value.find(m => m.id === taskForm.milestoneId)?.deadline || formatDateString(new Date())
  const reminderEnabled = taskForm.reminderEnabled
  const reminderDays = taskForm.reminderDays || 1

  if (editingTask.value) {
    Object.assign(editingTask.value, {
      title: taskForm.title,
      milestoneId: taskForm.milestoneId,
      deadline: deadline,
      priority: taskForm.priority,
      description: taskForm.description,
      reminderEnabled,
      reminderDays
    })
    const milestone = milestones.value.find(m => m.id === taskForm.milestoneId)
    if (milestone) {
      const mTask = milestone.tasks.find(t => t.id === editingTask.value.id)
      if (mTask) {
        Object.assign(mTask, editingTask.value)
      } else {
        milestone.tasks.push({ ...editingTask.value, completed: editingTask.value.status === 'done' })
      }
    }
    ElMessage.success('任务已更新')
    updateChart()
  } else {
    const newTask = {
      id: Date.now(),
      title: taskForm.title,
      milestoneId: taskForm.milestoneId,
      deadline: deadline,
      priority: taskForm.priority,
      description: taskForm.description,
      status: 'todo',
      reminderEnabled,
      reminderDays
    }
    tasks.value.push(newTask)
    const milestone = milestones.value.find(m => m.id === taskForm.milestoneId)
    if (milestone) {
      milestone.tasks.push({ ...newTask, completed: false })
    }
    ElMessage.success('任务已创建')
    updateChart()
    if (reminderEnabled) {
      setTimeout(() => checkTaskReminders(), 100)
    }
  }
  taskDialogVisible.value = false
}

const deleteTask = (id) => {
  ElMessageBox.confirm('确定删除此任务?', '警告', { type: 'warning' })
    .then(() => {
      const idx = tasks.value.findIndex(t => t.id === id)
      if (idx > -1) {
        const task = tasks.value[idx]
        const milestone = milestones.value.find(m => m.id === task.milestoneId)
        if (milestone) {
          const mIdx = milestone.tasks.findIndex(t => t.id === id)
          if (mIdx > -1) {
            milestone.tasks.splice(mIdx, 1)
          }
        }
        tasks.value.splice(idx, 1)
        ElMessage.success('任务已删除')
        updateChart()
      }
    }).catch(() => {})
}

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
}

const updateChart = () => {
  if (!chartInstance) return

  const categories = milestones.value.map(m => m.title)

  const seriesData = milestones.value.map((milestone, index) => {
    const totalTasks = milestone.tasks.length
    const completedTasks = milestone.tasks.filter(t => t.completed).length
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
      name: milestone.title,
      value: [
        index + 1,
        milestone.status === 'completed' ? 100 :
        milestone.status === 'in-progress' ? 50 : 0,
        progress,
        milestone.status
      ]
    }
  })

  const option = {
    color: ['#0F172A', '#64748B'],
    animation: false,
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const data = params[0]
        const milestone = milestones.value[data.dataIndex]
        const total = milestone.tasks.length
        const completed = milestone.tasks.filter(t => t.completed).length
        return `<strong>${milestone.title}</strong><br/>截止日期：${formatDate(milestone.deadline)}<br/>任务进度：${completed}/${total} (${total > 0 ? Math.round(completed/total*100) : 0}%)<br/>状态：${getStatusLabel(milestone.status)}`
      }
    },
    grid: {
      left: '5%',
      right: '15%',
      bottom: '12%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        color: '#475569',
        fontSize: 12,
        interval: 0,
        rotate: 0
      },
      axisLine: {
        lineStyle: { color: '#E2E8F0' }
      }
    },
    yAxis: {
      type: 'value',
      name: '完成度 %',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
        color: '#475569'
      },
      axisLine: {
        lineStyle: { color: '#E2E8F0' }
      },
      splitLine: {
        lineStyle: { color: '#F1F5F9' }
      }
    },
    series: [
      {
        name: '完成度',
        type: 'bar',
        data: seriesData.map(d => d.value[2]),
        itemStyle: {
          color: (params) => {
            const status = milestones.value[params.dataIndex].status
            const colors = {
              completed: '#059669',
              'in-progress': '#D97706',
              pending: '#64748B'
            }
            return colors[status] || '#64748B'
          },
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: (params) => {
            const m = milestones.value[params.dataIndex]
            return `${m.tasks.filter(t => t.completed).length}/${m.tasks.length}`
          },
          fontSize: 12,
          color: '#475569'
        }
      },
      {
        name: '状态线',
        type: 'line',
        data: seriesData.map(d => d.value[1]),
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          width: 2,
          color: '#475569'
        },
        itemStyle: {
          color: '#0F172A',
          borderWidth: 2,
          borderColor: '#fff'
        }
      }
    ],
    legend: {
      data: ['完成度', '状态线'],
      bottom: 0,
      textStyle: { color: '#475569' }
    }
  }

  chartInstance.setOption(option)
}

watch(currentView, (newVal) => {
  if (newVal === 'chart') {
    nextTick(() => {
      initChart()
    })
  }
})

onMounted(() => {
  loadFromStorage()
  if (milestones.value.length > 0) {
    selectedMilestone.value = milestones.value[0]
  }
  requestNotificationPermission()
  setInterval(checkTaskReminders, 60 * 60 * 1000)
  checkTaskReminders()
  if (currentView.value === 'chart') {
    initChart()
  }

  nextTick(() => {
    observeAnimations()
  })
})

onUnmounted(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', () => {
    chartInstance?.resize()
  })
})

const observeAnimations = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el)
  })
}
</script>

<style scoped>
/* ==================== 页面根容器 ==================== */
.timeline-page {
  width: 100%;
  min-height: 100vh;
  background: var(--color-background);
}

/* ==================== Hero 区域 ==================== */
.hero-section {
  position: relative;
  padding: var(--space-16) var(--space-10);
  background: var(--gradient-hero);
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.hero-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  letter-spacing: -1px;
  line-height: var(--leading-tight);
  margin-bottom: var(--space-4);
}

.hero-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  font-weight: var(--font-normal);
  margin-bottom: var(--space-10);
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
  line-height: var(--leading-relaxed);
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.stat-card {
  text-align: center;
  padding: var(--space-4) var(--space-8);
}

.stat-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-solid);
  letter-spacing: -1px;
  line-height: 1;
}

.stat-value-accent {
  color: var(--color-accent);
}

.stat-value-warning {
  color: var(--color-warning);
}

.stat-suffix {
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  margin-left: 2px;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-2);
  font-weight: var(--font-medium);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border);
}

/* ==================== 主内容区 ==================== */
.main-section {
  padding: var(--space-10) var(--space-10) var(--space-20);
}

.data-container {
  max-width: 1600px;
  margin: 0 auto;
}

/* ==================== 工具栏 ==================== */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  padding: var(--space-4) var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.view-switcher {
  display: inline-flex;
  background: var(--color-slate-50);
  border-radius: var(--radius-lg);
  padding: 3px;
  gap: 0;
}

.view-btn {
  padding: var(--space-2) var(--space-5);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.view-btn:hover {
  color: var(--color-text-primary);
  background: var(--color-slate-100);
}

.view-btn.active {
  background: var(--color-solid);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-sm);
}

.mode-select {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  outline: none;
  transition: all var(--transition-fast);
  min-height: 36px;
}

.mode-select:focus {
  border-color: var(--color-solid);
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}

/* ==================== 按钮系统 ==================== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  padding: 10px 20px;
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  min-height: 40px;
}

.btn-sm {
  padding: 6px 14px;
  font-size: var(--text-sm);
  min-height: 32px;
}

.btn-xs {
  padding: 4px 10px;
  font-size: var(--text-xs);
  min-height: 28px;
}

.btn-primary {
  background: var(--color-solid);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: var(--color-solid-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 1.5px solid var(--color-border);
}

.btn-secondary:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: none;
}

.btn-ghost:hover {
  background: var(--color-slate-100);
  color: var(--color-text-primary);
}

.btn-outline {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-outline:hover {
  border-color: var(--color-solid);
  background: var(--color-slate-50);
}

.btn-danger-text:hover {
  color: var(--color-danger);
  background: var(--color-danger-bg);
}

/* ==================== 图表区域 ==================== */
.chart-area {
}

.chart-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-normal);
}

.chart-card:hover {
  box-shadow: var(--shadow-lg);
}

.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-6) 0;
}

.chart-canvas {
  width: 100%;
  height: 420px;
}

/* ==================== 时间线区域 ==================== */
.timeline-area {
  animation: fadeUp 0.5s ease forwards;
}

.timeline-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-sm);
}

.timeline-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: var(--space-8);
  min-height: 520px;
}

/* 左侧时间线容器 */
.timeline-container {
  position: relative;
  padding-left: var(--space-8);
}

.timeline-container::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--color-border);
}

/* 里程碑项 */
.milestone-item {
  position: relative;
  margin-bottom: var(--space-6);
  padding-left: var(--space-6);
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.milestone-item:hover {
  transform: translateX(3px);
}

.milestone-item.is-selected .milestone-content {
  border-color: var(--color-solid);
  box-shadow: var(--shadow-lg);
}

.milestone-item.is-overdue .milestone-date {
  color: var(--color-danger);
}

.milestone-marker {
  position: absolute;
  left: calc(-1 * var(--space-8) + 3px);
  top: 14px;
  width: 28px;
  height: 28px;
  background: var(--color-surface);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  z-index: 1;
  transition: box-shadow var(--transition-fast);
}

.milestone-item:hover .milestone-marker {
  box-shadow: var(--shadow-lg);
}

.milestone-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-5) var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-normal), border-color var(--transition-normal);
}

.milestone-content:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-border);
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
  gap: var(--space-3);
}

.milestone-header h4 {
  margin: 0;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  letter-spacing: 0.25px;
  white-space: nowrap;
  flex-shrink: 0;
}

.status-completed {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.status-in-progress {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.status-pending {
  background: var(--color-slate-100);
  color: var(--color-slate-500);
}

.milestone-date {
  color: var(--color-text-secondary);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
}

.milestone-desc {
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-3) 0;
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
}

.milestone-progress {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--color-slate-100);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-solid);
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
}

.progress-text {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-text-tertiary);
  min-width: 32px;
  text-align: right;
}

/* 右侧详情面板 */
.detail-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}

.detail-header {
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border-light);
}

.detail-header h3 {
  margin: 0 0 var(--space-2) 0;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.detail-date {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
}

.detail-desc {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
  line-height: var(--leading-relaxed);
  font-size: var(--text-sm);
}

.detail-tasks {
  margin-top: var(--space-4);
}

.tasks-summary {
  margin-bottom: var(--space-4);
}

.tasks-count {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.task-item:last-child {
  border-bottom: none;
}

.task-item.completed .task-name {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

.task-checkbox {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.task-checkbox input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  display: block;
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.task-checkbox input:checked + .checkbox-custom {
  background: var(--color-solid);
  border-color: var(--color-solid);
}

.checkbox-custom::after {
  content: '';
  position: absolute;
  display: none;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  top: 3px;
  left: 6px;
  transform: rotate(45deg);
}

.task-checkbox input:checked + .checkbox-custom::after {
  display: block;
}

.task-name {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  flex: 1;
}

.empty-tasks {
  color: var(--color-text-tertiary);
  text-align: center;
  padding: var(--space-6);
  font-size: var(--text-sm);
}

.panel-actions {
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-light);
}

/* 空状态 */
.empty-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: var(--color-text-tertiary);
  background: var(--color-surface-muted);
  border-radius: var(--radius-xl);
  border: 2px dashed var(--color-border);
}

.empty-icon {
  margin-bottom: var(--space-4);
  color: var(--color-slate-300);
}

.empty-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}

.empty-desc {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin: 0;
}

/* ==================== 看板区域 ==================== */
.kanban-area {
  animation: fadeUp 0.5s ease forwards;
}

.kanban-toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
  padding: var(--space-3) var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.kanban-toolbar-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.upcoming-hint {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-warning);
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}

.kanban-column {
  background: var(--color-surface-muted);
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-5);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 2px solid var(--color-border);
}

.column-header h4 {
  margin: 0;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  letter-spacing: 0.3px;
}

.column-count {
  background: var(--color-solid);
  color: var(--color-text-inverse);
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  min-width: 24px;
  text-align: center;
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* 任务卡片 */
.task-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.25s ease, background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  border-left: 4px solid transparent;
  cursor: grab;
  position: relative;
  overflow: hidden;
}

.task-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(15,23,42,0.02) 0%, transparent 60%);
  pointer-events: none;
}

.task-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-border);
  transform: translateY(-1px);
  background: var(--color-surface);
}

.task-card:active {
  cursor: grabbing;
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.task-card.is-soon {
  background: var(--color-accent-subtle);
  border-left-color: var(--color-accent);
  border-color: rgba(217,119,6,0.15);
}

.task-card.is-soon:hover {
  border-color: rgba(217,119,6,0.3);
}

.task-card.is-urgent {
  background: var(--color-danger-bg);
  border-left-color: var(--color-danger);
  border-color: rgba(239,68,68,0.15);
}

.task-card.is-urgent:hover {
  border-color: rgba(239,68,68,0.3);
}

.task-card.is-overdue {
  background: var(--color-danger-bg);
  border-left-color: var(--color-danger);
  border-color: rgba(239,68,68,0.15);
}

.task-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-2);
  gap: var(--space-3);
  position: relative;
  z-index: 1;
}

.task-title {
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: 1.4;
}

.task-tags {
  display: flex;
  gap: var(--space-1);
  flex-wrap: wrap;
  flex-shrink: 0;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: var(--font-medium);
  letter-spacing: 0.25px;
  white-space: nowrap;
}

.tag-danger {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.tag-warning {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.tag-info {
  background: var(--color-info-bg);
  color: var(--color-info);
}

.task-card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 12px;
  color: var(--color-text-tertiary);
  position: relative;
  z-index: 1;
}

.task-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.task-meta-sep {
  opacity: 0.35;
}

.task-actions {
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  padding-top: var(--space-3);
  margin-top: var(--space-2);
  border-top: 1px solid var(--color-border-light);
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.25s ease, opacity 0.2s ease, margin-top 0.2s ease, padding-top 0.2s ease;
  position: relative;
  z-index: 1;
}

.task-card:hover .task-actions {
  max-height: 40px;
  opacity: 1;
}

.expand-btn {
  width: 100%;
  border: none;
  background: var(--color-slate-50);
  color: var(--color-text-secondary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  margin-top: var(--space-2);
}

.expand-btn:hover {
  background: var(--color-slate-100);
  color: var(--color-solid);
}

.add-task-btn {
  width: 100%;
  border: 2px dashed var(--color-border);
  background: transparent;
  color: var(--color-text-tertiary);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.add-task-btn:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  background: var(--color-slate-50);
}

/* ==================== 自定义对话框 ==================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal-content {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6) var(--space-6) 0;
}

.modal-header h3 {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: var(--space-1);
  line-height: 1;
  transition: color var(--transition-fast);
}

.modal-close:hover {
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--space-6);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: 0 var(--space-6) var(--space-6);
}

/* 表单元素 */
.form-group {
  margin-bottom: var(--space-5);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
  min-height: 44px;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus {
  border-color: var(--color-solid);
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}

.form-input::placeholder {
  color: var(--color-text-muted);
}

.form-select {
  appearance: auto;
  cursor: pointer;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  cursor: pointer;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--color-solid);
  cursor: pointer;
}

.priority-options {
  display: flex;
  gap: var(--space-2);
}

.priority-btn {
  flex: 1;
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.priority-btn.active {
  background: var(--color-solid);
  color: var(--color-text-inverse);
  border-color: var(--color-solid);
}

.priority-btn:hover:not(.active) {
  border-color: var(--color-solid);
  color: var(--color-solid);
}

/* 对话框动画 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.25s ease;
}

.dialog-fade-enter-active .modal-content,
.dialog-fade-leave-active .modal-content {
  transition: transform 0.25s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-from .modal-content {
  transform: scale(0.95) translateY(10px);
}

.dialog-fade-leave-to .modal-content {
  transform: scale(0.95) translateY(10px);
}

/* ==================== 响应式 ==================== */
@media (max-width: 1200px) {
  .hero-section {
    padding: var(--space-12) var(--space-6);
  }

  .main-section {
    padding: var(--space-6);
  }

  .timeline-layout {
    grid-template-columns: 1fr;
  }

  .detail-panel {
    position: static;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: var(--text-3xl);
  }

  .hero-stats {
    gap: var(--space-4);
  }

  .stat-card {
    padding: var(--space-3) var(--space-5);
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-right {
    flex-direction: column;
    gap: var(--space-3);
  }

  .view-switcher {
    width: 100%;
    justify-content: center;
  }

  .view-btn {
    flex: 1;
    text-align: center;
  }

  .toolbar-right {
    justify-content: stretch;
  }

  .toolbar-right .btn {
    width: 100%;
    justify-content: center;
  }

  .kanban-board {
    grid-template-columns: 1fr;
  }

  .kanban-column {
    min-height: 280px;
  }

  .main-section {
    padding: var(--space-5);
  }
}

@keyframes fadeUp {
  from {
    transform: translateY(16px);
  }
  to {
    transform: translateY(0);
  }
}
</style>
