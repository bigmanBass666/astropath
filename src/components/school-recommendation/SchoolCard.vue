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
          :size="16"
          class="ranking-icon"
        >
          <component :is="rankingIcon" />
        </el-icon>
        <span class="ranking-text">#{{ recommendation.ranking }}</span>
      </div>
      <div class="header-actions">
        <button
          class="icon-btn"
          :class="{ 'is-active': isFavorite }"
          @click="toggleFavorite"
        >
          <el-icon :size="16">
            <component :is="isFavorite ? StarFilled : Star" />
          </el-icon>
        </button>
      </div>
    </div>

    <div class="school-info">
      <h4 class="school-name">
        {{ recommendation.schoolName }}
      </h4>
      <div class="school-meta">
        <span class="meta-tag">{{ school?.country }}</span>
        <span class="meta-tag meta-tag--muted">{{ school?.ranking }}</span>
      </div>
    </div>

    <div class="ai-reason">
      <div class="reason-header">
        <el-icon :size="14"><ChatDotRound /></el-icon>
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
      <div class="progress-track">
        <div
          class="progress-fill"
          :style="{ width: recommendation.matchScore + '%', backgroundColor: matchColor }"
        />
      </div>
    </div>

    <div class="card-details">
      <div class="detail-item" v-if="school?.topMajor">
        <span class="detail-label">强势专业</span>
        <span class="detail-value">{{ school.topMajor }}</span>
      </div>
      <div class="detail-item" v-if="school?.tuition">
        <span class="detail-label">学费</span>
        <span class="detail-value">{{ school.tuition }}</span>
      </div>
      <div class="detail-item" v-if="school?.acceptanceRate">
        <span class="detail-label">录取率</span>
        <span class="detail-value">{{ school.acceptanceRate }}</span>
      </div>
    </div>

    <div class="card-actions">
      <button
        class="action-btn primary"
        @click="viewDetail"
      >
        <el-icon :size="14"><View /></el-icon>
        查看详情
      </button>
      <button
        class="action-btn secondary"
        @click="showAnalysis"
      >
        <el-icon :size="14"><QuestionFilled /></el-icon>
        为什么推荐
      </button>
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
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  border: 1px solid var(--color-border-light);
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
  height: 3px;
  background: var(--color-solid);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.school-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border);
}

.school-card:hover::before {
  opacity: 1;
}

.school-card.is-favorite {
  border-color: var(--color-accent);
}

.school-card.is-favorite::before {
  background: var(--color-accent);
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
}

.ranking-badge {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-weight: var(--font-semibold);
  font-size: var(--text-xs);
  letter-spacing: 0.25px;
}

.rank-gold {
  background: var(--color-accent-subtle);
  color: var(--color-accent);
}

.rank-silver {
  background: var(--color-slate-200);
  color: var(--color-text-secondary);
}

.rank-bronze {
  background: var(--color-solid);
  color: white;
}

.rank-normal {
  background: var(--color-background-alt);
  color: var(--color-text-secondary);
}

.ranking-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.icon-btn:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.icon-btn.is-active {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: var(--color-accent-subtle);
}

.school-info {
  margin-bottom: var(--space-5);
}

.school-name {
  margin: 0 0 var(--space-2) 0;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.school-meta {
  display: flex;
  gap: var(--space-2);
}

.meta-tag {
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  background: var(--color-slate-100);
  color: var(--color-slate-600);
  letter-spacing: 0.25px;
}

.meta-tag--muted {
  background: var(--color-surface-muted);
  color: var(--color-text-tertiary);
}

.ai-reason {
  background: var(--color-slate-50);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-5);
  border: 1px solid var(--color-border-light);
}

.reason-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
  color: var(--color-slate-600);
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
  margin-bottom: var(--space-5);
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

.progress-track {
  height: 6px;
  background: var(--color-slate-100);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
}

.card-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  padding: var(--space-4) 0;
  border-top: 1px solid var(--color-border-light);
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: var(--space-5);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  font-weight: var(--font-medium);
}

.detail-value {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
}

.card-actions {
  display: flex;
  gap: var(--space-3);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 38px;
  border: none;
}

.action-btn.primary {
  background: var(--color-solid);
  color: white;
  box-shadow: var(--shadow-sm);
}

.action-btn.primary:hover {
  background: var(--color-solid-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.action-btn.secondary {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1.5px solid var(--color-border);
}

.action-btn.secondary:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .card-details {
    grid-template-columns: 1fr;
  }
}
</style>
