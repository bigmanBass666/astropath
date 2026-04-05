<template>
  <div class="rec-awwwards">
    <div class="rec-intro-block">
      <div class="intro-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <div class="intro-body">
        <p class="intro-main-text">
          基于你的背景和需求，为你精选了
          <strong>{{ coreRecommendations.length }}</strong> 所核心推荐学校
          <span v-if="alternativeRecommendations.length > 0">和 <strong>{{ alternativeRecommendations.length }}</strong> 个备选方案</span>
        </p>
        <p
          v-if="summary"
          class="intro-summary-text"
        >
          {{ summary }}
        </p>
      </div>
    </div>

    <div
      v-if="coreRecommendations.length > 0"
      class="rec-section"
    >
      <div class="sec-header">
        <div class="sec-title-row">
          <span class="sec-star">★</span>
          <h4 class="sec-title">核心推荐</h4>
        </div>
        <span class="sec-count">{{ coreRecommendations.length }} 所</span>
      </div>
      <div class="cards-grid">
        <SchoolCard
          v-for="(rec, idx) in coreRecommendations"
          :key="rec.schoolId"
          :recommendation="rec"
          :is-favorite="favorites.includes(rec.schoolId)"
          :index="idx"
          @toggle-favorite="$emit('toggle-favorite', $event)"
          @view-detail="$emit('view-detail', $event)"
          @show-analysis="$emit('show-analysis', $event)"
        />
      </div>
    </div>

    <div
      v-if="alternativeRecommendations.length > 0"
      class="rec-section rec-section--alt"
    >
      <div class="sec-header sec-header--muted">
        <div class="sec-title-row sec-title-row--muted">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          <h4 class="sec-title sec-title--muted">备选方案</h4>
        </div>
        <span class="sec-count sec-count--muted">{{ alternativeRecommendations.length }} 所</span>
      </div>
      <div class="cards-grid cards-grid--alt">
        <SchoolCard
          v-for="(rec, idx) in alternativeRecommendations"
          :key="rec.schoolId"
          :recommendation="rec"
          :is-favorite="favorites.includes(rec.schoolId)"
          :index="idx"
          @toggle-favorite="$emit('toggle-favorite', $event)"
          @view-detail="$emit('view-detail', $event)"
          @show-analysis="$emit('show-analysis', $event)"
        />
      </div>
    </div>

    <div class="rec-footer">
      <div class="ai-input-area">
        <div
          class="ai-input-inner"
          :class="{ 'ai-input-inner--focus': isFocused }"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" class="ai-static-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <input
            ref="inputEl"
            v-model="adjustInput"
            type="text"
            placeholder="告诉AI调整方向，例如：我想去加州的学校"
            class="ai-field"
            @keyup.enter="submitAdjust"
            @focus="isFocused = true"
            @blur="isFocused = false"
          >
          <button
            class="ai-send-btn"
            :class="{ 'ai-send-btn--active': adjustInput.trim() }"
            @click="submitAdjust"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>

      <div class="action-bar">
        <button
          class="act-btn act-btn--ghost"
          @click="$emit('reset')"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          重新填写偏好
        </button>
        <button
          class="act-btn act-btn--solid"
          :class="{ 'act-btn--off': favorites.length < 2 }"
          :disabled="favorites.length < 2"
          @click="$emit('compare')"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          对比收藏
          <span
            v-if="favorites.length > 0"
            class="act-badge"
          >{{ favorites.length }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SchoolCard from './SchoolCard.vue'

const props = defineProps({
  recommendations: {
    type: Array,
    default: () => []
  },
  favorites: {
    type: Array,
    default: () => []
  },
  summary: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['toggle-favorite', 'view-detail', 'show-analysis', 'reset', 'compare', 'adjust'])

const adjustInput = ref('')
const isFocused = ref(false)
const inputEl = ref(null)

const CATEGORY_MAP = {
  reach: 'core',
  match: 'core',
  safe: 'alternative',
  core: 'core',
  alternative: 'alternative'
}

const displayCategory = (cat) => CATEGORY_MAP[cat] || cat

const coreRecommendations = computed(() => props.recommendations.filter(r => displayCategory(r.category) === 'core'))
const alternativeRecommendations = computed(() => props.recommendations.filter(r => displayCategory(r.category) === 'alternative'))

const submitAdjust = () => {
  if (!adjustInput.value.trim()) return
  emit('adjust', adjustInput.value.trim())
  adjustInput.value = ''
}
</script>

<style scoped>
.rec-awwwards {
  padding: 32px 0;
}

/* ====== Intro Block ====== */
.rec-intro-block {
  display: flex;
  gap: 18px;
  padding: 28px;
  background: #FFFFFF;
  border: 1px solid #F1F5F9;
  border-radius: 20px;
  margin-bottom: 40px;
}

.intro-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #0F172A;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.intro-body {
  flex: 1;
  min-width: 0;
}

.intro-main-text {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #334155;
  line-height: 1.65;
}

.intro-main-text strong {
  color: #0F172A;
  font-weight: 800;
}

.intro-summary-text {
  margin: 0;
  font-size: 13px;
  color: #64748B;
  line-height: 1.7;
}

/* ====== Section ====== */
.rec-section {
  margin-bottom: 48px;
}

.rec-section--alt {
  opacity: 0.92;
}

.sec-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 26px;
}

.sec-header--muted {
  opacity: 0.7;
}

.sec-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sec-title-row--muted .sec-star {
  display: none;
}

.sec-star {
  color: #D97706;
  font-size: 18px;
}

.sec-title {
  font-size: 17px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.3px;
  margin: 0;
}

.sec-title--muted {
  color: #64748B;
  font-weight: 700;
}

.sec-count {
  font-size: 11px;
  font-weight: 700;
  color: #94A3B8;
  background: #F1F5F9;
  padding: 3px 11px;
  border-radius: 100px;
  letter-spacing: 0.3px;
}

.sec-count--muted {
  background: transparent;
  border: 1px solid #E2E8F0;
}

/* ====== Cards Grid ====== */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.cards-grid--alt .school-card-wrap:nth-child(3n+1) { transform: translateY(10px); }
.cards-grid--alt .school-card-wrap:nth-child(3n+2) { transform: translateY(0); }
.cards-grid--alt .school-card-wrap:nth-child(3n) { transform: translateY(-10px); }

@media (max-width: 1024px) {
  .cards-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .cards-grid { grid-template-columns: 1fr; }
  .cards-grid--alt .school-card-wrap { transform: none !important; }
}

/* ====== Footer ====== */
.rec-footer {
  margin-top: 48px;
  padding-top: 36px;
  border-top: 1px solid #F1F5F9;
}

/* ====== AI Input ====== */
.ai-input-area {
  margin-bottom: 28px;
}

.ai-input-inner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 8px 8px 22px;
  background: #fff;
  border: 1.5px solid #E2E8F0;
  border-radius: 18px;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

.ai-input-inner:focus-within {
  border-color: #0F172A;
  box-shadow: 0 6px 24px rgba(15,23,42,0.08), 0 0 0 4px rgba(15,23,42,0.04);
}

.ai-static-icon {
  flex-shrink: 0;
}

.ai-field {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #0F172A;
  outline: none;
  padding: 8px 0;
  min-height: 24px;
  font-family: var(--font-family-base);
}

.ai-field::placeholder {
  color: #CBD5E1;
}

.ai-send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 12px;
  background: #F1F5F9;
  color: #CBD5E1;
  cursor: not-allowed;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}

.ai-send-btn--active {
  background: #0F172A;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(15,23,42,0.22);
}

.ai-send-btn--active:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(15,23,42,0.3);
}

/* ====== Action Bar ====== */
.action-bar {
  display: flex;
  justify-content: center;
  gap: 14px;
}

.act-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-height: 44px;
  letter-spacing: 0.2px;
}

.act-btn--ghost {
  background: #F1F5F9;
  color: #64748B;
}

.act-btn--ghost:hover {
  background: #E2E8F0;
  transform: translateY(-2px);
}

.act-btn--solid {
  background: #0F172A;
  color: white;
  box-shadow: 0 3px 10px rgba(15,23,42,0.15);
}

.act-btn--solid:hover:not(.act-btn--off) {
  background: #1E293B;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(15,23,42,0.22);
}

.act-btn--off {
  background: #F1F5F9;
  color: #CBD5E1;
  cursor: not-allowed;
  box-shadow: none;
}

.act-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  background: rgba(255,255,255,0.18);
  border-radius: 100px;
  font-size: 11px;
  font-weight: 800;
}
</style>
