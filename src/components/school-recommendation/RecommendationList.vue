<template>
  <div class="recommendation-list">
    <!-- AI欢迎语 -->
    <div class="ai-welcome-message">
      <div class="ai-avatar-small">
        <el-icon :size="24">
          <ChatDotRound />
        </el-icon>
      </div>
      <div class="welcome-content">
        <p class="welcome-text">
          基于你的背景和需求，我为你精选了 <strong>{{ coreRecommendations.length }}</strong> 所核心推荐学校
          <span v-if="alternativeRecommendations.length > 0">和 <strong>{{ alternativeRecommendations.length }}</strong> 个备选方案</span>
        </p>
        <p
          v-if="summary"
          class="summary-text"
        >
          {{ summary }}
        </p>
      </div>
    </div>

    <!-- 核心推荐 -->
    <div
      v-if="coreRecommendations.length > 0"
      class="recommendation-section"
    >
      <h4 class="section-title">
        <el-icon :size="18"><StarFilled /></el-icon>
        核心推荐
      </h4>
      <div class="schools-grid">
        <SchoolCard
          v-for="rec in coreRecommendations"
          :key="rec.schoolId"
          :recommendation="rec"
          :is-favorite="favorites.includes(rec.schoolId)"
          @toggle-favorite="$emit('toggle-favorite', $event)"
          @view-detail="$emit('view-detail', $event)"
          @show-analysis="$emit('show-analysis', $event)"
        />
      </div>
    </div>

    <!-- 备选方案 -->
    <div
      v-if="alternativeRecommendations.length > 0"
      class="recommendation-section alternative"
    >
      <h4 class="section-title section-title--muted">
        <el-icon :size="18"><Collection /></el-icon>
        备选方案
      </h4>
      <div class="schools-grid">
        <SchoolCard
          v-for="rec in alternativeRecommendations"
          :key="rec.schoolId"
          :recommendation="rec"
          :is-favorite="favorites.includes(rec.schoolId)"
          @toggle-favorite="$emit('toggle-favorite', $event)"
          @view-detail="$emit('view-detail', $event)"
          @show-analysis="$emit('show-analysis', $event)"
        />
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="list-actions">
      <!-- AI 调整输入区 -->
      <div class="ai-chat-input-wrapper">
        <div
          class="ai-input-container"
          :class="{ 'is-focused': isInputFocused }"
        >
          <el-icon class="ai-input-icon">
            <ChatDotRound />
          </el-icon>
          <input
            ref="adjustInputEl"
            v-model="adjustInput"
            type="text"
            placeholder="告诉AI调整方向，例如：我想去加州的学校"
            class="ai-input"
            @keyup.enter="submitAdjust"
            @focus="isInputFocused = true"
            @blur="isInputFocused = false"
          >
          <button
            class="ai-send-btn"
            :class="{ 'is-active': adjustInput.trim() }"
            @click="submitAdjust"
          >
            <el-icon :size="16"><Position /></el-icon>
          </button>
        </div>
      </div>

      <!-- 操作按钮组 -->
      <div class="action-buttons">
        <button
          class="action-btn secondary"
          @click="$emit('reset')"
        >
          <el-icon :size="16"><RefreshLeft /></el-icon>
          <span>重新填写偏好</span>
        </button>
        <button
          class="action-btn primary"
          :class="{ 'is-disabled': favorites.length < 2 }"
          :disabled="favorites.length < 2"
          @click="$emit('compare')"
        >
          <el-icon :size="16"><ScaleToOriginal /></el-icon>
          <span>对比收藏</span>
          <span
            v-if="favorites.length > 0"
            class="btn-badge"
          >{{ favorites.length }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChatDotRound, StarFilled, Collection, RefreshLeft, ScaleToOriginal, Position } from '@element-plus/icons-vue'
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
const isInputFocused = ref(false)
const adjustInputEl = ref(null)

const CATEGORY_MAP = {
  reach: 'core',
  match: 'core',
  safe: 'alternative',
  core: 'core',
  alternative: 'alternative'
}

const displayCategory = (cat) => CATEGORY_MAP[cat] || cat

const coreRecommendations = computed(() => {
  return props.recommendations.filter(r => displayCategory(r.category) === 'core')
})

const alternativeRecommendations = computed(() => {
  return props.recommendations.filter(r => displayCategory(r.category) === 'alternative')
})

const submitAdjust = () => {
  if (!adjustInput.value.trim()) return
  emit('adjust', adjustInput.value.trim())
  adjustInput.value = ''
}
</script>

<style scoped>
.recommendation-list {
  padding: var(--space-8) 0;
}

/* ====== AI 欢迎消息 ====== */
.ai-welcome-message {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  padding: var(--space-6);
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-light);
}

.ai-avatar-small {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--color-solid);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.welcome-content {
  flex: 1;
}

.welcome-text {
  margin: 0 0 var(--space-2) 0;
  font-size: var(--text-base);
  color: var(--color-text-primary);
  line-height: var(--leading-normal);
}

.welcome-text strong {
  color: var(--color-solid);
  font-weight: var(--font-semibold);
}

.summary-text {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

/* ====== 推荐区块 ====== */
.recommendation-section {
  margin-bottom: var(--space-10);
}

.recommendation-section.alternative {
  opacity: 0.9;
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-3);
  border-bottom: 2px solid var(--color-border);
  letter-spacing: -0.25px;
}

.section-title::after {
  content: '';
  display: block;
  width: 40px;
  height: 3px;
  background: var(--color-accent);
  margin-top: -13px;
  border-radius: 2px;
  position: relative;
  z-index: 1;
}

.section-title .el-icon {
  color: var(--color-slate-600);
}

.section-title--muted {
  color: var(--color-text-secondary);
}

.section-title--muted .el-icon {
  color: var(--color-text-tertiary);
}

.section-title--muted::after {
  background: var(--color-slate-300);
}

/* ====== 学校网格 (§11.4 固定3列) ====== */
.schools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

@media (max-width: 1024px) {
  .schools-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .schools-grid { grid-template-columns: 1fr; }
}

/* ====== 底部操作栏 ====== */
.list-actions {
  margin-top: var(--space-10);
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border-light);
}

/* ====== AI 输入框 ====== */
.ai-chat-input-wrapper {
  margin-bottom: var(--space-6);
}

.ai-input-container {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-2) var(--space-2) var(--space-5);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.ai-input-container:focus-within {
  border-color: var(--color-solid);
  box-shadow: var(--shadow-md), 0 0 0 3px rgba(15, 23, 42, 0.08);
}

.ai-input-icon {
  font-size: 18px;
  color: var(--color-slate-500);
  flex-shrink: 0;
}

.ai-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: var(--text-base);
  color: var(--color-text-primary);
  outline: none;
  padding: var(--space-2) 0;
  min-height: 22px;
}

.ai-input::placeholder {
  color: var(--color-text-muted);
}

.ai-send-btn {
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
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.ai-send-btn.is-active {
  background: var(--color-solid);
  color: white;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.ai-send-btn.is-active:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* ====== 操作按钮组 ====== */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 42px;
}

.action-btn.secondary {
  background: var(--color-slate-100);
  color: var(--color-text-secondary);
}

.action-btn.secondary:hover {
  background: var(--color-slate-200);
  transform: translateY(-1px);
}

.action-btn.primary {
  background: var(--color-solid);
  color: white;
  box-shadow: var(--shadow-md);
}

.action-btn.primary:hover:not(.is-disabled) {
  background: var(--color-solid-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.action-btn.primary.is-disabled {
  background: var(--color-slate-200);
  color: var(--color-text-muted);
  cursor: not-allowed;
  box-shadow: none;
}

.btn-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}
</style>
