<template>
  <div class="materials-page">
    <!-- ===== Hero 区域 ===== -->
    <section class="hero-section">
      <div class="hero-gradient-overlay" />
      <div class="hero-glow-decoration" />
      <div class="container hero-content">
        <h1 class="hero-title font-display">
          申请材料中心
        </h1>
        <p class="hero-subtitle">
          让每一份材料都成为你申请路上的基石
        </p>
        <div class="hero-stats">
          <div class="stat-card">
            <div class="stat-number font-display">
              {{ completedCount }}
            </div>
            <div class="stat-label">
              已完成材料
            </div>
          </div>
          <div class="stat-divider" />
          <div class="stat-card">
            <div class="stat-number font-display">
              {{ pendingCount }}
            </div>
            <div class="stat-label">
              待处理
            </div>
          </div>
          <div class="stat-divider" />
          <div class="stat-card">
            <div class="stat-number font-display stat-highlight">
              {{ completionRate }}<span class="stat-suffix">%</span>
            </div>
            <div class="stat-label">
              完成率
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Section 1: 文书助手 ===== -->
    <section class="section section-essay">
      <div class="container">
        <h2 class="section-title font-display">
          文书助手
        </h2>

        <!-- 选项卡导航 -->
        <div class="tab-nav">
          <button
            v-for="tab in mainTabs"
            :key="tab.key"
            class="tab-btn"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            <el-icon><component :is="tab.icon" /></el-icon>
            {{ tab.label }}
          </button>
        </div>

        <!-- 文书助手内容 -->
        <div v-show="activeTab === 'essay'" class="tab-content">
          <!-- 文书类型选择界面 -->
          <div
            v-if="!selectedEssayType"
            class="essay-type-selection animate-on-scroll"
          >
            <h3 class="subsection-title">
              选择文书类型
            </h3>
            <div class="essay-types-grid">
              <div
                v-for="type in essayTypes"
                :key="type.value"
                class="essay-type-card card-hover"
                @click="selectEssayType(type.value)"
              >
                <div class="icon-wrapper">
                  <el-icon :size="40">
                    <component :is="type.icon" />
                  </el-icon>
                </div>
                <h4>{{ type.label }}</h4>
                <p>{{ type.description }}</p>
              </div>
            </div>
          </div>

          <!-- 模板选择界面 -->
          <div
            v-else-if="!selectedTemplate"
            class="template-selection animate-on-scroll"
          >
            <div class="template-header">
              <el-button
                class="back-btn"
                text
                @click="selectedEssayType = null"
              >
                ← 返回文书类型选择
              </el-button>
              <h3>{{ getEssayTypeLabel(selectedEssayType) }} - 选择模板</h3>
            </div>

            <el-alert
              v-if="essayKeyPoints[selectedEssayType]"
              :title="'核心要点提示'"
              type="info"
              :closable="false"
              show-icon
              class="key-points-alert"
            >
              <template #default>
                <ul class="key-points-list">
                  <li
                    v-for="(point, index) in essayKeyPoints[selectedEssayType]"
                    :key="index"
                  >
                    {{ point }}
                  </li>
                </ul>
              </template>
            </el-alert>

            <div class="templates-grid">
              <div
                v-for="template in getTemplatesForType(selectedEssayType)"
                :key="template.id"
                class="template-card card-hover"
                @click="selectTemplate(template)"
              >
                <div class="template-icon">
                  <el-icon :size="28"><Document /></el-icon>
                </div>
                <div class="template-name">
                  {{ template.name }}
                </div>
                <div class="template-desc">
                  {{ template.description }}
                </div>
                <div class="template-action">
                  <span class="action-text">使用此模板 →</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 文书编辑器 -->
          <div
            v-else
            class="essay-editor animate-on-scroll"
          >
            <div class="editor-header-bar">
              <el-button
                class="back-btn"
                text
                @click="backToTemplates"
              >
                ← 返回模板选择
              </el-button>
              <span class="current-essay-info">
                {{ getEssayTypeLabel(selectedEssayType) }} · {{ selectedTemplate.name }}
              </span>
            </div>

            <div class="editor-toolbar">
              <div class="toolbar-main">
                <el-select
                  v-model="currentEssayType"
                  placeholder="文书类型"
                  size="default"
                  class="toolbar-select"
                >
                  <el-option label="个人陈述" value="ps" />
                  <el-option label="简历" value="cv" />
                  <el-option label="推荐信" value="reference" />
                  <el-option label="研究计划" value="research" />
                </el-select>
                <el-select
                  v-model="selectedProvider"
                  placeholder="AI提供商"
                  size="default"
                  class="toolbar-select"
                >
                  <el-option
                    v-for="p in providers"
                    :key="p.id"
                    :label="p.name"
                    :value="p.id"
                  />
                </el-select>
                <div class="toolbar-divider" />
                <div class="format-group">
                  <button
                    class="format-btn"
                    title="加粗"
                    @click="formatDoc('bold')"
                  >
                    B
                  </button>
                  <button
                    class="format-btn"
                    title="斜体"
                    @click="formatDoc('italic')"
                  >
                    I
                  </button>
                  <button
                    class="format-btn"
                    title="下划线"
                    @click="formatDoc('underline')"
                  >
                    U
                  </button>
                </div>
                <div class="format-group">
                  <button
                    class="format-btn"
                    title="一级标题"
                    @click="formatDoc('h1')"
                  >
                    H1
                  </button>
                  <button
                    class="format-btn"
                    title="二级标题"
                    @click="formatDoc('h2')"
                  >
                    H2
                  </button>
                  <button
                    class="format-btn"
                    title="三级标题"
                    @click="formatDoc('h3')"
                  >
                    H3
                  </button>
                </div>
                <div class="format-group">
                  <button
                    class="format-btn"
                    title="无序列表"
                    @click="formatDoc('ul')"
                  >
                    ☰
                  </button>
                  <button
                    class="format-btn"
                    title="有序列表"
                    @click="formatDoc('ol')"
                  >
                    1.
                  </button>
                </div>
                <div class="format-group">
                  <button
                    class="format-btn"
                    title="撤销"
                    @click="formatDoc('undo')"
                  >
                    ↶
                  </button>
                  <button
                    class="format-btn"
                    title="重做"
                    @click="formatDoc('redo')"
                  >
                    ↷
                  </button>
                </div>
              </div>
              <div class="toolbar-actions">
                <el-button
                  size="default"
                  @click="showWordCountDialog"
                >
                  字数统计
                </el-button>
                <el-button
                  type="primary"
                  @click="showVersionNoteDialog"
                >
                  保存版本
                </el-button>
                <el-button
                  @click="showVersions"
                >
                  历史版本
                </el-button>
                <el-button
                  type="success"
                  @click="previewAndExportPDF"
                >
                  导出PDF
                </el-button>
              </div>
            </div>

            <!-- 编辑/预览切换 -->
            <div class="editor-mode-tabs">
              <button
                class="mode-tab"
                :class="{ active: editorMode === 'edit' }"
                @click="editorMode = 'edit'"
              >
                <el-icon><EditPen /></el-icon>
                编辑
              </button>
              <button
                class="mode-tab"
                :class="{ active: editorMode === 'preview' }"
                @click="editorMode = 'preview'"
              >
                <el-icon><View /></el-icon>
                预览
              </button>
            </div>

            <div class="editor-body">
              <!-- 编辑模式 -->
              <div
                v-show="editorMode === 'edit'"
                class="editor-edit-pane"
              >
                <div
                  ref="editorRef"
                  class="rich-editor"
                  contenteditable="true"
                  :data-placeholder="'在此编辑文书内容...'"
                  @input="onEditorInput"
                  @keydown="onEditorKeydown"
                />
              </div>

              <!-- 预览模式 -->
              <div
                v-show="editorMode === 'preview'"
                class="editor-preview-pane"
              >
                <div
                  v-if="essayContent"
                  class="preview-content"
                  v-html="renderedPreviewContent"
                />
                <div
                  v-else
                  class="preview-empty"
                >
                  暂无内容，请先在编辑模式下撰写
                </div>
              </div>
            </div>

            <!-- AI 建议块区域 -->
            <div
              v-if="aiSuggestion"
              class="ai-suggestion-block"
            >
              <div class="suggestion-header">
                <el-icon color="var(--color-accent)"><MagicStick /></el-icon>
                <span>AI 建议</span>
                <div class="suggestion-actions">
                  <el-button
                    size="small"
                    type="success"
                    @click="acceptSuggestion"
                  >
                    采用建议
                  </el-button>
                  <el-button
                    size="small"
                    @click="rejectSuggestion"
                  >
                    忽略
                  </el-button>
                </div>
              </div>
              <div
                class="suggestion-content"
                v-html="renderedSuggestionContent"
              />
            </div>

            <!-- AI 助手输入区 -->
            <div class="ai-assistant-area">
              <div class="ai-input-row">
                <el-input
                  v-model="aiPrompt"
                  type="textarea"
                  :rows="2"
                  placeholder="输入AI指令，如：帮我扩写第一段，突出科研经历..."
                  :disabled="isGenerating"
                  resize="none"
                />
                <el-button
                  type="primary"
                  class="ai-generate-btn"
                  :loading="isGenerating"
                  @click="generateWithAI"
                >
                  <el-icon v-if="!isGenerating"><Promotion /></el-icon>
                  {{ isGenerating ? '生成中...' : 'AI 生成' }}
                </el-button>
              </div>
            </div>

            <div class="word-count-bar">
              <span>{{ wordCount }} 字 · 预计阅读 {{ Math.ceil(wordCount / 400) }} 分钟</span>
              <el-button
                text
                size="small"
                @click="showWordCountDialog"
              >
                详细统计 →
              </el-button>
            </div>
          </div>
        </div>

        <!-- 材料清单内容 -->
        <div v-show="activeTab === 'checklist'" class="tab-content">
          <div class="checklist-section animate-on-scroll">
            <div class="checklist-overview">
              <div class="overview-progress">
                <div class="overview-label">材料准备进度</div>
                <el-progress
                  :percentage="completionRate"
                  :color="progressGradient"
                  :stroke-width="10"
                />
              </div>
              <div class="overview-actions">
                <el-button
                  type="primary"
                  @click="exportCSV"
                >
                  导出清单
                </el-button>
                <el-button @click="generateReport">
                  生成报告
                </el-button>
                <el-button
                  plain
                  @click="resetChecklist"
                >
                  重置
                </el-button>
              </div>
            </div>

            <el-collapse
              v-model="activeCategory"
              class="category-collapse"
            >
              <el-collapse-item
                v-for="category in categories"
                :key="category.id"
                :name="category.id"
              >
                <template #title>
                  <div class="category-header">
                    <span class="category-name">{{ category.name }}</span>
                    <el-select
                      v-if="category.id === 'visa'"
                      v-model="selectedCountry"
                      size="small"
                      class="country-select"
                      @click.stop
                    >
                      <el-option
                        v-for="country in countries"
                        :key="country"
                        :label="country"
                        :value="country"
                      />
                    </el-select>
                    <span class="category-count">
                      {{ getCategoryCompleted(category.id) }}/{{ getCategoryItems(category.id).length }}
                    </span>
                  </div>
                </template>
                <div class="category-table-wrap">
                  <el-table
                    :data="getCategoryItems(category.id)"
                    class="materials-table"
                    :row-class-name="({ row }) => row.completed ? 'completed-row' : ''"
                  >
                    <el-table-column width="50">
                      <template #default="{ row }">
                        <el-checkbox
                          v-model="row.completed"
                          @change="updateProgress"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="材料名称"
                      min-width="200"
                      show-overflow-tooltip
                    >
                      <template #default="{ row }">
                        <span :class="{ 'completed-text': row.completed }">{{ row.name }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="note"
                      label="备注"
                      min-width="160"
                      show-overflow-tooltip
                    />
                    <el-table-column
                      label="操作"
                      width="110"
                    >
                      <template #default="{ row, $index }">
                        <el-button
                          text
                          type="primary"
                          size="small"
                          @click="editItem(category.id, $index)"
                        >
                          编辑
                        </el-button>
                        <el-button
                          text
                          type="danger"
                          size="small"
                          @click="removeItem(category.id, $index)"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-collapse-item>
            </el-collapse>

            <button
              class="add-custom-btn"
              @click="addCustomItem"
            >
              <el-icon><Plus /></el-icon>
              添加自定义材料
            </button>
          </div>
        </div>

        <!-- 申请进度内容 -->
        <div v-show="activeTab === 'progress'" class="tab-content">
          <div class="progress-section animate-on-scroll">
            <div class="overall-progress-card card-hover">
              <div class="overall-progress-inner">
                <div class="progress-circle-wrap">
                  <el-progress
                    type="circle"
                    :percentage="overallProgress"
                    :width="130"
                    :stroke-width="12"
                    :color="progressColors"
                  />
                </div>
                <div class="progress-info">
                  <h3>整体申请进度</h3>
                  <div class="progress-stats">
                    <div class="stat-item">
                      <span class="stat-label">已完成阶段</span>
                      <span class="stat-value font-display">{{ completedStages }}/{{ applicationStages.length }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">待完成任务</span>
                      <span class="stat-value font-display">{{ totalPendingTasks }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="stages-grid">
              <div
                v-for="stage in applicationStages"
                :key="stage.id"
                class="stage-card card-hover"
                :class="{ 'stage-completed': isStageCompleted(stage) }"
              >
                <div class="stage-header">
                  <div class="stage-icon">
                    {{ stage.icon }}
                  </div>
                  <h4>{{ stage.name }}</h4>
                  <el-tag
                    :type="getStageTagType(stage)"
                    size="small"
                    effect="light"
                  >
                    {{ getStageStatus(stage) }}
                  </el-tag>
                </div>
                <el-progress
                  :percentage="getStageProgress(stage)"
                  :color="getStageColor(stage)"
                  :stroke-width="8"
                  :show-text="false"
                />
                <div class="stage-tasks">
                  <div class="task-summary">
                    {{ getStageCompletedCount(stage) }}/{{ stage.tasks.length }} 任务
                  </div>
                  <div class="task-list">
                    <div
                      v-for="(task, index) in stage.tasks"
                      :key="index"
                      class="task-item"
                      :class="{ 'task-completed': task.completed }"
                      @click="handleTaskClick(stage, task)"
                    >
                      <el-checkbox
                        v-model="task.completed"
                        size="small"
                        @click.stop
                        @change="saveProgressData"
                      />
                      <span class="task-name">{{ task.name }}</span>
                      <el-icon
                        v-if="!task.completed"
                        class="task-arrow"
                      >
                        <Right />
                      </el-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA 行动召唤区域 ===== -->
    <section class="cta-section">
      <div class="container cta-content">
        <h2 class="cta-title font-display">
          下一步，你想做什么？
        </h2>
        <div class="cta-buttons">
          <button
            class="cta-button primary"
            onclick="window.location.href='#/assessment'"
          >
            开始背景评估
            <el-icon><Right /></el-icon>
          </button>
          <button
            class="cta-button secondary"
            onclick="window.location.href='#/school-recommendation'"
          >
            查看AI选校推荐
          </button>
          <button
            class="cta-button secondary"
            onclick="window.location.href='#/timeline'"
          >
            查看时间规划
          </button>
        </div>
      </div>
    </section>

    <!-- ===== 对话框（保持原有功能） ===== -->

    <!-- 编辑材料对话框 -->
    <el-dialog
      v-model="editItemDialogVisible"
      title="编辑材料"
      width="400px"
      class="styled-dialog"
    >
      <el-form
        :model="editingItem"
        label-width="80px"
      >
        <el-form-item label="材料名称">
          <el-input
            v-model="editingItem.name"
            placeholder="材料名称"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="editingItem.note"
            type="textarea"
            placeholder="备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editItemDialogVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="confirmEditItem"
        >
          保存修改
        </el-button>
      </template>
    </el-dialog>

    <!-- 检查报告对话框 -->
    <el-dialog
      v-model="reportVisible"
      title="材料准备检查报告"
      width="600px"
      class="styled-dialog"
    >
      <div class="report-content">
        <div class="report-summary-card">
          <div class="report-summary">
            <div class="summary-stat">
              <div class="stat-value success-color">
                {{ completedCount }}
              </div>
              <div class="stat-label">
                已完成
              </div>
            </div>
            <div class="summary-stat">
              <div class="stat-value warning-color">
                {{ pendingCount }}
              </div>
              <div class="stat-label">
                未完成
              </div>
            </div>
            <div class="summary-stat">
              <div class="stat-value primary-color">
                {{ completionRate }}%
              </div>
              <div class="stat-label">
                完成率
              </div>
            </div>
          </div>
          <el-progress
            :percentage="completionRate"
            :color="progressColor"
          />
        </div>

        <div
          v-if="pendingItems.length > 0"
          class="pending-section"
        >
          <h4 class="pending-title">
            待完成材料 ({{ pendingItems.length }}项)
          </h4>
          <el-table
            :data="pendingItems"
            size="small"
            border
            class="pending-items-table"
          >
            <el-table-column
              prop="name"
              label="材料名称"
              min-width="200"
              show-overflow-tooltip
            />
            <el-table-column
              prop="categoryName"
              label="分类"
              width="100"
            />
            <el-table-column
              prop="note"
              label="备注"
              min-width="160"
              show-overflow-tooltip
            />
            <el-table-column
              label="操作"
              width="80"
            >
              <template #default="{ row }">
                <el-button
                  size="small"
                  type="success"
                  text
                  @click="markCompleted(row)"
                >
                  完成
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-empty
          v-else
          description="所有材料已准备完成！🎉"
        />

        <div
          v-if="completedItems.length > 0"
          class="completed-section"
        >
          <h4 class="completed-title">
            已完成材料 ({{ completedItems.length }}项)
          </h4>
          <div class="completed-list">
            <el-tag
              v-for="item in completedItems"
              :key="item.name"
              type="success"
              effect="light"
            >
              {{ item.name }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 添加自定义材料对话框 -->
    <el-dialog
      v-model="itemDialogVisible"
      title="添加自定义材料"
      width="400px"
      class="styled-dialog"
    >
      <el-form
        :model="newItem"
        label-width="80px"
      >
        <el-form-item label="材料名称">
          <el-input
            v-model="newItem.name"
            placeholder="如：作品集"
          />
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select
            v-model="newItem.category"
            style="width: 100%;"
          >
            <el-option label="必需材料" value="required" />
            <el-option label="推荐材料" value="recommended" />
            <el-option label="可选材料" value="optional" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="newItem.note"
            type="textarea"
            placeholder="备注信息（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="itemDialogVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="confirmAddItem"
        >
          添加
        </el-button>
      </template>
    </el-dialog>

    <!-- 历史版本对话框 -->
    <el-dialog
      v-model="versionsVisible"
      title="文书历史版本"
      width="600px"
      class="styled-dialog"
    >
      <el-table
        :data="versions"
        style="width: 100%"
        class="versions-table"
      >
        <el-table-column
          prop="date"
          label="保存时间"
          width="180"
        />
        <el-table-column
          prop="note"
          label="版本备注"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          label="操作"
          width="140"
        >
          <template #default="{ row }">
            <el-button
              text
              type="primary"
              size="small"
              @click="previewVersion(row)"
            >
              预览
            </el-button>
            <el-button
              text
              type="success"
              size="small"
              @click="restoreVersion(row)"
            >
              恢复
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 版本备注对话框 -->
    <el-dialog
      v-model="versionNoteVisible"
      title="保存版本"
      width="400px"
      class="styled-dialog"
    >
      <el-form
        :model="versionNote"
        label-width="80px"
      >
        <el-form-item label="版本备注">
          <el-input
            v-model="versionNote.text"
            placeholder="请输入版本备注，如：初稿、修改版、终稿..."
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="versionNoteVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="confirmSaveVersion"
        >
          保存
        </el-button>
      </template>
    </el-dialog>

    <!-- 字数统计对话框 -->
    <el-dialog
      v-model="wordCountVisible"
      title="字数统计详情"
      width="500px"
      class="styled-dialog"
    >
      <div class="word-count-detail">
        <el-descriptions
          :column="1"
          border
        >
          <el-descriptions-item label="总字符数">
            {{ essayContent.length }} 个字符
          </el-descriptions-item>
          <el-descriptions-item label="中文字符">
            {{ charStats.zh }} 个
          </el-descriptions-item>
          <el-descriptions-item label="英文字母">
            {{ charStats.en }} 个
          </el-descriptions-item>
          <el-descriptions-item label="数字">
            {{ charStats.digits }} 个
          </el-descriptions-item>
          <el-descriptions-item label="标点符号">
            {{ charStats.punct }} 个
          </el-descriptions-item>
          <el-descriptions-item label="空格">
            {{ charStats.space }} 个
          </el-descriptions-item>
          <el-descriptions-item label="换行符">
            {{ charStats.newline }} 个
          </el-descriptions-item>
          <el-descriptions-item label="估计词数（英文）">
            {{ charStats.en }} 词
          </el-descriptions-item>
          <el-descriptions-item label="预计阅读时间">
            {{ Math.ceil(wordCount / 400) }} 分钟
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- PDF预览对话框 -->
    <el-dialog
      v-model="pdfPreviewVisible"
      title="PDF预览"
      width="700px"
      fullscreen
      class="styled-dialog pdf-dialog"
    >
      <div
        ref="pdfPreviewRef"
        class="pdf-preview-wrapper"
      >
        <div class="pdf-document">
          <div class="pdf-header">
            <h1>{{ getEssayTypeLabel(selectedEssayType) }}</h1>
            <p class="pdf-template-info">
              {{ selectedTemplate?.name }}
            </p>
          </div>
          <div
            class="pdf-body"
            v-html="renderedContent"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="pdfPreviewVisible = false">
          关闭预览
        </el-button>
        <el-button
          type="primary"
          @click="downloadPDF"
        >
          下载PDF
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Right, Document, DocumentCopy, Message,
  Collection, EditPen, View, MagicStick, Promotion
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
    { id: 'ps-scholarship', name: '奖学金申请专用', description: '强调学术成就和领导力，适合申请全额奖学金', content: `个人陈述 - 奖学金申请\n\n尊敬的评审委员会：\n\n作为一名追求卓越的学生，我怀着对[专业领域]的深厚热情申请[学校]的[专业]项目，并恳请获得奖学金支持。\n\n学术成就：\n（详细列出GPA、排名、重要奖项等）\n\n领导力与社会服务：\n（描述学生工作、志愿者经历、社会影响）\n\n研究潜力：\n（展示已发表论文、研究项目、创新能力）\n\n未来贡献：\n（说明你将如何回馈学术社区）\n\n结语：` }
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

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  }, { threshold: 0.1 })

  nextTick(() => {
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
  })
}
</script>

<style scoped>
.materials-page {
  min-height: 100vh;
  background: var(--color-background);
}

/* ========== Hero 区域 ========== */
.hero-section {
  position: relative;
  padding: var(--space-24) var(--space-10);
  background: linear-gradient(180deg, var(--color-background-warm) 0%, var(--color-surface) 100%);
  overflow: hidden;
  min-height: 360px;
  display: flex;
  align-items: center;
}

.hero-gradient-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(30, 58, 95, 0.03) 1px, transparent 1px),
    linear-gradient(rgba(30, 58, 95, 0.03) 1px, transparent 1px),
    radial-gradient(ellipse at 25% 50%, rgba(30, 58, 95, 0.05) 0%, transparent 55%),
    radial-gradient(ellipse at 75% 50%, rgba(184, 134, 11, 0.03) 0%, transparent 55%);
  background-size: 80px 80px, 80px 80px, 100% 100%, 100% 100%;
}

.hero-glow-decoration::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  top: -150px;
  left: -80px;
  background: radial-gradient(circle, rgba(184, 134, 11, 0.07) 0%, transparent 70%);
  animation: glow-pulse 10s ease-in-out infinite;
}

.hero-glow-decoration::after {
  content: '';
  position: absolute;
  width: 350px;
  height: 350px;
  bottom: -80px;
  right: -40px;
  background: radial-gradient(circle, rgba(30, 58, 95, 0.05) 0%, transparent 70%);
  animation: glow-pulse 12s ease-in-out infinite reverse;
}

@keyframes glow-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 0.85; }
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.hero-title {
  font-size: var(--text-4xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
  letter-spacing: 1px;
}

.hero-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-10);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.stat-card {
  text-align: center;
  padding: var(--space-6) var(--space-10);
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  min-width: 140px;
}

.stat-number {
  font-size: var(--text-4xl);
  color: var(--color-primary);
  line-height: 1.2;
}

.stat-suffix {
  font-size: var(--text-xl);
  color: var(--color-primary);
}

.stat-highlight {
  color: var(--color-accent);
}

.stat-highlight .stat-suffix {
  color: var(--color-accent);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-top: var(--space-2);
}

.stat-divider {
  width: 1px;
  height: 48px;
  background: var(--color-border);
}

/* ========== Section 通用 ========== */
.section {
  padding: var(--space-20) var(--space-10);
}

.section-essay {
  background: var(--color-surface);
}

.section-title {
  text-align: center;
  font-size: var(--text-3xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-12);
  font-weight: var(--font-bold);
}

.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: var(--gradient-primary);
  margin: var(--space-4) auto 0;
  border-radius: var(--radius-sm);
}

.subsection-title {
  text-align: center;
  font-size: var(--text-2xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-8);
  font-weight: var(--font-semibold);
}

/* ========== Tab 导航 ========== */
.tab-nav {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-bottom: var(--space-10);
  border-bottom: 2px solid var(--color-primary-100);
  padding-bottom: 0;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  position: relative;
  transition: all var(--transition-normal);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  font-family: inherit;
}

.tab-btn:hover {
  color: var(--color-primary);
  background: var(--color-primary-50);
}

.tab-btn.active {
  color: var(--color-primary);
  font-weight: var(--font-semibold);
  background: var(--color-surface);
  border-bottom: 3px solid var(--color-primary);
  margin-bottom: -2px;
}

/* ========== 内容区域 ========== */
.tab-content {
  animation: fadeIn var(--transition-slow) ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ========== 文书类型选择 ========== */
.essay-type-selection {
  padding: var(--space-8) 0;
}

.essay-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-6);
  max-width: 1000px;
  margin: 0 auto;
}

.essay-type-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-10) var(--space-6);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-spring);
  box-shadow: var(--shadow-sm);
}

.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-200);
}

.icon-wrapper {
  width: 88px;
  height: 88px;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-primary-100) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-5);
  color: var(--color-primary);
  transition: all var(--transition-spring);
}

.card-hover:hover .icon-wrapper {
  background: linear-gradient(135deg, var(--color-primary-100) 0%, var(--color-primary-200) 100%);
  transform: scale(1.08);
  box-shadow: 0 10px 30px rgba(30, 58, 95, 0.15);
}

.essay-type-card h4 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3) 0;
}

.essay-type-card p {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--leading-relaxed);
}

/* ========== 模板选择 ========== */
.template-selection {
  padding: var(--space-6) 0;
}

.template-header {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  margin-bottom: var(--space-6);
}

.template-header h3 {
  margin: 0;
  font-size: var(--text-xl);
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
}

.back-btn {
  color: var(--color-primary);
  font-weight: var(--font-medium);
  white-space: nowrap;
}

.back-btn:hover {
  color: var(--color-primary-light);
}

.key-points-alert {
  margin-bottom: var(--space-6);
  border-radius: var(--radius-lg);
  border: none;
}

.key-points-list {
  margin: 0;
  padding-left: var(--space-6);
}

.key-points-list li {
  margin-bottom: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
}

.template-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  cursor: pointer;
  transition: all var(--transition-spring);
  box-shadow: var(--shadow-sm);
}

.template-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-200);
}

.template-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-lg);
  background: var(--color-primary-50);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  margin-bottom: var(--space-4);
}

.template-name {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.template-desc {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-4);
  line-height: var(--leading-relaxed);
}

.template-action {
  text-align: right;
}

.action-text {
  font-size: var(--text-sm);
  color: var(--color-primary);
  font-weight: var(--font-medium);
}

/* ========== 编辑器 ========== */
.essay-editor {
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.editor-header-bar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-primary-100);
  background: var(--color-primary-50);
}

.current-essay-info {
  font-weight: var(--font-medium);
  color: var(--color-primary);
  font-size: var(--text-sm);
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-6);
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.toolbar-main {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.toolbar-select {
  width: 120px;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
}

.format-group {
  display: flex;
  gap: 2px;
}

.format-btn {
  width: 34px;
  height: 34px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: var(--font-bold);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}

.format-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-50);
}

/* 编辑/预览切换 */
.editor-mode-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
}

.mode-tab {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border: none;
  background: transparent;
  color: var(--color-text-tertiary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  border-bottom: 2px solid transparent;
  font-family: inherit;
}

.mode-tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  background: var(--color-surface);
}

.mode-tab:hover:not(.active) {
  color: var(--color-text-secondary);
  background: var(--color-primary-50);
}

.editor-body {
  min-height: 420px;
}

.editor-edit-pane,
.editor-preview-pane {
  padding: var(--space-6);
  min-height: 420px;
}

.rich-editor {
  width: 100%;
  min-height: 380px;
  padding: var(--space-5);
  border: none;
  outline: none;
  font-family: var(--font-family-base);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-text-primary);
  background: var(--color-surface);
  border-radius: var(--radius-md);
}

.rich-editor:focus {
  outline: none;
}

.rich-editor:empty::before {
  content: attr(data-placeholder);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.rich-editor :deep(h1) {
  font-size: 22px;
  font-weight: bold;
  margin: var(--space-4) 0 var(--space-2) 0;
  color: var(--color-text-primary);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--space-2);
}

.rich-editor :deep(h2) {
  font-size: 18px;
  font-weight: bold;
  margin: var(--space-3) 0 var(--space-2) 0;
  color: var(--color-text-primary);
}

.rich-editor :deep(h3) {
  font-size: 16px;
  font-weight: bold;
  margin: var(--space-2) 0 var(--space-1) 0;
  color: var(--color-text-secondary);
}

.rich-editor p {
  margin: var(--space-1) 0;
  text-indent: 2em;
}

.rich-editor ul, .rich-editor ol {
  margin: var(--space-2) 0;
  padding-left: var(--space-8);
}

.rich-editor li {
  margin: var(--space-1) 0;
}

.rich-editor strong {
  font-weight: bold;
  color: var(--color-primary);
}

.rich-editor em {
  font-style: italic;
}

.preview-content {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-text-primary);
}

.preview-content :deep(h1) {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: var(--space-4);
  color: var(--color-text-primary);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--space-2);
}

.preview-content :deep(h2) {
  font-size: 20px;
  font-weight: bold;
  margin-top: var(--space-6);
  margin-bottom: var(--space-3);
  color: var(--color-text-primary);
}

.preview-content :deep(h3) {
  font-size: 17px;
  font-weight: bold;
  margin-top: var(--space-4);
  margin-bottom: var(--space-2);
  color: var(--color-text-secondary);
}

.preview-content :deep(p) {
  margin: var(--space-2) 0;
  text-indent: 2em;
}

.preview-content :deep(strong) {
  color: var(--color-primary);
}

.preview-content :deep(em) {
  font-style: italic;
}

.preview-content :deep(ul), .preview-content :deep(ol) {
  padding-left: var(--space-8);
  margin: var(--space-3) 0;
}

.preview-content :deep(li) {
  margin: var(--space-1) 0;
}

.preview-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 380px;
  color: var(--color-text-tertiary);
  font-size: var(--text-base);
}

/* AI 建议块 */
.ai-suggestion-block {
  margin: 0 var(--space-6) var(--space-4);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(184, 134, 11, 0.04) 0%, rgba(212, 175, 55, 0.03) 100%);
  overflow: hidden;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: linear-gradient(135deg, rgba(184, 134, 11, 0.08) 0%, rgba(212, 175, 55, 0.05) 100%);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  color: var(--color-accent-dark);
}

.suggestion-actions {
  margin-left: auto;
  display: flex;
  gap: var(--space-2);
}

.suggestion-content {
  padding: var(--space-5);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-text-primary);
  max-height: 300px;
  overflow-y: auto;
}

.suggestion-content :deep(p) {
  margin: var(--space-2) 0;
  text-indent: 2em;
}

/* AI 助手输入区 */
.ai-assistant-area {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border);
  background: var(--color-background);
}

.ai-input-row {
  display: flex;
  gap: var(--space-3);
  align-items: flex-end;
}

.ai-input-row .el-input {
  flex: 1;
}

.ai-generate-btn {
  height: 74px;
  min-width: 110px;
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
}

.word-count-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) var(--space-6);
  color: var(--color-text-tertiary);
  font-size: var(--text-xs);
  border-top: 1px solid var(--color-border);
  background: var(--color-background);
}

/* ========== 材料清单 ========== */
.checklist-section {
  padding: var(--space-6) 0;
}

.checklist-overview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6);
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.overview-progress {
  flex: 1;
  min-width: 280px;
}

.overview-label {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.overview-actions {
  display: flex;
  gap: var(--space-3);
  flex-shrink: 0;
}

.category-collapse {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  overflow: hidden;
}

.category-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
}

.category-name {
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.country-select {
  width: 120px;
}

.category-count {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  background: var(--color-primary-50);
  padding: 2px 10px;
  border-radius: var(--radius-full);
}

.category-table-wrap {
  padding: var(--space-4);
}

.materials-table {
  width: 100%;
}

.materials-table :deep(.completed-row) {
  background-color: var(--color-success) !important;
  opacity: 0.08;
}

.materials-table :deep(.completed-row:hover > td) {
  opacity: 0.12;
}

.completed-text {
  text-decoration: line-through;
  color: var(--color-success);
}

.add-custom-btn {
  width: 100%;
  margin-top: var(--space-5);
  padding: var(--space-4);
  border: 2px dashed var(--color-primary-200);
  border-radius: var(--radius-xl);
  background: transparent;
  color: var(--color-primary);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  transition: all var(--transition-normal);
  font-family: inherit;
}

.add-custom-btn:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-50);
  color: var(--color-primary-light);
}

/* ========== 申请进度 ========== */
.progress-section {
  padding: var(--space-6) 0;
}

.overall-progress-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  margin-bottom: var(--space-8);
  box-shadow: var(--shadow-sm);
}

.overall-progress-inner {
  display: flex;
  align-items: center;
  gap: var(--space-10);
}

.progress-circle-wrap {
  flex-shrink: 0;
}

.progress-info h3 {
  margin: 0 0 var(--space-5) 0;
  font-size: var(--text-2xl);
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
}

.progress-stats {
  display: flex;
  gap: var(--space-10);
}

.progress-stats .stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-1);
}

.progress-stats .stat-value {
  font-size: var(--text-2xl);
  color: var(--color-text-primary);
  font-weight: var(--font-bold);
}

.stages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

.stage-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  transition: all var(--transition-spring);
  box-shadow: var(--shadow-sm);
}

.stage-card.stage-completed {
  border-color: var(--color-success);
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.04) 0%, var(--color-surface) 100%);
}

.stage-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.stage-icon {
  font-size: 28px;
}

.stage-header h4 {
  flex: 1;
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.stage-tasks {
  margin-top: var(--space-4);
}

.task-summary {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-3);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.task-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: var(--color-background);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.task-item:hover {
  background: var(--color-primary-50);
}

.task-item.task-completed {
  background: rgba(46, 125, 50, 0.06);
}

.task-item.task-completed .task-name {
  text-decoration: line-through;
  color: var(--color-success);
}

.task-name {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
}

.task-arrow {
  color: var(--color-text-tertiary);
  font-size: 12px;
}

/* ========== CTA 区域 ========== */
.cta-section {
  padding: var(--space-20) var(--space-10);
  background: linear-gradient(180deg, var(--color-surface) 0%, var(--color-background-warm) 100%);
  text-align: center;
}

.cta-title {
  font-size: var(--text-3xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-10);
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: var(--space-5);
  flex-wrap: wrap;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-10);
  border-radius: var(--radius-lg);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  border: none;
  cursor: pointer;
  transition: all var(--transition-spring);
  font-family: inherit;
}

.cta-button.primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-md);
  min-width: 180px;
}

.cta-button.primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-lg), var(--shadow-glow-primary);
}

.cta-button.secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  min-width: 180px;
}

.cta-button.secondary:hover {
  background: var(--color-primary-50);
  border-color: var(--color-primary-light);
  transform: translateY(-2px);
}

/* ========== 对话框样式 ========== */
.styled-dialog :deep(.el-dialog) {
  border-radius: var(--radius-2xl);
  overflow: hidden;
}

.styled-dialog :deep(.el-dialog__header) {
  padding: var(--space-6) var(--space-8);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
}

.styled-dialog :deep(.el-dialog__title) {
  font-family: var(--font-family-display);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.report-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: var(--space-6);
}

.report-summary-card {
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-primary-100) 100%);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
}

.report-summary {
  display: flex;
  justify-content: space-around;
  padding: var(--space-4) 0;
}

.summary-stat {
  text-align: center;
}

.summary-stat .stat-value {
  font-size: 36px;
  font-weight: var(--font-bold);
}

.success-color { color: var(--color-success); }
.warning-color { color: var(--color-warning); }
.primary-color { color: var(--color-primary); }

.pending-section {
  margin-top: var(--space-6);
}

.pending-title {
  margin-bottom: var(--space-4);
  color: var(--color-warning);
  font-weight: var(--font-semibold);
}

.completed-section {
  margin-top: var(--space-6);
}

.completed-title {
  margin-bottom: var(--space-4);
  color: var(--color-success);
  font-weight: var(--font-semibold);
}

.completed-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.word-count-detail {
  padding: var(--space-4) 0;
}

/* PDF预览 */
.pdf-preview-wrapper {
  background: var(--color-background);
  padding: var(--space-8);
  min-height: 500px;
  display: flex;
  justify-content: center;
}

.pdf-document {
  background: var(--color-surface);
  width: 100%;
  max-width: 700px;
  padding: var(--space-10);
  box-shadow: var(--shadow-lg);
  min-height: 600px;
  border-radius: var(--radius-md);
}

.pdf-header h1 {
  text-align: center;
  font-size: var(--text-2xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.pdf-template-info {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-6);
}

.pdf-body {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-text-primary);
}

.pdf-body :deep(h1) {
  font-size: 18px;
  font-weight: bold;
  margin: var(--space-4) 0 var(--space-2) 0;
}

.pdf-body :deep(h2) {
  font-size: 16px;
  font-weight: bold;
  margin: var(--space-3) 0 var(--space-2) 0;
}

.pdf-body :deep(p) {
  margin: var(--space-2) 0;
  text-indent: 2em;
}

.pdf-body :deep(ul), .pdf-body :deep(ol) {
  padding-left: var(--space-8);
  margin: var(--space-3) 0;
}

/* ========== 表格通用 ========== */
.materials-checklist-table :deep(.cell),
.pending-items-table :deep(.cell),
.versions-table :deep(.cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ========== 滚动动画 ========== */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ========== 响应式 ========== */
@media (max-width: 992px) {
  .hero-title { font-size: var(--text-3xl); }
  .hero-stats { gap: var(--space-4); }
  .stat-card { padding: var(--space-4) var(--space-6); min-width: 110px; }
  .stat-number { font-size: var(--text-3xl); }
  .stages-grid { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
  .overall-progress-inner { flex-direction: column; text-align: center; }
  .progress-stats { justify-content: center; }
}

@media (max-width: 768px) {
  .hero-section { padding: var(--space-16) var(--space-5); }
  .section { padding: var(--space-12) var(--space-5); }
  .cta-section { padding: var(--space-12) var(--space-5); }
  .hero-title { font-size: var(--text-2xl); }
  .hero-subtitle { font-size: var(--text-base); }
  .hero-stats { flex-direction: column; gap: var(--space-3); }
  .stat-divider { width: 80%; height: 1px; }
  .tab-nav { flex-wrap: wrap; }
  .tab-btn { padding: var(--space-3) var(--space-5); font-size: var(--text-sm); }
  .essay-types-grid { grid-template-columns: 1fr; }
  .templates-grid { grid-template-columns: 1fr; }
  .checklist-overview { flex-direction: column; align-items: stretch; }
  .overview-actions { justify-content: stretch; }
  .overview-actions .el-button { flex: 1; }
  .stages-grid { grid-template-columns: 1fr; }
  .editor-toolbar { flex-direction: column; align-items: stretch; }
  .toolbar-main { justify-content: flex-start; }
  .toolbar-actions { justify-content: flex-end; }
  .cta-buttons { flex-direction: column; align-items: center; }
  .cta-button { width: 100%; max-width: 320px; justify-content: center; }
}
</style>
