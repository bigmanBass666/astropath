<template>
  <div class="timeline-page">
    <h2 class="page-title">时间规划与任务管理</h2>

    <!-- 视图切换 -->
    <div class="view-toggle">
      <el-radio-group v-model="currentView" size="large">
        <el-radio-button label="chart">图表视图</el-radio-button>
        <el-radio-button label="timeline">时间线</el-radio-button>
        <el-radio-button label="kanban">任务看板</el-radio-button>
      </el-radio-group>
      <el-select v-model="mode" placeholder="规划模式" @change="handleModeChange" style="width: 150px;">
        <el-option label="紧凑" value="compact" />
        <el-option label="常规" value="normal" />
        <el-option label="宽松" value="relaxed" />
      </el-select>
    </div>

    <!-- ECharts图表视图 -->
    <div v-if="currentView === 'chart'" class="chart-view">
      <el-card class="chart-card">
        <div ref="chartRef" class="timeline-chart"></div>
      </el-card>
    </div>

    <!-- 时间线视图 -->
    <div v-else-if="currentView === 'timeline'" class="timeline-view">
      <el-card class="timeline-card">
        <div class="timeline-layout">
          <!-- 左侧时间线 -->
          <div class="timeline-container">
            <div v-for="milestone in milestones" :key="milestone.id" class="milestone-item"
              :class="{ 'is-overdue': isOverdue(milestone.deadline), 'is-selected': selectedMilestone?.id === milestone.id }"
              @click="selectMilestone(milestone)">
              <div class="milestone-marker">
                <el-icon :color="getStatusColor(milestone.status)"><CircleCheck /></el-icon>
              </div>
              <div class="milestone-content">
                <div class="milestone-header">
                  <h4>{{ milestone.title }}</h4>
                  <el-tag :type="getStatusTagType(milestone.status)" size="small">
                    {{ getStatusLabel(milestone.status) }}
                  </el-tag>
                </div>
                <p class="milestone-date">{{ formatDate(milestone.deadline) }}</p>
                <p class="milestone-desc">{{ milestone.description }}</p>
              </div>
            </div>
          </div>

          <!-- 右侧详情面板 -->
          <div class="detail-panel" v-if="selectedMilestone">
            <h3>{{ selectedMilestone.title }} - 任务详情</h3>
            <p class="detail-date">截止日期：{{ formatDate(selectedMilestone.deadline) }}</p>
            <p class="detail-desc">{{ selectedMilestone.description }}</p>

            <div class="detail-tasks">
              <h5>任务清单 ({{ selectedMilestone.tasks.filter(t => !t.completed).length }}/{{ selectedMilestone.tasks.length }} 未完成)</h5>
              <ul>
                <li v-for="task in selectedMilestone.tasks" :key="task.id" :class="{ completed: task.completed }">
                  <el-checkbox :model-value="task.completed" @change="toggleTask(selectedMilestone.id, task.id)" />
                  <span>{{ task.title }}</span>
                  <el-tag v-if="isUrgent(task.deadline)" type="danger" size="small">即将到期</el-tag>
                  <el-tag v-else-if="isOverdue(task.deadline)" type="danger" size="small">已逾期</el-tag>
                </li>
              </ul>
              <p v-if="selectedMilestone.tasks.length === 0" class="empty-tasks">暂无任务</p>
            </div>

            <div class="panel-actions">
              <el-button size="small" @click="showAddTaskToMilestone">添加任务</el-button>
            </div>
          </div>

          <!-- 空状态提示 -->
          <div class="empty-selection" v-else>
            <el-icon :size="64" color="#dcdfe6"><CircleCheck /></el-icon>
            <p>点击左侧任意里程碑节点查看详情</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 看板视图 -->
    <div v-else class="kanban-view">
      <div class="kanban-toolbar">
        <el-button
          type="warning"
          :icon="Bell"
          @click="showUpcomingTasks"
          v-if="!showOnlyUpcoming">
          查看即将到期 (7天)
        </el-button>
        <el-button
          type="primary"
          :icon="Back"
          @click="showAllTasks"
          v-else>
          显示全部任务
        </el-button>
        <span class="upcoming-count" v-if="upcomingTasksCount > 0 && !showOnlyUpcoming">
          有 {{ upcomingTasksCount }} 个任务即将到期
        </span>
      </div>
      <div class="kanban-board">
        <div v-for="column in columns" :key="column.id" class="kanban-column">
          <div class="column-header">
            <h4>{{ column.title }}</h4>
            <span class="task-count">{{ getColumnTasks(column.id).length }}</span>
          </div>
          <div class="column-content">
            <div v-for="task in getColumnTasks(column.id)" :key="task.id" class="task-card"
              :class="{
                'is-urgent': isUrgent(task.deadline),
                'is-soon': isSoon(task.deadline),
                'is-overdue': isOverdue(task.deadline)
              }" draggable="true"
              @dragstart="dragStart(task, column.id)" @drop="drop(task, column.id)">
              <div class="task-header">
                <span class="task-title">{{ task.title }}</span>
                <span class="tag-group">
                  <el-tag v-if="isOverdue(task.deadline)" type="danger" size="small">已逾期</el-tag>
                  <el-tag v-else-if="task.reminderEnabled && isSoon(task.deadline)" type="warning" size="small">即将到期</el-tag>
                  <el-tag v-else-if="isUrgent(task.deadline)" type="warning" size="small">紧急</el-tag>
                  <el-tag v-if="task.reminderEnabled && !isOverdue(task.deadline)" type="info" size="small">提醒已开</el-tag>
                </span>
              </div>
              <p class="task-milestone">{{ getMilestoneTitle(task.milestoneId) }}</p>
              <p class="task-deadline">
                <el-icon><Calendar /></el-icon>
                {{ formatDate(task.deadline) }}
              </p>
              <div class="task-actions">
                <el-button size="small" type="text" @click="editTask(task)">编辑</el-button>
                <el-button size="small" type="danger" text @click="deleteTask(task.id)">删除</el-button>
              </div>
            </div>
            <el-button class="add-task-btn" @click="showAddTask(column.id)">
              <el-icon><Plus /></el-icon>
              添加任务
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑任务对话框 -->
    <el-dialog v-model="taskDialogVisible" :title="editingTask ? '编辑任务' : '添加任务'" width="500px">
      <el-form :model="taskForm" label-width="100px">
        <el-form-item label="任务标题">
          <el-input v-model="taskForm.title" placeholder="请输入任务标题" />
        </el-form-item>
        <el-form-item label="所属阶段">
          <el-select v-model="taskForm.milestoneId" placeholder="选择阶段">
            <el-option v-for="m in milestones" :key="m.id" :label="m.title" :value="m.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker v-model="taskForm.deadline" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-radio-group v-model="taskForm.priority">
            <el-radio-button label="low">低</el-radio-button>
            <el-radio-button label="medium">中</el-radio-button>
            <el-radio-button label="high">高</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务提醒">
          <el-checkbox v-model="taskForm.reminderEnabled">启用提醒</el-checkbox>
        </el-form-item>
        <el-form-item label="提前提醒" v-if="taskForm.reminderEnabled">
          <el-select v-model="taskForm.reminderDays" placeholder="选择天数">
            <el-option label="提前1天" :value="1" />
            <el-option label="提前3天" :value="3" />
            <el-option label="提前7天" :value="7" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="taskForm.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="taskDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTask">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheck, Calendar, Plus, Bell, Back } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const currentView = ref('chart')
const mode = ref('normal')
const taskDialogVisible = ref(false)
const editingTask = ref(null)
const selectedMilestone = ref(null)
const showOnlyUpcoming = ref(false)
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

// localStorage 持久化相关
let isLoaded = false
const isSaving = ref(false)

// 模式调整因子
const MODE_OFFSETS = {
  compact: -30,  // 提前30天
  normal: 0,
  relaxed: 30   // 延后30天
}

// 里程碑模板定义（不含日期）
const MILESTONE_TEMPLATES = [
  { id: 1, title: '背景提升', status: 'pending', description: '加强科研、实习、语言成绩' },
  { id: 2, title: '选校定位', status: 'pending', description: '确定目标院校和专业' },
  { id: 3, title: '文书准备', status: 'pending', description: '准备PS、CV、推荐信' },
  { id: 4, title: '网申提交', status: 'pending', description: '提交申请材料' },
  { id: 5, title: '面试准备', status: 'pending', description: '准备面试并参加' },
  { id: 6, title: '录取决策', status: 'pending', description: '选择学校并确认入学' },
  { id: 7, title: '签证办理', status: 'pending', description: '办理签证手续' }
]

// localStorage 持久化
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

// 当前日期作为基准
const today = new Date()

// 阶段间隔天数（从上一个阶段到下一个阶段的平均间隔）
const PHASE_INTERVALS = {
  1: 90,   // 背景提升 -> 选���定位 (3个月)
  2: 75,   // 选校定位 -> 文书准备 (2.5个月)
  3: 90,   // 文书准备 -> 网申提交 (3个月)
  4: 45,   // 网申提交 -> 面试准备 (1.5个月)
  5: 75,   // 面试准备 -> 录取决策 (2.5个月)
  6: 60    // 录取决策 -> 签证办理 (2个月)
}

// 计算里程碑日期
const calculateMilestoneDate = (baseDate, milestoneId) => {
  const offset = MODE_OFFSETS[mode.value]
  const date = new Date(baseDate)

  // 累加之前所有阶段的间隔
  for (let i = 1; i < milestoneId; i++) {
    const interval = PHASE_INTERVALS[i] || 60
    date.setDate(date.getDate() + interval)
  }

  // 应用模式偏移
  date.setDate(date.getDate() + offset)

  return formatDateString(date)
}

// 格式化为 YYYY-MM-DD
const formatDateString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 生成里程碑列表
const generateMilestones = () => {
  // 基于当前日期开始
  const startDate = new Date(today)
  // 第一个里程碑：背景提升 - 从当前日期+15天开始
  startDate.setDate(startDate.getDate() + 15)

  return MILESTONE_TEMPLATES.map(template => ({
    ...template,
    deadline: calculateMilestoneDate(startDate, template.id),
    tasks: template.id === 1 ? [
      { id: 101, title: '完成背景评估', milestoneId: template.id, status: 'done', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: true, reminderEnabled: false, reminderDays: 1 },
      { id: 102, title: '提交科研项目', milestoneId: template.id, status: 'done', deadline: calculateMilestoneDate(startDate, template.id), priority: 'medium', completed: true, reminderEnabled: false, reminderDays: 1 }
    ] : template.id === 2 ? [
      { id: 201, title: '选校清单初版', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'high', completed: false, reminderEnabled: false, reminderDays: 1 },
      { id: 202, title: '专业方向确认', milestoneId: template.id, status: 'todo', deadline: calculateMilestoneDate(startDate, template.id), priority: 'medium', completed: false, reminderEnabled: false, reminderDays: 1 }
    ] : []
  }))
}

const milestones = ref(generateMilestones())

// 任务列表（独立看板使用）
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

// 基于当前日期计算状态
const isOverdue = (date) => {
  return new Date(date) < new Date(today)
}

const isUrgent = (date) => {
  const targetDate = new Date(date)
  const now = new Date()
  const diffDays = Math.floor((targetDate - now) / (1000 * 60 * 60 * 24))
  return diffDays <= 7 && diffDays > 0
}

// 3天内到期
const isSoon = (date) => {
  const targetDate = new Date(date)
  const now = new Date()
  const diffDays = Math.floor((targetDate - now) / (1000 * 60 * 60 * 24))
  return diffDays <= 3 && diffDays > 0
}

const formatDate = (date) => {
  // 格式：2025年3月15日
  const d = new Date(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

const getStatusColor = (status) => {
  const colors = { completed: '#67c23a', 'in-progress': '#e6a23c', pending: '#909399' }
  return colors[status] || '#909399'
}

const getStatusTagType = (status) => {
  const types = { completed: 'success', 'in-progress': 'warning', pending: 'info' }
  return types[status] || 'info'
}

const getStatusLabel = (status) => {
  const labels = { completed: '已完成', 'in-progress': '进行中', pending: '待开始' }
  return labels[status] || status
}

const getMilestoneTitle = (id) => {
  const m = milestones.value.find(m => m.id === id)
  return m ? m.title : 'Unknown'
}

// 显示即将到期任务
const showUpcomingTasks = () => {
  showOnlyUpcoming.value = true
  ElMessage.info('已筛选出7天内到期的任务')
}

// 显示全部任务
const showAllTasks = () => {
  showOnlyUpcoming.value = false
}

// 浏览器通知相关
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
  } catch (e) {
    ElMessage.error('请求通知权限失败')
    return 'error'
  }
}

// 发送任务提醒通知
const sendTaskNotification = (task, daysBefore) => {
  if (notificationPermission.value !== 'granted') {
    return
  }
  const milestone = milestones.value.find(m => m.id === task.milestoneId)
  const milestoneTitle = milestone ? milestone.title : '未知阶段'
  new Notification('留学规划任务提醒', {
    body: `任务"${task.title}"还有${daysBefore}天到期（阶段：${milestoneTitle}）`,
    icon: '/favicon.ico',
    tag: `task-reminder-${task.id}`
  })
}

// 检查任务提醒并发送通知
const checkTaskReminders = () => {
  const now = new Date()
  tasks.value.forEach(task => {
    if (!task.reminderEnabled || task.completed) return
    const deadline = new Date(task.deadline)
    const diffDays = Math.floor((deadline - now) / (1000 * 60 * 60 * 24))
    const reminderDays = task.reminderDays || 1
    // 如果正好达到提醒天数（0表示当天提醒）
    if (diffDays === reminderDays || (diffDays === 0 && reminderDays === 0)) {
      sendTaskNotification(task, reminderDays)
    }
  })
}

// 初始化时请求通知权限

// 监听数据变化自动保存到 localStorage（仅在数据加载完成后生效）
watch([milestones, tasks, mode, currentView], () => {
  if (isLoaded && !isSaving.value) {
    saveToStorage()
  }
}, { deep: true })

onUnmounted(() => {
  // 清理定时器（实际中不需要，页面关闭自动停止）
})

const getColumnTasks = (columnId) => {
  let filtered = tasks.value.filter(t => t.status === columnId)
  if (showOnlyUpcoming.value) {
    // 显示7天内到期的任务
    filtered = filtered.filter(t => isUpcoming(t.deadline))
  }
  return filtered
}

// 即将到期：7天内且未逾期
const isUpcoming = (date) => {
  const targetDate = new Date(date)
  const now = new Date()
  const diffDays = Math.floor((targetDate - now) / (1000 * 60 * 60 * 24))
  return diffDays <= 7 && diffDays > 0
}

// 获取即将到期任务数量
const upcomingTasksCount = computed(() => {
  return tasks.value.filter(t => t.status !== 'done' && isUpcoming(t.deadline)).length
})

const selectMilestone = (milestone) => {
  selectedMilestone.value = milestone
}

const handleModeChange = () => {
  // 重新生成里程碑日期
  milestones.value = generateMilestones()
  // 更新任务日期
  tasks.value.forEach(task => {
    const milestone = milestones.value.find(m => m.id === task.milestoneId)
    if (milestone) {
      task.deadline = milestone.deadline
    }
  })
  ElMessage.success(`已切换到${mode.value === 'compact' ? '紧凑' : mode.value === 'relaxed' ? '宽松' : '常规'}模式`)
}

const toggleTask = (milestoneId, taskId) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.status = task.status === 'done' ? 'todo' : 'done'
    // 同步更新里程碑中的任务状态
    const milestone = milestones.value.find(m => m.id === milestoneId)
    if (milestone) {
      const mTask = milestone.tasks.find(t => t.id === taskId)
      if (mTask) {
        mTask.completed = task.status === 'done'
      }
    }
    ElMessage.success('任务状态已更新')
  }
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
  // 根据列ID找到对应的里程碑
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

  // 计算截止日期（如果为空则使用里程碑日期）
  const deadline = taskForm.deadline || milestones.value.find(m => m.id === taskForm.milestoneId)?.deadline || formatDateString(new Date())

  // 计算提醒设置
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
    // 同步更新里程碑中的任务
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
    // 添加到里程碑
    const milestone = milestones.value.find(m => m.id === taskForm.milestoneId)
    if (milestone) {
      milestone.tasks.push({ ...newTask, completed: false })
    }
    ElMessage.success('任务已创建')
    // 如果启用了提醒，立即检查是否需要通知
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
        // 从里程碑中也删除
        const milestone = milestones.value.find(m => m.id === task.milestoneId)
        if (milestone) {
          const mIdx = milestone.tasks.findIndex(t => t.id === id)
          if (mIdx > -1) {
            milestone.tasks.splice(mIdx, 1)
          }
        }
        tasks.value.splice(idx, 1)
        ElMessage.success('任务已删除')
      }
    }).catch(() => {})
}

// ECharts图表相关
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

  // 构建数据：将里程碑和任务转换为时间线数据
  const categories = milestones.value.map(m => m.title)

  // 准备每个里程碑的数据点
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
    title: {
      text: '时间规划图表',
      left: 'center',
      textStyle: {
        fontSize: 18,
        color: '#303133'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const data = params[0]
        const milestone = milestones.value[data.dataIndex]
        const total = milestone.tasks.length
        const completed = milestone.tasks.filter(t => t.completed).length
        return `
          <strong>${milestone.title}</strong><br/>
          截止日期：${formatDate(milestone.deadline)}<br/>
          任务进度：${completed}/${total} (${total > 0 ? Math.round(completed/total*100) : 0}%)<br/>
          状态：${getStatusLabel(milestone.status)}
        `
      }
    },
    grid: {
      left: '5%',
      right: '15%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        color: '#606266',
        fontSize: 12,
        interval: 0,
        rotate: 0
      },
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '完成度 %',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
        color: '#606266'
      },
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#ebeef5'
        }
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
              completed: '#67c23a',
              'in-progress': '#e6a23c',
              pending: '#909399'
            }
            return colors[status] || '#909399'
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
          color: '#606266'
        }
      },
      {
        name: '状态线',
        type: 'line',
        data: seriesData.map(d => d.value[1]),
        smooth: true,
        symbol: 'circle',
        symbolSize: 12,
        lineStyle: {
          width: 3,
          color: '#667eea'
        },
        itemStyle: {
          color: '#667eea',
          borderWidth: 2,
          borderColor: '#fff'
        }
      }
    ],
    legend: {
      data: ['完成度', '状态线'],
      bottom: 0
    }
  }

  chartInstance.setOption(option)
}

// 监听视图切换
watch(currentView, (newVal) => {
  if (newVal === 'chart') {
    nextTick(() => {
      initChart()
    })
  }
})

// 监听数据变化更新图表
watch([milestones, tasks], () => {
  if (currentView.value === 'chart' && chartInstance) {
    updateChart()
  }
}, { deep: true })

onMounted(() => {
  console.log('Timeline loaded in mode:', mode.value)
  // 从localStorage恢复数据
  loadFromStorage()
  // 默认选中第一个里程碑
  if (milestones.value.length > 0) {
    selectedMilestone.value = milestones.value[0]
  }
  // 请求通知权限
  requestNotificationPermission()
  // 每小时检查一次提醒
  setInterval(checkTaskReminders, 60 * 60 * 1000)
  // 立即检查一次
  checkTaskReminders()

  // 初始化图表（如果当前是图表视图）
  if (currentView.value === 'chart') {
    initChart()
  }
})

onUnmounted(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', () => {
    chartInstance?.resize()
  })
})
</script>

<style scoped>
.timeline-page {
  max-width: 1200px;
  margin: 0 auto;
}

.view-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

/* 图表视图 */
.chart-view {
  margin-bottom: 24px;
}

.chart-card {
  padding: 20px;
}

.timeline-chart {
  width: 100%;
  height: 400px;
}

.timeline-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  min-height: 500px;
}

/* 左侧时间线 */
.timeline-container {
  position: relative;
  padding-left: 30px;
}

.timeline-container::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #dcdfe6, #dcdfe6 100%);
}

.milestone-item {
  position: relative;
  margin-bottom: 24px;
  padding-left: 24px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.milestone-item:hover {
  transform: translateX(4px);
}

.milestone-item.is-selected .milestone-content {
  border: 2px solid #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
}

.milestone-item.is-overdue .milestone-date {
  color: #f56c6c;
}

.milestone-marker {
  position: absolute;
  left: -14px;
  top: 12px;
  width: 28px;
  height: 28px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;
  transition: transform 0.2s;
}

.milestone-item:hover .milestone-marker {
  transform: scale(1.1);
}

.milestone-content {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.milestone-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.milestone-date {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.milestone-desc {
  color: #606266;
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
}

/* 右侧详情面板 */
.detail-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
}

.detail-panel h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #303133;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.detail-date {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 14px;
}

.detail-desc {
  color: #606266;
  margin-bottom: 20px;
  line-height: 1.6;
}

.detail-tasks {
  margin-top: 16px;
}

.detail-tasks h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #303133;
}

.detail-tasks ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-tasks li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px dashed #ebeef5;
}

.detail-tasks li:last-child {
  border-bottom: none;
}

.detail-tasks li.completed span {
  text-decoration: line-through;
  color: #909399;
}

.empty-tasks {
  color: #909399;
  text-align: center;
  padding: 20px;
  font-size: 14px;
}

.panel-actions {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.empty-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #909399;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  border: 2px dashed #dcdfe6;
}

.empty-selection p {
  margin-top: 16px;
  font-size: 14px;
}

/* 看板工具栏 */
.kanban-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.upcoming-count {
  color: #e6a23c;
  font-size: 14px;
  font-weight: 500;
}

/* 看板布局 */
.kanban-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.kanban-column {
  background: #f5f7fa;
  border-radius: 12px;
  padding: 16px;
  min-height: 400px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e4e7ed;
}

.column-header h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.task-count {
  background: #667eea;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 任务卡片样式 */
.task-card {
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  border-left: 3px solid transparent;
  cursor: grab;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.task-card:active {
  cursor: grabbing;
}

/* 3天内到期 - 黄色高亮 */
.task-card.is-soon {
  background: #fdf6ec;
  border-left-color: #e6a23c;
}

.task-card.is-soon .task-title {
  color: #846d1a;
}

/* 7天内到期 - 橙色 */
.task-card.is-urgent {
  background: #fef0f0;
  border-left-color: #f56c6c;
}

/* 已逾期 - 红色高亮 */
.task-card.is-overdue {
  background: #fef0f0;
  border-left-color: #f56c6c;
}

.task-card.is-overdue .task-title {
  color: #c0392b;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}

.task-title {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
}

.tag-group {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.task-milestone {
  font-size: 12px;
  color: #909399;
  margin: 0 0 8px 0;
}

.task-deadline {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #606266;
  margin: 0 0 8px 0;
}

.task-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.add-task-btn {
  width: 100%;
  border-style: dashed;
  background: transparent;
  color: #909399;
  padding: 12px;
}

.add-task-btn:hover {
  background: #f5f7fa;
  color: #667eea;
}

/* 响应式看板 */
@media (max-width: 1024px) {
  .kanban-board {
    grid-template-columns: 1fr;
  }
}

/* 响应式 */
@media (max-width: 1024px) {
  .timeline-layout {
    grid-template-columns: 1fr;
  }

  .detail-panel {
    position: fixed;
    right: 0;
    top: 0;
    width: 400px;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    z-index: 1000;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    transition: transform 0.3s;
  }

  .detail-panel.show {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .view-toggle {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .view-toggle .el-radio-group {
    justify-content: center;
  }

  .view-toggle .el-select {
    align-self: center;
  }

  .milestone-content {
    padding: 12px 16px;
  }

  .milestone-header h4 {
    font-size: 15px;
  }
}
</style>
