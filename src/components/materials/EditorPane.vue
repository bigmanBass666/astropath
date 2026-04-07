<template>
  <div
    class="editor-pane"
    :class="{
      'preview-mode': mode === 'preview',
      'empty-mode': !hasContent,
      'zen-mode': zenMode
    }"
  >
    <!-- ===== EMPTY STATE: Essay Type Selection ===== -->
    <Transition name="empty-fade">
      <div
        v-if="!hasContent"
        class="empty-state"
      >
        <div class="empty-hero">
          <div class="empty-badge">
            WRITER'S STUDIO
          </div>
          <h1 class="empty-title">
            选择你要撰写的文书类型
          </h1>
          <p class="empty-subtitle">
            点击下方卡片开始，AI 将辅助你完成从初稿到定稿
          </p>
        </div>

        <div class="type-grid">
          <button
            v-for="(type, idx) in essayTypes"
            :key="type.value"
            class="type-card"
            :class="{ selected: selectedType === type.value, featured: idx === 0 }"
            :style="{ '--stagger': idx * 0.08 + 's' }"
            @click="$emit('selectType', type.value)"
          >
            <span
              v-if="idx === 0 && selectedType !== type.value"
              class="type-recommend"
            >推荐首选</span>
            <span class="type-index font-mono">{{ String(idx + 1).padStart(2, '0') }}</span>
            <div class="type-icon-wrap">
              {{ typeIcon(type.value) }}
            </div>
            <h3 class="type-name">
              {{ type.label }}
            </h3>
            <p class="type-desc">
              {{ type.description }}
            </p>
            <div class="type-cta">
              <template v-if="selectedType === type.value">
                <span class="cta-check">✓ 已选择，正在加载模板...</span>
              </template>
              <template v-else>
                <span class="cta-text">开始写作</span>
                <svg
                  class="cta-arrow"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                ><path
                  d="M4 8h8m-3-3l3 3-3 3"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg>
              </template>
            </div>
          </button>
        </div>

        <div class="empty-footer-hint">
          <div class="hint-pulse" />
          <span>👆 点击任意卡片即可开始，也可稍后通过顶栏切换文书类型</span>
        </div>
      </div>
    </Transition>

    <!-- ===== EDITOR MODE ===== -->
    <template v-if="hasContent">
      <!-- Floating Toolbar -->
      <div
        v-if="mode === 'edit' && !zenMode"
        class="floating-toolbar"
        :class="{ visible: toolbarVisible }"
      >
        <div class="toolbar-group">
          <button
            class="fmt-btn"
            title="加粗 (Ctrl+B)"
            @click="format('bold')"
          >
            <strong>B</strong>
          </button>
          <button
            class="fmt-btn"
            title="斜体 (Ctrl+I)"
            @click="format('italic')"
          >
            <em>I</em>
          </button>
          <button
            class="fmt-btn"
            title="下划线 (Ctrl+U)"
            @click="format('underline')"
          >
            <span style="text-decoration:underline">U</span>
          </button>
        </div>
        <div class="toolbar-sep" />
        <div class="toolbar-group">
          <button
            class="fmt-btn"
            title="标题1"
            @click="formatBlock('h1')"
          >
            H1
          </button>
          <button
            class="fmt-btn"
            title="标题2"
            @click="formatBlock('h2')"
          >
            H2
          </button>
          <button
            class="fmt-btn"
            title="标题3"
            @click="formatBlock('h3')"
          >
            H3
          </button>
        </div>
        <div class="toolbar-sep" />
        <div class="toolbar-group">
          <button
            class="fmt-btn"
            title="无序列表"
            @click="format('insertUnorderedList')"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            ><path
              d="M5 3h7M5 7h7M5 11h7M1 3.5h1.5M1 7h1.5M1 10.5h1.5"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
            /></svg>
          </button>
          <button
            class="fmt-btn"
            title="有序列表"
            @click="format('insertOrderedList')"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            ><path
              d="M6 3h7M6 7h7M6 11h7M2 2.5v3M2 3.5h1M2 4.5H1.5M2 6.5v3M2 7.5h1.5M2 8.5H1.5M2 10.5v1a.5.5 0 00.5.5H3"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
            /></svg>
          </button>
        </div>
        <div class="toolbar-sep" />
        <div class="toolbar-group">
          <button
            class="fmt-btn"
            title="撤销 (Ctrl+Z)"
            @click="format('undo')"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            ><path
              d="M7 3.5C4.8 3.5 3 5 3 7h2.5L2.5 10 0 7h2c0-2.8 2.2-5 5-5 1.3 0 2.5.5 3.4 1.3"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg>
          </button>
          <button
            class="fmt-btn"
            title="重做 (Ctrl+Y)"
            @click="format('redo')"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            ><path
              d="M7 3.5c2.2 0 4 1.5 4 3.5H8.5L11.5 10 14 7h-2c0-2.8-2.2-5-5-5-1.3 0-2.5.5-3.4 1.3"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg>
          </button>
        </div>
      </div>

      <!-- Slash Command Menu -->
      <Transition name="slash-fade">
        <div
          v-if="showSlashMenu && !zenMode"
          class="slash-menu"
          :style="{ top: slashPosition.top + 'px', left: slashPosition.left + 'px' }"
        >
          <div class="slash-header">
            格式命令
          </div>
          <div class="slash-list">
            <button
              v-for="cmd in slashCommands"
              :key="cmd.key"
              class="slash-item"
              :class="{ selected: selectedSlashIndex === cmd.index }"
              @click="execSlashCommand(cmd)"
              @mouseenter="selectedSlashIndex = cmd.index"
            >
              <span class="slash-icon">{{ cmd.icon }}</span>
              <span class="slash-label">{{ cmd.label }}</span>
              <span class="slash-desc">{{ cmd.desc }}</span>
            </button>
          </div>
          <div class="slash-hint">
            ↑↓ 选择 · Enter 执行 · Esc 关闭
          </div>
        </div>
      </Transition>

      <!-- Edit Mode -->
      <div
        v-show="mode === 'edit'"
        ref="editorRef"
        class="editor-content"
        contenteditable="true"
        role="textbox"
        aria-multiline="true"
        :data-placeholder="placeholderText"
        @input="onInput"
        @keydown="onKeydown"
        @focus="onFocus"
        @blur="onBlur"
      />

      <!-- Preview Mode -->
      <div
        v-show="mode === 'preview'"
        class="preview-content"
        v-html="renderedContent"
      />

      <!-- Zen Mode Exit Hint -->
      <Transition name="zen-hint">
        <div
          v-if="zenMode && mode === 'edit'"
          class="zen-exit-hint"
          @click="$emit('toggleZen')"
        >
          按 Esc 退出专注模式
        </div>
      </Transition>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  content: string
  mode: 'edit' | 'preview'
  placeholder?: string
  hasContent: boolean
  selectedType?: string | null
  essayTypes?: Array<{ value: string; label: string; description: string }>
  zenMode?: boolean
}>(), {
  placeholder: '开始书写你的故事...',
  hasContent: false,
  selectedType: null,
  essayTypes: () => [],
  zenMode: false
})

const emit = defineEmits<{
  update: [content: string]
  insertSlashCommand: [command: string]
  selectType: [type: string]
  toggleZen: []
}>()

const editorRef = ref<HTMLDivElement>()
const toolbarVisible = ref(false)
const showSlashMenu = ref(false)
const slashPosition = ref({ top: 0, left: 0 })
const selectedSlashIndex = ref(0)
const isFocused = ref(false)

const placeholderText = computed(() => props.placeholder || '开始书写你的故事...')

const renderedContent = computed(() => {
  if (!props.content) return ''
  let html = props.content.replace(/&/g, '&amp;').replace(/</g, '<lt;').replace(/>/g, '&gt;')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^# (.+)$/gm, '<h1>$1</h1>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/^- (.+)$/gm, '<li>$1</li>').replace(/(<li>.*<\/li>\n?)/gs, '<ul>$1</ul>').replace(/\n/g, '<br>')
  return html
})

function typeIcon(val: string): string {
  const icons: Record<string, string> = { ps: '✍️', cv: '📄', reference: '✉️', research: '🔬' }
  return icons[val] || '📝'
}

const slashCommands = [
  { key: 'bold', label: '加粗', desc: 'Ctrl+B', icon: '**B**', index: 0 },
  { key: 'italic', label: '斜体', desc: 'Ctrl+I', icon: '*I*', index: 1 },
  { key: 'h1', label: '一级标题', desc: '大标题', icon: 'H₁', index: 2 },
  { key: 'h2', label: '二级标题', desc: '中标题', icon: 'H₂', index: 3 },
  { key: 'h3', label: '三级标题', desc: '小标题', icon: 'H₃', index: 4 },
  { key: 'ul', label: '无序列表', desc: '项目列表', icon: '•', index: 5 },
  { key: 'ol', label: '有序列表', desc: '编号列表', icon: '1.', index: 6 },
  { key: 'hr', label: '分割线', desc: '水平分割', icon: '—', index: 7 },
  { key: 'quote', label: '引用块', desc: '引用文字', icon: '"', index: 8 }
]

function onInput() {
  if (!editorRef.value) return
  const text = editorRef.value.innerText || ''
  emit('update', text)
  if (editorRef.value.innerHTML.includes('/')) checkSlashCommand()
  else showSlashMenu.value = false
}

function onFocus() {
  isFocused.value = true
  toolbarVisible.value = true
}

function onBlur() {
  isFocused.value = false
  setTimeout(() => { if (!isFocused.value) toolbarVisible.value = false }, 150)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Tab') { e.preventDefault(); document.execCommand('insertText', false, '    ') }

  if (props.zenMode && e.key === 'Escape') { emit('toggleZen'); return }

  if (showSlashMenu.value) {
    if (e.key === 'ArrowDown') { e.preventDefault(); selectedSlashIndex.value = (selectedSlashIndex.value + 1) % slashCommands.length }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selectedSlashIndex.value = (selectedSlashIndex.value - 1 + slashCommands.length) % slashCommands.length }
    else if (e.key === 'Enter') { e.preventDefault(); execSlashCommand(slashCommands[selectedSlashIndex.value]) }
    else if (e.key === 'Escape') { e.preventDefault(); showSlashMenu.value = false }
    return
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') { e.preventDefault(); format('bold') }
  if ((e.ctrlKey || e.metaKey) && e.key === 'i') { e.preventDefault(); format('italic') }
}

function checkSlashCommand() {
  const sel = window.getSelection()
  if (!sel || !sel.rangeCount || !editorRef.value) return
  const range = sel.getRangeAt(0)
  const textBeforeCaret = range.startContainer.textContent?.substring(0, range.startOffset) || ''
  if (textBeforeCaret.endsWith('/')) {
    const rect = range.getBoundingClientRect()
    slashPosition.value = { top: rect.bottom + 8, left: Math.min(rect.left, window.innerWidth - 280) }
    selectedSlashIndex.value = 0
    showSlashMenu.value = true
  } else {
    showSlashMenu.value = false
  }
}

function execSlashCommand(cmd: { key: string }) {
  showSlashMenu.value = false
  const sel = window.getSelection()
  if (!sel || !sel.rangeCount) return
  const range = sel.getRangeAt(0)
  const textNode = range.startContainer
  if (textNode.nodeType === Node.TEXT_NODE) {
    const text = textNode.textContent || ''
    const slashIdx = text.lastIndexOf('/')
    if (slashIdx >= 0) { ;(textNode as Text).deleteData(slashIdx, text.length - slashIdx) }
  }
  switch (cmd.key) {
    case 'bold': format('bold'); break
    case 'italic': format('italic'); break
    case 'h1': formatBlock('h1'); break
    case 'h2': formatBlock('h2'); break
    case 'h3': formatBlock('h3'); break
    case 'ul': format('insertUnorderedList'); break
    case 'ol': format('insertOrderedList'); break
    case 'hr':
      document.execCommand('insertHTML', false, '<hr style="border:none;border-top:1px solid var(--color-border);margin:16px 0;">')
      break
    case 'quote':
      document.execCommand('insertHTML', false, '<blockquote style="border-left:3px solid var(--color-accent);padding-left:16px;color:var(--color-text-secondary);font-style:italic;margin:12px 0;"></blockquote>')
      break
  }
  nextTick(() => editorRef.value?.focus())
  emit('insertSlashCommand', cmd.key)
}

function format(command: string) { document.execCommand(command, false); syncContent() }
function formatBlock(tag: string) { document.execCommand('formatBlock', false, `<${tag}>`); syncContent() }

function syncContent() {
  nextTick(() => {
    if (editorRef.value) emit('update', editorRef.value.innerText || '')
  })
}

function setEditorContent(html: string) {
  nextTick(() => {
    if (editorRef.value) {
      editorRef.value.innerHTML = html.split('\n').map(line => line.trim() ? `<p>${escapeHtml(line)}</p>` : '<p><br></p>').join('')
    }
  })
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

defineExpose({ setEditorContent, editorRef })

watch(() => props.content, (newVal) => {
  nextTick(() => {
    if (!editorRef.value) return
    if (newVal !== undefined && newVal !== null && newVal !== editorRef.value.innerText) {
      if (newVal.length > 0 && !editorRef.value.innerHTML.includes(newVal.substring(0, Math.min(20, newVal.length)))) {
        const html = newVal.split('\n').map(line => line.trim() ? `<p>${escapeHtml(line)}</p>` : '<p><br></p>').join('')
        editorRef.value.innerHTML = html
      } else if (newVal.length === 0) {
        editorRef.value.innerHTML = ''
      }
    }
  })
})

watch(editorRef, () => {
  nextTick(() => {
    if (!editorRef.value || !props.content) return
    const currentText = editorRef.value.innerText || ''
    if (props.content !== currentText && props.content.length > 0) {
      const html = props.content.split('\n').map(line => line.trim() ? `<p>${escapeHtml(line)}</p>` : '<p><br></p>').join('')
      editorRef.value.innerHTML = html
    }
  })
})
</script>

<style scoped>
.editor-pane {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  background: #FFFFFF;
}
.editor-pane.preview-mode { background: #FAFBFC; }
.editor-pane.zen-mode { background: #FFFFFF; }

/* ========== EMPTY STATE ========== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 100px 40px 80px;
  animation: emptyIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes emptyIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.empty-hero {
  text-align: center;
  margin-bottom: 48px;
}

.empty-badge {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 3px;
  font-weight: 700;
  color: var(--color-accent);
  text-transform: uppercase;
  padding: 6px 18px;
  background: var(--color-accent-subtle);
  border-radius: 100px;
  margin-bottom: 24px;
}

.empty-title {
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 800;
  color: var(--color-solid);
  letter-spacing: -0.03em;
  margin: 0 0 12px;
  line-height: 1.15;
}

.empty-subtitle {
  font-size: 15px;
  color: var(--color-text-secondary);
  max-width: 420px;
  line-height: 1.65;
  margin: 0 auto;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
}

.type-card {
  position: relative;
  text-align: left;
  padding: 28px 24px 24px;
  border: 2px solid var(--color-border-light);
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--stagger);
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.type-card.featured {
  border-color: rgba(217, 119, 6, 0.25);
  box-shadow: 0 4px 24px rgba(217, 119, 6, 0.06);
  animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both,
             featuredPulse 2.5s ease-in-out infinite;
  animation-delay: var(--stagger), calc(var(--stagger) + 0.8s);
}
@keyframes featuredPulse {
  0%, 100% { box-shadow: 0 4px 24px rgba(217, 119, 6, 0.06); }
  50% { box-shadow: 0 4px 32px rgba(217, 119, 6, 0.14), 0 0 0 1px rgba(217, 119, 6, 0.08); }
}

.type-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.03) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.35s ease;
}

.type-recommend {
  position: absolute;
  top: 14px;
  left: 16px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: white;
  background: linear-gradient(135deg, var(--color-accent) 0%, #B45309 100%);
  padding: 4px 12px;
  border-radius: 100px;
  z-index: 2;
}

.type-card:hover {
  transform: translateY(-6px) scale(1.02);
  border-color: transparent;
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.1);
}
.type-card:hover::before { opacity: 1; }

.type-card.selected {
  border-color: var(--color-accent);
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.04) 0%, white 60%);
  box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.15), 0 12px 36px rgba(217, 119, 6, 0.1);
  transform: none !important;
}

.type-index {
  position: absolute;
  top: 16px;
  right: 18px;
  font-size: 32px;
  font-weight: 800;
  color: var(--color-slate-100);
  line-height: 1;
  transition: color 0.3s ease;
}
.type-card.selected .type-index,
.type-card:hover .type-index { color: rgba(217, 119, 6, 0.18); }

.type-icon-wrap {
  font-size: 30px;
  margin-bottom: 14px;
  line-height: 1;
}

.type-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-solid);
  margin: 0 0 8px;
}

.type-desc {
  font-size: 13px;
  color: var(--color-text-tertiary);
  line-height: 1.55;
  margin: 0 0 18px;
}

/* CTA Button */
.type-cta {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  width: fit-content;
}

.type-card:not(.selected) .type-cta {
  background: var(--color-solid);
  color: white;
}
.type-card:not(.selected):hover .type-cta {
  background: var(--color-solid-hover);
  transform: translateX(3px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
}

.type-card:not(.selected) .cta-arrow {
  transition: transform 0.25s ease;
}
.type-card:not(.selected):hover .cta-arrow {
  transform: translateX(3px);
}

.cta-check {
  color: var(--color-accent);
  font-weight: 600;
}

/* Footer Hint */
.empty-footer-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
  padding: 14px 24px;
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.04) 0%, rgba(251, 191, 36, 0.03) 100%);
  border: 1px dashed rgba(217, 119, 6, 0.15);
  border-radius: 12px;
  font-size: 13.5px;
  color: var(--color-text-secondary);
  animation: hintFadeIn 0.6s 1s both;
}
@keyframes hintFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.hint-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: dotPulse 2s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}

/* ========== FLOATING TOOLBAR ========== */
.floating-toolbar {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 10px;
  background: white;
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.02);
  opacity: 0;
  pointer-events: none;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 50;
}
.floating-toolbar.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}
.toolbar-group { display: flex; gap: 1px; }
.toolbar-sep { width: 1px; height: 20px; background: var(--color-border-light); margin: 0 6px; }
.fmt-btn {
  display: flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border: none; border-radius: 6px;
  background: transparent; color: var(--color-text-secondary); cursor: pointer;
  font-family: inherit; font-size: 12px; transition: all 0.15s ease;
}
.fmt-btn:hover { background: var(--color-slate-100); color: var(--color-solid); }
.fmt-btn:active { background: var(--color-slate-200); transform: scale(0.95); }

/* ========== EDITOR CONTENT ========== */
.editor-content {
  width: 100%; max-width: 820px; min-height: calc(100vh - 48px - 32px - 80px);
  padding: 60px 60px 120px; outline: none;
  font-family: var(--font-family-base); font-size: 15px; line-height: 1.9;
  color: var(--color-text-primary); transition: box-shadow 0.3s ease;
}
.zen-mode .editor-content { max-width: 720px; padding: 80px 80px 140px; }
.editor-content:focus { box-shadow: inset 0 0 0 1px rgba(217, 119, 6, 0.08); }
.editor-content:empty::before {
  content: attr(data-placeholder);
  color: var(--color-text-muted); font-size: 17px; pointer-events: none;
  display: block; text-align: center; padding-top: 100px; letter-spacing: 0.02em;
}

.editor-content :deep(h1) { font-size: 26px; font-weight: 700; margin: 28px 0 14px; color: var(--color-solid); border-bottom: 2px solid var(--color-solid); padding-bottom: 10px; letter-spacing: -0.02em; }
.editor-content :deep(h2) { font-size: 21px; font-weight: 700; margin: 22px 0 10px; color: var(--color-solid); }
.editor-content :deep(h3) { font-size: 17px; font-weight: 600; margin: 18px 0 8px; color: var(--color-text-secondary); }
.editor-content :deep(p) { margin: 6px 0; text-indent: 2em; }
.editor-content :deep(ul), .editor-content :deep(ol) { margin: 10px 0; padding-left: 28px; }
.editor-content :deep(li) { margin: 4px 0; }
.editor-content :deep(strong) { font-weight: 700; color: var(--color-solid); }
.editor-content :deep(em) { font-style: italic; }
.editor-content :deep(blockquote) { margin: 12px 0; padding-left: 16px; }
.editor-content :deep(hr) { margin: 16px 0; }

/* Preview Content */
.preview-content { width: 100%; max-width: 820px; min-height: calc(100vh - 48px - 32px - 80px); padding: 60px 60px 120px; font-size: 15px; line-height: 1.9; color: var(--color-text-primary); }
.preview-content :deep(h1) { font-size: 26px; font-weight: 700; margin-bottom: 16px; color: var(--color-solid); border-bottom: 2px solid var(--color-solid); padding-bottom: 10px; }
.preview-content :deep(h2) { font-size: 21px; font-weight: 700; margin-top: 28px; margin-bottom: 12px; color: var(--color-solid); }
.preview-content :deep(h3) { font-size: 17px; font-weight: 600; margin-top: 20px; margin-bottom: 8px; color: var(--color-text-secondary); }
.preview-content :deep(p) { margin: 10px 0; text-indent: 2em; }
.preview-content :deep(strong) { color: var(--color-solid); }
.preview-content :deep(em) { font-style: italic; }

/* Zen Mode Exit Hint */
.zen-exit-hint {
  position: fixed;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 20px;
  background: rgba(15, 23, 42, 0.06);
  border: 1px solid var(--color-border-light);
  border-radius: 100px;
  font-size: 12px;
  color: var(--color-text-muted);
  cursor: pointer;
  z-index: 50;
  transition: all 0.2s ease;
}
.zen-exit-hint:hover { background: rgba(15, 23, 42, 0.1); color: var(--color-text-secondary); }

/* Slash Menu */
.slash-menu {
  position: fixed; z-index: 200; width: 260px;
  background: white; border: 1px solid var(--color-border); border-radius: 12px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.03);
  overflow: hidden;
  animation: slashIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slashIn { from { opacity: 0; transform: translateY(-4px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
.slash-header { padding: 10px 14px 6px; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--color-accent); }
.slash-list { padding: 4px 8px 8px; }
.slash-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 10px; border: none; border-radius: 8px; background: transparent; cursor: pointer; font-family: inherit; text-align: left; transition: all 0.1s ease; }
.slash-item:hover, .slash-item.selected { background: var(--color-slate-100); }
.slash-item.selected { background: var(--color-accent-subtle); }
.slash-icon { font-family: var(--font-family-mono); font-size: 13px; font-weight: 700; color: var(--color-accent); width: 36px; flex-shrink: 0; }
.slash-label { font-size: 13px; font-weight: 600; color: var(--color-solid); }
.slash-desc { font-size: 11px; color: var(--color-text-muted); margin-left: auto; }
.slash-hint { padding: 8px 14px 10px; font-size: 10px; color: var(--color-text-muted); border-top: 1px solid var(--color-border-light); letter-spacing: 0.5px; }

/* Transitions */
.empty-fade-enter-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.empty-fade-leave-active { transition: all 0.2s ease-in; }
.empty-fade-enter-from, .empty-fade-leave-to { opacity: 0; transform: translateY(12px); }
.slash-fade-enter-active { transition: all 0.12s cubic-bezier(0.16, 1, 0.3, 1); }
.slash-fade-leave-active { transition: all 0.08s ease-in; }
.slash-fade-enter-from, .slash-fade-leave-to { opacity: 0; transform: translateY(-4px) scale(0.97); }
.zen-hint-enter-active { transition: all 0.3s ease; }
.zen-hint-leave-active { transition: all 0.15s ease; }
.zen-hint-enter-from, .zen-hint-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }

@media (max-width: 768px) {
  .editor-content, .preview-content { padding: 40px 24px 100px; min-height: calc(100vh - 48px - 32px - 40px); }
  .zen-mode .editor-content { padding: 40px 24px 100px; }
  .floating-toolbar { left: 16px; right: 16px; transform: none; justify-content: flex-start; flex-wrap: wrap; gap: 4px; }
  .floating-toolbar.visible { transform: none; }
  .toolbar-sep { display: none; }
  .type-grid { grid-template-columns: 1fr; }
  .empty-state { padding: 40px 20px 60px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
</style>
