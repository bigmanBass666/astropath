<template>
  <div
    class="logo-container"
    :class="{ 'logo-small': size === 'small', 'logo-large': size === 'large' }"
    @click="$emit('click')"
  >
    <svg
      class="logo-svg"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- 外圈圆环 - 代表完整的教育旅程 -->
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        opacity="0.15"
      />

      <!-- 内圈圆环 - 代表目标达成 -->
      <circle
        cx="24"
        cy="24"
        r="18"
        stroke="currentColor"
        stroke-width="1.5"
        fill="none"
        opacity="0.3"
      />

      <!-- 中心书本/学位形状 -->
      <path
        d="M16 18C16 16.8954 16.8954 16 18 16H22V30H18C16.8954 30 16 29.1046 16 28V18Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M26 16H30C31.1046 16 32 16.8954 32 18V28C32 29.1046 31.1046 30 30 30H26V16Z"
        fill="currentColor"
        opacity="0.7"
      />

      <!-- 书脊 -->
      <rect
        x="23"
        y="16"
        width="2"
        height="14"
        fill="currentColor"
        opacity="0.5"
      />

      <!-- 星星 - 代表梦想与目标 (使用 accent color) -->
      <path
        d="M24 8L25.5 11.5H29L26.25 13.75L27.5 17.5L24 15.25L20.5 17.5L21.75 13.75L19 11.5H22.5L24 8Z"
        fill="var(--color-accent)"
        class="logo-star"
      />

      <!-- 上升轨迹线 - 代表成长路径 -->
      <path
        d="M8 32C12 28 16 30 20 26C24 22 28 24 32 20C36 16 38 18 40 16"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        fill="none"
        opacity="0.6"
      />

      <!-- 轨迹点 - 代表里程碑 -->
      <circle
        cx="8"
        cy="32"
        r="2"
        fill="currentColor"
        opacity="0.8"
      />
      <circle
        cx="20"
        cy="26"
        r="2"
        fill="currentColor"
        opacity="0.8"
      />
      <circle
        cx="32"
        cy="20"
        r="2"
        fill="currentColor"
        opacity="0.8"
      />

      <!-- 终点箭头 -->
      <path
        d="M38 14L40 16L38 18"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </svg>

    <span
      v-if="showText"
      class="logo-text"
    >
      <span class="logo-text-zh">智途</span>
      <span class="logo-text-en">AstroPath</span>
    </span>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'normal',
    validator: (value) => ['small', 'normal', 'large'].includes(value)
  },
  showText: {
    type: Boolean,
    default: true
  }
})

defineEmits(['click'])
</script>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: var(--color-primary);
}

.logo-svg {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.logo-star {
  animation: starPulse 3s ease-in-out infinite;
  transform-origin: center;
}

@keyframes starPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

.logo-text {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-family: var(--font-family-display);
  white-space: nowrap;
}

.logo-text-zh {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.logo-text-en {
  font-size: 16px;
  font-weight: 500;
  opacity: 0.9;
  font-family: var(--font-family-display);
}

/* 小尺寸 */
.logo-small .logo-svg {
  width: 24px;
  height: 24px;
}

.logo-small .logo-text-zh {
  font-size: 16px;
}

.logo-small .logo-text-en {
  font-size: 13px;
}

/* 大尺寸 */
.logo-large .logo-svg {
  width: 48px;
  height: 48px;
}

.logo-large .logo-text-zh {
  font-size: 28px;
}

.logo-large .logo-text-en {
  font-size: 22px;
}

/* 仅图标模式 */
.logo-container:not(:has(.logo-text)) .logo-svg {
  width: 40px;
  height: 40px;
}

/* 响应式 */
@media (max-width: 768px) {
  .logo-text-en {
    display: none;
  }

  .logo-text {
    gap: 0;
  }
}
</style>
