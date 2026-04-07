<template>
  <header class="studio-header">
    <div class="header-left">
      <el-tooltip
        content="材料清单"
        placement="bottom"
        :show-after="300"
      >
        <button
          class="header-btn menu-btn"
          @click="$emit('toggleDrawer')"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M3 2h10v2H3V2zm0 5h10v2H3V7zm0 5h7v2H3v-2z"
              fill="currentColor"
            />
            <circle
              cx="13"
              cy="14"
              r="1.5"
              fill="#D97706"
            />
          </svg>
        </button>
      </el-tooltip>

      <span class="header-doc-icon">✦</span>

      <div
        class="header-title-wrap"
        :class="{ editing: isEditingTitle }"
        @click="startEditTitle"
      >
        <input
          v-if="isEditingTitle"
          ref="titleInputRef"
          v-model="titleDraft"
          class="title-input"
          @blur="confirmTitle"
          @keydown.enter="confirmTitle"
          @keydown.escape="cancelTitle"
        >
        <span
          v-else
          class="header-title"
        >{{ displayTitle }}</span>
      </div>

      <span class="header-sep">·</span>

      <el-dropdown
        trigger="click"
        @command="handleTemplateChange"
      >
        <span class="header-template">
          {{ templateName }}
          <svg
            class="tpl-arrow"
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
          >
            <path
              d="M1 1l4 4 4-4"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="tpl in availableTemplates"
              :key="tpl.id"
              :command="tpl.id"
              :class="{ 'is-active': selectedTemplate?.id === tpl.id }"
            >
              {{ tpl.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-tooltip
        content="重新选择文书类型"
        placement="bottom"
        :show-after="300"
      >
        <button
          class="header-btn reset-type-btn"
          @click="$emit('resetType')"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          ><path
            d="M2 7h8m-3-3l3 3-3 3M10 4v6"
            stroke="currentColor"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          /></svg>
        </button>
      </el-tooltip>
    </div>

    <div class="header-right">
      <div
        class="save-indicator"
        :class="{ saved: !hasUnsavedChanges }"
      >
        <span class="save-dot" />
        <span class="save-text">{{ saveStatusText }}</span>
      </div>

      <el-tooltip
        content="导出 PDF"
        placement="bottom"
        :show-after="300"
      >
        <button
          class="header-btn"
          @click="$emit('exportPDF')"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M8 10V2m0 8l-3-3m3 3l3-3M2 13h12"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="btn-label">导出</span>
        </button>
      </el-tooltip>

      <el-tooltip
        content="申请材料进度"
        placement="bottom"
        :show-after="300"
      >
        <button
          class="header-btn material-badge"
          @click="$emit('toggleDrawer')"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <path
              d="M7.5 1v7.5M4 5l3.5 3.5L11 5M1 10h13M2.5 13h10"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="badge-count font-mono">{{ completedCount }}/{{ totalCount }}</span>
        </button>
      </el-tooltip>

      <el-tooltip
        :content="zenMode ? '退出专注模式' : '专注模式'"
        placement="bottom"
        :show-after="300"
      >
        <button
          class="header-btn zen-btn"
          :class="{ active: zenMode }"
          @click="$emit('toggleZen')"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M1 1h5v1H2v4H1V1zm14 0v5h-1V2h-4V1h5zM1 15v-5h1v4h4v1H1zm14 0h-5v-1h4v-4h1v5z"
              fill="currentColor"
            />
            <path
              d="M6 6h4v4H6z"
              :fill="zenMode ? '#D97706' : 'none'"
              :stroke="zenMode ? 'none' : 'currentColor'"
              stroke-width="1"
            />
          </svg>
        </button>
      </el-tooltip>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const props = defineProps<{
  documentTitle: string
  selectedTemplate: any
  selectedEssayType: string | null
  availableTemplates: any[]
  completedCount: number
  totalCount: number
  hasUnsavedChanges: boolean
  zenMode?: boolean
}>()

const emit = defineEmits<{
  toggleDrawer: []
  toggleZen: []
  exportPDF: []
  changeTemplate: [id: string]
  updateTitle: [title: string]
  resetType: []
}>()

const isEditingTitle = ref(false)
const titleDraft = ref('')
const titleInputRef = ref<HTMLInputElement>()

const displayTitle = computed(() => props.documentTitle || '未命名文档')
const templateName = computed(() => props.selectedTemplate?.name || '选择模板')
const saveStatusText = computed(() => props.hasUnsavedChanges ? '编辑中' : '已保存')

function startEditTitle() {
  titleDraft.value = props.documentTitle
  isEditingTitle.value = true
  nextTick(() => {
    titleInputRef.value?.focus()
    titleInputRef.value?.select()
  })
}

function confirmTitle() {
  if (titleDraft.value.trim()) {
    emit('updateTitle', titleDraft.value.trim())
  }
  isEditingTitle.value = false
}

function cancelTitle() {
  isEditingTitle.value = false
}

function handleTemplateChange(id: string) {
  emit('changeTemplate', id)
}
</script>

<style scoped>
.studio-header {
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border-light);
  user-select: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 6px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.header-btn:hover {
  background: var(--color-slate-100);
  color: var(--color-solid);
}

.menu-btn {
  padding: 6px;
}

.header-doc-icon {
  color: var(--color-accent);
  font-size: 14px;
  flex-shrink: 0;
}

.header-title-wrap {
  cursor: pointer;
  padding: 2px 6px;
  margin: -2px -6px;
  border-radius: 6px;
  transition: background 0.15s ease;
}

.header-title-wrap:hover {
  background: var(--color-slate-100);
}

.header-title {
  font-family: var(--font-family-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-solid);
  letter-spacing: -0.01em;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.title-input {
  font-family: var(--font-family-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-solid);
  background: white;
  border: 1px solid var(--color-accent);
  border-radius: 6px;
  padding: 2px 6px;
  outline: none;
  width: 200px;
  max-width: 200px;
}

.header-sep {
  color: var(--color-border);
  font-size: 14px;
  flex-shrink: 0;
}

.header-template {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: 3px 8px;
  border-radius: 6px;
  transition: all 0.15s ease;
  max-width: 160px;
}

.header-template:hover {
  background: var(--color-slate-100);
  color: var(--color-text-secondary);
}

.tpl-arrow {
  flex-shrink: 0;
  opacity: 0.5;
  transition: transform 0.2s ease;
}

.header-template:hover .tpl-arrow {
  transform: translateY(1px);
  opacity: 1;
}

.btn-label {
  font-size: 12px;
}

.save-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  color: var(--color-warning);
  transition: all 0.25s ease;
}

.save-indicator.saved {
  color: var(--color-success);
}

.save-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s ease-in-out infinite;
}

.save-indicator.saved .save-dot {
  animation: none;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.save-text {
  font-weight: 500;
  letter-spacing: 0.2px;
}

.material-badge {
  position: relative;
}

.badge-count {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.zen-btn {
  position: relative;
}

.zen-btn.active {
  background: var(--color-solid);
  color: white;
}

.zen-btn.active:hover {
  background: var(--color-solid-hover);
}

.reset-type-btn {
  padding: 6px;
}
.reset-type-btn:hover {
  color: var(--color-accent);
  background: var(--color-accent-subtle);
}

.font-mono {
  font-family: var(--font-family-mono);
}

@media (max-width: 768px) {
  .studio-header {
    padding: 0 12px;
  }

  .btn-label {
    display: none;
  }

  .header-template {
    max-width: 90px;
  }

  .header-template span:not(.tpl-arrow) {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .save-text {
    display: none;
  }
}
</style>
