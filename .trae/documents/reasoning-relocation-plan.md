# 思考过程组件位置调整方案

## 需求概述
将思考过程（reasoning-block）从消息气泡内部移出，放置在气泡上方，并处理好与时间组件的关系。

## 当前结构
```
.message-body
  ├── .message-time (时间)
  └── .message-content (气泡)
      ├── .reasoning-block (思考过程 - 当前在气泡内)
      └── .message-text (消息内容)
```

## 目标结构
```
.message-body
  ├── .message-time (时间)
  ├── .reasoning-block (思考过程 - 移到气泡上方)
  └── .message-content (气泡)
      └── .message-text (消息内容)
```

## 样式调整方案

### 1. 思考过程样式调整
- 当前有 `margin-bottom: 12px`，移出后需要调整
- 需要添加与时间组件的间距
- 保持折叠/展开功能正常

### 2. 时间组件关系
- 时间在上，思考过程在下，气泡在最下
- 三者之间保持合适的间距
- 思考过程只在 AI 消息中显示，时间组件所有消息都有

### 3. 间距规划
```
.message-body
  gap: 6px (各元素之间间距)
  
.message-time
  padding: 0 4px
  
.reasoning-block (移出后)
  margin-bottom: 0 (移除)
  保持原有样式
  
.message-content
  保持原有样式
```

## 实现步骤

### Step 1: 修改模板结构
- [ ] 将 `.reasoning-block` 从 `.message-content` 内部移到外部
- [ ] 放置在 `.message-time` 下方，`.message-content` 上方
- [ ] 保持原有的 v-if 条件和 class 绑定

### Step 2: 调整样式
- [ ] 移除 `.reasoning-block` 的 `margin-bottom: 12px`
- [ ] 确保 `.message-body` 的 `gap: 6px` 能正确分隔各元素
- [ ] 调整 `.reasoning-block` 的宽度，与气泡对齐

### Step 3: 测试验证
- [ ] 正常思考过程显示
- [ ] 正在思考状态显示
- [ ] 折叠/展开功能正常
- [ ] 与时间组件间距合适
- [ ] 用户消息不显示思考过程（符合预期）

## 视觉层次
```
[时间]          11px, 灰色, 右对齐(用户消息)
[思考过程]       可折叠, 琥珀色边框
[消息气泡]       正常内容
[操作按钮]       复制/重新生成
```
