<template>
  <footer class="studio-status-bar">
    <div class="status-left">
      <span class="status-item font-mono">
        <strong>{{ wordCount }}</strong> 字
      </span>
      <span class="status-sep">·</span>
      <span class="status-item">预计阅读 {{ readingTime }} 分钟</span>
    </div>

    <div
      v-if="autoSaveTime"
      class="status-center"
    >
      <span
        class="save-dot"
        :class="{ active: hasUnsaved }"
      />
      <span class="save-label">{{ hasUnsaved ? '编辑中' : `已保存 ${autoSaveTime}` }}</span>
    </div>

    <div class="status-right">
      <button
        class="status-btn"
        :class="{ active: showPreview }"
        @click="$emit('togglePreview')"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        ><path
          d="M7 2C4.8 2 3 3.5 3 5s1.8 3 4 3c.6 0 1.1-.1 1.6-.3L11 10l-1.5-.4c-.7.3-1.5.4-2.5.4C4.8 10 3 8.5 3 7s1.8-3 4-3 4 1.5 4 3-1.8 3-4 3z"
          stroke="currentColor"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        /></svg>
        预览
      </button>
      <button
        class="status-btn"
        :class="{ active: showVersions }"
        @click="$emit('toggleVersions')"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
        >
          <path
            d="M2 2h5v9H2V2zm4 4h5v5H6V6z"
            fill="currentColor"
            opacity="0.4"
          />
          <path
            d="M3 3h3v7H3V3zm4 4h3v3H7V7z"
            fill="currentColor"
          />
          <path
            d="M10 1v2m0 8v2M12 5h-2m-6 0H2"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linecap="round"
          />
        </svg>
        版本
      </button>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  wordCount: number
  readingTime: number
  autoSaveTime?: string
  hasUnsaved: boolean
  showPreview: boolean
  showVersions: boolean
}>()

defineEmits<{
  togglePreview: []
  toggleVersions: []
}>()
</script>

<style scoped>
.studio-status-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--color-border-light);
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.status-left,
.status-center,
.status-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 2px;
}

.status-sep {
  color: var(--color-border);
}

.font-mono {
  font-family: var(--font-family-mono);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.save-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success);
  transition: all 0.25s ease;
}

.save-dot.active {
  background: var(--color-warning);
  animation: statusPulse 1.5s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.save-label {
  letter-spacing: 0.2px;
}

.status-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.status-btn:hover {
  background: var(--color-slate-100);
  color: var(--color-text-secondary);
}

.status-btn.active {
  background: var(--color-slate-200);
  color: var(--color-solid);
  font-weight: 600;
}

@media (max-width: 768px) {
  .studio-status-bar {
    padding: 0 12px;
  }

  .status-center {
    display: none;
  }
}
</style>
