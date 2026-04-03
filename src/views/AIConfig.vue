<template>
  <div class="page-root">
    <section class="hero-full">
      <div class="hero-inner">
        <div class="hero-content">
          <h1 class="hero-title">AI 配置管理</h1>
          <p class="hero-desc">管理 AI 供应商连接配置，支持多供应商切换与连接测试</p>
        </div>
        <div class="hero-stats">
          <div class="stat-mini">
            <span class="stat-value">{{ providers.length }}</span>
            <span class="stat-label">已配置</span>
          </div>
          <div class="stat-mini">
            <span class="stat-value">{{ connectedCount }}</span>
            <span class="stat-label">已连接</span>
          </div>
          <div class="stat-mini">
            <span class="stat-value stat-value-warning">{{ errorCount }}</span>
            <span class="stat-label">异常</span>
          </div>
        </div>
      </div>
    </section>

    <main class="main-content">
      <section class="config-section data-full">
        <div class="section-header">
          <div class="section-header-text">
            <h2 class="section-title">AI 供应商配置</h2>
            <p class="section-subtitle">配置和管理您的 AI 模型接入点</p>
          </div>
          <button
            class="btn btn-primary btn-sm"
            @click="testAllConnections"
          >
            测试全部连接
          </button>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>供应商名称</th>
                <th>类型</th>
                <th>Base URL</th>
                <th>API Key</th>
                <th>模型名称</th>
                <th>状态</th>
                <th class="col-actions">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(provider, index) in providers"
                :key="provider.id"
              >
                <td class="cell-name">{{ provider.name }}</td>
                <td>
                  <span class="badge badge-type">{{ provider.type }}</span>
                </td>
                <td class="cell-mono" :title="provider.baseUrl">{{ provider.baseUrl }}</td>
                <td class="cell-key">{{ '*'.repeat(provider.apiKey?.length || 0) }}</td>
                <td class="cell-mono" :title="provider.model">{{ provider.model }}</td>
                <td>
                  <span
                    v-if="provider.status === 'testing'"
                    class="badge badge-testing"
                  >测试中</span>
                  <span
                    v-else-if="provider.status === 'connected'"
                    class="badge badge-connected"
                  >已连接</span>
                  <span
                    v-else-if="provider.status === 'error'"
                    class="badge badge-error"
                  >连接失败</span>
                  <span
                    v-else
                    class="badge badge-untested"
                  >未测试</span>
                </td>
                <td class="cell-actions">
                  <button
                    class="btn btn-ghost btn-xs"
                    @click="editProvider(index)"
                  >编辑</button>
                  <button
                    class="btn btn-ghost-danger btn-xs"
                    @click="removeProvider(index)"
                  >删除</button>
                  <button
                    class="btn btn-primary btn-xs"
                    :disabled="provider.status === 'testing'"
                    @click="testConnection(index)"
                  >{{ provider.status === 'testing' ? '测试中...' : '测试' }}</button>
                </td>
              </tr>
              <tr v-if="providers.length === 0">
                <td colspan="7">
                  <div class="empty-state">
                    <svg class="empty-icon" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" opacity=".3"/>
                      <path d="M24 14v16m0 0l-6-6m6 6l6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".4"/>
                    </svg>
                    <p class="empty-title">暂无供应商配置</p>
                    <p class="empty-desc">请在下方添加您的第一个 AI 供应商配置</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="warning-banner">
          <div class="warning-mark">!</div>
          <div class="warning-body">
            <p class="warning-head">当前使用的是开发者个人测试 API Key（智谱 GLM-4.7-Flash）</p>
            <p class="warning-detail">
              本 Key 为个人账号提供，仅用于比赛演示和体验，<strong>请勿用于其他用途或频繁调用</strong>。如需长期使用，请在下方「自定义配置」中填入您自己的 API Key。
            </p>
          </div>
        </div>
      </section>

      <div class="section-divider" />

      <section class="config-section form-section form-comfortable">
        <div class="section-header">
          <div class="section-header-text">
            <h2 class="section-title">自定义配置</h2>
            <p class="section-subtitle">添加新的 AI 供应商</p>
          </div>
        </div>

        <form
          class="provider-form"
          @submit.prevent="addProvider"
        >
          <div class="form-row">
            <div class="form-field">
              <label class="form-label" for="prov-name">供应商名称</label>
              <input
                id="prov-name"
                v-model="newProvider.name"
                type="text"
                class="form-input"
                placeholder="如：OpenAI、Anthropic"
              />
            </div>
            <div class="form-field">
              <label class="form-label" for="prov-type">类型</label>
              <CustomSelect
                id="prov-type"
                v-model="newProvider.type"
                :options="typeOptions"
                placeholder="选择类型"
              />
            </div>
          </div>
          <div class="form-field">
            <label class="form-label" for="prov-url">Base URL</label>
            <input
              id="prov-url"
              v-model="newProvider.baseUrl"
              type="text"
              class="form-input"
              placeholder="https://api.openai.com/v1"
            />
          </div>
          <div class="form-field">
            <label class="form-label" for="prov-key">API Key</label>
            <input
              id="prov-key"
              v-model="newProvider.apiKey"
              type="password"
              class="form-input"
              placeholder="sk-..."
            />
          </div>
          <div class="form-field">
            <label class="form-label" for="prov-model">模型名称</label>
            <input
              id="prov-model"
              v-model="newProvider.model"
              type="text"
              class="form-input"
              placeholder="gpt-4, glm-4-flash 等"
            />
          </div>
          <div class="form-footer">
            <button
              type="submit"
              class="btn btn-primary"
            >保存配置</button>
          </div>
        </form>
      </section>
    </main>

    <Teleport to="body">
      <div
        v-if="toast.visible"
        class="toast-notification"
        :class="'toast-' + toast.type"
      >
        <span class="toast-icon">{{ toastIcons[toast.type] }}</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="editVisible"
        class="modal-backdrop"
        @click.self="editVisible = false"
      >
        <div
          class="modal-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-heading"
        >
          <header class="modal-head">
            <h3 id="modal-heading" class="modal-heading">编辑供应商</h3>
            <button
              class="btn-icon"
              aria-label="关闭"
              @click="editVisible = false"
            >✕</button>
          </header>
          <div class="modal-body">
            <form @submit.prevent="saveEdit">
              <div class="form-field">
                <label class="form-label" for="edit-name">供应商名称</label>
                <input
                  id="edit-name"
                  v-model="editingProvider.name"
                  type="text"
                  class="form-input"
                />
              </div>
              <div class="form-field">
                <label class="form-label" for="edit-type">类型</label>
                <CustomSelect
                  id="edit-type"
                  v-model="editingProvider.type"
                  :options="typeOptions"
                  placeholder="选择类型"
                />
              </div>
              <div class="form-field">
                <label class="form-label" for="edit-url">Base URL</label>
                <input
                  id="edit-url"
                  v-model="editingProvider.baseUrl"
                  type="text"
                  class="form-input"
                />
              </div>
              <div class="form-field">
                <label class="form-label" for="edit-key">API Key</label>
                <input
                  id="edit-key"
                  v-model="editingProvider.apiKey"
                  type="password"
                  class="form-input"
                />
              </div>
              <div class="form-field">
                <label class="form-label" for="edit-model">模型名称</label>
                <input
                  id="edit-model"
                  v-model="editingProvider.model"
                  type="text"
                  class="form-input"
                />
              </div>
            </form>
          </div>
          <footer class="modal-foot">
            <button
              class="btn btn-secondary"
              @click="editVisible = false"
            >取消</button>
            <button
              class="btn btn-primary"
              @click="saveEdit"
            >保存</button>
          </footer>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { testProviderConnection } from '@/utils/ai-api'

const providers = ref([])
const newProvider = ref({
  name: '',
  type: '',
  baseUrl: '',
  apiKey: '',
  model: ''
})
const editVisible = ref(false)
const editingProvider = ref({})
const editingIndex = ref(-1)

const typeOptions = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'domestic', label: '国内供应商' },
  { value: 'other', label: '其他' }
]

const connectedCount = computed(() =>
  providers.value.filter(p => p.status === 'connected').length
)

const errorCount = computed(() =>
  providers.value.filter(p => p.status === 'error').length
)

const toast = reactive({
  visible: false,
  message: '',
  type: 'info'
})

const toastIcons = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'ℹ'
}

let toastTimer = null

function showToast(message, type = 'info', duration = 3000) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.message = message
  toast.type = type
  toast.visible = true
  toastTimer = setTimeout(() => {
    toast.visible = false
  }, duration)
}

onMounted(() => {
  loadProviders()
})

onUnmounted(() => {
  if (toastTimer) clearTimeout(toastTimer)
})

const loadProviders = () => {
  const saved = localStorage.getItem('ai_providers')
  if (saved) {
    providers.value = JSON.parse(saved)
  } else {
    providers.value = []
    addZhipuPreset()
  }
}

const saveProviders = () => {
  localStorage.setItem('ai_providers', JSON.stringify(providers.value))
}

const addProvider = () => {
  if (!newProvider.value.name || !newProvider.value.baseUrl || !newProvider.value.apiKey) {
    showToast('请填写完整信息', 'warning')
    return
  }
  providers.value.push({
    ...newProvider.value,
    status: 'untested',
    id: Date.now()
  })
  saveProviders()
  showToast('配置已保存', 'success')
  newProvider.value = { name: '', type: '', baseUrl: '', apiKey: '', model: '' }
}

const addZhipuPreset = () => {
  const existing = providers.value.find(p => p.name === '智谱 GLM-4.7-Flash（推荐）')
  if (existing) {
    showToast('智谱配置已存在', 'info')
    return
  }
  providers.value.push({
    name: '智谱 GLM-4.7-Flash（推荐）',
    type: 'domestic',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: '015518e0bc86498dafdc42bf88b1572a.dioiOVESgV9mUg5i',
    model: 'glm-4.7-flash',
    status: 'untested',
    id: Date.now(),
    supportsThinking: true
  })
  saveProviders()
  showToast('已添加智谱 GLM-4.7-Flash 配置（支持思考模式），请点击"测试"验证连接', 'success')
}

const removeProvider = (index) => {
  providers.value.splice(index, 1)
  saveProviders()
  showToast('已删除', 'success')
}

const testConnection = async (index) => {
  const provider = providers.value[index]
  provider.status = 'testing'
  saveProviders()

  try {
    const result = await testProviderConnection(provider.id)
    if (result && result.success) {
      provider.status = 'connected'
      showToast(`${provider.name} 连接成功`, 'success')
    } else {
      provider.status = 'error'
      const errMsg = result?.error || '未知错误'
      showToast(`${provider.name} 连接失败: ${errMsg}`, 'error')
    }
  } catch (err) {
    provider.status = 'error'
    showToast(`${provider.name} 连接失败: ${err.message}`, 'error')
  }
  saveProviders()
}

const testAllConnections = () => {
  providers.value.forEach((_, index) => testConnection(index))
}

const editProvider = (index) => {
  editingIndex.value = index
  editingProvider.value = { ...providers.value[index] }
  editVisible.value = true
}

const saveEdit = () => {
  providers.value[editingIndex.value] = { ...editingProvider.value }
  saveProviders()
  editVisible.value = false
  showToast('配置已更新', 'success')
}
</script>

<script>
import { h, Transition } from 'vue'

function ChevronIcon(cls) {
  return h('svg', {
    class: cls,
    width: 12,
    height: 12,
    viewBox: '0 0 12 12',
    fill: 'none'
  }, [
    h('path', {
      d: 'M3 5L6 8L9 5',
      stroke: 'currentColor',
      'stroke-width': 1.5,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    })
  ])
}

export default {
  components: {
    CustomSelect: {
      props: {
        modelValue: { type: [String, Number], default: '' },
        options: { type: Array, required: true },
        placeholder: { type: String, default: '请选择' }
      },
      emits: ['update:modelValue'],
      data() {
        return { open: false }
      },
      computed: {
        selectedLabel() {
          const opt = this.options.find(o => o.value === this.modelValue)
          return opt ? opt.label : ''
        }
      },
      mounted() {
        document.addEventListener('click', this.closeOnClickOutside)
      },
      beforeUnmount() {
        document.removeEventListener('click', this.closeOnClickOutside)
      },
      methods: {
        toggle() {
          this.open = !this.open
        },
        select(option) {
          this.$emit('update:modelValue', option.value)
          this.open = false
        },
        closeOnClickOutside(e) {
          if (this.open && !this.$el.contains(e.target)) {
            this.open = false
          }
        }
      },
      render() {
        const isActive = (val) => val === this.modelValue
        return h('div', {
          class: ['custom-select', { 'custom-select--open': this.open }]
        }, [
          h('button', {
            type: 'button',
            class: 'custom-select-trigger',
            onClick: (e) => { e.preventDefault(); this.toggle() },
            'aria-expanded': this.open
          }, [
            h('span', {
              class: ['custom-select-value', { 'custom-select-placeholder': !this.modelValue }]
            }, this.selectedLabel || this.placeholder),
            ChevronIcon(['custom-select-arrow', { 'custom-select-arrow--rotate': this.open }])
          ]),
          h(Transition, { name: 'select-dropdown' }, () => {
            if (!this.open) return null
            return h('ul', {
              class: 'custom-select-dropdown',
              role: 'listbox'
            }, this.options.map(opt =>
              h('li', {
                key: opt.value,
                class: ['custom-select-option', { 'custom-select-option--active': isActive(opt.value) }],
                role: 'option',
                'aria-selected': isActive(opt.value),
                onClick: () => this.select(opt)
              }, opt.label)
            ))
          })
        ])
      }
    }
  }
}
</script>

<style scoped>
.page-root {
  width: 100%;
  min-height: 100vh;
  background: var(--color-slate-50);
}

.hero-full {
  width: 100%;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border-light);
}

.hero-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--space-10);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-8);
  padding-top: var(--space-12);
  padding-bottom: var(--space-12);
}

.hero-content {
  flex: 1;
  min-width: 0;
}

.hero-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  letter-spacing: -1px;
  line-height: var(--leading-tight);
  margin: 0 0 var(--space-3) 0;
}

.hero-title::after {
  content: '';
  display: block;
  width: 48px;
  height: 3px;
  background: var(--color-solid);
  border-radius: 2px;
  margin-top: var(--space-4);
}

.hero-desc {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
  margin: var(--space-4) 0 0 0;
}

.hero-stats {
  display: flex;
  gap: var(--space-6);
  flex-shrink: 0;
}

.stat-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-6);
  background: var(--color-surface-muted);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-light);
  min-width: 72px;
}

.stat-value {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-solid);
  line-height: 1;
  letter-spacing: -0.5px;
}

.stat-value-warning {
  color: var(--color-danger);
}

.stat-label {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.main-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--space-10);
  padding-top: var(--space-10);
  padding-bottom: var(--space-16);
}

.config-section {
  margin-bottom: var(--space-8);
}

.data-full {
  max-width: 1600px;
  margin-left: calc(-1 * var(--space-10));
  margin-right: calc(-1 * var(--space-10));
  padding-left: var(--space-10);
  padding-right: var(--space-10);
}

.form-comfortable {
  max-width: 960px;
}

.form-section {
  padding-top: var(--space-10);
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.section-header-text {
  min-width: 0;
}

.section-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1) 0;
  line-height: var(--leading-tight);
}

.section-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  margin: 0;
  line-height: var(--leading-normal);
}

.table-wrapper {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.data-table thead {
  background: var(--color-surface-muted);
}

.data-table th {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: left;
  padding: var(--space-3) var(--space-5);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.data-table td {
  padding: var(--space-3) var(--space-5);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border-light);
  vertical-align: middle;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr {
  transition: background-color var(--transition-fast);
}

.data-table tbody tr:hover {
  background: var(--color-slate-50);
}

.col-actions {
  width: 180px;
}

.cell-name {
  font-weight: var(--font-medium);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-mono {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-secondary);
  font-family: var(--font-family-mono);
  font-size: var(--text-xs);
}

.cell-key {
  font-family: var(--font-family-mono);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  letter-spacing: 1px;
}

.cell-actions {
  white-space: nowrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  letter-spacing: 0.25px;
  line-height: 1.6;
  white-space: nowrap;
}

.badge-type {
  background: var(--color-slate-100);
  color: var(--color-slate-700);
}

.badge-testing {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.badge-connected {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.badge-error {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.badge-untested {
  background: var(--color-info-bg);
  color: var(--color-info);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  cursor: pointer;
  border: none;
  transition: all var(--transition-fast);
  font-family: var(--font-family-base);
  white-space: nowrap;
}

.btn:focus-visible {
  outline: 2px solid var(--color-solid);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: var(--color-solid);
  color: var(--color-text-inverse);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-lg);
  padding: 10px 24px;
  min-height: 44px;
  font-size: var(--text-base);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-solid-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-lg);
  padding: 10px 24px;
  min-height: 44px;
  font-size: var(--text-base);
  border: 1.5px solid var(--color-border);
}

.btn-secondary:hover {
  border-color: var(--color-solid);
  color: var(--color-solid);
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  padding: 6px 14px;
  min-height: 34px;
  font-size: var(--text-sm);
}

.btn-ghost:hover {
  background: var(--color-slate-100);
  color: var(--color-text-primary);
}

.btn-ghost-danger {
  background: transparent;
  color: var(--color-danger);
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  padding: 6px 14px;
  min-height: 34px;
  font-size: var(--text-sm);
}

.btn-ghost-danger:hover {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.btn-sm {
  padding: 8px 16px;
  min-height: 36px;
  font-size: var(--text-sm);
  border-radius: var(--radius-lg);
}

.btn-xs {
  padding: 5px 12px;
  min-height: 30px;
  font-size: var(--text-xs);
  border-radius: var(--radius-md);
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: var(--text-base);
  transition: all var(--transition-fast);
}

.btn-icon:hover {
  background: var(--color-slate-100);
  color: var(--color-text-primary);
}

.warning-banner {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-6);
  padding: var(--space-5) var(--space-6);
  background: var(--color-warning-bg);
  border-radius: var(--radius-lg);
  border-left: 3px solid var(--color-warning);
}

.warning-mark {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--color-warning);
  color: white;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  margin-top: 2px;
}

.warning-body {
  flex: 1;
  min-width: 0;
}

.warning-head {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1) 0;
}

.warning-detail {
  font-size: var(--text-sm);
  color: var(--color-warning);
  line-height: var(--leading-normal);
  margin: 0;
}

.warning-detail strong {
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
}

.section-divider {
  height: 1px;
  background: var(--color-divider);
  margin: 0 var(--space-10);
}

.provider-form {
  max-width: 600px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-family: var(--font-family-base);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
  min-height: 44px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-solid);
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}

.form-input::placeholder {
  color: var(--color-text-muted);
}

.form-footer {
  margin-top: var(--space-6);
  display: flex;
  gap: var(--space-3);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12) var(--space-6);
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: var(--color-slate-300);
  margin-bottom: var(--space-4);
}

.empty-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
}

.empty-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 320px;
}

.toast-notification {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 12px 20px;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  box-shadow: var(--shadow-lg);
  animation: toast-in 250ms ease;
  pointer-events: auto;
}

@keyframes toast-in {
  from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.toast-success {
  background: var(--color-success);
  color: white;
}

.toast-error {
  background: var(--color-danger);
  color: white;
}

.toast-warning {
  background: var(--color-warning);
  color: white;
}

.toast-info {
  background: var(--color-solid);
  color: white;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.25);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

.toast-message {
  white-space: nowrap;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  animation: fade-in 200ms ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-panel {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  max-width: 560px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  animation: slide-up 250ms ease;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6) var(--space-8);
  border-bottom: 1px solid var(--color-border-light);
}

.modal-heading {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.modal-body {
  padding: var(--space-8);
}

.modal-body .form-field {
  margin-bottom: var(--space-5);
}

.modal-body .form-field:last-child {
  margin-bottom: 0;
}

.modal-foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-8);
  border-top: 1px solid var(--color-border-light);
}

:deep(.custom-select) {
  position: relative;
  width: 100%;
}

:deep(.custom-select-trigger) {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-family: var(--font-family-base);
  background: var(--color-surface);
  color: var(--color-text-primary);
  cursor: pointer;
  text-align: left;
  transition: all var(--transition-fast);
  min-height: 44px;
  box-sizing: border-box;
}

:deep(.custom-select-trigger:focus) {
  outline: none;
  border-color: var(--color-solid);
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}

:deep(.custom-select--open .custom-select-trigger) {
  border-color: var(--color-solid);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}

:deep(.custom-select-value) {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.custom-select-placeholder) {
  color: var(--color-text-muted);
}

:deep(.custom-select-arrow) {
  flex-shrink: 0;
  color: var(--color-text-muted);
  transition: transform var(--transition-fast);
}

:deep(.custom-select-arrow--rotate) {
  transform: rotate(180deg);
}

:deep(.custom-select-dropdown) {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  margin-top: -1px;
  background: var(--color-surface);
  border: 1px solid var(--color-solid);
  border-top: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  box-shadow: var(--shadow-lg);
  list-style: none;
  padding: var(--space-2) 0;
  margin: 0;
  max-height: 220px;
  overflow-y: auto;
}

:deep(.custom-select-option) {
  padding: 10px 14px;
  font-size: var(--text-base);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  list-style: none;
}

:deep(.custom-select-option:hover) {
  background: var(--color-slate-50);
}

:deep(.custom-select-option--active) {
  color: var(--color-solid);
  font-weight: var(--font-semibold);
  background: rgba(15, 23, 42, 0.04);
}

.select-dropdown-enter-active {
  animation: dropdown-in 150ms ease;
}

.select-dropdown-leave-active {
  animation: dropdown-out 100ms ease;
}

@keyframes dropdown-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes dropdown-out {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-4px); }
}

@media (min-width: 1600px) {
  .hero-inner {
    max-width: 1760px;
  }

  .main-content {
    max-width: 1760px;
  }

  .data-full {
    max-width: 1760px;
  }

  .table-wrapper {
    border-radius: var(--radius-xl);
  }
}

@media (min-width: 1200px) and (max-width: 1599px) {
  .hero-inner {
    max-width: 1360px;
  }

  .main-content {
    max-width: 1360px;
  }

  .data-full {
    max-width: 1360px;
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .hero-inner {
    padding: var(--space-10) 0;
  }

  .hero-inner,
  .main-content {
    max-width: 100%;
  }

  .data-full {
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
  }

  .main-content {
    padding-top: var(--space-8);
    padding-bottom: var(--space-12);
  }

  .page-hero-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-6);
  }

  .hero-stats {
    width: 100%;
    justify-content: flex-start;
  }

  .stat-mini {
    flex: 1;
    max-width: 120px;
  }
}

@media (max-width: 767px) {
  .hero-inner {
    padding: var(--space-8) var(--space-5);
  }

  .hero-title {
    font-size: var(--text-2xl);
  }

  .hero-stats {
    gap: var(--space-3);
  }

  .stat-mini {
    padding: var(--space-3) var(--space-4);
    min-width: 56px;
  }

  .stat-value {
    font-size: var(--text-xl);
  }

  .main-content {
    padding: 0 var(--space-5);
    padding-top: var(--space-6);
    padding-bottom: var(--space-10);
  }

  .section-header {
    flex-direction: column;
    gap: var(--space-3);
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .data-table th,
  .data-table td {
    padding: var(--space-2) var(--space-3);
  }

  .col-actions {
    width: auto;
    min-width: 140px;
  }

  .cell-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .modal-panel {
    max-width: 100%;
    max-height: 90vh;
    border-radius: var(--radius-lg);
  }

  .modal-head,
  .modal-foot {
    padding: var(--space-4) var(--space-5);
  }

  .modal-body {
    padding: var(--space-5);
  }

  .warning-banner {
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-4);
  }

  .section-divider {
    margin: 0 var(--space-5);
  }

  .toast-notification {
    left: 16px;
    right: 16px;
    transform: none;
  }

  .toast-message {
    white-space: normal;
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-backdrop,
  .modal-panel,
  .toast-notification {
    animation: none;
  }

  .select-dropdown-enter-active,
  .select-dropdown-leave-active {
    animation: none;
  }
}
</style>
