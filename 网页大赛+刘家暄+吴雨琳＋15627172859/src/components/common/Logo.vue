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
      <!-- 外圈圆环 -->
      <circle
        class="logo-ring-outer"
        cx="24"
        cy="24"
        r="22"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        opacity="0.12"
      />

      <!-- 内圈圆环 -->
      <circle
        class="logo-ring-inner"
        cx="24"
        cy="24"
        r="19"
        stroke="currentColor"
        stroke-width="1"
        fill="none"
        opacity="0.2"
      />

      <!-- 学位帽主体 - 方形顶部 -->
      <path
        class="logo-cap-top"
        d="M24 12L36 18L24 24L12 18L24 12Z"
        fill="currentColor"
        opacity="0.95"
      />

      <!-- 学位帽檐 - 底部横条 -->
      <rect
        class="logo-cap-brim"
        x="10"
        y="26"
        width="28"
        height="4"
        rx="1"
        fill="currentColor"
        opacity="0.9"
      />

      <!-- 学位帽流苏 - 使用 accent color -->
      <g class="logo-tassel-group">
        <circle
          cx="34"
          cy="20"
          r="3"
          fill="var(--color-accent)"
          class="logo-tassel"
        />

        <!-- 流苏线条 -->
        <path
          d="M34 23V30"
          stroke="var(--color-accent)"
          stroke-width="2"
          stroke-linecap="round"
          class="logo-tassel-line"
        />

        <!-- 流苏穗子 -->
        <path
          d="M32 30L34 34L36 30"
          stroke="var(--color-accent)"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="logo-tassel-tip"
        />
      </g>

      <!-- 星星装饰 - 代表成就 -->
      <path
        class="logo-star"
        d="M24 6L25 8H27L25.5 9.5L26 11.5L24 10.5L22 11.5L22.5 9.5L21 8H23L24 6Z"
        fill="var(--color-accent)"
        opacity="0.8"
      />

      <!-- 上升轨迹线 -->
      <path
        class="logo-path"
        d="M8 36C12 32 16 34 20 30"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        fill="none"
        opacity="0.4"
      />

      <!-- 轨迹点 -->
      <circle
        class="logo-dot logo-dot-1"
        cx="8"
        cy="36"
        r="1.5"
        fill="currentColor"
        opacity="0.6"
      />
      <circle
        class="logo-dot logo-dot-2"
        cx="20"
        cy="30"
        r="1.5"
        fill="currentColor"
        opacity="0.6"
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
  color: var(--color-slate-700);
}

.logo-svg {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

/* ===== 基础动画 ===== */

/* 流苏摆动 */
.logo-tassel-group {
  transform-origin: 34px 18px;
  animation: tasselSwing 3s ease-in-out infinite;
}

@keyframes tasselSwing {
  0%, 100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
}

/* 星星闪烁 */
.logo-star {
  animation: starTwinkle 2.5s ease-in-out infinite;
  transform-origin: 24px 9px;
}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* ===== Hover 动画 ===== */

/* 外圈扩展 */
.logo-container:hover .logo-ring-outer {
  animation: ringPulse 1s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% {
    opacity: 0.12;
    transform: scale(1);
  }
  50% {
    opacity: 0.25;
    transform: scale(1.02);
  }
}

/* 内圈扩展 */
.logo-container:hover .logo-ring-inner {
  animation: ringInnerPulse 1s ease-in-out infinite 0.1s;
}

@keyframes ringInnerPulse {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.35;
    transform: scale(1.03);
  }
}

/* 学位帽轻微倾斜 */
.logo-container:hover .logo-cap-top,
.logo-container:hover .logo-cap-brim {
  animation: capTilt 0.6s ease-in-out;
}

@keyframes capTilt {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-2deg);
  }
  75% {
    transform: rotate(2deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

/* 流苏摆动幅度增大 */
.logo-container:hover .logo-tassel-group {
  animation: tasselSwingHover 0.8s ease-in-out infinite;
}

@keyframes tasselSwingHover {
  0%, 100% {
    transform: rotate(-8deg);
  }
  50% {
    transform: rotate(8deg);
  }
}

/* 星星放大闪烁 */
.logo-container:hover .logo-star {
  animation: starTwinkleHover 0.6s ease-in-out infinite;
}

@keyframes starTwinkleHover {
  0%, 100% {
    opacity: 1;
    transform: scale(1.2);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.3);
  }
}

/* 轨迹点依次点亮 */
.logo-container:hover .logo-dot {
  animation: dotLight 1.5s ease-in-out infinite;
}

.logo-container:hover .logo-dot-1 {
  animation-delay: 0s;
}

.logo-container:hover .logo-dot-2 {
  animation-delay: 0.3s;
}

@keyframes dotLight {
  0%, 100% {
    opacity: 0.6;
    r: 1.5;
  }
  50% {
    opacity: 1;
    r: 2.5;
  }
}

/* 轨迹线流动 */
.logo-container:hover .logo-path {
  animation: pathFlow 1.5s ease-in-out infinite;
  stroke-dasharray: 20;
  stroke-dashoffset: 0;
}

@keyframes pathFlow {
  0% {
    stroke-dashoffset: 20;
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 0.4;
  }
}

/* ===== 文字样式 ===== */

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
  width: 32px;
  height: 32px;
}

.logo-small .logo-text-zh {
  font-size: 16px;
}

.logo-small .logo-text-en {
  font-size: 13px;
}

/* 大尺寸 */
.logo-large .logo-svg {
  width: 56px;
  height: 56px;
}

.logo-large .logo-text-zh {
  font-size: 28px;
}

.logo-large .logo-text-en {
  font-size: 22px;
}

/* 仅图标模式 */
.logo-container:not(:has(.logo-text)) .logo-svg {
  width: 48px;
  height: 48px;
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
