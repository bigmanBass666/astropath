<template>
  <div class="site-footer-wrapper">
    <div class="footer-transition">
      <div class="footer-wave wave-layer-3">
        <svg
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(30, 58, 95, 0.15)"
            d="M0,64 C240,128 480,0 720,64 C960,128 1200,0 1440,64 L1440,150 L0,150 Z"
          />
        </svg>
      </div>
      <div class="footer-wave wave-layer-2">
        <svg
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(30, 58, 95, 0.3)"
            d="M0,80 C320,20 640,140 960,80 C1120,50 1280,110 1440,80 L1440,150 L0,150 Z"
          />
        </svg>
      </div>
      <div class="footer-wave wave-layer-1">
        <svg
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
        >
          <path
            fill="var(--color-solid)"
            d="M0,100 C360,40 720,160 1080,100 C1260,70 1350,120 1440,100 L1440,150 L0,150 Z"
          />
        </svg>
      </div>
      <div class="transition-stars">
        <div
          v-for="i in 12"
          :key="'ts-' + i"
          class="star"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }"
        />
      </div>
    </div>

    <footer class="site-footer">
      <div class="footer-glow-line" />
      <div class="footer-stars">
        <div
          v-for="i in 20"
          :key="'fs-' + i"
          class="star"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }"
        />
      </div>
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="brand-logo">
              <svg
                class="footer-logo-svg"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  class="logo-ring-outer"
                  cx="24"
                  cy="24"
                  r="22"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                />
                <circle
                  class="logo-ring-inner"
                  cx="24"
                  cy="24"
                  r="19"
                  stroke="currentColor"
                  stroke-width="1"
                  fill="none"
                />
                <path
                  class="logo-cap-top"
                  d="M24 12L36 18L24 24L12 18L24 12Z"
                  fill="currentColor"
                />
                <rect
                  class="logo-cap-brim"
                  x="10"
                  y="26"
                  width="28"
                  height="4"
                  rx="1"
                  fill="currentColor"
                />
                <g class="logo-tassel-group">
                  <circle
                    cx="34"
                    cy="20"
                    r="3"
                    fill="#D4AF37"
                    class="logo-tassel"
                  />
                  <path
                    d="M34 23V30"
                    stroke="#D4AF37"
                    stroke-width="2"
                    stroke-linecap="round"
                    class="logo-tassel-line"
                  />
                  <path
                    d="M32 30L34 34L36 30"
                    stroke="#D4AF37"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="none"
                    class="logo-tassel-tip"
                  />
                </g>
                <path
                  class="logo-star"
                  d="M24 6L25 8H27L25.5 9.5L26 11.5L24 10.5L22 11.5L22.5 9.5L21 8H23L24 6Z"
                  fill="#D4AF37"
                />
              </svg>
              <h3>智途 AstroPath</h3>
            </div>
            <p>AI 智能解析背景，为你生成专属留学路线图</p>
          </div>
          <div class="footer-links">
            <h4>快速链接</h4>
            <ul>
              <li><a href="/assessment">背景评估</a></li>
              <li><a href="/school-recommendation">AI选校</a></li>
              <li><a href="/timeline">时间规划</a></li>
              <li><a href="/materials">材料中心</a></li>
              <li><a href="/university-database">院校数据库</a></li>
              <li><a href="/ai-chat">AI对话</a></li>
            </ul>
          </div>
          <div class="footer-help">
            <h4>帮助支持</h4>
            <ul>
              <li>
                <a
                  href="#"
                  @click.prevent="$emit('show-guide')"
                >使用指南</a>
              </li>
              <li><a href="#">常见问题</a></li>
              <li>
                <a
                  href="#"
                  @click.prevent="$emit('show-contact')"
                >联系我们</a>
              </li>
            </ul>
          </div>
          <div class="footer-contact">
            <h4>联系方式</h4>
            <p><el-icon><Message /></el-icon> support@astropath.com</p>
            <p><el-icon><Phone /></el-icon> 400-123-4567</p>
            <div class="social-links">
              <a
                href="https://github.com/bigmanBass666"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link"
                title="GitHub"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="18"
                  height="18"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="#"
                class="social-link"
                title="微信"
              ><el-icon><ChatDotRound /></el-icon></a>
              <a
                href="#"
                class="social-link"
                title="微博"
              ><el-icon><Platform /></el-icon></a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 智途 AstroPath. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { Message, Phone, ChatDotRound, Platform } from '@element-plus/icons-vue'

defineEmits(['show-guide', 'show-contact'])
</script>

<style scoped>
.site-footer-wrapper {
  width: 100%;
}

.footer-transition {
  position: relative;
  height: 150px;
  margin: 0;
  width: 100%;
  overflow: hidden;
  background: #FAFAFA;
}

.footer-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.footer-wave svg {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: block;
}

@keyframes wave-breathe {
  0%, 100% { transform: scaleY(1) translateY(0); }
  50% { transform: scaleY(1.05) translateY(-5px); }
}

.wave-layer-1 {
  animation: wave-breathe 8s ease-in-out infinite;
}

.wave-layer-2 {
  animation: wave-breathe 6s ease-in-out infinite reverse;
  opacity: 0.5;
}

.wave-layer-3 {
  animation: wave-breathe 10s ease-in-out infinite;
  opacity: 0.3;
}

.transition-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.transition-stars .star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--color-slate-700);
  border-radius: 50%;
  animation: star-twinkle 3s ease-in-out infinite;
}

.site-footer {
  background: linear-gradient(180deg, var(--color-solid) 0%, var(--color-text-primary) 100%);
  color: white;
  padding: var(--space-24) var(--space-10) 0;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.footer-glow-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    var(--color-slate-700) 20%,
    var(--color-accent-light) 50%,
    var(--color-slate-700) 80%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: glow-line-move 4s linear infinite;
}

.footer-glow-line::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(90deg,
    transparent,
    rgba(184, 134, 11, 0.3),
    transparent
  );
  background-size: 200% 100%;
  animation: glow-line-move 4s linear infinite;
}

@keyframes glow-line-move {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.footer-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.footer-stars .star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: star-twinkle 3s ease-in-out infinite;
}

@keyframes star-twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

.footer-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: var(--space-10);
  padding-bottom: var(--space-10);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 100%;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  position: relative;
  z-index: 1;
}

.footer-brand .brand-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.footer-logo-svg {
  width: 44px;
  height: 44px;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.4s ease;
}

.footer-logo-svg .logo-ring-outer {
  opacity: 0.15;
  transition: all 0.4s ease;
}

.footer-logo-svg .logo-ring-inner {
  opacity: 0.25;
  transition: all 0.4s ease;
}

.footer-logo-svg .logo-cap-top,
.footer-logo-svg .logo-cap-brim {
  opacity: 0.9;
}

.footer-logo-svg .logo-star {
  opacity: 0.8;
  transform-origin: 24px 9px;
  transition: all 0.3s ease;
}

.footer-logo-svg .logo-tassel-group {
  transform-origin: 34px 18px;
  animation: tassel-swing 3s ease-in-out infinite;
}

@keyframes tassel-swing {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

.footer-brand .brand-logo:hover .footer-logo-svg {
  color: white;
  transform: scale(1.08);
  filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.4));
}

.footer-brand .brand-logo:hover .logo-ring-outer {
  opacity: 0.3;
  animation: ring-pulse 1.5s ease-in-out infinite;
}

.footer-brand .brand-logo:hover .logo-ring-inner {
  opacity: 0.5;
}

.footer-brand .brand-logo:hover .logo-star {
  opacity: 1;
  transform: scale(1.3);
  animation: star-pulse 0.6s ease-in-out infinite;
}

.footer-brand .brand-logo:hover .logo-tassel-group {
  animation: tassel-swing-hover 0.8s ease-in-out infinite;
}

@keyframes ring-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
}

@keyframes star-pulse {
  0%, 100% { transform: scale(1.3); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.8; }
}

@keyframes tassel-swing-hover {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}

.footer-brand h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: white;
  font-family: var(--font-family-display);
  margin: 0;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
}

.footer-links h4,
.footer-help h4,
.footer-contact h4 {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-5);
  color: white;
  position: relative;
}

.footer-links h4::after,
.footer-help h4::after,
.footer-contact h4::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 24px;
  height: 2px;
  background: var(--color-accent-light);
  border-radius: 1px;
}

.footer-links ul,
.footer-help ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li,
.footer-help li {
  margin-bottom: var(--space-3);
}

.footer-links a,
.footer-help a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: var(--text-sm);
  position: relative;
  transition: all var(--transition-fast);
}

.footer-links a::after,
.footer-help a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-accent-light);
  transition: width var(--transition-normal);
}

.footer-links a:hover,
.footer-help a:hover {
  color: var(--color-accent-light);
}

.footer-links a:hover::after,
.footer-help a:hover::after {
  width: 100%;
}

.footer-contact p {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--text-sm);
  margin-bottom: var(--space-3);
}

.footer-contact :deep(.el-icon) {
  font-size: var(--text-base);
  color: var(--color-accent-light);
}

.social-links {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.social-link::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all var(--transition-normal);
}

.social-link:hover {
  background: var(--color-accent-light);
  color: var(--color-text-primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

.social-link:hover::before {
  border-color: transparent;
  transform: scale(1.2);
  opacity: 0;
}

.social-link svg {
  display: block;
}

.footer-bottom {
  padding: var(--space-5) 0;
  text-align: center;
  position: relative;
  z-index: 1;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.5);
  font-size: var(--text-xs);
  margin: 0;
}

@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
  }
}

@media (max-width: 576px) {
  .site-footer {
    padding: var(--space-10) 0 0;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--space-6);
    text-align: center;
  }

  .footer-brand .brand-logo {
    justify-content: center;
  }

  .footer-links h4::after,
  .footer-help h4::after,
  .footer-contact h4::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .footer-links ul,
  .footer-help ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-2) var(--space-4);
  }

  .footer-links li,
  .footer-help li {
    margin: 0;
  }

  .footer-contact {
    text-align: center;
  }

  .footer-contact p {
    justify-content: center;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
