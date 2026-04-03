<template>
  <div
    ref="pageRoot"
    class="school-detail-page"
  >
    <div class="school-detail-container">
      <!-- 返回按钮 -->
      <div class="detail-back">
        <el-button
          class="back-btn"
          @click="router.back()"
        >
          <el-icon><ArrowLeft /></el-icon>
          {{ backLabel }}
        </el-button>
      </div>

      <div
        v-if="school"
        class="school-detail"
      >
        <!-- 头部信息卡片 -->
        <div class="detail-header">
          <div class="header-left">
            <h1 class="school-name">
              {{ school.name }}
            </h1>
            <div class="school-meta">
              <el-tag
                :type="getCountryTagType(school.country)"
                size="large"
              >
                {{ school.country }}
              </el-tag>
              <span class="meta-separator">|</span>
              <span class="meta-item">{{ school.ranking }}</span>
              <span class="meta-separator">|</span>
              <span class="meta-item">匹配度 {{ school.match }}%</span>
            </div>
          </div>
          <div class="header-right">
            <el-button
              v-if="!isFavorite"
              type="warning"
              plain
              @click="toggleFavorite"
            >
              <el-icon><Star /></el-icon>
              收藏院校
            </el-button>
            <el-button
              v-else
              type="warning"
              @click="toggleFavorite"
            >
              <el-icon><StarFilled /></el-icon>
              已收藏
            </el-button>
          </div>
        </div>

        <!-- 基本信息区 -->
        <div class="info-grid">
          <div class="info-card">
            <div class="info-card-header">
              <el-icon class="info-icon">
                <OfficeBuilding />
              </el-icon>
              <h3>院校概况</h3>
            </div>
            <div class="school-info-list">
              <p><strong>国家/地区：</strong>{{ school.country }}</p>
              <p><strong>世界排名：</strong>{{ school.ranking }}</p>
              <p><strong>专业方向：</strong>{{ school.major }}</p>
              <p>
                <strong>录取难度：</strong>
                <el-tag
                  :type="getDifficultyTagType(school.match)"
                  size="small"
                >
                  {{ getDifficultyText(school.match) }}
                </el-tag>
              </p>
            </div>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <el-icon class="info-icon">
                <Money />
              </el-icon>
              <h3>学费与费用</h3>
            </div>
            <div class="school-info-list">
              <p><strong>预估学费：</strong>{{ school.tuition }}</p>
              <p><strong>录取率：</strong>{{ school.acceptanceRate }}</p>
              <p class="info-note">
                * 费用仅供参考，具体以学校官方公布为准
              </p>
            </div>
          </div>
        </div>

        <!-- 专业设置卡片 -->
        <div class="info-card programs-card">
          <div class="info-card-header">
            <el-icon class="info-icon">
              <Collection />
            </el-icon>
            <h3>专业设置</h3>
          </div>
          <div class="programs-list">
            <div class="program-item">
              <div class="program-header">
                <span class="program-name">{{ school.major }}</span>
                <el-tag
                  type="primary"
                  size="small"
                >
                  热门专业
                </el-tag>
              </div>
              <p class="program-desc">
                该院校在{{ school.major }}领域具有较强的学术实力和研究资源。
              </p>
              <div class="program-highlights">
                <span class="highlight-item">
                  <el-icon><Opportunity /></el-icon>
                  {{ getProgramHighlight(school.major) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 申请要求卡片 -->
        <div class="info-card requirements-card">
          <div class="info-card-header">
            <el-icon class="info-icon">
              <Document />
            </el-icon>
            <h3>申请要求</h3>
          </div>
          <div class="requirements-list">
            <h4>学术要求</h4>
            <ul>
              <li
                v-for="(req, idx) in school.requirements"
                :key="idx"
              >
                {{ req }}
              </li>
            </ul>
            <h4>其他要求</h4>
            <ul>
              <li>个人陈述（Statement of Purpose）</li>
              <li>推荐信（2-3封）</li>
              <li>英语成绩：托福90+或雅思6.5+</li>
              <li>GRE/GMAT成绩（视专业而定）</li>
            </ul>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="detail-actions">
          <el-button
            type="primary"
            size="large"
            class="action-btn primary-btn"
            @click="goToRecommendation"
          >
            <el-icon><Search /></el-icon>
            查看匹配度分析
          </el-button>
          <el-button
            size="large"
            class="action-btn"
            @click="goToTimeline"
          >
            <el-icon><Timer /></el-icon>
            添加到时间规划
          </el-button>
          <el-button
            size="large"
            class="action-btn"
            @click="startChat"
          >
            <el-icon><ChatDotRound /></el-icon>
            咨询AI顾问
          </el-button>
        </div>
      </div>

      <!-- 未找到院校 -->
      <el-result
        v-else
        icon="warning"
        title="院校未找到"
        sub-title="未找到对应的院校信息"
      >
        <template #extra>
          <el-button
            type="primary"
            @click="router.push('/university-database')"
          >
            返回院校数据库
          </el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getSchoolById } from '@/utils/recommendationEngine'

const route = useRoute()
const router = useRouter()
const pageRoot = ref(null)

const fromLabels = {
  recommendation: '返回选校推荐',
  database: '返回院校库',
  timeline: '返回时间规划',
  materials: '返回材料中心',
  home: '返回首页'
}

const backLabel = computed(() => {
  return fromLabels[route.query.from] || '返回'
})

const school = computed(() => {
  const id = parseInt(route.params.id)
  const foundSchool = getSchoolById(id)
  if (!foundSchool) return null
  if (foundSchool.match !== undefined) return foundSchool
  const competitivenessMap = {
    'extreme': 88,
    'very_high': 78,
    'high': 68,
    'moderate': 55,
    'accessible': 45
  }
  return {
    ...foundSchool,
    match: foundSchool.admissionCriteria
      ? competitivenessMap[foundSchool.admissionCriteria.competitiveness] || 50
      : 50
  }
})

const isFavorite = computed(() => {
  const favs = JSON.parse(localStorage.getItem('school_favorites') || '[]')
  return favs.includes(school.value?.id)
})

const getCountryTagType = (country) => {
  const types = {
    '美国': 'primary',
    '英国': 'success',
    '中国': 'warning',
    '澳大利亚': 'info'
  }
  return types[country] || 'info'
}

const getDifficultyTagType = (match) => {
  if (match >= 85) return 'danger'
  if (match >= 70) return 'warning'
  return 'success'
}

const getDifficultyText = (match) => {
  if (match >= 85) return '高难度'
  if (match >= 70) return '中等'
  return '较易'
}

const getProgramHighlight = (major) => {
  const highlights = {
    'CS': '提供AI、系统、理论等多个研究方向',
    'Computer Science': '提供AI、系统、理论等多个研究方向',
    'AI': '涵盖机器学习、计算机视觉、自然语言处理'
  }
  return highlights[major] || '提供广泛的计算机科学课程和研究机会'
}

const toggleFavorite = () => {
  if (!school.value) return
  const favs = JSON.parse(localStorage.getItem('school_favorites') || '[]')
  const idx = favs.indexOf(school.value.id)
  if (idx > -1) {
    favs.splice(idx, 1)
    ElMessage.success('已取消收藏')
  } else {
    favs.push(school.value.id)
    ElMessage.success('已收藏')
  }
  localStorage.setItem('school_favorites', JSON.stringify(favs))
}

const goToRecommendation = () => {
  router.push('/school-recommendation')
}

const goToTimeline = () => {
  router.push('/timeline')
}

const startChat = () => {
  router.push('/ai-chat')
}

onMounted(() => {
  console.log('School detail page loaded, id:', route.params.id)
})

// 暴露组件实例到window用于测试
window.schoolDetailComponent = {
  get school() { return school.value },
  get isFavorite() { return isFavorite.value }
}
</script>

<style scoped>
.school-detail-page {
  max-width: 1200px;
  margin: 0 auto;
}

.school-detail-container {
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
  color: var(--color-slate-700);
  border-color: var(--color-slate-700);
  font-size: 14px;
}

.back-btn:hover {
  background: var(--color-slate-50);
  border-color: var(--color-slate-700);
  color: var(--color-slate-700);
}

/* 主详情卡片 */
.school-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 头部信息 */
.detail-header {
  background: var(--color-solid);
  border-radius: 16px;
  padding: 32px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.school-name {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: white;
  line-height: 1.3;
}

.school-meta {
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

.header-right {
  display: flex;
  gap: 12px;
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
  color: var(--color-slate-700);
}

.school-info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.school-info-list p {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.school-info-list strong {
  color: #303233;
  margin-right: 8px;
}

.info-note {
  font-size: 12px;
  color: #909399;
  font-style: italic;
}

/* 专业设置卡片 */
.programs-card {
  grid-column: 1 / -1;
}

.programs-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.program-item {
  background: #f9f9fc;
  border-radius: 10px;
  padding: 20px;
}

.program-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.program-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.program-desc {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.7;
}

.program-highlights {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.highlight-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-slate-700);
}

/* 申请要求卡片 */
.requirements-card {
  grid-column: 1 / -1;
}

.requirements-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.requirements-list h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.requirements-list ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.requirements-list li {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
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
  min-width: 180px;
  height: 48px;
  border-radius: 24px;
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
  background: var(--color-solid);
  border: none;
  color: white;
}

.primary-btn:hover {
  transform: scale(1.03);
  box-shadow: var(--shadow-glow-accent);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 24px;
  }

  .school-name {
    font-size: 22px;
  }

  .school-meta {
    font-size: 13px;
  }

  .header-right {
    width: 100%;
    justify-content: stretch;
  }

  .header-right .el-button {
    flex: 1;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .detail-actions {
    flex-direction: column;
    align-items: center;
  }

  .action-btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .school-detail-page {
    padding: 0 4px;
  }

  .school-name {
    font-size: 20px;
  }

  .school-meta {
    gap: 8px;
  }

  .meta-separator {
    display: none;
  }

  .info-card {
    padding: 16px;
  }

  .info-card-header h3 {
    font-size: 15px;
  }
}
</style>
