<template>
  <span class="count-up">{{ displayValue }}{{ suffix }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  endVal: {
    type: Number,
    default: 0
  },
  suffix: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 1500
  }
})

const displayValue = ref(0)

const animate = () => {
  const startTime = performance.now()
  const startVal = 0
  const endVal = props.endVal

  const step = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    displayValue.value = Math.round(startVal + (endVal - startVal) * eased)

    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

onMounted(() => {
  setTimeout(() => animate(), 300)
})

watch(() => props.endVal, () => {
  animate()
})
</script>

<style scoped>
.count-up {
  font-feature-settings: 'tnum';
}
</style>
