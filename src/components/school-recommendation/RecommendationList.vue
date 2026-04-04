<template>
  <div class="rec-list-modern">
    <div class="rec-intro">
      <div class="intro-avatar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <div class="intro-text">
        <p class="intro-main">
          基于你的背景和需求，为你精选了
          <strong>{{ coreRecommendations.length }}</strong> 所核心推荐学校
          <span v-if="alternativeRecommendations.length > 0">和 <strong>{{ alternativeRecommendations.length }}</strong> 个备选方案</span>
        </p>
        <p
          v-if="summary"
          class="intro-summary"
        >
          {{ summary }}
        </p>
      </div>
    </div>

    <div
      v-if="coreRecommendations.length > 0"
      class="rec-section"
    >
      <div class="section-header">
        <h4 class="section-title-modern">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-accent)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          核心推荐
        </h4>
        <span class="section-count">{{ coreRecommendations.length }} 所</span>
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
      <div class="section-header">
        <h4 class="section-title-modern section-title-modern--muted">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          备选方案
        </h4>
        <span class="section-count section-count--muted">{{ alternativeRecommendations.length }} 所</span>
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
      <div class="ai-input-box">
        <div class="ai-input-inner" :class="{ 'ai-input-inner--focused': isFocused }">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ai-icon-static"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
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
            class="ai-send"
            :class="{ 'ai-send--active': adjustInput.trim() }"
            @click="submitAdjust"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>

      <div class="action-row">
        <button
          class="act-btn act-btn--ghost"
          @click="$emit('reset')"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          重新填写偏好
        </button>
        <button
          class="act-btn act-btn--solid"
          :class="{ 'act-btn--disabled': favorites.length < 2 }"
          :disabled="favorites.length < 2"
          @click="$emit('compare')"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
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
import { ref } from 'vue'
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

const coreRecommendations = props.recommendations.filter(r => displayCategory(r.category) === 'core')
const alternativeRecommendations = props.recommendations.filter(r => displayCategory(r.category) === 'alternative')

const submitAdjust = () => {
  if (!adjustInput.value.trim()) return
  emit('adjust', adjustInput.value.trim())
  adjustInput.value = ''
}
</script>

<style scoped>
.rec-list-modern {
  padding: var(--space-6) 0;
}

/* ====== Intro ====== */
.rec-intro {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-6);
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-2xl);
  margin-bottom: var(--space-8);
}

.intro-avatar {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-lg);
  background: var(--color-solid);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.intro-text {
  flex: 1;
  min-width: 0;
}

.intro-main {
  margin: 0 0 var(--space-2) 0;
  font-size: var(--text-base);
  color: var(--color-text-primary);
  line-height: var(--leading-normal);
}

.intro-main strong {
  color: var(--color-solid);
  font-weight: var(--font-bold);
}

.intro-summary {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

/* ====== Section ====== */
.rec-section {
  margin-bottom: var(--space-10);
}

.rec-section--alt {
  opacity: 0.92;
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.section-title-modern {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-solid);
  letter-spacing: -0.25px;
  margin: 0;
}

.section-title-modern--muted {
  color: var(--color-text-secondary);
}

.section-title-modern--muted svg {
  stroke: var(--color-text-tertiary);
}

.section-count {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-text-muted);
  background: var(--color-slate-100);
  padding: 2px 10px;
  border-radius: var(--radius-full);
  letter-spacing: 0.2px;
}

.section-count--muted {
  background: transparent;
  border: 1px solid var(--color-border-light);
}

/* ====== Cards Grid (staggered) ====== */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.cards-grid--alt .school-card-wrap:nth-child(3n+1) { transform: translateY(8px); }
.cards-grid--alt .school-card-wrap:nth-child(3n+2) { transform: translateY(0); }
.cards-grid--alt .school-card-wrap:nth-child(3n) { transform: translateY(-8px); }

@media (max-width: 1024px) {
  .cards-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .cards-grid { grid-template-columns: 1fr; }
  .cards-grid--alt .school-card-wrap { transform: none !important; }
}

/* ====== Footer ====== */
.rec-footer {
  margin-top: var(--space-10);
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border-light);
}

/* ====== AI Input ====== */
.ai-input-box {
  margin-bottom: var(--space-6);
}

.ai-input-inner {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-2) var(--space-2) var(--space-5);
  background: white;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: var(--shadow-sm);
}

.ai-input-inner:focus-within {
  border-color: var(--color-solid);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08), 0 0 0 3px rgba(15, 23, 42, 0.04);
}

.ai-icon-static {
  color: var(--color-slate-400);
  flex-shrink: 0;
}

.ai-field {
  flex: 1;
  border: none;
  background: transparent;
  font-size: var(--text-base);
  color: var(--color-text-primary);
  outline: none;
  padding: var(--space-2) 0;
  min-height: 22px;
  font-family: var(--font-family-base);
}

.ai-field::placeholder {
  color: var(--color-text-muted);
}

.ai-send {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--radius-full);
  background: var(--color-slate-100);
  color: var(--color-text-muted);
  cursor: not-allowed;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}

.ai-send--active {
  background: var(--color-solid);
  color: white;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.2);
}

.ai-send--active:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.28);
}

/* ====== Action Row ====== */
.action-row {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
}

.act-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-height: 42px;
}

.act-btn--ghost {
  background: var(--color-slate-100);
  color: var(--color-text-secondary);
}

.act-btn--ghost:hover {
  background: var(--color-slate-200);
  transform: translateY(-1px);
}

.act-btn--solid {
  background: var(--color-solid);
  color: white;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.15);
}

.act-btn--solid:hover:not(.act-btn--disabled) {
  background: var(--color-solid-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
}

.act-btn--disabled {
  background: var(--color-slate-100);
  color: var(--color-text-muted);
  cursor: not-allowed;
  box-shadow: none;
}

.act-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
}
</style>
