<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isVisible"
        class="sa-overlay"
        @click.self="handleClose"
      >
        <Transition name="panel">
          <div
            v-if="isVisible"
            class="sa-panel"
          >
            <!-- Header -->
            <header class="sa-header">
              <div class="sa-header__school">
                <h3 class="sa-header__name">
                  {{ schoolName }}
                </h3>
                <div class="sa-header__meta">
                  <span
                    v-if="recommendation?.country"
                    class="sa-meta-chip"
                  >🇺🇳 {{ recommendation.country }}</span>
                  <span
                    v-if="recommendation?.ranking"
                    class="sa-meta-chip sa-meta-chip--mono"
                  >#{{ recommendation.ranking }}</span>
                  <span
                    v-if="recommendation?.acceptanceRate"
                    class="sa-meta-chip"
                  >{{ recommendation.acceptanceRate }}% 录取率</span>
                </div>
              </div>

              <button
                class="sa-close"
                @click="handleClose"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                ><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </header>

            <!-- Body -->
            <div class="sa-body">
              <!-- Loading State -->
              <div
                v-if="loading && !analysisData"
                class="sa-loading"
              >
                <div class="sa-loading__spinner">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D97706"
                    stroke-width="2.5"
                    class="spin-svg"
                  ><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                </div>
                <p class="sa-loading__text">
                  AI 正在深度分析...
                </p>
                <p class="sa-loading__sub">
                  综合多维度数据生成个性化报告
                </p>
              </div>

              <!-- Analysis Content -->
              <template v-else-if="currentAnalysis">
                <!-- Admission Probability -->
                <section class="sa-section sa-section--prob">
                  <div class="sa-section__head">
                    <span class="sa-icon sa-icon--green">✓</span>
                    <span>录取概率评估</span>
                  </div>
                  <div class="sa-prob-bar">
                    <div
                      class="sa-prob-fill"
                      :style="{ width: currentAnalysis.admissionProbability + '%', '--prob-color': probColor(currentAnalysis.admissionProbability) }"
                    />
                    <span class="sa-prob-label">{{ getProbLabel(currentAnalysis.admissionProbability) }} ({{ currentAnalysis.admissionProbability }}%)</span>
                  </div>
                </section>

                <!-- Match Points -->
                <section
                  v-if="currentAnalysis.matchPoints?.length"
                  class="sa-section sa-section--match"
                >
                  <div class="sa-section__head">
                    <span class="sa-icon sa-icon--amber">✦</span>
                    <span>匹配点</span>
                  </div>
                  <ul class="sa-list">
                    <li
                      v-for="(point, idx) in currentAnalysis.matchPoints"
                      :key="'mp'+idx"
                      class="sa-li"
                    >
                      <span class="sa-li__dot" />{{ point }}
                    </li>
                  </ul>
                </section>

                <!-- Risk Points -->
                <section
                  v-if="currentAnalysis.riskPoints?.length"
                  class="sa-section sa-section--risk"
                >
                  <div class="sa-section__head">
                    <span class="sa-icon sa-icon--red">⚠</span>
                    <span>风险提示</span>
                  </div>
                  <ul class="sa-list">
                    <li
                      v-for="(risk, idx) in currentAnalysis.riskPoints"
                      :key="'rp'+idx"
                      class="sa-li sa-li--risk"
                    >
                      <span class="sa-li__dot" />{{ risk }}
                    </li>
                  </ul>
                </section>

                <!-- Suggestions -->
                <section
                  v-if="currentAnalysis.suggestions?.length"
                  class="sa-section sa-section--suggest"
                >
                  <div class="sa-section__head">
                    <span class="sa-icon sa-icon--blue">💡</span>
                    <span>申请建议</span>
                  </div>
                  <ul class="sa-list">
                    <li
                      v-for="(sug, idx) in currentAnalysis.suggestions"
                      :key="'sg'+idx"
                      class="sa-li"
                    >
                      <span class="sa-li__num">{{ Number(idx) + 1 }}</span>{{ sug }}
                    </li>
                  </ul>
                </section>

                <!-- Streaming Output -->
                <Transition name="stream-fade">
                  <section
                    v-if="isStreaming && streamingContent"
                    class="sa-stream"
                  >
                    <div class="sa-stream__head">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#D97706"
                        stroke-width="2.5"
                        class="spin-mini"
                      ><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                      <span>AI 实时分析输出</span>
                    </div>
                    <pre class="sa-stream__body">{{ streamingContent }}</pre>
                  </section>
                </Transition>
              </template>
            </div>

            <!-- Footer: Follow-up Input -->
            <footer class="sa-footer">
              <div class="sa-input-wrap">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94A3B8"
                  stroke-width="1.8"
                  class="sa-input-icon"
                ><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                <input
                  v-model="followUpQuestion"
                  type="text"
                  placeholder="还有疑问？继续追问 AI..."
                  class="sa-input"
                  :disabled="isStreaming"
                  @keyup.enter="submitFollowUp"
                >
              </div>

              <div class="sa-actions">
                <button
                  class="sa-btn sa-btn--ghost"
                  @click="handleClose"
                >
                  关闭
                </button>
                <button
                  class="sa-btn sa-btn--primary"
                  @click="$emit('view-detail', schoolId)"
                >
                  查看详情 →
                </button>
                <button
                  class="sa-btn sa-btn--accent"
                  :disabled="!followUpQuestion.trim() || isStreaming"
                  @click="submitFollowUp"
                >
                  <template v-if="isStreaming">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      class="spin-mini"
                    ><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                    分析中...
                  </template>
                  <template v-else>
                    发送追问
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                    ><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </template>
                </button>
              </div>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  visible: {
    type: Boolean,
    default: false
  },
  schoolId: {
    type: [String, Number],
    default: null
  },
  schoolName: {
    type: String,
    default: ''
  },
  recommendation: {
    type: Object,
    default: null
  },
  analysis: {
    type: Object,
    default: null
  },
  analysisData: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  isStreaming: {
    type: Boolean,
    default: false
  },
  streamingContent: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'update:visible', 'follow-up', 'view-detail'])

const isVisible = computed(() => props.visible || props.modelValue)

const currentAnalysis = computed(() => props.analysisData || props.analysis)

const followUpQuestion = ref('')

const handleClose = () => {
  emit('update:visible', false)
  emit('update:modelValue', false)
}

const submitFollowUp = () => {
  if (!followUpQuestion.value.trim() || props.isStreaming) return
  emit('follow-up', followUpQuestion.value)
  followUpQuestion.value = ''
}

const getProbLabel = (score: number): string => {
  if (score >= 80) return '高'
  if (score >= 50) return '中等'
  if (score >= 30) return '偏低'
  return '挑战'
}

const probColor = (score: number): string => {
  if (score >= 80) return '#059669'
  if (score >= 50) return '#D97706'
  return '#DC2626'
}
</script>

<style scoped>
/* ====== Overlay ====== */
.sa-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15,23,42,0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 20px;
}

/* ====== Panel ====== */
.sa-panel {
  width: 100%;
  max-width: 720px;
  max-height: 85vh;
  background: #FFFFFF;
  border-radius: 28px;
  box-shadow:
    0 32px 80px rgba(15,23,42,0.15),
    0 4px 20px rgba(15,23,42,0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ====== Header ====== */
.sa-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 32px 36px 24px;
  border-bottom: 1px solid #F1F5F9;
}

.sa-header__name {
  margin: 0 0 10px 0;
  font-size: 26px;
  font-weight: 900;
  color: #0F172A;
  letter-spacing: -1px;
}

.sa-header__meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sa-meta-chip {
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  color: #64748B;
  background: #F8FAFC;
  border-radius: 8px;
}

.sa-meta-chip--mono {
  font-family: var(--font-family-mono);
  color: #334155;
  background: #F1F5F9;
}

.sa-close {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  cursor: pointer;
  color: #94A3B8;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.sa-close:hover {
  background: #FEF2F2;
  border-color: #FECACA;
  color: #DC2626;
  transform: rotate(90deg);
}

/* ====== Body ====== */
.sa-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sa-body::-webkit-scrollbar { width: 4px; }
.sa-body::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 2px; }

/* ====== Loading State ====== */
.sa-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 60px 20px;
  text-align: center;
}

.sa-loading__spinner {
  animation: spin 1.2s linear infinite;
}

.sa-loading__text {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #334155;
}

.sa-loading__sub {
  margin: 0;
  font-size: 13px;
  color: #94A3B8;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin-svg,
.spin-mini {
  animation: spin 1s linear infinite;
}

/* ====== Sections ====== */
.sa-section {
  position: relative;
  padding-left: 18px;
}

.sa-section::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3px;
  border-radius: 2px;
}

.sa-section--prob::before { background: #059669; }
.sa-section--match::before { background: #D97706; }
.sa-section--risk::before { background: #DC2626; }
.sa-section--suggest::before { background: #0284C7; }

.sa-section__head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #334155;
}

.sa-icon {
  font-size: 14px;
  line-height: 1;
}

/* ====== Probability Bar ====== */
.sa-prob-bar {
  position: relative;
  height: 8px;
  background: #F1F5F9;
  border-radius: 100px;
  overflow: hidden;
  margin-bottom: 8px;
}

.sa-prob-fill {
  height: 100%;
  background: var(--prob-color);
  border-radius: 100px;
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.sa-prob-label {
  font-size: 12px;
  font-weight: 700;
  font-family: var(--font-family-mono);
  color: var(--prob-color);
}

/* ====== Lists ====== */
.sa-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sa-li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  line-height: 1.65;
  color: #475569;
}

.sa-li--risk {
  color: #991B1B;
}

.sa-li__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
  margin-top: 7px;
}

.sa-li__num {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #F1F5F9;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 800;
  color: #64748B;
  font-family: var(--font-family-mono);
  flex-shrink: 0;
  margin-top: 1px;
}

/* ====== Stream Section ====== */
.sa-stream {
  padding: 18px 20px;
  background: #FFFBEB;
  border: 1px solid rgba(217,119,6,0.1);
  border-radius: 14px;
}

.sa-stream__head {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 12px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #B45309;
}

.sa-stream__body {
  margin: 0;
  font-family: var(--font-family-mono);
  font-size: 11px;
  line-height: 1.75;
  color: #78350F;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 160px;
  overflow-y: auto;
  background: rgba(255,255,255,0.5);
  padding: 12px;
  border-radius: 8px;
}

.sa-stream__body::-webkit-scrollbar { width: 3px; }

/* ====== Footer ====== */
.sa-footer {
  padding: 22px 36px 28px;
  border-top: 1px solid #F1F5F9;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.sa-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.sa-input-icon {
  position: absolute;
  left: 16px;
  pointer-events: none;
}

.sa-input {
  width: 100%;
  padding: 14px 16px 14px 44px;
  background: #F8FAFC;
  border: 1.5px solid #E2E8F0;
  border-radius: 14px;
  font-family: var(--font-family-base);
  font-size: 14px;
  color: #334155;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.sa-input::placeholder { color: #CBD5E1; }
.sa-input:focus {
  outline: none;
  border-color: #D97706;
  background: #FFFFFF;
  box-shadow: 0 0 0 4px rgba(217,119,6,0.08);
}
.sa-input:disabled { opacity: 0.55; cursor: not-allowed; }

.sa-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.sa-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  border: none;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
}

.sa-btn--ghost {
  background: transparent;
  color: #94A3B8;
}
.sa-btn--ghost:hover { color: #0F172A; background: #F8FAFC; }

.sa-btn--primary {
  background: #0F172A;
  color: #fff;
}
.sa-btn--primary:hover {
  background: #1E293B;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(15,23,42,0.18);
}

.sa-btn--accent {
  background: linear-gradient(135deg, #D97706, #B45309);
  color: #fff;
}
.sa-btn--accent:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(217,119,6,0.25);
}
.sa-btn--accent:disabled { opacity: 0.45; cursor: not-allowed; }

/* ====== Transitions ====== */
.modal-enter-active { transition: opacity 0.35s ease; }
.modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }

.panel-enter-active { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
.panel-leave-active { transition: all 0.25s ease; }
.panel-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}
.panel-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(10px);
}

.stream-fade-enter-active { transition: all 0.45s ease; }
.stream-fade-enter-from { opacity: 0; transform: translateY(12px); }

/* ====== Responsive ====== */
@media (max-width: 768px) {
  .sa-overlay {
    padding: 12px;
    align-items: flex-end;
  }

  .sa-panel {
    max-height: 90vh;
    border-radius: 24px 24px 0 0;
  }

  .sa-header {
    padding: 24px 24px 18px;
  }

  .sa-header__name {
    font-size: 22px;
  }

  .sa-body {
    padding: 20px 24px;
    gap: 20px;
  }

  .sa-footer {
    padding: 18px 24px 24px;
  }

  .sa-actions {
    flex-wrap: wrap;
  }

  .sa-btn {
    flex: 1;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
