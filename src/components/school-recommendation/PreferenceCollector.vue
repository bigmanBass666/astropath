<template>
  <div class="preference-collector">
    <div class="ai-avatar-section">
      <div class="ai-avatar">
        <el-icon :size="48"><ChatDotRound /></el-icon>
      </div>
      <div class="ai-welcome">
        <h3>🤖 AI选校助手</h3>
        <p class="ai-greeting">你好！我是你的专属选校顾问。</p>
      </div>
    </div>

    <div class="background-summary" v-if="assessment">
      <p class="summary-text">我已经了解了你的背景：</p>
      <div class="summary-tags">
        <el-tag type="primary">GPA: {{ assessment.basic?.gpa || 'N/A' }}</el-tag>
        <el-tag type="success">{{ getUniversityLabel(assessment.basic?.university) }}</el-tag>
        <el-tag type="warning">均分: {{ assessment.academic?.averageScore || 'N/A' }}</el-tag>
        <el-tag type="info">{{ assessment.academic?.degree || '本科' }}</el-tag>
      </div>
    </div>

    <div class="preference-form">
      <p class="form-intro">为了给你最合适的推荐，请告诉我：</p>

      <!-- 问题1: 最看重什么 -->
      <div class="form-item">
        <label class="form-label">
          <span class="question-number">①</span>
          你目前最看重什么？<span class="multi-hint">（可多选）</span>
        </label>
        <div class="priority-options">
          <el-check-tag
            v-for="option in priorityOptions"
            :key="option.value"
            :checked="selectedPriorities.includes(option.value)"
            @change="togglePriority(option.value)"
            class="priority-tag"
            :class="{ 'is-checked': selectedPriorities.includes(option.value) }"
          >
            <el-icon :size="16">
              <Trophy v-if="option.icon === 'Trophy'" />
              <Reading v-else-if="option.icon === 'Reading'" />
              <Briefcase v-else-if="option.icon === 'Briefcase'" />
              <MapLocation v-else-if="option.icon === 'MapLocation'" />
              <Money v-else-if="option.icon === 'Money'" />
            </el-icon>
            {{ option.label }}
          </el-check-tag>
        </div>
      </div>

      <!-- 问题2: 想避开的国家 -->
      <div class="form-item">
        <label class="form-label">
          <span class="question-number">②</span>
          有想避开的国家/地区吗？
        </label>
        <div class="country-options">
          <el-check-tag
            :checked="excludedCountries.length === 0"
            @change="clearExcludedCountries"
            class="country-tag"
            :class="{ 'is-checked': excludedCountries.length === 0 }"
          >
            无
          </el-check-tag>
          <el-check-tag
            v-for="country in availableCountries"
            :key="country"
            :checked="excludedCountries.includes(country)"
            @change="toggleCountry(country)"
            class="country-tag"
            :class="{ 'is-checked': excludedCountries.includes(country) }"
          >
            {{ country }}
          </el-check-tag>
        </div>
      </div>

      <!-- 问题3: 特殊要求 -->
      <div class="form-item">
        <label class="form-label">
          <span class="question-number">③</span>
          还有什么特别的要求吗？<span class="optional-hint">（选填）</span>
        </label>
        <el-input
          v-model="specialRequirements"
          type="textarea"
          :rows="3"
          placeholder="例如：我想去加州的学校、希望学费在3万美元以内、偏好小班教学..."
          class="special-input"
        />
      </div>
    </div>

    <div class="form-actions">
      <el-button
        type="primary"
        size="large"
        @click="submitPreferences"
        :loading="loading"
        :disabled="selectedPriorities.length === 0"
        class="submit-btn"
      >
        <el-icon><MagicStick /></el-icon>
        开始智能推荐
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChatDotRound, MagicStick, Trophy, Briefcase, MapLocation, Money, Reading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  assessment: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

const priorityOptions = [
  { value: 'ranking', label: '学校排名', icon: 'Trophy' },
  { value: 'major', label: '专业实力', icon: 'Reading' },
  { value: 'career', label: '就业前景', icon: 'Briefcase' },
  { value: 'location', label: '地理位置', icon: 'MapLocation' },
  { value: 'cost', label: '学费预算', icon: 'Money' }
]

const availableCountries = ['美国', '英国', '澳洲', '加拿大', '新加坡', '中国香港', '日本', '韩国', '欧洲其他']

const selectedPriorities = ref([])
const excludedCountries = ref([])
const specialRequirements = ref('')

const getUniversityLabel = (university) => {
  const map = {
    '985': '985院校',
    '211': '211院校',
    'overseas': '海外院校',
    'regular': '普通本科'
  }
  return map[university] || university || '未知院校'
}

const togglePriority = (value) => {
  const index = selectedPriorities.value.indexOf(value)
  if (index > -1) {
    selectedPriorities.value.splice(index, 1)
  } else {
    selectedPriorities.value.push(value)
  }
}

const toggleCountry = (country) => {
  const index = excludedCountries.value.indexOf(country)
  if (index > -1) {
    excludedCountries.value.splice(index, 1)
  } else {
    excludedCountries.value.push(country)
  }
}

const clearExcludedCountries = () => {
  excludedCountries.value = []
}

const submitPreferences = () => {
  if (selectedPriorities.value.length === 0) {
    ElMessage.warning('请至少选择一个最看重的维度')
    return
  }

  emit('submit', {
    priorities: selectedPriorities.value,
    excludedCountries: excludedCountries.value,
    specialRequirements: specialRequirements.value
  })
}
</script>

<style scoped>
.preference-collector {
  max-width: 700px;
  margin: 0 auto;
  padding: 30px;
}

.ai-avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 1px solid #e8e8e8;
}

.ai-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.ai-welcome h3 {
  margin: 0 0 8px 0;
  font-size: 22px;
  color: #1a1a2e;
}

.ai-greeting {
  margin: 0;
  color: #666;
  font-size: 15px;
}

.background-summary {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid #e0e7ff;
}

.summary-text {
  margin: 0 0 12px 0;
  color: #4c51bf;
  font-weight: 500;
}

.summary-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.preference-form {
  margin-bottom: 30px;
}

.form-intro {
  font-size: 16px;
  color: #333;
  margin-bottom: 25px;
  font-weight: 500;
}

.form-item {
  margin-bottom: 28px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 14px;
}

.question-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
}

.multi-hint,
.optional-hint {
  font-size: 13px;
  color: #999;
  font-weight: normal;
}

.priority-options,
.country-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.priority-tag,
.country-tag {
  padding: 10px 18px;
  font-size: 14px;
  border-radius: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  background: white;
}

.priority-tag:hover,
.country-tag:hover {
  border-color: #667eea;
  color: #667eea;
}

.priority-tag.is-checked,
.country-tag.is-checked {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
}

.priority-tag .el-icon {
  margin-right: 6px;
  vertical-align: middle;
}

.special-input :deep(.el-textarea__inner) {
  border-radius: 10px;
  resize: none;
}

.form-actions {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}

.submit-btn {
  padding: 14px 40px;
  font-size: 16px;
  border-radius: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

.submit-btn .el-icon {
  margin-right: 8px;
}
</style>
