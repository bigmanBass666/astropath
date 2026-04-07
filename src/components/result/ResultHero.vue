<template>
  <section class="result-hero">
    <div class="result-hero__content">
      <h1 class="result-hero__title">
        比赛结果
      </h1>
      <p class="result-hero__subtitle">
        科创节网页设计大赛
      </p>
      <div class="result-hero__stats">
        <div class="result-hero__stat">
          <span class="result-hero__stat-value">{{ ourScore?.rank || '-' }}</span>
          <span class="result-hero__stat-label">排名</span>
        </div>
        <div class="result-hero__stat">
          <span class="result-hero__stat-value">{{ ourScore?.totalScore || '-' }}</span>
          <span class="result-hero__stat-label">总分</span>
        </div>
        <div class="result-hero__stat">
          <span
            class="result-hero__stat-value"
            :class="{ 'is-revealed': isRevealed }"
          >{{ currentPrize }}</span>
          <span class="result-hero__stat-label">奖品</span>
        </div>
      </div>
      <p class="result-hero__quote">
        "卫生纸巾会用完，但你们写的代码、积累的技术、证明的能力，这些都不会消失。"
      </p>
      <p class="result-hero__cite">
        <span class="result-hero__cite-text">—— Claude AI，智途 AstroPath 全程协作者</span>
        <span class="result-hero__cite-detail">从第一行代码到最后一行 · 最了解这个项目的人之一</span>
      </p>
    </div>
    <div class="result-hero__scroll-hint">
      <span>向下滚动</span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ourTeamScore } from '@/data/competition-scores'

const ourScore = ourTeamScore

const prizes = [
  '小米手环',
  '耳机',
  '相机',
  '卫生纸巾',
]

const currentPrize = ref(prizes[0])
const isRevealed = ref(false)

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  if (prefersReducedMotion) {
    currentPrize.value = prizes[prizes.length - 1]
    isRevealed.value = true
    return
  }

  let currentIndex = 0
  let iterations = 0
  const totalIterations = 40
  let delay = 12

  function spin() {
    currentIndex = (currentIndex + 1) % prizes.length
    currentPrize.value = prizes[currentIndex]
    iterations++

    if (iterations < totalIterations) {
      delay = 12 + Math.pow(iterations, 1.3) * 1.2
      setTimeout(spin, delay)
    } else {
      currentPrize.value = prizes[prizes.length - 1]
      isRevealed.value = true
    }
  }

  setTimeout(spin, 300)
})
</script>

<style scoped>
.result-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.result-hero__content {
  animation: heroFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes heroFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-hero__title {
  margin: 0 0 0.5rem;
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #F8FAFC;
  line-height: 1.1;
}

.result-hero__subtitle {
  margin: 0 0 3rem;
  font-size: 1.125rem;
  color: rgba(248, 250, 252, 0.6);
  font-family: var(--font-family-mono);
  letter-spacing: 0.05em;
}

.result-hero__stats {
  display: flex;
  gap: 3rem;
  justify-content: center;
  animation: statsFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

@keyframes statsFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-hero__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.result-hero__stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  font-family: var(--font-family-mono);
  color: #D97706;
  line-height: 1;
  transition: all 0.3s ease;
}

.result-hero__stat-value.is-revealed {
  animation: prizeReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
             breathe 2.5s ease-in-out 0.8s infinite;
}

@keyframes prizeReveal {
  0% {
    transform: scale(1);
    text-shadow: none;
    filter: brightness(1);
  }
  50% {
    transform: scale(1.4);
    text-shadow: 
      0 0 40px rgba(217, 119, 6, 1),
      0 0 80px rgba(217, 119, 6, 0.8),
      0 0 120px rgba(217, 119, 6, 0.6),
      0 0 160px rgba(217, 119, 6, 0.4);
    filter: brightness(1.5);
  }
  100% {
    transform: scale(1.1);
    text-shadow: 
      0 0 25px rgba(217, 119, 6, 1),
      0 0 50px rgba(217, 119, 6, 0.7),
      0 0 75px rgba(217, 119, 6, 0.5);
    filter: brightness(1.2);
  }
}

@keyframes breathe {
  0%, 100% {
    text-shadow: 
      0 0 25px rgba(217, 119, 6, 1),
      0 0 50px rgba(217, 119, 6, 0.7),
      0 0 75px rgba(217, 119, 6, 0.5);
    filter: brightness(1.2);
  }
  50% {
    text-shadow: 
      0 0 35px rgba(217, 119, 6, 1),
      0 0 70px rgba(217, 119, 6, 0.85),
      0 0 105px rgba(217, 119, 6, 0.65),
      0 0 140px rgba(217, 119, 6, 0.45);
    filter: brightness(1.4);
  }
}

.result-hero__stat-label {
  font-size: 0.875rem;
  color: rgba(248, 250, 252, 0.5);
  font-family: var(--font-family-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.result-hero__quote {
  margin: 3rem auto 0;
  font-size: 0.9375rem;
  color: rgba(248, 250, 252, 0.4);
  font-style: italic;
  white-space: nowrap;
  line-height: 1.7;
  animation: quoteFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
}

.result-hero__cite {
  position: relative;
  display: inline-block;
  margin: 0.75rem auto 0;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  color: rgba(248, 250, 252, 0.3);
  font-family: var(--font-family-mono);
  letter-spacing: 0.05em;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-hero__cite:hover {
  color: rgba(248, 250, 252, 0.6);
  background: rgba(248, 250, 252, 0.05);
}

.result-hero__cite-text {
  display: inline;
}

.result-hero__cite-detail {
  position: absolute;
  bottom: calc(100% + 0.75rem);
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  display: block;
  width: max-content;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-style: normal;
  white-space: nowrap;
  color: rgba(248, 250, 252, 0.8);
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(217, 119, 6, 0.3);
  border-radius: 8px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.result-hero__cite-detail::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(15, 23, 42, 0.95);
}

.result-hero__cite:hover .result-hero__cite-detail {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

@keyframes quoteFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-hero__scroll-hint {
  position: absolute;
  bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(248, 250, 252, 0.4);
  font-size: 0.75rem;
  font-family: var(--font-family-mono);
  letter-spacing: 0.1em;
  animation: scrollBounce 2s ease-in-out infinite;
}

@keyframes scrollBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .result-hero__content,
  .result-hero__stats {
    animation: none;
  }
  .result-hero__scroll-hint {
    animation: none;
  }
}

@media (max-width: 768px) {
  .result-hero__stats {
    gap: 2rem;
  }
  .result-hero__stat-value {
    font-size: 2rem;
  }
}
</style>
