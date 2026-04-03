<template>
  <div class="school-card" :class="{ 'is-favorite': isFavorite }">
    <div class="card-header">
      <div class="ranking-badge" :class="rankingClass">
        <span class="ranking-icon">{{ rankingIcon }}</span>
        <span class="ranking-text">#{{ recommendation.ranking }}</span>
      </div>
      <div class="header-actions">
        <el-button
          :type="isFavorite ? 'warning' : 'default'"
          :icon="isFavorite ? StarFilled : Star"
          circle
          size="small"
          @click="toggleFavorite"
        />
      </div>
    </div>

    <div class="school-info">
      <h4 class="school-name">{{ recommendation.schoolName }}</h4>
      <div class="school-meta">
        <el-tag size="small" effect="plain">{{ school?.country }}</el-tag>
        <el-tag size="small" effect="plain" type="info">{{ school?.ranking }}</el-tag>
      </div>
    </div>

    <div class="ai-reason">
      <div class="reason-header">
        <el-icon><ChatDotRound /></el-icon>
        <span>AI推荐理由</span>
      </div>
      <p class="reason-text">{{ recommendation.aiReason }}</p>
    </div>

    <div class="match-section">
      <div class="match-info">
        <span class="match-label">匹配度</span>
        <span class="match-score" :style="{ color: matchColor }">{{ recommendation.matchScore }}%</span>
      </div>
      <el-progress
        :percentage="recommendation.matchScore"
        :color="matchColor"
        :stroke-width="8"
        :show-text="false"
      />
    </div>

    <div class="card-actions">
      <el-button type="primary" plain @click="viewDetail">
        <el-icon><View /></el-icon>
        查看详情
      </el-button>
      <el-button type="warning" plain @click="showAnalysis">
        <el-icon><QuestionFilled /></el-icon>
        为什么推荐
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Star, StarFilled, ChatDotRound, View, QuestionFilled } from '@element-plus/icons-vue'
import { schoolsData } from '@/utils/recommendationEngine'

const props = defineProps({
  recommendation: {
    type: Object,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-favorite', 'view-detail', 'show-analysis'])

const school = computed(() => {
  return schoolsData.find(s => s.id === props.recommendation.schoolId)
})

const rankingClass = computed(() => {
  const rank = props.recommendation.ranking
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  return 'rank-normal'
})

const rankingIcon = computed(() => {
  const rank = props.recommendation.ranking
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return '•'
})

const matchColor = computed(() => {
  const score = props.recommendation.matchScore
  if (score >= 85) return '#67c23a'
  if (score >= 70) return '#e6a23c'
  return '#f56c6c'
})

const toggleFavorite = () => {
  emit('toggle-favorite', props.recommendation.schoolId)
}

const viewDetail = () => {
  emit('view-detail', props.recommendation.schoolId)
}

const showAnalysis = () => {
  emit('show-analysis', props.recommendation)
}
</script>

<style scoped>
.school-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.school-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.school-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.school-card:hover::before {
  opacity: 1;
}

.school-card.is-favorite {
  border-color: #f0c239;
  box-shadow: 0 8px 30px rgba(240, 194, 57, 0.15);
}

.school-card.is-favorite::before {
  background: linear-gradient(90deg, #f0c239 0%, #ff9f43 100%);
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.ranking-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.rank-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
  color: #8b6914;
}

.rank-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  color: #555;
}

.rank-bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #daa520 100%);
  color: white;
}

.rank-normal {
  background: #f5f5f5;
  color: #666;
}

.ranking-icon {
  font-size: 16px;
}

.school-info {
  margin-bottom: 16px;
}

.school-name {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.3;
}

.school-meta {
  display: flex;
  gap: 8px;
}

.ai-reason {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 16px;
  border: 1px solid #e0e7ff;
}

.reason-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: #667eea;
  font-size: 13px;
  font-weight: 600;
}

.reason-text {
  margin: 0;
  font-size: 14px;
  color: #4a5568;
  line-height: 1.6;
}

.match-section {
  margin-bottom: 16px;
}

.match-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.match-label {
  font-size: 13px;
  color: #666;
}

.match-score {
  font-size: 18px;
  font-weight: 700;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.card-actions .el-button {
  flex: 1;
  border-radius: 8px;
}
</style>
