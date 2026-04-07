<template>
  <div class="story-awwwards">
    <!-- ═══════════════ NOISE OVERLAY ═══════════════ -->
    <div class="noise-overlay" />

    <!-- ═══════════════ SCENE 0: PREAMBLE ═══════════════ -->
    <section
      class="scene scene--preamble"
      :class="{ 'is-active': currentScene === 0 }"
    >
      <canvas ref="particleCanvas" class="particle-bg" />

      <div class="scene-content">
        <div class="preamble-container">
          <div class="preamble-line stagger-item" />
          <p class="preamble-text stagger-item">
            以下内容，由 AI 书写
          </p>
          <div class="preamble-line stagger-item" />
        </div>

        <div class="preamble-hint stagger-item">
          <span>一个关于代码、设计与梦想的故事</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>

        <button class="btn-enter stagger-item" @click="goToScene(1)">
          <span>进入故事</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>

    <!-- ═══════════════ SCENE 1: STATS HERO ═══════════════ -->
    <section
      class="scene scene--stats"
      :class="{ 'is-active': currentScene === 1 }"
    >
      <div class="scene-content">
        <div class="stats-header">
          <span class="scene-num">01</span>
          <h2 class="scene-title">数字背后的投入</h2>
          <p class="scene-subtitle">
            每一个数字，都是无数个深夜的见证
          </p>
        </div>

        <div class="stats-grid">
          <div
            v-for="(stat, index) in stats"
            :key="stat.key"
            class="stat-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="stat-glow" />
            <div class="stat-inner">
              <div class="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path v-if="stat.key === 'period'" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  <path v-else-if="stat.key === 'code'" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  <path v-else-if="stat.key === 'components'" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  <path v-else-if="stat.key === 'pages'" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  <path v-else-if="stat.key === 'commits'" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path v-else-if="stat.key === 'iterations'" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div class="stat-value">
                <span class="stat-number" :data-target="stat.value">{{ animatedStats[stat.key] }}</span>
                <span v-if="stat.suffix" class="stat-suffix">{{ stat.suffix }}</span>
              </div>
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-desc">{{ stat.description }}</div>
            </div>
          </div>
        </div>

        <div class="scene-nav">
          <button class="btn-nav btn-nav--prev" @click="goToScene(0)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button class="btn-nav btn-nav--next" @click="goToScene(2)">
            <span>时间线</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════ SCENE 2: TIMELINE ═══════════════ -->
    <section
      class="scene scene--timeline"
      :class="{ 'is-active': currentScene === 2 }"
    >
      <div class="scene-content">
        <div class="timeline-header">
          <span class="scene-num">02</span>
          <h2 class="scene-title">开发时间线</h2>
          <p class="scene-subtitle">
            从第一个 commit 到最终交付的心路历程
          </p>
        </div>

        <div class="timeline-container">
          <div class="timeline-line" />
          <div
            v-for="(item, index) in timeline"
            :key="index"
            class="timeline-item"
            :class="{ 'is-left': index % 2 === 0, 'is-right': index % 2 === 1 }"
            :style="{ animationDelay: `${index * 0.15}s` }"
          >
            <div class="timeline-node">
              <div class="node-dot" />
              <div class="node-pulse" />
            </div>
            <div class="timeline-card">
              <div class="card-date">{{ item.date }}</div>
              <h3 class="card-title">{{ item.title }}</h3>
              <p class="card-desc">{{ item.description }}</p>
              <div v-if="item.highlight" class="card-highlight">
                <span class="highlight-dot" />
                {{ item.highlight }}
              </div>
            </div>
          </div>
        </div>

        <div class="scene-nav">
          <button class="btn-nav btn-nav--prev" @click="goToScene(1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button class="btn-nav btn-nav--next" @click="goToScene(3)">
            <span>技术亮点</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════ SCENE 3: TECH HIGHLIGHTS ═══════════════ -->
    <section
      class="scene scene--tech"
      :class="{ 'is-active': currentScene === 3 }"
    >
      <div class="scene-content">
        <div class="tech-header">
          <span class="scene-num">03</span>
          <h2 class="scene-title">技术亮点</h2>
          <p class="scene-subtitle">
            那些让我们骄傲的工程决策
          </p>
        </div>

        <div class="tech-grid">
          <div
            v-for="(tech, index) in techHighlights"
            :key="index"
            class="tech-card"
            :class="{ 'is-expanded': expandedTech === index }"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="toggleTech(index)"
          >
            <div class="tech-card-bg" />
            <div class="tech-card-content">
              <div class="tech-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path v-if="index === 0" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2