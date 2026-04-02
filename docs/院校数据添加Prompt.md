# 院校数据添加 Prompt

## 给AI的指令

请按照以下标准为留学申请系统添加新的院校数据：

### 数据收集要求

1. **QS排名** - 从QS官网获取最新排名
2. **学费** - 优先使用院校官网数据
3. **录取率** - 使用College Tuition Compare、UnivStats等权威网站
4. **申请要求** - 必须真实可查，不可虚构

### 数据格式

```javascript
{
  id: Number,                    // 递增ID
  name: '院校中文名',
  country: '国家',
  major: '热门专业',
  ranking: 'QS #数字',
  match: Number,                 // 根据排名估算: Top10=85-95, 11-20=75-85, 21-50=65-75
  deadline: 'YYYY-MM-DD',
  tuition: '货币符号+数字',       // 如 $57,590, £35,000
  acceptanceRate: '数字%',
  requirements: [
    'GPA要求 (注明最低/平均)',
    '语言要求 (TOEFL/IELTS)',
    '其他学术要求',
    '申请材料要求'
  ],
  website: 'https://...',
  description: '学校简介50-100字',
  type: '公立大学/私立大学',
  students: '约数字人',
  image: '',
  sources: {
    ranking: { url: '来源URL', label: '来源名称' },
    tuition: { url: '来源URL', label: '来源名称' },
    acceptance: { url: '来源URL', label: '来源名称' },
    requirements: { url: '来源URL', label: '来源名称' }
  }
}
```

### 关键规则

1. **数据真实性** - 所有数据必须有可访问的来源URL
2. **申请要求** - 不可虚构，必须基于真实招生信息
3. **货币格式** - 必须包含正确的货币符号
4. **来源标注** - 每个数据点都要标注来源

### 信息来源优先级

1. 院校官网（最权威）
2. QS官网（排名）
3. College Tuition Compare, Collegedunia（录取率、学费）
4. 新东方前途出国等留学机构（申请要求）

### 示例

```javascript
{
  id: 20,
  name: '某某大学',
  country: '美国',
  major: 'Computer Science',
  ranking: 'QS #21',
  match: 75,
  deadline: '2025-01-15',
  tuition: '$55,000',
  acceptanceRate: '25%',
  requirements: [
    'GPA 3.5+ (最低要求)',
    'TOEFL 90+ / IELTS 7.0+',
    '相关专业背景',
    '个人陈述'
  ],
  website: 'https://example.edu',
  description: '某某大学是美国顶尖研究型大学，在计算机科学领域享有盛誉。',
  type: '公立大学',
  students: '约35,000人',
  image: '',
  sources: {
    ranking: { url: 'https://www.qs.com/rankings/', label: 'QS 2025排名' },
    tuition: { url: 'https://example.edu/tuition', label: '某某大学官网' },
    acceptance: { url: 'https://collegetuitioncompare.com/...', label: 'College Tuition Compare' },
    requirements: { url: 'https://example.edu/admissions', label: '某某大学招生要求' }
  }
}
```

---

## 使用方法

将以上内容复制给AI，然后说明要添加的院校：

> "请按照《院校数据添加指南》的标准，添加QS排名前50中的以下院校：
> - 某某大学 (QS #XX)
> - 某某大学 (QS #XX)
> 
> 请确保：
> 1. 数据真实可溯源
> 2. 申请要求不虚构
> 3. 所有来源URL可访问"

AI将自动：
1. 搜索院校信息
2. 验证数据真实性
3. 格式化数据
4. 提供完整的数据对象
