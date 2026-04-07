<template>
  <div class="studio-page">
    <div class="noise-overlay" />

    <!-- Main Layout -->
    <div class="studio-layout">
      <!-- Header -->
      <StudioHeader
        :document-title="state.documentTitle.value"
        :selected-template="state.selectedTemplate.value"
        :selected-essay-type="state.selectedEssayType.value"
        :available-templates="availableTemplates"
        :completed-count="computedData.completedCount.value"
        :total-count="totalCount"
        :has-unsaved-changes="hasUnsavedChanges"
        :zen-mode="zenMode"
        @toggle-drawer="toggleDrawer(true)"
        @export-pdf="handleExportPDF"
        @change-template="handleChangeTemplate"
        @update-title="handleUpdateTitle"
        @toggle-zen="zenMode = !zenMode"
        @reset-type="handleResetType"
      />

      <!-- Content Area: Editor + AI Panel -->
      <div
        class="studio-content"
        :class="{ 'zen-active': zenMode }"
      >
        <!-- Editor Pane -->
        <EditorPane
          :content="state.essayContent.value"
          :mode="state.editorMode.value"
          :has-content="!showEmptyGuide"
          :selected-type="state.selectedEssayType.value"
          :essay-types="state.essayTypes"
          :zen-mode="zenMode"
          placeholder="开始书写你的故事..."
          @update="handleEditorUpdate"
          @select-type="handleSelectType"
          @toggle-zen="zenMode = !zenMode"
        />

        <!-- AI Companion Panel (hidden in zen mode) -->
        <AICompanionPanel
          v-show="!zenMode"
          :open="state.aiPanelOpen.value"
          :messages="state.aiMessages.value"
          :is-generating="state.isGenerating.value"
          :has-context="!!state.selectedEssayType.value"
          @toggle="state.aiPanelOpen.value = !state.aiPanelOpen.value"
          @send="actions.generateWithAI($event)"
          @quick-action="handleQuickAction($event)"
          @accept="actions.acceptSuggestion($event)"
          @reject="() => {}"
          @generate-draft="handleGenerateDraft"
        />
      </div>

      <!-- Status Bar (hidden in zen mode) -->
      <StudioStatusBar
        v-show="!zenMode"
        :word-count="computedData.wordCount.value"
        :reading-time="computedData.readingTime.value"
        :auto-save-time="lastSaveTime"
        :has-unsaved="hasUnsavedChanges"
        :show-preview="state.previewMode.value"
        :show-versions="false"
        @toggle-preview="togglePreview"
        @toggle-versions="() => {}"
      />
    </div>

    <!-- Materials Drawer (simplified) -->
    <MaterialsDrawer
      :open="state.materialsDrawerOpen.value"
      :completion-rate="computedData.completionRate.value"
      :completed-count="computedData.completedCount.value"
      :pending-count="computedData.pendingCount.value"
      :items="coreChecklistItems"
      @close="toggleDrawer(false)"
      @toggle-item="handleToggleItem"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useMaterialsState } from '@/composables/useMaterialsState'
import StudioHeader from '@/components/materials/StudioHeader.vue'
import EditorPane from '@/components/materials/EditorPane.vue'
import AICompanionPanel from '@/components/materials/AICompanionPanel.vue'
import MaterialsDrawer from '@/components/materials/MaterialsDrawer.vue'
import StudioStatusBar from '@/components/materials/StudioStatusBar.vue'

const {
  state,
  computed: computedData,
  actions
} = useMaterialsState()

const lastSaveTime = ref('')
const saveTimer = ref<ReturnType<typeof setTimeout>>()
const zenMode = ref(false)

const availableTemplates = computed(() => {
  if (!state.selectedEssayType.value) return []
  return actions.getTemplatesForType(state.selectedEssayType.value)
})

const totalCount = computed(() => computedData.completedCount.value + computedData.pendingCount.value)
const hasUnsavedChanges = computed(() => state.essayContent.value.length > 0)

const showEmptyGuide = computed(() => {
  if (!state.selectedEssayType.value) return true
  const text = state.essayContent.value || ''
  if (text.length < 10) return true
  return false
})

const coreChecklistItems = computed(() => {
  const items = actions.getAllItemsFlat()
  return items.slice(0, 10)
})

onMounted(() => {
  if (!state.wizardDone.value) {
    actions.markWizardDone()
  }
})

watch(() => state.essayContent.value, () => debounceAutoSave())

function debounceAutoSave() {
  if (saveTimer.value) clearTimeout(saveTimer.value)
  saveTimer.value = setTimeout(() => {
    actions.saveEssayContent()
    const now = new Date()
    lastSaveTime.value = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
  }, 1200)
}

function toggleDrawer(val?: boolean) {
  state.materialsDrawerOpen.value = val ?? !state.materialsDrawerOpen.value
}

function togglePreview() {
  state.editorMode.value = state.editorMode.value === 'edit' ? 'preview' : 'edit'
}

function handleEditorUpdate(content: string) {
  state.essayContent.value = content
}

function handleUpdateTitle(title: string) {
  state.documentTitle.value = title
  actions.saveEssayContent()
}

function handleResetType() {
  state.selectedEssayType.value = null
  state.selectedTemplate.value = null
  state.essayContent.value = ''
  state.documentTitle.value = ''
}

function handleChangeTemplate(tplId: string) {
  const tpl = availableTemplates.value.find(t => t.id === tplId)
  if (tpl) actions.selectTemplate(tpl)
}

function handleSelectType(type: string) {
  actions.selectEssayType(type)
  const templates = actions.getTemplatesForType(type)
  if (templates.length > 0) {
    actions.selectTemplate(templates[0])
  }
}

function handleQuickAction(key: string) {
  const actionMap: Record<string, string> = {
    polish: '请帮我润色当前文书的内容，使其更加专业和流畅',
    expand: '请帮我扩写当前段落，增加更多细节和例证',
    grammar: '请检查当前文书的语法错误和表达不当之处',
    tone: '请帮我调整文书的语气，使其更加自信但不失谦逊',
    translate: '请将当前文书内容翻译为地道的英文表达',
    outline: '请根据我的背景信息生成一份完整的文书大纲',
    draft: '请根据我的背景信息，为我生成一份完整的文书初稿'
  }
  actions.generateWithAI(actionMap[key] || key)
}

function handleExportPDF() {
  if (!state.essayContent.value.trim()) {
    ElMessage.warning('文书内容为空，无法导出')
    return
  }
  ElMessage.info('PDF 导出功能开发中...')
}

function handleGenerateDraft() {
  if (!state.selectedEssayType.value) return
  handleQuickAction('draft')
}

function handleToggleItem(index: number, e: Event) {
  const items = coreChecklistItems.value
  if (items[index]) {
    items[index].completed = (e.target as HTMLInputElement).checked
    actions.updateProgress()
  }
}
</script>

<style scoped>
.studio-page {
  position: relative;
  width: 100%;
  height: calc(100vh - 64px);
  margin-top: -20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #FFFFFF;
}
@media (max-width: 1199px) { .studio-page { height: calc(100vh - 56px); margin-top: -14px; } }
@media (max-width: 767px) { .studio-page { height: calc(100vh - 52px); margin-top: -10px; } }

.noise-overlay {
  position: fixed; inset: 0; pointer-events: none; z-index: 99999;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
}

.studio-layout {
  display: flex; flex-direction: column; height: 100%; position: relative; z-index: 1;
}

.studio-content {
  display: flex; flex: 1; overflow: hidden;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.studio-content.zen-active {
  max-width: 100%;
  justify-content: center;
}

.font-mono { font-family: var(--font-family-mono); }

@media (prefers-reduced-motion: reduce) {
  .studio-page *, .studio-page *::before, .studio-page *::after {
    animation-duration: 0.01ms !important; transition-duration: 0.01ms !important;
  }
}
</style>
