# 移除头像显示方案

## 需求概述
移除用户头像和智能体头像，做成纯粹的聊天界面。

## 当前结构
```
.message-wrapper
  └── .message
      ├── .message-avatar (头像 - 需要移除)
      │   ├── 用户: User 图标
      │   └── AI: 智能体 SVG 图标
      └── .message-main
          ├── .message-sender (智能体名字)
          └── .message-body
              ├── .message-time
              ├── .reasoning-block
              ├── .message-content
              └── .message-actions
```

## 目标结构
```
.message-wrapper
  └── .message
      └── .message-main
          ├── .message-sender (智能体名字 - 仅AI消息)
          └── .message-body
              ├── .message-time
              ├── .reasoning-block
              ├── .message-content
              └── .message-actions
```

## 实现步骤

### Step 1: 修改模板结构
- [ ] 移除 `.message-avatar` 整个 div
- [ ] 调整 `.message` 的布局，移除与头像相关的样式

### Step 2: 调整样式
- [ ] 移除 `.message-avatar` 相关样式
- [ ] 调整 `.message` 的 `gap`（当前是 `gap: 10px`，用于头像和内容的间距）
- [ ] 调整 `.message` 的最大宽度（当前 `max-width: 78%`，可能需要调整）

### Step 3: 可选 - 调整消息对齐
当前消息结构：
- 用户消息：右对齐（通过 `.message-wrapper.is-user` 控制）
- AI 消息：左对齐

移除头像后，可以考虑：
- 保持现有对齐方式（用户右、AI 左）
- 或者改为全部左对齐（更纯粹的聊天风格）

建议保持现有对齐方式，因为：
1. 用户和 AI 的视觉区分更清晰
2. 符合主流聊天应用的设计习惯

### Step 4: 清理未使用的代码
- [ ] 检查是否还有使用 `User` 图标（如果仅用于头像，可以移除导入）
- [ ] 检查是否还有使用 `currentAgent?.iconSvg`（如果仅用于头像显示）

## 需要修改的文件
- `src/views/AIChat.vue` - 模板和样式

## 视觉层次（修改后）
```
[智能体名字]       12px, 灰色, 仅AI消息显示
[时间]            11px, 灰色, 右对齐
[思考过程]         可折叠, 琥珀色边框
[消息气泡]         正常内容
[操作按钮]         复制/重新生成
```

## 边界情况
- [ ] 用户消息不显示智能体名字（符合预期）
- [ ] 欢迎页面不受影响
- [ ] 响应式布局正常
