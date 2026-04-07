<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="open"
        class="drawer-overlay"
        @click.self="$emit('close')"
      >
        <div class="materials-drawer">
          <!-- Header -->
          <div class="drawer-header">
            <h2 class="drawer-title">
              申请材料
            </h2>
            <button
              class="close-btn"
              title="关闭"
              @click="$emit('close')"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              ><path
                d="M3 3l10 10m0-10L3 13"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              /></svg>
            </button>
          </div>

          <!-- Progress -->
          <div class="progress-bar-wrap">
            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: completionRate + '%' }"
              />
            </div>
            <span class="progress-label font-mono">{{ completedCount }}/{{ completedCount + pendingCount }} 已完成</span>
          </div>

          <!-- Checklist -->
          <div class="checklist">
            <label
              v-for="(item, idx) in items"
              :key="idx"
              class="check-item"
              :class="{ done: item.completed }"
            >
              <input
                type="checkbox"
                :checked="item.completed"
                @change="$emit('toggleItem', idx, $event)"
              >
              <span class="check-name">{{ item.name }}</span>
            </label>
          </div>

          <!-- Footer hint -->
          <p class="drawer-hint">
            勾选完成的项目，追踪你的申请准备进度
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  completionRate: number
  completedCount: number
  pendingCount: number
  items: Array<{ name: string; completed: boolean; note: string }>
}>()

defineEmits<{
  close: []
  toggleItem: [index: number, event: Event]
}>()
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  justify-content: flex-end;
  background: rgba(15, 23, 42, 0.25);
  backdrop-filter: blur(4px);
}

.materials-drawer {
  width: 360px;
  max-width: 90vw;
  height: 100vh;
  background: white;
  box-shadow: -20px 0 60px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 20px;
  flex-shrink: 0;
}

.drawer-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-solid);
  letter-spacing: -0.02em;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: var(--color-slate-100);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}
.close-btn:hover { background: var(--color-slate-200); color: var(--color-solid); }

.progress-bar-wrap {
  padding: 0 24px 20px;
}

.progress-track {
  height: 4px;
  background: var(--color-slate-100);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent), #B45309);
  border-radius: 2px;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.checklist {
  padding: 0 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
  position: relative;
}

.check-item:hover {
  background: var(--color-slate-50);
}

.check-item.done {
  opacity: 1;
  background: rgba(16, 185, 129, 0.04);
}

.check-item.done:hover {
  background: rgba(16, 185, 129, 0.08);
}

.check-item.done .check-name {
  color: var(--color-text-secondary);
  text-decoration: line-through;
  text-decoration-color: var(--color-text-muted);
  text-decoration-thickness: 1px;
  transition: all 0.2s ease;
}

.check-item input {
  display: none;
}

.check-item::before {
  content: '';
  width: 18px;
  height: 18px;
  border: 1.5px solid var(--color-border);
  border-radius: 5px;
  flex-shrink: 0;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.check-item:hover::before {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.08);
}

.check-item.done::before {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: transparent;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.25);
}

.check-item.done:hover::before {
  box-shadow: 0 3px 6px rgba(16, 185, 129, 0.35);
  transform: scale(1.05);
}

.check-item::after {
  content: '';
  position: absolute;
  left: 20px;
  top: 50%;
  width: 4.5px;
  height: 8px;
  border: solid white;
  border-width: 0 1.5px 1.5px 0;
  transform: translateY(-60%) rotate(45deg) scale(0.6);
  opacity: 0;
  pointer-events: none;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.check-item.done::after {
  opacity: 1;
  transform: translateY(-60%) rotate(45deg) scale(1);
}

.check-name {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--color-text-primary);
  transition: color 0.15s ease;
}

.drawer-hint {
  margin: auto 24px 24px;
  font-size: 12px;
  color: var(--color-text-muted);
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-light);
}

.font-mono { font-family: var(--font-family-mono); }

.drawer-enter-active .materials-drawer { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.drawer-leave-active .materials-drawer { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.drawer-enter-active .drawer-overlay,
.drawer-leave-active .drawer-overlay { transition: opacity 0.3s ease; }
.drawer-enter-from .drawer-overlay,
.drawer-leave-to .drawer-overlay { opacity: 0; }
.drawer-enter-from .materials-drawer { transform: translateX(100%); }
.drawer-leave-to .materials-drawer { transform: translateX(100%); }
</style>
