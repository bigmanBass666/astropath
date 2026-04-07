<template>
  <section class="stats-section">
    <div class="section-header">
      <span class="section-label">量化的心血</span>
      <h2 class="section-title">
        数字背后的故事
      </h2>
      <p class="section-desc">
        每一行代码，每一次提交，都是成长的印记
      </p>
    </div>

    <div class="stats-grid">
      <!-- 代码统计 -->
      <div class="stat-category">
        <h3 class="category-title">
          <el-icon :size="20">
            <Document />
          </el-icon>
          <span>代码统计</span>
        </h3>
        <div class="stat-cards">
          <div
            v-for="(stat, index) in codeStats"
            :key="stat.label"
            class="stat-card"
            :class="{ 'is-visible': visibleCards.has(`code-${index}`) }"
          >
            <div class="stat-value">
              <span class="stat-number">{{ formatNumber(animatedValues[`code-${index}`] || 0) }}</span>
              <span class="stat-unit">{{ stat.unit }}</span>
            </div>
            <div class="stat-label">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- Git统计 -->
      <div class="stat-category">
        <h3 class="category-title">
          <el-icon :size="20">
            <Connection />
          </el-icon>
          <span>Git提交</span>
        </h3>
        <div class="stat-cards">
          <div
            v-for="(stat, index) in gitStats"
            :key="stat.label"
            class="stat-card"
            :class="{ 'is-visible': visibleCards.has(`git-${index}`) }"
          >
            <div
              v-if="stat.sublabel"
              class="stat-date"
            >
              {{ stat.sublabel }}
            </div>
            <div
              v-else
              class="stat-value"
            >
              <span class="stat-number">{{ formatNumber(animatedValues[`git-${index}`] || 0) }}</span>
              <span class="stat-unit">{{ stat.unit }}</span>
            </div>
            <div class="stat-label">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- 内容统计 -->
      <div class="stat-category">
        <h3 class="category-title">
          <el-icon :size="20">
            <Collection />
          </el-icon>
          <span>内容数据</span>
        </h3>
        <div class="stat-cards">
          <div
            v-for="(stat, index) in contentStats"
            :key="stat.label"
            class="stat-card"
            :class="{ 'is-visible': visibleCards.has(`content-${index}`) }"
          >
            <div class="stat-value">
              <span class="stat-number">{{ formatNumber(animatedValues[`content-${index}`] || 0) }}</span>
              <span class="stat-unit">{{ stat.unit }}</span>
            </div>
            <div class="stat-label">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Document, Connection, Collection } from '@element-plus/icons-vue'
import { projectStats } from '@/data/storyData'

// 统计数据配置
const codeStats = [
  { label: '代码行数', value: projectStats.code.lines, unit: '+' },
  { label: '文件数量', value: projectStats.code.files, unit: '' },
  { label: '组件数量', value: projectStats.code.components, unit: '' }
]

const gitStats = [
  { label: '提交次数', value: projectStats.git.commits, unit: '' },
  { label: '开发天数', value: projectStats.git.days, unit: '天' },
  { label: '最活跃日期', value: 0, unit: '', sublabel: projectStats.git.mostActiveDate }
]

const contentStats = [
  { label: '院校数据', value: projectStats.content.schools, unit: '' },
  { label: '专业数据', value: projectStats.content.majors, unit: '' },
  { label: 'AI角色', value: projectStats.content.aiAgents, unit: '' }
]

// 动画值
const animatedValues = ref<Record<string, number>>({})
const visibleCards = ref<Set<string>>(new Set())

// 格式化数字
function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN')
}

// Intersection Observer
let observer: IntersectionObserver | null = null
const cardRefs = ref<HTMLElement[]>([])

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = cardRefs.value.indexOf(entry.target as HTMLElement)
          if (index !== -1) {
            const category = Math.floor(index / 3)
            const itemIndex = index % 3
            const key = `${['code', 'git', 'content'][category]}-${itemIndex}`
            visibleCards.value.add(key)
            animateValue(key, getTargetValue(key))
          }
        }
      })
    },
    { threshold: 0.3 }
  )

  // 收集所有卡片元素
  setTimeout(() => {
    const cards = document.querySelectorAll('.stat-card')
    cardRefs.value = Array.from(cards) as HTMLElement[]
    cardRefs.value.forEach((el) => observer?.observe(el))
  }, 100)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

// 获取目标值
function getTargetValue(key: string): number {
  const [category, index] = key.split('-')
  const idx = parseInt(index)
  switch (category) {
    case 'code':
      return codeStats[idx]?.value || 0
    case 'git':
      return gitStats[idx]?.value || 0
    case 'content':
      return contentStats[idx]?.value || 0
    default:
      return 0
  }
}

// 动画函数
function animateValue(key: string, target: number) {
  if (target === 0) {
    animatedValues.value[key] = 0
    return
  }

  const duration = 2000
  const startTime = performance.now()
  const startValue = 0

  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // easeOutExpo
    const easeProgress = 1 - Math.pow(2, -10 * progress)
    
    animatedValues.value[key] = Math.floor(startValue + (target - startValue) * easeProgress)

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}
</script>

<style scoped>
.stats-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-label {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #D97706;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: #F8FAFC;
  margin: 0 0 0.75rem;
  letter-spacing: -0.02em;
}

.section-desc {
  font-size: 1.125rem;
  color: #64748B;
  margin: 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Category */
.stat-category {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #F8FAFC;
  margin: 0;
}

.category-title .el-icon {
  color: #D97706;
}

/* Stat Cards */
.stat-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.stat-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.stat-card:nth-child(1) { transition-delay: 0s; }
.stat-card:nth-child(2) { transition-delay: 0.1s; }
.stat-card:nth-child(3) { transition-delay: 0.2s; }

.stat-card:hover {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(217, 119, 6, 0.3);
  transform: translateY(-4px);
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: #D97706;
  line-height: 1;
}

.stat-unit {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  font-weight: 500;
  color: #D97706;
}

.stat-label {
  font-size: 0.9375rem;
  color: #94A3B8;
}

.stat-date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.75rem;
  font-weight: 700;
  color: #D97706;
  line-height: 1;
  margin-bottom: 0.5rem;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .stat-card {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .stats-section {
    padding: 4rem 1.5rem;
    min-height: auto;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .stat-number {
    font-size: 2rem;
  }
}
</style>
