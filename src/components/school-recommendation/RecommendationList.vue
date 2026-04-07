<template>
  <div class="rec-list">
    <!-- ====== Core Recommendations ====== -->
    <section
      v-if="coreRecs.length > 0"
      class="rl-section"
    >
      <div class="rl-grid rl-grid--editorial">
        <SchoolCard
          v-for="(rec, index) in coreRecs"
          :key="'core-' + rec.schoolId"
          :recommendation="rec"
          :is-favorite="favorites.includes(rec.schoolId)"
          :index="index"
          :is-featured="index === 0"
          :class="{ 'rl-card--featured': index === 0, 'rl-card--standard': index > 0 }"
          @toggle-favorite="$emit('toggle-favorite', rec.schoolId)"
          @view-detail="$emit('view-detail', rec.schoolId)"
          @show-analysis="$emit('show-analysis', rec.schoolId)"
        />
      </div>
    </section>

    <!-- ====== Alternative Recommendations ====== -->
    <section
      v-if="alternativeRecs.length > 0"
      class="rl-section rl-section--alt"
    >
      <div class="rls-header">
        <span class="rlsh-num">02</span>
        <div class="rlsh-line" />
        <h4 class="rlsh-title">
          备选方案
        </h4>
        <span class="rlsh-count">{{ alternativeRecs.length }}</span>
      </div>
      
      <div class="rl-grid rl-grid--standard">
        <SchoolCard
          v-for="(rec, index) in alternativeRecs"
          :key="'alt-' + rec.schoolId"
          :recommendation="rec"
          :is-favorite="favorites.includes(rec.schoolId)"
          :index="index + coreRecs.length"
          class="rl-card--standard"
          @toggle-favorite="$emit('toggle-favorite', rec.schoolId)"
          @view-detail="$emit('view-detail', rec.schoolId)"
          @show-analysis="$emit('show-analysis', rec.schoolId)"
        />
      </div>
    </section>

    <!-- ====== Empty State ====== -->
    <div
      v-if="recommendations.length === 0"
      class="rl-empty"
    >
      <div class="rle-icon">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
          />
          <path d="M8 12h8M12 8v8" />
        </svg>
      </div>
      <p class="rle-text">
        暂无推荐结果
      </p>
      <button
        class="rle-btn"
        @click="$emit('reset')"
      >
        重新选择偏好
      </button>
    </div>

    <!-- ====== Bottom Actions ====== -->
    <footer class="rl-footer">
      <button
        class="rlf-btn rlf-btn--secondary"
        @click="$emit('reset')"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        重新填写
      </button>
      <button
        class="rlf-btn rlf-btn--primary"
        @click="$emit('compare')"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
          />
          <path d="M3 9h18M9 21V9" />
        </svg>
        对比分析
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SchoolCard from './SchoolCard.vue'

const props = defineProps({
  recommendations: {
    type: Array as () => any[],
    default: () => []
  },
  favorites: {
    type: Array as () => number[],
    default: () => []
  },
  summary: {
    type: String,
    default: ''
  }
})

defineEmits(['toggle-favorite', 'view-detail', 'show-analysis', 'reset', 'compare', 'adjust'])

const coreRecs = computed(() => {
  if (!props.recommendations || props.recommendations.length === 0) return []
  return props.recommendations.filter((r: any) => {
    const cat = r.category || 'core'
    return cat === 'core' || cat === 'match' || cat === 'reach'
  })
})

const alternativeRecs = computed(() => {
  if (!props.recommendations || props.recommendations.length === 0) return []
  return props.recommendations.filter((r: any) => {
    const cat = r.category || 'core'
    return cat === 'alternative' || cat === 'safe'
  })
})
</script>

<style scoped>
/* ====== Container ====== */
.rec-list {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

/* ====== Section ====== */
.rl-section {
  animation: rlReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.rl-section--alt {
  animation-delay: 0.2s;
}

@keyframes rlReveal {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ====== Editorial Grid ====== */
.rl-grid {
  display: grid;
  gap: 24px;
}

.rl-grid--editorial {
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    "featured featured standard"
    "standard standard standard";
}

.rl-grid--standard {
  grid-template-columns: repeat(3, 1fr);
}

.rl-card--featured {
  grid-column: span 2;
  grid-row: span 1;
}

.rl-card--standard {
  grid-column: span 1;
}

/* ====== Alternative Section Header ====== */
.rls-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 0 8px;
}

.rlsh-num {
  font-size: 13px;
  font-weight: 800;
  font-family: var(--font-family-mono);
  color: #CBD5E1;
  letter-spacing: 1px;
}

.rlsh-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, #E2E8F0, transparent);
}

.rlsh-title {
  font-size: 14px;
  font-weight: 700;
  color: #64748B;
  letter-spacing: 0.5px;
}

.rlsh-count {
  font-size: 13px;
  font-weight: 700;
  font-family: var(--font-family-mono);
  color: #D97706;
  padding: 4px 12px;
  background: rgba(217,119,6,0.08);
  border-radius: 100px;
}

/* ====== Empty State ====== */
.rl-empty {
  text-align: center;
  padding: 80px 40px;
  background: #FFFFFF;
  border-radius: 24px;
  border: 1px dashed #E2E8F0;
}

.rle-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F8FAFC;
  border-radius: 50%;
  color: #CBD5E1;
}

.rle-text {
  font-size: 16px;
  color: #64748B;
  margin: 0 0 24px;
}

.rle-btn {
  padding: 12px 28px;
  background: #0F172A;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15,23,42,0.15);
}

/* ====== Footer ====== */
.rl-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 32px;
  border-top: 1px solid #E2E8F0;
}

.rlf-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rlf-btn--secondary {
  background: #FFFFFF;
  color: #64748B;
  border: 1px solid #E2E8F0;
}

.rlf-btn--secondary:hover {
  background: #F8FAFC;
  color: #0F172A;
  border-color: #CBD5E1;
}

.rlf-btn--primary {
  background: #0F172A;
  color: #fff;
  border: none;
}

.rlf-btn--primary:hover {
  background: #1E293B;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15,23,42,0.15);
}

/* ====== Responsive ====== */
@media (max-width: 1024px) {
  .rl-grid--editorial,
  .rl-grid--standard {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .rl-card--featured {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .rl-grid--editorial,
  .rl-grid--standard {
    grid-template-columns: 1fr;
  }
  
  .rl-card--featured {
    grid-column: span 1;
  }
  
  .rl-footer {
    flex-direction: column;
    padding: 24px;
  }
  
  .rlf-btn {
    justify-content: center;
  }
}

/* ====== Reduced Motion ====== */
@media (prefers-reduced-motion: reduce) {
  .rl-section {
    animation: none;
    opacity: 1;
  }
}
</style>
