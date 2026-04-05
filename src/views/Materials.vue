<template>
  <div class="materials-page">
    <!-- ===== 噪点纹理叠加 ===== -->
    <div class="noise-overlay" />

    <!-- ===== Hero 区域 — 全屏沉浸式 ===== -->
    <section class="hero-section">
      <div class="hero-grid-bg" />
      <div class="hero-glow hero-glow-1" />
      <div class="hero-glow hero-glow-2" />
      <div class="container hero-content">
        <div class="hero-label">
          <span class="label-line" />
          <span class="label-text">MATERIALS CENTER</span>
        </div>
        <h1 class="hero-title font-display">
          <span class="title-line title-line-1">申请材料</span>
          <span class="title-line title-line-2">中心</span>
        </h1>
        <p class="hero-subtitle">
          让每一份材料都成为你申请路上的基石
        </p>
        <div class="hero-stats">
          <div class="stat-item" v-for="(stat, idx) in heroStats" :key="idx">
            <div class="stat-value font-display">
              <span class="stat-number">{{ stat.value }}</span>
              <span class="stat-suffix" v-if="stat.suffix">{{ stat.suffix }}</span>
            </div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
      <div class="hero-bottom-edge" />
    </section>

    <!-- ===== Section: 主内容区 ===== -->
    <section class="main-section">
      <div class="container">
        <!-- 极简文字导航 -->
        <nav class="tab-nav">
          <button
            v-for="(tab, idx) in mainTabs"
            :key="tab.key"
            class="tab-btn"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            <span class="tab-label">{{ tab.label }}</span>
            <span class="tab-line" />
          </button>
        </nav>

        <!-- ===== Tab 1: 文书助手 ===== -->
        <div v-show="activeTab === 'essay'" class="tab-panel">
          <!-- 文书类型选择 -->
          <div
            v-if="!selectedEssayType"
            class="essay-type-selection reveal-up"
          >
            <div class="section-header">
              <span class="section-tag">01 / ESSAY TYPE</span>
              <h2 class="section-heading font-display">选择文书类型</h2>
              <p class="section-desc">从以下四种核心文书类型开始你的写作之旅</p>
            </div>
            <div class="essay-types-grid">
              <div
                v-for="(type, index) in essayTypes"
                :key="type.value"
                class="essay-type-card magnetic-card"
                :class="{ 'card-hover': true }"
                :style="{ '--delay': index * 0.1 + 's' }"
                @click="selectEssayType(type.value)"
              >
                <div class="card-index">{{ String(index + 1).padStart(2, '0') }}</div>
                <div class="card-icon-wrap">
                  <el-icon :size="32"><component :is="type.icon" /></el-icon>
                </div>
                <h3 class="card-title">{{ type.label }}</h3>
                <p class="card-desc">{{ type.description }}</p>
                <div class="card-arrow">
                  <el-icon><Right /></el-icon>
                </div>
                <div class="card-glow" />
              </div>
            </div>
          </div>

          <!-- 模板选择界面 -->
          <div
            v-else-if="!selectedTemplate"
            class="template-selection reveal-up"
          >
            <div class="template-nav">
              <button class="back-btn" @click="selectedEssayType = null">
                <el-icon><ArrowLeft /></el-icon>
                <span>返回选择</span>
              </button>
              <div class="template-breadcrumb">
                <span>{{ getEssayTypeLabel(selectedEssayType) }}</span>
                <span class="breadcrumb-sep">/</span>
                <span class="breadcrumb-current">选择模板</span>
              </div>
            </div>

            <div
              v-if="essayKeyPoints[selectedEssayType]"
              class="key-points-bar"
            >
              <div class="kp-icon"><el-icon><InfoFilled /></el-icon></div>
              <div class="kp-content">
                <span class="kp-title">核心要点</span>
                <ul class="kp-list">
                  <li v-for="(point, index) in essayKeyPoints[selectedEssayType]" :key="index">{{ point }}</li>
                </ul>
              </div>
            </div>

            <div class="templates-grid">
              <div
                v-for="(template, index) in getTemplatesForType(selectedEssayType)"
                :key="template.id"
                class="template-card magnetic-card"
                :style="{ '--delay': index * 0.08 + 's' }"
                @click="selectTemplate(template)"
              >
                <div class="tpl-badge">TEMPLATE</div>
                <div class="tpl-icon"><el-icon :size="24"><Document /></el-icon></div>
                <h4 class="tpl-name">{{ template.name }}</h4>
                <p class="tpl-desc">{{ template.description }}</p>
                <div class="tpl-action">
                  <span>使用此模板</span>
                  <el-icon><Right /></el-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- 文书编辑器 -->
          <div v-else class="essay-editor-wrapper reveal-up">
            <div class="editor-topbar">
              <button class="back-btn" @click="backToTemplates">
                <el-icon><ArrowLeft /></el-icon>
                <span>返回模板</span>
              </button>
              <div class="editor-breadcrumb">
                <span>{{ getEssayTypeLabel(selectedEssayType) }}</span>
                <span class="sep">·</span>
                <span>{{ selectedTemplate.name }}</span>
              </div>
            </div>

            <div class="editor-layout">
              <!-- 工具栏 -->
              <div class="editor-toolbar">
                <div class="toolbar-left">
                  <el-select v-model="currentEssayType" size="small" class="tool-select">
                    <el-option label="个人陈述" value="ps" />
                    <el-option label="简历" value="cv" />
                    <el-option label="推荐信" value="reference" />
                    <el-option label="研究计划" value="research" />
                  </el-select>
                  <el-select v-model="selectedProvider" size="small" class="tool-select">
                    <el-option v-for="p in providers" :key="p.id" :label="p.name" :value="p.id" />
                  </el-select>
                  <div class="toolbar-sep" />
                  <div class="fmt-group">
                    <button class="fmt-btn" @click="formatDoc('bold')" title="加粗">B</button>
                    <button class="fmt-btn" @click="formatDoc('italic')" title="斜体">I</button>
                    <button class="fmt-btn" @click="formatDoc('underline')" title="下划线">U</button>
                  </div>
                  <div class="fmt-group">
                    <button class="fmt-btn" @click="formatDoc('h1')" title="H1">H1</button>
                    <button class="fmt-btn" @click="formatDoc('h2')" title="H2">H2</button>
                    <button class="fmt-btn" @click="formatDoc('h3')" title="H3">H3</button>
                  </div>
                  <div class="fmt-group">
                    <button class="fmt-btn" @click="formatDoc('ul')" title="列表">☰</button>
                    <button class="fmt-btn" @click="formatDoc('ol')" title="有序">1.</button>
                  </div>
                  <div class="fmt-group">
                    <button class="fmt-btn" @click="formatDoc('undo')" title="撤销">↶</button>
                    <button class="fmt-btn" @click="formatDoc('redo')" title="重做">↷</button>
                  </div>
                </div>
                <div class="toolbar-right">
                  <button class="tool-action-btn" @click="showWordCountDialog">字数统计</button>
                  <button class="tool-action-btn primary" @click="showVersionNoteDialog">保存版本</button>
                  <button class="tool-action-btn" @click="showVersions">历史版本</button>
                  <button class="tool-action-btn accent" @click="previewAndExportPDF">导出 PDF</button>
                </div>
              </div>

              <!-- 编辑/预览切换 -->
              <div class="editor-mode-switch">
                <button
                  class="mode-btn"
                  :class="{ active: editorMode === 'edit' }"
                  @click="editorMode = 'edit'"
                >
                  <el-icon><EditPen /></el-icon> 编辑
                </button>
                <button
                  class="mode-btn"
                  :class="{ active: editorMode === 'preview' }"
                  @click="editorMode = 'preview'"
                >
                  <el-icon><View /></el-icon> 预览
                </button>
              </div>

              <!-- 编辑区域 -->
              <div class="editor-body">
                <div v-show="editorMode === 'edit'" class="editor-edit-pane">
                  <div
                    ref="editorRef"
                    class="rich-editor"
                    contenteditable="true"
                    :data-placeholder="'在此编辑文书内容...'"
                    @input="onEditorInput"
                    @keydown="onEditorKeydown"
                  />
                </div>
                <div v-show="editorMode === 'preview'" class="editor-preview-pane">
                  <div v-if="essayContent" class="preview-content" v-html="renderedPreviewContent" />
                  <div v-else class="preview-empty">
                    <el-icon :size="40"><Document /></el-icon>
                    <span>暂无内容，请先在编辑模式下撰写</span>
                  </div>
                </div>
              </div>

              <!-- AI 建议块 -->
              <div v-if="aiSuggestion" class="ai-suggestion-block">
                <div class="suggestion-header">
                  <div class="suggestion-icon"><el-icon><MagicStick /></el-icon></div>
                  <span class="suggestion-title">AI 建议</span>
                  <div class="suggestion-actions">
                    <button class="sug-btn accept" @click="acceptSuggestion">采用建议</button>
                    <button class="sug-btn reject" @click="rejectSuggestion">忽略</button>
                  </div>
                </div>
                <div class="suggestion-body" v-html="renderedSuggestionContent" />
              </div>

              <!-- AI 助手输入区 -->
              <div class="ai-assistant-area">
                <div class="ai-input-wrap">
                  <textarea
                    v-model="aiPrompt"
                    class="ai-textarea"
                    :placeholder="'输入 AI 指令，如：帮我扩写第一段，突出科研经历...'"
                    :disabled="isGenerating"
                    rows="2"
                  />
                  <button
                    class="ai-send-btn"
                    :class="{ loading: isGenerating }"
                    :disabled="isGenerating || !aiPrompt.trim()"
                    @click="generateWithAI"
                  >
                    <el-icon v-if="!isGenerating"><Promotion /></el-icon>
                    <span v-else class="spinner" />
                    {{ isGenerating ? '生成中...' : 'AI 生成' }}
                  </button>
                </div>
              </div>

              <!-- 字数栏 -->
              <div class="word-count-bar">
                <span>{{ wordCount }} 字 · 预计阅读 {{ Math.ceil(wordCount / 400) }} 分钟</span>
                <button class="wc-detail-btn" @click="showWordCountDialog">详细统计 →</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== Tab 2: 材料清单 ===== -->
        <div v-show="activeTab === 'checklist'" class="tab-panel">
          <div class="checklist-section reveal-up">
            <div class="section-header">
              <span class="section-tag">02 / CHECKLIST</span>
              <h2 class="section-heading font-display">材料清单</h2>
              <p class="section-desc">系统化管理每一份申请材料，确保万无一失</p>
            </div>

            <div class="checklist-overview">
              <div class="overview-left">
                <div class="overview-progress-ring">
                  <svg viewBox="0 0 120 120" class="progress-svg">
                    <circle cx="60" cy="60" r="52" class="ring-bg" />
                    <circle cx="60" cy="60" r="52" class="ring-fill" :stroke-dasharray="`${completionRate * 3.27} 327`" />
                  </svg>
                  <div class="ring-value font-display">{{ completionRate }}<span class="ring-pct">%</span></div>
                </div>
                <div class="overview-info">
                  <div class="overview-title">材料准备进度</div>
                  <div class="overview-meta">
                    <span class="meta-done">{{ completedCount }} 已完成</span>
                    <span class="meta-pending">{{ pendingCount }} 待处理</span>
                  </div>
                </div>
              </div>
              <div class="overview-actions">
                <button class="ov-action-btn primary" @click="exportCSV">导出清单</button>
                <button class="ov-action-btn" @click="generateReport">生成报告</button>
                <button class="ov-action-btn ghost" @click="resetChecklist">重置</button>
              </div>
            </div>

            <div class="categories-accordion">
              <div
                v-for="category in categories"
                :key="category.id"
                class="category-block"
                :class="{ expanded: activeCategory.includes(category.id) }"
              >
                <button class="category-trigger" @click="toggleCategory(category.id)">
                  <div class="cat-left">
                    <span class="cat-icon">{{ getCategoryIcon(category.id) }}</span>
                    <span class="cat-name">{{ category.name }}</span>
                    <span class="cat-count">{{ getCategoryCompleted(category.id) }}/{{ getCategoryItems(category.id).length }}</span>
                  </div>
                  <div class="cat-right">
                    <el-select
                      v-if="category.id === 'visa'"
                      v-model="selectedCountry"
                      size="small"
                      class="country-select-inline"
                      @click.stop
                    >
                      <el-option v-for="country in countries" :key="country" :label="country" :value="country" />
                    </el-select>
                    <span class="cat-arrow"><el-icon><ArrowDown /></el-icon></span>
                  </div>
                </button>
                <div class="category-body">
                  <div class="cat-table-wrap">
                    <table class="mat-table">
                      <tbody>
                        <tr
                          v-for="(item, idx) in getCategoryItems(category.id)"
                          :key="idx"
                          :class="{ done: item.completed }"
                        >
                          <td class="col-check">
                            <label class="custom-checkbox">
                              <input type="checkbox" v-model="item.completed" @change="updateProgress" />
                              <span class="checkmark" />
                            </label>
                          </td>
                          <td class="col-name">
                            <span class="item-name" :class="{ strikethrough: item.completed }">{{ item.name }}</span>
                          </td>
                          <td class="col-note">
                            <span class="item-note">{{ item.note }}</span>
                          </td>
                          <td class="col-actions">
                            <button class="row-action edit" @click="editItem(category.id, idx)">编辑</button>
                            <button class="row-action delete" @click="removeItem(category.id, idx)">删除</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <button class="add-custom-btn" @click="addCustomItem">
              <el-icon><Plus /></el-icon>
              <span>添加自定义材料</span>
            </button>
          </div>
        </div>

        <!-- ===== Tab 3: 申请进度 ===== -->
        <div v-show="activeTab === 'progress'" class="tab-panel">
          <div class="progress-section reveal-up">
            <div class="section-header">
              <span class="section-tag">03 / PROGRESS</span>
              <h2 class="section-heading font-display">申请进度</h2>
              <p class="section-desc">追踪从准备到录取的每一步进展</p>
            </div>

            <div class="overall-progress-card">
              <div class="op-left">
                <div class="op-ring">
                  <svg viewBox="0 0 120 120" class="progress-svg">
                    <circle cx="60" cy="60" r="52" class="ring-bg" />
                    <circle cx="60" cy="60" r="52" class="ring-fill accent" :stroke-dasharray="`${overallProgress * 3.27} 327`" />
                  </svg>
                  <div class="op-ring-value font-display">{{ overallProgress }}<span class="ring-pct">%</span></div>
                </div>
              </div>
              <div class="op-right">
                <h3 class="op-title">整体申请进度</h3>
                <div class="op-stats">
                  <div class="op-stat">
                    <span class="op-stat-val font-display">{{ completedStages }}/{{ applicationStages.length }}</span>
                    <span class="op-stat-lbl">已完成阶段</span>
                  </div>
                  <div class="op-stat">
                    <span class="op-stat-val font-display">{{ totalPendingTasks }}</span>
                    <span class="op-stat-lbl">待完成任务</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="stages-timeline">
              <div
                v-for="(stage, sIdx) in applicationStages"
                :key="stage.id"
                class="stage-card magnetic-card"
                :class="{ completed: isStageCompleted(stage), active: getStageProgress(stage) > 0 && !isStageCompleted(stage) }"
              >
                <div class="stage-connector" v-if="sIdx < applicationStages.length - 1" />
                <div class="stage-header-row">
                  <div class="stage-num">{{ String(sIdx + 1).padStart(2, '0') }}</div>
                  <div class="stage-icon">{{ stage.icon }}</div>
                  <h4 class="stage-name">{{ stage.name }}</h4>
                  <el-tag :type="getStageTagType(stage)" size="small" effect="dark" class="stage-tag">{{ getStageStatus(stage) }}</el-tag>
                </div>
                <div class="stage-progress-bar">
                  <div class="sp-fill" :style="{ width: getStageProgress(stage) + '%' }" />
                </div>
                <div class="stage-meta">
                  <span class="sm-task-count">{{ getStageCompletedCount(stage) }}/{{ stage.tasks.length }} 任务</span>
                </div>
                <div class="stage-tasks-list">
                  <div
                    v-for="(task, tIdx) in stage.tasks"
                    :key="tIdx"
                    class="task-chip"
                    :class="{ done: task.completed }"
                    @click="handleTaskClick(stage, task)"
                  >
                    <label class="task-check">
                      <input type="checkbox" v-model="task.completed" @click.stop @change="saveProgressData" />
                      <span class="task-checkmark" />
                    </label>
                    <span class="task-label">{{ task.name }}</span>
                    <el-icon v-if="!task.completed && stage.route" class="task-go"><Right /></el-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 对话框（保持原有功能） ===== -->

    <!-- 编辑材料对话框 -->
    <el-dialog v-model="editItemDialogVisible" title="编辑材料" width="420px" class="styled-dialog">
      <el-form :model="editingItem" label-width="80px">
        <el-form-item label="材料名称">
          <el-input v-model="editingItem.name" placeholder="材料名称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editingItem.note" type="textarea" placeholder="备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editItemDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEditItem">保存修改</el-button>
      </template>
    </el-dialog>

    <!-- 检查报告对话框 -->
    <el-dialog v-model="reportVisible" title="材料准备检查报告" width="620px" class="styled-dialog">
      <div class="report-content">
        <div class="report-summary-card">
          <div class="report-summary">
            <div class="summary-stat">
              <div class="stat-value success-color">{{ completedCount }}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="summary-stat">
              <div class="stat-value warning-color">{{ pendingCount }}</div>
              <div class="stat-label">未完成</div>
            </div>
            <div class="summary-stat">
              <div class="stat-value primary-color">{{ completionRate }}%</div>
              <div class="stat-label">完成率</div>
            </div>
          </div>
          <el-progress :percentage="completionRate" :color="progressColor" />
        </div>
        <div v-if="pendingItems.length > 0" class="pending-section">
          <h4 class="pending-title">待完成材料 ({{ pendingItems.length }}项)</h4>
          <el-table :data="pendingItems" size="small" border class="pending-items-table">
            <el-table-column prop="name" label="材料名称" min-width="200" show-overflow-tooltip />
            <el-table-column prop="categoryName" label="分类" width="100" />
            <el-table-column prop="note" label="备注" min-width="160" show-overflow-tooltip />
            <el-table-column label="操作" width="80">
              <template #default="{ row }">
                <el-button size="small" type="success" text @click="markCompleted(row)">完成</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-empty v-else description="所有材料已准备完成！🎉" />
        <div v-if="completedItems.length > 0" class="completed-section">
          <h4 class="completed-title">已完成材料 ({{ completedItems.length }}项)</h4>
          <div class="completed-list">
            <el-tag v-for="item in completedItems" :key="item.name" type="success" effect="light">{{ item.name }}</el-tag>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 添加自定义材料对话框 -->
    <el-dialog v-model="itemDialogVisible" title="添加自定义材料" width="420px" class="styled-dialog">
      <el-form :model="newItem" label-width="80px">
        <el-form-item label="材料名称">
          <el-input v-model="newItem.name" placeholder="如：作品集" />
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select v-model="newItem.category" style="width: 100%;">
            <el-option label="必需材料" value="required" />
            <el-option label="推荐材料" value="recommended" />
            <el-option label="可选材料" value="optional" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="newItem.note" type="textarea" placeholder="备注信息（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="itemDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddItem">添加</el-button>
      </template>
    </el-dialog>

    <!-- 历史版本对话框 -->
    <el-dialog v-model="versionsVisible" title="文书历史版本" width="620px" class="styled-dialog">
      <el-table :data="versions" style="width: 100%" class="versions-table">
        <el-table-column prop="date" label="保存时间" width="180" />
        <el-table-column prop="note" label="版本备注" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="previewVersion(row)">预览</el-button>
            <el-button text type="success" size="small" @click="restoreVersion(row)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 版本备注对话框 -->
    <el-dialog v-model="versionNoteVisible" title="保存版本" width="420px" class="styled-dialog">
      <el-form :model="versionNote" label-width="80px">
        <el-form-item label="版本备注">
          <el-input v-model="versionNote.text" placeholder="请输入版本备注，如：初稿、修改版、终稿..." maxlength="50" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="versionNoteVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSaveVersion">保存</el-button>
      </template>
    </el-dialog>

    <!-- 字数统计对话框 -->
    <el-dialog v-model="wordCountVisible" title="字数统计详情" width="520px" class="styled-dialog">
      <div class="word-count-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="总字符数">{{ essayContent.length }} 个字符</el-descriptions-item>
          <el-descriptions-item label="中文字符">{{ charStats.zh }} 个</el-descriptions-item>
          <el-descriptions-item label="英文字母">{{ charStats.en }} 个</el-descriptions-item>
          <el-descriptions-item label="数字">{{ charStats.digits }} 个</el-descriptions-item>
          <el-descriptions-item label="标点符号">{{ charStats.punct }} 个</el-descriptions-item>
          <el-descriptions-item label="空格">{{ charStats.space }} 个</el-descriptions-item>
          <el-descriptions-item label="换行符">{{ charStats.newline }} 个</el-descriptions-item>
          <el-descriptions-item label="估计词数（英文）">{{ charStats.en }} 词</el-descriptions-item>
          <el-descriptions-item label="预计阅读时间">{{ Math.ceil(wordCount / 400) }} 分钟</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- PDF预览对话框 -->
    <el-dialog v-model="pdfPreviewVisible" title="PDF预览" width="700px" fullscreen class="styled-dialog pdf-dialog">
      <div ref="pdfPreviewRef" class="pdf-preview-wrapper">
        <div class="pdf-document">
          <div class="pdf-header">
            <h1>{{ getEssayTypeLabel(selectedEssayType) }}</h1>
            <p class="pdf-template-info">{{ selectedTemplate?.name }}</p>
          </div>
          <div class="pdf-body" v-html="renderedContent" />
        </div>
      </div>
      <template #footer>
        <el-button @click="pdfPreviewVisible = false">关闭预览</el-button>
        <el-button type="primary" @click="downloadPDF">下载PDF</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Right, Document, DocumentCopy, Message,
  Collection, EditPen, View, MagicStick, Promotion,
  ArrowLeft, ArrowDown, InfoFilled
} from '@element-plus/icons-vue'
import { sendMessageToAI } from '@/utils/ai-api'
import { jsPDF } from 'jspdf'
import 'jspdf/dist/jspdf.umd.min.js'
import { sanitizeHtml } from '@/utils/markdown'

const activeTab = ref('essay')
const currentEssayType = ref('ps')
const essayContent = ref('')
const editorMode = ref('edit')
const aiSuggestion = ref('')
const itemDialogVisible = ref(false)
const editItemDialogVisible = ref(false)
const editingItem = reactive({ name: '', note: '', category: '', index: -1 })
const reportVisible = ref(false)
const versionsVisible = ref(false)
const activeCategory = ref(['required'])
const selectedProvider = ref(null)
const aiPrompt = ref('')
const isGenerating = ref(false)
const editorRef = ref(null)
const versionNoteVisible = ref(false)
const wordCountVisible = ref(false)
const pdfPreviewVisible = ref(false)
const pdfPreviewRef = ref(null)
const versionNote = reactive({ text: '' })
const renderedContent = ref('')
const selectedEssayType = ref(null)
const selectedTemplate = ref(null)

const mainTabs = [
  { key: 'essay', label: '文书助手', icon: EditPen },
  { key: 'checklist', label: '材料清单', icon: Document },
  { key: 'progress', label: '申请进度', icon: Collection }
]

const essayTypes = [
  { value: 'ps', label: '个人陈述', description: '阐述你的学术背景、研究兴趣和职业目标', icon: Document },
  { value: 'cv', label: '简历', description: '展示你的教育背景、工作经历和技能成就', icon: DocumentCopy },
  { value: 'reference', label: '推荐信', description: '由推荐人撰写，评价你的能力和潜力', icon: Message },
  { value: 'research', label: '研究计划', description: '描述你的研究方向和计划 (适用于研究型学位)', icon: Collection }
]

const essayTemplates = {
  ps: [
    { id: 'ps-basic', name: '标准个人陈述模板', description: '包含引言、学术背景、研究经历、职业目标、结语', content: `个人陈述\n\n引言：\n（在此处简要介绍自己，说明申请的专业和学校）\n\n学术背景：\n（描述你的本科/研究生学习经历，重点课程和成绩）\n\n研究经历：\n（列举参与的研究项目，你的角色和贡献）\n\n职业目标：\n（说明短期和长期职业规划）\n\n为什么选择该项目：\n（阐述你对学校/项目的了解和选择理由）\n\n结语：\n（总结并表达热情）` },
    { id: 'ps-scholarship', name: '奖学金申请专用', description: '强调学术成就和领导力，适合申请全额奖学金', content: `个人陈述 - 奖学金申请\n\n尊敬的评审委员会：\n作为一名追求卓越的学生，我怀着对[专业领域]的深厚热情申请[学校]的[专业]项目，并恳请获得奖学金支持。\n\n学术成就：\n（详细列出GPA、排名、重要奖项等）\n\n领导力与社会服务：\n（描述学生工作、志愿者经历、社会影响）\n\n研究潜力：\n（展示已发表论文、研究项目、创新能力）\n\n未来贡献：\n（说明你将如何回馈学术社区）\n\n结语：` }
  ],
  cv: [
    { id: 'cv-basic', name: '标准简历模板', description: '清晰的一页简历格式，适合大部分申请', content: `简历\n\n个人信息\n姓名：[你的姓名]\n邮箱：[你的邮箱]\n电话：[你的电话]\n地址：[你的地址]\n\n教育背景\n[学校名称] | [学位] | [时间范围]\n- 专业：[专业名称]\n- GPA：[GPA] / 排名：[排名]\n- 相关课程：[课程1], [课程2], [课程3]\n\n工作/实习经历\n[公司/机构] | [职位] | [时间范围]\n- 职责和成就描述\n- 使用STAR原则展现能力\n\n项目经历\n[项目名称] | [时间范围]\n- 项目描述\n- 你的角色\n- 技术栈/方法\n- 成果\n\n技能\n- 语言：[英语等]\n- 技术：[编程语言、软件等]\n- 证书：[相关证书]\n\n荣誉奖项\n- [奖项名称] | [颁发机构] | [时间]` }
  ],
  reference: [
    { id: 'ref-academic', name: '学术推荐信模板', description: '由教授撰写，侧重学术能力和研究潜力', content: `推荐信\n\n尊敬的招生委员会：\n\n作为[学校名称]的[教授职位]，我荣幸地推荐我的学生[学生姓名]申请贵校[专业名称]项目。\n\n我与该生的认识时间：________\n我指导该生的课程/项目：________\n\n学术表现：\n- 课程表现：________\n- 研究能力：________\n- 创新思维：________\n\n个人品质：\n- 学习态度：________\n- 团队合作：________\n- 领导力：________\n\n推荐程度：\n我毫无保留地推荐该生加入贵校项目，相信他能做出重要贡献。\n\n如有任何疑问，请随时与我联系。\n\n此致\n敬礼\n\n[推荐人姓名]\n[职位]\n[学校]\n[联系方式]` }
  ],
  research: [
    { id: 'rp-basic', name: '标准研究计划模板', description: '适合PhD申请的研究计划框架', content: `研究计划\n\n标题：[研究课题名称]\n\n摘要（约300字）：\n- 研究问题\n- 研究方法\n- 预期成果\n\n1. 研究背景与问题\n- 领域现状\n- 待解决的关键问题\n- 研究意义\n\n2. 文献综述\n- 关键文献梳理\n- 研究空白\n- 本研究定位\n\n3. 研究目标与问题\n- 主要研究问题\n- 子问题\n- 研究假设\n\n4. 研究方法\n- 研究设计\n- 数据收集\n- 分析方法\n\n5. 预期成果\n- 学术贡献\n- 实践价值\n- 可能的创新点\n\n6. 时间规划\n- 第一年：________\n- 第二年：________\n- 第三年：________\n\n参考文献：` }
  ]
}

const essayKeyPoints = {
  ps: ['突出你的独特性和与专业的匹配度', '用具体事例支撑你的能力阐述', '展现你对专业的热情和理解', '说明为什么选择这所学校/这个项目', '保持真诚，避免过度包装', '字数控制在500-800词（英国）或650词以内（美国）'],
  cv: ['保持在一页以内（除非经历丰富）', '使用清晰的排版和一致的格式', '按时间倒序排列经历', '使用动词开头描述职责', '量化成果（如"提高20%"）', '针对不同项目定制简历内容'],
  reference: ['推荐人应熟悉你的学术或工作表现', '选择能评价你核心能力的推荐人', '提供推荐人所需材料（简历、PS等）', '提前2-3个月礼貌请求', '提醒推荐人截止日期', '推荐信内容应与PS相互呼应'],
  research: ['选择你真正感兴趣且有基础的领域', '研究问题应明确、可行', '充分展示对相关文献的了解', '方法论描述应具体可行', '与目标导师研究方向匹配', '体现你对该领域的深入思考']
}

const newItem = reactive({
  name: '',
  note: '',
  category: 'required'
})

const providers = computed(() => {
  const saved = localStorage.getItem('ai_providers')
  return saved ? JSON.parse(saved) : []
})

const heroStats = computed(() => [
  { value: completedCount.value, suffix: '', label: '已完成材料' },
  { value: pendingCount.value, suffix: '', label: '待处理' },
  { value: completionRate.value, suffix: '%', label: '完成率' }
])

onMounted(() => {
  const saved = localStorage.getItem('ai_providers')
  if (saved) {
    const parsed = JSON.parse(saved)
    if (parsed.length > 0) {
      selectedProvider.value = parsed[0].id
    }
  }
  const savedContent = localStorage.getItem('essay_current_content')
  if (savedContent && editorRef.value) {
    editorRef.value.innerHTML = savedContent
  }
  const savedEssays = localStorage.getItem('essay_versions')
  if (savedEssays) {
    versions.value = JSON.parse(savedEssays)
  }
  const savedChecklist = localStorage.getItem('materials_checklist')
  if (savedChecklist) {
    Object.assign(allItems.value, JSON.parse(savedChecklist))
  }
  loadProgressData()
  initScrollAnimations()
})

const wordCount = computed(() => {
  return essayContent.value.replace(/\s/g, '').length
})

const charStats = computed(() => {
  const text = essayContent.value
  const zh = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const en = (text.match(/[a-zA-Z]/g) || []).length
  const digits = (text.match(/[0-9]/g) || []).length
  const punct = (text.match(/[^\u4e00-\u9fff a-zA-Z0-9\n\r]/g) || []).length
  const space = (text.match(/[ ]/g) || []).length
  const newline = (text.match(/\n/g) || []).length
  return { zh, en, digits, punct, space, newline }
})

const renderedPreviewContent = computed(() => {
  return renderMarkdown(essayContent.value)
})

const renderedSuggestionContent = computed(() => {
  return renderMarkdown(aiSuggestion.value)
})

function renderMarkdown(text) {
  if (!text) return ''
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  html = html
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)/gs, '<ul>$1</ul>')
    .replace(/\n/g, '<br>')
  return sanitizeHtml(html)
}

const onEditorInput = () => {
  if (editorRef.value) {
    essayContent.value = editorRef.value.innerText || ''
    localStorage.setItem('essay_current_content', editorRef.value.innerHTML)
  }
}

const onEditorKeydown = (e) => {
  if (e.key === 'Tab') {
    e.preventDefault()
    document.execCommand('insertText', false, '    ')
  }
}

const formatDoc = (format) => {
  const selection = window.getSelection()
  if (!selection.rangeCount) return
  switch (format) {
    case 'bold': document.execCommand('bold', false); break
    case 'italic': document.execCommand('italic', false); break
    case 'underline': document.execCommand('underline', false); break
    case 'h1': document.execCommand('formatBlock', false, '<h1>'); break
    case 'h2': document.execCommand('formatBlock', false, '<h2>'); break
    case 'h3': document.execCommand('formatBlock', false, '<h3>'); break
    case 'ul': document.execCommand('insertUnorderedList', false); break
    case 'ol': document.execCommand('insertOrderedList', false); break
    case 'undo': document.execCommand('undo', false); break
    case 'redo': document.execCommand('redo', false); break
  }
  nextTick(() => {
    if (editorRef.value) {
      essayContent.value = editorRef.value.innerText || ''
      localStorage.setItem('essay_current_content', editorRef.value.innerHTML)
    }
  })
}

const showWordCountDialog = () => { wordCountVisible.value = true }

const showVersionNoteDialog = () => {
  versionNote.text = `版本 ${versions.value.length + 1}`
  versionNoteVisible.value = true
}

const confirmSaveVersion = () => {
  if (!essayContent.value.trim()) {
    ElMessage.warning('文书内容为空，无法保存')
    return
  }
  versions.value.unshift({
    date: new Date().toLocaleString('zh-CN'),
    note: versionNote.text || `版本 ${versions.value.length + 1}`,
    content: essayContent.value
  })
  localStorage.setItem('essay_versions', JSON.stringify(versions.value))
  ElMessage.success('版本已保存')
  versionNoteVisible.value = false
  versionNote.text = ''
}

const getEssayTypeLabel = (type) => {
  const found = essayTypes.find(t => t.value === type)
  return found ? found.label : '文书'
}

const getTemplatesForType = (type) => essayTemplates[type] || []

const selectEssayType = (type) => {
  selectedEssayType.value = type
  selectedTemplate.value = null
}

const selectTemplate = (template) => {
  selectedTemplate.value = template
  essayContent.value = template.content
  nextTick(() => {
    if (editorRef.value) {
      editorRef.value.innerHTML = template.content.split('\n').map(line => {
        if (line.trim()) return `<p>${line}</p>`
        return '<p><br></p>'
      }).join('')
      localStorage.setItem('essay_current_content', editorRef.value.innerHTML)
    }
  })
}

const backToTemplates = () => { selectedTemplate.value = null }

const categories = ref([
  { id: 'required', name: '必需材料' },
  { id: 'recommended', name: '推荐材料' },
  { id: 'optional', name: '可选材料' },
  { id: 'visa', name: '签证材料' }
])

const allItems = ref({
  required: [
    { name: '本科成绩单（中英文）', completed: false, note: '' },
    { name: '学位证明（中英文）', completed: false, note: '' },
    { name: '语言成绩单', completed: false, note: '雅思/托福成绩' },
    { name: '个人陈述(PS)', completed: false, note: '' },
    { name: '简历(CV)', completed: false, note: '' },
    { name: '推荐信(2-3封)', completed: false, note: '' }
  ],
  recommended: [
    { name: '研究计划(RP)', completed: false, note: '申请研究型学位需要' },
    { name: '作品集', completed: false, note: '设计/建筑/艺术类' },
    { name: 'Writing Sample', completed: false, note: '人文社科类' },
    { name: 'GRE/GMAT成绩', completed: false, note: '部分学校要求' }
  ],
  optional: [
    { name: '竞赛获奖证书', completed: false, note: '' },
    { name: '实习证明', completed: false, note: '' },
    { name: '志愿者服务证明', completed: false, note: '' },
    { name: '专利/论文发表', completed: false, note: '' }
  ]
})

const countries = ['美国', '英国', '澳大利亚', '加拿大', '新加坡', '日本', '韩国', '欧洲']
const selectedCountry = ref('美国')

const defaultVisaMaterials = {
  '美国': [
    { name: '护照', completed: false, note: '' },
    { name: 'I-20表格', completed: false, note: '' },
    { name: 'SEVIS费用收据', completed: false, note: '' },
    { name: '资金证明', completed: false, note: '' },
    { name: '签证照片', completed: false, note: '近期白底证件照' },
    { name: 'DS-160确认页', completed: false, note: '' },
    { name: '签证预约确认单', completed: false, note: '' }
  ],
  '英国': [
    { name: '护照', completed: false, note: '' },
    { name: 'CAS文件', completed: false, note: '' },
    { name: '资金证明', completed: false, note: '' },
    { name: '肺结核检测证明', completed: false, note: '' },
    { name: '签证照片', completed: false, note: '' }
  ],
  '澳大利亚': [
    { name: '护照', completed: false, note: '' },
    { name: 'CoE（入学确认书）', completed: false, note: '' },
    { name: '资金证明', completed: false, note: '' },
    { name: 'OSHC保险', completed: false, note: '海外学生健康保险' },
    { name: 'GTE声明', completed: false, note: '真实临时入境声明' }
  ],
  '加拿大': [
    { name: '护照', completed: false, note: '' },
    { name: '录取通知书', completed: false, note: '' },
    { name: '资金证明', completed: false, note: '' },
    { name: '体检证明', completed: false, note: '' },
    { name: '学习计划', completed: false, note: '' }
  ],
  '新加坡': [
    { name: '护照', completed: false, note: '' },
    { name: 'IPA letter', completed: false, note: '' },
    { name: '资金证明', completed: false, note: '' },
    { name: '签证申请表', completed: false, note: '' }
  ],
  '日本': [
    { name: '护照', completed: false, note: '' },
    { name: '在留资格认定证明书', completed: false, note: '' },
    { name: '资金证明', completed: false, note: '' },
    { name: '签证申请表', completed: false, note: '' },
    { name: '照片', completed: false, note: '' }
  ],
  '韩国': [
    { name: '护照', completed: false, note: '' },
    { name: '录取通知书', completed: false, note: '' },
    { name: '资金证明', completed: false, note: '' },
    { name: '签证申请表', completed: false, note: '' }
  ],
  '欧洲': [
    { name: '护照', completed: false, note: '' },
    { name: '录取通知书', completed: false, note: '' },
    { name: '资金证明', completed: false, note: '' },
    { name: '旅行保险', completed: false, note: '' },
    { name: '签证申请表', completed: false, note: '' }
  ]
}

const visaMaterials = ref(JSON.parse(JSON.stringify(defaultVisaMaterials)))
const versions = ref([])

const completionRate = computed(() => {
  const all = Object.values(allItems.value).flat()
  const completed = all.filter(i => i.completed).length
  return Math.round((completed / all.length) * 100)
})

const progressColor = computed(() => {
  const rate = completionRate.value
  if (rate >= 80) return '#67c23a'
  if (rate >= 50) return '#e6a23c'
  return '#f56c6c'
})

const progressGradient = computed(() => {
  const rate = completionRate.value
  if (rate >= 80) return [{ color: '#67c23a', percentage: 100 }]
  if (rate >= 50) return [{ color: '#e6a23c', percentage: 100 }]
  return [{ color: '#f56c6c', percentage: 100 }]
})

const getCategoryItems = (catId) => {
  if (catId === 'visa') return visaMaterials.value[selectedCountry.value] || []
  return allItems.value[catId] || []
}

const getCategoryCompleted = (catId) => {
  return getCategoryItems(catId).filter(i => i.completed).length
}

const updateProgress = () => {
  const data = { allItems: allItems.value, selectedCountry: selectedCountry.value, visaMaterials: visaMaterials.value }
  localStorage.setItem('materials_checklist', JSON.stringify(data))
}

const addCustomItem = () => {
  newItem.category = activeCategory.value[0] || 'required'
  itemDialogVisible.value = true
}

const confirmAddItem = () => {
  if (!newItem.name) { ElMessage.warning('请输入材料名称'); return }
  allItems.value[newItem.category].push({ name: newItem.name, completed: false, note: newItem.note })
  updateProgress()
  ElMessage.success('已添加')
  itemDialogVisible.value = false
  Object.assign(newItem, { name: '', note: '', category: 'required' })
}

const editItem = (categoryId, index) => {
  let item
  if (categoryId === 'visa') item = visaMaterials.value[selectedCountry.value][index]
  else item = allItems.value[categoryId][index]
  editingItem.name = item.name
  editingItem.note = item.note
  editingItem.category = categoryId
  editingItem.index = index
  editItemDialogVisible.value = true
}

const confirmEditItem = () => {
  if (!editingItem.name) { ElMessage.warning('请输入材料名称'); return }
  if (editingItem.category === 'visa') {
    const country = selectedCountry.value
    visaMaterials.value[country][editingItem.index].name = editingItem.name
    visaMaterials.value[country][editingItem.index].note = editingItem.note
  } else {
    allItems.value[editingItem.category][editingItem.index].name = editingItem.name
    allItems.value[editingItem.category][editingItem.index].note = editingItem.note
  }
  updateProgress()
  ElMessage.success('材料已更新')
  editItemDialogVisible.value = false
}

const markCompleted = (row) => {
  row.completed = true
  updateProgress()
  ElMessage.success('已标记为完成')
}

const completedItems = computed(() => {
  const items = []
  const catNames = { required: '必需材料', recommended: '推荐材料', optional: '可选材料' }
  for (const [cat, catName] of Object.entries(catNames)) {
    for (const item of allItems.value[cat] || []) {
      if (item.completed) items.push({ ...item, categoryName: catName })
    }
  }
  return items
})

const pendingItems = computed(() => {
  const items = []
  const catNames = { required: '必需材料', recommended: '推荐材料', optional: '可选材料' }
  for (const [cat, catName] of Object.entries(catNames)) {
    for (const item of allItems.value[cat] || []) {
      if (!item.completed) items.push({ ...item, categoryName: catName })
    }
  }
  return items
})

const completedCount = computed(() => completedItems.value.length)
const pendingCount = computed(() => pendingItems.value.length)

const applicationStages = ref([
  { id: 'background', name: '背景准备', icon: '📚', route: '/assessment', tasks: [{ name: '完成背景评估', completed: false }, { name: '准备语言成绩', completed: false }, { name: '准备GPA证明', completed: false }, { name: '整理科研经历', completed: false }] },
  { id: 'documents', name: '文书撰写', icon: '✍️', route: '/materials', tasks: [{ name: '个人陈述', completed: false }, { name: '简历CV', completed: false }, { name: '推荐信', completed: false }, { name: '研究计划', completed: false }] },
  { id: 'application', name: '网申提交', icon: '📝', route: '/school-recommendation', tasks: [{ name: '填写申请表', completed: false }, { name: '上传材料', completed: false }, { name: '支付申请费', completed: false }, { name: '确认提交', completed: false }] },
  { id: 'offer', name: 'Offer跟进', icon: '📬', route: '/timeline', tasks: [{ name: '等待录取结果', completed: false }, { name: '确认Offer', completed: false }, { name: '缴纳留位费', completed: false }] },
  { id: 'visa', name: '签证办理', icon: '🛂', route: '/materials', tasks: [{ name: '准备签证材料', completed: false }, { name: '预约签证面试', completed: false }, { name: '完成签证面试', completed: false }, { name: '获取签证', completed: false }] }
])

const loadProgressData = () => {
  const saved = localStorage.getItem('application_progress_data')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      applicationStages.value.forEach(stage => {
        const savedStage = data.find(s => s.id === stage.id)
        if (savedStage) stage.tasks.forEach((task, idx) => { if (savedStage.tasks[idx]) task.completed = savedStage.tasks[idx].completed })
      })
    } catch (e) { console.error('Failed to load progress data:', e) }
  }
}

const saveProgressData = () => {
  const data = applicationStages.value.map(stage => ({ id: stage.id, tasks: stage.tasks.map(t => ({ name: t.name, completed: t.completed })) }))
  localStorage.setItem('application_progress_data', JSON.stringify(data))
}

const getStageProgress = (stage) => {
  const completed = stage.tasks.filter(t => t.completed).length
  return Math.round((completed / stage.tasks.length) * 100)
}

const getStageCompletedCount = (stage) => stage.tasks.filter(t => t.completed).length
const isStageCompleted = (stage) => stage.tasks.every(t => t.completed)

const getStageStatus = (stage) => {
  const progress = getStageProgress(stage)
  if (progress === 100) return '已完成'
  if (progress > 0) return '进行中'
  return '待开始'
}

const getStageTagType = (stage) => {
  const progress = getStageProgress(stage)
  if (progress === 100) return 'success'
  if (progress > 0) return 'warning'
  return 'info'
}

const getStageColor = (stage) => {
  const progress = getStageProgress(stage)
  if (progress === 100) return '#67c23a'
  if (progress >= 50) return '#e6a23c'
  return '#409eff'
}

const overallProgress = computed(() => {
  const allTasks = applicationStages.value.flatMap(s => s.tasks)
  const completed = allTasks.filter(t => t.completed).length
  return Math.round((completed / allTasks.length) * 100)
})

const completedStages = computed(() => applicationStages.value.filter(s => isStageCompleted(s)).length)
const totalPendingTasks = computed(() => applicationStages.value.flatMap(s => s.tasks).filter(t => !t.completed).length)

const progressColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#409eff', percentage: 60 },
  { color: '#67c23a', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

const handleTaskClick = (stage, task) => {
  if (!task.completed && stage.route) window.location.href = stage.route
}

const removeItem = (categoryId, index) => {
  if (categoryId === 'visa') visaMaterials.value[selectedCountry.value].splice(index, 1)
  else allItems.value[categoryId].splice(index, 1)
  updateProgress()
  ElMessage.success('已删除')
}

const acceptSuggestion = () => {
  if (!aiSuggestion.value) return
  const currentContent = essayContent.value
  essayContent.value = currentContent ? currentContent + '\n\n' + aiSuggestion.value : aiSuggestion.value
  nextTick(() => {
    if (editorRef.value) {
      editorRef.value.innerHTML = essayContent.value.split('\n').map(line => line.trim() ? `<p>${escapeHtml(line)}</p>` : '<p><br></p>').join('')
      localStorage.setItem('essay_current_content', editorRef.value.innerHTML)
    }
  })
  aiSuggestion.value = ''
  ElMessage.success('已采用AI建议')
}

const rejectSuggestion = () => {
  aiSuggestion.value = ''
  ElMessage.info('已忽略AI建议')
}

const generateWithAI = async () => {
  if (!selectedProvider.value) { ElMessage.warning('请先配置AI提供商'); return }
  if (!aiPrompt.value.trim()) { ElMessage.warning('请输入AI指令'); return }

  const currentContent = essayContent.value
  isGenerating.value = true

  try {
    const systemPrompt = `你是一位文书写作导师，帮助用户改进和润色留学申请文书。
根据用户的指令和当前文书内容，提供具体的修改建议或直接生成内容。
用户当前的文书类型：${getEssayTypeName(currentEssayType.value)}
重要：请直接输出改进后的完整内容或新增段落，不要添加多余的解释性文字。`

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `当前文书内容：\n${currentContent || '(空)'}\n\n我的指令：${aiPrompt.value}` }
    ]

    let accumulatedContent = ''

    const streamGenerator = await sendMessageToAI(selectedProvider.value, messages, {
      temperature: 0.7,
      maxTokens: 1500,
      stream: true
    })

    for await (const chunk of streamGenerator) {
      if (chunk.type === 'content') {
        accumulatedContent += chunk.content
        aiSuggestion.value = accumulatedContent
      }
    }

    aiPrompt.value = ''
    ElMessage.success('AI建议已生成，请查看并决定是否采用')
  } catch (error) {
    ElMessage.error(`生成失败: ${error.message}`)
  } finally {
    isGenerating.value = false
  }
}

const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const getEssayTypeName = (type) => {
  const names = { ps: '个人陈述', cv: '简历', reference: '推荐信', research: '研究计划' }
  return names[type] || '文书'
}

const showVersions = () => { versionsVisible.value = true }

const previewVersion = (version) => {
  essayContent.value = version.content
  nextTick(() => {
    if (editorRef.value && version.content) {
      editorRef.value.innerHTML = version.content.split('\n').map(line => line.trim() ? `<p>${escapeHtml(line)}</p>` : '<p><br></p>').join('')
    }
  })
  versionsVisible.value = false
  ElMessage.success('已加载历史版本预览')
}

const restoreVersion = (version) => {
  essayContent.value = version.content
  nextTick(() => {
    if (editorRef.value && version.content) {
      editorRef.value.innerHTML = version.content.split('\n').map(line => line.trim() ? `<p>${escapeHtml(line)}</p>` : '<p><br></p>').join('')
      localStorage.setItem('essay_current_content', editorRef.value.innerHTML)
    }
  })
  versionsVisible.value = false
  ElMessage.success('已恢复到此版本')
}

const previewAndExportPDF = () => {
  if (!essayContent.value.trim()) { ElMessage.warning('文书内容为空，无法导出'); return }
  const rawHtml = essayContent.value.split('\n').map(line => {
    if (!line.trim()) return '<p><br></p>'
    if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`
    if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`
    if (line.trim().startsWith('- ')) return `<li>${line.trim().substring(2)}</li>`
    const processed = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
    return `<p>${processed}</p>`
  }).join('')
  renderedContent.value = sanitizeHtml(rawHtml)
  pdfPreviewVisible.value = true
}

const downloadPDF = () => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - 2 * margin
  let y = margin

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  const title = getEssayTypeLabel(selectedEssayType.value)
  doc.text(title, pageWidth / 2, y, { align: 'center' })
  y += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(selectedTemplate.value?.name || '', pageWidth / 2, y, { align: 'center' })
  y += 10

  doc.setDrawColor(200, 200, 200)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  const lines = essayContent.value.split('\n')
  for (const line of lines) {
    if (!line.trim()) { y += 5; continue }
    let text = line.trim()
    let fontSize = 11
    let isBold = false
    if (line.startsWith('## ')) { text = line.substring(3).trim(); fontSize = 14; isBold = true }
    else if (line.startsWith('# ')) { text = line.substring(2).trim(); fontSize = 16; isBold = true }
    else if (line.trim().startsWith('- ')) { text = '• ' + line.trim().substring(2) }

    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')

    const splitText = doc.splitTextToSize(text, maxWidth)
    for (const part of splitText) {
      if (y + 6 > pageHeight - margin) { doc.addPage(); y = margin }
      doc.text(part, margin, y)
      y += fontSize * 0.5 + 2
    }
    y += 2
  }

  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 150)
    doc.text(`第 ${i} / ${totalPages} 页`, pageWidth / 2, pageHeight - 10, { align: 'center' })
    doc.text('智能留学规划平台 - 文书导出', margin, pageHeight - 10)
  }

  const fileName = `${getEssayTypeLabel(selectedEssayType.value)}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.pdf`
  doc.save(fileName)
  ElMessage.success(`PDF已下载: ${fileName}`)
}

const exportCSV = () => {
  const rows = [['材料名称', '类别', '状态', '备注']]
  for (const [cat, catName] of [['required', '必需材料'], ['recommended', '推荐材料'], ['optional', '可选材料']]) {
    for (const item of allItems.value[cat]) rows.push([item.name, catName, item.completed ? '已完成' : '未完成', item.note])
  }
  const csvContent = rows.map(r => r.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n')
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `材料清单_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('CSV已导出')
}

const generateReport = () => { reportVisible.value = true }

const resetChecklist = () => {
  ElMessageBox.confirm('确定要重置所有材料清单吗？这将清除所有勾选状态。', '确认重置', {
    confirmButtonText: '确定重置',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    Object.keys(allItems.value).forEach(cat => allItems.value[cat].forEach(item => { item.completed = false }))
    Object.keys(visaMaterials.value).forEach(country => visaMaterials.value[country].forEach(item => { item.completed = false }))
    updateProgress()
    ElMessage.success('清单已重置')
  }).catch(() => {})
}

const toggleCategory = (id) => {
  const idx = activeCategory.value.indexOf(id)
  if (idx >= 0) {
    activeCategory.value.splice(idx, 1)
  } else {
    activeCategory.value.push(id)
  }
}

const getCategoryIcon = (id) => {
  const icons = { required: '◆', recommended: '◇', optional: '○', visa: '✈' }
  return icons[id] || '●'
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  }, { threshold: 0.08 })

  nextTick(() => {
    document.querySelectorAll('.reveal-up, .reveal-scale').forEach(el => observer.observe(el))
  })
  return observer
}

let scrollObserver = null

watch([selectedEssayType, selectedTemplate, activeTab], () => {
  nextTick(() => {
    document.querySelectorAll('.tab-panel .reveal-up, .tab-panel .reveal-scale').forEach(el => {
      el.classList.add('is-visible')
    })
  })
}, { flush: 'post' })
</script>

<style scoped>
/* ========================================
   Awwwards-Level Design System
   Slate + Amber Neo-Minimalism
   ======================================== */

.materials-page {
  min-height: 100vh;
  background: #FAFBFC;
  position: relative;
  overflow-x: hidden;
}

/* ===== 噪点纹理 ===== */
.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99999;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
}

/* ===== Container ===== */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ========== HERO SECTION — 全屏沉浸式 ========== */
.hero-section {
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(165deg, #F8FAFC 0%, #EEF0F5 40%, #FAFBFC 100%);
}

.hero-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 70%);
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: glowFloat 12s ease-in-out infinite alternate;
  pointer-events: none;
}

.hero-glow-1 {
  width: 600px;
  height: 600px;
  top: -15%;
  left: -10%;
  background: rgba(217, 119, 6, 0.06);
}

.hero-glow-2 {
  width: 450px;
  height: 450px;
  bottom: -10%;
  right: -5%;
  background: rgba(15, 23, 42, 0.04);
  animation-delay: -6s;
  animation-direction: alternate-reverse;
}

@keyframes glowFloat {
  0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
  100% { transform: translate(30px, -20px) scale(1.15); opacity: 1; }
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 80px 24px 60px;
}

/* Hero Label */
.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.label-line {
  display: block;
  width: 40px;
  height: 1px;
  background: var(--color-accent);
}

.label-text {
  font-size: 11px;
  letter-spacing: 4px;
  font-weight: 600;
  color: var(--color-slate-500);
  text-transform: uppercase;
}

/* Hero Title — 超大字体 */
.hero-title {
  font-size: clamp(3.5rem, 9vw, 8rem);
  line-height: 0.92;
  letter-spacing: -0.03em;
  color: var(--color-solid);
  margin-bottom: 28px;
  font-weight: 700;
}

.title-line {
  display: block;
}

.title-line-2 {
  color: var(--color-accent);
  position: relative;
}

.title-line-2::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 8%;
  right: 8%;
  height: 3px;
  background: var(--color-accent);
  border-radius: 2px;
}

/* Hero Subtitle */
.hero-subtitle {
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  color: var(--color-text-secondary);
  max-width: 520px;
  margin: 0 auto 56px;
  line-height: 1.7;
  font-weight: 400;
}

/* Hero Stats */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  padding: 24px 36px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 16px;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  min-width: 130px;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
  border-color: rgba(217, 119, 6, 0.2);
}

.stat-value {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 700;
  color: var(--color-solid);
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-suffix {
  font-size: 0.4em;
  color: var(--color-accent);
  font-weight: 600;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-top: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 500;
}

/* Hero Bottom Edge — 优雅过渡分隔 */
.hero-bottom-edge {
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 3px;
  background: var(--color-accent);
  border-radius: 2px;
  opacity: 0.5;
}

/* ========== MAIN SECTION ========== */
.main-section {
  padding: 0 0 100px;
  position: relative;
}

/* ===== TAB NAVIGATION — 极简杂志风格 ===== */
.tab-nav {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-bottom: 64px;
  position: relative;
}

.tab-nav::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 1px;
  background: var(--color-border-light);
}

.tab-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 8px 0 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  color: var(--color-text-muted);
  transition: color 0.35s ease;
}

.tab-btn:hover:not(.active) {
  color: var(--color-text-secondary);
}

.tab-btn.active {
  color: var(--color-solid);
}

.tab-label {
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 600;
  white-space: nowrap;
}

.tab-line {
  width: 0;
  height: 2px;
  background: var(--color-accent);
  border-radius: 1px;
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.tab-btn.active .tab-line {
  width: 100%;
}

/* ===== SECTION HEADER ===== */
.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-tag {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 3px;
  font-weight: 700;
  color: var(--color-accent);
  text-transform: uppercase;
  margin-bottom: 16px;
  padding: 6px 16px;
  background: var(--color-accent-subtle);
  border-radius: 100px;
}

.section-heading {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 700;
  color: var(--color-solid);
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin-bottom: 16px;
}

.section-desc {
  font-size: 16px;
  color: var(--color-text-secondary);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.7;
}

/* ===== TAB PANEL ===== */
.tab-panel {
  animation: panelIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes panelIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== REVEAL ANIMATIONS ===== */
.reveal-up {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0s);
}

.reveal-up.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ========== ESSAY TYPE SELECTION ========== */
.essay-type-selection {
  padding: 20px 0 60px;
}

.essay-types-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
}

/* Magnetic Card — 核心卡片组件 */
.magnetic-card {
  position: relative;
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: 20px;
  padding: 36px 28px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.magnetic-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.03) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.magnetic-card:hover {
  transform: translateY(-8px);
  border-color: transparent;
  box-shadow:
    0 20px 50px rgba(15, 23, 42, 0.08),
    0 0 0 1px rgba(15, 23, 42, 0.05);
}

.magnetic-card:hover::before {
  opacity: 1;
}

/* Essay Type Card */
.essay-type-card {
  text-align: left;
}

.card-index {
  position: absolute;
  top: 20px;
  right: 24px;
  font-size: 48px;
  font-weight: 800;
  color: var(--color-slate-100);
  line-height: 1;
  letter-spacing: -0.02em;
  transition: color 0.4s ease;
}

.magnetic-card:hover .card-index {
  color: rgba(217, 119, 6, 0.15);
}

.card-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--color-slate-50) 0%, var(--color-slate-100) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-slate-600);
  margin-bottom: 20px;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.magnetic-card:hover .card-icon-wrap {
  background: linear-gradient(135deg, var(--color-accent) 0%, #B45309 100%);
  color: white;
  transform: scale(1.08) rotate(-3deg);
  box-shadow: 0 8px 24px rgba(217, 119, 6, 0.3);
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-solid);
  margin: 0 0 10px 0;
  letter-spacing: -0.01em;
}

.card-desc {
  font-size: 13px;
  color: var(--color-text-tertiary);
  line-height: 1.65;
  margin: 0;
}

.card-arrow {
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-slate-50);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-slate-500);
  font-size: 14px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0;
  transform: translateX(-8px);
}

.magnetic-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
  background: var(--color-solid);
  color: white;
}

.card-glow {
  position: absolute;
  bottom: -40px;
  right: -40px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.magnetic-card:hover .card-glow {
  opacity: 1;
}

/* ========== TEMPLATE SELECTION ========== */
.template-selection {
  padding: 20px 0 60px;
}

.template-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  background: white;
  border-radius: 10px;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s ease;
}

.back-btn:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  background: var(--color-slate-50);
}

.template-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-tertiary);
}

.breadcrumb-sep {
  color: var(--color-border);
}

.breadcrumb-current {
  color: var(--color-solid);
  font-weight: 600;
}

/* Key Points Bar */
.key-points-bar {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 24px;
  background: linear-gradient(135deg, var(--color-accent-subtle) 0%, rgba(251, 191, 36, 0.06) 100%);
  border: 1px solid rgba(217, 119, 6, 0.12);
  border-radius: 14px;
  margin-bottom: 32px;
}

.kp-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--color-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
}

.kp-content {
  flex: 1;
}

.kp-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: 8px;
  display: block;
}

.kp-list {
  margin: 0;
  padding-left: 16px;
}

.kp-list li {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: 4px;
}

/* Templates Grid */
.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.template-card {
  padding: 28px;
}

.tpl-badge {
  font-size: 9px;
  letter-spacing: 2px;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  margin-bottom: 16px;
}

.tpl-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--color-slate-50);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-slate-500);
  margin-bottom: 16px;
  transition: all 0.4s ease;
}

.magnetic-card:hover .tpl-icon {
  background: var(--color-solid);
  color: white;
}

.tpl-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-solid);
  margin: 0 0 8px 0;
}

.tpl-desc {
  font-size: 13px;
  color: var(--color-text-tertiary);
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.tpl-action {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-slate-600);
  transition: color 0.3s ease;
}

.magnetic-card:hover .tpl-action {
  color: var(--color-accent);
}

/* ========== EDITOR — 沉浸式写作体验 ========== */
.essay-editor-wrapper {
  padding: 8px 0 60px;
}

.editor-topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.editor-breadcrumb {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.editor-breadcrumb .sep {
  margin: 0 6px;
  color: var(--color-border);
}

.editor-layout {
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 30px rgba(15, 23, 42, 0.04);
}

/* Toolbar */
.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--color-border-light);
  background: #FAFBFC;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.tool-select {
  width: 110px;
}

.toolbar-sep {
  width: 1px;
  height: 22px;
  background: var(--color-border);
}

.fmt-group {
  display: flex;
  gap: 2px;
}

.fmt-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border-light);
  background: white;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  transition: all 0.2s ease;
}

.fmt-btn:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  background: var(--color-slate-50);
}

.tool-action-btn {
  padding: 6px 14px;
  border: 1px solid var(--color-border-light);
  background: white;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.25s ease;
}

.tool-action-btn:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
}

.tool-action-btn.primary {
  background: var(--color-solid);
  color: white;
  border-color: var(--color-solid);
}

.tool-action-btn.primary:hover {
  background: var(--color-solid-hover);
}

.tool-action-btn.accent {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.tool-action-btn.accent:hover {
  background: #B45309;
}

/* Editor Mode Switch */
.editor-mode-switch {
  display: flex;
  border-bottom: 1px solid var(--color-border-light);
  background: white;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  border: none;
  background: transparent;
  color: var(--color-text-tertiary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  position: relative;
  transition: all 0.3s ease;
}

.mode-btn.active {
  color: var(--color-solid);
  font-weight: 600;
}

.mode-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 24px;
  right: 24px;
  height: 2px;
  background: var(--color-solid);
  border-radius: 2px 2px 0 0;
}

.mode-btn:hover:not(.active) {
  color: var(--color-text-secondary);
  background: var(--color-slate-50);
}

/* Editor Body */
.editor-body {
  min-height: 440px;
}

.editor-edit-pane,
.editor-preview-pane {
  padding: 24px;
  min-height: 440px;
}

.rich-editor {
  width: 100%;
  min-height: 400px;
  padding: 20px;
  border: none;
  outline: none;
  font-family: var(--font-family-base);
  font-size: 15px;
  line-height: 1.85;
  color: var(--color-text-primary);
  background: white;
  border-radius: 12px;
  transition: box-shadow 0.3s ease;
}

.rich-editor:focus {
  box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.15);
}

.rich-editor:empty::before {
  content: attr(data-placeholder);
  color: var(--color-text-muted);
  pointer-events: none;
}

.rich-editor :deep(h1) {
  font-size: 22px;
  font-weight: 700;
  margin: 20px 0 10px 0;
  color: var(--color-solid);
  border-bottom: 2px solid var(--color-solid);
  padding-bottom: 8px;
}

.rich-editor :deep(h2) {
  font-size: 18px;
  font-weight: 700;
  margin: 16px 0 8px 0;
  color: var(--color-solid);
}

.rich-editor :deep(h3) {
  font-size: 16px;
  font-weight: 600;
  margin: 12px 0 6px 0;
  color: var(--color-text-secondary);
}

.rich-editor p {
  margin: 6px 0;
  text-indent: 2em;
}

.rich-editor ul, .rich-editor ol {
  margin: 8px 0;
  padding-left: 28px;
}

.rich-editor li {
  margin: 4px 0;
}

.rich-editor strong {
  font-weight: 700;
  color: var(--color-solid);
}

.rich-editor em {
  font-style: italic;
}

.preview-content {
  font-size: 15px;
  line-height: 1.85;
  color: var(--color-text-primary);
}

.preview-content :deep(h1) {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--color-solid);
  border-bottom: 2px solid var(--color-solid);
  padding-bottom: 8px;
}

.preview-content :deep(h2) {
  font-size: 20px;
  font-weight: 700;
  margin-top: 24px;
  margin-bottom: 12px;
  color: var(--color-solid);
}

.preview-content :deep(h3) {
  font-size: 17px;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 8px;
  color: var(--color-text-secondary);
}

.preview-content :deep(p) {
  margin: 10px 0;
  text-indent: 2em;
}

.preview-content :deep(strong) {
  color: var(--color-solid);
}

.preview-content :deep(em) {
  font-style: italic;
}

.preview-content :deep(ul), .preview-content :deep(ol) {
  padding-left: 28px;
  margin: 12px 0;
}

.preview-content :deep(li) {
  margin: 6px 0;
}

.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 380px;
  color: var(--color-text-muted);
  font-size: 14px;
}

/* AI Suggestion Block */
.ai-suggestion-block {
  margin: 0 20px 16px;
  border: 1px solid rgba(217, 119, 6, 0.25);
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.04) 0%, rgba(251, 191, 36, 0.03) 100%);
  overflow: hidden;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, rgba(251, 191, 36, 0.05) 100%);
  font-weight: 600;
  font-size: 13px;
  color: var(--color-accent);
}

.suggestion-icon {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: var(--color-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

.suggestion-actions {
  margin-left: auto;
  display: flex;
  gap: 6px;
}

.sug-btn {
  padding: 5px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.sug-btn.accept {
  background: var(--color-success);
  color: white;
}

.sug-btn.accept:hover {
  background: #059669;
}

.sug-btn.reject {
  background: var(--color-slate-200);
  color: var(--color-text-secondary);
}

.sug-btn.reject:hover {
  background: var(--color-slate-300);
}

.suggestion-body {
  padding: 18px;
  font-size: 14px;
  line-height: 1.75;
  color: var(--color-text-primary);
  max-height: 280px;
  overflow-y: auto;
}

.suggestion-body :deep(p) {
  margin: 8px 0;
  text-indent: 2em;
}

/* AI Assistant Area */
.ai-assistant-area {
  padding: 16px 20px;
  border-top: 1px solid var(--color-border-light);
  background: #FAFBFC;
}

.ai-input-wrap {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.ai-textarea {
  flex: 1;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-family: var(--font-family-base);
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-primary);
  resize: none;
  background: white;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.ai-textarea:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}

.ai-textarea::placeholder {
  color: var(--color-text-muted);
}

.ai-send-btn {
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  background: var(--color-accent);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-height: 54px;
}

.ai-send-btn:hover:not(:disabled) {
  background: #B45309;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(217, 119, 6, 0.3);
}

.ai-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.word-count-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  color: var(--color-text-muted);
  font-size: 11px;
  border-top: 1px solid var(--color-border-light);
  background: #FAFBFC;
  letter-spacing: 0.3px;
}

.wc-detail-btn {
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  font-size: 11px;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.2s ease;
}

.wc-detail-btn:hover {
  color: var(--color-accent);
}

/* ========== CHECKLIST ========== */
.checklist-section {
  padding: 20px 0 60px;
}

.checklist-overview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 32px;
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: 20px;
  margin-bottom: 32px;
  box-shadow: 0 2px 20px rgba(15, 23, 42, 0.03);
  flex-wrap: wrap;
  gap: 20px;
}

.overview-left {
  display: flex;
  align-items: center;
  gap: 28px;
}

.overview-progress-ring {
  position: relative;
  width: 96px;
  height: 96px;
  flex-shrink: 0;
}

.progress-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: var(--color-slate-100);
  stroke-width: 8;
}

.ring-fill {
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dasharray 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.ring-fill.accent {
  stroke: var(--color-solid);
}

.ring-value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: var(--color-solid);
}

.ring-pct {
  font-size: 0.45em;
  color: var(--color-accent);
  font-weight: 600;
}

.overview-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.overview-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-solid);
}

.overview-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.meta-done {
  color: var(--color-success);
  font-weight: 600;
}

.meta-pending {
  color: var(--color-warning);
  font-weight: 600;
}

.overview-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.ov-action-btn {
  padding: 10px 20px;
  border: 1px solid var(--color-border);
  background: white;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s ease;
  color: var(--color-text-secondary);
}

.ov-action-btn:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
}

.ov-action-btn.primary {
  background: var(--color-solid);
  color: white;
  border-color: var(--color-solid);
}

.ov-action-btn.primary:hover {
  background: var(--color-solid-hover);
}

.ov-action-btn.ghost {
  border-style: dashed;
}

.ov-action-btn.ghost:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

/* Categories Accordion */
.categories-accordion {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-block {
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.35s ease;
}

.category-block.expanded {
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
}

.category-trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s ease;
}

.category-trigger:hover {
  background: var(--color-slate-50);
}

.cat-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cat-icon {
  font-size: 16px;
  color: var(--color-accent);
}

.cat-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-solid);
}

.cat-count {
  font-size: 11px;
  color: white;
  background: var(--color-slate-300);
  padding: 2px 10px;
  border-radius: 100px;
  font-weight: 600;
}

.cat-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.country-select-inline {
  width: 110px;
}

.cat-arrow {
  color: var(--color-text-muted);
  transition: transform 0.35s ease;
  font-size: 14px;
}

.category-block.expanded .cat-arrow {
  transform: rotate(180deg);
}

.category-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-block.expanded .category-body {
  max-height: 600px;
}

.cat-table-wrap {
  padding: 4px 16px 16px;
}

.mat-table {
  width: 100%;
  border-collapse: collapse;
}

.mat-table tr {
  transition: background 0.2s ease;
}

.mat-table tr.done {
  background: rgba(5, 150, 105, 0.04);
}

.mat-table td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--color-border-light);
  vertical-align: middle;
}

.col-check {
  width: 44px;
}

/* Custom Checkbox */
.custom-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  background: white;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: block;
}

.custom-checkbox input:checked + .checkmark {
  background: var(--color-success);
  border-color: var(--color-success);
}

.custom-checkbox input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox input:focus + .checkmark {
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15);
}

.col-name {
  min-width: 180px;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  transition: all 0.2s ease;
}

.item-name.strikethrough {
  text-decoration: line-through;
  color: var(--color-success);
}

.col-note {
  min-width: 140px;
}

.item-note {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.col-actions {
  width: 100px;
  text-align: right;
}

.row-action {
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.row-action.edit {
  color: var(--color-info);
}

.row-action.edit:hover {
  background: var(--color-info-bg);
}

.row-action.delete {
  color: var(--color-danger);
}

.row-action.delete:hover {
  background: var(--color-danger-bg);
}

.add-custom-btn {
  width: 100%;
  margin-top: 16px;
  padding: 16px;
  border: 2px dashed var(--color-slate-200);
  border-radius: 16px;
  background: transparent;
  color: var(--color-slate-500);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.35s ease;
  font-family: inherit;
}

.add-custom-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-subtle);
}

/* ========== PROGRESS — 时间线式 ========== */
.progress-section {
  padding: 20px 0 60px;
}

.overall-progress-card {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 32px 36px;
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: 20px;
  margin-bottom: 36px;
  box-shadow: 0 2px 20px rgba(15, 23, 42, 0.03);
}

.op-left {
  flex-shrink: 0;
}

.op-ring {
  position: relative;
  width: 110px;
  height: 110px;
}

.op-ring-value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-solid);
}

.op-right {
  flex: 1;
}

.op-title {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-solid);
}

.op-stats {
  display: flex;
  gap: 32px;
}

.op-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.op-stat-val {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-solid);
}

.op-stat-lbl {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

/* Stages Timeline */
.stages-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
}

.stage-card {
  position: relative;
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: 18px;
  padding: 24px 28px;
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.stage-card:hover {
  transform: translateX(6px);
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}

.stage-card.completed {
  border-color: rgba(5, 150, 105, 0.2);
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.03) 0%, white 60%);
}

.stage-card.active {
  border-color: rgba(217, 119, 6, 0.25);
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.03) 0%, white 60%);
}

.stage-connector {
  position: absolute;
  left: 38px;
  top: calc(100% + 8px);
  width: 2px;
  height: 16px;
  background: var(--color-border);
  z-index: 0;
}

.stage-header-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.stage-num {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-slate-100);
  line-height: 1;
  letter-spacing: -0.03em;
}

.stage-icon {
  font-size: 24px;
}

.stage-name {
  flex: 1;
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-solid);
}

.stage-tag {
  font-weight: 600;
  border-radius: 6px;
}

.stage-progress-bar {
  height: 4px;
  background: var(--color-slate-100);
  border-radius: 2px;
  margin-bottom: 14px;
  overflow: hidden;
}

.sp-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 2px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.stage-card.completed .sp-fill {
  background: var(--color-success);
}

.stage-meta {
  margin-bottom: 12px;
}

.sm-task-count {
  font-size: 12px;
  color: var(--color-text-tertiary);
  font-weight: 500;
}

.stage-tasks-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.task-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--color-background-alt);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.task-chip:hover {
  background: var(--color-slate-50);
  border-color: var(--color-slate-200);
}

.task-chip.done {
  background: rgba(5, 150, 105, 0.06);
  border-color: rgba(5, 150, 105, 0.15);
}

.task-chip.done .task-label {
  text-decoration: line-through;
  color: var(--color-success);
}

.task-check {
  position: relative;
  display: inline-flex;
  cursor: pointer;
}

.task-check input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.task-checkmark {
  width: 16px;
  height: 16px;
  border: 1.5px solid var(--color-border);
  border-radius: 4px;
  background: white;
  transition: all 0.2s ease;
  display: block;
}

.task-check input:checked + .task-checkmark {
  background: var(--color-success);
  border-color: var(--color-success);
}

.task-label {
  font-size: 12px;
  color: var(--color-text-primary);
  font-weight: 500;
}

.task-go {
  font-size: 11px;
  color: var(--color-text-muted);
  transition: transform 0.2s ease;
}

.task-chip:hover .task-go {
  transform: translateX(3px);
  color: var(--color-accent);
}

/* ========== DIALOG STYLES ========== */
.styled-dialog :deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--color-border-light);
}

.styled-dialog :deep(.el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border-light);
  background: #FAFBFC;
}

.styled-dialog :deep(.el-dialog__title) {
  font-family: var(--font-family-display);
  font-weight: 700;
  font-size: 16px;
  color: var(--color-solid);
}

.styled-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.styled-dialog :deep(.el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid var(--color-border-light);
}

.report-content {
  max-height: 60vh;
  overflow-y: auto;
}

.report-summary-card {
  background: linear-gradient(135deg, var(--color-slate-50) 0%, var(--color-slate-100) 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.report-summary {
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
}

.summary-stat {
  text-align: center;
}

.summary-stat .stat-value {
  font-size: 36px;
  font-weight: 700;
}

.success-color { color: var(--color-success); }
.warning-color { color: var(--color-warning); }
.primary-color { color: var(--color-solid); }

.pending-section { margin-top: 24px; }

.pending-title {
  margin-bottom: 12px;
  color: var(--color-warning);
  font-weight: 700;
  font-size: 14px;
}

.completed-section { margin-top: 24px; }

.completed-title {
  margin-bottom: 12px;
  color: var(--color-success);
  font-weight: 700;
  font-size: 14px;
}

.completed-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.word-count-detail { padding: 8px 0; }

/* PDF Preview */
.pdf-preview-wrapper {
  background: var(--color-background-alt);
  padding: 40px;
  min-height: 500px;
  display: flex;
  justify-content: center;
}

.pdf-document {
  background: white;
  width: 100%;
  max-width: 700px;
  padding: 48px;
  box-shadow: 0 10px 50px rgba(15, 23, 42, 0.08);
  min-height: 600px;
  border-radius: 4px;
}

.pdf-header h1 {
  text-align: center;
  font-size: 22px;
  color: var(--color-solid);
  margin-bottom: 6px;
  font-weight: 700;
}

.pdf-template-info {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-bottom: 28px;
}

.pdf-body {
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-text-primary);
}

.pdf-body :deep(h1) {
  font-size: 18px;
  font-weight: 700;
  margin: 16px 0 8px 0;
}

.pdf-body :deep(h2) {
  font-size: 16px;
  font-weight: 700;
  margin: 12px 0 6px 0;
}

.pdf-body :deep(p) {
  margin: 8px 0;
  text-indent: 2em;
}

.pdf-body :deep(ul), .pdf-body :deep(ol) {
  padding-left: 28px;
  margin: 8px 0;
}

/* Table overrides */
.pending-items-table :deep(.cell),
.versions-table :deep(.cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 1024px) {
  .essay-types-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 700px;
  }

  .stages-timeline .stage-connector {
    display: none;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 80vh;
  }

  .hero-title {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }

  .hero-stats {
    gap: 16px;
  }

  .stat-item {
    padding: 16px 24px;
    min-width: 100px;
  }

  .tab-nav {
    gap: 28px;
    margin-bottom: 40px;
  }

  .tab-label {
    font-size: 11px;
    letter-spacing: 1.5px;
  }

  .essay-types-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }

  .templates-grid {
    grid-template-columns: 1fr;
  }

  .checklist-overview {
    flex-direction: column;
    align-items: stretch;
  }

  .overview-actions {
    justify-content: stretch;
  }

  .overview-actions .ov-action-btn {
    flex: 1;
    text-align: center;
  }

  .overall-progress-card {
    flex-direction: column;
    text-align: center;
  }

  .op-stats {
    justify-content: center;
  }

  .editor-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left {
    justify-content: flex-start;
  }

  .toolbar-right {
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .stage-card:hover {
    transform: translateY(-4px);
  }

  .category-trigger {
    flex-wrap: wrap;
    gap: 8px;
  }

  .mat-table td {
    padding: 10px 6px;
  }

  .col-actions {
    width: 80px;
  }

  .hero-content {
    padding: 60px 16px 48px;
  }

  .main-section {
    padding-bottom: 60px;
  }
}

@media (max-width: 480px) {
  .hero-stats {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 16px;
    text-align: left;
    padding: 14px 20px;
  }

  .stat-label {
    margin-top: 0;
  }

  .template-nav {
    flex-direction: column;
    align-items: flex-start;
  }

  .overview-left {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .overview-meta {
    justify-content: center;
  }
}
</style>
