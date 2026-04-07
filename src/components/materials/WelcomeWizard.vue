<template>
  <Teleport to="body">
    <Transition name="wizard">
      <div
        v-if="visible"
        class="wizard-overlay"
        @click.self="handleSkip"
      >
        <div class="wizard-container">
          <!-- Close / Skip -->
          <button
            class="wizard-skip"
            @click="handleSkip"
          >
            跳过
          </button>

          <!-- Step 1: Essay Type -->
          <div
            v-if="step === 1"
            class="wizard-step"
          >
            <div class="wizard-label">
              STEP 01 / 选择文书类型
            </div>
            <h2 class="wizard-title">
              你想撰写哪种文书？
            </h2>
            <p class="wizard-desc">
              选择文书类型后，我们将为你推荐合适的模板和写作指导
            </p>

            <div class="type-grid">
              <button
                v-for="(type, idx) in essayTypes"
                :key="type.value"
                class="type-card"
                :class="{ selected: selectedType === type.value }"
                :style="{ '--delay': idx * 0.08 + 's' }"
                @click="selectedType = type.value; nextStep()"
              >
                <span class="type-num font-mono">{{ String(idx + 1).padStart(2, '0') }}</span>
                <h3 class="type-name">
                  {{ type.label }}
                </h3>
                <p class="type-desc">
                  {{ type.description }}
                </p>
                <svg
                  class="type-arrow"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                ><path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg>
              </button>
            </div>
          </div>

          <!-- Step 2: Template -->
          <div
            v-if="step === 2"
            class="wizard-step"
          >
            <button
              class="wizard-back"
              @click="prevStep"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              ><path
                d="M9 3L5 7l4 4"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg>
              返回
            </button>
            <div class="wizard-label">
              STEP 02 / 选择模板
            </div>
            <h2 class="wizard-title">
              为你的{{ currentTypeName }}选择模板
            </h2>
            <p class="wizard-desc">
              模板提供了标准的结构框架，你可以在此基础上自由发挥
            </p>

            <!-- Key Points -->
            <div
              v-if="currentKeyPoints?.length"
              class="keypoints-bar"
            >
              <div class="kp-icon">
                💡
              </div>
              <ul class="kp-list">
                <li
                  v-for="(point, i) in currentKeyPoints.slice(0, 3)"
                  :key="i"
                >
                  {{ point }}
                </li>
              </ul>
            </div>

            <div class="tpl-grid">
              <button
                v-for="(tpl, idx) in currentTemplates"
                :key="tpl.id"
                class="tpl-card"
                :class="{ selected: selectedTplId === tpl.id }"
                :style="{ '--delay': idx * 0.06 + 's' }"
                @click="selectTemplate(tpl)"
              >
                <span class="tpl-badge">TEMPLATE</span>
                <div class="tpl-icon-wrap">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  ><path
                    d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
                    stroke="currentColor"
                    stroke-width="1.5"
                  /><path
                    d="M14 2v6h6"
                    stroke="currentColor"
                    stroke-width="1.5"
                  /></svg>
                </div>
                <h4 class="tpl-name">
                  {{ tpl.name }}
                </h4>
                <p class="tpl-desc">
                  {{ tpl.description }}
                </p>
              </button>
            </div>
          </div>

          <!-- Progress indicator -->
          <div class="wizard-progress">
            <div
              v-for="s in 2"
              :key="s"
              class="progress-dot"
              :class="{ active: step >= s }"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  visible: boolean
  essayTypes: Array<{ value: string; label: string; description: string }>
  templates: Array<{ id: string; name: string; description: string; content: string }>
  keyPoints?: string[]
}>()

const emit = defineEmits<{
  selectType: [type: string]
  selectTemplate: [template: any]
  skip: []
}>()

const step = ref(1)
const selectedType = ref<string | null>(null)
const selectedTplId = ref<string | null>(null)

const currentTemplates = computed(() => props.templates)
const currentTypeName = computed(() => {
  return props.essayTypes.find(t => t.value === selectedType.value)?.label || ''
})
const currentKeyPoints = computed<string[]>(() => props.keyPoints || [])

function nextStep() {
  if (step.value === 1 && selectedType.value) {
    emit('selectType', selectedType.value)
    step.value = 2
  }
}

function prevStep() {
  if (step.value > 1) step.value--
}

function selectTemplate(tpl: any) {
  selectedTplId.value = tpl.id
  setTimeout(() => {
    emit('selectTemplate', tpl)
  }, 300)
}

function handleSkip() {
  emit('skip')
}
</script>

<style scoped>
.wizard-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(8px);
}

.wizard-container {
  position: relative;
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 48px 40px 40px;
  background: white;
  border-radius: 24px;
  box-shadow:
    0 40px 80px rgba(15, 23, 42, 0.15),
    0 0 0 1px rgba(15, 23, 42, 0.04);
}

.wizard-skip {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 6px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  transition: all 0.15s ease;
}

.wizard-skip:hover {
  color: var(--color-text-secondary);
  background: var(--color-slate-100);
}

.wizard-back {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  margin-bottom: 20px;
  transition: all 0.15s ease;
}

.wizard-back:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
}

.wizard-label {
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

.wizard-title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  color: var(--color-solid);
  letter-spacing: -0.02em;
  margin: 0 0 12px;
  line-height: 1.15;
}

.wizard-desc {
  font-size: 15px;
  color: var(--color-text-secondary);
  max-width: 480px;
  line-height: 1.65;
  margin: 0 0 32px;
}

/* Type Cards */
.type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.type-card {
  position: relative;
  text-align: left;
  padding: 28px 24px;
  border: 1px solid var(--color-border-light);
  border-radius: 18px;
  background: white;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

.type-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.03) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.type-card:hover {
  transform: translateY(-4px);
  border-color: transparent;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.type-card:hover::before {
  opacity: 1;
}

.type-card.selected {
  border-color: var(--color-accent);
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.03) 0%, white 50%);
  box-shadow: 0 0 0 1px rgba(217, 119, 6, 0.15), 0 8px 30px rgba(217, 119, 6, 0.08);
}

.type-num {
  position: absolute;
  top: 18px;
  right: 20px;
  font-size: 36px;
  font-weight: 800;
  color: var(--color-slate-100);
  line-height: 1;
  letter-spacing: -0.02em;
  transition: color 0.3s ease;
}

.type-card.selected .type-num,
.type-card:hover .type-num {
  color: rgba(217, 119, 6, 0.15);
}

.type-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-solid);
  margin: 0 0 8px;
}

.type-desc {
  font-size: 13px;
  color: var(--color-text-tertiary);
  line-height: 1.55;
  margin: 0;
}

.type-arrow {
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: var(--color-slate-300);
  transition: all 0.3s ease;
}

.type-card:hover .type-arrow,
.type-card.selected .type-arrow {
  color: var(--color-accent);
  transform: translateX(4px);
}

/* Key Points */
.keypoints-bar {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 18px;
  background: linear-gradient(135deg, var(--color-accent-subtle) 0%, rgba(251, 191, 36, 0.05) 100%);
  border: 1px solid rgba(217, 119, 6, 0.1);
  border-radius: 12px;
  margin-bottom: 24px;
}

.kp-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.kp-list {
  margin: 0;
  padding-left: 16px;
}

.kp-list li {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.65;
}

/* Template Cards */
.tpl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.tpl-card {
  text-align: left;
  padding: 24px 22px;
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.tpl-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.07);
  border-color: transparent;
}

.tpl-card.selected {
  border-color: var(--color-accent);
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.03) 0%, white 50%);
}

.tpl-badge {
  font-size: 9px;
  letter-spacing: 2px;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  margin-bottom: 14px;
}

.tpl-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  background: var(--color-slate-50);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-slate-500);
  margin-bottom: 14px;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tpl-card.selected .tpl-icon-wrap,
.tpl-card:hover .tpl-icon-wrap {
  background: var(--color-solid);
  color: white;
}

.tpl-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-solid);
  margin: 0 0 6px;
}

.tpl-desc {
  font-size: 13px;
  color: var(--color-text-tertiary);
  line-height: 1.55;
  margin: 0;
}

/* Progress Dots */
.wizard-progress {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 28px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-slate-200);
  transition: all 0.3s ease;
}

.progress-dot.active {
  background: var(--color-accent);
  width: 24px;
  border-radius: 4px;
}

.font-mono {
  font-family: var(--font-family-mono);
}

/* Transition */
.wizard-enter-active .wizard-container {
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.wizard-leave-active .wizard-container {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.wizard-enter-active .wizard-overlay,
.wizard-leave-active .wizard-overlay {
  transition: opacity 0.3s ease;
}
.wizard-enter-from .wizard-overlay,
.wizard-leave-to .wizard-overlay {
  opacity: 0;
}
.wizard-enter-from .wizard-container {
  opacity: 0;
  transform: scale(0.96) translateY(20px);
}
.wizard-leave-to .wizard-container {
  opacity: 0;
  transform: scale(0.98) translateY(-10px);
}

@media (max-width: 640px) {
  .wizard-container {
    padding: 32px 20px 28px;
    border-radius: 20px;
  }

  .type-grid {
    grid-template-columns: 1fr;
  }

  .tpl-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wizard-enter-active,
  .wizard-leave-active,
  .type-card,
  .tpl-card,
  .progress-dot {
    transition: none !important;
  }
}
</style>
