# 消息操作按钮重新设计方案

## 需求概述
将 AI 消息的操作按钮（复制、点赞、点踩、重新生成）从消息气泡内部移出，放置在气泡下方独立区域，并美化样式。

## 现状分析

### 当前结构
```
.message-wrapper
  └── .message
      ├── .message-avatar
      └── .message-content
          ├── .reasoning-block (可选)
          ├── .message-text
          └── .message-actions (当前在气泡内)
              ├── 复制按钮
              ├── 点赞按钮 (仅AI消息)
              ├── 点踩按钮 (仅AI消息)
              └── 重新生成按钮 (仅最后一条AI消息)
```

### 当前样式问题
1. 操作按钮隐藏在气泡内，需要 hover 才显示
2. 按钮排列紧凑，视觉层次不清晰
3. 重新生成按钮与其他按钮样式不一致

## 设计方案

### 新结构
```
.message-wrapper
  └── .message
      ├── .message-avatar
      └── .message-body (新增容器)
          ├── .message-content (气泡)
          │   ├── .reasoning-block (可选)
          │   └── .message-text
          └── .message-actions (移至气泡下方)
              ├── .action-group-left
              │   ├── 复制按钮
              │   ├── 点赞按钮
              │   └── 点踩按钮
              └── .action-group-right
                  └── 重新生成按钮 (仅最后一条)
```

### 样式设计

#### 1. 整体布局
- 操作栏位于消息气泡下方，与气泡左对齐
- 使用 flex 布局，左右分组
- 间距：与气泡间距 8px，按钮之间 4px

#### 2. 按钮样式
```css
/* 基础按钮 */
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #9ca3af;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

/* Hover 状态 */
.action-btn:hover {
  background: rgba(15, 23, 42, 0.06);
  color: #6b7280;
}

/* 激活状态 */
.action-btn.is-active {
  color: #0F172A;
  background: rgba(15, 23, 42, 0.08);
}

/* 重新生成按钮 */
.regenerate-btn {
  padding: 6px 10px;
  font-weight: 500;
}
```

#### 3. 视觉层次
- 按钮默认半透明，hover 时增强
- 点赞/点踩激活后显示主色 `#0F172A`
- 重新生成按钮添加文字标签，提升可发现性

#### 4. 动画效果
- 按钮 hover 时轻微上浮 `translateY(-1px)`
- 点击时缩放反馈 `scale(0.95)`
- 重新生成按钮添加旋转图标动画

### 响应式适配
- 移动端：按钮尺寸适当增大，便于触控
- 小屏幕：重新生成按钮可只显示图标

## 实现步骤

### Step 1: 修改模板结构
- [ ] 在 `.message-content` 外包裹 `.message-body` 容器
- [ ] 将 `.message-actions` 移出 `.message-content`
- [ ] 调整按钮分组结构

### Step 2: 更新样式
- [ ] 添加 `.message-body` 样式
- [ ] 重写 `.message-actions` 样式
- [ ] 更新 `.action-btn` 样式
- [ ] 添加按钮交互动画

### Step 3: 调整逻辑
- [ ] 确保操作功能（复制、反馈、重新生成）正常工作
- [ ] 验证仅在生成完成后显示操作栏

### Step 4: 测试验证
- [ ] 桌面端样式检查
- [ ] 移动端样式检查
- [ ] 功能测试（复制、点赞、点踩、重新生成）
- [ ] 边界情况（第一条消息、最后一条消息）

## 配色规范（遵循项目规则）
- 主色：`#0F172A` (Slate-900)
- 强调色：`#D97706` (Amber-600)
- 背景：`#FFFFFF`
- 文字次要色：`#9ca3af` → `#6b7280`

## 无障碍考虑
- 按钮保持适当的点击区域（最小 32px）
- 保留 tooltip 提示
- 支持 `prefers-reduced-motion` 媒体查询
