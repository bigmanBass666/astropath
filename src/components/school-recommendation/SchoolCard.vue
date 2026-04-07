<template>
  <div
    class="sc"
    :class="{
      'sc--featured': isFeatured,
      'sc--expanded': isExpanded
    }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="toggleExpand"
  >
    <!-- ====== Visual Layer: Match Score ====== -->
    <div class="sc__visual">
      <div class="sc__gauge">
        <svg
          class="sc__gauge-ring"
          viewBox="0 0 100 56"
        >
          <defs>
            <linearGradient
              id="scGg"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stop-color="#D97706"
              />
              <stop
                offset="100%"
                stop-color="#F59E0B"
              />
            </linearGradient>
          </defs>
          <path
            class="sc__gauge-track"
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke-width="6"
            stroke-linecap="round"
          />
          <path
            class="sc__gauge-fill"
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="url(#scGg)"
            stroke-width="6"
            stroke-linecap="round"
            :stroke-dasharray="126"
            :stroke-dashoffset="126 - (126 * Math.max(0, Math.min(100, Number(recommendation.matchScore) || 0)) / 100)"
          />
        </svg>
        <div class="sc__gauge-val">
          <CountUp
            :end-val="Math.max(0, Math.min(100, Number(recommendation.matchScore) || 0))"
            suffix="%"
          />
        </div>
      </div>
      <span class="sc__rank">#{{ recommendation.ranking || recommendation.rank || '?' }}</span>
    </div>

    <!-- ====== Content Layer ====== -->
    <div class="sc__content">
      <header class="sc__header">
        <h3 class="sc__name">
          {{ recommendation.schoolName }}
        </h3>
        <div class="sc__meta">
          <span
            v-if="recommendation.country"
            class="sc__tag"
          >{{ recommendation.country }}</span>
          <span
            v-if="recommendation.ranking"
            class="sc__tag sc__tag--mono"
          >QS #{{ recommendation.ranking }}</span>
        </div>
      </header>

      <!-- Expanded Content -->
      <div class="sc__expandable">
        <p class="sc__reason">
          {{ recommendation.aiReason || recommendation.reason || 'AI 综合评估该校与你的背景高度契合。' }}
        </p>
        
        <div class="sc__details">
          <div
            v-if="recommendation.tuition"
            class="sc__detail"
          >
            <span class="sc__detail-val">${{ formatNumber(recommendation.tuition) }}</span>
            <span class="sc__detail-key">/年</span>
          </div>
          <div
            v-if="recommendation.acceptanceRate"
            class="sc__detail"
          >
            <span class="sc__detail-val">{{ recommendation.acceptanceRate }}%</span>
            <span class="sc__detail-key">录取率</span>
          </div>
        </div>

        <div class="sc__actions">
          <button
            class="sc__btn sc__btn--primary"
            @click.stop="$emit('view-detail')"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            ><polygon points="5 3 19 12 5 21 5 3" /></svg>
            探索
          </button>
          <button
            class="sc__btn sc__btn--ghost"
            @click.stop="$emit('show-analysis')"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            ><circle
              cx="12"
              cy="12"
              r="10"
            /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></svg>
            分析
          </button>
          <button
            class="sc__fav"
            :class="{ 'sc__fav--on': isFavorite }"
            @click.stop="$emit('toggle-favorite')"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              :fill="isFavorite ? '#D97706' : 'none'"
              stroke="#94A3B8"
              stroke-width="2"
            ><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ====== Featured Badge ====== -->
    <div
      v-if="isFeatured"
      class="sc__badge"
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="currentColor"
      ><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
      BEST MATCH
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CountUp from './CountUp.vue'

const props = defineProps({
  recommendation: { type: Object, required: true },
  isFavorite: { type: Boolean, default: false },
  index: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false }
})

defineEmits(['toggle-favorite', 'view-detail', 'show-analysis'])

const isHovered = ref(false)
const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const formatNumber = (num: string | number) => {
  if (!num) return ''
  const n = typeof num === 'string' ? parseInt(num.replace(/[^0-9]/g, '')) : num
  return isNaN(n) ? String(num) : n.toLocaleString()
}
</script>

<style scoped>
/* ====== Card Container ====== */
.sc {
  position: relative;
  background: #FFFFFF;
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid transparent;
}

.sc:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 48px rgba(15,23,42,0.08);
  border-color: rgba(217,119,6,0.15);
}

.sc--expanded {
  grid-column: span 2;
  background: linear-gradient(135deg, #FFFFFF 0%, #FFFCF5 100%);
  border-color: rgba(217,119,6,0.2);
}

/* ====== Visual Layer ====== */
.sc__visual {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.sc__gauge {
  position: relative;
  width: 100px;
  height: 56px;
  flex-shrink: 0;
}

.sc__gauge-ring {
  width: 100%;
  height: 100%;
}

.sc__gauge-track {
  stroke: #F1F5F9;
}

.sc__gauge-fill {
  transition: stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.sc__gauge-val {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 900;
  color: #0F172A;
  font-family: var(--font-family-mono);
  letter-spacing: -1px;
  top: 8px;
}

.sc__rank {
  font-size: 48px;
  font-weight: 900;
  font-family: var(--font-family-mono);
  color: #F1F5F9;
  line-height: 0.9;
  letter-spacing: -4px;
}

/* ====== Content Layer ====== */
.sc__content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sc__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sc__name {
  margin: 0;
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 900;
  color: #0F172A;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.sc__meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.sc__tag {
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #64748B;
  background: #F8FAFC;
  border-radius: 6px;
}

.sc__tag--mono {
  font-family: var(--font-family-mono);
  color: #334155;
  background: #F1F5F9;
}

/* ====== Expandable Content ====== */
.sc__expandable {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sc:hover .sc__expandable,
.sc--expanded .sc__expandable {
  grid-template-rows: 1fr;
}

.sc__expandable > * {
  overflow: hidden;
}

.sc__reason {
  margin: 0 0 16px;
  padding: 12px 0;
  font-size: 13px;
  color: #64748B;
  line-height: 1.7;
  border-top: 1px solid #F1F5F9;
}

.sc__details {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.sc__detail {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.sc__detail-val {
  font-size: 15px;
  font-weight: 800;
  color: #334155;
  font-family: var(--font-family-mono);
}

.sc__detail-key {
  font-size: 11px;
  color: #94A3B8;
}

/* ====== Actions ====== */
.sc__actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #F1F5F9;
}

.sc__btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.sc__btn--primary {
  background: #0F172A;
  color: #fff;
}

.sc__btn--primary:hover {
  background: #1E293B;
  transform: translateY(-2px);
}

.sc__btn--ghost {
  background: #F8FAFC;
  color: #64748B;
  border: 1px solid #E2E8F0;
}

.sc__btn--ghost:hover {
  background: #FFFFFF;
  color: #0F172A;
  border-color: #CBD5E1;
}

.sc__fav {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #E2E8F0;
  background: #FFFFFF;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sc__fav:hover {
  border-color: #D97706;
  background: #FEF3C7;
}

.sc__fav--on {
  border-color: #D97706;
  background: #FEF3C7;
}

/* ====== Featured Badge ====== */
.sc__badge {
  position: absolute;
  top: 16px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 14px;
  background: linear-gradient(135deg, #D97706, #B45309);
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
  border-radius: 100px;
}

/* ====== Featured Variant ====== */
.sc--featured {
  background: linear-gradient(135deg, #FFFFFF 0%, #FFFBEB 100%);
  border-left: 4px solid #D97706;
}

.sc--featured .sc__rank {
  color: rgba(217,119,6,0.12);
}

.sc--featured .sc__gauge {
  width: 120px;
  height: 68px;
}

.sc--featured .sc__gauge-val {
  font-size: 26px;
}

/* ====== Responsive ====== */
@media (max-width: 1024px) {
  .sc {
    padding: 22px;
  }
  
  .sc__gauge {
    width: 90px;
    height: 50px;
  }
  
  .sc__gauge-val {
    font-size: 18px;
  }
  
  .sc__rank {
    font-size: 36px;
  }
  
  .sc--expanded {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .sc__visual {
    flex-direction: row-reverse;
  }
  
  .sc__rank {
    font-size: 28px;
    letter-spacing: -2px;
  }
  
  .sc__details {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
