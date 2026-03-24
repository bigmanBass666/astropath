<template>
  <div class="university-database-page">
    <h2 class="page-title">院校数据库</h2>

    <!-- 搜索和筛选 -->
    <el-card class="search-card">
      <div class="search-row">
        <el-input v-model="searchKeyword" placeholder="搜索学校名称或专业" clearable style="width: 300px;">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterCountry" placeholder="国家" clearable style="width: 120px;">
          <el-option label="美国" value="美国" />
          <el-option label="英国" value="英国" />
          <el-option label="中国" value="中国" />
          <el-option label="澳洲" value="澳洲" />
          <el-option label="加拿大" value="加拿大" />
        </el-select>
        <el-select v-model="filterRankRange" placeholder="排名范围" clearable style="width: 120px;">
          <el-option label="Top 10" value="top10" />
          <el-option label="Top 20" value="top20" />
          <el-option label="Top 50" value="top50" />
          <el-option label="Top 100" value="top100" />
        </el-select>
        <el-select v-model="filterMajor" placeholder="专业领域" clearable style="width: 150px;">
          <el-option v-for="major in uniqueMajors" :key="major" :label="major" :value="major" />
        </el-select>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="resetFilters">重置</el-button>
      </div>
    </el-card>

    <!-- 院校网格 -->
    <div v-if="filteredSchools.length > 0" class="schools-grid">
      <el-card v-for="school in filteredSchools" :key="school.id" class="school-card"
        shadow="hover" @click="showDetail(school)">
        <div class="card-header">
          <h3>{{ school.name }}</h3>
          <el-tag :type="school.rankType" size="small">{{ school.ranking }}</el-tag>
        </div>
        <p class="country">{{ school.country }}</p>
        <p class="major">{{ school.major }}</p>
        <div class="card-stats">
          <div class="stat-item">
            <span class="stat-label">学费</span>
            <span class="stat-value">{{ school.tuition }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">录取率</span>
            <span class="stat-value" :class="{ 'low-rate': parseFloat(school.acceptanceRate) < 20 }">
              {{ school.acceptanceRate }}
            </span>
          </div>
        </div>
        <div class="card-footer">
          <el-button type="primary" size="small" plain @click.stop="addToShortlist(school)">
            加入选校清单
          </el-button>
          <el-button size="small" @click.stop="showDetail(school)">查看详情</el-button>
        </div>
      </el-card>
    </div>

    <el-empty v-else description="暂无匹配的院校数据" />

    <!-- 分页 -->
    <div class="pagination" v-if="filteredSchools.length > 0">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
        :page-sizes="[12, 24, 36]" :total="filteredSchools.length" layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" :title="currentSchool?.name" width="70%">
      <div v-if="currentSchool" class="school-detail">
        <div class="detail-header">
          <img v-if="currentSchool.image" :src="currentSchool.image" class="school-image" />
          <div class="detail-title">
            <h2>{{ currentSchool.name }}</h2>
            <p class="detail-subtitle">{{ currentSchool.country }} | {{ currentSchool.ranking }}</p>
          </div>
        </div>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="国家">{{ currentSchool.country }}</el-descriptions-item>
          <el-descriptions-item label="排名">{{ currentSchool.ranking }}</el-descriptions-item>
          <el-descriptions-item label="热门专业">{{ currentSchool.major }}</el-descriptions-item>
          <el-descriptions-item label="学费">{{ currentSchool.tuition }}</el-descriptions-item>
          <el-descriptions-item label="申请截止">{{ currentSchool.deadline }}</el-descriptions-item>
          <el-descriptions-item label="录取率">{{ currentSchool.acceptanceRate }}</el-descriptions-item>
          <el-descriptions-item label="学校类型">{{ currentSchool.type || '综合大学' }}</el-descriptions-item>
          <el-descriptions-item label="学生人数">{{ currentSchool.students || 'N/A' }}</el-descriptions-item>
        </el-descriptions>

        <div class="description-section">
          <h4>学校简介</h4>
          <p>{{ currentSchool.description || '暂无简介信息' }}</p>
        </div>

        <div class="requirements-section">
          <h4>申请要求</h4>
          <ul>
            <li v-for="(req, idx) in currentSchool.requirements" :key="idx">{{ req }}</li>
          </ul>
        </div>

        <div class="detail-actions">
          <el-button type="primary" @click="addToShortlist(currentSchool)">
            {{ shortlisted.includes(currentSchool.id) ? '已在清单中' : '加入选校清单' }}
          </el-button>
          <el-button type="success" plain @click="goToApply(currentSchool)">开始申请</el-button>
          <el-button type="info" plain @click="visitWebsite(currentSchool.website)">访问官网</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const searchKeyword = ref('')
const filterCountry = ref('')
const filterRankRange = ref('')
const filterMajor = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const detailVisible = ref(false)
const currentSchool = ref(null)
const shortlisted = ref([])

const allSchools = ref([
  { id: 1, name: 'Harvard University', country: '美国', major: 'Computer Science', ranking: 'QS #1', rankType: 'danger', tuition: '$50K', acceptanceRate: '4%', deadline: 'Jan 1', description: '世界顶尖研究型大学', requirements: ['GPA 3.9+', 'GRE 330+', 'Research papers'], website: 'https://harvard.edu' },
  { id: 2, name: 'Stanford University', country: '美国', major: 'CS/AI', ranking: 'QS #2', rankType: 'danger', tuition: '$52K', acceptanceRate: '4.5%', deadline: 'Jan 2', requirements: ['GPA 3.8+', 'Innovation focus'], website: 'https://stanford.edu' },
  { id: 3, name: 'MIT', country: '美国', major: 'CS', ranking: 'QS #3', rankType: 'danger', tuition: '$53K', acceptanceRate: '3.9%', deadline: 'Jan 3', requirements: ['GPA 3.95+', 'Mathematical olympiad'], website: 'https://mit.edu' },
  { id: 4, name: 'Oxford University', country: '英国', major: 'CS', ranking: 'QS #4', rankType: 'warning', tuition: '£35K', acceptanceRate: '18%', deadline: 'Jan 15', requirements: ['First Class Degree'], website: 'https://ox.ac.uk' },
  { id: 5, name: 'Cambridge University', country: '英国', major: 'CS', ranking: 'QS #5', rankType: 'warning', tuition: '£34K', acceptanceRate: '19%', deadline: 'Jan 20', requirements: ['2:1 Degree minimum'], website: 'https://cam.ac.uk' },
  { id: 6, name: 'Tsinghua University', country: '中国', major: 'CS', ranking: 'QS #25', rankType: 'success', tuition: '¥30K', acceptanceRate: '15%', deadline: 'Mar 1', requirements: ['GPA 3.5+'], website: 'https://tsinghua.edu.cn' },
  { id: 7, name: 'Peking University', country: '中国', major: 'CS', ranking: 'QS #14', rankType: 'success', tuition: '¥25K', acceptanceRate: '20%', deadline: 'Mar 1', requirements: ['GPA 3.3+'], website: 'https://pku.edu.cn' },
  { id: 8, name: 'University of Toronto', country: '加拿大', major: 'CS', ranking: 'QS #21', rankType: 'warning', tuition: 'CAD 50K', acceptanceRate: '43%', deadline: 'Jan 15', requirements: ['GPA 3.3+'], website: 'https://utoronto.ca' },
  { id: 9, name: 'University of Melbourne', country: '澳洲', major: 'CS', ranking: 'QS #13', rankType: 'warning', tuition: 'AUD 42K', acceptanceRate: '70%', deadline: 'Jan 15', requirements: ['GPA 3.0+'], website: 'https://unimelb.edu.au' }
])

// 提取所有唯一的专业用于下拉选项
const uniqueMajors = computed(() => {
  const majors = allSchools.value.map(s => s.major)
  return [...new Set(majors)]
})

// 解析排名数字
const getRankNumber = (ranking) => {
  const match = ranking.match(/(\d+)/)
  return match ? parseInt(match[1]) : 999
}

const filteredSchools = computed(() => {
  let result = allSchools.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(s => s.name.toLowerCase().includes(kw) || s.major.toLowerCase().includes(kw))
  }
  if (filterCountry.value) {
    result = result.filter(s => s.country === filterCountry.value)
  }
  if (filterMajor.value) {
    result = result.filter(s => s.major === filterMajor.value)
  }
  if (filterRankRange.value) {
    result = result.filter(s => {
      const rankNum = getRankNumber(s.ranking)
      switch (filterRankRange.value) {
        case 'top10': return rankNum <= 10
        case 'top20': return rankNum <= 20
        case 'top50': return rankNum <= 50
        case 'top100': return rankNum <= 100
        default: return true
      }
    })
  }
  return result
})

const search = () => {
  ElMessage.success(`找到 ${filteredSchools.value.length} 所学校`)
}

const resetFilters = () => {
  searchKeyword.value = ''
  filterCountry.value = ''
  filterRankRange.value = ''
  filterMajor.value = ''
}

const showDetail = (school) => {
  currentSchool.value = school
  detailVisible.value = true
}

const addToShortlist = (school) => {
  if (shortlisted.value.includes(school.id)) {
    ElMessage.warning('学校已在清单中')
    return
  }
  shortlisted.value.push(school.id)
  localStorage.setItem('shortlisted_schools', JSON.stringify(shortlisted.value))
  ElMessage.success(`已将 ${school.name} 加入选校清单`)
}

const goToApply = (school) => {
  router.push('/materials')
}

const visitWebsite = (url) => {
  if (url) {
    window.open(url, '_blank')
  } else {
    ElMessage.warning('暂无官网链接')
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

onMounted(() => {
  const saved = localStorage.getItem('shortlisted_schools')
  if (saved) {
    shortlisted.value = JSON.parse(saved)
  }

  // 如果有选校清单中的学校，高亮显示
  console.log('University database loaded')
})
</script>

<style scoped>
.university-database-page {
  max-width: 1400px;
  margin: 0 auto;
}

.search-card {
  margin-bottom: 20px;
}

.search-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.schools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.school-card {
  cursor: pointer;
  transition: all 0.3s;
}

.school-card:hover {
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.country {
  color: #909399;
  margin-bottom: 5px;
}

.major {
  color: #667eea;
  font-weight: 500;
  margin-bottom: 15px;
}

.card-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.stat-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.card-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

/* 详情页 */
.school-detail .detail-header {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  align-items: center;
}

.school-image {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.detail-title h2 {
  margin: 0 0 10px;
}

.detail-subtitle {
  color: #909399;
  margin: 0;
}

.description-section, .requirements-section {
  margin-top: 20px;
}

.description-section h4, .requirements-section h4 {
  margin-bottom: 10px;
  color: #303133;
}

.requirements-section ul {
  padding-left: 20px;
  list-style: square;
}

.requirements-section li {
  margin-bottom: 8px;
  color: #606266;
}

.detail-actions {
  margin-top: 30px;
  display: flex;
  gap: 12px;
}

.low-rate {
  color: #f56c6c;
}
</style>
