<template>
  <div
    class="card-modern"
    :class="{ 'card-modern--fav': isFavorite, 'card-modern--core': isCore, 'card-modern--alt': !isCore }"
  >
    <div class="card-color-bar" />

    <div class="card-inner">
      <div class="card-top">
        <div class="rank-badge" :class="rankClass">
          <component :is="rankingIconComp" :size="13" />
          <span>#{{ recommendation.ranking }}</span>
        </div>
        <button
          class="fav-btn"
          :class="{ 'fav-btn--active': isFavorite }"
          @click.stop="toggleFavorite"
        >
          <svg v-if="!isFavorite" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </button>
      </div>

      <h4 class="card-name">{{ recommendation.schoolName }}</h4>

      <div class="card-meta">
        <span class="meta-pill">{{ school?.country || '' }}</span>
        <span class="meta-dot" />
        <span class="meta-text">{{ school?.ranking || '' }}</span>
        <span class="meta-dot" />
        <span class="meta-text" v-if="school?.topMajor">{{ school.topMajor }}</span>
      </div>

      <div class="card-reason">
        <div class="reason-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          AI 推荐理由
        </div>
        <p class="reason-text">{{ recommendation.aiReason }}</p>
      </div>

      <div class="card-match">
        <div class="match-left">
          <span class="match-lbl">匹配度</span>
          <span
            class="match-val"
            :style="{ color: matchColor }"
          >{{ recommendation.matchScore }}%</span>
        </div>
        <div class="match-bar-track">
          <div
            class="match-bar-fill"
            :style="{ width: recommendation.matchScore + '%', backgroundColor: matchColor }"
          />
        </div>
      </div>

      <div class="card-details-row">
        <div class="detail-cell" v-if="school?.tuition">
          <span class="detail-key">学费</span>
          <span class="detail-val">{{ school.tuition }}</span>
        </div>
        <div class="detail-cell" v-if="school?.acceptanceRate">
          <span class="detail-key">录取率</span>
          <span class="detail-val">{{ school.acceptanceRate }}</span>
        </div>
        <div class="detail-cell detail-cell--flex" />
      </div>

      <div class="card-actions-row">
        <button class="card-btn card-btn--primary" @click="viewDetail">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          查看详情
        </button>
        <button class="card-btn card-btn--ghost" @click="showAnalysis">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          为什么推荐
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { schoolsData } from '@/utils/recommendationEngine'

const props = defineProps({
  recommendation: {
    type: Object,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['toggle-favorite', 'view-detail', 'show-analysis'])

const school = computed(() => {
  return schoolsData.find(s => s.id === props.recommendation.schoolId)
})

const CATEGORY_MAP = {
  reach: 'core',
  match: 'core',
  safe: 'alternative',
  core: 'core',
  alternative: 'alternative'
}

const isCore = computed(() => CATEGORY_MAP[props.recommendation.category] === 'core')

const rankingClass = computed(() => {
  const rank = props.recommendation.ranking
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  return 'rank-default'
})

const rankingIconComp = computed(() => {
  const rank = props.recommendation.ranking
  return () => {
    if (rank === 1) return h('svg', { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'currentColor' }, [h('circle', { cx: 12, cy: 8, r: 6 }), h('path', { d: 'M15.477 12.89 17 22l-5-3.53L7 22l1.523-9.11' })])
    if (rank === 2) return h('svg', { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'currentColor' }, [h('circle', { cx: 12, cy: 8, r: 6 }), h('path', { d: 'M15.477 12.89 17 22l-5-3.53L7 22l1.523-9.11' })])
    if (rank === 3) return h('svg', { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'currentColor' }, [h('circle', { cx: 12, cy: 8, r: 6 }), h('path', { d: 'M15.477 12.89 17 22l-5-3.53L7 22l1.523-9.11' })])
    return h('svg', { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'strokeWidth': 2.5 }, [h('polyline', { points: '20 6 9 17 4 12' })])
  }
})

const matchColor = computed(() => {
  const score = props.recommendation.matchScore
  if (score >= 85) return 'var(--color-success)'
  if (score >= 70) return 'var(--color-accent)'
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
.card-modern {
  position: relative;
  background: white;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid var(--color-border-light);
}

.card-modern::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  transition: background 0.3s ease;
  z-index: 2;
}

.card-modern--core::before {
  background: linear-gradient(180deg, var(--color-accent), #B45309);
}

.card-modern--alt::before {
  background: linear-gradient(180deg, var(--color-slate-400), var(--color-slate-500));
}

.card-modern:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
  border-color: var(--color-border);
}

.card-modern--fav {
  border-color: rgba(217, 119, 6, 0.3);
}

.card-modern--fav::before {
  background: linear-gradient(180deg, var(--color-accent), #D97706) !important;
}

.card-color-bar {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 0;
  transition: height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-modern:hover .card-color-bar {
  height: 3px;
  background: linear-gradient(90deg, var(--color-solid), var(--color-accent));
}

.card-inner {
  padding: var(--space-6);
  position: relative;
  z-index: 1;
}

/* ====== Top Bar ====== */
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  letter-spacing: 0.2px;
}

.rank-gold {
  background: var(--color-accent-subtle);
  color: var(--color-accent);
}

.rank-silver {
  background: var(--color-slate-100);
  color: var(--color-slate-600);
}

.rank-bronze {
  background: var(--color-solid);
  color: white;
}

.rank-default {
  background: var(--color-background-alt);
  color: var(--color-text-secondary);
}

.fav-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-border-light);
  background: white;
  color: var(--color-text-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.fav-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  transform: scale(1.08);
}

.fav-btn--active {
  background: var(--color-accent-subtle);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* ====== Name & Meta ====== */
.card-name {
  margin: 0 0 var(--space-3) 0;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-solid);
  letter-spacing: -0.3px;
  line-height: var(--leading-tight);
}

.card-meta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.meta-pill {
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  background: var(--color-slate-50);
  color: var(--color-slate-600);
  letter-spacing: 0.15px;
}

.meta-text {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-slate-300);
}

/* ====== AI Reason ====== */
.card-reason {
  background: var(--color-slate-50);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  border: 1px solid var(--color-border-light);
}

.reason-label {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-slate-500);
  margin-bottom: var(--space-2);
  letter-spacing: 0.2px;
}

.reason-text {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
}

/* ====== Match ====== */
.card-match {
  margin-bottom: var(--space-4);
}

.match-left {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--space-2);
}

.match-lbl {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
}

.match-val {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  font-family: var(--font-family-mono);
  letter-spacing: -0.5px;
}

.match-bar-track {
  height: 5px;
  background: var(--color-slate-100);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.match-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ====== Details ====== */
.card-details-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: var(--space-3);
  padding: var(--space-4) 0;
  border-top: 1px solid var(--color-border-light);
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: var(--space-4);
}

.detail-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-key {
  font-size: 10px;
  font-weight: var(--font-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.detail-val {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

/* ====== Actions ====== */
.card-actions-row {
  display: flex;
  gap: var(--space-3);
}

.card-btn {
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
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-height: 38px;
  border: none;
}

.card-btn--primary {
  background: var(--color-solid);
  color: white;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.12);
}

.card-btn--primary:hover {
  background: var(--color-solid-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.18);
}

.card-btn--ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1.5px solid var(--color-border);
}

.card-btn--ghost:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  transform: translateY(-1px);
}
</style>
