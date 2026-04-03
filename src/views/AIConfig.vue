<template>
  <div class="ai-config-page">
    <div class="page-header">
      <h2 class="section-title">AI 配置管理</h2>
      <p class="section-desc">管理 AI 供应商连接配置，支持多供应商切换与连接测试</p>
    </div>

    <div class="config-card">
      <div class="card-header">
        <div class="card-header-left">
          <span class="card-title">AI 供应商配置</span>
        </div>
        <button
          class="btn btn-primary btn-sm"
          @click="testAllConnections"
        >
          测试全部连接
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>供应商名称</th>
              <th>类型</th>
              <th>Base URL</th>
              <th>API Key</th>
              <th>模型名称</th>
              <th>状态</th>
              <th>操作</th>
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
              <td class="cell-url" :title="provider.baseUrl">{{ provider.baseUrl }}</td>
              <td class="cell-key">{{ '*'.repeat(provider.apiKey?.length || 0) }}</td>
              <td class="cell-model" :title="provider.model">{{ provider.model }}</td>
              <td>
                <span
                  v-if="provider.status === 'testing'"
                  class="badge badge-status badge-testing"
                >
                  测试中
                </span>
                <span
                  v-else-if="provider.status === 'connected'"
                  class="badge badge-status badge-connected"
                >
                  已连接
                </span>
                <span
                  v-else-if="provider.status === 'error'"
                  class="badge badge-status badge-error"
                >
                  连接失败
                </span>
                <span
                  v-else
                  class="badge badge-status badge-untested"
                >
                  未测试
                </span>
              </td>
              <td class="cell-actions">
                <button
                  class="btn btn-ghost btn-xs"
                  @click="editProvider(index)"
                >
                  编辑
                </button>
                <button
                  class="btn btn-ghost-danger btn-xs"
                  @click="removeProvider(index)"
                >
                  删除
                </button>
                <button
                  class="btn btn-primary btn-xs"
                  @click="testConnection(index)"
                >
                  测试
                </button>
              </td>
            </tr>
            <tr v-if="providers.length === 0">
              <td colspan="7">
                <div class="empty-state">
                  <div class="empty-state-icon">⚙️</div>
                  <div class="empty-state-title">暂无供应商配置</div>
                  <div class="empty-state-desc">请在下方添加您的第一个 AI 供应商配置</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="warning-banner">
        <div class="warning-icon">!</div>
        <div class="warning-content">
          <div class="warning-title">当前使用的是开发者个人测试 API Key（智谱 GLM-4.7-Flash）</div>
          <p class="warning-text">
            本 Key 为个人账号提供，仅用于比赛演示和体验，<strong>请勿用于其他用途或频繁调用</strong>。如需长期使用，请在下方「自定义配置」中填入您自己的 API Key。
          </p>
        </div>
      </div>

      <div class="divider" />

      <div class="form-section">
        <h3 class="form-section-title">自定义配置</h3>
        <form
          class="config-form"
          @submit.prevent="addProvider"
        >
          <div class="form-grid">
            <div class="form-field">
              <label class="form-label">供应商名称</label>
              <input
                v-model="newProvider.name"
                type="text"
                class="form-input"
                placeholder="如：OpenAI、Anthropic"
              />
            </div>
            <div class="form-field">
              <label class="form-label">类型</label>
              <select
                v-model="newProvider.type"
                class="form-select"
              >
                <option value="">选择类型</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="domestic">国内供应商</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div class="form-field form-field-wide">
              <label class="form-label">Base URL</label>
              <input
                v-model="newProvider.baseUrl"
                type="text"
                class="form-input"
                placeholder="https://api.openai.com/v1"
              />
            </div>
            <div class="form-field form-field-wide">
              <label class="form-label">API Key</label>
              <input
                v-model="newProvider.apiKey"
                type="password"
                class="form-input"
                placeholder="sk-..."
              />
            </div>
            <div class="form-field form-field-wide">
              <label class="form-label">模型名称</label>
              <input
                v-model="newProvider.model"
                type="text"
                class="form-input"
                placeholder="gpt-4, glm-4-flash 等"
              />
            </div>
          </div>
          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary"
            >
              保存配置
            </button>
          </div>
        </form>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="editVisible"
        class="modal-overlay"
        @click.self="editVisible = false"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">编辑供应商</h3>
            <button
              class="modal-close"
              @click="editVisible = false"
            >
              ✕
            </button>
          </div>
          <div class="modal-body">
            <form
              class="config-form"
              @submit.prevent="saveEdit"
            >
              <div class="form-field">
                <label class="form-label">供应商名称</label>
                <input
                  v-model="editingProvider.name"
                  type="text"
                  class="form-input"
                />
              </div>
              <div class="form-field">
                <label class="form-label">类型</label>
                <select
                  v-model="editingProvider.type"
                  class="form-select"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="domestic">国内供应商</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div class="form-field">
                <label class="form-label">Base URL</label>
                <input
                  v-model="editingProvider.baseUrl"
                  type="text"
                  class="form-input"
                />
              </div>
              <div class="form-field">
                <label class="form-label">API Key</label>
                <input
                  v-model="editingProvider.apiKey"
                  type="password"
                  class="form-input"
                />
              </div>
              <div class="form-field">
                <label class="form-label">模型名称</label>
                <input
                  v-model="editingProvider.model"
                  type="text"
                  class="form-input"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-secondary"
              @click="editVisible = false"
            >
              取消
            </button>
            <button
              class="btn btn-primary"
              @click="saveEdit"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
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

onMounted(() => {
  loadProviders()
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
    ElMessage.warning('请填写完整信息')
    return
  }
  providers.value.push({
    ...newProvider.value,
    status: 'untested',
    id: Date.now()
  })
  saveProviders()
  ElMessage.success('配置已保存')
  newProvider.value = { name: '', type: '', baseUrl: '', apiKey: '', model: '' }
}

const addZhipuPreset = () => {
  const existing = providers.value.find(p => p.name === '智谱 GLM-4.7-Flash（推荐）')
  if (existing) {
    ElMessage.info('智谱配置已存在')
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
  ElMessage.success('已添加智谱 GLM-4.7-Flash 配置（支持思考模式），请点击"测试"验证连接')
}

const removeProvider = (index) => {
  providers.value.splice(index, 1)
  saveProviders()
  ElMessage.success('已删除')
}

const testConnection = async (index) => {
  const provider = providers.value[index]
  provider.status = 'testing'
  saveProviders()

  try {
    const result = await testProviderConnection(provider.id)
    if (result.success) {
      provider.status = 'connected'
      ElMessage.success(`${provider.name} 连接成功`)
    } else {
      provider.status = 'error'
      ElMessage.error(`${provider.name} 连接失败: ${result.error}`)
    }
  } catch (error) {
    provider.status = 'error'
    ElMessage.error(`${provider.name} 连接失败: ${error.message}`)
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
  ElMessage.success('配置已更新')
}
</script>

<style scoped>
.ai-config-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-10);
}

.page-header {
  margin-bottom: var(--space-10);
}

.section-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  letter-spacing: -0.5px;
  line-height: var(--leading-tight);
  margin: 0 0 var(--space-4) 0;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 48px;
  height: 3px;
  background: var(--color-solid);
  border-radius: 2px;
}

.section-desc {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: var(--space-5) 0 0 0;
  line-height: var(--leading-normal);
}

.config-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  padding: var(--space-8);
  transition: box-shadow var(--transition-normal), border-color var(--transition-normal);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border-light);
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.table-container {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
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
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.data-table td {
  padding: var(--space-3) var(--space-4);
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

.cell-name {
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  max-width: 180px;
}

.cell-url,
.cell-model {
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
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  letter-spacing: 0.25px;
  line-height: 1.6;
}

.badge-type {
  background: var(--color-slate-100);
  color: var(--color-slate-700);
}

.badge-status {
  min-width: 60px;
  justify-content: center;
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

.btn-primary:hover {
  background: var(--color-solid-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
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

.warning-banner {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-6);
  padding: var(--space-4) var(--space-5);
  background: var(--color-warning-bg);
  border-radius: var(--radius-lg);
  border-left: 3px solid var(--color-warning);
}

.warning-icon {
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

.warning-content {
  flex: 1;
  min-width: 0;
}

.warning-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.warning-text {
  font-size: var(--text-sm);
  color: var(--color-warning);
  line-height: var(--leading-normal);
  margin: 0;
}

.warning-text strong {
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
}

.divider {
  height: 1px;
  background: var(--color-divider);
  margin: var(--space-8) 0 var(--space-8);
}

.form-section {
  margin-top: var(--space-2);
}

.form-section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-6) 0;
}

.config-form {
  max-width: 600px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
}

.form-field-wide {
  grid-column: 1 / -1;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
}

.form-input,
.form-select {
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

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-solid);
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
}

.form-input::placeholder,
.form-select::placeholder {
  color: var(--color-text-muted);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394A3B8' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.form-actions {
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

.empty-state-icon {
  font-size: 40px;
  margin-bottom: var(--space-4);
  opacity: 0.6;
}

.empty-state-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.empty-state-desc {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  max-width: 320px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  animation: modal-fade-in 200ms ease;
}

@keyframes modal-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  max-width: 560px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  animation: modal-slide-up 250ms ease;
}

@keyframes modal-slide-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6) var(--space-8);
  border-bottom: 1px solid var(--color-border-light);
}

.modal-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
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

.modal-close:hover {
  background: var(--color-slate-100);
  color: var(--color-text-primary);
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

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-8);
  border-top: 1px solid var(--color-border-light);
}

@media (max-width: 768px) {
  .ai-config-page {
    padding: var(--space-5);
  }

  .section-title {
    font-size: var(--text-2xl);
  }

  .config-card {
    padding: var(--space-5);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .data-table th,
  .data-table td {
    padding: var(--space-2) var(--space-3);
  }

  .cell-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .modal-content {
    max-width: 100%;
    max-height: 90vh;
  }

  .modal-header,
  .modal-footer {
    padding: var(--space-4) var(--space-5);
  }

  .modal-body {
    padding: var(--space-5);
  }
}
</style>
