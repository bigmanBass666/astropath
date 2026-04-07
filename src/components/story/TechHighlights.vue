<template>
  <section class="tech-highlights">
    <div class="section-header">
      <span class="section-label">技术亮点</span>
      <h2 class="section-title">
        值得骄傲的技术决策
      </h2>
      <p class="section-desc">
        每一个技术选择，都是为了更好的用户体验
      </p>
    </div>

    <div class="highlights-grid">
      <div
        v-for="(highlight, index) in techHighlights"
        :key="highlight.id"
        ref="cardRefs"
        class="highlight-card"
        :class="{ 'is-visible': visibleCards.has(index) }"
        :style="{ '--delay': `${index * 0.1}s` }"
        @mousemove="handleMouseMove($event, index)"
        @mouseleave="handleMouseLeave(index)"
      >
        <div
          class="card-inner"
          :style="getCardStyle(index)"
        >
          <div class="card-glow" />
          
          <div class="card-content">
            <h3 class="card-title">
              {{ highlight.title }}
            </h3>
            <p class="card-description">
              {{ highlight.description }}
            </p>
            
            <div class="card-tags">
              <span
                v-for="tag in highlight.tags"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="card-number">
            {{ String(highlight.id).padStart(2, '0') }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { techHighlights } from '@/data/storyData'

const cardRefs = ref<HTMLElement[]>([])
const visibleCards = ref<Set<number>>(new Set())
const cardTransforms = ref<Map<number, { rotateX: number; rotateY: number }>>(new Map())

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = cardRefs.value.indexOf(entry.target as HTMLElement)
        if (entry.isIntersecting && index !== -1) {
          visibleCards.value.add(index)
        }
      })
    },
    { threshold: 0.2 }
  )

  cardRefs.value.forEach((el) => {
    if (el) observer?.observe(el)
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

function handleMouseMove(e: MouseEvent, index: number) {
  const card = cardRefs.value[index]
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = (y - centerY) / 10
  const rotateY = (centerX - x) / 10

  cardTransforms.value.set(index, { rotateX, rotateY })
}

function handleMouseLeave(index: number) {
  cardTransforms.value.delete(index)
}

function getCardStyle(index: number) {
  const transform = cardTransforms.value.get(index)
  if (!transform) {
    return {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.3s ease-out'
    }
  }
  return {
    transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
    transition: 'transform 0.1s ease-out'
  }
}
</script>

<style scoped>
.tech-highlights {
  position: relative;
  width: 100%;
  padding: 6rem 2rem;
  min-height: 100vh;
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

/* Highlights Grid */
.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Highlight Card */
.highlight-card {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0s);
}

.highlight-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.card-inner {
  position: relative;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 20px;
  padding: 2rem;
  height: 100%;
  overflow: hidden;
  transform-style: preserve-3d;
}

.highlight-card:hover .card-inner {
  border-color: rgba(217, 119, 6, 0.3);
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(217, 119, 6, 0.15),
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.highlight-card:hover .card-glow {
  opacity: 1;
}

.card-content {
  position: relative;
  z-index: 2;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #F8FAFC;
  margin: 0 0 1rem;
  line-height: 1.4;
}

.card-description {
  font-size: 0.9375rem;
  color: #94A3B8;
  line-height: 1.7;
  margin: 0 0 1.5rem;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.375rem 0.75rem;
  background: rgba(217, 119, 6, 0.1);
  border: 1px solid rgba(217, 119, 6, 0.2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #D97706;
  font-family: 'JetBrains Mono', monospace;
}

.card-number {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 3rem;
  font-weight: 700;
  color: rgba(217, 119, 6, 0.1);
  line-height: 1;
  z-index: 1;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .highlight-card {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .card-inner {
    transform: none !important;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .tech-highlights {
    padding: 4rem 1.5rem;
    min-height: auto;
  }

  .highlights-grid {
    grid-template-columns: 1fr;
  }

  .card-inner {
    padding: 1.5rem;
  }

  .card-number {
    font-size: 2rem;
    bottom: 1rem;
    right: 1rem;
  }
}
</style>
