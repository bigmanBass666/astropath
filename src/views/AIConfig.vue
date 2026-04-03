<template>
  <div class="ai-config-page">
    <h2 class="page-title">
      AI配置管理
    </h2>
    <el-card class="config-card">
      <template #header>
        <span>AI供应商配置</span>
        <el-button
          type="primary"
          size="small"
          style="margin-left: 12px;"
          @click="testAllConnections"
        >
          测试全部连接
        </el-button>
      </template>

      <el-table
        :data="providers"
        style="width: 100%"
        class="providers-table"
      >
        <el-table-column
          prop="name"
          label="供应商名称"
          min-width="150"
        />
        <el-table-column
          prop="type"
          label="类型"
          min-width="100"
        >
          <template #default="{ row }">
            <el-tag>{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="baseUrl"
          label="Base URL"
          min-width="320"
          show-overflow-tooltip
        />
        <el-table-column
          prop="apiKey"
          label="API Key"
          min-width="140"
        >
          <template #default="{ row }">
            {{ '*'.repeat(row.apiKey?.length || 0) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="model"
          label="模型名称"
          min-width="140"
          show-overflow-tooltip
        />
        <el-table-column
          prop="status"
          label="状态"
          min-width="90"
        >
          <template #default="{ row }">
            <el-tag
              v-if="row.status === 'testing'"
              type="warning"
            >
              测试中
            </el-tag>
            <el-tag
              v-else-if="row.status === 'connected'"
              type="success"
            >
              已连接
            </el-tag>
            <el-tag
              v-else-if="row.status === 'error'"
              type="danger"
            >
              连接失败
            </el-tag>
            <el-tag
              v-else
              type="info"
            >
              未测试
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="210"
        >
          <template #default="{ row, $index }">
            <el-button
              size="small"
              @click="editProvider($index)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="removeProvider($index)"
            >
              删除
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="testConnection($index)"
            >
              测试
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-divider />

      <h4>快速配置</h4>
      <div style="margin-bottom: 20px; color: #666; font-size: 14px;">
        推荐评委使用下方一键配置，直接连接AI服务
      </div>
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <el-button
          type="primary"
          @click="addZhipuPreset"
        >
          一键配置智谱 GLM-4.7-Flash
        </el-button>
      </div>

      <el-divider />

      <h4>自定义配置</h4>
      <el-form
        :model="newProvider"
        label-width="120px"
        class="provider-form"
      >
        <el-form-item label="供应商名称">
          <el-input
            v-model="newProvider.name"
            placeholder="如：OpenAI、Anthropic"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="newProvider.type"
            placeholder="选择类型"
          >
            <el-option
              label="OpenAI"
              value="openai"
            />
            <el-option
              label="Anthropic"
              value="anthropic"
            />
            <el-option
              label="国内供应商"
              value="domestic"
            />
            <el-option
              label="其他"
              value="other"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Base URL">
          <el-input
            v-model="newProvider.baseUrl"
            placeholder="https://api.openai.com/v1"
          />
        </el-form-item>
        <el-form-item label="API Key">
          <el-input
            v-model="newProvider.apiKey"
            type="password"
            placeholder="sk-..."
          />
        </el-form-item>
        <el-form-item label="模型名称">
          <el-input
            v-model="newProvider.model"
            placeholder="gpt-4, glm-4-flash等"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="addProvider"
          >
            保存配置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog
      v-model="editVisible"
      title="编辑供应商"
      width="50%"
    >
      <el-form
        :model="editingProvider"
        label-width="120px"
      >
        <el-form-item label="供应商名称">
          <el-input v-model="editingProvider.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="editingProvider.type">
            <el-option
              label="OpenAI"
              value="openai"
            />
            <el-option
              label="Anthropic"
              value="anthropic"
            />
            <el-option
              label="国内供应商"
              value="domestic"
            />
            <el-option
              label="其他"
              value="other"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Base URL">
          <el-input v-model="editingProvider.baseUrl" />
        </el-form-item>
        <el-form-item label="API Key">
          <el-input
            v-model="editingProvider.apiKey"
            type="password"
          />
        </el-form-item>
        <el-form-item label="模型名称">
          <el-input v-model="editingProvider.model" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="saveEdit"
        >
          保存
        </el-button>
      </template>
    </el-dialog>
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
    apiKey: 'REDACTED_API_KEY',
    model: 'glm-4.7-flash',
    status: 'untested',
    id: Date.now(),
    supportsThinking: true
  })
  saveProviders()
  ElMessage.success('已添加智谱 GLM-4.7-Flash 配置（支持思考模式），请点击"测试"验证连接')
}

const addZhipuFlashPreset = () => {
  const existing = providers.value.find(p => p.name === '智谱 GLM-4-Flash（快速）')
  if (existing) {
    ElMessage.info('智谱 Flash 配置已存在')
    return
  }
  providers.value.push({
    name: '智谱 GLM-4-Flash（快速）',
    type: 'domestic',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: 'REDACTED_API_KEY',
    model: 'glm-4-flash',
    status: 'untested',
    id: Date.now(),
    supportsThinking: false
  })
  saveProviders()
  ElMessage.success('已添加智谱 GLM-4-Flash 配置（速度快，不支持思考），请点击"测试"验证连接')
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
  padding: 0 20px;
}

.config-card {
  margin-top: 20px;
}

.provider-form {
  max-width: 600px;
  margin-top: 20px;
}

/* 表格操作按钮：防止换行 */
.providers-table :deep(.el-table__cell) {
  overflow: visible;
}

.providers-table :deep(.el-table__body .cell) {
  white-space: nowrap;
}

.providers-table :deep(.el-table__body .el-button) {
  flex-shrink: 0;
}
</style>
