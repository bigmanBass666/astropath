<template>
  <section class="timeline-section">
    <div class="section-header">
      <span class="section-label">开发历程</span>
      <h2 class="section-title">
        从星尘到星辰
      </h2>
      <p class="section-desc">
        一段代码与梦想的旅程
      </p>
    </div>

    <div class="timeline">
      <div
        v-for="(node, index) in timelineNodes"
        :key="node.id"
        ref="timelineRefs"
        class="timeline-node"
        :class="{ 'is-visible': visibleNodes.has(index) }"
      >
        <div class="node-marker">
          <div class="node-dot" />
          <div class="node-line" />
        </div>

        <div class="node-content">
          <div class="node-date">
            {{ node.date }}
          </div>
          <h3 class="node-title">
            {{ node.title }}
          </h3>
          <p class="node-description">
            {{ node.description }}
          </p>

          <div class="node-details">
            <div
              v-for="(detail, dIndex) in node.details"
              :key="dIndex"
              class="detail-item"
            >
              <span class="detail-dot" />
              <span class="detail-text">{{ detail }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { timelineNodes } from '@/data/storyData'

const timelineRefs = ref<HTMLElement[]>([])
const visibleNodes = ref<Set<number>>(new Set())
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = timelineRefs.value.indexOf(entry.target as HTMLElement)
        if (entry.isIntersecting && index !== -1) {
          visibleNodes.value.add(index)
        }
      })
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    }
  )

  timelineRefs.value.forEach((el) => {
    if (el) observer?.observe(el)
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.timeline-section {
  position: relative;
  width: 100%;
  padding: 6rem 2rem;
  min-height: 100vh;
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

/* Timeline */
.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #D97706, rgba(217, 119, 6, 0.2));
}

/* Timeline Node */
.timeline-node {
  position: relative;
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.timeline-node.is-visible {
  opacity: 1;
  transform: translateX(0);
}

.timeline-node:nth-child(2) { transition-delay: 0.1s; }
.timeline-node:nth-child(3) { transition-delay: 0.2s; }
.timeline-node:nth-child(4) { transition-delay: 0.3s; }
.timeline-node:nth-child(5) { transition-delay: 0.4s; }
.timeline-node:nth-child(6) { transition-delay: 0.5s; }

/* Node Marker */
.node-marker {
  position: relative;
  flex-shrink: 0;
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.node-dot {
  width: 16px;
  height: 16px;
  background: #0F172A;
  border: 3px solid #D97706;
  border-radius: 50%;
  z-index: 2;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.timeline-node.is-visible .node-dot {
  background: #D97706;
  box-shadow: 0 0 20px rgba(217, 119, 6, 0.5);
}

.node-line {
  position: absolute;
  top: 24px;
  bottom: -2rem;
  width: 2px;
  background: rgba(217, 119, 6, 0.2);
}

.timeline-node:last-child .node-line {
  display: none;
}

/* Node Content */
.node-content {
  flex: 1;
  padding-bottom: 2rem;
}

.node-date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: #D97706;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.node-title {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 600;
  color: #F8FAFC;
  margin: 0 0 0.5rem;
}

.node-description {
  font-size: 1rem;
  color: #94A3B8;
  margin: 0 0 1rem;
  font-style: italic;
}

/* Node Details */
.node-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.detail-dot {
  width: 6px;
  height: 6px;
  background: #64748B;
  border-radius: 50%;
  margin-top: 0.5rem;
  flex-shrink: 0;
}

.detail-text {
  font-size: 0.9375rem;
  color: #CBD5E1;
  line-height: 1.6;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .timeline-node {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .timeline-section {
    padding: 4rem 1.5rem;
  }

  .timeline::before {
    left: 12px;
  }

  .timeline-node {
    gap: 1rem;
  }

  .node-marker {
    width: 30px;
  }

  .node-dot {
    width: 12px;
    height: 12px;
    border-width: 2px;
  }

  .node-line {
    top: 18px;
  }
}
</style>
