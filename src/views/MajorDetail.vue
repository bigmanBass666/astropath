<template>
  <div
    ref="pageRoot"
    class="major-detail-page"
  >
    <div class="major-detail-container">
      <!-- 返回按钮 -->
      <div class="detail-back">
        <el-button
          class="back-btn"
          @click="$router.back()"
        >
          <el-icon><ArrowLeft /></el-icon>
          返回专业库
        </el-button>
      </div>

      <div
        v-if="major"
        class="major-detail"
      >
        <!-- 头部信息卡片 -->
        <div class="detail-header">
          <div class="header-left">
            <h1 class="major-title">
              {{ major.name }}
            </h1>
            <div class="major-meta">
              <el-tag
                :type="getCategoryTagType(major.category)"
                size="large"
              >
                {{ major.category }}
              </el-tag>
              <span class="meta-separator">|</span>
              <span class="meta-item">{{ major.degreeType }}</span>
              <span class="meta-separator">|</span>
              <span class="meta-item">{{ major.duration }}</span>
            </div>
          </div>
        </div>

        <!-- 基本信息区 -->
        <div class="info-grid">
          <div class="info-card">
            <div class="info-card-header">
              <el-icon class="info-icon">
                <Reading />
              </el-icon>
              <h3>专业描述</h3>
            </div>
            <p class="info-text">
              {{ major.description }}
            </p>
          </div>
          <div class="info-card">
            <div class="info-card-header">
              <el-icon class="info-icon">
                <TrendCharts />
              </el-icon>
              <h3>平均薪资</h3>
            </div>
            <p class="info-text salary-text">
              {{ major.salaryRange }}
            </p>
          </div>
        </div>

        <!-- 核心课程卡片 -->
        <div class="info-card courses-card">
          <div class="info-card-header">
            <el-icon class="info-icon">
              <Collection />
            </el-icon>
            <h3>核心课程</h3>
          </div>
          <div class="courses-list">
            <el-tag
              v-for="(course, idx) in major.courses"
              :key="idx"
              type="info"
              class="course-tag"
            >
              {{ course }}
            </el-tag>
          </div>
        </div>

        <!-- 就业方向卡片 -->
        <div class="info-card career-card">
          <div class="info-card-header">
            <el-icon class="info-icon">
              <Briefcase />
            </el-icon>
            <h3>就业方向</h3>
          </div>
          <p class="info-text">
            {{ major.career }}
          </p>
        </div>

        <!-- 操作按钮 -->
        <div class="detail-actions">
          <el-button
            type="primary"
            size="large"
            class="action-btn primary-btn"
          >
            <el-icon><Star /></el-icon>
            收藏专业
          </el-button>
          <el-button
            size="large"
            class="action-btn"
            @click="$router.push('/school-recommendation')"
          >
            <el-icon><Search /></el-icon>
            查看相关院校
          </el-button>
          <el-button
            size="large"
            class="action-btn"
            @click="$router.push('/ai-chat')"
          >
            <el-icon><ChatDotRound /></el-icon>
            咨询AI
          </el-button>
        </div>
      </div>

      <!-- 未找到专业 -->
      <el-result
        v-else
        icon="warning"
        title="专业未找到"
        sub-title="未找到对应的专业信息"
      >
        <template #extra>
          <el-button
            type="primary"
            @click="$router.push('/university-database')"
          >
            返回专业库
          </el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { majorsData } from '@/data/majors'

const route = useRoute()
const pageRoot = ref(null)

const major = computed(() => {
  const id = parseInt(route.params.id)
  return majorsData.find(m => m.id === id) || null
})

const getCategoryTagType = (category) => {
  const types = {
    '工科': 'primary',
    '商科': 'success',
    '社科': 'warning',
    '理科': 'info',
    '文科': 'danger'
  }
  return types[category] || 'info'
}

onMounted(() => {
  console.log('Major detail page loaded, id:', route.params.id)
})
</script>

<style scoped>
.major-detail-page {
  max-width: 1200px;
  margin: 0 auto;
}

.major-detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 返回按钮 */
.detail-back {
  padding-bottom: 8px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-primary);
  border-color: var(--color-primary);
  font-size: 14px;
}

.back-btn:hover {
  background: var(--color-primary-50);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* 主详情卡片 */
.major-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 头部信息 */
.detail-header {
  background: var(--gradient-primary);
  border-radius: 16px;
  padding: 32px;
  color: white;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.major-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: white;
  line-height: 1.3;
}

.major-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-separator {
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
}

.meta-item {
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
}

/* 信息网格 - 两列布局 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

/* 信息卡片通用样式 */
.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f5;
}

.info-card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.info-icon {
  font-size: 20px;
  color: var(--color-primary);
}

.info-text {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.7;
}

.salary-text {
  font-size: 15px;
  font-weight: 600;
  color: #67c23a;
  line-height: 1.6;
}

/* 核心课程卡片 */
.courses-card {
  grid-column: 1 / -1;
}

.courses-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.course-tag {
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 20px;
}

/* 就业方向卡片 */
.career-card {
  grid-column: 1 / -1;
}

/* 操作按钮区 */
.detail-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 8px 0;
  flex-wrap: wrap;
}

.action-btn {
  min-width: 160px;
  height: 44px;
  border-radius: 22px;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.action-btn .el-icon {
  font-size: 16px;
}

.primary-btn {
  background: var(--gradient-primary);
  border: none;
  color: white;
}

.primary-btn:hover {
  transform: scale(1.03);
  box-shadow: var(--shadow-glow-primary);
  background: var(--gradient-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .major-title {
    font-size: 22px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .courses-card,
  .career-card {
    grid-column: 1;
  }

  .detail-header {
    padding: 24px;
  }

  .detail-actions {
    flex-direction: column;
    align-items: center;
  }

  .action-btn {
    width: 100%;
    max-width: 280px;
  }
}

@media (max-width: 480px) {
  .major-detail-page {
    padding: 0 4px;
  }

  .major-title {
    font-size: 20px;
  }

  .major-meta {
    gap: 8px;
  }

  .meta-separator {
    display: none;
  }

  .info-card {
    padding: 16px;
  }
}
</style>
