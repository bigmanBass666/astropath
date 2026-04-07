<template>
  <section class="closing-section">
    <div class="closing-content">
      <!-- 致谢 -->
      <div class="acknowledgments">
        <h3 class="ack-title">
          致谢
        </h3>
        
        <div class="ack-groups">
          <div class="ack-group">
            <h4 class="ack-group-title">
              开源社区
            </h4>
            <ul class="ack-list">
              <li
                v-for="item in acknowledgments.openSource"
                :key="item"
              >
                {{ item }}
              </li>
            </ul>
          </div>

          <div class="ack-group">
            <h4 class="ack-group-title">
              设计灵感
            </h4>
            <ul class="ack-list">
              <li
                v-for="item in acknowledgments.inspiration"
                :key="item"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 感言 -->
      <div class="closing-words">
        <div class="words-header">
          <h2 class="words-title">
            {{ closingWords.title }}
          </h2>
          <p class="words-subtitle">
            {{ closingWords.subtitle }}
          </p>
        </div>

        <div class="words-content">
          <p
            v-for="(paragraph, index) in paragraphs"
            :key="index"
            class="words-paragraph"
          >
            {{ paragraph }}
          </p>
        </div>

        <div class="words-signature">
          —— {{ closingWords.signature }}
        </div>
      </div>

      <!-- 底部链接 -->
      <div class="closing-links">
        <a
          :href="GITHUB_REPO_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="closing-link"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </a>
        <router-link
          to="/result"
          class="closing-link"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          比赛结果
        </router-link>
        <router-link
          to="/"
          class="closing-link closing-link--accent"
        >
          <el-icon :size="18">
            <ArrowLeft />
          </el-icon>
          <span>返回首页</span>
        </router-link>
      </div>
    </div>

    <!-- 装饰 -->
    <div class="closing-glow" />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { acknowledgments, closingWords } from '@/data/storyData'
import { GITHUB_REPO_URL } from '@/constants'

const paragraphs = computed(() => {
  return closingWords.content.split('\n\n').filter(p => p.trim())
})
</script>

<style scoped>
.closing-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 6rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.closing-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  width: 100%;
}

/* Acknowledgments */
.acknowledgments {
  margin-bottom: 4rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.ack-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #F8FAFC;
  margin: 0 0 2rem;
  text-align: center;
}

.ack-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.ack-group-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #D97706;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0 0 1rem;
}

.ack-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ack-list li {
  font-size: 0.9375rem;
  color: #94A3B8;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.ack-list li:last-child {
  border-bottom: none;
}

/* Closing Words */
.closing-words {
  text-align: center;
  margin-bottom: 4rem;
}

.words-header {
  margin-bottom: 2.5rem;
}

.words-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #F8FAFC;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
}

.words-subtitle {
  font-size: 1.25rem;
  color: #D97706;
  font-weight: 500;
  margin: 0;
}

.words-content {
  max-width: 700px;
  margin: 0 auto 2rem;
}

.words-paragraph {
  font-size: 1.0625rem;
  color: #CBD5E1;
  line-height: 1.9;
  margin: 0 0 1.5rem;
}

.words-paragraph:last-child {
  margin-bottom: 0;
}

.words-signature {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9375rem;
  color: #64748B;
  font-style: italic;
}

/* Closing Links */
.closing-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
}

.closing-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  color: #94A3B8;
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.closing-link:hover {
  background: rgba(51, 65, 85, 0.8);
  border-color: rgba(148, 163, 184, 0.3);
  color: #F8FAFC;
  transform: translateY(-2px);
}

.closing-link--accent {
  background: #D97706;
  border-color: #D97706;
  color: #0F172A;
}

.closing-link--accent:hover {
  background: #F59E0B;
  border-color: #F59E0B;
  color: #0F172A;
}

/* Glow Effect */
.closing-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, transparent 60%);
  pointer-events: none;
  z-index: 1;
}

/* Mobile */
@media (max-width: 768px) {
  .closing-section {
    padding: 4rem 1.5rem;
    min-height: auto;
  }

  .acknowledgments {
    margin-bottom: 3rem;
    padding-bottom: 3rem;
  }

  .ack-groups {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .words-paragraph {
    font-size: 1rem;
  }

  .back-btn {
    padding: 0.875rem 1.5rem;
  }
}
</style>
