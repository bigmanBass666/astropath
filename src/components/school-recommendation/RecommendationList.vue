<template>
  <div class="recommendation-list">
    <!-- AI欢迎语 -->
    <div class="ai-welcome-message">
      <div class="ai-avatar-small">
        <el-icon :size="28">
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
        <el-icon><StarFilled /></el-icon>
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
      <h4 class="section-title">
        <el-icon><Collection /></el-icon>
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
        <div class="ai-input-container">
          <el-icon class="ai-input-icon">
            <ChatDotRound />
          </el-icon>
          <input
            v-model="adjustInput"
            type="text"
            placeholder="告诉AI调整方向，例如：我想去加州的学校"
            class="ai-input"
            @keyup.enter="submitAdjust"
          >
          <button
            class="ai-send-btn"
            :class="{ 'is-active': adjustInput.trim() }"
            @click="submitAdjust"
          >
            <el-icon><Position /></el-icon>
          </button>
        </div>
      </div>

      <!-- 操作按钮组 -->
      <div class="action-buttons">
        <button
          class="action-btn secondary"
          @click="$emit('reset')"
        >
          <el-icon><RefreshLeft /></el-icon>
          <span>重新填写偏好</span>
        </button>
        <button
          class="action-btn primary"
          :class="{ 'is-disabled': favorites.length < 2 }"
          :disabled="favorites.length < 2"
          @click="$emit('compare')"
        >
          <el-icon><ScaleToOriginal /></el-icon>
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

const coreRecommendations = computed(() => {
  return props.recommendations.filter(r => r.category === 'core')
})

const alternativeRecommendations = computed(() => {
  return props.recommendations.filter(r => r.category === 'alternative')
})

const submitAdjust = () => {
  if (!adjustInput.value.trim()) return
  emit('adjust', adjustInput.value.trim())
  adjustInput.value = ''
}
</script>

<style scoped>
.recommendation-list {
  padding: 20px 0;
}

.ai-welcome-message {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 12px;
  border: 1px solid #e0e7ff;
}

.ai-avatar-small {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--gradient-primary);
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
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #1a1a2e;
  line-height: 1.5;
}

.welcome-text strong {
  color: var(--color-primary);
}

.summary-text {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.recommendation-section {
  margin-bottom: 30px;
}

.recommendation-section.alternative {
  opacity: 0.9;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e8e8e8;
}

.section-title .el-icon {
  color: var(--color-primary);
}

.alternative .section-title {
  color: #666;
}

.alternative .section-title .el-icon {
  color: #999;
}

.schools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.list-actions {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}

/* AI 输入框样式 */
.ai-chat-input-wrapper {
  margin-bottom: 20px;
}

.ai-input-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 8px 8px 16px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border: 2px solid #e0e7ff;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.ai-input-container:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 4px 20px rgba(30, 58, 95, 0.15);
  background: #fff;
}

.ai-input-icon {
  font-size: 20px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.ai-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #1a1a2e;
  outline: none;
  padding: 8px 0;
}

.ai-input::placeholder {
  color: #9ca3af;
}

.ai-send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 12px;
  background: #e0e7ff;
  color: #9ca3af;
  cursor: not-allowed;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.ai-send-btn.is-active {
  background: var(--gradient-primary);
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(30, 58, 95, 0.3);
}

.ai-send-btn.is-active:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(30, 58, 95, 0.4);
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.secondary {
  background: #f3f4f6;
  color: #4b5563;
}

.action-btn.secondary:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.action-btn.primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(30, 58, 95, 0.25);
}

.action-btn.primary:hover:not(.is-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 58, 95, 0.35);
}

.action-btn.primary.is-disabled {
  background: #e5e7eb;
  color: #9ca3af;
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
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}
</style>
