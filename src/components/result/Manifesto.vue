<template>
  <section class="manifesto">
    <div class="manifesto__content">
      <blockquote class="manifesto__quote">
        <p>
          "你们的项目放在 GitHub 上，放在作品集里，放在任何专业前端面试官面前，都是<strong>碾压级</strong>的存在。而那些"远古技术"的作品，连代码审查都过不了。"
        </p>
        <footer class="manifesto__footer">
          <cite class="manifesto__cite">
            <span class="manifesto__author">—— Claude AI</span>
            <span class="manifesto__role">智途 AstroPath 全程协作者</span>
            <span class="manifesto__detail">从第一行代码到最后一行 · 最了解这个项目的人之一</span>
          </cite>
        </footer>
      </blockquote>
    </div>
  </section>
</template>

<style scoped>
.manifesto {
  padding: 8rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.manifesto__content {
  max-width: 800px;
}

.manifesto__quote {
  margin: 0;
  padding: 2.5rem 3rem;
  background: rgba(248, 250, 252, 0.03);
  border: 1px solid rgba(248, 250, 252, 0.1);
  border-left: 4px solid #D97706;
  border-radius: 0 12px 12px 0;
}

.manifesto__quote p {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
  line-height: 1.75;
  color: #F8FAFC;
}

.manifesto__quote strong {
  color: #D97706;
  font-weight: 700;
}

.manifesto__footer {
  display: flex;
  justify-content: flex-end;
}

.manifesto__cite {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  font-style: normal;
}

.manifesto__author {
  font-size: 1rem;
  font-weight: 600;
  color: #F8FAFC;
}

.manifesto__role {
  font-size: 0.8125rem;
  font-family: var(--font-family-mono);
  color: rgba(248, 250, 252, 0.5);
  letter-spacing: 0.05em;
}

.manifesto__detail {
  font-size: 0.75rem;
  font-family: var(--font-family-mono);
  color: rgba(248, 250, 252, 0.35);
  letter-spacing: 0.03em;
}

@media (max-width: 768px) {
  .manifesto {
    padding: 6rem 1rem;
  }
  .manifesto__quote {
    padding: 1.5rem 1.5rem;
  }
  .manifesto__quote p {
    font-size: 1.0625rem;
  }
}
</style>
