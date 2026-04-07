<template>
  <section class="result-closing">
    <div class="result-closing__content">
      <div class="result-closing__icon">
        🏁
      </div>
      <h2 class="result-closing__title">
        比赛已结束，项目正式归档
      </h2>
      <p class="result-closing__thanks">
        感谢所有关心此项目的人们❤️
      </p>
      <p class="result-closing__text">
        智途 AstroPath 不再维护，但代码与设计将永远留存
      </p>
      <div class="result-closing__links">
        <a
          :href="GITHUB_REPO_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="result-closing__link"
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
          to="/story"
          class="result-closing__link"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          项目故事
        </router-link>
        <router-link
          to="/"
          class="result-closing__link result-closing__link--accent"
        >
          <el-icon :size="18">
            <ArrowLeft />
          </el-icon>
          <span>返回首页</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { GITHUB_REPO_URL } from '@/constants'
</script>

<style scoped>
.result-closing {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.result-closing__content {
  max-width: 600px;
}

.result-closing__icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.result-closing__title {
  margin: 0 0 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #F8FAFC;
  letter-spacing: -0.02em;
}

.result-closing__thanks {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: #D97706;
  font-family: var(--font-family-mono);
}

.result-closing__text {
  margin: 0 0 2rem;
  font-size: 1rem;
  color: rgba(248, 250, 252, 0.6);
  font-family: var(--font-family-mono);
}

.result-closing__links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.result-closing__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: var(--font-family-mono);
  color: #F8FAFC;
  background: rgba(248, 250, 252, 0.05);
  border: 1px solid rgba(248, 250, 252, 0.15);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.result-closing__link:hover {
  background: rgba(248, 250, 252, 0.1);
  border-color: rgba(248, 250, 252, 0.25);
  transform: translateY(-2px);
}

.result-closing__link--accent {
  background: rgba(217, 119, 6, 0.1);
  border-color: rgba(217, 119, 6, 0.3);
  color: #D97706;
}

.result-closing__link--accent:hover {
  background: #D97706;
  border-color: #D97706;
  color: #0F172A;
  box-shadow: 0 10px 30px rgba(217, 119, 6, 0.3);
}

@media (max-width: 768px) {
  .result-closing {
    padding: 3rem 1rem;
  }
  .result-closing__icon {
    font-size: 3rem;
  }
  .result-closing__title {
    font-size: 1.25rem;
  }
}
</style>
