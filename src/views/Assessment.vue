<template>
  <div class="assessment-page">
    <!-- Premium Hero -->
    <div class="page-hero">
      <div class="hero-bg-pattern" />
      <div class="hero-glow hero-glow-1" />
      <div class="hero-glow hero-glow-2" />
      <div class="hero-inner">
        <div class="hero-top">
          <div class="hero-text-group">
            <p class="hero-overline">ASTROPATH ASSESSMENT</p>
            <h1 class="hero-title">背景评估</h1>
            <p class="hero-subtitle">AI 智能解析背景，为你生成专属留学路线图</p>
            <div class="hero-accent-line" />
          </div>
          <div class="step-indicator-group">
            <div class="step-dots">
              <span
                v-for="(step, index) in steps"
                :key="'dot-'+index"
                class="step-dot"
                :class="{ active: index === currentStep, done: index < currentStep }"
              />
            </div>
            <span class="step-label-text">
              {{ steps[currentStep]?.label }} · Step {{ currentStep + 1 }}/{{ totalSteps }}
            </span>
          </div>
        </div>
        <div class="progress-bar-track">
          <div
            class="progress-bar-fill"
            :style="{ width: progressPercent + '%' }"
          />
        </div>
      </div>
    </div>

    <!-- Main Content: Step Sidebar + Form Area -->
    <div class="main-body">
      <!-- Step Sidebar - Timeline -->
      <aside class="step-sidebar">
        <div class="sidebar-header">
          <span class="sidebar-title">评估流程</span>
          <span class="sidebar-progress">{{ currentStep + 1 }}/{{ totalSteps }}</span>
        </div>
        <div class="timeline-track">
          <div
            class="timeline-line"
            :style="{ height: timelineProgress + '%' }"
          />
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="timeline-node"
            :class="{
              completed: index < currentStep,
              current: index === currentStep,
              pending: index > currentStep
            }"
            @click="jumpToStep(index)"
          >
            <div class="node-marker">
              <span class="node-icon">
                <template v-if="index < currentStep">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </template>
                <template v-else>{{ index + 1 }}</template>
              </span>
              <div v-if="index === currentStep" class="node-pulse" />
            </div>
            <span class="node-label">{{ step.label }}</span>
          </div>
        </div>
      </aside>

      <!-- Form Content -->
      <div class="form-area">
        <!-- Step 0: 基本信息 -->
        <section
          v-show="currentStep === 0"
          key="step-0"
          class="form-section"
        >
          <h2 class="form-section-title">学生基础信息</h2>
          <el-form
            ref="basicFormRef"
            :model="form.basic"
            :rules="basicRules"
            label-position="top"
            class="assessment-form"
          >
            <div class="form-row">
              <el-form-item
                label="姓名"
                prop="name"
              >
                <el-input
                  v-model="form.basic.name"
                  placeholder="请输入姓名"
                />
              </el-form-item>
              <el-form-item
                label="年龄"
                prop="age"
              >
                <el-input-number
                  v-model="form.basic.age"
                  :min="16"
                  :max="50"
                  controls-position="right"
                  style="width: 100%"
                />
              </el-form-item>
            </div>
            <el-form-item
              label="在读院校"
              prop="university"
            >
              <el-select
                v-model="form.basic.university"
                placeholder="请选择院校类型"
                style="width: 100%"
              >
                <el-option
                  label="985院校"
                  value="985"
                />
                <el-option
                  label="211院校"
                  value="211"
                />
                <el-option
                  label="普通本科"
                  value="regular"
                />
                <el-option
                  label="海外院校"
                  value="overseas"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="GPA"
              prop="gpa"
            >
              <div class="gpa-slider-wrap">
                <el-slider
                  v-model="form.basic.gpa"
                  :min="0"
                  :max="4"
                  :step="0.1"
                  show-stops
                  :show-tooltip="true"
                />
                <span class="gpa-display">{{ form.basic.gpa.toFixed(1) }}</span>
              </div>
            </el-form-item>
            <el-form-item
              label="语言成绩"
              prop="language"
            >
              <el-input
                v-model="form.basic.language"
                placeholder="如：雅思7.0 / 托福100"
              />
            </el-form-item>
          </el-form>
          <div class="form-actions">
            <button
              class="btn-primary"
              @click="nextStep"
            >
              下一步
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </section>

        <!-- Step 1: 学术背景 -->
        <section
          v-show="currentStep === 1"
          class="form-section"
        >
          <h2 class="form-section-title">学术背景</h2>
          <el-form
            :model="form.academic"
            label-position="top"
            class="assessment-form"
          >
            <el-form-item label="学历层次">
              <el-radio-group v-model="form.academic.degree">
                <el-radio-button label="本科" />
                <el-radio-button label="硕士" />
                <el-radio-button label="博士" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="专业方向（可多选）">
              <el-checkbox-group v-model="form.academic.majors">
                <el-checkbox-button label="理工" />
                <el-checkbox-button label="商科" />
                <el-checkbox-button label="人文" />
                <el-checkbox-button label="社科" />
                <el-checkbox-button label="艺术" />
              </el-checkbox-group>
            </el-form-item>
            <div class="form-row">
              <el-form-item label="均分">
                <el-input-number
                  v-model="form.academic.averageScore"
                  :min="0"
                  :max="100"
                  controls-position="right"
                  style="width: 100%"
                />
                <span class="score-suffix">/ 100</span>
              </el-form-item>
            </div>
            <el-form-item label="科研经历">
              <div class="list-header">
                <button
                  class="btn-secondary btn-sm"
                  @click="openResearchDialog"
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
                  ><path d="M12 5v14M5 12h14" /></svg>
                  添加科研经历
                </button>
              </div>
              <div
                v-if="form.academic.research.length === 0"
                class="empty-hint"
              >
                暂无科研经历，点击上方按钮添加
              </div>
              <div
                v-for="(item, index) in form.academic.research"
                :key="index"
                class="list-card"
              >
                <div class="list-card-body">
                  <strong>{{ item.name }}</strong>
                  <span class="list-meta">{{ item.role }} · {{ item.duration }}</span>
                  <p
                    v-if="item.achievements"
                    class="list-desc"
                  >{{ item.achievements }}</p>
                </div>
                <div class="list-card-actions">
                  <button
                    class="btn-ghost btn-sm"
                    @click="editResearch(index)"
                  >编辑</button>
                  <button
                    class="btn-ghost btn-sm btn-danger"
                    @click="removeResearch(index)"
                  >删除</button>
                </div>
              </div>
            </el-form-item>
          </el-form>
          <div class="form-actions">
            <button
              class="btn-secondary"
              @click="prevStep"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              上一步
            </button>
            <button
              class="btn-primary"
              @click="nextStep"
            >
              下一步
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </section>

        <!-- Step 2: 实践经历 -->
        <section
          v-show="currentStep === 2"
          class="form-section"
        >
          <h2 class="form-section-title">实践经历</h2>
          <el-tabs
            v-model="practiceTab"
            class="practice-tabs"
          >
            <el-tab-pane
              label="实习经历"
              name="internship"
            >
              <div class="tab-toolbar">
                <button
                  class="btn-secondary btn-sm"
                  @click="openInternshipDialog"
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
                  ><path d="M12 5v14M5 12h14" /></svg>
                  添加实习经历
                </button>
              </div>
              <div
                v-if="form.practice.internships.length === 0"
                class="empty-hint"
              >
                暂无实习经历，点击上方按钮添加
              </div>
              <div
                v-for="(item, index) in form.practice.internships"
                :key="'int-'+index"
                class="list-card"
              >
                <div class="list-card-body">
                  <div class="list-card-header">
                    <strong>{{ item.company }}</strong>
                    <span class="tag-inline">{{ item.position }}</span>
                  </div>
                  <div class="list-meta">
                    <span>{{ item.duration }}</span>
                    <span
                      v-if="item.description"
                      class="list-desc"
                    >{{ item.description }}</span>
                  </div>
                </div>
                <div class="list-card-actions">
                  <button
                    class="btn-ghost btn-sm"
                    @click="editInternship(index)"
                  >编辑</button>
                  <button
                    class="btn-ghost btn-sm btn-danger"
                    @click="deleteInternship(index)"
                  >删除</button>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane
              label="竞赛获奖"
              name="competition"
            >
              <div class="tab-toolbar">
                <button
                  class="btn-secondary btn-sm"
                  @click="openCompetitionDialog"
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
                  ><path d="M12 5v14M5 12h14" /></svg>
                  添加竞赛获奖
                </button>
              </div>
              <div
                v-if="form.practice.competitions.length === 0"
                class="empty-hint"
              >
                暂无竞赛记录，点击上方按钮添加
              </div>
              <div
                v-for="(item, index) in form.practice.competitions"
                :key="'comp-'+index"
                class="list-card"
              >
                <div class="list-card-body">
                  <div class="list-card-header">
                    <strong>{{ item.name }}</strong>
                    <span
                      class="tag-inline"
                      :class="'tag-' + getAwardLevelType(item.level)"
                    >{{ item.level }}</span>
                  </div>
                  <div class="list-meta">
                    <span>🏆 {{ item.award }}</span>
                    <span v-if="item.time">{{ item.time }}</span>
                  </div>
                </div>
                <div class="list-card-actions">
                  <button
                    class="btn-ghost btn-sm"
                    @click="editCompetition(index)"
                  >编辑</button>
                  <button
                    class="btn-ghost btn-sm btn-danger"
                    @click="deleteCompetition(index)"
                  >删除</button>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane
              label="志愿服务"
              name="volunteer"
            >
              <div class="tab-toolbar">
                <button
                  class="btn-secondary btn-sm"
                  @click="openVolunteerDialog"
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
                  ><path d="M12 5v14M5 12h14" /></svg>
                  添加志愿服务
                </button>
              </div>
              <div
                v-if="form.practice.volunteers.length === 0"
                class="empty-hint"
              >
                暂无志愿服务记录，点击上方按钮添加
              </div>
              <div
                v-for="(item, index) in form.practice.volunteers"
                :key="'vol-'+index"
                class="list-card"
              >
                <div class="list-card-body">
                  <div class="list-card-header">
                    <strong>{{ item.organization }}</strong>
                    <span class="tag-inline tag-success">{{ item.role }}</span>
                  </div>
                  <div class="list-meta">
                    <span>{{ item.duration }}</span>
                    <span
                      v-if="item.description"
                      class="list-desc"
                    >{{ item.description }}</span>
                  </div>
                </div>
                <div class="list-card-actions">
                  <button
                    class="btn-ghost btn-sm"
                    @click="editVolunteer(index)"
                  >编辑</button>
                  <button
                    class="btn-ghost btn-sm btn-danger"
                    @click="deleteVolunteer(index)"
                  >删除</button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="form-actions">
            <button
              class="btn-secondary"
              @click="prevStep"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              上一步
            </button>
            <div class="actions-right">
              <div
                v-if="providers.length > 0"
                class="provider-selector"
              >
                <el-dropdown
                  trigger="click"
                  @command="(cmd) => selectedProvider = cmd"
                >
                  <button class="btn-outline btn-sm">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /></svg>
                    {{ currentProviderName }}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
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
              <button
                v-else
                class="btn-accent btn-sm"
                @click="router.push('/ai-config')"
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
                ><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
                配置AI模型
              </button>
              <button
                class="btn-primary"
                :disabled="aiStream.isLoading"
                @click="generateReport"
              >
                <svg
                  v-if="!aiStream.isLoading"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                <span v-if="aiStream.isLoading">生成中...</span>
                <span v-else>生成评估报告</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Step 3: 评估报告 -->
        <section
          v-show="currentStep === 3"
          class="form-section report-section"
        >
          <div
            v-if="aiStream.isConnecting && !aiStream.hasContent"
            class="report-loading"
          >
            <div class="loading-spinner" />
            <p>{{ activeStream.waitingText || '正在连接 AI 服务...' }}</p>
          </div>

          <template v-if="!aiStream.isConnecting || aiStream.hasContent">
            <!-- AI深度分析区域 -->
            <div
              class="ai-analysis-block"
              :class="{
                'status-analyzing': aiStream.isLoading,
                'status-complete': aiStream.content && !aiStream.isLoading,
                'status-error': aiStream.error,
                'status-waiting': !aiStream.isLoading && !aiStream.content && !aiStream.error
              }"
            >
              <div
                class="ai-block-header"
                @click="showAiSection = !showAiSection"
              >
                <div class="ai-block-left">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /></svg>
                  <span>AI 深度分析</span>
                </div>
                <div class="ai-block-right">
                  <span class="status-tag">{{ showAiSection ? '收起' : '展开' }}</span>
                  <svg
                    class="chevron-icon"
                    :class="{ rotated: showAiSection }"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ><path d="M18 15l-6-6-6 6" /></svg>
                </div>
              </div>

              <div
                v-show="showAiSection"
                class="ai-block-body"
              >
                <div
                  v-if="aiStream.isThinking && !aiStream.content && !aiStream.reasoning"
                  class="ai-thinking"
                >
                  <div class="thinking-dots">
                    <span /><span /><span />
                  </div>
                  <p class="thinking-text">AI 正在启动深度分析...</p>
                  <p class="thinking-sub">思考型模型会先分析您的背景，再生成更有针对性的建议</p>
                  <button
                    v-if="activeStream.stopButtonVisible"
                    class="btn-ghost btn-sm"
                    style="margin-top: 16px"
                    @click="stopAIAnalysis"
                  >停止生成</button>
                </div>

                <div
                  v-if="aiStream.reasoning"
                  class="reasoning-block"
                >
                  <div
                    class="reasoning-head"
                    @click="showReasoning = !showReasoning"
                  >
                    <span>
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
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <path d="M9 9h6v6H9z" />
                      </svg> 思考过程</span>
                    <span class="status-tag sm">{{ showReasoning ? '收起' : '展开' }}</span>
                  </div>
                  <div
                    v-show="showReasoning"
                    ref="reasoningContentRef"
                    class="reasoning-body"
                    @scroll="aiStream.handleUserScroll"
                  >
                    {{ aiStream.reasoning }}
                  </div>
                </div>

                <div
                  v-if="aiStream.content || (aiStream.isLoading && aiStream.content)"
                  class="content-block"
                >
                  <div
                    class="content-head"
                    @click="showAiContent = !showAiContent"
                  >
                    <span>
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
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg> 分析报告</span>
                    <div style="display:flex;align-items:center;gap:8px">
                      <button
                        v-if="aiStream.isLoading && activeStream.stopButtonVisible"
                        class="btn-ghost btn-sm"
                        style="padding:2px 10px;font-size:11px;background:var(--color-danger-bg);color:var(--color-danger)"
                        @click.stop="stopAIAnalysis"
                      >停止</button>
                      <span class="status-tag sm">{{ showAiContent ? '收起' : '展开' }}</span>
                    </div>
                  </div>
                  <div
                    v-show="showAiContent"
                    class="content-body"
                  >
                    <div
                      class="ai-markdown"
                      v-html="renderAiContent(aiStream.content)"
                    />
                    <span
                      v-if="aiStream.isStreaming"
                      class="typing-cursor"
                    />
                  </div>
                </div>

                <div
                  v-else-if="aiStream.error"
                  class="error-block"
                >
                  <p class="error-title">分析失败</p>
                  <p class="error-msg">{{ aiStream.error }}</p>
                  <button
                    v-if="activeStream.canRetry"
                    class="btn-primary btn-sm"
                    @click="retryAIAnalysis"
                  >重新分析</button>
                </div>

                <div
                  v-else-if="!selectedProvider"
                  class="placeholder-block"
                >
                  <p>未配置 AI 模型，无法进行深度分析</p>
                  <button
                    class="btn-primary btn-sm"
                    @click="router.push('/ai-config')"
                  >去配置</button>
                </div>
              </div>
            </div>

            <!-- 评分概览 -->
            <div class="score-overview">
              <div class="score-value">{{ overallScore.toFixed(1) }}</div>
              <div class="score-label">竞争力总分 / 5.0</div>
              <div class="score-bar-track">
                <div
                  class="score-bar-fill"
                  :style="{ width: (overallScore / 5 * 100) + '%' }"
                />
              </div>
            </div>

            <!-- GPA & 语言分析卡片 -->
            <div class="analysis-grid">
              <div class="analysis-card">
                <div class="analysis-card-header">
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
                  <span>GPA 评级</span>
                </div>
                <div class="analysis-card-body">
                  <div class="analysis-stat">
                    <span class="stat-num">{{ form.basic.gpa.toFixed(1) }}</span>
                    <span
                      class="stat-grade"
                      :class="getGpaGradeClass(form.basic.gpa)"
                    >{{ getGpaGrade(form.basic.gpa) }}</span>
                  </div>
                  <p class="analysis-note">{{ getGpaComment(form.basic.gpa, form.basic.university) }}</p>
                </div>
              </div>
              <div class="analysis-card">
                <div class="analysis-card-header">
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
                  <span>语言成绩分析</span>
                </div>
                <div class="analysis-card-body">
                  <div class="analysis-stat">
                    <span class="stat-num">{{ form.basic.language || '未填写' }}</span>
                    <span
                      class="stat-grade"
                      :class="getLanguageScoreClass()"
                    >{{ getLanguageLevel() }}</span>
                  </div>
                  <p class="analysis-note">{{ getLanguageComment() }}</p>
                </div>
              </div>
            </div>

            <!-- 雷达图 -->
            <div
              ref="radarRef"
              class="radar-chart"
            />

            <!-- 详细分析列表 -->
            <div class="detail-list">
              <h3 class="detail-title">详细分析</h3>
              <div
                v-for="item in detailItems"
                :key="item.key"
                class="detail-item"
              >
                <div class="detail-label">{{ item.label }}</div>
                <div class="detail-score">
                  <span class="score-num">{{ item.score.toFixed(1) }}</span>
                  <span class="score-max">/5</span>
                </div>
                <div class="detail-bar-track">
                  <div
                    class="detail-bar-fill"
                    :style="{ width: (item.score / 5 * 100) + '%' }"
                  />
                </div>
                <p class="detail-comment">{{ item.comment }}</p>
              </div>
            </div>

            <div class="form-actions">
              <button
                class="btn-primary"
                @click="saveReport"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                保存评估结果
              </button>
              <button
                class="btn-ghost"
                @click="resetForm"
              >重新填写</button>
            </div>
          </template>
        </section>
      </div>
    </div>

    <!-- Dialogs -->
    <el-dialog
      v-model="researchDialogVisible"
      :title="isEditingResearch ? '编辑科研经历' : '添加科研经历'"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="researchFormRef"
        :model="currentResearch"
        :rules="researchRules"
        label-position="top"
        class="dialog-form"
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
        <el-form-item
          label="担任角色"
          prop="role"
        >
          <el-input
            v-model="currentResearch.role"
            placeholder="如：项目负责人、核心成员、参与者"
          />
        </el-form-item>
        <el-form-item
          label="项目时长"
          prop="duration"
        >
          <el-input
            v-model="currentResearch.duration"
            placeholder="如：3个月、半年、1年"
          />
        </el-form-item>
        <el-form-item
          label="项目成果"
          prop="achievements"
        >
          <el-input
            v-model="currentResearch.achievements"
            type="textarea"
            :rows="3"
            placeholder="描述项目成果、发表论文、获奖情况等"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <button
          class="btn-ghost"
          @click="closeResearchDialog"
        >取消</button>
        <button
          class="btn-primary"
          @click="saveResearch"
        >保存</button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="internshipDialogVisible"
      :title="isEditingInternship ? '编辑实习经历' : '添加实习经历'"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="internshipFormRef"
        :model="currentInternship"
        :rules="internshipRules"
        label-position="top"
        class="dialog-form"
      >
        <el-form-item
          label="公司名称"
          prop="company"
        >
          <el-input
            v-model="currentInternship.company"
            placeholder="请输入公司名称"
          />
        </el-form-item>
        <el-form-item
          label="职位名称"
          prop="position"
        >
          <el-input
            v-model="currentInternship.position"
            placeholder="如：前端工程师实习生、数据分析实习生"
          />
        </el-form-item>
        <el-form-item
          label="实习时长"
          prop="duration"
        >
          <el-input
            v-model="currentInternship.duration"
            placeholder="如：3个月、6个月、1年"
          />
        </el-form-item>
        <el-form-item
          label="工作描述"
          prop="description"
        >
          <el-input
            v-model="currentInternship.description"
            type="textarea"
            :rows="3"
            placeholder="简要描述工作内容和收获（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <button
          class="btn-ghost"
          @click="closeInternshipDialog"
        >取消</button>
        <button
          class="btn-primary"
          @click="saveInternship"
        >保存</button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="competitionDialogVisible"
      :title="isEditingCompetition ? '编辑竞赛记录' : '添加竞赛获奖'"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="competitionFormRef"
        :model="currentCompetition"
        :rules="competitionRules"
        label-position="top"
        class="dialog-form"
      >
        <el-form-item
          label="竞赛名称"
          prop="name"
        >
          <el-input
            v-model="currentCompetition.name"
            placeholder="请输入竞赛名称"
          />
        </el-form-item>
        <el-form-item
          label="竞赛级别"
          prop="level"
        >
          <el-select
            v-model="currentCompetition.level"
            placeholder="请选择级别"
            style="width: 100%"
          >
            <el-option
              label="国家级"
              value="国家级"
            />
            <el-option
              label="省级"
              value="省级"
            />
            <el-option
              label="校级"
              value="校级"
            />
            <el-option
              label="其他"
              value="其他"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="获奖情况"
          prop="award"
        >
          <el-input
            v-model="currentCompetition.award"
            placeholder="如：一等奖、银奖、优秀奖"
          />
        </el-form-item>
        <el-form-item
          label="参赛时间"
          prop="time"
        >
          <el-input
            v-model="currentCompetition.time"
            placeholder="如：2024年3月（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <button
          class="btn-ghost"
          @click="closeCompetitionDialog"
        >取消</button>
        <button
          class="btn-primary"
          @click="saveCompetition"
        >保存</button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="volunteerDialogVisible"
      :title="isEditingVolunteer ? '编辑志愿服务' : '添加志愿服务'"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="volunteerFormRef"
        :model="currentVolunteer"
        :rules="volunteerRules"
        label-position="top"
        class="dialog-form"
      >
        <el-form-item
          label="组织名称"
          prop="organization"
        >
          <el-input
            v-model="currentVolunteer.organization"
            placeholder="请输入服务组织名称"
          />
        </el-form-item>
        <el-form-item
          label="志愿岗位"
          prop="role"
        >
          <el-input
            v-model="currentVolunteer.role"
            placeholder="如：活动志愿者、支教老师、社区服务"
          />
        </el-form-item>
        <el-form-item
          label="服务时长"
          prop="duration"
        >
          <el-input
            v-model="currentVolunteer.duration"
            placeholder="如：20小时、1个月"
          />
        </el-form-item>
        <el-form-item
          label="服务描述"
          prop="description"
        >
          <el-input
            v-model="currentVolunteer.description"
            type="textarea"
            :rows="3"
            placeholder="简要描述服务内容和感受（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <button
          class="btn-ghost"
          @click="closeVolunteerDialog"
        >取消</button>
        <button
          class="btn-primary"
          @click="saveVolunteer"
        >保存</button>
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

const router = useRouter()
const currentStep = ref(0)
const practiceTab = ref('internship')
const basicFormRef = ref(null)
const radarRef = ref(null)
const reasoningContentRef = ref(null)
let radarChart = null

const steps = [
  { label: '基本信息' },
  { label: '学术背景' },
  { label: '实践经历' },
  { label: '评估报告' }
]
const totalSteps = computed(() => steps.length)
const progressPercent = computed(() => ((currentStep.value) / (totalSteps.value - 1)) * 100)
const timelineProgress = computed(() => (currentStep.value / (totalSteps.value - 1)) * 100)

const researchDialogVisible = ref(false)
const isEditingResearch = ref(false)
const editingResearchIndex = ref(-1)
const researchFormRef = ref(null)

const internshipDialogVisible = ref(false)
const isEditingInternship = ref(false)
const editingInternshipIndex = ref(-1)
const internshipFormRef = ref(null)

const competitionDialogVisible = ref(false)
const isEditingCompetition = ref(false)
const editingCompetitionIndex = ref(-1)
const competitionFormRef = ref(null)

const volunteerDialogVisible = ref(false)
const isEditingVolunteer = ref(false)
const editingVolunteerIndex = ref(-1)
const volunteerFormRef = ref(null)

const basicRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  university: [{ required: true, message: '请选择院校', trigger: 'change' }],
  gpa: [{ required: true, message: '请选择GPA', trigger: 'change' }]
}

const researchRules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  role: [{ required: true, message: '请选择担任角色', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入项目时长', trigger: 'blur' }]
}

const internshipRules = {
  company: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  position: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入实习时长', trigger: 'blur' }]
}

const competitionRules = {
  name: [{ required: true, message: '请输入竞赛名称', trigger: 'blur' }],
  level: [{ required: true, message: '请选择竞赛级别', trigger: 'change' }],
  award: [{ required: true, message: '请输入获奖情况', trigger: 'blur' }]
}

const volunteerRules = {
  organization: [{ required: true, message: '请输入服务组织名称', trigger: 'blur' }],
  role: [{ required: true, message: '请输入志愿岗位', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入服务时长', trigger: 'blur' }]
}

const currentInternship = reactive({
  company: '',
  position: '',
  duration: '',
  description: ''
})

const currentCompetition = reactive({
  name: '',
  level: '国家级',
  award: '',
  time: ''
})

const currentVolunteer = reactive({
  organization: '',
  role: '',
  duration: '',
  description: ''
})

const form = reactive({
  basic: {
    name: '',
    age: 22,
    university: '',
    gpa: 3.0,
    language: ''
  },
  academic: {
    degree: '本科',
    majors: [],
    averageScore: 80,
    research: []
  },
  practice: {
    internships: [],
    competitions: [],
    volunteers: []
  }
})

const currentResearch = reactive({
  name: '',
  role: '',
  duration: '',
  achievements: ''
})

const overallScore = computed(() => {
  const scores = [academicScore.value, languageScore.value, researchScore.value, practiceScore.value]
  return scores.reduce((a, b) => a + b, 0) / scores.length
})

const languageScore = computed(() => {
  const lang = form.basic.language
  if (!lang) return 2.5
  if (lang.includes('雅思') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 7) return 5
  if (lang.includes('托福') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 100) return 5
  return 3
})

const academicScore = computed(() => {
  const uniScore = { '985': 1.5, '211': 1.2, 'regular': 1, 'overseas': 1.3 }
  const score1 = uniScore[form.basic.university] || 1
  const score2 = form.academic.averageScore / 100 * 3
  return score1 + score2
})

const researchScore = computed(() => {
  return Math.min(form.academic.research.length * 1.5, 5)
})

const practiceScore = computed(() => {
  const total = form.practice.internships.length + form.practice.competitions.length + form.practice.volunteers.length
  return Math.min(total * 1.2, 5)
})

const detailItems = computed(() => [
  { key: 'academic', label: '学术能力', score: academicScore.value, comment: getAcademicComment() },
  { key: 'language', label: '语言能力', score: languageScore.value, comment: getLanguageComment() },
  { key: 'research', label: '科研经历', score: researchScore.value, comment: getResearchComment() },
  { key: 'practice', label: '实践背景', score: practiceScore.value, comment: getPracticeComment() }
])

const jumpToStep = (index) => {
  if (index <= currentStep.value) currentStep.value = index
}

const nextStep = async () => {
  if (currentStep.value === 0) {
    if (basicFormRef.value) {
      await basicFormRef.value.validate((valid) => {
        if (valid) {
          currentStep.value++
        } else {
          ElMessage.warning('请完善必填字段')
        }
      })
    } else {
      currentStep.value++
    }
  } else {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--
}

const openResearchDialog = () => {
  isEditingResearch.value = false
  editingResearchIndex.value = -1
  resetResearchForm()
  researchDialogVisible.value = true
}

const editResearch = (index) => {
  const item = form.academic.research[index]
  currentResearch.name = item.name
  currentResearch.role = item.role
  currentResearch.duration = item.duration
  currentResearch.achievements = item.achievements || ''
  isEditingResearch.value = true
  editingResearchIndex.value = index
  researchDialogVisible.value = true
}

const saveResearch = async () => {
  await researchFormRef.value.validate((valid) => {
    if (valid) {
      if (isEditingResearch.value) {
        const index = editingResearchIndex.value
        form.academic.research[index] = {
          ...form.academic.research[index],
          name: currentResearch.name,
          role: currentResearch.role,
          duration: currentResearch.duration,
          achievements: currentResearch.achievements
        }
        ElMessage.success('科研经历已更新')
      } else {
        form.academic.research.push({
          name: currentResearch.name,
          role: currentResearch.role,
          duration: currentResearch.duration,
          achievements: currentResearch.achievements
        })
        ElMessage.success('科研经历已添加')
      }
      closeResearchDialog()
    }
  })
}

const closeResearchDialog = () => {
  researchDialogVisible.value = false
  resetResearchForm()
}

const resetResearchForm = () => {
  currentResearch.name = ''
  currentResearch.role = ''
  currentResearch.duration = ''
  currentResearch.achievements = ''
}

const removeResearch = (index) => {
  ElMessageBox.confirm('确定要删除这条科研经历吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    form.academic.research.splice(index, 1)
    ElMessage.success('已删除')
  }).catch(() => {})
}

const openInternshipDialog = () => {
  isEditingInternship.value = false
  editingInternshipIndex.value = -1
  resetInternshipForm()
  internshipDialogVisible.value = true
}

const editInternship = (index) => {
  const item = form.practice.internships[index]
  currentInternship.company = item.company
  currentInternship.position = item.position
  currentInternship.duration = item.duration
  currentInternship.description = item.description || ''
  isEditingInternship.value = true
  editingInternshipIndex.value = index
  internshipDialogVisible.value = true
}

const saveInternship = async () => {
  await internshipFormRef.value.validate((valid) => {
    if (valid) {
      if (isEditingInternship.value) {
        const index = editingInternshipIndex.value
        form.practice.internships[index] = {
          ...form.practice.internships[index],
          company: currentInternship.company,
          position: currentInternship.position,
          duration: currentInternship.duration,
          description: currentInternship.description
        }
        ElMessage.success('实习经历已更新')
      } else {
        form.practice.internships.push({
          company: currentInternship.company,
          position: currentInternship.position,
          duration: currentInternship.duration,
          description: currentInternship.description
        })
        ElMessage.success('实习经历已添加')
      }
      closeInternshipDialog()
    }
  })
}

const closeInternshipDialog = () => {
  internshipDialogVisible.value = false
  resetInternshipForm()
}

const resetInternshipForm = () => {
  currentInternship.company = ''
  currentInternship.position = ''
  currentInternship.duration = ''
  currentInternship.description = ''
}

const deleteInternship = (index) => {
  ElMessageBox.confirm('确定要删除这条实习经历吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    form.practice.internships.splice(index, 1)
    ElMessage.success('已删除')
  }).catch(() => {})
}

const openCompetitionDialog = () => {
  isEditingCompetition.value = false
  editingCompetitionIndex.value = -1
  resetCompetitionForm()
  competitionDialogVisible.value = true
}

const editCompetition = (index) => {
  const item = form.practice.competitions[index]
  currentCompetition.name = item.name
  currentCompetition.level = item.level
  currentCompetition.award = item.award
  currentCompetition.time = item.time || ''
  isEditingCompetition.value = true
  editingCompetitionIndex.value = index
  competitionDialogVisible.value = true
}

const saveCompetition = async () => {
  await competitionFormRef.value.validate((valid) => {
    if (valid) {
      if (isEditingCompetition.value) {
        const index = editingCompetitionIndex.value
        form.practice.competitions[index] = {
          ...form.practice.competitions[index],
          name: currentCompetition.name,
          level: currentCompetition.level,
          award: currentCompetition.award,
          time: currentCompetition.time
        }
        ElMessage.success('竞赛记录已更新')
      } else {
        form.practice.competitions.push({
          name: currentCompetition.name,
          level: currentCompetition.level,
          award: currentCompetition.award,
          time: currentCompetition.time
        })
        ElMessage.success('竞赛记录已添加')
      }
      closeCompetitionDialog()
    }
  })
}

const closeCompetitionDialog = () => {
  competitionDialogVisible.value = false
  resetCompetitionForm()
}

const resetCompetitionForm = () => {
  currentCompetition.name = ''
  currentCompetition.level = '国家级'
  currentCompetition.award = ''
  currentCompetition.time = ''
}

const deleteCompetition = (index) => {
  ElMessageBox.confirm('确定要删除这条竞赛记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    form.practice.competitions.splice(index, 1)
    ElMessage.success('已删除')
  }).catch(() => {})
}

const openVolunteerDialog = () => {
  isEditingVolunteer.value = false
  editingVolunteerIndex.value = -1
  resetVolunteerForm()
  volunteerDialogVisible.value = true
}

const editVolunteer = (index) => {
  const item = form.practice.volunteers[index]
  currentVolunteer.organization = item.organization
  currentVolunteer.role = item.role
  currentVolunteer.duration = item.duration
  currentVolunteer.description = item.description || ''
  isEditingVolunteer.value = true
  editingVolunteerIndex.value = index
  volunteerDialogVisible.value = true
}

const saveVolunteer = async () => {
  await volunteerFormRef.value.validate((valid) => {
    if (valid) {
      if (isEditingVolunteer.value) {
        const index = editingVolunteerIndex.value
        form.practice.volunteers[index] = {
          ...form.practice.volunteers[index],
          organization: currentVolunteer.organization,
          role: currentVolunteer.role,
          duration: currentVolunteer.duration,
          description: currentVolunteer.description
        }
        ElMessage.success('志愿服务已更新')
      } else {
        form.practice.volunteers.push({
          organization: currentVolunteer.organization,
          role: currentVolunteer.role,
          duration: currentVolunteer.duration,
          description: currentVolunteer.description
        })
        ElMessage.success('志愿服务已添加')
      }
      closeVolunteerDialog()
    }
  })
}

const closeVolunteerDialog = () => {
  volunteerDialogVisible.value = false
  resetVolunteerForm()
}

const resetVolunteerForm = () => {
  currentVolunteer.organization = ''
  currentVolunteer.role = ''
  currentVolunteer.duration = ''
  currentVolunteer.description = ''
}

const deleteVolunteer = (index) => {
  ElMessageBox.confirm('确定要删除这条志愿服务记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    form.practice.volunteers.splice(index, 1)
    ElMessage.success('已删除')
  }).catch(() => {})
}

const getAwardLevelType = (level) => {
  const types = { '国家级': 'danger', '省级': 'warning', '校级': 'primary', '其他': 'info' }
  return types[level] || 'info'
}

const getGpaGrade = (gpa) => {
  if (gpa >= 3.8) return '优秀'
  if (gpa >= 3.5) return '良好'
  if (gpa >= 3.0) return '中等'
  if (gpa >= 2.5) return '及格'
  return '需提升'
}

const getGpaGradeClass = (gpa) => {
  if (gpa >= 3.8) return 'grade-excellent'
  if (gpa >= 3.5) return 'grade-good'
  if (gpa >= 3.0) return 'grade-medium'
  if (gpa >= 2.5) return 'grade-pass'
  return 'grade-low'
}

const getGpaComment = (gpa, university) => {
  const uniComment = university === '985' ? '985院校背景加分' : university === '211' ? '211院校背景加分' : ''
  if (gpa >= 3.8) return `您的GPA表现非常出色，${uniComment}在申请中具有很强竞争力。`
  if (gpa >= 3.5) return `您的GPA表现良好，${uniComment}申请大多数项目都有不错机会。`
  if (gpa >= 3.0) return `您的GPA处于中等水平，建议通过其他经历弥补。`
  return `您的GPA相对较低，需要重点突出其他优势或考虑提升路径。`
}

const getLanguageLevel = () => {
  const lang = form.basic.language
  if (!lang) return '未评估'
  if (lang.includes('雅思') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 7) return '优秀'
  if (lang.includes('托福') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 100) return '优秀'
  if (lang.includes('雅思') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 6.5) return '良好'
  if (lang.includes('托福') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 90) return '良好'
  return '需提升'
}

const getLanguageScoreClass = () => {
  const level = getLanguageLevel()
  return level === '优秀' ? 'score-excellent' : level === '良好' ? 'score-good' : 'score-low'
}

const getLanguageComment = () => {
  const lang = form.basic.language
  if (!lang) return '请填写语言成绩以获取详细评估。'
  if (lang.includes('雅思') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 7) return '雅思7分以上满足大部分TOP院校要求。'
  if (lang.includes('托福') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 100) return '托福100分以上竞争力很强。'
  if (lang.includes('雅思') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 6.5) return '雅思6.5分可申请多数院校，建议冲刺更高。'
  if (lang.includes('托福') && parseFloat(lang.match(/\d+/)?.[0] || 0) >= 90) return '托福90分基本达标，建议争取更高分数。'
  return '当前语言成绩可能不足，建议备考或考虑语言课程。'
}

const getAcademicComment = () => {
  const score = academicScore.value
  if (score >= 4) return '学术背景非常优秀，申请优势明显。'
  if (score >= 3) return '学术背景良好，具备一定竞争力。'
  if (score >= 2) return '学术背景中等，建议补充其他优势。'
  return '学术背景较弱，需要重点突出其他亮点。'
}

const getResearchComment = () => {
  const count = form.academic.research.length
  if (count >= 3) return '科研经历丰富，展现了研究能力。'
  if (count >= 1) return '有一定科研基础，可进一步深化。'
  return '建议增加科研经历以提升竞争力。'
}

const getPracticeComment = () => {
  const total = form.practice.internships.length + form.practice.competitions.length + form.practice.volunteers.length
  if (total >= 5) return '实践经历丰富，展现了综合能力。'
  if (total >= 3) return '有一定实践经验，可继续积累。'
  if (total >= 1) return '实践经验较少，建议补充。'
  return '实践经历空白，强烈建议补充。'
}

const aiStream = useAIStream({
  taskId: 'assessment-analysis',
  enableThinking: true,
  autoScroll: true,
  autoRestore: false,
  scrollContainer: () => reasoningContentRef.value,
  onComplete: (_content, _reasoning) => {
    showAiSection.value = true
    showAiContent.value = true
  }
})

const activeStream = useActiveStream({ actions: { feedback: false }, taskId: 'assessment-analysis' })

aiStream.reset()

const selectedProvider = ref(null)

const providers = computed(() => {
  const saved = localStorage.getItem('ai_providers')
  return saved ? JSON.parse(saved) : []
})

const currentProviderName = computed(() => {
  const provider = providers.value.find(p => p.id === selectedProvider.value)
  return provider ? provider.name : '选择AI模型'
})

const loadProviders = () => {
  const saved = localStorage.getItem('ai_providers')
  if (saved) {
    const parsed = JSON.parse(saved)
    if (parsed.length > 0) {
      selectedProvider.value = parsed[0].id
    }
  }
}

const showReasoning = ref(true)
const showAiContent = ref(true)
const showAiSection = ref(true)

const generateReport = async () => {
  aiStream.reset()
  await new Promise(resolve => setTimeout(resolve, 500))
  currentStep.value = 3

  await nextTick()
  renderRadarChart()

  if (selectedProvider.value) {
    await callAIAnalysis()
  }
}

const callAIAnalysis = async () => {
  const scores = {
    overall: overallScore.value,
    academic: academicScore.value,
    language: languageScore.value,
    research: researchScore.value,
    practice: practiceScore.value
  }

  const prompt = buildAssessmentPrompt(form, scores)

  const messages = [
    { role: 'user', content: prompt }
  ]

  try {
    await aiStream.generateWithProvider(selectedProvider.value, messages)
  } catch (_e) {
  }
}

const retryAIAnalysis = () => {
  activeStream.handleRetry()
}

const stopAIAnalysis = () => {
  aiStream.stop()
  activeStream.stopGeneration()
}

const renderAiContent = (content) => {
  if (!content || typeof content !== 'string') return ''
  return renderMarkdown(content)
}

const renderRadarChart = () => {
  if (!radarRef.value) return
  if (radarChart) radarChart.dispose()

  radarChart = echarts.init(radarRef.value)

  const chartData = [
    academicScore.value,
    languageScore.value,
    researchScore.value,
    practiceScore.value,
    overallScore.value
  ]

  radarChart.setOption({
    title: {
      text: '竞争力雷达图',
      left: 'center',
      top: 0,
      textStyle: {
        fontSize: 16,
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        lineHeight: 24
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const data = params.value
        const indicators = ['学术能力', '语言能力', '科研经历', '实践背景', '综合实力']
        let html = '<div style="font-weight:600;margin-bottom:6px;">各维度得分</div>'
        indicators.forEach((name, index) => {
          html += `<div style="display:flex;justify-content:space-between;gap:16px;font-size:13px;">
            <span>${name}</span>
            <span style="font-weight:600;color:var(--color-solid);">${data[index].toFixed(1)}/5.0</span>
          </div>`
        })
        return html
      },
      backgroundColor: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
      borderWidth: 1,
      borderRadius: 8,
      textStyle: { color: 'var(--color-text-primary)', fontSize: 12 },
      padding: [10, 14],
      extraCssText: 'box-shadow: var(--shadow-lg);'
    },
    radar: {
      indicator: [
        { name: '学术能力', max: 5 },
        { name: '语言能力', max: 5 },
        { name: '科研经历', max: 5 },
        { name: '实践背景', max: 5 },
        { name: '综合实力', max: 5 }
      ],
      center: ['50%', '58%'],
      shape: 'polygon',
      splitNumber: 5,
      splitArea: {
        show: true,
        areaStyle: {
          color: ['var(--color-slate-50)', 'rgba(241,245,249,0.6)',
                 'rgba(226,232,240,0.5)', 'rgba(203,213,225,0.4)',
                 'rgba(148,163,184,0.3)']
        }
      },
      splitLine: { lineStyle: { color: 'var(--color-border)' } },
      axisLine: { lineStyle: { color: 'var(--color-border)' } },
      axisName: {
        color: 'var(--color-text-secondary)',
        fontSize: 13,
        fontWeight: 600,
        padding: [3, 5]
      }
    },
    series: [{
      name: '竞争力',
      type: 'radar',
      data: [{
        value: chartData,
        name: '当前评估',
        areaStyle: { color: 'rgba(15, 23, 42, 0.12)' },
        lineStyle: { width: 2, color: 'var(--color-solid)' },
        itemStyle: {
          color: 'var(--color-solid)',
          borderWidth: 2,
          borderColor: '#fff'
        }
      }],
      animationDuration: 800,
      animationEasing: 'cubicOut'
    }]
  })
}

const handleResize = () => {
  if (radarChart) radarChart.resize()
}

const saveReport = () => {
  const report = {
    ...form,
    scores: {
      overall: overallScore.value,
      academic: academicScore.value,
      language: languageScore.value,
      research: researchScore.value,
      practice: practiceScore.value
    },
    savedAt: new Date().toISOString()
  }
  localStorage.setItem('assessment_report', JSON.stringify(report))
  ElMessage.success('评估报告已保存')
}

const resetForm = () => {
  ElMessageBox.confirm('确定要重新填写吗？当前数据将丢失', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    isResetting.value = true
    form.basic.name = ''
    form.basic.age = 22
    form.basic.university = ''
    form.basic.gpa = 3.0
    form.basic.language = ''
    form.academic.degree = '本科'
    form.academic.majors = []
    form.academic.averageScore = 80
    form.academic.research = []
    form.practice.internships = []
    form.practice.competitions = []
    form.practice.volunteers = []
    aiStream.reset()
    showAiSection.value = true
    showReasoning.value = true
    showAiContent.value = true
    currentStep.value = 0
    practiceTab.value = 'internship'
    localStorage.removeItem('assessment_form')
    setTimeout(() => { isResetting.value = false }, 0)
  }).catch(() => {})
}

let isLoaded = false
const isResetting = ref(false)

const loadFromStorage = async () => {
  const saved = localStorage.getItem('assessment_form')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      if (data.form) {
        Object.assign(form.basic, data.form.basic || {})
        Object.assign(form.academic, data.academic || {})
        Object.assign(form.practice, data.practice || {})
      }
      if (typeof data.currentStep === 'number') currentStep.value = data.currentStep
      if (data.practiceTab) practiceTab.value = data.practiceTab
      if (typeof data.showReasoning === 'boolean') showReasoning.value = data.showReasoning
      if (typeof data.showAiContent === 'boolean') showAiContent.value = data.showAiContent
      if (typeof data.showAiSection === 'boolean') showAiSection.value = data.showAiSection
    } catch (_e) {}
  }
  isLoaded = true

  if (currentStep.value === 3) {
    await nextTick()
    renderRadarChart()
  }
}

watch(
  [form, currentStep, practiceTab, showReasoning, showAiContent, showAiSection],
  () => {
    if (!isLoaded || isResetting.value) return
    const formData = {
      form: {
        basic: { ...form.basic },
        academic: { ...form.academic },
        practice: {
          internships: [...form.practice.internships],
          competitions: [...form.practice.competitions],
          volunteers: [...form.practice.volunteers]
        }
      },
      currentStep: currentStep.value,
      practiceTab: practiceTab.value,
      showReasoning: showReasoning.value,
      showAiContent: showAiContent.value,
      showAiSection: showAiSection.value
    }
    localStorage.setItem('assessment_form', JSON.stringify(formData))
    if (form.basic.name || form.basic.university) {
      const report = {
        ...form,
        scores: {
          overall: overallScore.value,
          academic: academicScore.value,
          language: languageScore.value,
          research: researchScore.value,
          practice: practiceScore.value
        },
        savedAt: new Date().toISOString()
      }
      localStorage.setItem('assessment_report', JSON.stringify(report))
    }
  },
  { deep: true }
)

onMounted(() => {
  window.addEventListener('resize', handleResize)
  loadFromStorage()
  loadProviders()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (radarChart) {
    radarChart.dispose()
    radarChart = null
  }
})
</script>

<style scoped>
/* ====== 🎨 AstroPath Assessment — Premium Design System ====== */

/* ====== Page Container ====== */
.assessment-page {
  width: 100%;
  min-height: 100vh;
  background: #FFFFFF;
  position: relative;
  overflow-x: hidden;
}

/* ====== Premium Hero ====== */
.page-hero {
  position: relative;
  width: 100%;
  padding: 80px 48px 48px;
  background: linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  overflow: hidden;
}

.hero-bg-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.03) 1px, transparent 0);
  background-size: 32px 32px;
  pointer-events: none;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  opacity: 0.4;
}

.hero-glow-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.08), transparent 70%);
  top: -120px;
  right: 10%;
  animation: glow-drift-1 12s ease-in-out infinite alternate;
}

.hero-glow-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(15, 23, 42, 0.04), transparent 70%);
  bottom: -80px;
  left: 5%;
  animation: glow-drift-2 15s ease-in-out infinite alternate-reverse;
}

@keyframes glow-drift-1 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(30px, -20px); }
}

@keyframes glow-drift-2 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-20px, 15px); }
}

.hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
}

.hero-text-group {
  max-width: 520px;
}

.hero-overline {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  margin: 0 0 16px 0;
  font-family: var(--font-family-mono);
}

.hero-title {
  font-size: 42px;
  font-weight: 800;
  color: var(--color-solid);
  letter-spacing: -1.5px;
  line-height: 1.1;
  margin: 0 0 16px 0;
  font-family: var(--font-family-base);
}

.hero-subtitle {
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 20px 0;
  font-weight: 400;
}

.hero-accent-line {
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light));
  border-radius: 2px;
  position: relative;
}

.hero-accent-line::after {
  content: '';
  position: absolute;
  right: -4px;
  top: -3px;
  width: 10px;
  height: 10px;
  background: var(--color-accent-light);
  border-radius: 50%;
  opacity: 0.5;
}

/* Step Indicator Group (right side of hero) */
.step-indicator-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
  flex-shrink: 0;
}

.step-dots {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-slate-200);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.step-dot.active {
  width: 28px;
  border-radius: 4px;
  background: var(--color-solid);
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
}

.step-dot.done {
  background: var(--color-solid);
}

.step-label-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  white-space: nowrap;
  letter-spacing: 0.3px;
}

/* Progress Bar */
.progress-bar-track {
  width: 100%;
  max-width: 480px;
  height: 3px;
  background: var(--color-slate-100);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 36px;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-solid), var(--color-slate-700));
  border-radius: 2px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.progress-bar-fill::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: var(--color-solid);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(15, 23, 42, 0.25);
}

/* ====== Main Body ====== */
.main-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 48px 80px;
  display: flex;
  gap: 56px;
  align-items: flex-start;
}

/* ====== Timeline Sidebar ====== */
.step-sidebar {
  width: 200px;
  flex-shrink: 0;
  position: sticky;
  top: calc(64px + 24px);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0 4px;
}

.sidebar-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  font-family: var(--font-family-mono);
}

.sidebar-progress {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-solid);
  font-variant-numeric: tabular-nums;
  font-family: var(--font-family-mono);
}

.timeline-track {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-left: 4px;
}

.timeline-line {
  position: absolute;
  left: 17px;
  top: 24px;
  width: 2px;
  background: linear-gradient(180deg, var(--color-solid), var(--color-slate-300));
  border-radius: 1px;
  transition: height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 0;
}

.timeline-node {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 8px 14px 0;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: all 0.25s ease;
  border-radius: 10px;
  margin-left: -8px;
  padding-left: 8px;
  padding-right: 8px;
}

.timeline-node:hover:not(.pending) {
  background: rgba(248, 250, 252, 0.8);
}

.timeline-node.pending {
  cursor: default;
  opacity: 0.5;
}

.node-marker {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 700;
  background: var(--color-slate-100);
  color: var(--color-text-tertiary);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 2;
}

.timeline-node.completed .node-icon {
  background: var(--color-solid);
  color: white;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.2);
}

.timeline-node.current .node-icon {
  background: var(--color-solid);
  color: white;
  box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.1), 0 4px 12px rgba(15, 23, 42, 0.15);
  transform: scale(1.08);
}

.node-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: var(--color-solid);
  opacity: 0;
  animation: node-pulse-ring 2s ease-out infinite;
  z-index: 1;
}

@keyframes node-pulse-ring {
  0% { transform: scale(1); opacity: 0.3; }
  100% { transform: scale(1.8); opacity: 0; }
}

.node-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-tertiary);
  transition: all 0.25s ease;
  line-height: 1.4;
}

.timeline-node.current .node-label {
  color: var(--color-solid);
  font-weight: 650;
}

.timeline-node.completed .node-label {
  color: var(--color-text-secondary);
}

/* ====== Form Area ====== */
.form-area {
  flex: 1;
  min-width: 0;
  max-width: 640px;
}

.form-section {
  animation: section-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.form-section:nth-child(1) { animation-delay: 0ms; }

@keyframes section-enter {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.form-section-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 28px 0;
  letter-spacing: -0.4px;
  position: relative;
  display: inline-block;
}

.form-section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 32px;
  height: 2.5px;
  background: var(--color-accent);
  border-radius: 2px;
}

.assessment-form {
  margin-bottom: 28px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* GPA Slider */
.gpa-slider-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
  background: var(--color-background-alt);
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  transition: border-color 0.2s ease;
}

.gpa-slider-wrap:hover {
  border-color: var(--color-border);
}

.gpa-display {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-solid);
  min-width: 56px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  letter-spacing: -1px;
}

.score-suffix {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-left: 4px;
}

/* ====== Buttons ====== */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  background: var(--color-solid);
  color: var(--color-text-inverse);
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  min-height: 46px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(15, 23, 42, 0.08);
  white-space: nowrap;
  font-family: inherit;
  letter-spacing: -0.2px;
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.btn-primary:hover:not(:disabled)::before {
  opacity: 1;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-solid-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(15, 23, 42, 0.12);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.btn-primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none !important;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 600;
  border: 1.5px solid var(--color-border);
  border-radius: 10px;
  min-height: 46px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  white-space: nowrap;
  font-family: inherit;
  letter-spacing: -0.2px;
}

.btn-secondary:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  background: rgba(15, 23, 42, 0.02);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.btn-secondary:active {
  transform: translateY(0);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  min-height: 36px;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
  font-family: inherit;
}

.btn-ghost:hover {
  background: var(--color-slate-100);
  color: var(--color-text-primary);
}

.btn-ghost.btn-danger {
  color: var(--color-danger);
}

.btn-ghost.btn-danger:hover {
  background: var(--color-danger-bg);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  min-height: 36px;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
  font-family: inherit;
}

.btn-outline:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  background: rgba(15, 23, 42, 0.02);
}

.btn-accent {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 18px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-light));
  color: white;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  min-height: 36px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.2);
  white-space: nowrap;
  font-family: inherit;
}

.btn-accent:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.3);
  filter: brightness(1.05);
}

.btn-sm {
  padding: 7px 14px;
  min-height: 33px;
  font-size: 12px;
  border-radius: 7px;
}

/* ====== Form Actions ====== */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-light);
}

.actions-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.provider-selector {
  display: flex;
  align-items: center;
}

/* ====== List Cards ====== */
.list-header {
  margin-bottom: 16px;
}

.tab-toolbar {
  margin-bottom: 16px;
}

.empty-hint {
  font-size: 13px;
  color: var(--color-text-tertiary);
  padding: 28px 20px;
  text-align: center;
  background: linear-gradient(135deg, var(--color-background-alt), var(--color-surface));
  border-radius: 12px;
  border: 1px dashed var(--color-border);
  letter-spacing: 0.2px;
}

.list-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  margin-bottom: 10px;
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  overflow: hidden;
}

.list-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: transparent;
  transition: background 0.25s ease;
  border-radius: 0 2px 2px 0;
}

.list-card:hover {
  border-color: var(--color-border);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.list-card:hover::before {
  background: var(--color-accent);
}

.list-card-body {
  flex: 1;
  min-width: 0;
}

.list-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.list-card-header strong {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.2px;
}

.tag-inline {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
  background: var(--color-slate-100);
  color: var(--color-slate-700);
  white-space: nowrap;
  letter-spacing: 0.3px;
}

.tag-inline.tag-danger {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.tag-inline.tag-warning {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.tag-inline.tag-success {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.list-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: var(--color-text-tertiary);
  align-items: center;
}

.list-desc {
  color: var(--color-text-muted);
  font-style: italic;
}

.list-card-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  margin-left: 16px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.list-card:hover .list-card-actions {
  opacity: 1;
}

/* ====== Practice Tabs ====== */
.practice-tabs {
  margin-top: 0;
}

/* ====== Report Section ====== */
.report-section {
  padding-bottom: 40px;
}

.report-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 72px 32px;
  gap: 20px;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-slate-200);
  border-top-color: var(--color-solid);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.report-loading p {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  letter-spacing: 0.2px;
}

/* ====== AI Analysis Block ====== */
.ai-analysis-block {
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 28px;
  transition: all 0.35s ease;
  background: var(--color-surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.ai-analysis-block.status-analyzing {
  border-color: var(--color-warning);
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.06), 0 4px 16px rgba(217, 119, 6, 0.08);
}

.ai-analysis-block.status-complete {
  border-color: var(--color-solid);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}

.ai-analysis-block.status-error {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.06);
}

.ai-analysis-block.status-waiting {
  border-color: var(--color-border);
}

.ai-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  cursor: pointer;
  user-select: none;
  background: linear-gradient(135deg, var(--color-surface-muted), var(--color-surface));
  transition: background 0.2s ease;
  border-bottom: 1px solid transparent;
}

.ai-block-header:hover {
  background: var(--color-slate-50);
}

.ai-block-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 650;
  color: var(--color-text-primary);
  letter-spacing: -0.2px;
}

.ai-block-left svg {
  color: var(--color-solid);
  flex-shrink: 0;
  opacity: 0.7;
}

.ai-block-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-tag {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  padding: 3px 10px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  letter-spacing: 0.3px;
}

.status-tag.sm {
  font-size: 10px;
  padding: 2px 8px;
}

.chevron-icon {
  color: var(--color-text-tertiary);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.ai-block-body {
  padding: 24px;
}

/* Thinking */
.ai-thinking {
  text-align: center;
  padding: 44px 28px;
  background: linear-gradient(135deg, var(--color-accent-subtle), rgba(254, 243, 199, 0.4));
  border-radius: 12px;
  border: 1px solid rgba(217, 119, 6, 0.1);
}

.thinking-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 18px;
}

.thinking-dots span {
  width: 10px;
  height: 10px;
  background: var(--color-accent);
  border-radius: 50%;
  opacity: 0.4;
  animation: dot-pulse 1.4s ease-in-out infinite;
}

.thinking-dots span:nth-child(1) { animation-delay: -0.32s; }
.thinking-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes dot-pulse {
  0%, 80%, 100% { opacity: 0.4; transform: scale(0.85); }
  40% { opacity: 1; transform: scale(1.15); }
}

.thinking-text {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-accent);
  margin: 0 0 6px 0;
  letter-spacing: -0.2px;
}

.thinking-sub {
  font-size: 13px;
  color: var(--color-accent);
  opacity: 0.65;
  margin: 0;
}

/* Reasoning Block */
.reasoning-block {
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  background: var(--color-surface);
}

.reasoning-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  background: var(--color-info-bg);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-info);
  transition: background 0.2s ease;
  user-select: none;
}

.reasoning-head:hover {
  background: var(--color-slate-100);
}

.reasoning-head span:first-child {
  display: flex;
  align-items: center;
  gap: 6px;
}

.reasoning-body {
  padding: 16px;
  background: var(--color-surface-muted);
  border-top: 1px solid var(--color-border-light);
  max-height: 380px;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.75;
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
}

.reasoning-body::-webkit-scrollbar {
  width: 4px;
}

.reasoning-body::-webkit-scrollbar-thumb {
  background: var(--color-slate-300);
  border-radius: 2px;
}

/* Content Block */
.content-block {
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-surface);
}

.content-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  background: var(--color-success-bg);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-success);
  transition: background 0.2s ease;
  user-select: none;
}

.content-head:hover {
  background: #d1fae5;
}

.content-head span:first-child {
  display: flex;
  align-items: center;
  gap: 6px;
}

.content-body {
  padding: 24px;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border-light);
  min-height: 200px;
  position: relative;
}

/* Error / Placeholder */
.error-block {
  text-align: center;
  padding: 36px 24px;
}

.error-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-danger);
  margin: 0 0 8px 0;
}

.error-msg {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0 0 18px 0;
}

.placeholder-block {
  text-align: center;
  padding: 36px 24px;
}

.placeholder-block p {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin: 0 0 16px 0;
}

/* ====== Score Overview — Premium Card ====== */
.score-overview {
  text-align: center;
  padding: 40px 32px;
  background: linear-gradient(145deg, var(--color-surface), var(--color-background-alt));
  border: 1px solid var(--color-border-light);
  border-radius: 20px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.score-overview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  opacity: 0.6;
}

.score-value {
  font-size: 52px;
  font-weight: 800;
  color: var(--color-solid);
  letter-spacing: -2px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  position: relative;
  display: inline-block;
}

.score-value::after {
  content: '/5.0';
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0;
  margin-left: 4px;
  vertical-align: super;
}

.score-label {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-top: 10px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.score-bar-track {
  width: 160px;
  height: 4px;
  background: var(--color-slate-100);
  border-radius: 2px;
  margin: 20px auto 0;
  overflow: hidden;
}

.score-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-solid), var(--color-slate-700));
  border-radius: 2px;
  transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
}

.score-bar-fill::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%) translateX(50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-solid);
  box-shadow: 0 0 8px rgba(15, 23, 42, 0.2);
}

/* ====== Analysis Grid ====== */
.analysis-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 28px;
}

.analysis-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  overflow: hidden;
}

.analysis-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-solid), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.analysis-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07), 0 2px 6px rgba(0, 0, 0, 0.04);
  border-color: var(--color-border);
  transform: translateY(-3px);
}

.analysis-card:hover::after {
  opacity: 1;
}

.analysis-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 18px;
  letter-spacing: 0.2px;
}

.analysis-card-header svg {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
  opacity: 0.6;
}

.analysis-stat {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
}

.stat-num {
  font-size: 26px;
  font-weight: 800;
  color: var(--color-text-primary);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.8px;
}

.stat-grade {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: 6px;
  letter-spacing: 0.3px;
}

.grade-excellent { background: var(--color-success-bg); color: var(--color-success); }
.grade-good { background: var(--color-slate-100); color: var(--color-slate-700); }
.grade-medium { background: var(--color-warning-bg); color: var(--color-warning); }
.grade-pass { background: var(--color-danger-bg); color: var(--color-danger); }
.grade-low { background: var(--color-danger-bg); color: var(--color-danger); }

.score-excellent { background: var(--color-success-bg); color: var(--color-success); }
.score-good { background: var(--color-slate-100); color: var(--color-slate-700); }
.score-low { background: var(--color-danger-bg); color: var(--color-danger); }

.analysis-note {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.65;
  margin: 0;
}

/* ====== Radar Chart ====== */
.radar-chart {
  height: 380px;
  background: linear-gradient(145deg, var(--color-surface), var(--color-background-alt));
  border: 1px solid var(--color-border-light);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.radar-chart::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
}

/* ====== Detail List ====== */
.detail-list {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.detail-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 22px 0;
  letter-spacing: -0.3px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border-light);
}

.detail-item {
  padding: 18px 20px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, var(--color-background-alt), var(--color-surface));
  border-radius: 12px;
  border-left: 3px solid var(--color-solid);
  transition: all 0.25s ease;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transform: translateX(3px);
}

.detail-label {
  font-size: 13px;
  font-weight: 650;
  color: var(--color-text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.1px;
}

.detail-score {
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin-bottom: 8px;
}

.score-num {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-solid);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.8px;
}

.score-max {
  font-size: 13px;
  color: var(--color-text-tertiary);
  font-weight: 500;
}

.detail-bar-track {
  width: 100%;
  height: 5px;
  background: var(--color-slate-100);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.detail-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-solid), var(--color-slate-600));
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
}

.detail-bar-fill::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-solid);
  box-shadow: 0 0 6px rgba(15, 23, 42, 0.2);
}

.detail-comment {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin: 0;
  line-height: 1.6;
}

/* ====== Markdown Content ====== */
.ai-markdown {
  line-height: 1.8;
  color: var(--color-text-primary);
}

.ai-markdown :deep(h1) {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-border);
  letter-spacing: -0.4px;
}

.ai-markdown :deep(h2) {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 24px 0 12px 0;
  letter-spacing: -0.3px;
  position: relative;
  padding-left: 14px;
}

.ai-markdown :deep(h2)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 3px;
  background: var(--color-accent);
  border-radius: 2px;
}

.ai-markdown :deep(h3) {
  font-size: 15px;
  font-weight: 650;
  color: var(--color-text-secondary);
  margin: 20px 0 10px 0;
  letter-spacing: -0.2px;
}

.ai-markdown :deep(h4) {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin: 16px 0 8px 0;
}

.ai-markdown :deep(p) {
  margin: 0 0 12px 0;
  line-height: 1.8;
}

.ai-markdown :deep(ul), .ai-markdown :deep(ol) {
  margin: 12px 0;
  padding-left: 22px;
}

.ai-markdown :deep(li) {
  margin-bottom: 6px;
  line-height: 1.7;
}

.ai-markdown :deep(li::marker) {
  color: var(--color-slate-400);
}

.ai-markdown :deep(strong) {
  color: var(--color-text-primary);
  font-weight: 700;
}

.ai-markdown :deep(code) {
  background: var(--color-slate-100);
  padding: 2px 7px;
  border-radius: 5px;
  font-family: var(--font-family-mono);
  font-size: 12px;
  color: var(--color-slate-700);
  border: 1px solid var(--color-border-light);
}

.ai-markdown :deep(blockquote) {
  border-left: 3px solid var(--color-solid);
  padding: 12px 18px;
  margin: 16px 0;
  color: var(--color-text-secondary);
  font-style: italic;
  background: var(--color-background-alt);
  border-radius: 0 8px 8px 0;
  font-size: 14px;
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 18px;
  background: var(--color-solid);
  margin-left: 4px;
  vertical-align: middle;
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* ====== Element Plus Overrides — Premium Edition ====== */

/* Input & Textarea */
:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  border-radius: 10px !important;
  padding: 4px 14px !important;
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1) !important;
  box-shadow: 0 0 0 1px var(--color-border-light) inset !important;
  background: var(--color-surface) !important;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px var(--color-border) inset !important;
}

:deep(.el-input__wrapper:focus-within),
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.08), 0 0 0 1px var(--color-solid) inset !important;
}

:deep(.el-input__inner) {
  font-size: 14px !important;
}

:deep(.el-form-item__label) {
  font-size: 13px !important;
  font-weight: 600 !important;
  color: var(--color-text-secondary) !important;
  padding-bottom: 8px !important;
  letter-spacing: 0.2px !important;
}

/* Select */
:deep(.el-select .el-input__wrapper) {
  border-radius: 10px !important;
}

:deep(.el-select-dropdown) {
  border-radius: 12px !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid var(--color-border-light) !important;
}

/* Slider */
:deep(.el-slider__runway) {
  height: 6px !important;
  border-radius: 3px !important;
  background: var(--color-slate-100) !important;
}

:deep(.el-slider__bar) {
  height: 6px !important;
  border-radius: 3px !important;
  background: linear-gradient(90deg, var(--color-solid), var(--color-slate-700)) !important;
}

:deep(.el-slider__button) {
  width: 18px !important;
  height: 18px !important;
  border: 3px solid var(--color-solid) !important;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.2) !important;
}

/* Radio Button */
:deep(.el-radio-button.is-active .el-radio-button__inner) {
  background-color: var(--color-solid) !important;
  border-color: var(--color-solid) !important;
  color: #fff !important;
  box-shadow: -1px 0 0 0 var(--color-solid) !important;
  font-weight: 600 !important;
}

:deep(.el-radio-button:not(.is-active) .el-radio-button__inner) {
  background-color: var(--color-surface) !important;
  color: var(--color-text-secondary) !important;
  border-color: var(--color-border) !important;
  font-weight: 500 !important;
}

:deep(.el-radio-button:not(.is-active) .el-radio-button__inner:hover) {
  color: var(--color-solid) !important;
  border-color: var(--color-solid) !important;
}

:deep(.el-radio-button__inner) {
  border-radius: 8px !important;
  padding: 8px 20px !important;
}

/* Checkbox Button */
:deep(.el-checkbox-button.is-checked .el-checkbox-button__inner) {
  background-color: var(--color-solid) !important;
  border-color: var(--color-solid) !important;
  color: #fff !important;
  box-shadow: -1px 0 0 0 var(--color-solid) !important;
  font-weight: 600 !important;
}

:deep(.el-checkbox-button:not(.is-checked) .el-checkbox-button__inner) {
  background-color: var(--color-surface) !important;
  color: var(--color-text-secondary) !important;
  border-color: var(--color-border) !important;
  font-weight: 500 !important;
}

:deep(.el-checkbox-button:not(.is-checked) .el-checkbox-button__inner:hover) {
  color: var(--color-solid) !important;
  border-color: var(--color-solid) !important;
}

:deep(.el-checkbox-button__inner) {
  border-radius: 8px !important;
  padding: 8px 18px !important;
}

/* Focus ring for radio/checkbox */
:deep(.el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio-button__inner),
:deep(.el-checkbox-button:focus:not(.is-focus):not(:active):not(.is-disabled) .el-checkbox-button__inner) {
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08) !important;
}

/* Number input */
:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left !important;
}

/* Dialog overrides */
:deep(.el-dialog) {
  border-radius: 20px !important;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.06) !important;
  border: 1px solid var(--color-border-light) !important;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 24px 28px 16px !important;
  border-bottom: 1px solid var(--color-border-light);
  margin-right: 0 !important;
}

:deep(.el-dialog__title) {
  font-size: 17px !important;
  font-weight: 700 !important;
  color: var(--color-text-primary) !important;
  letter-spacing: -0.3px !important;
}

:deep(.el-dialog__body) {
  padding: 24px 28px !important;
}

:deep(.el-dialog__footer) {
  padding: 16px 28px 24px !important;
  border-top: 1px solid var(--color-border-light);
  display: flex !important;
  justify-content: flex-end !important;
  gap: 10px !important;
}

/* Tabs override */
:deep(.el-tabs__header) {
  margin-bottom: 20px !important;
}

:deep(.el-tabs__item) {
  font-size: 13px !important;
  font-weight: 550 !important;
  color: var(--color-text-tertiary) !important;
  transition: all 0.2s ease !important;
  padding: 0 18px !important;
  height: 40px !important;
  line-height: 40px !important;
}

:deep(.el-tabs__item.is-active) {
  color: var(--color-solid) !important;
  font-weight: 700 !important;
}

:deep(.el-tabs__active-bar) {
  background-color: var(--color-solid) !important;
  height: 2.5px !important;
  border-radius: 2px !important;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: var(--color-border) !important;
}

/* Dropdown override */
:deep(.el-dropdown-menu__item.is-active) {
  color: var(--color-solid) !important;
  background-color: var(--color-slate-50) !important;
  font-weight: 600 !important;
}

:deep(.el-dropdown-menu) {
  border-radius: 12px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid var(--color-border-light) !important;
  padding: 6px !important;
}

:deep(.el-dropdown-menu__item) {
  border-radius: 8px !important;
  padding: 8px 14px !important;
  margin: 2px 0 !important;
}

/* ====== Responsive Design ====== */
@media (max-width: 960px) {
  .page-hero {
    padding: 56px 28px 36px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 14px;
  }

  .hero-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 28px;
  }

  .step-indicator-group {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    padding: 14px 20px;
  }

  .main-body {
    flex-direction: column;
    padding: 36px 28px 60px;
    gap: 36px;
  }

  .step-sidebar {
    width: 100%;
    position: static;
  }

  .timeline-track {
    flex-direction: row;
    gap: 0;
  }

  .timeline-line {
    display: none;
  }

  .timeline-node {
    flex: 1;
    flex-direction: column;
    align-items: center;
    padding: 12px 4px;
    gap: 8px;
    text-align: center;
  }

  .node-marker {
    order: -1;
  }

  .node-label {
    font-size: 12px;
  }

  .form-area {
    max-width: 100%;
  }

  .analysis-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .score-overview {
    padding: 32px 24px;
  }

  .score-value {
    font-size: 42px;
  }
}

@media (max-width: 640px) {
  .page-hero {
    padding: 40px 20px 28px;
  }

  .hero-title {
    font-size: 26px;
  }

  .hero-overline {
    font-size: 10px;
  }

  .hero-inner {
    max-width: 100%;
  }

  .main-body {
    padding: 24px 20px 48px;
  }

  .step-indicator-group {
    padding: 10px 16px;
  }

  .step-dots {
    gap: 6px;
  }

  .step-dot.active {
    width: 22px;
  }

  .step-label-text {
    font-size: 11px;
  }

  .timeline-node {
    padding: 8px 2px;
  }

  .node-icon {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }

  .form-section-title {
    font-size: 19px;
  }

  .form-actions {
    flex-direction: column;
    gap: 12px;
  }

  .actions-right {
    width: 100%;
    justify-content: stretch;
  }

  .actions-right .btn-primary,
  .actions-right .btn-secondary,
  .actions-right .btn-outline,
  .actions-right .btn-accent {
    flex: 1;
  }

  .list-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .list-card-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
    opacity: 1;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .gpa-slider-wrap {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .gpa-display {
    text-align: left;
  }

  .progress-bar-track {
    margin-top: 24px;
  }
}
</style>
