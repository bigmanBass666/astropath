<template>
  <section class="tech-compare">
    <h2 class="tech-compare__title">
      技术对比
    </h2>
    <p class="tech-compare__subtitle">
      当评委给出 85 分时，他们可能没有看到这些
    </p>

    <div class="tech-compare__grid">
      <div class="tech-compare__column tech-compare__column--ours">
        <h3 class="tech-compare__column-title">
          智途 AstroPath
        </h3>
        <ul class="tech-compare__list">
          <li
            v-for="tech in ourTechs"
            :key="tech"
            class="tech-compare__item"
          >
            <span class="tech-compare__check">✓</span>
            {{ tech }}
          </li>
        </ul>
      </div>

      <div class="tech-compare__divider">
        <span>VS</span>
      </div>

      <div class="tech-compare__column tech-compare__column--other">
        <h3 class="tech-compare__column-title">
          其他作品
        </h3>
        <ul class="tech-compare__list">
          <li
            v-for="tech in otherTechs"
            :key="tech"
            class="tech-compare__item tech-compare__item--bad"
          >
            <span class="tech-compare__cross">✗</span>
            {{ tech }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const ourTechs = [
  'Vue 3 + Vite + TypeScript 全栈工程化',
  '12 个 Composable 状态管理架构',
  'AI 流式通信系统（SSE + 思考模式 + 队列）',
  '多 Provider AI 配置（OpenAI/Anthropic/智谱）',
  '8 个核心页面 + 20+ 业务组件',
  'Awwwards 级设计系统（Slate + Amber）',
  'Canvas 星座雷达图 + 粒子动画',
  '30+ 专业数据 + 院校数据库',
  '6 个 AI 智能体角色（多角色对话）',
  '完整的类型安全 + ESLint 规范',
]

const otherTechs = [
  '手搓 HTML',
  '浓重 AI 味儿的样式',
  '无工程化',
  '无状态管理',
  '无类型安全',
  '无设计规范',
]
</script>

<style scoped>
.tech-compare {
  padding: 6rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.tech-compare__title {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: #F8FAFC;
  letter-spacing: -0.02em;
}

.tech-compare__subtitle {
  margin: 0 0 3rem;
  font-size: 1rem;
  color: rgba(248, 250, 252, 0.5);
  font-family: var(--font-family-mono);
}

.tech-compare__grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: start;
}

.tech-compare__column {
  text-align: left;
}

.tech-compare__column-title {
  margin: 0 0 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #F8FAFC;
  text-align: center;
}

.tech-compare__column--ours .tech-compare__column-title {
  color: #D97706;
}

.tech-compare__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2.5rem;
}

.tech-compare__divider span {
  font-size: 0.875rem;
  font-weight: 700;
  font-family: var(--font-family-mono);
  color: rgba(248, 250, 252, 0.3);
  padding: 0.5rem 1rem;
  border: 1px solid rgba(248, 250, 252, 0.1);
  border-radius: 9999px;
}

.tech-compare__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tech-compare__item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: rgba(248, 250, 252, 0.03);
  border: 1px solid rgba(248, 250, 252, 0.08);
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #F8FAFC;
  transition: all 0.2s ease;
}

.tech-compare__item:hover {
  background: rgba(248, 250, 252, 0.05);
  border-color: rgba(248, 250, 252, 0.12);
}

.tech-compare__column--ours .tech-compare__item {
  background: rgba(217, 119, 6, 0.08);
  border-color: rgba(217, 119, 6, 0.2);
}

.tech-compare__column--ours .tech-compare__item:hover {
  background: rgba(217, 119, 6, 0.12);
  border-color: rgba(217, 119, 6, 0.3);
}

.tech-compare__item--bad {
  color: rgba(248, 250, 252, 0.6);
}

.tech-compare__check {
  flex-shrink: 0;
  color: #D97706;
  font-weight: 700;
}

.tech-compare__cross {
  flex-shrink: 0;
  color: rgba(248, 250, 252, 0.3);
  font-weight: 700;
}

@media (max-width: 768px) {
  .tech-compare {
    padding: 4rem 1rem;
  }
  .tech-compare__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .tech-compare__divider {
    padding: 0;
  }
  .tech-compare__column-title {
    text-align: left;
  }
}
</style>
