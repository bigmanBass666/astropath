<template>
  <span 
    class="base-badge" 
    :class="[`variant-${variant}`, `size-${size}`]"
  >
    <component
      :is="icon"
      v-if="icon"
      :size="iconSize"
    />
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  icon: Object
})

const iconSize = computed(() => {
  const sizes = { sm: 12, md: 14, lg: 16 }
  return sizes[props.size]
})
</script>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-weight: var(--font-medium);
  border-radius: var(--radius-full);
}

/* 尺寸 */
.size-sm {
  padding: 2px 8px;
  font-size: var(--text-xs);
}

.size-md {
  padding: 4px 12px;
  font-size: var(--text-sm);
}

.size-lg {
  padding: 6px 16px;
  font-size: var(--text-base);
}

/* 变体 */
.variant-default {
  background: var(--color-background);
  color: var(--color-text-secondary);
}

.variant-primary {
  background: var(--color-slate-100);
  color: var(--color-slate-700);
}

.variant-success {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.variant-warning {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.variant-danger {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.variant-info {
  background: var(--color-info-bg);
  color: var(--color-info);
}
</style>
