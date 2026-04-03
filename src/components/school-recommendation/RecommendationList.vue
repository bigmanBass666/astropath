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
      <el-input
        v-model="adjustInput"
        placeholder="告诉AI调整方向，例如：我想去加州的学校"
        class="adjust-input"
        @keyup.enter="submitAdjust"
      >
        <template #append>
          <el-button
            :icon="Position"
            @click="submitAdjust"
          />
        </template>
      </el-input>

      <div class="action-buttons">
        <el-button @click="$emit('reset')">
          <el-icon><RefreshLeft /></el-icon>
          重新填写偏好
        </el-button>
        <el-button
          type="primary"
          :disabled="favorites.length < 2"
          @click="$emit('compare')"
        >
          <el-icon><ScaleToOriginal /></el-icon>
          对比收藏 ({{ favorites.length }})
        </el-button>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  color: #667eea;
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
  color: #667eea;
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
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}

.adjust-input {
  margin-bottom: 16px;
}

.adjust-input :deep(.el-input__wrapper) {
  border-radius: 25px;
}

.adjust-input :deep(.el-input-group__append) {
  border-radius: 0 25px 25px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
}

.adjust-input :deep(.el-input-group__append .el-button) {
  color: white;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.action-buttons .el-button {
  border-radius: 20px;
  padding: 12px 24px;
}
</style>
