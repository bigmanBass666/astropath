<template>
  <div
    class="card-awwwards school-card-wrap"
    :class="{ 'card-awwwards--fav': isFavorite, 'card-awwwards--core': isCore, 'card-awwwards--alt': !isCore }"
  >
    <div class="card-glow" />

    <div class="card-body">
      <div class="card-top-row">
        <div class="rank-badge" :class="rankClass">
          <component :is="rankingIconComp" :size="13" />
          <span>#{{ recommendation.ranking }}</span>
        </div>
        <button
          class="fav-toggle"
          :class="{ 'fav-toggle--on': isFavorite }"
          @click.stop="toggleFavorite"
        >
          <svg v-if="!isFavorite" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </button>
      </div>

      <h4 class="card-school-name">{{ recommendation.schoolName }}</h4>

      <div class="card-meta-row">
        <span class="meta-tag">{{ school?.country || '' }}</span>
        <span class="meta-dot" />
        <span class="meta-txt">{{ school?.ranking || '' }}</span>
        <span class="meta-dot" />
        <span class="meta-txt" v-if="school?.topMajor">{{ school.topMajor }}</span>
      </div>

      <div class="card-ai-reason">
        <div class="reason-header">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          AI 推荐理由
        </div>
        <p class="reason-body">{{ recommendation.aiReason }}</p>
      </div>

      <div class="card-match-block">
        <div class="match-info">
          <span class="match-lbl">匹配度</span>
          <span
            class="match-score"
            :style="{ color: matchColor }"
          >{{ recommendation.matchScore }}%</span>
        </div>
        <div class="match-track">
          <div
            class="match-fill"
            :style="{ width: recommendation.matchScore + '%', backgroundColor: matchColor }"
          />
        </div>
      </div>

      <div class="card-details-split">
        <div class="detail-item" v-if="school?.tuition">
          <span class="detail-key">学费</span>
          <span class="detail-val">{{ school.tuition }}</span>
        </div>
        <div class="detail-item" v-if="school?.acceptanceRate">
          <span class="detail-key">录取率</span>
          <span class="detail-val">{{ school.acceptanceRate }}</span>
        </div>
        <div class="detail-item detail-item--flex" />
      </div>

      <div class="card-actions">
        <button class="c-action c-action--primary" @click="viewDetail">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          查看详情
        </button>
        <button class="c-action c-action--ghost" @click="showAnalysis">
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

const rankClass = computed(() => {
  const rank = props.recommendation.ranking
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  return 'rank-default'
})

const rankingIconComp = computed(() => {
  const rank = props.recommendation.ranking
  return () => {
    if (rank <= 3) return h('svg', { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'currentColor' }, [h('circle', { cx: 12, cy: 8, r: 6 }), h('path', { d: 'M15.477 12.89 17 22l-5-3.53L7 22l1.523-9.11' })])
    return h('svg', { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'strokeWidth': 2.5 }, [h('polyline', { points: '20 6 9 17 4 12' })])
  }
})

const matchColor = computed(() => {
  const score = props.recommendation.matchScore
  if (score >= 85) return '#059669'
  if (score >= 70) return '#D97706'
  return '#DC2626'
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
.card-awwwards {
  position: relative;
  background: #FFFFFF;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid #F1F5F9;
}

.card-awwwards::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  transition: background 0.35s ease;
  z-index: 2;
}

.card-awwwards--core::before {
  background: linear-gradient(180deg, #D97706, #B45309);
}

.card-awwwards--alt::before {
  background: linear-gradient(180deg, #CBD5E1, #94A3B8);
}

.card-awwwards:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(15,23,42,0.08);
  border-color: #E2E8F0;
}

.card-awwwards--fav {
  border-color: rgba(217,119,6,0.25);
}

.card-awwwards--fav::before {
  background: linear-gradient(180deg, #D97706, #D97706) !important;
}

.card-glow {
  position: absolute;
  top: -40%;
  left: -20%;
  right: -20%;
  height: 80%;
  background: radial-gradient(ellipse at center, rgba(217,119,6,0.04), transparent 70%);
  opacity: 0;
  transition: opacity 0.45s ease;
  pointer-events: none;
}

.card-awwwards:hover .card-glow {
  opacity: 1;
}

.card-body {
  padding: 26px;
  position: relative;
  z-index: 1;
}

/* ====== Top Row ====== */
.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.rank-gold {
  background: #FEF3C7;
  color: #B45309;
}

.rank-silver {
  background: #F1F5F9;
  color: #64748B;
}

.rank-bronze {
  background: #0F172A;
  color: white;
}

.rank-default {
  background: #FAFAF9;
  color: #94A3B8;
}

.fav-toggle {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1.5px solid #F1F5F9;
  background: #fff;
  color: #CBD5E1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.fav-toggle:hover {
  border-color: #D97706;
  color: #D97706;
  transform: scale(1.08);
}

.fav-toggle--on {
  background: #FEF3C7;
  border-color: #D97706;
  color: #D97706;
}

/* ====== Name & Meta ====== */
.card-school-name {
  margin: 0 0 14px 0;
  font-size: 19px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.4px;
  line-height: 1.25;
}

.card-meta-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.meta-tag {
  padding: 3px 11px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  background: #F8FAFC;
  color: #64748B;
  letter-spacing: 0.15px;
}

.meta-txt {
  font-size: 11px;
  color: #94A3B8;
}

.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #E2E8F0;
}

/* ====== AI Reason ====== */
.card-ai-reason {
  background: #FAFAF9;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 18px;
  border: 1px solid #F1F5F9;
}

.reason-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #94A3B8;
  margin-bottom: 8px;
  letter-spacing: 0.3px;
}

.reason-body {
  margin: 0;
  font-size: 13px;
  color: #64748B;
  line-height: 1.65;
}

/* ====== Match ====== */
.card-match-block {
  margin-bottom: 18px;
}

.match-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.match-lbl {
  font-size: 13px;
  color: #64748B;
  font-weight: 600;
}

.match-score {
  font-size: 20px;
  font-weight: 900;
  font-family: var(--font-family-mono);
  letter-spacing: -0.6px;
}

.match-track {
  height: 5px;
  background: #F1F5F9;
  border-radius: 100px;
  overflow: hidden;
}

.match-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ====== Details ====== */
.card-details-split {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 14px;
  padding: 16px 0;
  border-top: 1px solid #F1F5F9;
  border-bottom: 1px solid #F1F5F9;
  margin-bottom: 18px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.detail-key {
  font-size: 10px;
  font-weight: 800;
  color: #CBD5E1;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.detail-val {
  font-size: 13px;
  font-weight: 700;
  color: #334155;
}

.detail-item--flex {
  flex: 1;
}

/* ====== Actions ====== */
.card-actions {
  display: flex;
  gap: 10px;
}

.c-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-height: 40px;
  border: none;
  letter-spacing: 0.2px;
}

.c-action--primary {
  background: #0F172A;
  color: white;
  box-shadow: 0 3px 10px rgba(15,23,42,0.14);
}

.c-action--primary:hover {
  background: #1E293B;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(15,23,42,0.2);
}

.c-action--ghost {
  background: transparent;
  color: #64748B;
  border: 1.5px solid #E2E8F0;
}

.c-action--ghost:hover {
  border-color: #0F172A;
  color: #0F172A;
  transform: translateY(-2px);
}
</style>
