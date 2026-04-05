<template>
  <div class="ap">
    <div class="ap-noise" />

    <!-- ═══════════════ HERO — Full Immersive ═══════════════ -->
    <section class="hero">
      <div class="hero-canvas">
        <div class="hero-grid" />
        <div class="hero-orb hero-orb--a" />
        <div class="hero-orb hero-orb--b" />
        <div class="hero-ring hero-ring--1" />
        <div class="hero-ring hero-ring--2" />
        <div class="hero-line-art">
          <svg viewBox="0 0 200 200" fill="none"><path d="M100 0L200 100L100 200L0 100Z" stroke="rgba(15,23,42,.08)" stroke-width=".5"/><path d="M100 30L170 100L100 170L30 100Z" stroke="rgba(217,119,6,.1)" stroke-width=".7"/></svg>
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
        <p class="hero-sub">AI 智能解析背景，为你生成专属留学路线图</p>
        <div class="hero-metric">
          <div class="hm-item"><span class="hm-n">55+</span><span class="hm-l">精选院校</span></div>
          <div class="hm-div" /><div class="hm-item"><span class="hm-n">6</span><span class="hm-l">核心场景</span></div>
          <div class="hm-div" /><div class="hm-item"><span class="hm-n">AI</span><span class="hm-l">智能协同</span></div>
        </div>
      </div>

      <div class="hero-scroll-hint">
        <div class="hsh-line" /><span>向下滚动</span>
      </div>

      <div class="hero-bottom-fade" />
    </section>

    <!-- ═══════════════ STEPPER NAV ═══════════════ -->
    <nav class="stepper" :class="'st--'+currentStep">
      <div class="st-track">
        <template v-for="(s,i) in steps" :key="i">
          <button class="st-node" :class="{ done:i<currentStep, active:i===currentStep, wait:i>currentStep }" @click="jumpToStep(i)">
            <span class="st-num"><svg v-if="i<currentStep" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><template v-else>{{ i+1 }}</template></span>
            <span class="st-txt">{{ s.label }}</span>
          </button>
          <div v-if="i<steps.length-1" class="st-conn"><div class="st-conn-fill" :style="{width: i<currentStep ? '100%' : '0%'}" /></div>
        </template>
      </div>
    </nav>

    <!-- ═══════════════ MAIN CONTENT ═══════════════ -->
    <main class="main">

      <!-- ─── STEP 0: 基本信息 ─── -->
      <section v-show="currentStep===0" class="step step--basic">
        <div class="step-deco">
          <span class="sd-num">01</span>
          <div class="sd-bar" />
        </div>

        <!-- Name: Hero Input -->
        <div class="name-block">
          <label class="nb-label">你的姓名</label>
          <el-form ref="basicFormRef" :model="form.basic" :rules="basicRules" label-position="top" class="nb-form">
            <el-form-item prop="name">
              <el-input v-model="form.basic.name" placeholder="输入姓名..." size="large" class="name-input" />
            </el-form-item>
          </el-form>
          <p class="nb-hint">用于生成个性化评估报告</p>
        </div>

        <!-- Two-col row: Age + University -->
        <div class="row-2">
          <div class="field-block fb-left">
            <label class="fb-label">年龄</label>
            <el-input-number v-model="form.basic.age" :min="16" :max="50" controls-position="right" size="large" style="width:100%" />
          </div>
          <div class="field-block fb-right">
            <label class="fb-label">在读院校类型</label>
            <el-select v-model="form.basic.university" placeholder="选择院校" size="large" style="width:100%">
              <el-option label="985 院校" value="985" />
              <el-option label="211 院校" value="211" />
              <el-option label="普通本科" value="regular" />
              <el-option label="海外院校" value="overseas" />
            </el-select>
          </div>
        </div>

        <!-- GPA: The Visual Centerpiece -->
        <div class="gpa-block">
          <div class="gb-top">
            <div class="gb-info">
              <label class="fb-label">GPA 绩点</label>
              <p class="gb-desc">4.0 满分制，拖动滑块调整</p>
            </div>
            <div class="gb-display">
              <span class="gb-num">{{ form.basic.gpa.toFixed(1) }}</span>
              <span class="gb-max">/ 4.0</span>
            </div>
          </div>
          <div class="gb-slider-wrap">
            <el-slider v-model="form.basic.gpa" :min="0" :max="4" :step="0.1" :show-tooltip="true" />
          </div>
          <div class="gb-scale">
            <span>0</span><span>1.0</span><span>2.0</span><span>3.0</span><span>4.0</span>
          </div>
        </div>

        <!-- Language -->
        <div class="lang-block">
          <label class="fb-label">语言成绩</label>
          <el-input v-model="form.basic.language" placeholder="如：雅思 7.0 / 托福 100" size="large" />
          <p class="lb-hint">填写已获得的语言考试成绩，留空则不纳入评估</p>
        </div>

        <div class="step-action">
          <button class="btn-primary" @click="nextStep">
            开始学术评估
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      <!-- ─── STEP 1: 学术背景 ─── -->
      <section v-show="currentStep===1" class="step step--academic">
        <div class="step-deco">
          <span class="sd-num">02</span>
          <div class="sd-bar" />
        </div>
        <h2 class="step-title">学术背景</h2>

        <!-- Degree: Large Pill Row -->
        <div class="degree-row">
          <label class="fb-label">学历层次</label>
          <div class="deg-pills">
            <button v-for="d in ['本科','硕士','博士']" :key="d" class="deg-pill" :class="{ active: form.academic.degree === d }" @click="form.academic.degree = d">{{ d }}</button>
          </div>
        </div>

        <!-- Majors: Tag Cloud -->
        <div class="major-row">
          <label class="fb-label">专业方向（可多选）</label>
          <div class="tag-cloud">
            <button v-for="m in ['理工','商科','人文','社科','艺术']" :key="m" class="tc-tag" :class="{ on: form.academic.majors.includes(m) }" @click="toggleMajor(m)">{{ m }}</button>
          </div>
        </div>

        <!-- Score -->
        <div class="field-block" style="margin-bottom:28px;">
          <label class="fb-label">均分</label>
          <div class="score-inline">
            <el-input-number v-model="form.academic.averageScore" :min="0" :max="100" controls-position="right" size="large" style="flex:1" />
            <span class="si-suffix">/ 100</span>
          </div>
        </div>

        <!-- Research: Full-width list area -->
        <div class="research-area">
          <div class="ra-head">
            <label class="fb-label" style="margin:0;">科研经历</label>
            <button class="btn-add-row" @click="openResearchDialog">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              添加经历
            </button>
          </div>
          <div v-if="form.academic.research.length === 0" class="empty-note">暂无科研记录</div>
          <div v-for="(item,idx) in form.academic.research" :key="idx" class="res-entry">
            <div class="re-main"><strong>{{ item.name }}</strong><span class="re-meta">{{ item.role }} · {{ item.duration }}</span></div>
            <div class="re-btns">
              <button class="btn-tiny" @click="editResearch(idx)">编辑</button>
              <button class="btn-tiny btn-tiny--del" @click="removeResearch(idx)">删除</button>
            </div>
          </div>
        </div>

        <div class="step-action step-action--split">
          <button class="btn-ghost" @click="prevStep">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            返回
          </button>
          <button class="btn-primary" @click="nextStep">
            下一步：实践经历
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      <!-- ─── STEP 2: 实践经历 ─── -->
      <section v-show="currentStep===2" class="step step--practice">
        <div class="step-deco">
          <span class="sd-num">03</span>
          <div class="sd-bar" />
        </div>
        <h2 class="step-title">实践经历</h2>

        <div class="prac-tabs">
          <button v-for="t in [{k:'internship',l:'实习'},{k:'competition',l:'竞赛'},{k:'volunteer',l:'志愿'}]" :key="t.k" class="pt-tab" :class="{ on: practiceTab === t.k }" @click="practiceTab = t.k">{{ t.l }}</button>
        </div>

        <!-- Internship Tab -->
        <div v-show="practiceTab==='internship'" class="tab-content">
          <button class="btn-add-row" @click="openInternshipDialog">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            添加实习经历
          </button>
          <div v-if="form.practice.internships.length===0" class="empty-note">暂无实习记录</div>
          <div v-for="(item,idx) in form.practice.internships" :key="'i'+idx" class="res-entry">
            <div class="re-main">
              <div class="re-head"><strong>{{ item.company }}</strong><span class="tag-mini">{{ item.position }}</span></div>
              <span class="re-meta">{{ item.duration }}<template v-if="item.description"> · {{ item.description }}</template></span>
            </div>
            <div class="re-btns">
              <button class="btn-tiny" @click="editInternship(idx)">编辑</button>
              <button class="btn-tiny btn-tiny--del" @click="deleteInternship(idx)">删除</button>
            </div>
          </div>
        </div>

        <!-- Competition Tab -->
        <div v-show="practiceTab==='competition'" class="tab-content">
          <button class="btn-add-row" @click="openCompetitionDialog">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            添加竞赛获奖
          </button>
          <div v-if="form.practice.competitions.length===0" class="empty-note">暂无竞赛记录</div>
          <div v-for="(item,idx) in form.practice.competitions" :key="'c'+idx" class="res-entry">
            <div class="re-main">
              <div class="re-head"><strong>{{ item.name }}</strong><span class="tag-mini" :class="'tm-'+getAwardLevelType(item.level)">{{ item.level }}</span></div>
              <span class="re-meta">🏆 {{ item.award }}<template v-if="item.time"> · {{ item.time }}</template></span>
            </div>
            <div class="re-btns">
              <button class="btn-tiny" @click="editCompetition(idx)">编辑</button>
              <button class="btn-tiny btn-tiny--del" @click="deleteCompetition(idx)">删除</button>
            </div>
          </div>
        </div>

        <!-- Volunteer Tab -->
        <div v-show="practiceTab==='volunteer'" class="tab-content">
          <button class="btn-add-row" @click="openVolunteerDialog">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            添加志愿服务
          </button>
          <div v-if="form.practice.volunteers.length===0" class="empty-note">暂无志愿服务记录</div>
          <div v-for="(item,idx) in form.practice.volunteers" :key="'v'+idx" class="res-entry">
            <div class="re-main">
              <div class="re-head"><strong>{{ item.organization }}</strong><span class="tag-mini tm-ok">{{ item.role }}</span></div>
              <span class="re-meta">{{ item.duration }}<template v-if="item.description"> · {{ item.description }}</template></span>
            </div>
            <div class="re-btns">
              <button class="btn-tiny" @click="editVolunteer(idx)">编辑</button>
              <button class="btn-tiny btn-tiny--del" @click="deleteVolunteer(idx)">删除</button>
            </div>
          </div>
        </div>

        <div class="step-action step-action--split">
          <button class="btn-ghost" @click="prevStep">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            返回
          </button>
          <div class="sa-right">
            <div v-if="providers.length > 0" class="provider-sel">
              <el-dropdown trigger="click" @command="(cmd) => selectedProvider = cmd">
                <button class="btn-provider">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/></svg>
                  {{ currentProviderName }}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="p in providers" :key="p.id" :command="p.id" :class="{ 'is-active': selectedProvider === p.id }">{{ p.name }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <button v-else class="btn-config" @click="router.push('/ai-config')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
              配置 AI
            </button>
            <button class="btn-primary" :disabled="_btnDisabled" @click="generateReport">
              <svg v-if="!_btnDisabled" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              {{ _btnDisabled ? 'AI 分析中...' : '生成报告' }}
            </button>
          </div>
        </div>
      </section>

      <!-- ─── STEP 3: 报告 ═══════════════ -->
      <section v-show="currentStep===3" class="step step--report">

        <!-- Loading State -->
        <div v-if="aiStream.isConnecting && !aiStream.hasContent" class="report-loading">
          <div class="rl-spinner" />
          <p>{{ activeStream.waitingText || '正在连接 AI 服务...' }}</p>
        </div>

        <template v-if="!aiStream.isConnecting || aiStream.hasContent">
          <!-- Bento Dashboard -->
          <div class="bento">

            <!-- Score Hero -->
            <div class="bt-score">
              <div class="bts-glow" />
              <div class="bts-inner">
                <span class="bts-val">{{ animatedScore }}</span>
                <span class="bts-unit">/ 5.0</span>
              </div>
              <p class="bts-label">竞争力总分</p>
              <div class="bts-bar"><div class="bts-bar-fill" :style="{ width: (overallScore / 5 * 100) + '%' }" /></div>
            </div>

            <!-- AI Analysis Card -->
            <div class="bt-ai" :class="{ busy: aiStream.isLoading, done: aiStream.content && !aiStream.isLoading, err: aiStream.error, idle: !aiStream.isLoading && !aiStream.content && !aiStream.error }">
              <div class="bta-head" @click="showAiSection = !showAiSection">
                <div class="bta-left">
                  <div class="bta-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/></svg></div>
                  AI 深度分析
                </div>
                <div class="bta-right">
                  <span class="bta-toggle">{{ showAiSection ? '收起' : '展开' }}</span>
                  <svg class="bta-chevron" :class="{ open: showAiSection }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                </div>
              </div>
              <div v-show="showAiSection" class="bta-body">
                <div v-if="aiStream.isThinking && !aiStream.content && !aiStream.reasoning" class="ai-thinking">
                  <div class="at-dots"><span/><span/><span/></div>
                  <p class="at-text">AI 正在启动深度分析...</p>
                  <p class="at-hint">思考型模型会先分析您的背景，再生成更有针对性的建议</p>
                  <button v-if="activeStream.stopButtonVisible" class="btn-stop" style="margin-top:18px" @click="stopAIAnalysis">停止</button>
                </div>
                <div v-if="aiStream.reasoning" class="reason-box">
                  <div class="rb-header" @click="showReasoning = !showReasoning">
                    <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/></svg> 思考过程</span>
                    <span class="bta-toggle sm">{{ showReasoning ? '收起' : '展开' }}</span>
                  </div>
                  <div v-show="showReasoning" ref="reasoningContentRef" class="rb-content" @scroll="aiStream.handleUserScroll">{{ aiStream.reasoning }}</div>
                </div>
                <div v-if="aiStream.isLoading && aiStream.hasReasoning && !aiStream.content && !aiStream.isThinking" class="ai-thinking">
                  <div class="at-dots"><span/><span/><span/></div>
                  <p class="at-text">思考完成，正在生成报告...</p>
                  <p class="at-hint">AI 正在基于分析结果撰写个性化建议</p>
                  <button v-if="activeStream.stopButtonVisible" class="btn-stop" style="margin-top:18px" @click="stopAIAnalysis">停止</button>
                </div>
                <div v-if="aiStream.content || (aiStream.isLoading && aiStream.hasContent)" class="content-box">
                  <div class="cb-header" @click="showAiContent = !showAiContent">
                    <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> 分析报告</span>
                    <div style="display:flex;align-items:center;gap:8px">
                      <button v-if="aiStream.isLoading && activeStream.stopButtonVisible" class="btn-stop-xs" @click.stop="stopAIAnalysis">停止</button>
                      <span class="bta-toggle sm">{{ showAiContent ? '收起' : '展开' }}</span>
                    </div>
                  </div>
                  <div v-show="showAiContent" class="cb-content">
                    <div class="ai-md" v-html="renderAiContent(aiStream.content)" />
                    <span v-if="aiStream.isStreaming" class="cursor-blink" />
                  </div>
                </div>
                <div v-else-if="aiStream.error" class="err-box">
                  <p class="eb-title">分析失败</p>
                  <p class="eb-msg">{{ aiStream.error }}</p>
                  <button v-if="activeStream.canRetry" class="btn-primary btn-sm" @click="retryAIAnalysis">重试</button>
                </div>
                <div v-else-if="!selectedProvider" class="idle-box">
                  <p>未配置 AI 模型</p>
                  <button class="btn-primary btn-sm" @click="router.push('/ai-config')">去配置</button>
                </div>
              </div>
            </div>

            <!-- Stat Cards -->
            <div class="bt-stat">
              <div class="bs-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
              <div class="bs-value">{{ form.basic.gpa.toFixed(1) }}<span class="bs-grade" :class="getGpaGradeClass(form.basic.gpa)">{{ getGpaGrade(form.basic.gpa) }}</span></div>
              <p class="bs-note">{{ getGpaComment(form.basic.gpa, form.basic.university) }}</p>
            </div>

            <div class="bt-stat">
              <div class="bs-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div>
              <div class="bs-value">{{ form.basic.language || '—' }}<span class="bs-grade" :class="getLanguageScoreClass()">{{ getLanguageLevel() }}</span></div>
              <p class="bs-note">{{ getLanguageComment() }}</p>
            </div>

            <!-- Radar -->
            <div class="bt-radar">
              <div ref="radarRef" class="radar-canvas" />
            </div>

            <!-- Detail Breakdown -->
            <div class="bt-detail">
              <h3 class="bd-heading">维度细分</h3>
              <div v-for="item in detailItems" :key="item.key" class="bd-item">
                <div class="bd-top">
                  <span class="bd-name">{{ item.label }}</span>
                  <span class="bd-val">{{ item.score.toFixed(1) }}<span class="bd-max">/5</span></span>
                </div>
                <div class="bd-track"><div class="bd-fill" :style="{ width: (item.score / 5 * 100) + '%' }" /></div>
                <p class="bd-text">{{ item.comment }}</p>
              </div>
            </div>

          </div><!-- /bento -->

          <div class="report-actions">
            <button class="btn-primary" @click="saveReport">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              保存结果
            </button>
            <button class="btn-ghost" @click="resetForm">重新填写</button>
          </div>
        </template>
      </section>

    </main>

    <!-- ═══════════════ DIALOGS ═══════════════ -->
    <el-dialog v-model="researchDialogVisible" :title="isEditingResearch ? '编辑科研经历' : '添加科研经历'" width="520px" :close-on-click-modal="false">
      <el-form ref="researchFormRef" :model="currentResearch" :rules="researchRules" label-position="top" class="dlg-form">
        <el-form-item label="项目名称" prop="name"><el-input v-model="currentResearch.name" placeholder="请输入项目名称" /></el-form-item>
        <el-form-item label="担任角色" prop="role"><el-input v-model="currentResearch.role" placeholder="如：项目负责人、核心成员、参与者" /></el-form-item>
        <el-form-item label="项目时长" prop="duration"><el-input v-model="currentResearch.duration" placeholder="如：3个月、半年、1年" /></el-form-item>
        <el-form-item label="项目成果" prop="achievements"><el-input v-model="currentResearch.achievements" type="textarea" :rows="3" placeholder="描述项目成果、发表论文、获奖情况等" /></el-form-item>
      </el-form>
      <template #footer>
        <button class="btn-ghost" @click="closeResearchDialog">取消</button>
        <button class="btn-primary" @click="saveResearch">保存</button>
      </template>
    </el-dialog>

    <el-dialog v-model="internshipDialogVisible" :title="isEditingInternship ? '编辑实习经历' : '添加实习经历'" width="520px" :close-on-click-modal="false">
      <el-form ref="internshipFormRef" :model="currentInternship" :rules="internshipRules" label-position="top" class="dlg-form">
        <el-form-item label="公司名称" prop="company"><el-input v-model="currentInternship.company" placeholder="请输入公司名称" /></el-form-item>
        <el-form-item label="职位名称" prop="position"><el-input v-model="currentInternship.position" placeholder="如：前端工程师实习生" /></el-form-item>
        <el-form-item label="实习时长" prop="duration"><el-input v-model="currentInternship.duration" placeholder="如：3个月、6个月" /></el-form-item>
        <el-form-item label="工作描述" prop="description"><el-input v-model="currentInternship.description" type="textarea" :rows="3" placeholder="简要描述工作内容（可选）" /></el-form-item>
      </el-form>
      <template #footer>
        <button class="btn-ghost" @click="closeInternshipDialog">取消</button>
        <button class="btn-primary" @click="saveInternship">保存</button>
      </template>
    </el-dialog>

    <el-dialog v-model="competitionDialogVisible" :title="isEditingCompetition ? '编辑竞赛记录' : '添加竞赛获奖'" width="520px" :close-on-click-modal="false">
      <el-form ref="competitionFormRef" :model="currentCompetition" :rules="competitionRules" label-position="top" class="dlg-form">
        <el-form-item label="竞赛名称" prop="name"><el-input v-model="currentCompetition.name" placeholder="请输入竞赛名称" /></el-form-item>
        <el-form-item label="竞赛级别" prop="level">
          <el-select v-model="currentCompetition.level" placeholder="请选择级别" style="width:100%">
            <el-option label="国家级" value="国家级" /><el-option label="省级" value="省级" /><el-option label="校级" value="校级" /><el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="获奖情况" prop="award"><el-input v-model="currentCompetition.award" placeholder="如：一等奖、银奖" /></el-form-item>
        <el-form-item label="参赛时间" prop="time"><el-input v-model="currentCompetition.time" placeholder="如：2024年3月（可选）" /></el-form-item>
      </el-form>
      <template #footer>
        <button class="btn-ghost" @click="closeCompetitionDialog">取消</button>
        <button class="btn-primary" @click="saveCompetition">保存</button>
      </template>
    </el-dialog>

    <el-dialog v-model="volunteerDialogVisible" :title="isEditingVolunteer ? '编辑志愿服务' : '添加志愿服务'" width="520px" :close-on-click-modal="false">
      <el-form ref="volunteerFormRef" :model="currentVolunteer" :rules="volunteerRules" label-position="top" class="dlg-form">
        <el-form-item label="组织名称" prop="organization"><el-input v-model="currentVolunteer.organization" placeholder="请输入服务组织名称" /></el-form-item>
        <el-form-item label="志愿岗位" prop="role"><el-input v-model="currentVolunteer.role" placeholder="如：活动志愿者、支教老师" /></el-form-item>
        <el-form-item label="服务时长" prop="duration"><el-input v-model="currentVolunteer.duration" placeholder="如：20小时、1个月" /></el-form-item>
        <el-form-item label="服务描述" prop="description"><el-input v-model="currentVolunteer.description" type="textarea" :rows="3" placeholder="简要描述服务内容和感受（可选）" /></el-form-item>
      </el-form>
      <template #footer>
        <button class="btn-ghost" @click="closeVolunteerDialog">取消</button>
        <button class="btn-primary" @click="saveVolunteer">保存</button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import { buildAssessmentPrompt } from '@/utils/ai-api'
import { renderMarkdown } from '@/utils/markdown'
import { useAIStream } from '@/composables/useAIStream'
import { useActiveStream } from '@/composables/useActiveStream'
import { useGlobalAIState } from '@/composables/useGlobalAIState'

const router = useRouter()
const currentStep = ref(0)
const practiceTab = ref('internship')
const basicFormRef = ref(null)
const radarRef = ref(null)
const reasoningContentRef = ref(null)
let radarChart = null

const steps = [{ label: '基本信息' }, { label: '学术背景' }, { label: '实践经历' }, { label: '评估报告' }]
const totalSteps = computed(() => steps.length)
const progressPercent = computed(() => ((currentStep.value) / (totalSteps.value - 1)) * 100)
const timelineProgress = computed(() => (currentStep.value / (totalSteps.value - 1)) * 100)

const researchDialogVisible = ref(false); const isEditingResearch = ref(false); const editingResearchIndex = ref(-1); const researchFormRef = ref(null)
const internshipDialogVisible = ref(false); const isEditingInternship = ref(false); const editingInternshipIndex = ref(-1); const internshipFormRef = ref(null)
const competitionDialogVisible = ref(false); const isEditingCompetition = ref(false); const editingCompetitionIndex = ref(-1); const competitionFormRef = ref(null)
const volunteerDialogVisible = ref(false); const isEditingVolunteer = ref(false); const editingVolunteerIndex = ref(-1); const volunteerFormRef = ref(null)

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

const toggleMajor = (m) => { const idx = form.academic.majors.indexOf(m); idx >= 0 ? form.academic.majors.splice(idx, 1) : form.academic.majors.push(m) }
const jumpToStep = (i) => { if (i <= currentStep.value) currentStep.value = i }
const nextStep = async () => {
  if (currentStep.value === 0 && basicFormRef.value) {
    await basicFormRef.value.validate(v => { if (v) currentStep.value++; else ElMessage.warning('请完善必填字段') })
  } else currentStep.value++
}
const prevStep = () => { if (currentStep.value > 0) currentStep.value-- }

const openResearchDialog = () => { isEditingResearch.value = false; editingResearchIndex.value = -1; resetResearchForm(); researchDialogVisible.value = true }
const editResearch = (idx) => { const it = form.academic.research[idx]; Object.assign(currentResearch, { name: it.name, role: it.role, duration: it.duration, achievements: it.achievements || '' }); isEditingResearch.value = true; editingResearchIndex.value = idx; researchDialogVisible.value = true }
const saveResearch = async () => { await researchFormRef.value.validate(v => { if (v) { if (isEditingResearch.value) Object.assign(form.academic.research[editingResearchIndex.value], { name: currentResearch.name, role: currentResearch.role, duration: currentResearch.duration, achievements: currentResearch.achievements }); else form.academic.research.push({ ...currentResearch }); closeResearchDialog(); ElMessage.success(isEditingResearch.value ? '已更新' : '已添加') } }) }
const closeResearchDialog = () => { researchDialogVisible.value = false; resetResearchForm() }
const resetResearchForm = () => { Object.assign(currentResearch, { name: '', role: '', duration: '', achievements: '' }) }
const removeResearch = (idx) => ElMessageBox.confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => { form.academic.research.splice(idx, 1); ElMessage.success('已删除') }).catch(() => {})

const openInternshipDialog = () => { isEditingInternship.value = false; editingInternshipIndex.value = -1; Object.assign(currentInternship, { company: '', position: '', duration: '', description: '' }); internshipDialogVisible.value = true }
const editInternship = (idx) => { const it = form.practice.internships[idx]; Object.assign(currentInternship, it); isEditingInternship.value = true; editingInternshipIndex.value = idx; internshipDialogVisible.value = true }
const saveInternship = async () => { await internshipFormRef.value.validate(v => { if (v) { if (isEditingInternship.value) Object.assign(form.practice.internships[editingInternshipIndex.value], { ...currentInternship }); else form.practice.internships.push({ ...currentInternship }); closeInternshipDialog(); ElMessage.success(isEditingInternship.value ? '已更新' : '已添加') } }) }
const closeInternshipDialog = () => { internshipDialogVisible.value = false; Object.assign(currentInternship, { company: '', position: '', duration: '', description: '' }) }
const deleteInternship = (idx) => ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' }).then(() => { form.practice.internships.splice(idx, 1); ElMessage.success('已删除') }).catch(() => {})

const openCompetitionDialog = () => { isEditingCompetition.value = false; editingCompetitionIndex.value = -1; Object.assign(currentCompetition, { name: '', level: '国家级', award: '', time: '' }); competitionDialogVisible.value = true }
const editCompetition = (idx) => { const it = form.practice.competitions[idx]; Object.assign(currentCompetition, it); isEditingCompetition.value = true; editingCompetitionIndex.value = idx; competitionDialogVisible.value = true }
const saveCompetition = async () => { await competitionFormRef.value.validate(v => { if (v) { if (isEditingCompetition.value) Object.assign(form.practice.competitions[editingCompetitionIndex.value], { ...currentCompetition }); else form.practice.competitions.push({ ...currentCompetition }); closeCompetitionDialog(); ElMessage.success(isEditingCompetition.value ? '已更新' : '已添加') } }) }
const closeCompetitionDialog = () => { competitionDialogVisible.value = false; Object.assign(currentCompetition, { name: '', level: '国家级', award: '', time: '' }) }
const deleteCompetition = (idx) => ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' }).then(() => { form.practice.competitions.splice(idx, 1); ElMessage.success('已删除') }).catch(() => {})

const openVolunteerDialog = () => { isEditingVolunteer.value = false; editingVolunteerIndex.value = -1; Object.assign(currentVolunteer, { organization: '', role: '', duration: '', description: '' }); volunteerDialogVisible.value = true }
const editVolunteer = (idx) => { const it = form.practice.volunteers[idx]; Object.assign(currentVolunteer, it); isEditingVolunteer.value = true; editingVolunteerIndex.value = idx; volunteerDialogVisible.value = true }
const saveVolunteer = async () => { await volunteerFormRef.value.validate(v => { if (v) { if (isEditingVolunteer.value) Object.assign(form.practice.volunteers[editingVolunteerIndex.value], { ...currentVolunteer }); else form.practice.volunteers.push({ ...currentVolunteer }); closeVolunteerDialog(); ElMessage.success(isEditingVolunteer.value ? '已更新' : '已添加') } }) }
const closeVolunteerDialog = () => { volunteerDialogVisible.value = false; Object.assign(currentVolunteer, { organization: '', role: '', duration: '', description: '' }) }
const deleteVolunteer = (idx) => ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' }).then(() => { form.practice.volunteers.splice(idx, 1); ElMessage.success('已删除') }).catch(() => {})

const getAwardLevelType = (l) => ({ '国家级': 'danger', '省级': 'warning', '校级': 'primary', '其他': 'info' }[l] || 'info')
const getGpaGrade = (g) => g >= 3.8 ? '优秀' : g >= 3.5 ? '良好' : g >= 3.0 ? '中等' : g >= 2.5 ? '及格' : '需提升'
const getGpaGradeClass = (g) => g >= 3.8 ? 'g-excellent' : g >= 3.5 ? 'g-good' : g >= 3.0 ? 'g-medium' : g >= 2.5 ? 'g-pass' : 'g-low'
const getGpaComment = (g, u) => { const c = u === '985' ? '985院校背景加分' : u === '211' ? '211院校背景加分' : ''; if (g >= 3.8) return `非常出色，${c}竞争力强。`; if (g >= 3.5) return `良好，${c}不错机会。`; if (g >= 3.0) return '中等水平，建议补充其他优势。'; return '相对较低，需突出其他亮点。' }
const getLanguageLevel = () => { const l = form.basic.language; if (!l) return '未评估'; if (l.includes('雅思') && parseFloat(l.match(/\d+/)?.[0]||0) >= 7) return '优秀'; if (l.includes('托福') && parseFloat(l.match(/\d+/)?.[0]||0) >= 100) return '优秀'; if (l.includes('雅思') && parseFloat(l.match(/\d+/)?.[0]||0) >= 6.5) return '良好'; if (l.includes('托福') && parseFloat(l.match(/\d+/)?.[0]||0) >= 90) return '良好'; return '需提升' }
const getLanguageScoreClass = () => { const l = getLanguageLevel(); return l === '优秀' ? 'g-excellent' : l === '良好' ? 'g-good' : 'g-low' }
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
const providers = computed(() => { try { return JSON.parse(localStorage.getItem('ai_providers') || '[]') } catch { return [] } })
const currentProviderName = computed(() => providers.value.find(p => p.id === selectedProvider.value)?.name || '选择AI模型')
const loadProviders = () => { try { const p = JSON.parse(localStorage.getItem('ai_providers') || '[]'); if (p.length > 0) selectedProvider.value = p[0].id } catch {} }

const showReasoning = ref(true), showAiContent = ref(true), showAiSection = ref(true)
const animatedScore = ref('0.0')
const animateScore = (target) => { const start = parseFloat(animatedScore.value) || 0, dur = 1200, t0 = performance.now(); const tick = (now) => { const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3); animatedScore.value = (start + (target - start) * e).toFixed(1); if (p < 1) requestAnimationFrame(tick) }; requestAnimationFrame(tick) }
watch(overallScore, (v) => { if (currentStep.value === 3) animateScore(v) })

const generateReport = async () => { _btnDisabled.value = true; aiStream.reset(); await new Promise(r => setTimeout(r, 500)); currentStep.value = 3; await nextTick(); renderRadarChart(); animateScore(overallScore.value); if (selectedProvider.value) await callAIAnalysis(); else _btnDisabled.value = false }
const callAIAnalysis = async () => { const scores = { overall: overallScore.value, academic: academicScore.value, language: languageScore.value, research: researchScore.value, practice: practiceScore.value }; try { await aiStream.generateWithProvider(selectedProvider.value, [{ role: 'user', content: buildAssessmentPrompt(form, scores) }]) } catch {} finally { _btnDisabled.value = false } }
const retryAIAnalysis = () => activeStream.handleRetry()
const stopAIAnalysis = () => { aiStream.stop(); activeStream.stopGeneration(); _btnDisabled.value = false }
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
const resetForm = () => ElMessageBox.confirm('确定重新填写？数据将丢失', '提示', { confirmButtonText: '确定', cancelButtonText: '取消' }).then(() => { isResetting.value = true; Object.assign(form.basic, { name:'', age:22, university:'', gpa:3.0, language:'' }); Object.assign(form.academic, { degree:'本科', majors:[], averageScore:80, research:[] }); Object.assign(form.practice, { internships:[], competitions:[], volunteers:[] }); aiStream.reset(); showAiSection.value = showReasoning.value = showAiContent.value = true; currentStep.value = 0; practiceTab.value = 'internship'; localStorage.removeItem('assessment_form'); setTimeout(() => isResetting.value = false, 0) }).catch(() => {})
let isLoaded = false; const isResetting = ref(false)
const loadFromStorage = async () => { try { const d = JSON.parse(localStorage.getItem('assessment_form') || '{}'); if (d.form) { Object.assign(form.basic, d.form.basic || {}); Object.assign(form.academic, d.academic || {}); Object.assign(form.practice, d.practice || {}) }; if (typeof d.currentStep === 'number') currentStep.value = d.currentStep; if (d.practiceTab) practiceTab.value = d.practiceTab; if (typeof d.showReasoning === 'boolean') showReasoning.value = d.showReasoning; if (typeof d.showAiContent === 'boolean') showAiContent.value = d.showAiContent; if (typeof d.showAiSection === 'boolean') showAiSection.value = d.showAiSection } catch {} isLoaded = true; if (currentStep.value === 3) { await nextTick(); renderRadarChart(); animateScore(overallScore.value) } }

watch([form, currentStep, practiceTab, showReasoning, showAiContent, showAiSection], () => { if (!isLoaded || isResetting.value) return; localStorage.setItem('assessment_form', JSON.stringify({ form: { basic:{...form.basic}, academic:{...form.academic}, practice:{ internships:[...form.practice.internships], competitions:[...form.practice.competitions], volunteers:[...form.practice.volunteers] } }, currentStep: currentStep.value, practiceTab: practiceTab.value, showReasoning: showReasoning.value, showAiContent: showAiContent.value, showAiSection: showAiSection.value })); if (form.basic.name || form.basic.university) localStorage.setItem('assessment_report', JSON.stringify({ ...form, scores: { overall:overallScore.value, academic:academicScore.value, language:languageScore.value, research:researchScore.value, practice:practiceScore.value }, savedAt:new Date().toISOString() })) }, { deep: true })

onMounted(() => { window.addEventListener('resize', handleResize); loadFromStorage(); loadProviders(); nextTick(() => aiStream.reset()) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); radarChart?.dispose(); radarChart = null })
</script>

<style scoped>
/* ============================================================
   🎨 AstroPath Assessment v4 — Design System Architecture
   ============================================================ */

/* --- Easing Tokens --- */
:root {
  --ease-expo: cubic-bezier(.16,1,.3,1);
  --ease-back: cubic-bezier(.34,1.56,.64,1);
  --ease-out: cubic-bezier(.25,1,.5,1);
  --ease-qout: cubic-bezier(.33,0,.67,1);
}

/* --- Base --- */
.ap{width:100%;min-height:100vh;background:#fff;position:relative;overflow-x:hidden;-webkit-font-smoothing:antialiased;font-family:inherit;}
.ap-noise{position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");opacity:.028;pointer-events:none;z-index:99999;user-select:none;}

/* ============================================================
   HERO — FULL IMMERSIVE
   ============================================================ */
.hero{position:relative;width:100%;min-height:100svh;display:flex;align-items:center;justify-content:center;overflow:hidden;}

.hero-canvas{position:absolute;inset:0;z-index:0;}
.hero-grid{position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(15,23,42,.06) 1px,transparent 0);background-size:40px 40px;mask-image:radial-gradient(ellipse 75% 60% at 50% 50%,black,transparent);-webkit-mask-image:radial-gradient(ellipse 75% 60% at 50% 50%,black,transparent);}
.hero-orb{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none;}
.hero-orb--a{width:520px;height:520px;background:radial-gradient(circle,rgba(217,119,6,.14),transparent 70%);top:-15%;right:2%;animation:oFloat 16s ease-in-out infinite alternate;}
.hero-orb--b{width:400px;height:400px;background:radial-gradient(circle,rgba(15,23,42,.07),transparent 70%);bottom:-10%;left:4%;animation:oFloatR 20s ease-in-out infinite alternate-reverse;}
@keyframes oFloat{to{transform:translate(40px,-30px) scale(1.07)}}
@keyframes oFloatR{to{transform:translate(-32px,24px) scale(1.05)}}

.hero-ring{position:absolute;border-radius:50%;pointer-events:none;border:1.5px solid;}
.hero-ring--1{width:300px;height:300px;border-color:rgba(15,23,42,.15);top:8%;left:-90px;animation:rSpin 50s linear infinite;}
.hero-ring--2{width:180px;height:180px;border-color:rgba(217,119,6,.22);bottom:12%;right:-40px;animation:rSpinR 38s linear infinite;}
@keyframes rSpin{to{transform:rotate(360deg)}}@keyframes rSpinR{to{transform:rotate(-360deg)}}

.hero-line-art{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(1.6);opacity:.07;pointer-events:none;width:200px;height:200px;}

.hero-inner{text-align:center;padding:72px 32px 56px;position:relative;z-index:2;max-width:800px;}

.hero-badge{display:inline-flex;align-items:center;gap:10px;font-size:10.5px;font-weight:800;letter-spacing:4px;text-transform:uppercase;color:#94A3B8;margin:0 0 36px;font-family:var(--font-family-mono);}
.hb-dot{width:8px;height:8px;background:#D97706;border-radius:50%;display:inline-block;animation:hPulse 2.2s ease-in-out infinite;}
@keyframes hPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.65)}}

.hero-title{margin:0 0 28px;line-height:.92;display:flex;flex-direction:column;align-items:center;}
.ht-line{display:block;font-weight:900;color:#0F172A;letter-spacing:-.06em;font-family:var(--font-family-base);}
.ht-line--1{font-size:clamp(4rem,12vw,8.5rem);}
.ht-line--2{font-size:clamp(4rem,12vw,8.5rem);color:transparent;-webkit-text-stroke:2px rgba(15,23,42,.2);}

.hero-sub{font-size:clamp(16px,1.6vw,19px);color:#64748B;line-height:1.7;margin:0 0 44px;font-weight:400;letter-spacing:.03em;max-width:520px;margin-left:auto;margin-right:auto;}

.hero-metric{display:inline-flex;align-items:center;gap:0;background:rgba(248,250,252,.8);backdrop-filter:blur(8px);border:1px solid rgba(226,232,240,.6);border-radius:100px;padding:10px 28px;}
.hm-item{display:flex;flex-direction:column;align-items:center;gap:2px;}
.hm-n{font-size:18px;font-weight:900;color:#0F172A;letter-spacing:-.5px;}
.hm-l{font-size:10px;font-weight:600;color:#94A3B8;letter-spacing:.5px;text-transform:uppercase;}
.hm-div{width:1px;height:28px;background:#E2E8F0;}

.hero-scroll-hint{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;z-index:2;}
.hsh-line{width:1px;height:32px;background:linear-gradient(to bottom,#CBD5E1,transparent);animation:sHint 2s ease-in-out infinite;}
@keyframes sHint{0%,100%{opacity:.4;transform:translateY(0)}50%{opacity:1;transform:translateY(6px)}}
.hero-scroll-hint span{font-size:10px;font-weight:600;color:#94A3B8;letter-spacing:2px;text-transform:uppercase;}

.hero-bottom-fade{position:absolute;bottom:0;left:0;right:0;height:100px;background:linear-gradient(to top,#fff 30%,transparent);z-index:1;pointer-events:none;}

/* ============================================================
   STEPPER — Minimal Node Chain
   ============================================================ */
.stepper{padding:20px 0 0;position:sticky;top:0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);z-index:40;border-bottom:1px solid rgba(226,232,240,.5);}
.st-track{display:flex;align-items:center;justify-content:center;gap:0;max-width:720px;margin:0 auto;padding:8px 16px;}
.st-node{display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;position:relative;z-index:1;padding:8px 18px;border-radius:14px;transition:all .35s var(--ease-expo);background:none;border:none;font-family:inherit;}
.st-node:hover:not(.wait){background:rgba(248,250,252,.9);}
.st-node.wait{cursor:default;opacity:.3;}
.st-num{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:#F8FAFC;color:#94A3B8;border:2px solid #E2E8F0;transition:all .45s var(--ease-back);}
.st-node.done .st-num{background:#0F172A;color:#fff;border-color:#0F172A;box-shadow:0 2px 12px rgba(15,23,42,.18);}
.st-node.active .st-num{background:#0F172A;color:#fff;border-color:#0F172A;box-shadow:0 0 0 4px rgba(15,23,42,.08),0 4px 18px rgba(15,23,42,.14);transform:scale(1.1);}
.st-txt{font-size:11px;font-weight:600;color:#94A3B8;white-space:nowrap;letter-spacing:.3px;transition:color .3s;}
.st-node.active .st-txt{color:#0F172A;font-weight:750;}
.st-node.done .st-txt{color:#64748B;}
.st-conn{flex:1;height:2px;background:#E2E8F0;border-radius:1px;position:relative;overflow:hidden;min-width:40px;}
.st-conn-fill{position:absolute;top:0;left:0;height:100%;background:linear-gradient(90deg,#0F172A,#334155);border-radius:1px;transition:width .8s var(--ease-back);}

/* ============================================================
   MAIN CONTENT AREA
   ============================================================ */
.main{max-width:920px;margin:0 auto;padding:48px 32px 100px;}

.step{animation:stepIn .55s var(--ease-expo) both;}
@keyframes stepIn{from{opacity:0;transform:translateY(18px) scale(.99)}to{opacity:1;transform:translateY(0) scale(1)}}

/* Step Decoration */
.step-deco{display:flex;align-items:center;gap:14px;margin-bottom:28px;}
.sd-num{font-size:11px;font-weight:850;color:#D97706;font-family:var(--font-family-mono);letter-spacing:1.5px;opacity:.7;flex-shrink:0;}
.sd-bar{height:2px;flex:1;background:linear-gradient(90deg,#D97706,transparent);border-radius:1px;opacity:.25;}

.step-title{font-size:26px;font-weight:850;color:#0F172A;margin:0 0 36px;letter-spacing:-.6px;}

/* ============================================================
   FORM BLOCKS — Non-uniform Layout
   ============================================================ */

/* --- Name Block: Signature-style Hero Input --- */
.name-block{margin-bottom:48px;text-align:center;padding:44px 0 20px;}
.nb-label{display:block;font-size:11px;font-weight:800;color:#94A3B8;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;}
.nb-form{max-width:420px;margin:0 auto;}
.name-input :deep(.el-input__wrapper){border-radius:14px!important;padding:14px 22px!important;box-shadow:0 0 0 1.5px #E2E8F0 inset!important;background:#FAFBFC!important;transition:all .35s var(--ease-expo)!important;}
.name-input :deep(.el-input__wrapper:hover){box-shadow:0 0 0 1.5px #CBD5E1 inset!important;}
.name-input :deep(.el-input__wrapper:focus-within){box-shadow:0 0 0 2px rgba(15,23,42,.05),0 0 0 2px #0F172A inset!important;background:#fff!important;}
.name-input :deep(.el-input__inner){font-size:20px!important;font-weight:500!important;letter-spacing:.05em!important;text-align:center!important;color:#0F172A!important;}
.nb-hint{font-size:12.5px;color:#94A3B8;margin:12px 0 0;letter-spacing:.2px;}

/* --- Two-column Row --- */
.row-2{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:36px;}
.row-2--tight{gap:20px;margin-bottom:32px;}

.field-block{display:flex;flex-direction:column;gap:8px;}
.fb-label{font-size:11.5px;font-weight:750;color:#64748B;letter-spacing:.5px;text-transform:uppercase;margin:0;display:block;}

/* --- GPA Block: Visual Centerpiece --- */
.gpa-block{background:linear-gradient(145deg,#FAFBFC,#F1F5F9);border:1px solid #EEF0F3;border-radius:20px;padding:36px 40px;margin-bottom:36px;position:relative;overflow:hidden;}
.gpa-block::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#0F172A,#334155,#0F172A);}
.gb-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;}
.gb-info{flex:1;}
.gb-desc{font-size:12.5px;color:#94A3B8;margin:6px 0 0;letter-spacing:.1px;}
.gb-display{display:flex;align-items:baseline;gap:4px;}
.gb-num{font-size:52px;font-weight:900;color:#0F172A;font-variant-numeric:tabular-nums;letter-spacing:-2.5px;line-height:1;}
.gb-max{font-size:18px;font-weight:500;color:#94A3B8;}
.gb-slider-wrap{padding:4px 0 16px;}
.gb-slider-wrap :deep(.el-slider){width:100%!important;}
.gb-slider-wrap :deep(.el-slider__runway){width:100%!important;min-width:500px!important;height:6px!important;border-radius:3px!important;background:#E2E8F0!important;}
.gb-slider-wrap :deep(.el-slider__bar){height:6px!important;border-radius:3px!important;background:linear-gradient(90deg,#0F172A,#334155)!important;}
.gb-slider-wrap :deep(.el-slider__button){width:20px!important;height:20px!important;border:none!important;background:#0F172A!important;border-radius:50%!important;box-shadow:0 2px 10px rgba(15,23,42,.28)!important;transition:transform .2s var(--ease-back)!important;}
.gb-slider-wrap :deep(.el-slider__button:hover){transform:scale(1.25)!important;}
.gb-scale{display:flex;justify-content:space-between;padding:0 2px;}
.gb-scale span{font-size:11px;color:#CBD5E1;font-weight:550;font-variant-numeric:tabular-nums;}

/* --- Language Block --- */
.lang-block{margin-bottom:40px;}
.lb-hint{font-size:12px;color:#94A3B8;margin:8px 0 0;letter-spacing:.1px;}

/* --- Degree Pills (custom, no el-radio-group) --- */
.degree-row{margin-bottom:32px;}
.deg-pills{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;}
.deg-pill{padding:10px 32px;border-radius:100px;font-size:14px;font-weight:600;border:1.5px solid #E2E8F0;background:#fff;color:#64748B;cursor:pointer;transition:all .28s var(--ease-expo);font-family:inherit;letter-spacing:-.1px;}
.deg-pill:hover{border-color:#CBD5E1;color:#0F172A;}
.deg-pill.active{background:#0F172A;border-color:#0F172A;color:#fff;box-shadow:0 3px 14px rgba(15,23,42,.16);}

/* --- Major Tag Cloud (custom, no el-checkbox-group) --- */
.major-row{margin-bottom:32px;}
.tag-cloud{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;}
.tc-tag{padding:9px 24px;border-radius:100px;font-size:13.5px;font-weight:550;border:1.5px solid #E2E8F0;background:#fff;color:#64748B;cursor:pointer;transition:all .28s var(--ease-expo);font-family:inherit;letter-spacing:-.05px;}
.tc-tag:hover{border-color:#CBD5E1;color:#0F172A;}
.tc-tag.on{background:#0F172A;border-color:#0F172A;color:#fff;box-shadow:0 2px 10px rgba(15,23,42,.12);}

/* --- Score Inline --- */
.score-inline{display:flex;align-items:center;gap:8px;}
.si-suffix{font-size:15px;color:#94A3B8;font-weight:600;}
.research-area{background:#FAFBFC;border:1px solid #EEF0F3;border-radius:16px;padding:22px 26px;margin-bottom:32px;}
.ra-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}

/* --- Entry Cards (Research/Internship etc.) --- */
.res-entry{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:#fff;border:1px solid #EEF0F3;border-radius:12px;margin-bottom:8px;transition:all .28s ease;position:relative;overflow:hidden;}
.res-entry::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:transparent;transition:background .28s;border-radius:0 2px 2px 0;}
.res-entry:hover{border-color:#E2E8F0;box-shadow:0 4px 18px rgba(0,0,0,.048);transform:translateX(3px);}
.res-entry:hover::before{background:#D97706;}
.re-main{flex:1;min-width:0;}
.re-head{display:flex;align-items:center;gap:8px;margin-bottom:3px;}
.re-head strong{font-size:14px;font-weight:650;color:#0F172A;letter-spacing:-.2px;}
.re-meta{font-size:12px;color:#94A3B8;display:flex;flex-wrap:wrap;gap:6px;}
.re-btns{display:flex;gap:5px;flex-shrink:0;margin-left:14px;opacity:0;transition:opacity .25s;}
.res-entry:hover .re-btns{opacity:1;}

.empty-note{font-size:13px;color:#94A3B8;text-align:center;padding:22px;background:#FAFBFC;border:1px dashed #E2E8F0;border-radius:12px;margin-top:10px;letter-spacing:.2px;}

/* Tags */
.tag-mini{font-size:11px;font-weight:600;padding:2px 9px;border-radius:5px;background:#F1F5F9;color:#475569;white-space:nowrap;letter-spacing:.2px;}
.tag-mini.tm-danger{background:#FEF2F2;color:#DC2626;}
.tag-mini.tm-warning{background:#FFFBEB;color:#D97706;}
.tag-mini.tm-ok{background:#ECFDF5;color:#059669;}
.tag-mini.tm-primary{background:#EFF6FF;color:#2563EB;}
.tag-mini.tm-info{background:#F8FAFC;color:#64748B;}

/* Buttons */
.btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:15px 36px;background:#0F172A;color:#fff;font-size:14.5px;font-weight:680;border:none;border-radius:13px;min-height:52px;cursor:pointer;transition:all .32s var(--ease-expo);box-shadow:0 3px 12px rgba(15,23,42,.14),0 1px 4px rgba(15,23,42,.06);white-space:nowrap;font-family:inherit;letter-spacing:-.2px;position:relative;overflow:hidden;}
.btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.1),transparent);opacity:0;transition:opacity .3s;}
.btn-primary:hover:not(:disabled)::before{opacity:1;}
.btn-primary:hover:not(:disabled){background:#1E293B;transform:translateY(-2px);box-shadow:0 8px 28px rgba(15,23,42,.18),0 2px 6px rgba(0,0,0,.04);}
.btn-primary:active:not(:disabled){transform:translateY(0);}
.btn-primary:disabled{opacity:.38;cursor:not-allowed;}
.btn-primary.btn-sm{padding:10px 22px;min-height:38px;font-size:13px;}

.btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:15px 28px;background:transparent;color:#475569;font-size:14.5px;font-weight:600;border:1.5px solid #E2E8F0;border-radius:13px;min-height:52px;cursor:pointer;transition:all .32s var(--ease-expo);white-space:nowrap;font-family:inherit;}
.btn-ghost:hover{border-color:#0F172A;color:#0F172A;background:rgba(15,23,42,.018);transform:translateY(-2px);box-shadow:0 4px 18px rgba(0,0,0,.04);}

.btn-add-row{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 20px;background:#FAFBFC;color:#475569;font-size:13px;font-weight:600;border:1.5px dashed #CBD5E1;border-radius:11px;cursor:pointer;transition:all .25s ease;font-family:inherit;margin-bottom:12px;}
.btn-add-row:hover{border-color:#0F172A;color:#0F172A;background:rgba(15,23,42,.025);}

.btn-tiny{padding:5px 12px;background:transparent;color:#64748B;font-size:12px;font-weight:500;border:1px solid #E2E8F0;border-radius:7px;cursor:pointer;transition:all .2s ease;font-family:inherit;}
.btn-tiny:hover{background:#F1F5F9;color:#0F172A;}
.btn-tiny--del{color:#DC2626;}
.btn-tiny--del:hover{background:#FEF2F2;color:#DC2626;}

.btn-provider{display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:8px 16px;background:#fff;color:#64748B;font-size:12.5px;font-weight:550;border:1px solid #E2E8F0;border-radius:10px;cursor:pointer;transition:all .2s ease;font-family:inherit;}
.btn-provider:hover{border-color:#0F172A;color:#0F172A;}

.btn-config{display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:8px 18px;background:linear-gradient(135deg,#D97706,#F59E0B);color:#fff;font-size:12.5px;font-weight:650;border:none;border-radius:10px;cursor:pointer;transition:all .3s var(--ease-expo);box-shadow:0 2px 10px rgba(217,119,6,.2);font-family:inherit;white-space:nowrap;}
.btn-config:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(217,119,6,.3);filter:brightness(1.06);}

.btn-stop{padding:5px 14px;font-size:12px;background:#FEF2F2;color:#DC2626;border:1px solid #FECACA;border-radius:8px;cursor:pointer;font-family:inherit;}
.btn-stop-xs{padding:2px 10px;font-size:11px;background:#FEF2F2;color:#DC2626;border:1px solid #FECACA;border-radius:6px;cursor:pointer;}

/* Step Actions */
.step-action{display:flex;justify-content:flex-end;margin-top:44px;padding-top:24px;border-top:1px solid #F1F5F9;}
.step-action--split{justify-content:space-between;}
.sa-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.provider-sel{display:flex;align-items:center;}

/* Practice Tabs */
.prac-tabs{display:flex;gap:4px;margin-bottom:28px;background:#F8FAFC;border-radius:12px;padding:4px;width:-webkit-fit-content;}
.pt-tab{padding:10px 28px;border-radius:9px;font-size:13.5px;font-weight:600;color:#94A3B8;border:none;background:transparent;cursor:pointer;transition:all .28s var(--ease-expo);font-family:inherit;letter-spacing:.1px;}
.pt-tab:hover{color:#475569;}
.pt-tab.on{background:#fff;color:#0F172A;box-shadow:0 2px 8px rgba(0,0,0,.05);}

.tab-content{}

/* ============================================================
   REPORT — BENTO DASHBOARD
   ============================================================ */
.report-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 28px;gap:20px;}
.rl-spinner{width:36px;height:36px;border:3px solid #E2E8F0;border-top-color:#0F172A;border-radius:50%;animation:rSpin 1s linear infinite;}
@keyframes rSpin{to{transform:rotate(360deg)}}
.report-loading p{font-size:14px;color:#64748B;margin:0;letter-spacing:.2px;}

.bento{display:grid;grid-template-columns:1.4fr 1fr;grid-template-rows:auto auto auto auto;gap:18px;}

/* Score Card */
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

/* AI Card */
.bt-ai{grid-column:2;grid-row:1/span 2;border:1px solid #E2E8F0;border-radius:20px;overflow:hidden;transition:all .4s var(--ease-expo);background:#fff;display:flex;flex-direction:column;}
.bt-ai.busy{border-color:#D97706;box-shadow:0 0 0 3px rgba(217,119,6,.05),0 6px 24px rgba(217,119,6,.07);}
.bt-ai.done{border-color:#0F172A;box-shadow:0 4px 18px rgba(15,23,42,.045);}
.bt-ai.err{border-color:#DC2626;box-shadow:0 0 0 3px rgba(220,38,38,.05);}
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
@keyframes dPulse{0%,80%,100%{opacity:.4;transform:scale(.85)}40%{opacity:1;transform:scale(1.15)}}
.at-text{font-size:14.5px;font-weight:700;color:#D97706;margin:0 0 5px;letter-spacing:-.2px;}
.at-hint{font-size:12.5px;color:#D97706;opacity:.55;margin:0;}

.reason-box{border:1px solid #EEF0F3;border-radius:11px;overflow:hidden;margin-bottom:12px;background:#fff;}
.rb-header{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;cursor:pointer;background:#EFF6FF;font-size:12.5px;font-weight:600;color:#2563EB;transition:background .2s;user-select:none;}
.rb-header:hover{background:#DBEAFE;}
.rb-header span:first-child{display:flex;align-items:center;gap:5px;}
.rb-content{padding:14px;background:#F8FAFC;border-top:1px solid #EEF0F3;max-height:340px;overflow-y:auto;font-size:12.5px;line-height:1.75;color:#475569;white-space:pre-wrap;word-break:break-word;}
.rb-content::-webkit-scrollbar{width:4px}.rb-content::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:2px}

.content-box{border:1px solid #EEF0F3;border-radius:11px;overflow:hidden;background:#fff;}
.cb-header{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;cursor:pointer;background:#ECFDF5;font-size:12.5px;font-weight:600;color:#059669;transition:background .2s;user-select:none;}
.cb-header:hover{background:#D1FAE5;}
.cb-header span:first-child{display:flex;align-items:center;gap:5px;}
.cb-content{padding:18px;background:#fff;border-top:1px solid #EEF0F3;min-height:150px;position:relative;}

.err-box{text-align:center;padding:28px 18px;}
.eb-title{font-size:14.5px;font-weight:600;color:#DC2626;margin:0 0 6px;}
.eb-msg{font-size:12.5px;color:#64748B;margin:0 0 14px;}
.idle-box{text-align:center;padding:28px 18px;}
.idle-box p{font-size:12.5px;color:#94A3B8;margin:0 0 14px;}

/* Stat Cards */
.bt-stat{background:#FAFBFC;border:1px solid #EEF0F3;border-radius:16px;padding:24px 26px;transition:all .35s var(--ease-expo);position:relative;overflow:hidden;}
.bt-stat::before{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#0F172A,transparent);opacity:0;transition:opacity .35s;}
.bt-stat:hover{box-shadow:0 8px 28px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.025);border-color:#E2E8F0;transform:translateY(-3px);}
.bt-stat:hover::before{opacity:.5;}
.bs-icon{margin-bottom:12px;color:#94A3B8;}
.bs-icon svg{opacity:.5;}
.bs-value{font-size:27px;font-weight:800;color:#0F172A;font-variant-numeric:tabular-nums;letter-spacing:-1px;margin-bottom:8px;}
.bs-grade{font-size:11.5px;font-weight:600;padding:3px 10px;border-radius:5px;margin-left:8px;vertical-align:middle;letter-spacing:.3px;}
.g-excellent{background:#ECFDF5;color:#059669;}.g-good{background:#F1F5F9;color:#334155;}.g-medium{background:#FFFBEB;color:#D97706;}.g-pass{background:#FEF2F2;color:#DC2626;}.g-low{background:#FEF2F2;color:#DC2626;}
.bs-note{font-size:12.5px;color:#64748B;line-height:1.6;margin:0;}

/* Radar */
.bt-radar{grid-column:1/-1;background:linear-gradient(145deg,#FAFBFC,#F1F5F9);border:1px solid #EEF0F3;border-radius:20px;padding:24px;position:relative;overflow:hidden;}
.bt-radar::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:30%;height:1px;background:linear-gradient(90deg,transparent,#E2E8F0,transparent);}
.radar-canvas{height:320px;}

/* Detail Card */
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

/* Report Actions */
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
@keyframes cBlink{0%,50%{opacity:1}51%,100%{opacity:0}}

/* ============================================================
   ELEMENT PLUS DEEP OVERRIDES
   ============================================================ */
:deep(.el-input__wrapper),:deep(.el-textarea__inner){border-radius:11px!important;padding:5px 15px!important;transition:all .28s var(--ease-expo)!important;box-shadow:0 0 0 1px #E2E8F0 inset!important;background:#fff!important;}
:deep(.el-input__wrapper:hover),:deep(.el-textarea__inner:hover){box-shadow:0 0 0 1px #CBD5E1 inset!important;}
:deep(.el-input__wrapper:focus-within),:deep(.el-textarea__inner:focus){box-shadow:0 0 0 2px rgba(15,23,42,.05),0 0 0 1.5px #0F172A inset!important;}
:deep(.el-input__inner){font-size:14.5px!important;}
:deep(.el-form-item__label){font-size:11.5px!important;font-weight:650!important;color:#64748B!important;padding-bottom:6px!important;letter-spacing:.3px!important;}
:deep(.el-form-item){margin-bottom:0!important;}
:deep(.el-select){width:100%;}
:deep(.el-select .el-input__wrapper){border-radius:11px!important;padding:5px 15px!important;box-shadow:0 0 0 1px #E2E8F0 inset!important;background:#fff!important;transition:all .28s var(--ease-expo)!important;}
:deep(.el-select .el-input__wrapper:hover){box-shadow:0 0 0 1px #CBD5E1 inset!important;}
:deep(.el-select .el-input__wrapper:focus-within){box-shadow:0 0 0 2px rgba(15,23,42,.05),0 0 0 1.5px #0F172A inset!important;}
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

:deep(.el-tabs__header){margin-bottom:20px!important;}
:deep(.el-tabs__item){font-size:13px!important;font-weight:550!important;color:#94A3B8!important;transition:all .25s ease!important;padding:0 16px!important;height:40px!important;line-height:40px!important;}
:deep(.el-tabs__item.is-active){color:#0F172A!important;font-weight:700!important;}
:deep(.el-tabs__active-bar){background:#0F172A!important;height:2.5px!important;border-radius:2px!important;}
:deep(.el-tabs__nav-wrap::after){background:#E2E8F0!important;}

:deep(.el-dropdown-menu__item.is-active){color:#0F172A!important;background:#F8FAFC!important;font-weight:600!important;}
:deep(.el-dropdown-menu){border-radius:14px!important;box-shadow:0 10px 28px rgba(0,0,0,.07)!important;border:1px solid #EEF0F3!important;padding:5px!important;}
:deep(.el-dropdown-menu__item){border-radius:8px!important;padding:7px 13px!important;margin:2px 0!important;}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media(max-width:960px){
  .hero{min-height:85svh;}
  .hero-inner{padding:56px 24px 44px;}
  .ht-line--1,.ht-line--2{font-size:clamp(3rem,14vw,5.5rem);}
  .main{padding:36px 24px 80px;}
  .stepper{padding:16px 0 0;}
  .bento{grid-template-columns:1fr;}
  .bt-score{grid-column:1;}.bt-ai{grid-column:1;grid-row:auto;}.bt-radar{grid-column:1;}.bt-detail{grid-column:1;}
  .row-2{grid-template-columns:1fr;}.step-title{font-size:22px;}
  .gpa-block{padding:28px 24px;}.gb-num{font-size:40px;}
}
@media(max-width:640px){
  .hero{min-height:78svh;}
  .hero-inner{padding:40px 18px 36px;}
  .ht-line--1,.ht-line--2{font-size:clamp(2.4rem,14vw,3.8rem);}
  .hero-sub{font-size:14.5px;}
  .hero-metric{flex-direction:column;gap:12px;padding:14px 24px;border-radius:16px;}
  .hm-div{width:40px;height:1px;}
  .main{padding:24px 18px 64px;}
  .stepper{padding:12px 0 0;}
  .st-track{flex-wrap:wrap;gap:4px;}.st-conn{display:none;}.st-node{flex:1;min-width:0;padding:4px 6px;}.st-num{width:32px;height:32px;font-size:12px;}.st-txt{font-size:9.5px;}
  .step-title{font-size:20px;}
  .name-block{padding:32px 0 16px;}
  .name-input :deep(.el-input__inner){font-size:17px!important;}
  .gpa-block{padding:22px 18px;}.gb-num{font-size:34px;}.gb-top{flex-direction:column;gap:10px;}.gb-max{font-size:15px;}
  .row-2{gap:16px;margin-bottom:28px;}
  .step-action{flex-direction:column;gap:12px;}.step-action--split{flex-direction:column;}.sa-right{width:100%;justify-content:stretch;}
  .res-entry{flex-direction:column;align-items:flex-start;gap:10px;}.re-btns{margin-left:0;width:100%;justify-content:flex-end;opacity:1;}
  .prac-tabs{width:100%;}.pt-tab{flex:1;text-align:center;padding:10px 12px;font-size:12px;}
  .bento{gap:14px;}.bt-score{padding:32px 22px;min-height:200px;}.bts-val{font-size:44px;}.radar-canvas{height:250px;}.bt-detail{padding:20px;}
  .hero-ring{display:none;}.hero-line-art{display:none;}
  .report-actions{flex-direction:column;}
}
</style>
