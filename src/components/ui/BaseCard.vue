<template>
  <div 
    class="base-card" 
    :class="[
      `elevation-${elevation}`,
      { 'is-hoverable': hoverable, 'is-clickable': clickable }
    ]"
    @click="$emit('click')"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  elevation: {
    type: Number,
    default: 1,
    validator: (v) => [0, 1, 2, 3].includes(v)
  },
  hoverable: Boolean,
  clickable: Boolean
})

defineEmits(['click'])
</script>

<style scoped>
.base-card {
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  transition: all var(--transition-normal);
}

.elevation-0 {
  border: 1px solid var(--color-border);
}

.elevation-1 {
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
}

.elevation-2 {
  box-shadow: var(--shadow-md);
}

.elevation-3 {
  box-shadow: var(--shadow-lg);
}

.is-hoverable:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.is-clickable {
  cursor: pointer;
}

.is-clickable:active {
  transform: scale(0.98);
}
</style>
