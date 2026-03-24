<template>
  <div class="timeline-page">
    <h2 class="page-title">时间规划与任务管理</h2>

    <!-- 视图切换 -->
    <div class="view-toggle">
      <el-radio-group v-model="currentView" size="large">
        <el-radio-button label="timeline">时间线</el-radio-button>
        <el-radio-button label="kanban">任务看板</el-radio-button>
      </el-radio-group>
      <el-select v-model="mode" placeholder="规划模式" style="width: 150px;">
        <el-option label="紧凑" value="compact" />
        <el-option label="常规" value="normal" />
        <el-option label="宽松" value="relaxed" />
      </el-select>
    </div>

    <!-- 时间线视图 -->
    <div v-if="currentView === 'timeline'" class="timeline-view">
      <el-card class="timeline-card">
        <div class="timeline-container">
          <div v-for="milestone in milestones" :key="milestone.id" class="milestone-item"
            :class="{ 'is-overdue': isOverdue(milestone.deadline) }">
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
              <div class="milestone-tasks">
                <h5>相关任务 ({{ milestone.tasks.filter(t => !t.completed).length }}/{{ milestone.tasks.length }})</h5>
                <ul>
                  <li v-for="task in milestone.tasks" :key="task.id" :class="{ completed: task.completed }">
                    <el-checkbox :model-value="task.completed" @change="toggleTask(milestone.id, task.id)" />
                    <span>{{ task.title }}</span>
                    <el-tag v-if="isUrgent(task.deadline)" type="danger" size="small">即将到期</el-tag>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 看板视图 -->
    <div v-else class="kanban-view">
      <div class="kanban-board">
        <div v-for="column in columns" :key="column.id" class="kanban-column">
          <div class="column-header">
            <h4>{{ column.title }}</h4>
            <span class="task-count">{{ getColumnTasks(column.id).length }}</span>
          </div>
          <div class="column-content">
            <div v-for="task in getColumnTasks(column.id)" :key="task.id" class="task-card"
              :class="{ 'is-urgent': isUrgent(task.deadline) }" draggable="true"
              @dragstart="dragStart(task, column.id)" @drop="drop(task, column.id)">
              <div class="task-header">
                <span class="task-title">{{ task.title }}</span>
                <el-tag v-if="isUrgent(task.deadline)" type="danger" size="small">紧急</el-tag>
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
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheck, Calendar, Plus } from '@element-plus/icons-vue'

const currentView = ref('timeline')
const mode = ref('normal')
const taskDialogVisible = ref(false)
const editingTask = ref(null)
const taskForm = reactive({
  title: '',
  milestoneId: 1,
  deadline: null,
  priority: 'medium',
  description: ''
})

const milestones = ref([
  { id: 1, title: '背景提升', status: 'completed', deadline: '2025-03-01', description: '加强科研、实习、语言成绩', tasks: [] },
  { id: 2, title: '选校定位', status: 'in-progress', deadline: '2025-06-01', description: '确定目标院校和专业', tasks: [] },
  { id: 3, title: '文书准备', status: 'pending', deadline: '2025-08-15', description: '准备PS、CV、推荐信', tasks: [] },
  { id: 4, title: '网申提交', status: 'pending', deadline: '2025-12-01', description: '提交申请材料', tasks: [] },
  { id: 5, title: '面试准备', status: 'pending', deadline: '2026-01-15', description: '准备面试并参加', tasks: [] },
  { id: 6, title: '录取决策', status: 'pending', deadline: '2026-04-01', description: '选择学校并确认入学', tasks: [] },
  { id: 7, title: '签证办理', status: 'pending', deadline: '2026-06-01', description: '办理签证手续', tasks: [] }
])

const tasks = ref([
  { id: 1, title: '完成背景评估', milestoneId: 1, status: 'done', deadline: '2025-03-01', priority: 'high' },
  { id: 2, title: '选校清单初版', milestoneId: 2, status: 'todo', deadline: '2025-06-15', priority: 'high' },
  { id: 3, title: '文书大纲', milestoneId: 3, status: 'todo', deadline: '2025-08-30', priority: 'medium' }
])

const columns = [
  { id: 'todo', title: '待处理' },
  { id: 'in-progress', title: '进行中' },
  { id: 'done', title: '已完成' }
]

const isOverdue = (date) => {
  return new Date(date) < new Date()
}

const isUrgent = (date) => {
  const diffDays = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24)
  return diffDays <= 7 && diffDays > 0
}

const formatDate = (date) => {
  return date
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

const getColumnTasks = (columnId) => {
  return tasks.value.filter(t => t.status === columnId)
}

const toggleTask = (milestoneId, taskId) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.status = task.status === 'done' ? 'todo' : 'done'
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

const showAddTask = (columnId) => {
  editingTask.value = null
  Object.assign(taskForm, {
    title: '',
    milestoneId: milestones.value[0].id,
    deadline: null,
    priority: 'medium',
    description: ''
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
    description: task.description
  })
  taskDialogVisible.value = true
}

const saveTask = () => {
  if (!taskForm.title) {
    ElMessage.warning('请输入任务标题')
    return
  }
  if (editingTask.value) {
    Object.assign(editingTask.value, taskForm)
    ElMessage.success('任务已更新')
  } else {
    const newTask = {
      id: Date.now(),
      title: taskForm.title,
      milestoneId: taskForm.milestoneId,
      deadline: taskForm.deadline || '2025-12-31',
      priority: taskForm.priority,
      description: taskForm.description,
      status: 'todo'
    }
    tasks.value.push(newTask)
    ElMessage.success('任务已创建')
  }
  taskDialogVisible.value = false
}

const deleteTask = (id) => {
  ElMessageBox.confirm('确定删除此任务?', '警告', { type: 'warning' })
    .then(() => {
      const idx = tasks.value.findIndex(t => t.id === id)
      if (idx > -1) {
        tasks.value.splice(idx, 1)
        ElMessage.success('任务已删除')
      }
    }).catch(() => {})
}

onMounted(() => {
  // 根据模式调整时间线日期（简化版）
  console.log('Timeline loaded in mode:', mode.value)
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
  margin-bottom: 20px;
}

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
  background: #dcdfe6;
}

.milestone-item {
  position: relative;
  margin-bottom: 30px;
  padding-left: 30px;
}

.milestone-marker {
  position: absolute;
  left: -14px;
  top: 10px;
  width: 28px;
  height: 28px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.milestone-content {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.milestone-header h4 {
  margin: 0;
  font-size: 18px;
}

.milestone-date {
  color: #667eea;
  font-weight: bold;
  margin-bottom: 8px;
}

.milestone-desc {
  color: #606266;
  margin-bottom: 15px;
}

.milestone-tasks ul {
  list-style: none;
  padding: 0;
}

.milestone-tasks li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px dashed #ebeef5;
}

.milestone-tasks li.completed span {
  text-decoration: line-through;
  color: #909399;
}

/* Kanban */
.kanban-board {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;
}

.kanban-column {
  flex: 1;
  min-width: 300px;
  background: #f0f2f5;
  border-radius: 12px;
  padding: 15px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #dcdfe6;
}

.task-count {
  background: #dcdfe6;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: grab;
}

.task-card:active {
  cursor: grabbing;
}

.task-card.is-urgent {
  border-left: 4px solid #f56c6c;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-title {
  font-weight: bold;
}

.task-milestone {
  color: #909399;
  font-size: 12px;
  margin-bottom: 8px;
}

.task-deadline {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #606266;
  font-size: 13px;
  margin-bottom: 10px;
}

.task-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.add-task-btn {
  border: 2px dashed #dcdfe6;
  background: transparent;
  color: #909399;
  width: 100%;
  justify-content: center;
  padding: 15px;
}
</style>
