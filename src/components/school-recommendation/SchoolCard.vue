<template>
  <div
    class="school-card"
    :class="{ 'is-favorite': isFavorite }"
  >
    <div class="card-header">
      <div
        class="ranking-badge"
        :class="rankingClass"
      >
        <el-icon
          :size="20"
          class="ranking-icon"
        >
          <component :is="rankingIcon" />
        </el-icon>
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
      <h4 class="school-name">
        {{ recommendation.schoolName }}
      </h4>
      <div class="school-meta">
        <el-tag
          size="small"
          effect="plain"
        >
          {{ school?.country }}
        </el-tag>
        <el-tag
          size="small"
          effect="plain"
          type="info"
        >
          {{ school?.ranking }}
        </el-tag>
      </div>
    </div>

    <div class="ai-reason">
      <div class="reason-header">
        <el-icon><ChatDotRound /></el-icon>
        <span>AI推荐理由</span>
      </div>
      <p class="reason-text">
        {{ recommendation.aiReason }}
      </p>
    </div>

    <div class="match-section">
      <div class="match-info">
        <span class="match-label">匹配度</span>
        <span
          class="match-score"
          :style="{ color: matchColor }"
        >{{ recommendation.matchScore }}%</span>
      </div>
      <el-progress
        :percentage="recommendation.matchScore"
        :color="matchColor"
        :stroke-width="8"
        :show-text="false"
      />
    </div>

    <div class="card-actions">
      <el-button
        type="primary"
        plain
        @click="viewDetail"
      >
        <el-icon><View /></el-icon>
        查看详情
      </el-button>
      <el-button
        type="warning"
        plain
        @click="showAnalysis"
      >
        <el-icon><QuestionFilled /></el-icon>
        为什么推荐
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Star, StarFilled, ChatDotRound, View, QuestionFilled, Trophy, Medal, CircleCheck, CollectionTag } from '@element-plus/icons-vue'
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
  if (rank === 1) return Trophy
  if (rank === 2) return Medal
  if (rank === 3) return CollectionTag
  return CircleCheck
})



const matchColor = computed(() => {
  const score = props.recommendation.matchScore
  if (score >= 85) return 'var(--color-success)'
  if (score >= 70) return 'var(--color-warning)'
  return 'var(--color-danger)'
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
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  transition: all var(--transition-normal);
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
  background: var(--color-solid);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.school-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-slate-700);
}

.school-card:hover::before {
  opacity: 1;
}

.school-card.is-favorite {
  border-color: var(--color-warning);
  box-shadow: 0 8px 30px rgba(217, 119, 6, 0.15);
}

.school-card.is-favorite::before {
  background: var(--color-accent-light);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.ranking-badge {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
}

.rank-gold {
  background: var(--color-accent-light);
  color: #92400e;
}

.rank-silver {
  background: var(--color-slate-300);
  color: var(--color-text-secondary);
}

.rank-bronze {
  background: var(--color-accent);
  color: white;
}

.rank-normal {
  background: var(--color-background);
  color: var(--color-text-secondary);
}

.ranking-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.school-info {
  margin-bottom: var(--space-4);
}

.school-name {
  margin: 0 0 var(--space-2) 0;
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.school-meta {
  display: flex;
  gap: var(--space-2);
}

.ai-reason {
  background: var(--color-slate-50);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  margin-bottom: var(--space-4);
  border: 1px solid var(--color-slate-100);
}

.reason-header {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-bottom: var(--space-2);
  color: var(--color-slate-700);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}

.reason-text {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
}

.match-section {
  margin-bottom: var(--space-4);
}

.match-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.match-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.match-score {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
}

.card-actions {
  display: flex;
  gap: var(--space-2);
}

.card-actions .el-button {
  flex: 1;
  border-radius: var(--radius-lg);
}
</style>
