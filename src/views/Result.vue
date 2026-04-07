<template>
  <div class="result-page">
    <div class="noise-overlay" />

    <StarBackground
      :particle-count="120"
      :connection-distance="100"
      :opacity="0.8"
    />

    <main class="result-content">
      <ResultHero />
      <ScoreTable />
      <TechCompare />
      <Manifesto />
      <ResultClosing />
    </main>

    <nav class="result-nav">
      <button
        v-for="(_, index) in sections"
        :key="index"
        class="nav-dot"
        :class="{ 'is-active': activeSection === index }"
        @click="scrollToSection(index)"
      />
    </nav>

    <Transition name="fade">
      <button
        v-show="showBackToTop"
        class="back-to-top"
        @click="scrollToTop"
      >
        <el-icon :size="20">
          <ArrowUp />
        </el-icon>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUp } from '@element-plus/icons-vue'
import StarBackground from '@/components/story/StarBackground.vue'
import ResultHero from '@/components/result/ResultHero.vue'
import ScoreTable from '@/components/result/ScoreTable.vue'
import TechCompare from '@/components/result/TechCompare.vue'
import Manifesto from '@/components/result/Manifesto.vue'
import ResultClosing from '@/components/result/ResultClosing.vue'

const sections = ['hero', 'table', 'tech', 'manifesto', 'closing']
const activeSection = ref(0)
const showBackToTop = ref(false)

let observer: IntersectionObserver | null = null
const sectionRefs = ref<HTMLElement[]>([])

onMounted(() => {
  const sectionElements = document.querySelectorAll('.result-hero, .score-table, .tech-compare, .manifesto, .result-closing')
  sectionRefs.value = Array.from(sectionElements) as HTMLElement[]

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionRefs.value.indexOf(entry.target as HTMLElement)
          if (index !== -1) {
            activeSection.value = index
          }
        }
      })
    },
    { threshold: 0.5 }
  )

  sectionRefs.value.forEach((el) => {
    if (el) observer?.observe(el)
  })

  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  showBackToTop.value = window.scrollY > window.innerHeight
}

function scrollToSection(index: number) {
  activeSection.value = index
  const section = sectionRefs.value[index]
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.result-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #0F172A;
  color: #F8FAFC;
  overflow-x: hidden;
}

.noise-overlay {
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  z-index: 1000;
}

.result-content {
  position: relative;
  z-index: 1;
}

.result-nav {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 100;
}

.nav-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid rgba(148, 163, 184, 0.4);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-dot:hover {
  border-color: #D97706;
  transform: scale(1.2);
}

.nav-dot.is-active {
  background: #D97706;
  border-color: #D97706;
  transform: scale(1.3);
  box-shadow: 0 0 10px rgba(217, 119, 6, 0.5);
}

.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 50%;
  color: #D97706;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(10px);
}

.back-to-top:hover {
  background: #D97706;
  border-color: #D97706;
  color: #0F172A;
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(217, 119, 6, 0.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .nav-dot,
  .back-to-top {
    transition: none;
  }
}

@media (max-width: 768px) {
  .result-nav {
    right: 1rem;
    gap: 0.75rem;
  }

  .nav-dot {
    width: 8px;
    height: 8px;
  }

  .back-to-top {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 44px;
    height: 44px;
  }
}
</style>
