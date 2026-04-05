<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <h1 class="not-found-code">
        404
      </h1>
      <h2 class="not-found-title">
        页面未找到
      </h2>
      <p class="not-found-desc">
        抱歉，您访问的页面不存在或已被移除。
      </p>
      <el-button
        type="primary"
        size="large"
        @click="$router.push('/')"
      >
        返回首页
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  text-align: center;
}
.not-found-content {
  max-width: 480px;
  padding: 40px;
}
.not-found-code {
  font-size: 96px;
  font-weight: 800;
  color: var(--color-solid, #0F172A);
  line-height: 1;
  margin: 0 0 16px;
  letter-spacing: -4px;
}
.not-found-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary, #0F172A);
  margin: 0 0 12px;
}
.not-found-desc {
  font-size: 16px;
  color: var(--color-text-secondary, #64748B);
  margin: 0 0 32px;
  line-height: 1.6;
}
</style>
