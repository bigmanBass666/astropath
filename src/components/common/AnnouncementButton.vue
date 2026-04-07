<template>
  <div class="ann-btn-wrap">
    <button
      class="ann-btn"
      :class="{ 'is-active': dialogVisible }"
      aria-label="公告中心"
      @click="openDialog"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <Transition name="ann-badge-bounce">
        <span
          v-if="unreadCount > 0"
          class="ann-btn__badge"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
      </Transition>
    </button>

    <Teleport to="body">
      <Transition name="ann-dialog">
        <div
          v-if="dialogVisible"
          class="ann-overlay"
          @click.self="closeDialog"
        >
          <div class="ann-modal">
            <svg
              class="ann-modal__noise"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <filter id="annNoiseFilter">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.8"
                  numOctaves="4"
                  stitchTiles="stitch"
                />
              </filter>
              <rect
                width="100%"
                height="100%"
                filter="url(#annNoiseFilter)"
              />
            </svg>

            <header class="ann-modal__header">
              <div class="ann-modal__header-left">
                <div class="ann-modal__icon-wrap">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div>
                  <h2 class="ann-modal__title">
                    公告中心
                  </h2>
                  <p class="ann-modal__subtitle">
                    {{ allAnnouncements.length }} 条通知 · {{ unreadCount > 0 ? `${unreadCount} 条未读` : '全部已读' }}
                  </p>
                </div>
              </div>
              <div class="ann-modal__header-right">
                <button
                  v-if="unreadCount > 0"
                  class="ann-modal__read-all"
                  @click="handleMarkAllRead"
                >
                  全部已读
                </button>
                <button
                  class="ann-modal__close"
                  aria-label="关闭"
                  @click="closeDialog"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line
                      x1="18"
                      y1="6"
                      x2="6"
                      y2="18"
                    />
                    <line
                      x1="6"
                      y1="6"
                      x2="18"
                      y2="18"
                    />
                  </svg>
                </button>
              </div>
            </header>

            <div class="ann-modal__body">
              <TransitionGroup
                name="ann-list"
                tag="div"
                class="ann-list"
              >
                <div
                  v-for="(item, index) in allAnnouncements"
                  :key="item.id"
                  class="ann-item"
                  :class="[`ann-item--${item.type}`, { 'ann-item--unread': isUnread(item.id), 'ann-item--expanded': expandedId === item.id }]"
                  :style="{ '--delay': `${index * 50}ms` }"
                  @click="toggleExpand(item)"
                >
                  <div class="ann-item__rail">
                    <span class="ann-item__dot" />
                    <span
                      v-if="index < allAnnouncements.length - 1"
                      class="ann-item__line"
                    />
                  </div>

                  <div class="ann-item__main">
                    <div class="ann-item__top">
                      <div class="ann-item__meta">
                        <span
                          v-if="item.pinned"
                          class="ann-item__pin"
                        ><svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="none"
                        ><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg> PINNED</span>
                        <span class="ann-item__type">{{ typeLabels[item.type] }}</span>
                        <span class="ann-item__date">{{ item.date }}</span>
                      </div>
                      <svg
                        class="ann-item__chevron"
                        :class="{ 'is-open': expandedId === item.id }"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>

                    <h3 class="ann-item__title">
                      {{ item.title }}
                    </h3>

                    <p class="ann-item__summary">
                      {{ item.content.slice(0, 80) }}{{ item.content.length > 80 ? '...' : '' }}
                    </p>

                    <Transition name="ann-expand">
                      <div
                        v-if="expandedId === item.id"
                        class="ann-item__detail"
                      >
                        <p class="ann-item__detail-text">
                          {{ item.content }}
                        </p>
                      </div>
                    </Transition>
                  </div>
                </div>
              </TransitionGroup>

              <div
                v-if="allAnnouncements.length === 0"
                class="ann-empty"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                  opacity="0.25"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  <line
                    x1="4"
                    y1="4"
                    x2="20"
                    y2="20"
                  />
                </svg>
                <p>暂无公告</p>
              </div>
            </div>

            <footer class="ann-modal__footer">
              <span>版本更新与重要通知将在此展示</span>
            </footer>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAnnouncements } from '@/composables/useAnnouncements'

const router = useRouter()
const { allAnnouncements, unreadCount, isUnread, markAsRead, markAllAsRead } = useAnnouncements()

const dialogVisible = ref(false)
const expandedId = ref<string | null>(null)

const typeLabels: Record<string, string> = {
  update: '更新',
  feature: '新功能',
  important: '重要',
}

const openDialog = () => {
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  setTimeout(() => { expandedId.value = null }, 300)
}

const toggleExpand = (item: { id: string; link?: string }) => {
  if (item.link) {
    markAsRead(item.id)
    closeDialog()
    router.push(item.link)
    return
  }
  if (expandedId.value === item.id) {
    expandedId.value = null
  } else {
    markAsRead(item.id)
    expandedId.value = item.id
  }
}

const handleMarkAllRead = () => {
  markAllAsRead()
}
</script>

<style scoped>
.ann-btn-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.ann-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(240, 244, 248, 0.9) 0%, rgba(232, 238, 245, 0.9) 100%);
  border: 1.5px solid rgba(30, 58, 95, 0.12);
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  color: var(--color-slate-700);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
  overflow: visible;
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.8),
    0 2px 6px rgba(30, 58, 95, 0.06);
}

.ann-btn:hover {
  background: var(--color-solid);
  border-color: transparent;
  color: white;
  transform: scale(1.08) translateY(-1px);
  box-shadow:
    0 6px 20px rgba(15, 23, 42, 0.2),
    0 2px 6px rgba(15, 23, 42, 0.12);
}

.ann-btn.is-active {
  background: var(--color-solid);
  border-color: transparent;
  color: white;
  box-shadow:
    0 0 0 3px rgba(30, 58, 95, 0.12),
    0 6px 20px rgba(30, 58, 95, 0.25),
    0 2px 6px rgba(30, 58, 95, 0.15);
}

.ann-btn__badge {
  position: absolute;
  top: -2px;
  right: -3px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 11px;
  font-weight: 700;
  font-family: var(--font-family-mono);
  line-height: 18px;
  text-align: center;
  color: white;
  background: var(--color-accent);
  border-radius: 9999px;
  box-shadow: 0 2px 6px rgba(217, 119, 6, 0.35);
  z-index: 2;
}

/* ===== 遮罩层 ===== */
.ann-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(10px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
}

/* ===== 弹窗主体 ===== */
.ann-modal {
  position: relative;
  width: 100%;
  max-width: 800px;
  max-height: calc(100dvh - 56px);
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 22px;
  overflow: hidden;
  box-shadow:
    0 40px 100px -20px rgba(15, 23, 42, 0.25),
    0 16px 40px -12px rgba(15, 23, 42, 0.12),
    0 0 0 1px rgba(15, 23, 42, 0.05);
}

.ann-modal__noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  z-index: 1;
  mix-blend-mode: multiply;
}

/* ===== 头部 ===== */
.ann-modal__header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px 32px 20px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.ann-modal__header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ann-modal__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 14px;
  color: var(--color-slate-600);
  flex-shrink: 0;
}

.ann-modal__title {
  margin: 0 0 2px;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.ann-modal__subtitle {
  margin: 0;
  font-size: 12.5px;
  font-family: var(--font-family-mono);
  color: var(--color-text-muted);
  letter-spacing: 0.01em;
}

.ann-modal__header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ann-modal__read-all {
  padding: 7px 16px;
  font-size: 12.5px;
  font-weight: 600;
  font-family: var(--font-family-mono);
  color: var(--color-accent);
  background: transparent;
  border: 1.5px solid rgba(217, 119, 6, 0.28);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
  letter-spacing: 0.02em;
}

.ann-modal__read-all:hover {
  background: var(--color-accent-subtle);
  border-color: var(--color-accent);
  transform: translateY(-1px);
}

.ann-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all 0.2s ease;
}

.ann-modal__close:hover {
  background: rgba(15, 23, 42, 0.06);
  color: var(--color-text-primary);
  transform: rotate(90deg);
}

/* ===== 内容区 ===== */
.ann-modal__body {
  position: relative;
  z-index: 2;
  flex: 1;
  overflow-y: auto;
  padding: 14px 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(15, 23, 42, 0.08) transparent;
}

.ann-modal__body::-webkit-scrollbar {
  width: 4px;
}

.ann-modal__body::-webkit-scrollbar-thumb {
  background: rgba(15, 23, 42, 0.08);
  border-radius: 4px;
}

/* ===== 公告列表 ===== */
.ann-list {
  padding: 4px 12px 8px;
}

/* ===== 单条公告（手风琴） ===== */
.ann-item {
  display: flex;
  gap: 0;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: annItemIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--delay, 0ms);
  border-radius: 12px;
  margin-bottom: 6px;
}

.ann-item:last-child {
  margin-bottom: 0;
}

@keyframes annItemIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ann-item:hover {
  background: rgba(15, 23, 42, 0.03);
}

.ann-item--unread {
  background: rgba(217, 119, 6, 0.04);
}

.ann-item--unread:hover {
  background: rgba(217, 119, 6, 0.06);
}

.ann-item--expanded {
  background: rgba(15, 23, 42, 0.02);
}

/* 左侧时间线轨道 */
.ann-item__rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 32px;
  flex-shrink: 0;
  padding-top: 18px;
}

.ann-item__dot {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-border);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
  z-index: 1;
  border: 2px solid transparent;
}

.ann-item--unread .ann-item__dot {
  background: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
}

.ann-item--expanded .ann-item__dot {
  transform: scale(1.2);
  background: var(--color-solid);
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.08);
}

.ann-item__line {
  width: 2px;
  flex: 1;
  margin-top: 6px;
  background: linear-gradient(to bottom, var(--color-border), transparent);
  min-height: 24px;
}

/* 主内容区 */
.ann-item__main {
  flex: 1;
  min-width: 0;
  padding: 12px 16px;
  transition: border-color 0.2s ease;
}

/* 顶部元信息行 */
.ann-item__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.ann-item__meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ann-item__pin {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  font-size: 10.5px;
  font-weight: 800;
  font-family: var(--font-family-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  background: var(--color-accent);
  border-radius: 5px;
  box-shadow: 0 1px 4px rgba(217, 119, 6, 0.3);
}

.ann-item__type {
  display: inline-block;
  padding: 2px 9px;
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font-family-mono);
  letter-spacing: 0.02em;
  color: var(--color-text-tertiary);
  background: rgba(15, 23, 42, 0.04);
  border-radius: 6px;
}

.ann-item--update .ann-item__type {
  color: #0369a1;
  background: rgba(3, 105, 161, 0.07);
}

.ann-item--feature .ann-item__type {
  color: var(--color-accent);
  background: var(--color-accent-subtle);
}

.ann-item--important .ann-item__type {
  color: var(--color-danger);
  background: var(--color-danger-bg);
}

.ann-item__date {
  font-size: 11.5px;
  font-family: var(--font-family-mono);
  color: var(--color-text-muted);
  letter-spacing: 0.01em;
}

/* 标题 */
.ann-item__title {
  margin: 0 0 6px;
  font-size: 15.5px;
  font-weight: 650;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  line-height: 1.35;
  transition: color 0.25s ease;
}

.ann-item--unread .ann-item__title {
  color: var(--color-solid);
}

.ann-item--expanded .ann-item__title {
  color: var(--color-accent);
}

/* 摘要 */
.ann-item__summary {
  margin: 0;
  font-size: 13.5px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  transition: all 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ann-item--expanded .ann-item__summary {
  opacity: 0;
  max-height: 0;
  margin: 0;
  -webkit-line-clamp: 0;
}

/* ========== 展开详情 — 纯文字自然展开 ========== */
.ann-item__detail {
  margin-top: 6px;
}

.ann-item__detail-text {
  margin: 0;
  font-size: 13.5px;
  color: var(--color-text-secondary);
  line-height: 1.75;
}

/* 展开/收起箭头 */
.ann-item__chevron {
  flex-shrink: 0;
  color: var(--color-border-dark);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease;
}

.ann-item__chevron.is-open {
  transform: rotate(180deg);
  color: var(--color-accent);
}

/* 空状态 */
.ann-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 20px;
  color: var(--color-text-muted);
}

.ann-empty p {
  margin: 0;
  font-size: 14px;
}

/* ===== 底部 ===== */
.ann-modal__footer {
  position: relative;
  z-index: 2;
  padding: 14px 32px 18px;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
  text-align: center;
}

.ann-modal__footer span {
  font-size: 11.5px;
  font-family: var(--font-family-mono);
  color: var(--color-text-muted);
  letter-spacing: 0.04em;
}

/* ===== 弹窗进出动画 ===== */
.ann-dialog-enter-active .ann-modal {
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.ann-dialog-leave-active .ann-modal {
  transition: all 0.25s cubic-bezier(0.55, 0, 1, 0.45);
}
.ann-dialog-enter-from .ann-modal {
  opacity: 0;
  transform: scale(0.94) translateY(24px);
}
.ann-dialog-leave-to .ann-modal {
  opacity: 0;
  transform: scale(0.97) translateY(10px);
}

.ann-dialog-enter-active {
  transition: opacity 0.3s ease;
}
.ann-dialog-leave-active {
  transition: opacity 0.2s ease;
}
.ann-dialog-enter-from {
  opacity: 0;
}
.ann-dialog-leave-to {
  opacity: 0;
}

/* ===== 展开动画 ===== */
.ann-expand-enter-active {
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
.ann-expand-leave-active {
  transition: all 0.22s ease;
  overflow: hidden;
}
.ann-expand-enter-from {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
}
.ann-expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
}

/* ===== 列表项过渡 ===== */
.ann-list-enter-active,
.ann-list-leave-active {
  transition: all 0.3s ease;
}
.ann-list-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.ann-list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

/* ===== 徽标动画 ===== */
.ann-badge-bounce-enter-active {
  animation: annBadgeIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ann-badge-bounce-leave-active {
  animation: annBadgeOut 0.25s ease forwards;
}

@keyframes annBadgeIn {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.25); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes annBadgeOut {
  to { transform: scale(0); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0.01ms !important; }
}

@media (max-width: 767px) {
  .ann-overlay {
    padding: 14px;
  }

  .ann-modal {
    max-width: 100%;
    max-height: calc(100dvh - 28px);
    border-radius: 18px;
  }

  .ann-modal__header {
    padding: 20px 22px 16px;
  }

  .ann-modal__icon-wrap {
    width: 38px;
    height: 38px;
    border-radius: 12px;
  }

  .ann-modal__title {
    font-size: 17px;
  }

  .ann-item__main {
    padding: 12px 14px 12px 10px;
  }

  .ann-item__detail-text {
    font-size: 13px;
  }
}
</style>
