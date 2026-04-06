<template>
  <div
    class="loading-state"
    :class="`size-${size}`"
  >
    <div class="loading-spinner">
      <div class="spinner-ring" />
      <div class="spinner-ring" />
      <div class="spinner-ring" />
    </div>
    <p
      v-if="text"
      class="loading-text"
    >
      {{ text }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  text: String
})
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
}

.loading-spinner {
  position: relative;
  width: 40px;
  height: 40px;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: var(--color-slate-700);
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(1) {
  animation-duration: 1s;
}

.spinner-ring:nth-child(2) {
  animation-duration: 1.2s;
  animation-direction: reverse;
  border-top-color: var(--color-slate-700);
}

.spinner-ring:nth-child(3) {
  animation-duration: 0.8s;
  border-top-color: var(--color-slate-200);
}

/* 尺寸 */
.size-sm .loading-spinner {
  width: 24px;
  height: 24px;
}

.size-sm .spinner-ring {
  border-width: 2px;
}

.size-md .loading-spinner {
  width: 40px;
  height: 40px;
}

.size-lg .loading-spinner {
  width: 64px;
  height: 64px;
}

.size-lg .spinner-ring {
  border-width: 4px;
}

.loading-text {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
