<template>
  <div
    class="ap"
    :class="{ 'ap--transitioning': isTransitioning }"
  >
    <div class="ap-noise" />

    <!-- ═══════════════ CARD DECK ═══════════════ -->
    <div class="card-deck">
      <!-- ─── CARD 0: HERO ─── -->
      <section
        class="deck-card"
        :class="cardClass(0)"
        data-card="hero"
      >
        <section class="hero">
          <div class="hero-canvas">
            <div class="hero-grid" />
            <div class="hero-orb hero-orb--a" />
            <div class="hero-orb hero-orb--b" />
            <div class="hero-ring hero-ring--1" />
            <div class="hero-ring hero-ring--2" />
            <div class="hero-line-art">
              <svg
                viewBox="0 0 200 200"
                fill="none"
              ><path
                d="M100 0L200 100L100 200L0 100Z"
                stroke="rgba(15,23,42,.08)"
                stroke-width=".5"
              /><path
                d="M100 30L170 100L100 170L30 100Z"
                stroke="rgba(217,119,6,.1)"
                stroke-width=".7"
              /></svg>
            </div>
          </div>
          <div class="hero-inner">
            <div class="hero-badge">
              <span class="hb-dot" /> ASTROPATH ENGINE
            </div>
            <h1 class="hero-title">
              <span class="ht-line ht-line--1">背景</span>
              <span class="ht-line ht-line--2">评估</span>
            </h1>
            <p class="hero-sub">
              AI 智能解析背景，为你生成专属留学路线图
            </p>
            <div class="hero-metric">
              <div class="hm-item">
                <span class="hm-n">55+</span><span class="hm-l">精选院校</span>
              </div>
              <div class="hm-div" /><div class="hm-item">
                <span class="hm-n">6</span><span class="hm-l">核心场景</span>
              </div>
              <div class="hm-div" /><div class="hm-item">
                <span class="hm-n">AI</span><span class="hm-l">智能协同</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Hero CTA -->
        <div class="card-cta card-cta--center">
          <button
            class="btn-hero-start"
            @click="nextCard"
          >
            开始评估
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </section>

      <!-- ─── CARD 1: IDENTITY ─── -->
      <section
        class="deck-card deck-card--form"
        :class="cardClass(1)"
        data-card="identity"
      >
        <main class="chapters">
          <!-- ─── CHAPTER 1: IDENTITY ─── -->
          <section
            id="chapter-identity"
            class="chapter chapter--identity"
            :class="{ 'chapter-visible': isRevealed(0) }"
          >
            <div class="chapter-header">
              <span class="chapter-num">01</span>
              <div class="chapter-title-group">
                <h2 class="chapter-title">
                  身份信息
                </h2>
                <p class="chapter-desc">
                  构建你的数字留学档案
                </p>
              </div>
            </div>

            <div class="identity-card">
              <!-- Name -->
              <div class="id-name">
                <label
                  class="id-label"
                  for="assess-name"
                >你的姓名</label>
                <el-form
                  ref="basicFormRef"
                  :model="form.basic"
                  :rules="basicRules"
                  label-position="top"
                  class="id-name-form"
                >
                  <el-form-item prop="name">
                    <el-input
                      id="assess-name"
                      v-model="form.basic.name"
                      placeholder="输入姓名..."
                      size="large"
                      class="name-input"
                    />
                  </el-form-item>
                </el-form>
                <p class="id-hint">
                  用于生成个性化评估报告
                </p>
              </div>

              <!-- Data Chips: Age + University -->
              <div class="id-chips">
                <div class="id-chip">
                  <div class="id-chip-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ><rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    /><line
                      x1="16"
                      y1="2"
                      x2="16"
                      y2="6"
                    /><line
                      x1="8"
                      y1="2"
                      x2="8"
                      y2="6"
                    /><line
                      x1="3"
                      y1="10"
                      x2="21"
                      y2="10"
                    /></svg>
                  </div>
                  <div class="id-chip-body">
                    <span class="id-chip-label">年龄</span>
                    <el-input-number
                      id="assess-age"
                      v-model="form.basic.age"
                      :min="16"
                      :max="50"
                      controls-position="right"
                      size="large"
                    />
                  </div>
                </div>
                <div class="id-chip">
                  <div class="id-chip-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                  </div>
                  <div class="id-chip-body">
                    <span class="id-chip-label">在读院校</span>
                    <el-select
                      id="assess-university"
                      v-model="form.basic.university"
                      placeholder="选择类型"
                      size="large"
                    >
                      <el-option
                        label="985 院校"
                        value="985"
                      /><el-option
                        label="211 院校"
                        value="211"
                      /><el-option
                        label="普通本科"
                        value="regular"
                      /><el-option
                        label="海外院校"
                        value="overseas"
                      />
                    </el-select>
                  </div>
                </div>
              </div>

              <!-- GPA Ring -->
              <div class="id-gpa">
                <div class="gpa-ring-wrap">
                  <svg
                    class="gpa-svg"
                    viewBox="0 0 120 120"
                    @pointerdown="onGpaPointerDown"
                    @pointermove="onGpaPointerMove"
                    @pointerup="onGpaPointerUp"
                    @pointercancel="onGpaPointerUp"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="#F1F5F9"
                      stroke-width="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="#D97706"
                      stroke-width="8"
                      :stroke-dasharray="gpaDasharray"
                      stroke-dashoffset="0"
                      stroke-linecap="round"
                      transform="rotate(-90 60 60)"
                      class="gpa-progress"
                      style="transition:stroke-dasharray .4s cubic-bezier(.16,1,.3,1)"
                    />
                    <text
                      x="60"
                      y="56"
                      text-anchor="middle"
                      class="gpa-val-text"
                    >{{ form.basic.gpa.toFixed(1) }}</text>
                    <text
                      x="60"
                      y="74"
                      text-anchor="middle"
                      class="gpa-max-text"
                    >/ 4.0</text>
                  </svg>
                </div>
                <div class="gpa-info">
                  <span class="gpa-label">GPA 绩点</span>
                  <span class="gpa-desc">点击或拖动环形调整数值</span>
                  <div class="gpa-quick">
                    <button
                      v-for="v in [2.5, 3.0, 3.5, 3.8]"
                      :key="v"
                      class="gpa-quick-btn"
                      :class="{ on: Math.abs(form.basic.gpa - v) < 0.05 }"
                      @click="form.basic.gpa = v"
                    >
                      {{ v }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Language -->
              <div class="id-lang">
                <div class="id-lang-icon">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                </div>
                <el-input
                  v-model="form.basic.language"
                  placeholder="如：雅思 7.0 / 托福 100"
                  size="large"
                />
                <span class="id-lang-hint">留空则不纳入评估</span>
              </div>
            </div>
          </section>

          <!-- Card 1 CTA -->
          <div class="card-cta">
            <button
              class="btn-card-next"
              @click="nextCard"
            >
              继续
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </main>
      </section>

      <!-- ─── CARD 2: ACADEMICS ─── -->
      <section
        class="deck-card deck-card--form"
        :class="cardClass(2)"
        data-card="academics"
      >
        <main class="chapters">
          <!-- ─── CHAPTER 2: ACADEMICS ─── -->
          <section
            id="chapter-academics"
            class="chapter chapter--academics"
            :class="{ 'chapter-visible': isRevealed(1) }"
          >
            <div class="chapter-header">
              <span class="chapter-num">02</span>
              <div class="chapter-title-group">
                <h2 class="chapter-title">
                  学术背景
                </h2>
                <p class="chapter-desc">
                  定义你的知识版图
                </p>
              </div>
            </div>

            <div class="academics-card">
              <!-- Degree Pills -->
              <div class="ac-degree">
                <span class="ac-label">学历层次</span>
                <div
                  class="deg-pills"
                  role="radiogroup"
                >
                  <button
                    v-for="d in ['本科','硕士','博士']"
                    :key="d"
                    class="deg-pill"
                    :class="{ active: form.academic.degree === d }"
                    @click="form.academic.degree = d"
                  >
                    {{ d }}
                  </button>
                </div>
              </div>

              <!-- Major Tags -->
              <div class="ac-majors">
                <span class="ac-label">专业方向（可多选）</span>
                <div
                  class="tag-cloud"
                  role="group"
                >
                  <button
                    v-for="m in ['理工','商科','人文','社科','艺术']"
                    :key="m"
                    class="tc-tag"
                    :class="{ on: form.academic.majors.includes(m) }"
                    @click="toggleMajor(m)"
                  >
                    {{ m }}
                  </button>
                </div>
              </div>

              <!-- Score -->
              <div class="ac-score">
                <span class="ac-label">均分</span>
                <div class="score-inline">
                  <el-input-number
                    v-model="form.academic.averageScore"
                    :min="0"
                    :max="100"
                    controls-position="right"
                    size="large"
                    style="flex:1"
                  />
                  <span class="si-suffix">/ 100</span>
                </div>
              </div>

              <!-- Research Timeline (Inline) -->
              <div class="ac-research">
                <div class="ac-research-head">
                  <span
                    class="ac-label"
                    style="margin:0"
                  >科研经历</span>
                  <button
                    class="btn-add-row"
                    @click="openResearchInline"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ><path d="M12 5v14M5 12h14" /></svg>
                    添加
                  </button>
                </div>

                <!-- Inline Edit Panel: Research -->
                <div
                  v-if="researchEditingIndex !== null"
                  class="inline-panel"
                >
                  <div class="inline-panel-inner">
                    <div class="inline-panel-head">
                      <span>{{ isEditingResearch ? '编辑科研经历' : '添加科研经历' }}</span>
                      <button
                        class="inline-close"
                        @click="closeResearchInline"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                        ><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <el-form
                      ref="researchFormRef"
                      :model="currentResearch"
                      :rules="researchRules"
                      label-position="top"
                      class="inline-form"
                    >
                      <el-form-item
                        label="项目名称"
                        prop="name"
                      >
                        <el-input
                          v-model="currentResearch.name"
                          placeholder="请输入项目名称"
                        />
                      </el-form-item>
                      <div class="inline-row">
                        <el-form-item
                          label="担任角色"
                          prop="role"
                          style="flex:1"
                        >
                          <el-input
                            v-model="currentResearch.role"
                            placeholder="如：负责人、核心成员"
                          />
                        </el-form-item>
                        <el-form-item
                          label="项目时长"
                          prop="duration"
                          style="flex:1"
                        >
                          <el-input
                            v-model="currentResearch.duration"
                            placeholder="如：3个月"
                          />
                        </el-form-item>
                      </div>
                      <el-form-item
                        label="项目成果"
                        prop="achievements"
                      >
                        <el-input
                          v-model="currentResearch.achievements"
                          type="textarea"
                          :rows="2"
                          placeholder="描述成果（可选）"
                        />
                      </el-form-item>
                    </el-form>
                    <div class="inline-panel-foot">
                      <button
                        class="btn-ghost btn-sm"
                        @click="closeResearchInline"
                      >
                        取消
                      </button>
                      <button
                        class="btn-primary btn-sm"
                        @click="saveResearchInline"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  v-if="form.academic.research.length === 0 && researchEditingIndex === null"
                  class="empty-note"
                >
                  暂无科研记录
                </div>
                <div
                  v-for="(item, idx) in form.academic.research"
                  :key="idx"
                  class="timeline-entry"
                  @click="editResearchInline(idx)"
                >
                  <div class="te-dot" />
                  <div class="te-body">
                    <strong>{{ item.name }}</strong>
                    <span class="te-meta">{{ item.role }} · {{ item.duration }}</span>
                  </div>
                  <button
                    class="te-del"
                    @click.stop="removeResearch(idx)"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                    ><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Card 2 CTA -->
          <div class="card-cta">
            <button
              class="btn-card-next"
              @click="nextCard"
            >
              继续
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </main>
      </section>

      <!-- ─── CARD 3: EXPERIENCE + CTA ─── -->
      <section
        class="deck-card deck-card--form"
        :class="cardClass(3)"
        data-card="experience"
      >
        <main class="chapters">
          <!-- ─── CHAPTER 3: EXPERIENCE ─── -->
          <section
            id="chapter-experience"
            class="chapter chapter--experience"
            :class="{ 'chapter-visible': isRevealed(2) }"
          >
            <div class="chapter-header">
              <span class="chapter-num">03</span>
              <div class="chapter-title-group">
                <h2 class="chapter-title">
                  实践经历
                </h2>
                <p class="chapter-desc">
                  记录你的成长轨迹
                </p>
              </div>
            </div>

            <!-- Track Tabs -->
            <div class="track-tabs">
              <button
                v-for="t in [{k:'internship',l:'实习',icon:'briefcase'},{k:'competition',l:'竞赛',icon:'trophy'},{k:'volunteer',l:'志愿',icon:'heart'}]"
                :key="t.k"
                class="track-tab"
                :class="{ on: practiceTab === t.k }"
                @click="practiceTab = t.k"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <template v-if="t.icon==='briefcase'"><rect
                    x="2"
                    y="7"
                    width="20"
                    height="14"
                    rx="2"
                    ry="2"
                  /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></template>
                  <template v-else-if="t.icon==='trophy'"><path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 1012 0V2Z" /></template>
                  <template v-else><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></template>
                </svg>
                {{ t.l }}
              </button>
              <div
                class="track-tab-indicator"
                :style="{ transform: `translateX(${trackTabOffset}px)` }"
              />
            </div>

            <div class="experience-content">
              <!-- Internship Track -->
              <div
                v-show="practiceTab==='internship'"
                class="exp-track exp-track--internship"
              >
                <div
                  v-for="(item, idx) in form.practice.internships"
                  :key="'i'+idx"
                  class="timeline-entry te--internship"
                >
                  <div class="te-dot te-dot--internship" />
                  <div
                    class="te-body"
                    @click="editInternshipInline(idx)"
                  >
                    <div class="te-head">
                      <strong>{{ item.company }}</strong><span class="tag-mini">{{ item.position }}</span>
                    </div>
                    <span class="te-meta">{{ item.duration }}<template v-if="item.description"> · {{ item.description }}</template></span>
                  </div>
                  <button
                    class="te-del"
                    @click="deleteInternship(idx)"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                    ><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
                <div
                  v-if="internshipEditIndex !== null"
                  class="inline-panel inline-panel--compact"
                >
                  <div class="inline-panel-inner">
                    <div class="inline-panel-head">
                      <span>{{ isEditingInternship ? '编辑实习' : '添加实习' }}</span><button
                        class="inline-close"
                        @click="closeInternshipInline"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                        ><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <el-form
                      ref="internshipFormRef"
                      :model="currentInternship"
                      :rules="internshipRules"
                      label-position="top"
                      class="inline-form"
                    >
                      <el-form-item
                        label="公司名称"
                        prop="company"
                      >
                        <el-input
                          v-model="currentInternship.company"
                          placeholder="公司名"
                        />
                      </el-form-item>
                      <div class="inline-row">
                        <el-form-item
                          label="职位"
                          prop="position"
                          style="flex:1"
                        >
                          <el-input
                            v-model="currentInternship.position"
                            placeholder="职位"
                          />
                        </el-form-item>
                        <el-form-item
                          label="时长"
                          prop="duration"
                          style="flex:1"
                        >
                          <el-input
                            v-model="currentInternship.duration"
                            placeholder="如：3个月"
                          />
                        </el-form-item>
                      </div>
                      <el-form-item
                        label="工作描述"
                        prop="description"
                      >
                        <el-input
                          v-model="currentInternship.description"
                          type="textarea"
                          :rows="2"
                          placeholder="可选"
                        />
                      </el-form-item>
                    </el-form>
                    <div class="inline-panel-foot">
                      <button
                        class="btn-ghost btn-sm"
                        @click="closeInternshipInline"
                      >
                        取消
                      </button><button
                        class="btn-primary btn-sm"
                        @click="saveInternshipInline"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  v-if="internshipEditIndex === null && form.practice.internships.length === 0"
                  class="add-node"
                  @click="openInternshipInline"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  ><path d="M12 5v14M5 12h14" /></svg> 添加实习经历
                </button>
                <button
                  v-if="internshipEditIndex === null && form.practice.internships.length > 0"
                  class="add-node add-node--small"
                  @click="openInternshipInline"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  ><path d="M12 5v14M5 12h14" /></svg>
                </button>
              </div>

              <!-- Competition Track -->
              <div
                v-show="practiceTab==='competition'"
                class="exp-track exp-track--competition"
              >
                <div
                  v-for="(item, idx) in form.practice.competitions"
                  :key="'c'+idx"
                  class="timeline-entry te--competition"
                >
                  <div class="te-dot te-dot--competition" />
                  <div
                    class="te-body"
                    @click="editCompetitionInline(idx)"
                  >
                    <div class="te-head">
                      <strong>{{ item.name }}</strong><span
                        class="tag-mini"
                        :class="'tm-'+getAwardLevelType(item.level)"
                      >{{ item.level }}</span>
                    </div>
                    <span class="te-meta">🏆 {{ item.award }}<template v-if="item.time"> · {{ item.time }}</template></span>
                  </div>
                  <button
                    class="te-del"
                    @click="deleteCompetition(idx)"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                    ><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
                <div
                  v-if="competitionEditIndex !== null"
                  class="inline-panel inline-panel--compact"
                >
                  <div class="inline-panel-inner">
                    <div class="inline-panel-head">
                      <span>{{ isEditingCompetition ? '编辑竞赛' : '添加竞赛' }}</span><button
                        class="inline-close"
                        @click="closeCompetitionInline"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                        ><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <el-form
                      ref="competitionFormRef"
                      :model="currentCompetition"
                      :rules="competitionRules"
                      label-position="top"
                      class="inline-form"
                    >
                      <el-form-item
                        label="竞赛名称"
                        prop="name"
                      >
                        <el-input
                          v-model="currentCompetition.name"
                          placeholder="竞赛名"
                        />
                      </el-form-item>
                      <div class="inline-row">
                        <el-form-item
                          label="级别"
                          prop="level"
                          style="flex:1"
                        >
                          <el-select
                            v-model="currentCompetition.level"
                            placeholder="级别"
                            style="width:100%"
                          >
                            <el-option
                              label="国家级"
                              value="国家级"
                            /><el-option
                              label="省级"
                              value="省级"
                            /><el-option
                              label="校级"
                              value="校级"
                            /><el-option
                              label="其他"
                              value="其他"
                            />
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          label="获奖"
                          prop="award"
                          style="flex:1"
                        >
                          <el-input
                            v-model="currentCompetition.award"
                            placeholder="如：一等奖"
                          />
                        </el-form-item>
                      </div>
                      <el-form-item
                        label="参赛时间"
                        prop="time"
                      >
                        <el-input
                          v-model="currentCompetition.time"
                          placeholder="可选"
                        />
                      </el-form-item>
                    </el-form>
                    <div class="inline-panel-foot">
                      <button
                        class="btn-ghost btn-sm"
                        @click="closeCompetitionInline"
                      >
                        取消
                      </button><button
                        class="btn-primary btn-sm"
                        @click="saveCompetitionInline"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  v-if="competitionEditIndex === null && form.practice.competitions.length === 0"
                  class="add-node add-node--accent"
                  @click="openCompetitionInline"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  ><path d="M12 5v14M5 12h14" /></svg> 添加竞赛获奖
                </button>
                <button
                  v-if="competitionEditIndex === null && form.practice.competitions.length > 0"
                  class="add-node add-node--small add-node--accent"
                  @click="openCompetitionInline"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  ><path d="M12 5v14M5 12h14" /></svg>
                </button>
              </div>

              <!-- Volunteer Track -->
              <div
                v-show="practiceTab==='volunteer'"
                class="exp-track exp-track--volunteer"
              >
                <div
                  v-for="(item, idx) in form.practice.volunteers"
                  :key="'v'+idx"
                  class="timeline-entry te--volunteer"
                >
                  <div class="te-dot te-dot--volunteer" />
                  <div
                    class="te-body"
                    @click="editVolunteerInline(idx)"
                  >
                    <div class="te-head">
                      <strong>{{ item.organization }}</strong><span class="tag-mini tm-ok">{{ item.role }}</span>
                    </div>
                    <span class="te-meta">{{ item.duration }}<template v-if="item.description"> · {{ item.description }}</template></span>
                  </div>
                  <button
                    class="te-del"
                    @click="deleteVolunteer(idx)"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                    ><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </div>
                <div
                  v-if="volunteerEditIndex !== null"
                  class="inline-panel inline-panel--compact"
                >
                  <div class="inline-panel-inner">
                    <div class="inline-panel-head">
                      <span>{{ isEditingVolunteer ? '编辑志愿' : '添加志愿' }}</span><button
                        class="inline-close"
                        @click="closeVolunteerInline"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                        ><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <el-form
                      ref="volunteerFormRef"
                      :model="currentVolunteer"
                      :rules="volunteerRules"
                      label-position="top"
                      class="inline-form"
                    >
                      <el-form-item
                        label="组织名称"
                        prop="organization"
                      >
                        <el-input
                          v-model="currentVolunteer.organization"
                          placeholder="组织名"
                        />
                      </el-form-item>
                      <div class="inline-row">
                        <el-form-item
                          label="岗位"
                          prop="role"
                          style="flex:1"
                        >
                          <el-input
                            v-model="currentVolunteer.role"
                            placeholder="岗位"
                          />
                        </el-form-item>
                        <el-form-item
                          label="服务时长"
                          prop="duration"
                          style="flex:1"
                        >
                          <el-input
                            v-model="currentVolunteer.duration"
                            placeholder="如：20小时"
                          />
                        </el-form-item>
                      </div>
                      <el-form-item
                        label="服务描述"
                        prop="description"
                      >
                        <el-input
                          v-model="currentVolunteer.description"
                          type="textarea"
                          :rows="2"
                          placeholder="可选"
                        />
                      </el-form-item>
                    </el-form>
                    <div class="inline-panel-foot">
                      <button
                        class="btn-ghost btn-sm"
                        @click="closeVolunteerInline"
                      >
                        取消
                      </button><button
                        class="btn-primary btn-sm"
                        @click="saveVolunteerInline"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  v-if="volunteerEditIndex === null && form.practice.volunteers.length === 0"
                  class="add-node add-node--green"
                  @click="openVolunteerInline"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  ><path d="M12 5v14M5 12h14" /></svg> 添加志愿服务
                </button>
                <button
                  v-if="volunteerEditIndex === null && form.practice.volunteers.length > 0"
                  class="add-node add-node--small add-node--green"
                  @click="openVolunteerInline"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  ><path d="M12 5v14M5 12h14" /></svg>
                </button>
              </div>
            </div>
          </section>

          <!-- ─── IMMERSIVE CTA: AI ANALYSIS TRIGGER ─── -->
          <div class="cta-immersive">
            <div class="cta-inner">
              <div class="cta-content">
                <h3 class="cta-title">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                  准备好解锁你的留学潜力了吗？
                </h3>
                <p class="cta-desc">
                  AI 将基于你填写的所有信息，生成专属竞争力分析报告
                </p>

                <div
                  v-if="providers.length > 0"
                  class="cta-provider"
                >
                  <span class="cta-provider-label">选择 AI 引擎</span>
                  <el-dropdown
                    trigger="click"
                    @command="(cmd) => selectedProvider = cmd"
                  >
                    <button class="btn-provider-cta">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ><rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="2"
                      /><path d="M9 9h6v6H9z" /></svg>
                      {{ currentProviderName }}
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                      ><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          v-for="p in providers"
                          :key="p.id"
                          :command="p.id"
                          :class="{ 'is-active': selectedProvider === p.id }"
                        >
                          {{ p.name }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>

              <button
                class="btn-generate"
                :disabled="_btnDisabled || !isFormComplete"
                @click="generateReport"
              >
                <span
                  v-if="_btnDisabled"
                  class="btn-generate__loading"
                >
                  <svg
                    class="spin"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                  AI 分析中...
                </span>
                <span v-else>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                  生成 AI 分析报告
                </span>
              </button>

              <p
                v-if="!isFormComplete"
                class="cta-hint"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><circle
                  cx="12"
                  cy="12"
                  r="10"
                /><path d="M12 16v-4M12 8h.01" /></svg>
                请先完善上方基本信息以获得更准确的分析结果
              </p>
            </div>
            <div class="cta-glow" />
          </div>
        </main>
      </section>

      <!-- ─── CARD 4: REPORT ─── -->
      <section
        class="deck-card deck-card--report"
        :class="cardClass(4)"
        data-card="report"
      >
        <main class="chapters">
          <!-- ─── CHAPTER 4: REPORT — REVEAL MOMENT ════════════════ -->
          <section
            id="chapter-report"
            class="chapter chapter--report"
            :class="{ 'chapter-visible': isRevealed(3), 'report-active': reportGenerated }"
          >
            <!-- Loading State -->
            <div
              v-if="aiStream.isConnecting && !aiStream.hasContent && !reportGenerated"
              class="report-loading"
            >
              <div class="rl-spinner" />
              <p>{{ activeStream.waitingText || '正在连接 AI 服务...' }}</p>
            </div>

            <!-- ═══ STAGE ①: SCORE REVEAL ═══ -->
            <div
              v-if="reportGenerated"
              class="reveal-stage reveal-stage--score"
              :class="{ 'is-revealed': reportStage >= 1 }"
            >
              <div class="score-hero">
                <div class="score-glow" />
                <div class="score-inner">
                  <span class="score-label">综合竞争力评分</span>
                  <div class="score-number">
                    <span class="score-val">{{ animatedScore }}</span>
                    <span class="score-max">/ 5.0</span>
                  </div>
                  <div class="score-bar">
                    <div
                      class="score-bar-fill"
                      :style="{ width: (overallScore / 5 * 100) + '%' }"
                    />
                  </div>
                  <p class="score-comment">
                    {{ getScoreComment(overallScore.value) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- ═══ STAGE ②: RADAR EXPAND ═══ -->
            <div
              v-if="reportGenerated"
              class="reveal-stage reveal-stage--radar"
              :class="{ 'is-revealed': reportStage >= 2 }"
            >
              <h3 class="stage-title">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" /><line
                  x1="12"
                  y1="22"
                  x2="12"
                  y2="15.5"
                /><polyline points="22 8.5 12 15.5 2 8.5" /></svg>
                五维能力模型
              </h3>
              <div
                ref="radarRef"
                class="radar-canvas radar-canvas--reveal"
              />
            </div>

            <!-- ═══ STAGE ③: DIMENSION CASCADE ═══ -->
            <div
              v-if="reportGenerated"
              class="reveal-stage reveal-stage--dimensions"
              :class="{ 'is-revealed': reportStage >= 3 }"
            >
              <h3 class="stage-title">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><line
                  x1="18"
                  y1="20"
                  x2="18"
                  y2="10"
                /><line
                  x1="12"
                  y1="20"
                  x2="12"
                  y2="4"
                /><line
                  x1="6"
                  y1="20"
                  x2="6"
                  y2="14"
                /></svg>
                维度深度解析
              </h3>
              <div class="dim-grid">
                <div
                  v-for="(item, idx) in detailItems"
                  :key="item.key"
                  class="dim-card"
                  :class="{ 'is-visible': dimVisible[idx] }"
                  :style="{ '--dim-delay': idx * 120 + 'ms' }"
                >
                  <div class="dim-header">
                    <span class="dim-name">{{ item.label }}</span>
                    <span class="dim-score">{{ item.score.toFixed(1) }}<span class="dim-max">/5</span></span>
                  </div>
                  <div class="dim-track">
                    <div
                      class="dim-fill"
                      :class="'dim-fill--' + item.key"
                      :style="{ width: (item.score / 5 * 100) + '%' }"
                    />
                  </div>
                  <p class="dim-comment">
                    {{ item.comment }}
                  </p>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="quick-stats">
                <div class="qs-card">
                  <div class="qs-icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                  </div>
                  <div class="qs-body">
                    <span class="qs-value">{{ form.basic.gpa.toFixed(1) }}</span>
                    <span
                      class="qs-grade"
                      :class="getGpaGradeClass(form.basic.gpa)"
                    >{{ getGpaGrade(form.basic.gpa) }}</span>
                  </div>
                  <p class="qs-note">
                    {{ getGpaComment(form.basic.gpa, form.basic.university) }}
                  </p>
                </div>
                <div class="qs-card">
                  <div class="qs-icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                  </div>
                  <div class="qs-body">
                    <span class="qs-value">{{ form.basic.language || '—' }}</span>
                    <span
                      class="qs-grade"
                      :class="getLanguageScoreClass()"
                    >{{ getLanguageLevel() }}</span>
                  </div>
                  <p class="qs-note">
                    {{ getLanguageComment() }}
                  </p>
                </div>
              </div>
            </div>

            <!-- ═══ STAGE ④: AI PANEL ═══ -->
            <div
              v-if="reportGenerated"
              class="reveal-stage reveal-stage--ai"
              :class="{ 'is-revealed': reportStage >= 4 }"
            >
              <div
                class="ai-panel"
                :class="{
                  busy: aiStream.isLoading,
                  done: aiContent && !aiStream.isLoading,
                  err: aiStream.error,
                  idle: !aiStream.isLoading && !aiContent && !aiStream.error
                }"
              >
                <div
                  class="ap-head"
                  @click="showAiSection = !showAiSection"
                >
                  <div class="ap-left">
                    <div class="ap-icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ><rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="2"
                      /><path d="M9 9h6v6H9z" /></svg>
                    </div>
                    <span class="ap-title">AI 深度分析</span>
                    <span
                      v-if="aiStream.isStreaming"
                      class="ap-badge ap-badge--live"
                    >实时生成中</span>
                  </div>
                  <div class="ap-right">
                    <span class="ap-toggle">{{ showAiSection ? '收起' : '展开' }}</span>
                    <svg
                      class="ap-chevron"
                      :class="{ open: showAiSection }"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ><path d="M18 15l-6-6-6 6" /></svg>
                  </div>
                </div>

                <div
                  v-show="showAiSection"
                  class="ap-body"
                >
                  <!-- Thinking State -->
                  <div
                    v-if="aiStream.isThinking && !aiContent && !aiStream.reasoning"
                    class="ai-state ai-state--thinking"
                  >
                    <div class="as-dots">
                      <span /><span /><span />
                    </div>
                    <p class="as-text">
                      AI 正在启动深度分析...
                    </p>
                    <p class="as-hint">
                      思考型模型会先分析您的背景，再生成更有针对性的建议
                    </p>
                    <button
                      v-if="activeStream.stopButtonVisible"
                      class="btn-stop"
                      @click="stopAIAnalysis"
                    >
                      停止
                    </button>
                  </div>

                  <!-- Reasoning Box -->
                  <div
                    v-if="aiStream.reasoning"
                    class="reason-box"
                  >
                    <div
                      class="rb-header"
                      @click="showReasoning = !showReasoning"
                    >
                      <span><svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ><rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="2"
                      /><path d="M9 9h6v6H9z" /></svg> 思考过程</span>
                      <span class="bta-toggle sm">{{ showReasoning ? '收起' : '展开' }}</span>
                    </div>
                    <div
                      v-show="showReasoning"
                      ref="reasoningContentRef"
                      class="rb-content"
                      @scroll="aiStream.handleUserScroll"
                    >
                      {{ aiStream.reasoning }}
                    </div>
                  </div>

                  <!-- Streaming State -->
                  <div
                    v-if="aiStream.isLoading && aiStream.hasReasoning && !aiContent && !aiStream.isThinking"
                    class="ai-state ai-state--streaming"
                  >
                    <div class="as-dots">
                      <span /><span /><span />
                    </div>
                    <p class="as-text">
                      思考完成，正在生成报告...
                    </p>
                    <p class="as-hint">
                      AI 正在基于分析结果撰写个性化建议
                    </p>
                    <div
                      v-if="activeStream.stopButtonVisible || aiStream.isPaused"
                      class="ai-controls"
                    >
                      <button
                        v-if="!aiStream.isPaused"
                        class="btn-pause"
                        @click="pauseAIAnalysis"
                      >
                        暂停
                      </button>
                      <template v-else>
                        <button
                          class="btn-resume"
                          @click="resumeAIAnalysis"
                        >
                          继续
                        </button>
                        <span class="paused-badge">已暂停</span>
                      </template>
                      <button
                        class="btn-stop"
                        @click="stopAIAnalysis"
                      >
                        停止
                      </button>
                    </div>
                  </div>

                  <!-- Content -->
                  <div
                    v-if="aiContent || (aiStream.isLoading && aiStream.hasContent)"
                    class="content-box"
                  >
                    <div
                      class="cb-header"
                      @click="showAiContent = !showAiContent"
                    >
                      <span><svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg> 分析报告</span>
                      <div style="display:flex;align-items:center;gap:8px">
                        <template v-if="aiStream.isLoading || aiStream.isPaused">
                          <button
                            v-if="!aiStream.isPaused"
                            class="btn-pause-xs"
                            @click.stop="pauseAIAnalysis"
                          >
                            暂停
                          </button>
                          <button
                            v-else
                            class="btn-resume-xs"
                            @click.stop="resumeAIAnalysis"
                          >
                            继续
                          </button>
                          <button
                            class="btn-stop-xs"
                            @click.stop="stopAIAnalysis"
                          >
                            停止
                          </button>
                        </template>
                        <span class="bta-toggle sm">{{ showAiContent ? '收起' : '展开' }}</span>
                      </div>
                    </div>
                    <div
                      v-show="showAiContent"
                      class="cb-content"
                    >
                      <div
                        class="ai-md"
                        v-html="renderAiContent(aiContent)"
                      />
                      <span
                        v-if="aiStream.isStreaming"
                        class="cursor-blink"
                      />
                    </div>
                  </div>

                  <!-- Error -->
                  <div
                    v-else-if="aiStream.error"
                    class="err-box"
                  >
                    <p class="eb-title">
                      分析失败
                    </p>
                    <p class="eb-msg">
                      {{ aiStream.error }}
                    </p>
                    <button
                      v-if="activeStream.canRetry"
                      class="btn-primary btn-sm"
                      @click="retryAIAnalysis"
                    >
                      重试
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div
              v-if="reportGenerated"
              class="report-actions report-actions--fab"
            >
              <button
                class="fab-save"
                title="保存报告"
                @click="saveReport"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              </button>
              <button
                class="fab-reset"
                title="重新填写"
                @click="resetForm"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
              </button>
            </div>
          </section>
        </main>
      </section>
    </div>

    <!-- ═══════════════ DECK NAVIGATION ═══════════════ -->
    <nav
      v-show="currentCard < 4 || reportGenerated"
      class="deck-nav"
    >
      <button
        class="deck-nav-btn deck-nav-btn--prev"
        :disabled="currentCard === 0 || isTransitioning"
        @click="prevCard"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
      </button>

      <div class="deck-dots">
        <button
          v-for="(card, i) in deckCards"
          :key="i"
          class="deck-dot"
          :class="{ active: currentCard === i, done: currentCard > i || (i === 3 && reportGenerated) }"
          :title="card.label"
          @click="goToCard(i)"
        />
      </div>

      <button
        class="deck-nav-btn deck-nav-btn--next"
        :disabled="currentCard >= deckCards.length - 1 || isTransitioning"
        @click="nextCard"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import { buildAssessmentPrompt } from '@/utils/ai-api'
import { renderMarkdown } from '@/utils/markdown'
import { useAIStream } from '@/composables/useAIStream'
import { useActiveStream } from '@/composables/useActiveStream'
import { useGlobalAIState } from '@/composables/useGlobalAIState'
import { useAIConfig } from '@/composables/useAIConfig'

const aiConfig = useAIConfig()
const currentStep = ref(0)
const practiceTab = ref('internship')
const basicFormRef = ref(null)
const radarRef = ref(null)
const reasoningContentRef = ref(null)
const researchFormRef = ref(null)
const internshipFormRef = ref(null)
const competitionFormRef = ref(null)
const volunteerFormRef = ref(null)
let radarChart = null

const deckCards = [
  { label: '首页', id: 'hero' },
  { label: '身份', id: 'identity' },
  { label: '学术', id: 'academics' },
  { label: '经历', id: 'experience' },
  { label: '报告', id: 'report' }
]
const currentCard = ref(0)
const isTransitioning = ref(false)
const exitingCard = ref(null)
const enteringCard = ref(null)
const exitDirection = ref('')
const enterDirection = ref('')

const TRANSITION_MAP = {
  '0>1': { exit: 'up', enter: 'from-down' },
  '1>2': { exit: 'left', enter: 'from-right' },
  '2>3': { exit: 'zoom-out', enter: 'zoom-in' },
  '3>4': { exit: 'down-blur', enter: 'from-top' },
  '1<0': { exit: 'down', enter: 'from-up' },
  '2<1': { exit: 'right', enter: 'from-left' },
  '3<2': { exit: 'zoom-out-rev', enter: 'zoom-in-rev' },
  '4<3': { exit: 'up-blur', enter: 'from-bottom' }
}

const cardClass = (index) => {
  const c = []
  if (index === currentCard.value) c.push('deck-card--active')
  else if (index < currentCard.value) c.push('deck-card--prev')
  else c.push('deck-card--next')
  if (exitingCard.value === index) c.push(`deck-card--exit-${exitDirection.value}`)
  if (enteringCard.value === index) c.push(`deck-card--enter-${enterDirection.value}`)
  return c
}

const nextCard = async () => {
  if (isTransitioning.value || currentCard.value >= deckCards.length - 1) return
  await goToCard(currentCard.value + 1, 'forward')
}

const prevCard = async () => {
  if (isTransitioning.value || currentCard.value <= 0) return
  await goToCard(currentCard.value - 1, 'backward')
}

const goToCard = async (targetIndex, direction = 'forward') => {
  if (isTransitioning.value || targetIndex === currentCard.value) return
  if (targetIndex < 0 || targetIndex >= deckCards.length) return

  isTransitioning.value = true
  const fromIndex = currentCard.value
  const key = direction === 'forward' ? `${fromIndex}>${targetIndex}` : `${targetIndex}<${fromIndex}`
  const map = TRANSITION_MAP[key] || { exit: 'fade-out', enter: 'fade-in' }

  exitingCard.value = fromIndex
  enteringCard.value = targetIndex
  exitDirection.value = map.exit
  enterDirection.value = map.enter

  currentCard.value = targetIndex

  await new Promise(r => setTimeout(r, 600))

  exitingCard.value = null
  enteringCard.value = null
  exitDirection.value = ''
  enterDirection.value = ''
  isTransitioning.value = false
}
const isRevealed = () => true

const basicRules = { name: [{ required: true, message: '请输入姓名', trigger: 'blur' }], university: [{ required: true, message: '请选择院校', trigger: 'change' }], gpa: [{ required: true, message: '请选择GPA', trigger: 'change' }] }
const researchRules = { name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }], role: [{ required: true, message: '请选择角色', trigger: 'blur' }], duration: [{ required: true, message: '请输入时长', trigger: 'blur' }] }
const internshipRules = { company: [{ required: true, message: '请输入公司名', trigger: 'blur' }], position: [{ required: true, message: '请输入职位', trigger: 'blur' }], duration: [{ required: true, message: '请输入时长', trigger: 'blur' }] }
const competitionRules = { name: [{ required: true, message: '请输入名称', trigger: 'blur' }], level: [{ required: true, message: '请选择级别', trigger: 'change' }], award: [{ required: true, message: '请填写获奖', trigger: 'blur' }] }
const volunteerRules = { organization: [{ required: true, message: '请输入组织名', trigger: 'blur' }], role: [{ required: true, message: '请输入岗位', trigger: 'blur' }], duration: [{ required: true, message: '请输入时长', trigger: 'blur' }] }

const currentInternship = reactive({ company: '', position: '', duration: '', description: '' })
const currentCompetition = reactive({ name: '', level: '国家级', award: '', time: '' })
const currentVolunteer = reactive({ organization: '', role: '', duration: '', description: '' })

const form = reactive({
  basic: { name: '', age: 22, university: '', gpa: 3.0, language: '' },
  academic: { degree: '本科', majors: [], averageScore: 80, research: [] },
  practice: { internships: [], competitions: [], volunteers: [] }
})
const currentResearch = reactive({ name: '', role: '', duration: '', achievements: '' })

const overallScore = computed(() => {
  const s = [academicScore.value, languageScore.value, researchScore.value, practiceScore.value]
  return s.reduce((a, b) => a + b, 0) / s.length
})
const languageScore = computed(() => {
  const l = form.basic.language; if (!l) return 2.5
  if (l.includes('雅思') && parseFloat(l.match(/\d+/)?.[0] || 0) >= 7) return 5
  if (l.includes('托福') && parseFloat(l.match(/\d+/)?.[0] || 0) >= 100) return 5
  return 3
})
const academicScore = computed(() => { const m = { '985': 1.5, '211': 1.2, 'regular': 1, 'overseas': 1.3 }; return (m[form.basic.university] || 1) + form.academic.averageScore / 100 * 3 })
const researchScore = computed(() => Math.min(form.academic.research.length * 1.5, 5))
const practiceScore = computed(() => Math.min((form.practice.internships.length + form.practice.competitions.length + form.practice.volunteers.length) * 1.2, 5))
const detailItems = computed(() => [
  { key: 'academic', label: '学术能力', score: academicScore.value, comment: getAcademicComment() },
  { key: 'language', label: '语言能力', score: languageScore.value, comment: getLanguageComment() },
  { key: 'research', label: '科研经历', score: researchScore.value, comment: getResearchComment() },
  { key: 'practice', label: '实践背景', score: practiceScore.value, comment: getPracticeComment() }
])

const gpaDasharray = computed(() => {
  const pct = form.basic.gpa / 4
  const circumference = 2 * Math.PI * 52
  return `${pct * circumference} ${circumference}`
})
const trackTabOffset = computed(() => {
  const tabMap = { internship: 0, competition: 112, volunteer: 224 }
  return tabMap[practiceTab.value] || 0
})

let isDraggingGpa = false
const onGpaPointerDown = (e) => {
  isDraggingGpa = true; updateGpaFromEvent(e)
}
const onGpaPointerMove = (e) => {
  if (!isDraggingGpa) return; e.preventDefault(); updateGpaFromEvent(e)
}
const onGpaPointerUp = () => { isDraggingGpa = false }
const updateGpaFromEvent = (e) => {
  const svg = e.currentTarget
  const rect = svg.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  let angle = Math.atan2(e.clientY - cy, e.clientX - cx)
  angle = angle + Math.PI / 2
  if (angle < 0) angle += Math.PI * 2
  let pct = angle / (Math.PI * 2)
  if (pct > 0.99) pct = 1
  form.basic.gpa = Math.round(pct * 40) / 10
}

const toggleMajor = (m) => { const idx = form.academic.majors.indexOf(m); if (idx >= 0) { form.academic.majors.splice(idx, 1) } else { form.academic.majors.push(m) } }

const researchEditingIndex = ref(null)
const isEditingResearch = ref(false)
const openResearchInline = () => { isEditingResearch.value = false; researchEditingIndex.value = -1; resetResearchForm() }
const closeResearchInline = () => { researchEditingIndex.value = null }
const editResearchInline = (idx) => {
  const it = form.academic.research[idx]; Object.assign(currentResearch, { name: it.name, role: it.role, duration: it.duration, achievements: it.achievements || '' }); isEditingResearch.value = true; researchEditingIndex.value = idx
}
const saveResearchInline = async () => {
  if (!researchFormRef.value) return
  await researchFormRef.value.validate(v => {
    if (v) {
      if (isEditingResearch.value) Object.assign(form.academic.research[researchEditingIndex.value], { name: currentResearch.name, role: currentResearch.role, duration: currentResearch.duration, achievements: currentResearch.achievements })
      else form.academic.research.push({ ...currentResearch })
      closeResearchInline(); ElMessage.success(isEditingResearch.value ? '已更新' : '已添加')
    }
  })
}
const removeResearch = (idx) => ElMessageBox.confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => { form.academic.research.splice(idx, 1); ElMessage.success('已删除') }).catch(() => {})
const resetResearchForm = () => Object.assign(currentResearch, { name: '', role: '', duration: '', achievements: '' })

const internshipEditIndex = ref(null); const isEditingInternship = ref(false)
const competitionEditIndex = ref(null); const isEditingCompetition = ref(false)
const volunteerEditIndex = ref(null); const isEditingVolunteer = ref(false)

const openInternshipInline = () => { isEditingInternship.value = false; internshipEditIndex.value = -1; Object.assign(currentInternship, { company:'', position:'', duration:'', description:'' }) }
const closeInternshipInline = () => { internshipEditIndex.value = null }
const editInternshipInline = (idx) => { const it = form.practice.internships[idx]; Object.assign(currentInternship, it); isEditingInternship.value = true; internshipEditIndex.value = idx }
const saveInternshipInline = async () => {
  if (!internshipFormRef.value) return
  await internshipFormRef.value.validate(v => {
    if (v) {
      if (isEditingInternship.value) Object.assign(form.practice.internships[internshipEditIndex.value], { ...currentInternship })
      else form.practice.internships.push({ ...currentInternship })
      closeInternshipInline(); ElMessage.success(isEditingInternship.value ? '已更新' : '已添加')
    }
  })
}
const deleteInternship = (idx) => ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' }).then(() => { form.practice.internships.splice(idx, 1); ElMessage.success('已删除') }).catch(() => {})

const openCompetitionInline = () => { isEditingCompetition.value = false; competitionEditIndex.value = -1; Object.assign(currentCompetition, { name:'', level:'国家级', award:'', time:'' }) }
const closeCompetitionInline = () => { competitionEditIndex.value = null }
const editCompetitionInline = (idx) => { const it = form.practice.competitions[idx]; Object.assign(currentCompetition, it); isEditingCompetition.value = true; competitionEditIndex.value = idx }
const saveCompetitionInline = async () => {
  if (!competitionFormRef.value) return
  await competitionFormRef.value.validate(v => {
    if (v) {
      if (isEditingCompetition.value) Object.assign(form.practice.competitions[competitionEditIndex.value], { ...currentCompetition })
      else form.practice.competitions.push({ ...currentCompetition })
      closeCompetitionInline(); ElMessage.success(isEditingCompetition.value ? '已更新' : '已添加')
    }
  })
}
const deleteCompetition = (idx) => ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' }).then(() => { form.practice.competitions.splice(idx, 1); ElMessage.success('已删除') }).catch(() => {})

const openVolunteerInline = () => { isEditingVolunteer.value = false; volunteerEditIndex.value = -1; Object.assign(currentVolunteer, { organization:'', role:'', duration:'', description:'' }) }
const closeVolunteerInline = () => { volunteerEditIndex.value = null }
const editVolunteerInline = (idx) => { const it = form.practice.volunteers[idx]; Object.assign(currentVolunteer, it); isEditingVolunteer.value = true; volunteerEditIndex.value = idx }
const saveVolunteerInline = async () => {
  if (!volunteerFormRef.value) return
  await volunteerFormRef.value.validate(v => {
    if (v) {
      if (isEditingVolunteer.value) Object.assign(form.practice.volunteers[volunteerEditIndex.value], { ...currentVolunteer })
      else form.practice.volunteers.push({ ...currentVolunteer })
      closeVolunteerInline(); ElMessage.success(isEditingVolunteer.value ? '已更新' : '已添加')
    }
  })
}
const deleteVolunteer = (idx) => ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' }).then(() => { form.practice.volunteers.splice(idx, 1); ElMessage.success('已删除') }).catch(() => {})

const getAwardLevelType = (l) => ({ '国家级': 'danger', '省级': 'warning', '校级': 'primary', '其他': 'info' }[l] || 'info')
const getGpaGrade = (g) => g >= 3.8 ? '优秀' : g >= 3.5 ? '良好' : g >= 3.0 ? '中等' : g >= 2.5 ? '及格' : '需提升'
const getGpaGradeClass = (g) => g >= 3.8 ? 'g-excellent' : g >= 3.5 ? 'g-good' : g >= 3.0 ? 'g-medium' : g >= 2.5 ? 'g-pass' : 'g-low'
const getGpaComment = (g, u) => { const c = u === '985' ? '985院校背景加分' : u === '211' ? '211院校背景加分' : ''; if (g >= 3.8) return `非常出色，${c}竞争力强。`; if (g >= 3.5) return `良好，${c}不错机会。`; if (g >= 3.0) return '中等水平，建议补充其他优势。'; return '相对较低，需突出其他亮点。' }
const getLanguageLevel = () => { const l = form.basic.language; if (!l) return '未评估'; if (l.includes('雅思') && parseFloat(l.match(/\d+/)?.[0]||0) >= 7) return '优秀'; if (l.includes('托福') && parseFloat(l.match(/\d+/)?.[0]||0) >= 100) return '优秀'; if (l.includes('雅思') && parseFloat(l.match(/\d+/)?.[0]||0) >= 6.5) return '良好'; if (l.includes('托福') && parseFloat(l.match(/\d+/)?.[0]||0) >= 90) return '良好'; return '需提升' }
const getLanguageScoreClass = () => { const l = getLanguageLevel(); return l === '优秀' ? 'g-excellent' : l === 'good' ? 'g-good' : 'g-low' }
const getLanguageComment = () => { const l = form.basic.language; if (!l) return '请填写语言成绩。'; if (l.includes('雅思') && parseFloat(l.match(/\d+/)?.[0]||0) >= 7) return '雅思7+满足TOP院校要求。'; if (l.includes('托福') && parseFloat(l.match(/\d+/)?.[0]||0) >= 100) return '托福100+竞争力很强。'; if (l.includes('雅思') && parseFloat(l.match(/\d+/)?.[0]||0) >= 6.5) return '可申请多数院校，建议冲刺更高。'; if (l.includes('托福') && parseFloat(l.match(/\d+/)?.[0]||0) >= 90) return '基本达标，争取更高分数。'; return '可能不足，建议备考。' }
const getAcademicComment = () => { const s = academicScore.value; if (s >= 4) return '学术背景非常优秀，申请优势明显。'; if (s >= 3) return '学术背景良好，具备一定竞争力。'; if (s >= 2) return '学术背景中等，建议补充其他优势。'; return '较弱，需重点突出其他亮点。' }
const getResearchComment = () => { const n = form.academic.research.length; if (n >= 3) return '科研经历丰富，展现研究能力。'; if (n >= 1) return '有一定基础，可进一步深化。'; return '建议增加科研经历以提升竞争力。' }
const getPracticeComment = () => { const t = form.practice.internships.length + form.practice.competitions.length + form.practice.volunteers.length; if (t >= 5) return '实践经历丰富，综合能力强。'; if (t >= 3) return '有一定经验，可继续积累。'; if (t >= 1) return '较少，建议补充。'; return '空白，强烈建议补充。' }

const aiStream = useAIStream({ taskId: 'assessment-analysis', enableThinking: true, autoScroll: true, autoRestore: false, scrollContainer: () => reasoningContentRef.value, onComplete: () => { showAiSection.value = true; showAiContent.value = true } })
const activeStream = useActiveStream({ actions: { feedback: false }, taskId: 'assessment-analysis' })

const globalAIState = useGlobalAIState()
globalAIState.clearActiveStream()

const _btnDisabled = ref(false)

const selectedProvider = ref(null)
const providers = computed(() => aiConfig.getProviders())
const currentProviderName = computed(() => providers.value.find(p => p.id === selectedProvider.value)?.name || '选择AI模型')
const loadProviders = () => { const defaultProvider = aiConfig.getDefaultProvider(); if (defaultProvider) selectedProvider.value = defaultProvider.id }

const isFormComplete = computed(() => {
  const { name, university } = form.basic
  return !!(name?.trim() && university?.trim())
})

const reportGenerated = ref(false)
const reportStage = ref(0)
const dimVisible = ref([false, false, false, false, false])

const getScoreComment = (score) => {
  if (score >= 4.5) return '卓越竞争力 — 你已具备冲击顶尖院校的实力'
  if (score >= 3.8) return '优秀水平 — 在申请中具有明显优势'
  if (score >= 3.0) return '良好基础 — 通过针对性提升可进一步突破'
  if (score >= 2.2) return '发展潜力 — 建议重点补强核心维度'
  return '起步阶段 — 留学之路从现在开始规划'
}

const showReasoning = ref(true), showAiContent = ref(true), showAiSection = ref(true)
const animatedScore = ref('0.0')
let _scoreGen = 0

const aiContent = computed(() => { const c = aiStream.content; return typeof c === 'string' ? c : (c?.value ?? '') })
const animateScore = (target) => {
  const t = Number(target)
  if (!Number.isFinite(t)) return
  const clamped = Math.max(0, Math.min(5, t))
  const gen = ++_scoreGen
  const start = parseFloat(animatedScore.value) || 0
  const dur = 1200, t0 = Date.now()
  const tick = () => {
    if (gen !== _scoreGen) return
    const p = Math.min((Date.now() - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3)
    animatedScore.value = (start + (clamped - start) * e).toFixed(1)
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
watch(overallScore, (v) => { if (reportStage.value >= 1 && reportGenerated.value) animateScore(v) })

const generateReport = async () => {
  _btnDisabled.value = true
  showAiSection.value = true
  showAiContent.value = true

  reportGenerated.value = true
  await goToCard(4, 'forward')
  await nextTick()

  await revealSequence()
}

const revealSequence = async () => {
  reportStage.value = 0
  dimVisible.value = [false, false, false, false, false]
  animatedScore.value = '0.0'
  _scoreGen++

  await new Promise(r => setTimeout(r, 300))

  reportStage.value = 1
  animateScore(overallScore.value)
  await new Promise(r => setTimeout(r, 900))

  reportStage.value = 2
  await nextTick()
  renderRadarChart()
  await new Promise(r => setTimeout(r, 1100))

  reportStage.value = 3
  for (let i = 0; i < 5; i++) {
    await new Promise(r => setTimeout(r, 120))
    dimVisible.value[i] = true
  }
  await new Promise(r => setTimeout(r, 400))

  reportStage.value = 4

  if (selectedProvider.value) {
    await callAIAnalysis()
  } else {
    _btnDisabled.value = false
  }
}
const callAIAnalysis = async () => {
  const scores = { overall: overallScore.value, academic: academicScore.value, language: languageScore.value, research: researchScore.value, practice: practiceScore.value }
  try { await aiStream.generateWithProvider(selectedProvider.value, [{ role: 'user', content: buildAssessmentPrompt(form, scores) }]) }
  catch (err) { console.error('[Assessment] AI analysis failed:', err) }
  finally { _btnDisabled.value = false }
}
const retryAIAnalysis = () => activeStream.handleRetry()
const stopAIAnalysis = () => { aiStream.stop(); activeStream.stopGeneration(); _btnDisabled.value = false }
const pauseAIAnalysis = () => aiStream.pause()
const resumeAIAnalysis = () => aiStream.resume()
const renderAiContent = (c) => c && typeof c === 'string' ? renderMarkdown(c) : ''

const renderRadarChart = () => {
  if (!radarRef.value) return; if (radarChart) radarChart.dispose(); radarChart = echarts.init(radarRef.value)
  const data = [academicScore.value, languageScore.value, researchScore.value, practiceScore.value, overallScore.value]
  radarChart.setOption({
    title: { text: '竞争力雷达图', left: 'center', top: 0, textStyle: { fontSize: 15, fontWeight: 700, color: '#0F172A' } },
    tooltip: { trigger: 'item', formatter: (p) => { const d = p.value, names = ['学术','语言','科研','实践','综合']; let h = '<div style="font-weight:600;margin-bottom:6px;">各维度得分</div>'; names.forEach((n,i) => h += `<div style="display:flex;justify-content:space-between;font-size:13px;"><span>${n}</span><span style="font-weight:600;color:#0F172A">${d[i].toFixed(1)}/5.0</span></div>`); return h }, backgroundColor: '#fff', borderColor: '#E2E8F0', borderRadius: 8, textStyle: { color: '#0F172A', fontSize: 12 }, padding: [10,14], extraCssText: 'box-shadow:0 10px 30px rgba(0,0,0,.08)' },
    radar: { indicator: [{name:'学术能力',max:5},{name:'语言能力',max:5},{name:'科研经历',max:5},{name:'实践背景',max:5},{name:'综合实力',max:5}], center:['50%','58%'], shape:'polygon', splitNumber:5, splitArea: { areaStyle: { color: ['#F8FAFC','#F1F5F9','#E2E8F0','#CBD5E1','#94A3B8'] } }, splitLine: { lineStyle: { color: '#E2E8F0' } }, axisLine: { lineStyle: { color: '#E2E8F0' } }, axisName: { color: '#64748B', fontSize: 13, fontWeight: 600, padding: [3,5] } },
    series: [{ type: 'radar', data: [{ value: data, name: '当前评估', areaStyle: { color: 'rgba(15,23,42,.12)' }, lineStyle: { width: 2, color: '#0F172A' }, itemStyle: { color: '#0F172A', borderWidth: 2, borderColor: '#fff' } }], animationDuration: 800, animationEasing: 'cubicOut' }]
  })
}

const handleResize = () => radarChart?.resize()
const saveReport = () => { localStorage.setItem('assessment_report', JSON.stringify({ ...form, scores: { overall: overallScore.value, academic: academicScore.value, language: languageScore.value, research: researchScore.value, practice: practiceScore.value }, savedAt: new Date().toISOString() })); ElMessage.success('已保存') }
const resetForm = () => ElMessageBox.confirm('确定重新填写？数据将丢失', '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => { isResetting.value = true; Object.assign(form.basic, { name:'', age:22, university:'', gpa:3.0, language:'' }); Object.assign(form.academic, { degree:'本科', majors:[], averageScore:80, research:[] }); Object.assign(form.practice, { internships:[], competitions:[], volunteers:[] }); aiStream.reset(); showAiSection.value = showReasoning.value = showAiContent.value = true; currentStep.value = 0; practiceTab.value = 'internship'; researchEditingIndex.value = null; internshipEditIndex.value = null; competitionEditIndex.value = null; volunteerEditIndex.value = null; reportGenerated.value = false; reportStage.value = 0; dimVisible.value = [false, false, false, false, false]; animatedScore.value = '0.0'; localStorage.removeItem('assessment_form'); setTimeout(() => isResetting.value = false, 0) }).catch(() => {})
let isLoaded = false; const isResetting = ref(false)
const loadFromStorage = async () => {
  try {
    const d = JSON.parse(localStorage.getItem('assessment_form') || '{}')
    if (d.form) { Object.assign(form.basic, d.form.basic || {}); Object.assign(form.academic, d.academic || {}); Object.assign(form.practice, d.practice || {}) }
    if (typeof d.currentStep === 'number') currentStep.value = d.currentStep
    if (d.practiceTab) practiceTab.value = d.practiceTab
    if (typeof d.showReasoning === 'boolean') showReasoning.value = d.showReasoning
    if (d.reportGenerated) { reportGenerated.value = true; reportStage.value = d.reportStage || 4; dimVisible.value = [true, true, true, true, true] }
  } catch (e) { console.warn('[Assessment] Failed to load from storage:', e) }
  isLoaded = true
  if (reportGenerated.value) { await nextTick(); renderRadarChart(); animateScore(overallScore.value) }
}

watch([form, currentStep, practiceTab, showReasoning, showAiContent, showAiSection, reportGenerated, reportStage], () => {
  if (!isLoaded || isResetting.value) return
  localStorage.setItem('assessment_form', JSON.stringify({
    form: { basic:{...form.basic}, academic:{...form.academic}, practice:{ internships:[...form.practice.internships], competitions:[...form.practice.competitions], volunteers:[...form.practice.volunteers] } },
    currentStep: currentStep.value, practiceTab: practiceTab.value,
    showReasoning: showReasoning.value, showAiContent: showAiContent.value, showAiSection: showAiSection.value,
    reportGenerated: reportGenerated.value, reportStage: reportStage.value
  }))
  if (form.basic.name || form.basic.university) localStorage.setItem('assessment_report', JSON.stringify({
    ...form, scores: { overall:overallScore.value, academic:academicScore.value, language:languageScore.value, research:researchScore.value, practice:practiceScore.value }, savedAt:new Date().toISOString()
  }))
}, { deep: true })

const touchStartX = ref(0)
const touchStartY = ref(0)
const SWIPE_THRESHOLD = 50

const onKeydown = (e) => {
  if (isTransitioning.value) return
  const tag = e.target.tagName.toLowerCase()
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); nextCard() }
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'Escape') { e.preventDefault(); prevCard() }
}
const onTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}
const onTouchEnd = (e) => {
  if (isTransitioning.value) return
  const dx = e.changedTouches[0].clientX - touchStartX.value
  const dy = e.changedTouches[0].clientY - touchStartY.value
  const absDx = Math.abs(dx), absDy = Math.abs(dy)
  if (Math.max(absDx, absDy) < SWIPE_THRESHOLD) return
  if (absDx > absDy) { if (dx > 0) prevCard(); else nextCard() }
  else { if (dy > 0) prevCard(); else nextCard() }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('mouseup', onGpaPointerUp)
  window.addEventListener('touchend', onGpaPointerUp)
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  loadProviders(); loadFromStorage()
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mouseup', onGpaPointerUp)
  window.removeEventListener('touchend', onGpaPointerUp)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchend', onTouchEnd)
  radarChart?.dispose(); radarChart = null
})
</script>

<style scoped>
:root{--ease-expo:cubic-bezier(.16,1,.3,1);--ease-back:cubic-bezier(.34,1.56,.64,1);--ease-out:cubic-bezier(.25,1,.5,1);--ease-qout:cubic-bezier(.33,0,.67,1);--ease-smooth:cubic-bezier(.4,0,.2,1)}

.ap :deep(button):not([disabled]){transition:background .28s var(--ease-expo),color .28s var(--ease-expo),border-color .28s var(--ease-expo),box-shadow .28s var(--ease-expo),transform .32s var(--ease-expo),opacity .25s var(--ease-expo)!important;}
.ap :deep(.el-input__wrapper){transition:border-color .25s var(--ease-expo),box-shadow .25s var(--ease-expo),background .25s var(--ease-expo)!important;}
.ap :deep(.el-select .el-input__wrapper){transition:border-color .25s var(--ease-expo),box-shadow .25s var(--ease-expo),background .25s var(--ease-expo)!important;}
.ap button,[role=button],.btn-primary,.btn-ghost,.btn-add-row,.btn-provider,.deg-pill,.tc-tag,.gpa-quick-btn,.add-node,.te-del,.inline-close,.track-tab{will-change:transform;}

.ap{width:100%;min-height:100vh;background:#fff;position:relative;overflow-x:hidden;-webkit-font-smoothing:antialiased;font-family:inherit;}
.ap-noise{position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");opacity:.032;pointer-events:none;z-index:99999;user-select:none;}
.ap--transitioning{pointer-events:none;}

/* ═══════════════ CARD DECK SYSTEM ═══════════════ */
.card-deck{position:relative;width:100%;height:100vh;overflow:hidden;}

.deck-card{position:fixed;inset:0;width:100%;height:100vh;overflow-y:auto;overflow-x:hidden;background:#fff;display:flex;flex-direction:column;opacity:0;pointer-events:none;visibility:hidden;will-change:transform,opacity;transition:none;}
.deck-card--active{opacity:1;pointer-events:auto;visibility:visible;z-index:10;position:relative;transform:none;}
.deck-card--prev{z-index:1;}
.deck-card--next{z-index:1;}

/* ── EXIT ANIMATIONS ── */
.deck-card--exit-up{z-index:11!important;animation:cdExitUp .6s cubic-bezier(.16,1,.3,1) forwards;}
@keyframes cdExitUp{to{transform:translateY(-40px) scale(.95);opacity:0;filter:blur(4px);}}
.deck-card--exit-left{z-index:11!important;animation:cdExitLeft .6s cubic-bezier(.16,1,.3,1) forwards;}
@keyframes cdExitLeft{to{transform:translateX(-30px) rotate(-2deg);opacity:0;}}
.deck-card--exit-zoom-out{z-index:11!important;animation:cdExitZoomOut .55s cubic-bezier(.7,0,.3,1) forwards;}
@keyframes cdExitZoomOut{to{transform:scale(.8);opacity:0;border-radius:40px;}}
.deck-card--exit-down-blur{z-index:11!important;animation:cdExitDownBlur .65s cubic-bezier(.16,1,.3,1) forwards;}
@keyframes cdExitDownBlur{to{transform:translateY(80px);opacity:0;filter:blur(12px);}}
.deck-card--exit-down{z-index:11!important;animation:cdExitDown .6s cubic-bezier(.16,1,.3,1) forwards;}
@keyframes cdExitDown{to{transform:translateY(40px) scale(.95);opacity:0;}}
.deck-card--exit-right{z-index:11!important;animation:cdExitRight .6s cubic-bezier(.16,1,.3,1) forwards;}
@keyframes cdExitRight{to{transform:translateX(30px) rotate(2deg);opacity:0;}}
.deck-card--exit-zoom-out-rev{z-index:11!important;animation:cdExitZoomOutRev .55s cubic-bezier(.7,0,.3,1) forwards;}
@keyframes cdExitZoomOutRev{to{transform:scale(1.15);opacity:0;}}
.deck-card--exit-up-blur{z-index:11!important;animation:cdExitUpBlur .65s cubic-bezier(.16,1,.3,1) forwards;}
@keyframes cdExitUpBlur{to{transform:translateY(-80px);opacity:0;filter:blur(12px);}}
.deck-card--exit-fade-out{z-index:11!important;animation:cdFadeOut .5s ease forwards;}
@keyframes cdFadeOut{to{opacity:0;}}

/* ── ENTER ANIMATIONS ── */
.deck-card--enter-from-down{z-index:12!important;animation:cdEnterFromDown .65s cubic-bezier(.34,1.56,.64,1) forwards;}
@keyframes cdEnterFromDown{from{transform:translateY(60px) scale(.97);opacity:0;}to{transform:translateY(0) scale(1);opacity:1;}}
.deck-card--enter-from-right{z-index:12!important;animation:cdEnterFromRight .6s cubic-bezier(.34,1.56,.64,1) forwards;}
@keyframes cdEnterFromRight{from{transform:translateX(60px);opacity:0;}50%{transform:translateX(-8px);}to{transform:translateX(0);opacity:1;}}
.deck-card--enter-zoom-in{z-index:12!important;animation:cdEnterZoomIn .6s cubic-bezier(.34,1.56,.64,1) forwards;}
@keyframes cdEnterZoomIn{from{transform:scale(1.15);opacity:0;}to{transform:scale(1);opacity:1;}}
.deck-card--enter-from-top{z-index:12!important;animation:cdEnterFromTop .7s cubic-bezier(.16,1,.3,1) forwards;}
@keyframes cdEnterFromTop{from{transform:translateY(-20px) scale(1.02);opacity:0;}to{transform:translateY(0) scale(1);opacity:1;}}
.deck-card--enter-from-up{z-index:12!important;animation:cdEnterFromUp .65s cubic-bezier(.34,1.56,.64,1) forwards;}
@keyframes cdEnterFromUp{from{transform:translateY(-60px) scale(.97);opacity:0;}to{transform:translateY(0) scale(1);opacity:1;}}
.deck-card--enter-from-left{z-index:12!important;animation:cdEnterFromLeft .6s cubic-bezier(.34,1.56,.64,1) forwards;}
@keyframes cdEnterFromLeft{from{transform:translateX(-60px);opacity:0;}50%{transform:translateX(8px);}to{transform:translateX(0);opacity:1;}}
.deck-card--enter-zoom-in-rev{z-index:12!important;animation:cdEnterZoomInRev .6s cubic-bezier(.34,1.56,.64,1) forwards;}
@keyframes cdEnterZoomInRev{from{transform:scale(.85);opacity:0;}to{transform:scale(1);opacity:1;}}
.deck-card--enter-from-bottom{z-index:12!important;animation:cdEnterFromBottom .65s cubic-bezier(.34,1.56,.64,1) forwards;}
@keyframes cdEnterFromBottom{from{transform:translateY(80px) scale(.97);opacity:0;}to{transform:translateY(0) scale(1);opacity:1;}}
.deck-card--enter-fade-in{z-index:12!important;animation:cdFadeIn .55s ease forwards;}
@keyframes cdFadeIn{from{opacity:0;}to{opacity:1;}}

/* Card inner scrollable area */
.deck-card--form{justify-content:flex-start;padding-top:40px;}
.deck-card--report{background:#F8FAFC;}

/* ═══ CARD CTA BUTTONS ═══ */
.card-cta{display:flex;justify-content:center;padding:32px 48px 48px;margin-top:auto;}
.card-cta--center{padding-top:0;}
.btn-hero-start{display:inline-flex;align-items:center;gap:10px;padding:18px 44px;background:linear-gradient(135deg,#0F172A,#1E293B);border:none;border-radius:14px;color:#fff;font-size:17px;font-weight:600;cursor:pointer;transition:all .45s cubic-bezier(.34,1.56,.64,1);box-shadow:0 6px 28px rgba(15,23,42,.22);}
.btn-hero-start:hover{transform:translateY(-4px) scale(1.04);box-shadow:0 12px 40px rgba(15,23,42,.32);}
.btn-hero-start svg{transition:transform .35s cubic-bezier(.34,1.56,.64,1);}
.btn-hero-start:hover svg{transform:translateX(4px);}

.btn-card-next{display:inline-flex;align-items:center;gap:10px;padding:14px 36px;background:linear-gradient(135deg,#0F172A,#1E293B);border:none;border-radius:13px;color:#fff;font-size:15px;font-weight:600;cursor:pointer;transition:all .4s cubic-bezier(.34,1.56,.64,1);box-shadow:0 4px 20px rgba(15,23,42,.18);}
.btn-card-next:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 8px 30px rgba(15,23,42,.25);}
.btn-card-next svg{transition:transform .3s cubic-bezier(.34,1.56,.64,1);}
.btn-card-next:hover svg{transform:translateX(4px);}

/* ═══ DECK NAVIGATION ═══ */
.deck-nav{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:100;display:flex;align-items:center;gap:20px;padding:12px 28px;background:rgba(255,255,255,.88);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border:1px solid rgba(226,232,240,.6);border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,.08),0 2px 8px rgba(0,0,0,.04);}
.deck-nav-btn{width:44px;height:44px;display:flex;align-items:center;justify-content:center;border:1px solid #E2E8F0;border-radius:12px;background:#fff;color:#64748B;cursor:pointer;transition:all .35s cubic-bezier(.34,1.56,.64,1);}
.deck-nav-btn:hover:not(:disabled){border-color:#94A3B8;color:#0F172A;background:#FAFBFC;transform:scale(1.08);box-shadow:0 4px 14px rgba(0,0,0,.06);}
.deck-nav-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
.deck-dots{display:flex;gap:8px;}
.deck-dot{width:10px;height:10px;border-radius:50%;border:2px solid #CBD5E1;background:transparent;cursor:pointer;transition:all .35s cubic-bezier(.34,1.56,.64,1);padding:0;}
.deck-dot:hover:not(.active):not(.done){border-color:#94A3B8;transform:scale(1.2);}
.deck-dot.active{background:#D97706;border-color:#D97706;box-shadow:0 0 0 4px rgba(217,119,06,.15);transform:scale(1.15);}
.deck-dot.done{background:#0F172A;border-color:#0F172A;}

@media(max-width:767px){
  .deck-nav{bottom:16px;padding:10px 20px;gap:14px;border-radius:16px;}
  .deck-nav-btn{width:38px;height:38px;border-radius:10px;}
  .deck-dot{width:8px;height:8px;}
  .card-cta{padding:24px 24px 40px;}
  .btn-hero-start{padding:16px 36px;font-size:15px;}
}

/* ============================================================ HERO */
.hero{position:relative;width:100%;min-height:calc(100dvh - 64px);margin-top:-20px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:linear-gradient(165deg,#FAFBFC 0%,#F1F5F9 40%,#fff 100%);}
.hero-canvas{position:absolute;inset:0;z-index:0;}
.hero-grid{position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(15,23,42,.05) 1px,transparent 0);background-size:48px 48px;mask-image:radial-gradient(ellipse 70% 55% at 50% 48%,black,transparent);-webkit-mask-image:radial-gradient(ellipse 70% 55% at 50% 48%,black,transparent);opacity:.8;}
.hero-orb{position:absolute;border-radius:50%;filter:blur(120px);pointer-events:none;will-change:transform;}
.hero-orb--a{width:600px;height:600px;background:radial-gradient(circle,rgba(217,119,06,.12),transparent 65%);top:-18%;right:-5%;animation:oFloat 18s ease-in-out infinite alternate;}
.hero-orb--b{width:480px;height:480px;background:radial-gradient(circle,rgba(15,23,42,.05),transparent 65%);bottom:-12%;left:-6%;animation:oFloatR 22s ease-in-out infinite alternate-reverse;}
@keyframes oFloat{to{transform:translate(50px,-35px) scale(1.08)}}
@keyframes oFloatR{to{transform:translate(-38px,28px) scale(1.06)}}
.hero-ring{position:absolute;border-radius:50%;pointer-events:none;border:1px solid;opacity:.12;will-change:transform;}
.hero-ring--1{width:340px;height:340px;border-color:#0F172A;top:6%;left:-10%;animation:rSpin 60s linear infinite;}
.hero-ring--2{width:200px;height:200px;border-color:#D97706;bottom:14%;right:-5%;animation:rSpinR 45s linear infinite;opacity:.18;}
@keyframes rSpin{to{transform:rotate(360deg)}}@keyframes rSpinR{to{transform:rotate(-360deg)}}
.hero-line-art{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(1.8);opacity:.06;pointer-events:none;width:220px;height:220px;}
.hero-inner{text-align:center;padding:80px 32px 60px;position:relative;z-index:2;max-width:860px;}
.hero-badge{display:inline-flex;align-items:center;gap:10px;font-size:10px;font-weight:800;letter-spacing:4px;text-transform:uppercase;color:#94A3B8;margin:0 0 40px;font-family:var(--font-family-mono);padding:8px 20px;background:rgba(248,250,252,.7);backdrop-filter:blur(8px);border:1px solid rgba(226,232,240,.5);border-radius:100px;animation:badgeIn .8s var(--ease-expo) both;}
@keyframes badgeIn{from{opacity:0;transform:translateY(-16px) scale(.95)}}
.hb-dot{width:7px;height:7px;background:#D97706;border-radius:50%;display:inline-box;animation:hPulse 2.2s ease-in-out infinite;}
@keyframes hPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.65)}}
.hero-title{margin:0 0 32px;line-height:.88;display:flex;flex-direction:column;align-items:center;}
.ht-line{display:block;font-weight:900;color:#0F172A;letter-spacing:-.07em;font-family:var(--font-family-base);animation:waveReveal 1s var(--ease-expo) both;}
@keyframes waveReveal{from{opacity:0;transform:translateY(30px) scale(.97);filter:blur(8px);}to{opacity:1;transform:translateY(0) scale(1);filter:blur(0);}}
.ht-line--1{font-size:clamp(4.5rem,13vw,9rem);position:relative;animation-delay:.15s;}
.ht-line--1::after{content:'';position:absolute;bottom:8px;left:10%;right:10%;height:4px;background:linear-gradient(90deg,transparent,#D97706,transparent);border-radius:2px;opacity:.25;}
.ht-line--2{font-size:clamp(4.5rem,13vw,9rem);color:transparent;-webkit-text-stroke:2.5px rgba(15,23,42,.15);-webkit-text-fill-color:transparent;animation-delay:.35s;}
.hero-sub{font-size:clamp(17px,1.7vw,20px);color:#64748B;line-height:1.75;margin:0 0 48px;font-weight:400;letter-spacing:.02em;max-width:540px;margin-left:auto;margin-right:auto;animation:waveReveal 1s var(--ease-expo) both .55s;}
.hero-metric{display:inline-flex;align-items:center;gap:0;background:rgba(248,250,252,.8);backdrop-filter:blur(8px);border:1px solid rgba(226,232,240,.6);border-radius:100px;padding:10px 28px;}
.hm-item{display:flex;flex-direction:column;align-items:center;gap:2px;}
.hm-n{font-size:18px;font-weight:900;color:#0F172A;letter-spacing:-.5px;}
.hm-l{font-size:10px;font-weight:600;color:#94A3B8;letter-spacing:.5px;text-transform:uppercase;}
.hm-div{width:1px;height:28px;background:#E2E8F0;}
.hero-scroll-hint{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;z-index:2;}
.hsm-wheel{color:#94A3B8;animation:wheelBounce 2.5s ease-in-out infinite;}
@keyframes wheelBounce{0%,100%{transform:translateY(0);}50%{transform:translateY(6px);}}
.hero-scroll-hint span{font-size:10px;font-weight:600;color:#94A3B8;letter-spacing:2px;text-transform:uppercase;}
.hero-bottom-fade{position:absolute;bottom:0;left:0;right:0;height:100px;background:linear-gradient(to top,#fff 30%,transparent);z-index:1;pointer-events:none;}

/* ============================================================ BOTTOM PROGRESS BAR */
.progress-bar{position:fixed;bottom:0;left:0;right:0;z-index:60;background:rgba(255,255,255,.92);backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%);border-top:1px solid rgba(226,232,240,.6);transition:opacity .5s var(--ease-expo), visibility .5s, transform .5s var(--ease-expo);}
.progress-bar--hidden{opacity:0;visibility:hidden;pointer-events:none;transform:translateY(100%);}

.pb-inner{max-width:900px;margin:0 auto;padding:12px 32px;display:flex;align-items:center;gap:24px;height:56px;}

.pb-info{display:flex;align-items:center;gap:10px;min-width:140px;}
.pb-chapter-num{font-size:13px;font-weight:800;color:#D97706;font-family:var(--font-family-mono);letter-spacing:1.5px;}
.pb-chapter-label{font-size:13.5px;font-weight:600;color:#334155;letter-spacing:-.01em;}

.pb-track{flex:1;height:4px;background:#E2E8F0;border-radius:2px;position:relative;display:flex;align-items:center;gap:8px;padding:0 2px;}
.pb-node{width:14px;height:14px;border-radius:50%;background:#fff;border:2px solid #CBD5E1;color:transparent;cursor:pointer;transition:all .35s var(--ease-expo);flex-shrink:0;display:flex;align-items:center;justify-content:center;z-index:2;position:relative;}
.pb-node:hover:not(.done):not(.active){border-color:#94A3B8;transform:scale(1.15);}
.pb-node.active{background:#0F172A;border-color:#0F172A;box-shadow:0 0 0 3px rgba(15,23,42,.08),0 2px 8px rgba(15,23,42,.12);transform:scale(1.2);}
.pb-node.done{background:#0F172A;border-color:#0F172A;color:#fff;}
.pb-node.pulse{animation:pbPulse 2s ease-in-out infinite;}
@keyframes pbPulse{0%,100%{box-shadow:0 0 0 0 rgba(217,119,06,.4);}50%{box-shadow:0 0 0 6px rgba(217,119,06,0);}}
.pb-dot svg{display:block;}

.pb-fill{position:absolute;top:0;left:0;height:100%;background:linear-gradient(90deg,#D97706,#F59E0B);border-radius:2px;transition:width .55s cubic-bezier(.34,1.56,.64,1);z-index:1;}

.pb-actions{display:flex;gap:6px;min-width:72px;justify-content:flex-end;}
.pb-nav-btn{width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:1px solid #E2E8F0;border-radius:10px;background:#fff;color:#64748B;cursor:pointer;transition:all .3s var(--ease-expo);}
.pb-nav-btn:hover{border-color:#94A3B8;color:#0F172A;background:#FAFBFC;transform:translateY(-1px);}
.pb-nav-btn:active{transform:translateY(0) scale(.96);}

@media (max-width:767px){
  .pb-inner{padding:10px 20px;height:48px;gap:16px;}
  .pb-info{min-width:auto;gap:6px;}
  .pb-chapter-num{font-size:11px;}
  .pb-chapter-label{font-size:12px;font-weight:500;}
  .pb-track{gap:6px;}
  .pb-node{width:11px;height:11px;border-width:1.5px;}
  .pb-actions{min-width:60px;}
  .pb-nav-btn{width:30px;height:30px;border-radius:8px;}
}

/* ============================================================ CHAPTERS */
.chapters{max-width:900px;margin:0 auto;padding:0 32px 100px;position:relative;}

.chapter{padding:80px 0 0;opacity:0;transform:translateY(24px);transition:opacity .7s var(--ease-expo), transform .7s var(--ease-expo);}
.chapter.chapter-visible{opacity:1;transform:translateY(0);}

/* Chapter Background Gradients — Emotional Flow */
.chapter--identity{background:linear-gradient(180deg,#FFFFFF 0%,#FAFBFC 60%,#F8FAFC 100%);margin-top:-20px;padding-top:100px;}
.chapter--academics{background:#FAFBFC;margin-top:-20px;padding-top:80px;}
.chapter--experience{background:linear-gradient(180deg,#FAFBFC 0%,#F8FAFC 100%);margin-top:-20px;padding-top:80px;}
.chapter--report{background:#F8FAFC;margin-top:-20px;padding-top:60px;}

.chapter-header{display:flex;align-items:flex-start;gap:20px;margin-bottom:36px;}
.chapter-num{font-size:11px;font-weight:850;color:#D97706;font-family:var(--font-family-mono);letter-spacing:1.5px;opacity:.7;flex-shrink:0;padding-top:3px;}
.chapter-title-group{flex:1;}
.chapter-title{font-size:clamp(22px,3vw,32px);font-weight:850;color:#0F172A;margin:0 0 6px;letter-spacing:-.6px;line-height:1.15;}
.chapter-desc{font-size:14px;color:#94A3B8;margin:0;font-weight:400;letter-spacing:.02em;}

/* ============================================================ IDENTITY CARD — IMMERSIVE */
.identity-card{padding:20px 0;position:relative;}
.identity-card::before{display:none;}

/* Name — Hero Level Input */
.id-name{margin-bottom:48px;text-align:center;}
.id-label{display:block;font-size:13px;font-weight:700;color:#64748B;letter-spacing:2px;text-transform:uppercase;margin:0 0 20px;}
.id-name-form{max-width:560px;margin:0 auto;}
.name-input :deep(.el-input__wrapper){border-radius:18px!important;padding:20px 28px!important;box-shadow:0 4px 24px rgba(15,23,42,.06),0 0 0 1.5px #E2E8F0 inset!important;background:#fff!important;transition:all .45s var(--ease-expo)!important;}
.name-input :deep(.el-input__wrapper:hover){box-shadow:0 8px 32px rgba(15,23,42,.1),0 0 0 1.5px #CBD5E1 inset!important;transform:translateY(-2px);}
.name-input :deep(.el-input__wrapper:focus-within){box-shadow:0 0 0 4px rgba(217,119,06,.08),0 12px 40px rgba(217,119,06,.12),0 0 0 2px #D97706 inset!important;background:#fff!important;border-color:#D97706!important;}
.name-input :deep(.el-input__inner){font-size:22px!important;font-weight:500!important;letter-spacing:.05em!important;text-align:center!important;color:#0F172A!important;}
.id-hint{font-size:13px;color:#94A3B8;margin:16px 0 0;letter-spacing:.2px;}

/* Data Chips — Elevated Cards */
.id-chips{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:44px;}
.id-chip{display:flex;align-items:center;gap:16px;background:rgba(248,250,252,.7);border:1px solid #E2E8F0;border-radius:20px;padding:24px 28px;transition:all .4s cubic-bezier(.34,1.56,.64,1);}
.id-chip:hover{border-color:rgba(15,23,42,.1);box-shadow:0 12px 36px rgba(0,0,0,.07);transform:translateY(-4px);}
.id-chip-icon{width:36px;height:36px;border-radius:10px;background:#F8FAFC;display:flex;align-items:center;justify-content:center;color:#64748B;flex-shrink:0;}
.id-chip-icon svg{width:16px;height:16px;}
.id-chip-body{flex:1;display:flex;flex-direction:column;gap:4px;min-width:0;}
.id-chip-label{font-size:10.5px;font-weight:700;color:#94A3B8;letter-spacing:.5px;text-transform:uppercase;}
.id-chip-body :deep(.el-input-number),.id-chip-body :deep(.el-select){width:100%;}
.id-chip-body :deep(.el-input__inner){font-size:14px!important;font-weight:550!important;}

/* GPA Ring */
.id-gpa{display:flex;align-items:center;gap:32px;background:linear-gradient(135deg,#0F172A,#1E293B);border-radius:20px;padding:32px 36px;margin-bottom:28px;color:#fff;position:relative;overflow:hidden;}
.id-gpa::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 40%,rgba(217,119,6,.1),transparent 60%);pointer-events:none;}
.gpa-ring-wrap{flex-shrink:0;position:relative;z-index:1;}
.gpa-svg{width:120px;height:120px;cursor:pointer;display:block;-webkit-tap-highlight-color:transparent;transition:transform .4s cubic-bezier(.34,1.56,.64,1);}
.gpa-svg:hover{transform:scale(1.06);}
.gpa-svg:hover .gpa-progress{filter:brightness(1.2) drop-shadow(0 0 12px rgba(217,119,06,.5));}
.gpa-val-text{font-size:26px;font-weight:900;fill:#fff;font-family:var(--font-family-mono);letter-spacing:-1px;transition:all .3s var(--ease-back);}
.gpa-max-text{font-size:11px;fill:rgba(255,255,255,.4);font-family:var(--font-family-mono);}
.gpa-info{flex:1;position:relative;z-index:1;display:flex;flex-direction:column;gap:8px;}
.gpa-label{font-size:13px;font-weight:700;color:rgba(255,255,255,.85);letter-spacing:-.1px;}
.gpa-desc{font-size:11.5px;color:rgba(255,255,255,.4);margin:0;}
.gpa-quick{display:flex;gap:6px;margin-top:4px;}
.gpa-quick-btn{padding:4px 14px;border-radius:100px;font-size:12px;font-weight:600;border:1px solid rgba(255,255,255,.15);background:transparent;color:rgba(255,255,255,.6);cursor:pointer;transition:all .25s var(--ease-expo);font-family:inherit;}
.gpa-quick-btn:hover{border-color:rgba(255,255,255,.35);color:#fff;background:rgba(255,255,255,.08);}
.gpa-quick-btn.on{background:#D97706;border-color:#D97706;color:#fff;}

/* Language Row */
.id-lang{display:flex;align-items:center;gap:12px;background:#FAFBFC;border:1px solid #EEF0F3;border-radius:14px;padding:4px 16px;transition:border-color .25s;}
.id-lang:focus-within{border-color:#CBD5E1;}
.id-lang-icon{color:#94A3B8;flex-shrink:0;display:flex;}
.id-lang-icon svg{width:15px;height:15px;}
.id-lang :deep(.el-input__wrapper){border:none!important;box-shadow:none!important;background:transparent!important;padding:4px 0!important;}
.id-lang :deep(.el-input__inner){font-size:14.5px!important;color:#0F172A!important;}
.id-lang-hint{font-size:11px;color:#CBD5E1;white-space:nowrap;flex-shrink:0;}

/* ============================================================ ACADEMICS CARD — IMMERSIVE */
.academics-card{display:flex;flex-direction:column;gap:36px;}

.ac-degree,.ac-majors,.ac-score{display:flex;flex-direction:column;gap:12px;}
.ac-label{font-size:13px;font-weight:700;color:#475569;letter-spacing:.8px;text-transform:uppercase;margin:0;}

/* Segmented Control — Degree Pills */
.deg-pills{display:flex;background:#F1F5F9;border-radius:14px;padding:5px;gap:0;}
.deg-pill{padding:10px 32px;border-radius:100px;font-size:14px;font-weight:600;border:1.5px solid #E2E8F0;background:#fff;color:#64748B;cursor:pointer;transition:all .28s var(--ease-expo);font-family:inherit;letter-spacing:-.1px;position:relative;overflow:hidden;}
.deg-pill::before{content:'';position:absolute;inset:0;background:#0F172A;transform:scaleY(0);transform-origin:bottom;transition:transform .35s var(--ease-back);z-index:-1;border-radius:inherit;}
.deg-pill:hover{border-color:#CBD5E1;color:#0F172A;}
.deg-pill.active{background:#0F172A;border-color:#0F172A;color:#fff;box-shadow:0 3px 14px rgba(15,23,42,.16);}
.deg-pill.active::before{transform:scaleY(1);}

/* Capsule Cloud — Major Tags */
.tag-cloud{display:flex;gap:12px;flex-wrap:wrap;}
.tc-tag{padding:12px 28px;border-radius:100px;font-size:14.5px;font-weight:600;border:1.5px solid #E2E8F0;background:#fff;color:#475569;cursor:pointer;transition:all .35s cubic-bezier(.34,1.56,.64,1);font-family:inherit;letter-spacing:-.02px;position:relative;}
.tc-tag::after{content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(135deg,rgba(217,119,06,.12),rgba(217,119,06,.05));opacity:0;transition:opacity .3s;}
.tc-tag:hover:not(.on){border-color:#CBD5E1;color:#334155;transform:translateY(-3px) scale(1.03);}
.tc-tag:hover::after{opacity:1;}
.tc-tag.on{background:linear-gradient(135deg,rgba(217,119,06,.12),rgba(217,119,06,.05));border-color:#D97706;color:#92400E;font-weight:700;transform:scale(1.06);box-shadow:0 4px 16px rgba(217,119,06,.15);}

.score-inline{display:flex;align-items:center;gap:8px;}
.si-suffix{font-size:15px;color:#94A3B8;font-weight:600;}

/* Research Area */
.ac-research{background:#FAFBFC;border:1px solid #EEF0F3;border-radius:18px;padding:24px 28px;}
.ac-research-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}

/* ============================================================ INLINE PANELS */
.inline-panel{margin-top:16px;border:1px solid #E2E8F0;border-radius:16px;overflow:hidden;background:#fff;animation:panelSlide .35s var(--ease-back) both;}
@keyframes panelSlide{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
.inline-panel--compact{margin-top:12px;}
.inline-panel-inner{padding:20px 24px;}
.inline-panel-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;font-size:14px;font-weight:700;color:#0F172A;letter-spacing:-.2px;}
.inline-close{width:28px;height:28px;border-radius:8px;border:1px solid #E2E8F0;background:transparent;color:#94A3B8;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;}
.inline-close:hover{background:#FEF2F2;color:#DC2626;border-color:#FECACA;}
.inline-form{display:flex;flex-direction:column;gap:14px;}
.inline-row{display:flex;gap:12px;}
.inline-panel-foot{display:flex;justify-content:flex-end;gap:10px;margin-top:16px;padding-top:14px;border-top:1px solid #F1F5F9;}

/* Timeline Entries */
.timeline-entry{display:flex;align-items:center;gap:14px;padding:12px 16px;background:#fff;border:1px solid #EEF0F3;border-radius:12px;margin-bottom:8px;cursor:default;transition:all .28s var(--ease-expo);position:relative;}
.timeline-entry:hover{border-color:#E2E8F0;box-shadow:0 4px 16px rgba(0,0,0,.045);transform:translateX(4px);}
.te-dot{width:10px;height:10px;border-radius:50%;background:#E2E8F0;flex-shrink:0;position:relative;transition:background .25s;}
.te-dot--internship{background:#0F172A;box-shadow:0 0 0 3px rgba(15,23,42,.1);}
.te-dot--competition{background:#D97706;box-shadow:0 0 0 3px rgba(217,119,6,.1);}
.te-dot--volunteer{background:#D97706;box-shadow:0 0 0 3px rgba(217,119,6,.1);}
.te-body{flex:1;min-width:0;cursor:pointer;}
.te-head{display:flex;align-items:center;gap:8px;margin-bottom:2px;}
.te-head strong{font-size:14px;font-weight:650;color:#0F172A;letter-spacing:-.2px;}
.te-meta{font-size:12px;color:#94A3B8;display:flex;flex-wrap:wrap;gap:6px;}
.te-del{width:26px;height:26px;border-radius:7px;border:none;background:transparent;color:#CBD5E1;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;opacity:0;transition:all .2s;}
.timeline-entry:hover .te-del{opacity:1;}
.te-del:hover{background:#FFFBEB;color:#D97706;}

.empty-note{font-size:13px;color:#94A3B8;text-align:center;padding:22px;background:#FAFBFC;border:1px dashed #E2E8F0;border-radius:12px;letter-spacing:.2px;}

/* Tags */
.tag-mini{font-size:11px;font-weight:600;padding:2px 9px;border-radius:5px;background:#F1F5F9;color:#475569;white-space:nowrap;letter-spacing:.2px;}
.tag-mini.tm-danger{background:#FFFBEB;color:#D97706;}.tag-mini.tm-warning{background:#FFFBEB;color:#D97706;}.tag-mini.tm-ok{background:#F8FAFC;color:#0F172A;}.tag-mini.tm-primary{background:#F8FAFC;color:#0F172A;}.tag-mini.tm-info{background:#F8FAFC;color:#64748B;}

/* Buttons */
.btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:15px 36px;background:#0F172A;color:#fff;font-size:14.5px;font-weight:680;border:none;border-radius:13px;min-height:52px;cursor:pointer;transition:all .32s var(--ease-expo);box-shadow:0 3px 12px rgba(15,23,42,.14),0 1px 4px rgba(15,23,42,.06);white-space:nowrap;font-family:inherit;letter-spacing:-.2px;position:relative;overflow:hidden;}
.btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.1),transparent);opacity:0;transition:opacity .3s;}
.btn-primary:hover:not(:disabled)::before{opacity:1;}
.btn-primary:hover:not(:disabled){background:#1E293B;transform:translateY(-2px);box-shadow:0 8px 28px rgba(15,23,42,.18),0 2px 6px rgba(0,0,0,.04);}
.btn-primary:active:not(:disabled){transform:translateY(0);}
.btn-primary.disabled{opacity:.38;cursor:not-allowed;}
.btn-primary.btn-sm{padding:10px 22px;min-height:38px;font-size:13px;}
.btn-primary--wide{width:100%;max-width:320px;margin:0 auto;display:inline-flex;justify-content:center;}

.btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:15px 28px;background:transparent;color:#475569;font-size:14.5px;font-weight:600;border:1.5px solid #E2E8F0;border-radius:13px;min-height:52px;cursor:pointer;transition:all .32s var(--ease-expo);white-space:nowrap;font-family:inherit;}
.btn-ghost:hover{border-color:#0F172A;color:#0F172A;background:rgba(15,23,42,.018);transform:translateY(-2px);box-shadow:0 4px 18px rgba(0,0,0,.04);}

.btn-add-row{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 20px;background:#FAFBFC;color:#475569;font-size:13px;font-weight:600;border:1.5px dashed #CBD5E1;border-radius:11px;cursor:pointer;transition:all .25s ease;font-family:inherit;}
.btn-add-row:hover{border-color:#0F172A;color:#0F172A;background:rgba(15,23,42,.025);}

.btn-provider{display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:8px 16px;background:#fff;color:#64748B;font-size:12.5px;font-weight:550;border:1px solid #E2E8F0;border-radius:10px;cursor:pointer;transition:all .2s ease;font-family:inherit;}
.btn-provider:hover{border-color:#0F172A;color:#0F172A;}

.btn-stop{padding:5px 14px;font-size:12px;background:#FFFBEB;color:#D97706;border:1px solid rgba(217,119,06,.25);border-radius:8px;cursor:pointer;font-family:inherit;}
.btn-stop:hover{background:#FEF3C7;}
.btn-stop-xs{padding:2px 10px;font-size:11px;background:#FFFBEB;color:#D97706;border:1px solid rgba(217,119,06,.25);border-radius:6px;cursor:pointer;}
.btn-pause-xs{padding:2px 10px;font-size:11px;background:#FFFBEB;color:#D97706;border:1px solid rgba(217,119,06,.25);border-radius:6px;cursor:pointer;font-weight:600;}
.btn-pause-xs:hover{background:#FEF3C7;}
.btn-resume-xs{padding:2px 10px;font-size:11px;background:#0F172A;color:#fff;border:1px solid rgba(15,23,42,.15);border-radius:6px;cursor:pointer;font-weight:600;}
.btn-resume-xs:hover{background:#1E293B;}

.ai-controls{display:flex;align-items:center;gap:10px;margin-top:18px;justify-content:center;}
.btn-pause{padding:6px 18px;font-size:12.5px;background:#FFFBEB;color:#D97706;border:1px solid rgba(217,119,06,.25);border-radius:8px;cursor:pointer;font-family:inherit;font-weight:600;transition:all .25s var(--ease-smooth);}
.btn-pause:hover{background:#FEF3C7;border-color:rgba(217,119,06,.4);}
.btn-resume{padding:6px 18px;font-size:12.5px;background:#0F172A;color:#fff;border:1px solid rgba(15,23,42,.15);border-radius:8px;cursor:pointer;font-family:inherit;font-weight:600;transition:all .25s var(--ease-smooth);animation:pulseResume 1.8s ease-in-out infinite;}
.btn-resume:hover{background:#1E293B;}
@keyframes pulseResume{0%,100%{box-shadow:0 0 0 0 rgba(15,23,42,.15)}50%{box-shadow:0 0 0 6px rgba(15,23,42,0)}}
.paused-badge{font-size:11px;font-weight:700;color:#D97706;background:rgba(255,251,235,.9);border:1px solid rgba(217,119,06,.2);padding:3px 10px;border-radius:100px;letter-spacing:.3px;}

/* ============================================================ EXPERIENCE TRACK TABS */
.track-tabs{display:flex;gap:0;background:rgba(248,250,252,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:14px;padding:4px;position:relative;margin-bottom:28px;width:-webkit-fit-content;border:1px solid rgba(226,232,240,.5);}
.track-tab{display:flex;align-items:center;gap:6px;padding:13px 32px;border-radius:11px;font-size:13.5px;font-weight:600;color:#94A3B8;border:none;background:transparent;cursor:pointer;transition:all .35s var(--ease-expo);font-family:inherit;letter-spacing:.1px;position:relative;z-index:1;}
.track-tab:hover{color:#475569;}
.track-tab.on{color:#0F172A;font-weight:700;background:#fff;box-shadow:0 2px 10px rgba(15,23,42,.06);}
.track-tab-indicator{display:none;}

/* Timeline Entry Stagger Animation */
.timeline-entry{animation:entrySlideIn .5s var(--ease-expo) both;}
@keyframes entrySlideIn{from{opacity:0;transform:translateX(-16px);}to{opacity:1;transform:translateX(0);}}

.experience-content{min-height:200px;}
.exp-track{display:flex;flex-direction:column;gap:4px;}

.add-node{display:flex;align-items:center;justify-content:center;gap:8px;padding:18px;border:2px dashed #E2E8F0;border-radius:14px;font-size:13.5px;font-weight:600;color:#94A3B8;cursor:pointer;transition:all .28s var(--ease-expo);font-family:inherit;margin-top:8px;background:none;width:100%;}
.add-node:hover{border-color:#0F172A;color:#0F172A;background:rgba(15,23,42,.015);}
.add-node--small{padding:10px;width:auto;align-self:flex-start;margin-left:28px;}
.add-node--accent:hover{border-color:#D97706;color:#D97706;background:rgba(217,119,6,.03);}
.add-node--green:hover{border-color:#D97706;color:#D97706;background:rgba(217,119,6,.03);}
.add-node svg{opacity:.5;transition:opacity .2s;}
.add-node:hover svg{opacity:1;}

/* ============================================================ REPORT — BENTO DASHBOARD */
.report-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 28px;gap:20px;}
.rl-spinner{width:36px;height:36px;border:3px solid #E2E8F0;border-top-color:#0F172A;border-radius:50%;animation:rSpin 1s linear infinite;}
@keyframes rSpin{to{transform:rotate(360deg)}}
.report-loading p{font-size:14px;color:#64748B;margin:0;letter-spacing:.2px;}

.bento{display:grid;grid-template-columns:1.4fr 1fr;grid-template-rows:auto auto auto auto;gap:18px;animation:bentoReveal .6s var(--ease-expo) both;}
@keyframes bentoReveal{from{opacity:0;transform:translateY(16px) scale(.995);}to{opacity:1;transform:translateY(0) scale(1);}}

.bt-score{grid-column:1;grid-row:1;background:linear-gradient(148deg,#0F172A,#1E293B);border-radius:22px;padding:48px 36px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;min-height:240px;color:#fff;}
.bt-score::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 30%,rgba(217,119,6,.1),transparent 60%);pointer-events:none;}
.bts-glow{position:absolute;width:200px;height:200px;background:radial-gradient(circle,rgba(217,119,6,.18),transparent 70%);top:-40px;right:-40px;filter:blur(40px);pointer-events:none;}
.bts-inner{display:flex;align-items:baseline;gap:4px;position:relative;z-index:1;}
.bts-val{font-size:clamp(48px,7vw,72px);font-weight:900;color:#fff;letter-spacing:-3px;line-height:1;font-variant-numeric:tabular-nums;}
.bts-unit{font-size:clamp(16px,1.8vw,22px);font-weight:500;color:rgba(255,255,255,.5);margin-left:4px;}
.bts-label{font-size:14px;color:rgba(255,255,255,.55);margin-top:14px;font-weight:500;letter-spacing:.5px;position:relative;z-index:1;}
.bts-bar{width:180px;height:4px;background:rgba(255,255,255,.1);border-radius:2px;margin:22px auto 0;overflow:hidden;position:relative;z-index:1;}
.bts-bar-fill{height:100%;background:linear-gradient(90deg,#D97706,#F59E0B);border-radius:2px;transition:width 1.2s var(--ease-qout);position:relative;}
.bts-bar-fill::after{content:'';position:absolute;right:0;top:50%;transform:translateY(-50%) translateX(50%);width:8px;height:8px;border-radius:50%;background:#D97706;box-shadow:0 0 14px rgba(217,119,6,.4);}

.bt-ai{grid-column:2;grid-row:1/span 2;border:1px solid #E2E8F0;border-radius:20px;overflow:hidden;transition:all .4s var(--ease-expo);background:#fff;display:flex;flex-direction:column;}
.bt-ai.busy{border-color:#D97706;box-shadow:0 0 0 3px rgba(217,119,6,.05),0 6px 24px rgba(217,119,6,.07);}
.bt-ai.done{border-color:#0F172A;box-shadow:0 4px 18px rgba(15,23,42,.045);}
.bt-ai.err{border-color:#D97706;box-shadow:0 0 0 3px rgba(217,119,6,.05);}
.bta-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;cursor:pointer;user-select:none;background:linear-gradient(135deg,#F8FAFC,#fff);transition:background .25s;border-bottom:1px solid transparent;flex-shrink:0;}
.bta-head:hover{background:#F1F5F9;}
.bta-left{display:flex;align-items:center;gap:9px;font-size:14.5px;font-weight:650;color:#0F172A;letter-spacing:-.2px;}
.bta-icon svg{color:#0F172A;opacity:.5;flex-shrink:0;}
.bta-right{display:flex;align-items:center;gap:7px;}
.bta-toggle{font-size:10.5px;font-weight:650;color:#94A3B8;padding:3px 9px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:5px;letter-spacing:.3px;}
.bta-toggle.sm{font-size:9.5px;padding:2px 7px;}
.bta-chevron{color:#94A3B8;transition:transform .35s var(--ease-expo);}
.bta-chevron.open{transform:rotate(180deg);}
.bta-body{padding:18px;flex:1;overflow-y:auto;}

.ai-thinking{text-align:center;padding:42px 18px;background:linear-gradient(135deg,#FFFBEB,rgba(254,243,199,.4));border-radius:13px;border:1px solid rgba(217,119,6,.1);}
.at-dots{display:flex;justify-content:center;gap:8px;margin-bottom:16px;}
.at-dots span{width:10px;height:10px;background:#D97706;border-radius:50%;opacity:.4;animation:dPulse 1.4s ease-in-out infinite;}
.at-dots span:nth-child(1){animation-delay:-.32s}.at-dots span:nth-child(2){animation-delay:-.16s}
@keyframes dPulse{0,80%,100%{opacity:.4;transform:scale(.85)}40%{opacity:1;transform:scale(1.15)}}
.at-text{font-size:14.5px;font-weight:700;color:#D97706;margin:0 0 5px;letter-spacing:-.2px;}
.at-hint{font-size:12.5px;color:#D97706;opacity:.55;margin:0;}

.reason-box{border:1px solid #EEF0F3;border-radius:11px;overflow:hidden;margin-bottom:12px;background:#fff;}
.rb-header{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;cursor:pointer;background:rgba(217,119,06,.08);font-size:12.5px;font-weight:600;color:#92400E;transition:background .2s;user-select:none;}
.rb-header:hover{background:rgba(217,119,06,.14);}
.rb-header span:first-child{display:flex;align-items:center;gap:5px;}
.rb-content{padding:14px;background:#F8FAFC;border-top:1px solid #EEF0F3;max-height:340px;overflow-y:auto;font-size:12.5px;line-height:1.75;color:#475569;white-space:pre-wrap;word-break:break-word;}
.rb-content::-webkit-scrollbar{width:4px}.rb-content::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:2px}

.content-box{border:1px solid #EEF0F3;border-radius:11px;overflow:hidden;background:#fff;}
.cb-header{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;cursor:pointer;background:rgba(15,23,42,.05);font-size:12.5px;font-weight:600;color:#0F172A;transition:background .2s;user-select:none;}
.cb-header:hover{background:rgba(15,23,42,.1);}
.cb-header span:first-child{display:flex;align-items:center;gap:5px;}
.cb-content{padding:18px;background:#fff;border-top:1px solid #EEF0F3;min-height:150px;position:relative;}

.err-box{text-align:center;padding:28px 18px;}
.eb-title{font-size:14.5px;font-weight:600;color:#D97706;margin:0 0 6px;}
.eb-msg{font-size:12.5px;color:#64748B;margin:0 0 14px;}

.bt-stat{background:#FAFBFC;border:1px solid #EEF0F3;border-radius:16px;padding:24px 26px;transition:all .35s var(--ease-expo);position:relative;overflow:hidden;}
.bt-stat::before{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#0F172A,transparent);opacity:0;transition:opacity .35s;}
.bt-stat:hover{box-shadow:0 8px 28px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.025);border-color:#E2E8F0;transform:translateY(-3px);}
.bt-stat:hover::before{opacity:.5;}
.bs-icon{margin-bottom:12px;color:#94A3B8;}
.bs-icon svg{opacity:.5;}
.bs-value{font-size:27px;font-weight:800;color:#0F172A;font-variant-numeric:tabular-nums;letter-spacing:-1px;margin-bottom:8px;}
.bs-grade{font-size:11.5px;font-weight:600;padding:3px 10px;border-radius:5px;margin-left:8px;vertical-align:middle;letter-spacing:.3px;}
.g-excellent{background:#F8FAFC;color:#0F172A;}.g-good{background:#F1F5F9;color:#334155;}.g-medium{background:#FFFBEB;color:#D97706;}.g-pass{background:#FFFBEB;color:#D97706;}.g-low{background:#FFFBEB;color:#D97706;}
.bs-note{font-size:12.5px;color:#64748B;line-height:1.6;margin:0;}

.bt-radar{grid-column:1/-1;background:linear-gradient(145deg,#FAFBFC,#F1F5F9);border:1px solid #EEF0F3;border-radius:20px;padding:24px;position:relative;overflow:hidden;}
.bt-radar::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:30%;height:1px;background:linear-gradient(90deg,transparent,#E2E8F0,transparent);}
.radar-canvas{height:320px;}

.bt-detail{grid-column:1/-1;background:#fff;border:1px solid #EEF0F3;border-radius:16px;padding:28px;}
.bd-heading{font-size:15px;font-weight:760;color:#0F172A;margin:0 0 22px;letter-spacing:-.3px;padding-bottom:14px;border-bottom:1px solid #F1F5F9;}
.bd-item{padding:16px 20px;margin-bottom:10px;background:linear-gradient(135deg,#F8FAFC,#fff);border-radius:11px;border-left:3px solid #0F172A;transition:all .3s ease;}
.bd-item:last-child{margin-bottom:0;}
.bd-item:hover{box-shadow:0 3px 14px rgba(0,0,0,.045);transform:translateX(3px);}
.bd-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;}
.bd-name{font-size:13px;font-weight:680;color:#0F172A;letter-spacing:-.1px;}
.bd-val{font-size:20px;font-weight:800;color:#0F172A;font-variant-numeric:tabular-nums;letter-spacing:-.8px;}
.bd-max{font-size:12.5px;color:#94A3B8;font-weight:500;}
.bd-track{width:100%;height:4px;background:#F1F5F9;border-radius:2px;overflow:hidden;margin-bottom:8px;}
.bd-fill{height:100%;background:linear-gradient(90deg,#0F172A,#334155);border-radius:2px;transition:width 1s var(--ease-qout);position:relative;}
.bd-fill::after{content:'';position:absolute;right:0;top:50%;transform:translateY(-50%);width:7px;height:7px;border-radius:50%;background:#0F172A;box-shadow:0 0 8px rgba(15,23,42,.18);}
.bd-text{font-size:11.5px;color:#94A3B8;margin:0;line-height:1.6;}

.report-actions{display:flex;justify-content:center;gap:14px;margin-top:40px;padding-top:24px;border-top:1px solid #F1F5F9;}

/* Markdown */
.ai-md{line-height:1.85;color:#0F172A;}
.ai-md :deep(h1){font-size:19px;font-weight:800;color:#0F172A;margin:0 0 14px;padding-bottom:10px;border-bottom:2px solid #E2E8F0;letter-spacing:-.4px;}
.ai-md :deep(h2){font-size:16px;font-weight:700;color:#0F172A;margin:22px 0 10px;letter-spacing:-.3px;padding-left:13px;position:relative;}
.ai-md :deep(h2)::before{content:'';position:absolute;left:0;top:4px;bottom:4px;width:3px;background:#D97706;border-radius:2px;}
.ai-md :deep(h3){font-size:14.5px;font-weight:650;color:#475569;margin:18px 0 8px;letter-spacing:-.2px;}
.ai-md :deep(p){margin:0 0 11px;line-height:1.8;}
.ai-md :deep(ul),.ai-md :deep(ol){margin:11px 0;padding-left:20px;}
.ai-md :deep(li){margin-bottom:5px;line-height:1.7;}
.ai-md :deep(li::marker){color:#94A3B8;}
.ai-md :deep(strong){color:#0F172A;font-weight:700;}
.ai-md :deep(code){background:#F1F5F9;padding:2px 7px;border-radius:5px;font-family:var(--font-family-mono);font-size:12px;color:#334155;border:1px solid #EEF0F3;}
.ai-md :deep(blockquote){border-left:3px solid #0F172A;padding:11px 16px;margin:14px 0;color:#475569;font-style:italic;background:#F8FAFC;border-radius:0 8px 8px 0;font-size:13.5px;}
.cursor-blink{display:inline-block;width:2px;height:17px;background:#0F172A;margin-left:4px;vertical-align:middle;animation:cBlink 1s steps(1) infinite;}
@keyframes cBlink{0,50%{opacity:1}51%,100%{opacity:0}}

/* ============================================================ ELEMENT PLUS DEEP OVERRIDES — AMBER FOCUS GLOW */
:deep(.el-input__wrapper),:deep(.el-textarea__inner){border-radius:11px!important;padding:5px 15px!important;transition:all .35s var(--ease-expo)!important;box-shadow:0 0 0 1.5px #E2E8F0 inset!important;background:#fff!important;}
:deep(.el-input__wrapper:hover),:deep(.el-textarea__inner:hover){box-shadow:0 4px 16px rgba(15,23,42,.05),0 0 0 1.5px #CBD5E1 inset!important;}
:deep(.el-input__wrapper:focus-within),:deep(.el-textarea__inner:focus){box-shadow:0 0 0 3px rgba(217,119,06,.08),0 6px 24px rgba(217,119,06,.12),0 0 0 2px #D97706 inset!important;border-color:#D97706!important;}
:deep(.el-select .el-input__wrapper:focus-within){box-shadow:0 0 0 3px rgba(217,119,06,.08),0 6px 24px rgba(217,119,06,.12),0 0 0 2px #D97706 inset!important;border-color:#D97706!important;}
:deep(.el-input__inner){font-size:14.5px!important;}
:deep(.el-form-item__label){font-size:11.5px!important;font-weight:650!important;color:#64748B!important;padding-bottom:6px!important;letter-spacing:.3px!important;}
:deep(.el-form-item){margin-bottom:0!important;}
:deep(.el-select){width:100%;}
:deep(.el-select .el-input__wrapper){border-radius:11px!important;padding:5px 15px!important;box-shadow:0 0 0 1px #E2E8F0 inset!important;background:#fff!important;transition:all .28s var(--ease-expo)!important;}
:deep(.el-select .el-input__wrapper:hover){box-shadow:0 4px 16px rgba(15,23,42,.05),0 0 0 1.5px #CBD5E1 inset!important;}
:deep(.el-select .el-input__inner){font-size:14.5px!important;}
:deep(.el-select-dropdown){border-radius:14px!important;box-shadow:0 12px 38px rgba(0,0,0,.09)!important;border:1px solid #EEF0F3!important;}
:deep(.el-input-number){width:100%;}
:deep(.el-input-number .el-input__wrapper){height:40px!important;box-sizing:border-box!important;}
:deep(.el-input-number .el-input__inner){text-align:left!important;padding-right:36px!important;height:28px!important;line-height:28px!important;}
:deep(.el-input-number__decrease),:deep(.el-input-number__increase){background:transparent!important;border:none!important;color:#94A3B8!important;}

:deep(.el-dialog){border-radius:22px!important;box-shadow:0 28px 64px rgba(0,0,0,.11),0 1px 3px rgba(0,0,0,.05)!important;border:1px solid #EEF0F3!important;overflow:hidden;}
:deep(.el-dialog__header){padding:24px 28px 16px!important;border-bottom:1px solid #F1F5F9;margin-right:0!important;}
:deep(.el-dialog__title){font-size:16.5px!important;font-weight:750!important;color:#0F172A!important;letter-spacing:-.3px!important;}
:deep(.el-dialog__body){padding:24px 28px!important;}
:deep(.el-dialog__footer){padding:16px 28px 24px!important;border-top:1px solid #F1F5F9;display:flex!important;justify-content:flex-end!important;gap:10px!important;}

.dlg-form :deep(.el-form-item){margin-bottom:16px!important;}

:deep(.el-dropdown-menu__item.is-active){color:#0F172A!important;background:#F8FAFC!important;font-weight:600!important;}
:deep(.el-dropdown-menu){border-radius:14px!important;box-shadow:0 10px 28px rgba(0,0,0,.07)!important;border:1px solid #EEF0F3!important;padding:5px!important;}
:deep(.el-dropdown-menu__item){border-radius:8px!important;padding:7px 13px!important;margin:2px 0!important;}

/* ============================================================ RESPONSIVE */
@media(max-width:1100px){
  .chapters{max-width:680px;padding:0 24px 100px;}
  .identity-card{padding:32px 28px;}
  .id-gpa{flex-direction:column;text-align:center;gap:20px;}
  .gpa-quick{justify-content:center;}
}

@media(max-width:960px){
  .hero{min-height:85svh;}
  .hero-inner{padding:56px 24px 44px;}
  .ht-line--1,.ht-line--2{font-size:clamp(3rem,14vw,5.5rem);}
  .chapters{padding:0 24px 80px;}
  .orbit--hidden{display:none;}
  .bento{grid-template-columns:1fr;}
  .bt-score{grid-column:1;}.bt-ai{grid-column:1;grid-row:auto;}.bt-radar{grid-column:1;}.bt-detail{grid-column:1;}
  .id-chips{grid-template-columns:1fr;}.chapter-title{font-size:22px;}
  .identity-card{padding:28px 24px;}
  .gpa-svg{width:100px;height:100px;}
  .gpa-val-text{font-size:22px;}
  .track-tabs{width:100%;}
  .track-tab{flex:1;text-align:center;padding:10px 12px;font-size:12px;}
  .track-tab svg{display:none;}
  .report-actions{flex-direction:column;}
}

@media(max-width:640px){
  .hero{min-height:78svh;}
  .hero-inner{padding:40px 18px 36px;}
  .ht-line--1,.ht-line--2{font-size:clamp(2.4rem,14vw,3.8rem);}
  .hero-sub{font-size:14.5px;}
  .hero-metric{flex-direction:column;gap:12px;padding:14px 24px;border-radius:16px;}
  .hm-div{width:40px;height:1px;}
  .chapters{padding:0 18px 64px;}
  .chapter{padding:52px 0 0;}
  .chapter-header{flex-direction:column;gap:8px;}
  .chapter-title{font-size:20px;}
  .identity-card{padding:22px 18px;}
  .name-input :deep(.el-input__inner){font-size:17px!important;}
  .id-gpa{padding:24px 20px;}
  .gpa-val-text{font-size:20px;}
  .gpa-info{align-items:center;text-align:center;}
  .id-lang{flex-direction:column;gap:8px;padding:12px;}
  .id-lang-hint{text-align:center;}
  .chapter-action{flex-direction:column;gap:12px;}.chapter-action--split{flex-direction:column;}.sa-right{width:100%;justify-content:stretch;}
  .timeline-entry{flex-direction:column;align-items:flex-start;gap:10px;}.te-del{margin-left:0;width:100%;justify-content:flex-end;opacity:1;}
  .bento{gap:14px;}.bt-score{padding:32px 22px;min-height:200px;}.bts-val{font-size:44px;}.radar-canvas{height:250px;}.bt-detail{padding:20px;}
  .hero-ring{display:none;}.hero-line-art{display:none;}
  .inline-row{flex-direction:column;}
  .btn-primary--wide{max-width:100%;}

  /* Reveal Moment Responsive */
  .score-hero{padding:48px 24px;border-radius:18px;}
  .score-val{font-size:clamp(44px,14vw,72px);}
  .score-max{font-size:clamp(18px,4vw,26px);}
  .score-label{font-size:11px;letter-spacing:2px;margin-bottom:18px;}
  .score-comment{font-size:14px;}
  .score-bar{max-width:280px;}

  .stage-title{font-size:16px;}
  .radar-canvas--reveal{min-height:300px;padding:16px;border-radius:14px;}

  .dim-grid{grid-template-columns:1fr;gap:14px;}
  .dim-card{padding:18px;border-radius:12px;}
  .dim-score{font-size:20px;}

  .quick-stats{grid-template-columns:1fr;gap:12px;}
  .qs-card{padding:16px;border-radius:12px;}
  .qs-value{font-size:20px;}

  .ap-head{padding:16px 18px;}
  .ap-title{font-size:15px;}

  .report-actions--fab{bottom:20px;right:20px;gap:10px;}
  .fab-save,.fab-reset{width:46px;height:46px;border-radius:12px;}
}

/* ═══════════════ IMMERSIVE CTA ═══════════════ */
.cta-immersive {
  position: relative;
  margin: 80px 0 60px;
  padding: 60px 40px;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border-radius: 24px;
  overflow: hidden;
  text-align: center;
}

.cta-inner {
  position: relative;
  z-index: 2;
  max-width: 640px;
  margin: 0 auto;
}

.cta-content {
  margin-bottom: 36px;
}

.cta-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 0 0 12px;
  font-size: 26px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.cta-title svg {
  flex-shrink: 0;
  color: #D97706;
}

.cta-desc {
  margin: 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.6;
}

.cta-provider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

.cta-provider-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  letter-spacing: 0.02em;
}

.btn-provider-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}

.btn-provider-cta:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.btn-generate {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 400px;
  padding: 18px 36px;
  background: linear-gradient(135deg, #D97706 0%, #B45309 100%);
  border: none;
  border-radius: 14px;
  color: #FFFFFF;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 4px 20px rgba(217, 119, 6, 0.35),
    0 0 0 0 rgba(217, 119, 6, 0);
  will-change: transform, box-shadow;
}

.btn-generate:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow:
    0 8px 32px rgba(217, 119, 6, 0.45),
    0 0 0 4px rgba(217, 119, 6, 0.12);
}

.btn-generate:active:not(:disabled) {
  transform: translateY(-1px) scale(0.99);
}

.btn-generate:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-generate__loading {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.cta-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 16px 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.5;
}

.cta-hint svg {
  flex-shrink: 0;
  opacity: 0.7;
}

.cta-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.15) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: ctaPulse 4s ease-in-out infinite;
}

@keyframes ctaPulse {
  0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
}

/* ═══════════════ REVEAL MOMENT — STAGE CONTAINERS ═══════════════ */
.reveal-stage {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.reveal-stage.is-revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ═══ STAGE ①: SCORE HERO ═══ */
.score-hero {
  position: relative;
  padding: 72px 48px;
  background: linear-gradient(145deg, #0F172A 0%, #1E293B 100%);
  border-radius: 24px;
  overflow: hidden;
  text-align: center;
}

.score-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.18) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: scoreGlow 4s ease-in-out infinite;
}

@keyframes scoreGlow {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.15); }
}

.score-inner {
  position: relative;
  z-index: 2;
}

.score-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 24px;
  font-family: var(--font-family-mono);
}

.score-number {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
  margin-bottom: 28px;
}

.score-val {
  font-size: clamp(56px, 10vw, 96px);
  font-weight: 900;
  color: #FFFFFF;
  line-height: 1;
  letter-spacing: -0.04em;
  font-family: var(--font-family-mono);
}

.score-max {
  font-size: clamp(20px, 3vw, 32px);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.35);
}

.score-bar {
  max-width: 400px;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 0 auto 28px;
  overflow: hidden;
}

.score-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #D97706, #F59E0B);
  border-radius: 4px;
  transition: width 1.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.score-comment {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

/* ═══ STAGE ②: RADAR ═══ */
.stage-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 24px;
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.01em;
}

.stage-title svg {
  color: #D97706;
  flex-shrink: 0;
}

.radar-canvas--reveal {
  min-height: 380px;
  background: #F8FAFC;
  border-radius: 18px;
  border: 1px solid #E2E8F0;
  padding: 20px;
  transition: min-height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ═══ STAGE ③: DIMENSION GRID ═══ */
.dim-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
  margin-bottom: 36px;
}

.dim-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 24px;
  opacity: 0;
  transform: translateY(20px) scale(0.97);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: var(--dim-delay, 0ms);
  will-change: opacity, transform;
}

.dim-card.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.dim-card:hover {
  border-color: rgba(15, 23, 42, 0.12);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.06);
  transform: translateY(-4px) scale(1.01);
  transition-delay: 0ms;
}

.dim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.dim-name {
  font-size: 15px;
  font-weight: 600;
  color: #0F172A;
}

.dim-score {
  font-size: 22px;
  font-weight: 800;
  color: #0F172A;
  font-family: var(--font-family-mono);
}

.dim-max {
  font-size: 13px;
  font-weight: 500;
  color: #94A3B8;
}

.dim-track {
  height: 8px;
  background: #F1F5F9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.dim-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--dim-delay, 0ms);
}

.dim-fill--academic { background: linear-gradient(90deg, #0F172A, #334155); }
.dim-fill--language { background: linear-gradient(90deg, #D97706, #F59E0B); }
.dim-fill--research { background: linear-gradient(90deg, #0F172A, #334155); }
.dim-fill--practice { background: linear-gradient(90deg, #D97706, #F59E0B); }

.dim-comment {
  margin: 0;
  font-size: 13px;
  color: #64748B;
  line-height: 1.55;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 8px;
}

.qs-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.qs-card:hover {
  border-color: rgba(15, 23, 42, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.qs-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.05);
  border-radius: 10px;
  color: #0F172A;
}

.qs-body {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.qs-value {
  font-size: 22px;
  font-weight: 800;
  color: #0F172A;
  font-family: var(--font-family-mono);
}

.qs-grade {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.06);
  color: #64748B;
}

.qs-note {
  margin: 6px 0 0;
  font-size: 13px;
  color: #64748B;
  line-height: 1.5;
}

/* ═══ STAGE ④: AI PANEL ═══ */
.ai-panel {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ai-panel:hover {
  border-color: rgba(15, 23, 42, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.ap-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  cursor: pointer;
  transition: background 0.25s;
  user-select: none;
}

.ap-head:hover {
  background: rgba(248, 250, 252, 0.7);
}

.ap-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ap-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.1), rgba(217, 119, 6, 0.05));
  border-radius: 8px;
  color: #D97706;
}

.ap-title {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
}

.ap-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: rgba(217, 119, 6, 0.1);
  color: #D97706;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.ap-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ap-toggle {
  font-size: 13px;
  font-weight: 500;
  color: #94A3B8;
  transition: color 0.25s;
}

.ap-head:hover .ap-toggle {
  color: #64748B;
}

.ap-chevron {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: #94A3B8;
}

.ap-chevron.open {
  transform: rotate(180deg);
}

.ap-body {
  border-top: 1px solid #F1F5F9;
}

/* FAB Actions */
.report-actions--fab {
  position: fixed;
  bottom: 32px;
  right: 32px;
  display: flex;
  gap: 12px;
  z-index: 40;
}

.fab-save,
.fab-reset {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  will-change: transform;
}

.fab-save {
  background: linear-gradient(135deg, #0F172A, #1E293B);
  color: #FFFFFF;
}

.fab-save:hover {
  transform: translateY(-4px) scale(1.08);
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.25);
}

.fab-reset {
  background: #FFFFFF;
  color: #64748B;
  border: 1px solid #E2E8F0;
}

.fab-reset:hover {
  transform: translateY(-4px) scale(1.08);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
  color: #0F172A;
  border-color: #CBD5E1;
}

/* Responsive */
@media (max-width: 767px) {
  .cta-immersive {
    margin: 48px 0 36px;
    padding: 40px 24px;
    border-radius: 18px;
  }

  .cta-title {
    font-size: 20px;
    gap: 10px;
  }

  .cta-title svg {
    width: 22px;
    height: 22px;
  }

  .cta-desc {
    font-size: 14px;
  }

  .btn-generate {
    font-size: 15px;
    padding: 16px 28px;
    max-width: 100%;
  }

  .cta-provider {
    flex-direction: column;
    gap: 8px;
  }
}

@media(prefers-reduced-motion:reduce){*{animation:none!important;transition-duration:.01ms!important;}}
</style>
