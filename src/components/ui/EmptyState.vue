<template>
  <div class="empty-state">
    <div class="empty-icon">
      <component
        :is="icon"
        :size="48"
      />
    </div>
    <h4 class="empty-title">
      {{ title }}
    </h4>
    <p class="empty-description">
      {{ description }}
    </p>
    <slot name="action" />
  </div>
</template>

<script setup>
defineProps({
  icon: Object,
  title: String,
  description: String
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12) var(--space-6);
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-2xl);
  background: var(--color-slate-50);
  color: var(--color-slate-700);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-5);
}

.empty-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2);
}

.empty-description {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 400px;
}
</style>
