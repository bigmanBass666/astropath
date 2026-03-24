<template>
  <div class="home-page">
    <!-- Hero区域 -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">一站式智能留学规划</h1>
        <p class="hero-subtitle">通过AI分析您的背景，生成动态、可执行的个性化留学路径图</p>
        <el-button type="primary" size="large" class="cta-button" @click="$router.push('/ai-config')">
          开始规划
        </el-button>
      </div>
    </section>

    <!-- 核心功能展示 -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        <div class="features-grid">
          <div class="feature-card" @click="$router.push('/assessment')">
            <el-icon class="feature-icon"><Document /></el-icon>
            <h3>背景评估</h3>
            <p>全面的背景信息收集与分析，生成竞争力雷达图</p>
            <el-link type="primary" :underline="false">了解更多 →</el-link>
          </div>
          <div class="feature-card" @click="$router.push('/ai-config')">
            <el-icon class="feature-icon"><Cpu /></el-icon>
            <h3>AI智能选校</h3>
            <p>基于多维度数据的智能匹配，推荐最适合的院校</p>
            <el-link type="primary" :underline="false">了解更多 →</el-link>
          </div>
          <div class="feature-card" @click="$router.push('/timeline')">
            <el-icon class="feature-icon"><Calendar /></el-icon>
            <h3>时间规划</h3>
            <p>动态时间线与任务看板，轻松管理申请进度</p>
            <el-link type="primary" :underline="false">了解更多 →</el-link>
          </div>
          <div class="feature-card" @click="$router.push('/materials')">
            <el-icon class="feature-icon"><Files /></el-icon>
            <h3>材料中心</h3>
            <p>文书助手与材料清单，赋能申请全流程</p>
            <el-link type="primary" :underline="false">了解更多 →</el-link>
          </div>
          <div class="feature-card" @click="$router.push('/university-database')">
            <el-icon class="feature-icon"><School /></el-icon>
            <h3>院校数据库</h3>
            <p>全球院校信息搜索与对比，快速了解目标学校</p>
            <el-link type="primary" :underline="false">了解更多 →</el-link>
          </div>
          <div class="feature-card" @click="$router.push('/ai-chat')">
            <el-icon class="feature-icon"><ChatDotRound /></el-icon>
            <h3>AI智能对话</h3>
            <p>多角色智能体在线问答，随时获取专业建议</p>
            <el-link type="primary" :underline="false">了解更多 →</el-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 平台特色 -->
    <section class="highlights">
      <div class="container">
        <h2 class="section-title">为什么选择我们</h2>
        <div class="highlights-content">
          <div class="highlight-item">
            <el-icon :size="48" color="#667eea"><MagicStick /></el-icon>
            <h4>AI驱动</h4>
            <p>整合多个AI供应商，提供智能化的分析与建议</p>
          </div>
          <div class="highlight-item">
            <el-icon :size="48" color="#667eea"><Timer /></el-icon>
            <h4>动态规划</h4>
            <p>根据您的背景自动生成个性化时间路线图</p>
          </div>
          <div class="highlight-item">
            <el-icon :size="48" color="#667eea"><DataLine /></el-icon>
            <h4>数据可视化</h4>
            <p>竞争力雷达图直观展示您的优势与不足</p>
          </div>
          <div class="highlight-item">
            <el-icon :size="48" color="#667eea"><User /></el-icon>
            <h4>智能体对话</h4>
            <p>多角色AI助手，提供专属咨询服务</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  Document, Cpu, Calendar, Files, School, ChatDotRound,
  MagicStick, Timer, DataLine, User
} from '@element-plus/icons-vue'
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 140px);
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 40px;
  line-height: 1.6;
}

.cta-button {
  background: white;
  color: #667eea;
  font-size: 18px;
  padding: 16px 48px;
  border-radius: 30px;
}

.cta-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.features {
  padding: 80px 0;
  background: #f5f7fa;
}

.section-title {
  text-align: center;
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 50px;
  position: relative;
}

.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 15px auto 0;
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 48px;
  color: #667eea;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 12px;
}

.feature-card p {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 16px;
}

.highlights {
  padding: 80px 0;
  background: white;
}

.highlights-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.highlight-item {
  text-align: center;
}

.highlight-item h4 {
  margin: 16px 0 8px;
  color: #2c3e50;
  font-size: 18px;
}

.highlight-item p {
  color: #606266;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 28px;
  }
  .hero-subtitle {
    font-size: 16px;
  }
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
