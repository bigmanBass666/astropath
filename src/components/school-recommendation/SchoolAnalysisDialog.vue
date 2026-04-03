<template>
  <el-dialog
    v-model="visible"
    title="AI 深度分析"
    width="650px"
    :close-on-click-modal="false"
    class="analysis-dialog"
  >
    <div class="analysis-content" v-if="school && analysis">
      <!-- 学校头部信息 -->
      <div class="school-header">
        <h3 class="school-name">{{ school.name }}</h3>
        <div class="school-tags">
          <el-tag>{{ school.country }}</el-tag>
          <el-tag type="info">{{ school.ranking }}</el-tag>
          <el-tag type="success">录取率 {{ school.acceptanceRate }}</el-tag>
        </div>
      </div>

      <!-- 匹配度评估 -->
      <div class="match-assessment">
        <div class="assessment-header">
          <span class="assessment-label">录取概率评估</span>
          <span class="assessment-value" :style="{ color: getProbabilityColor(analysis.admissionProbability) }">
            {{ analysis.admissionProbability }}
          </span>
        </div>
      </div>

      <!-- 匹配点 -->
      <div class="analysis-section" v-if="analysis.matchPoints.length > 0">
        <div class="section-header">
          <el-icon color="#67c23a"><CircleCheck /></el-icon>
          <span>匹配点</span>
        </div>
        <ul class="analysis-list">
          <li v-for="(point, index) in analysis.matchPoints" :key="index">
            {{ point }}
          </li>
        </ul>
      </div>

      <!-- 风险提示 -->
      <div class="analysis-section" v-if="analysis.risks.length > 0">
        <div class="section-header warning">
          <el-icon color="#e6a23c"><Warning /></el-icon>
          <span>风险提示</span>
        </div>
        <ul class="analysis-list warning">
          <li v-for="(risk, index) in analysis.risks" :key="index">
            {{ risk }}
          </li>
        </ul>
      </div>

      <!-- 申请建议 -->
      <div class="analysis-section" v-if="analysis.suggestions.length > 0">
        <div class="section-header info">
          <el-icon color="#409eff"><InfoFilled /></el-icon>
          <span>申请建议</span>
        </div>
        <ul class="analysis-list">
          <li v-for="(suggestion, index) in analysis.suggestions" :key="index">
            {{ suggestion }}
          </li>
        </ul>
      </div>

      <!-- 追问输入 -->
      <div class="follow-up-section">
        <el-input
          v-model="followUpQuestion"
          placeholder="还有疑问？继续追问AI..."
          class="follow-up-input"
          @keyup.enter="submitFollowUp"
        >
          <template #append>
            <el-button @click="submitFollowUp" :icon="Position" />
          </template>
        </el-input>
      </div>

      <!-- 追问回复 -->
      <div class="follow-up-response" v-if="followUpResponse">
        <div class="response-header">
          <el-icon><ChatDotRound /></el-icon>
          <span>AI回复</span>
        </div>
        <p class="response-text">{{ followUpResponse }}</p>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="loading-state" v-else-if="loading">
      <div class="thinking-animation">
        <div class="thinking-dot"></div>
        <div class="thinking-dot"></div>
        <div class="thinking-dot"></div>
      </div>
      <p class="thinking-text">AI正在分析中...</p>
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="viewSchoolDetail">
        <el-icon><View /></el-icon>
        查看学校详情
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { CircleCheck, Warning, InfoFilled, Position, ChatDotRound, View } from '@element-plus/icons-vue'
import { schoolsData } from '@/utils/recommendationEngine'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  recommendation: {
    type: Object,
    default: null
  },
  analysis: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'view-detail', 'follow-up'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const followUpQuestion = ref('')
const followUpResponse = ref('')

const school = computed(() => {
  if (!props.recommendation) return null
  return schoolsData.find(s => s.id === props.recommendation.schoolId)
})

const getProbabilityColor = (probability) => {
  if (probability.includes('高') || probability.includes('90') || probability.includes('80')) {
    return '#67c23a'
  }
  if (probability.includes('中') || probability.includes('70') || probability.includes('60')) {
    return '#e6a23c'
  }
  return '#f56c6c'
}

const submitFollowUp = () => {
  if (!followUpQuestion.value.trim()) return
  // 模拟AI回复
  followUpResponse.value = `关于"${followUpQuestion.value}"，这是一个很好的问题。基于你的背景和这所学校的要求，我建议你重点关注申请文书的准备，突出你的科研经历和学术潜力。`
  followUpQuestion.value = ''
}

const viewSchoolDetail = () => {
  if (school.value) {
    emit('view-detail', school.value.id)
    visible.value = false
  }
}

watch(() => props.modelValue, (val) => {
  if (val) {
    followUpQuestion.value = ''
    followUpResponse.value = ''
  }
})
</script>

<style scoped>
.analysis-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 15px;
}

.analysis-content {
  max-height: 60vh;
  overflow-y: auto;
}

.school-header {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;
}

.school-name {
  margin: 0 0 12px 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
}

.school-tags {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.match-assessment {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 20px;
  text-align: center;
}

.assessment-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.assessment-label {
  font-size: 14px;
  color: #666;
}

.assessment-value {
  font-size: 20px;
  font-weight: 700;
}

.analysis-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #67c23a;
  margin-bottom: 12px;
}

.section-header.warning {
  color: #e6a23c;
}

.section-header.info {
  color: #409eff;
}

.analysis-list {
  margin: 0;
  padding-left: 24px;
  color: #4a5568;
  line-height: 1.8;
}

.analysis-list li {
  margin-bottom: 8px;
}

.follow-up-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.follow-up-input :deep(.el-input__wrapper) {
  border-radius: 20px;
}

.follow-up-input :deep(.el-input-group__append) {
  border-radius: 0 20px 20px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
}

.follow-up-input :deep(.el-input-group__append .el-button) {
  color: white;
}

.follow-up-response {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9ff;
  border-radius: 10px;
  border-left: 3px solid #667eea;
}

.response-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: #667eea;
  font-size: 13px;
  font-weight: 600;
}

.response-text {
  margin: 0;
  font-size: 14px;
  color: #4a5568;
  line-height: 1.6;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
}

.thinking-animation {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.thinking-dot {
  width: 10px;
  height: 10px;
  background: #667eea;
  border-radius: 50%;
  animation: thinking-bounce 1.4s ease-in-out infinite;
}

.thinking-dot:nth-child(1) { animation-delay: -0.32s; }
.thinking-dot:nth-child(2) { animation-delay: -0.16s; }
.thinking-dot:nth-child(3) { animation-delay: 0s; }

@keyframes thinking-bounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.2); opacity: 1; }
}

.thinking-text {
  color: #667eea;
  font-size: 14px;
}
</style>
