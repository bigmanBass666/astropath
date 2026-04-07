# Assessment 页面恢复进度优化计划

## 方案 A：自动恢复到上次停留的页面

## 实施步骤

### 1. 修改 `useAssessmentState.ts`
- 添加 `currentScene` 状态，默认值为 0
- 使用 `useStorage` 自动持久化到 localStorage
- 添加 `saveScene` 方法用于保存当前场景

### 2. 修改 `Assessment.vue`
- 在 `goToScene` 函数中调用 `assessmentState.saveScene(index)`
- 在 `onMounted` 中添加自动恢复逻辑：
  ```javascript
  if (assessmentState.hasData.value && assessmentState.currentScene.value > 0) {
    currentScene.value = assessmentState.currentScene.value
  }
  ```

### 3. 修改 Hero 页（Scene 0）
- 如果用户有数据且不在 Scene 0，自动跳转到对应场景
- 或者隐藏 Hero 页，直接显示对应场景

### 4. 评估结果页（Scene 4）
- 添加"重新评估"按钮，点击后：
  - 调用 `assessmentState.resetForm()`
  - 重置 `currentScene` 为 0
  - 跳转到 Hero 页

## 代码修改点

1. **useAssessmentState.ts**
   - 添加 `currentScene` ref
   - 添加 `saveScene(scene: number)` 方法
   - 添加 `resetScene()` 方法

2. **Assessment.vue**
   - 修改 `goToScene` 函数
   - 修改 `onMounted` 生命周期
   - 修改 `resetForm` 函数

## 预期效果

- 用户填写完基本信息（Scene 1）后刷新，直接显示 Scene 1
- 用户在 Scene 3 时刷新，直接回到 Scene 3
- 用户完成评估（Scene 4）后刷新，直接显示 Scene 4
- 点击"重新评估"后清空所有数据，回到 Scene 0
