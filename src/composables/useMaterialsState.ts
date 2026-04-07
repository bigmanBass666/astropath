import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { sendMessageToAI } from '@/utils/ai-api'
import { DEFAULT_PROVIDER } from '@/composables/useAIConfig'

export function useMaterialsState() {
  const selectedEssayType = ref<string | null>(null)
  const selectedTemplate = ref<any>(null)
  const essayContent = ref('')
  const editorMode = ref<'edit' | 'preview'>('edit')
  const versions = ref<Array<{ date: string; note: string; content: string }>>([])
  const aiMessages = ref<Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }>>([])
  const aiPrompt = ref('')
  const isGenerating = ref(false)
  const selectedProvider = ref<string | null>(null)
  const documentTitle = ref('')

  const materialsDrawerOpen = ref(false)
  const aiPanelOpen = ref(true)
  const versionPanelOpen = ref(false)
  const previewMode = ref(false)
  const wizardDone = ref(false)

  const activeCategory = ref<string[]>(['required'])
  const selectedCountry = ref('美国')

  const essayTypes = [
    { value: 'ps', label: '个人陈述', description: '阐述你的学术背景、研究兴趣和职业目标' },
    { value: 'cv', label: '简历', description: '展示你的教育背景、工作经历和技能成就' },
    { value: 'reference', label: '推荐信', description: '由推荐人撰写，评价你的能力和潜力' },
    { value: 'research', label: '研究计划', description: '描述你的研究方向和计划 (适用于研究型学位)' }
  ]

  const essayTemplates = {
    ps: [
      { id: 'ps-basic', name: '标准个人陈述模板', description: '包含引言、学术背景、研究经历、职业目标、结语', content: `个人陈述\n\n引言：\n（在此处简要介绍自己，说明申请的专业和学校）\n\n学术背景：\n（描述你的本科/研究生学习经历，重点课程和成绩）\n\n研究经历：\n（列举参与的研究项目，你的角色和贡献）\n\n职业目标：\n（说明短期和长期职业规划）\n\n为什么选择该项目：\n（阐述你对学校/项目的了解和选择理由）\n\n结语：\n（总结并表达热情）` },
      { id: 'ps-scholarship', name: '奖学金申请专用', description: '强调学术成就和领导力，适合申请全额奖学金', content: `个人陈述 - 奖学金申请\n\n尊敬的评审委员会：\n作为一名追求卓越的学生，我怀着对[专业领域]的深厚热情申请[学校]的[专业]项目，并恳请获得奖学金支持。\n\n学术成就：\n（详细列出GPA、排名、重要奖项等）\n\n领导力与社会服务：\n（描述学生工作、志愿者经历、社会影响）\n\n研究潜力：\n（展示已发表论文、研究项目、创新能力）\n\n未来贡献：\n（说明你将如何回馈学术社区）\n\n结语：` }
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

  const essayKeyPoints: Record<string, string[]> = {
    ps: ['突出你的独特性和与专业的匹配度', '用具体事例支撑你的能力阐述', '展现你对专业的热情和理解', '说明为什么选择这所学校/这个项目', '保持真诚，避免过度包装', '字数控制在500-800词（英国）或650词以内（美国）'],
    cv: ['保持在一页以内（除非经历丰富）', '使用清晰的排版和一致的格式', '按时间倒序排列经历', '使用动词开头描述职责', '量化成果（如"提高20%"）', '针对不同项目定制简历内容'],
    reference: ['推荐人应熟悉你的学术或工作表现', '选择能评价你核心能力的推荐人', '提供推荐人所需材料（简历、PS等）', '提前2-3个月礼貌请求', '提醒推荐人截止日期', '推荐信内容应与PS相互呼应'],
    research: ['选择你真正感兴趣且有基础的领域', '研究问题应明确、可行', '充分展示对相关文献的了解', '方法论描述应具体可行', '与目标导师研究方向匹配', '体现你对该领域的深入思考']
  }

  const defaultAllItems = {
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
  }

  const allItems = ref(JSON.parse(JSON.stringify(defaultAllItems)))

  const countries = ['美国', '英国', '澳大利亚', '加拿大', '新加坡', '日本', '韩国', '欧洲']

  const defaultVisaMaterials: Record<string, Array<{ name: string; completed: boolean; note: string }>> = {
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

  const applicationStages = ref([
    { id: 'background', name: '背景准备', icon: '📚', route: '/assessment', tasks: [{ name: '完成背景评估', completed: false }, { name: '准备语言成绩', completed: false }, { name: '准备GPA证明', completed: false }, { name: '整理科研经历', completed: false }] },
    { id: 'documents', name: '文书撰写', icon: '✍️', route: '/materials', tasks: [{ name: '个人陈述', completed: false }, { name: '简历CV', completed: false }, { name: '推荐信', completed: false }, { name: '研究计划', completed: false }] },
    { id: 'application', name: '网申提交', icon: '📝', route: '/school-recommendation', tasks: [{ name: '填写申请表', completed: false }, { name: '上传材料', completed: false }, { name: '支付申请费', completed: false }, { name: '确认提交', completed: false }] },
    { id: 'offer', name: 'Offer跟进', icon: '📬', route: '/timeline', tasks: [{ name: '等待录取结果', completed: false }, { name: '确认Offer', completed: false }, { name: '缴纳留位费', completed: false }] },
    { id: 'visa', name: '签证办理', icon: '🛂', route: '/materials', tasks: [{ name: '准备签证材料', completed: false }, { name: '预约签证面试', completed: false }, { name: '完成签证面试', completed: false }, { name: '获取签证', completed: false }] }
  ])

  const categories = ref([
    { id: 'required', name: '必需材料' },
    { id: 'recommended', name: '推荐材料' },
    { id: 'optional', name: '可选材料' },
    { id: 'visa', name: '签证材料' }
  ])

  const providers = computed(() => {
    const saved = localStorage.getItem('ai_providers')
    return saved ? JSON.parse(saved) : [DEFAULT_PROVIDER]
  })

  const wordCount = computed(() => essayContent.value.replace(/\s/g, '').length)

  const charStats = computed(() => {
    const text = essayContent.value
    return {
      zh: (text.match(/[\u4e00-\u9fff]/g) || []).length,
      en: (text.match(/[a-zA-Z]/g) || []).length,
      digits: (text.match(/[0-9]/g) || []).length,
      punct: (text.match(/[^\u4e00-\u9fff a-zA-Z0-9\n\r]/g) || []).length,
      space: (text.match(/ /g) || []).length,
      newline: (text.match(/\n/g) || []).length
    }
  })

  const readingTime = computed(() => Math.ceil(wordCount.value / 400))

  const completionRate = computed(() => {
    const items = getAllItemsFlat()
    if (!items.length) return 0
    const done = items.filter(i => i.completed).length
    return Math.round((done / items.length) * 100)
  })

  const completedCount = computed(() => getAllItemsFlat().filter(i => i.completed).length)
  const pendingCount = computed(() => getAllItemsFlat().filter(i => !i.completed).length)

  const overallProgress = computed(() => {
    const allTasks = applicationStages.value.flatMap((s: any) => s.tasks)
    const done = allTasks.filter((t: any) => t.completed).length
    return Math.round((done / allTasks.length) * 100)
  })

  function getAllItemsFlat() {
    const result: Array<{ name: string; completed: boolean; note: string }> = []
    ;(Object.values(allItems.value) as any[][]).forEach((arr: any[]) => result.push(...arr))
    const visaList = visaMaterials.value[selectedCountry.value] || []
    result.push(...visaList)
    return result
  }

  function getEssayTypeLabel(type: string) {
    return essayTypes.find(t => t.value === type)?.label || '文书'
  }

  function getTemplatesForType(type: string) {
    return essayTemplates[type as keyof typeof essayTemplates] || []
  }

  function getCategoryItems(catId: string) {
    if (catId === 'visa') return visaMaterials.value[selectedCountry.value] || []
    return allItems.value[catId as keyof typeof allItems.value] || []
  }

  function getCategoryCompleted(catId: string) {
    return getCategoryItems(catId).filter((i: any) => i.completed).length
  }

  function toggleCategory(id: string) {
    const idx = activeCategory.value.indexOf(id)
    if (idx >= 0) activeCategory.value.splice(idx, 1)
    else activeCategory.value.push(id)
  }

  function selectEssayType(type: string) {
    selectedEssayType.value = type
    selectedTemplate.value = null
    documentTitle.value = getEssayTypeLabel(type)
  }

  function selectTemplate(template: any) {
    selectedTemplate.value = template
    essayContent.value = template.content
    saveEssayContent()
  }

  function saveEssayContent() {
    localStorage.setItem('essay_current_content', essayContent.value)
    localStorage.setItem('essay_type', selectedEssayType.value || '')
    localStorage.setItem('essay_template_id', selectedTemplate.value?.id || '')
    localStorage.setItem('essay_title', documentTitle.value)
  }

  function loadSavedState() {
    const savedContent = localStorage.getItem('essay_current_content')
    if (savedContent) essayContent.value = savedContent

    const savedType = localStorage.getItem('essay_type')
    if (savedType) selectedEssayType.value = savedType

    const savedTplId = localStorage.getItem('essay_template_id')
    if (savedTplId && selectedEssayType.value) {
      const tpl = getTemplatesForType(selectedEssayType.value).find(t => t.id === savedTplId)
      if (tpl) selectedTemplate.value = tpl
    }

    const savedTitle = localStorage.getItem('essay_title')
    if (savedTitle) documentTitle.value = savedTitle

    const savedVersions = localStorage.getItem('essay_versions')
    if (savedVersions) versions.value = JSON.parse(savedVersions)

    const savedChecklist = localStorage.getItem('materials_checklist')
    if (savedChecklist) {
      try {
        const data = JSON.parse(savedChecklist)
        if (data.allItems) allItems.value = data.allItems
        if (data.selectedCountry) selectedCountry.value = data.selectedCountry
        if (data.visaMaterials) visaMaterials.value = data.visaMaterials
      } catch {
        // ignore parse errors
      }
    }

    const savedProgress = localStorage.getItem('application_progress_data')
    if (savedProgress) {
      try {
        const data = JSON.parse(savedProgress)
        applicationStages.value.forEach(stage => {
          const savedStage = data.find((s: any) => s.id === stage.id)
          if (savedStage) stage.tasks.forEach((task, idx) => {
            if (savedStage.tasks[idx]) task.completed = savedStage.tasks[idx].completed
          })
        })
      } catch {
        // ignore parse errors
      }
    }

    const wizard = localStorage.getItem('materials_wizard_done')
    wizardDone.value = !!wizard

    const savedProviders = localStorage.getItem('ai_providers')
    if (savedProviders) {
      try {
        const parsed = JSON.parse(savedProviders)
        if (parsed.length > 0) selectedProvider.value = parsed[0].id
      } catch {
        // ignore parse errors
      }
    }
    if (!selectedProvider.value) selectedProvider.value = DEFAULT_PROVIDER.id

    if (!documentTitle.value && selectedEssayType.value) {
      documentTitle.value = getEssayTypeLabel(selectedEssayType.value)
    }
  }

  function updateProgress() {
    localStorage.setItem('materials_checklist', JSON.stringify({
      allItems: allItems.value,
      selectedCountry: selectedCountry.value,
      visaMaterials: visaMaterials.value
    }))
  }

  function saveProgressData() {
    const data = applicationStages.value.map(stage => ({
      id: stage.id,
      tasks: stage.tasks.map(t => ({ name: t.name, completed: t.completed }))
    }))
    localStorage.setItem('application_progress_data', JSON.stringify(data))
  }

  function addCustomItem(name: string, category: string, note: string) {
    if (!name) return false
    allItems.value[category as keyof typeof allItems.value].push({ name, completed: false, note })
    updateProgress()
    return true
  }

  function editItem(categoryId: string, index: number, newName: string, newNote: string) {
    let item
    if (categoryId === 'visa') item = visaMaterials.value[selectedCountry.value][index]
    else item = allItems.value[categoryId as keyof typeof allItems.value][index]
    if (item) {
      item.name = newName
      item.note = newNote
      updateProgress()
    }
  }

  function removeItem(categoryId: string, index: number) {
    if (categoryId === 'visa') visaMaterials.value[selectedCountry.value].splice(index, 1)
    else allItems.value[categoryId as keyof typeof allItems.value].splice(index, 1)
    updateProgress()
  }

  function resetChecklist() {
    Object.keys(allItems.value).forEach(cat =>
      (allItems.value[cat as keyof typeof allItems.value] as any[]).forEach(item => { item.completed = false })
    )
    Object.keys(visaMaterials.value).forEach(country =>
      (visaMaterials.value[country as keyof typeof visaMaterials.value] as any[]).forEach(item => { item.completed = false })
    )
    updateProgress()
  }

  async function generateWithAI(userMessage?: string) {
    const msg = userMessage || aiPrompt.value.trim()
    if (!selectedProvider.value) { ElMessage.warning('请先配置AI提供商'); return }
    if (!msg) { ElMessage.warning('请输入AI指令'); return }

    aiMessages.value.push({ role: 'user', content: msg, timestamp: Date.now() })
    aiPrompt.value = ''
    isGenerating.value = true

    const currentContent = essayContent.value
    const systemPrompt = `你是一位文书写作导师，帮助用户改进和润色留学申请文书。
根据用户的指令和当前文书内容，提供具体的修改建议或直接生成内容。
用户当前的文书类型：${getEssayTypeName(selectedEssayType.value || 'ps')}
重要：请直接输出改进后的完整内容或新增段落，不要添加多余的解释性文字。`

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `当前文书内容：\n${currentContent || '(空)'}\n\n我的指令：${msg}` }
    ]

    let assistantMsg = ''
    const assistantIdx = aiMessages.value.length
    aiMessages.value.push({ role: 'assistant', content: '', timestamp: Date.now() })

    try {
      const streamGenerator = await sendMessageToAI(selectedProvider.value, messages, {
        temperature: 0.7,
        maxTokens: 1500,
        stream: true
      })

      for await (const chunk of streamGenerator as AsyncIterable<{ type: string; content: any }>) {
        if (chunk.type === 'content') {
          assistantMsg += chunk.content
          aiMessages.value[assistantIdx].content = assistantMsg
        }
      }

      ElMessage.success('AI 回复已完成')
    } catch (error: any) {
      ElMessage.error(`生成失败: ${error.message}`)
      aiMessages.value.pop()
    } finally {
      isGenerating.value = false
    }
  }

  function acceptSuggestion(content: string) {
    essayContent.value = essayContent.value ? essayContent.value + '\n\n' + content : content
    saveEssayContent()
    ElMessage.success('已采纳建议')
  }

  function saveVersion(note: string) {
    if (!essayContent.value.trim()) { ElMessage.warning('文书内容为空'); return }
    versions.value.unshift({
      date: new Date().toLocaleString('zh-CN'),
      note: note || `版本 ${versions.value.length + 1}`,
      content: essayContent.value
    })
    localStorage.setItem('essay_versions', JSON.stringify(versions.value))
    ElMessage.success('版本已保存')
  }

  function restoreVersion(version: any) {
    essayContent.value = version.content
    saveEssayContent()
    ElMessage.success('已恢复到此版本')
  }

  function markWizardDone() {
    wizardDone.value = true
    localStorage.setItem('materials_wizard_done', '1')
  }

  function getStageProgress(stage: any) {
    const done = stage.tasks.filter((t: any) => t.completed).length
    return Math.round((done / stage.tasks.length) * 100)
  }

  function isStageCompleted(stage: any) {
    return stage.tasks.every((t: any) => t.completed)
  }

  function getStageStatus(stage: any) {
    const p = getStageProgress(stage)
    if (p === 100) return '已完成'
    if (p > 0) return '进行中'
    return '待开始'
  }

  function exportCSV() {
    const rows: string[][] = [['材料名称', '类别', '状态', '备注']]
    const catMap: Record<string, string> = { required: '必需材料', recommended: '推荐材料', optional: '可选材料' }
    for (const [cat, catName] of Object.entries(catMap)) {
      for (const item of allItems.value[cat as keyof typeof allItems.value]) {
        rows.push([item.name, catName, item.completed ? '已完成' : '未完成', item.note])
      }
    }
    const csv = rows.map(r => r.map(c => `"${(c || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `材料清单_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
    ElMessage.success('CSV 已导出')
  }

  function renderMarkdown(text: string) {
    if (!text) return ''
    let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    html = html
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)/gs, '<ul>$1</ul>')
      .replace(/\n/g, '<br>')
    return html
  }

  function getEssayTypeName(type: string) {
    const names: Record<string, string> = { ps: '个人陈述', cv: '简历', reference: '推荐信', research: '研究计划' }
    return names[type] || '文书'
  }

  loadSavedState()

  return {
    state: {
      selectedEssayType,
      selectedTemplate,
      essayContent,
      editorMode,
      versions,
      aiMessages,
      aiPrompt,
      isGenerating,
      selectedProvider,
      documentTitle,
      materialsDrawerOpen,
      aiPanelOpen,
      versionPanelOpen,
      previewMode,
      wizardDone,
      activeCategory,
      selectedCountry,
      essayTypes,
      essayTemplates,
      essayKeyPoints,
      allItems,
      categories,
      countries,
      visaMaterials,
      applicationStages,
      providers
    },
    computed: {
      wordCount,
      charStats,
      readingTime,
      completionRate,
      completedCount,
      pendingCount,
      overallProgress
    },
    actions: {
      getEssayTypeLabel,
      getTemplatesForType,
      getCategoryItems,
      getCategoryCompleted,
      toggleCategory,
      selectEssayType,
      selectTemplate,
      saveEssayContent,
      loadSavedState,
      updateProgress,
      saveProgressData,
      addCustomItem,
      editItem,
      removeItem,
      resetChecklist,
      generateWithAI,
      acceptSuggestion,
      saveVersion,
      restoreVersion,
      markWizardDone,
      getStageProgress,
      isStageCompleted,
      getStageStatus,
      exportCSV,
      renderMarkdown,
      getEssayTypeName,
      getAllItemsFlat
    }
  }
}
