<template>
  <section class="story-hero">
    <div class="hero-content">
      <!-- 主标题 -->
      <h1 class="hero-title">
        <span class="title-line">智途</span>
        <span class="title-line title-accent">AstroPath</span>
      </h1>

      <!-- 副标题 -->
      <p class="hero-subtitle">
        一站式智能留学规划平台
      </p>

      <!-- 描述 -->
      <p class="hero-description">
        从首次commit到比赛日的完整旅程
      </p>

      <!-- 比赛信息 -->
      <div class="contest-info">
        <div class="contest-badge">
          <el-icon :size="16">
            <Trophy />
          </el-icon>
          <span>人工智能学院第四届科创节网页设计大赛</span>
        </div>
        <div class="contest-date">
          2026年4月7日
        </div>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="hero-glow" />
  </section>
</template>

<script setup lang="ts">
import { Trophy } from '@element-plus/icons-vue'
</script>

<style scoped>
.story-hero {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;
  max-width: 900px;
}

/* Title */
.hero-title {
  margin: 0 0 1.5rem;
  line-height: 1;
}

.title-line {
  display: block;
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 700;
  color: #F8FAFC;
  letter-spacing: -0.03em;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  animation-delay: 0.1s;
}

.title-accent {
  color: #D97706;
  animation-delay: 0.2s;
}

/* Subtitle */
.hero-subtitle {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 500;
  color: #94A3B8;
  margin: 0 0 1rem;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  animation-delay: 0.3s;
}

/* Description */
.hero-description {
  font-size: 1rem;
  color: #64748B;
  margin: 0 0 2rem;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  animation-delay: 0.4s;
}

/* Contest Info */
.contest-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  animation-delay: 0.5s;
}

.contest-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  color: #E2E8F0;
  font-size: 0.875rem;
}

.contest-date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: #D97706;
  font-weight: 500;
}

/* Glow Effect */
.hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.15) 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .title-line,
  .hero-subtitle,
  .hero-description,
  .contest-info {
    animation: none;
    opacity: 1;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .hero-content {
    padding: 1.5rem;
  }

  .contest-badge {
    flex-direction: column;
    text-align: center;
    padding: 12px 16px;
  }
}
</style>
