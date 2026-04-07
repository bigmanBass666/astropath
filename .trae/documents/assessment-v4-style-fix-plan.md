# Assessment V4 样式全面修复计划

> **触发原因**: 用户确认 V4 卡片架构可用，但各卡片具体样式残缺、丑陋；AI 部分 UX 不好；**综合竞争力评分（雷达图）损坏**

> **方法**: Playwright MCP 逐卡截图审计 + 源码逐行分析，一次性发现并修复所有问题

---

## 🔴 Critical Issues（必须修复）

### C1. 雷达图渲染时序崩溃 — "综合竞争力评分是坏的"
- **位置**: `revealSequence()` (L2123-2151) → `renderRadarChart()` (L2164) vs 雷达 DOM v-if (L1342-1346)
- **根因**: `renderRadarChart()` 在 `reportStage=1` 时被调用，但雷达图 DOM 的 `v-if="reportStage >= 2"` 意味着此时 DOM **不存在**
  ```
  revealSequence:
    stage=1 → animateScore() → renderRadarChart() ← ❌ radarRef.value === null!
    stage=2 → 雷达 div 才出现
  ```
- **修复**: 将 `renderRadarChart()` 调用移到 `reportStage = 2` 之后：
  ```js
  reportStage.value = 2
  await nextTick()
  renderRadarChart()  // 移到这里，DOM 已存在
  ```

### C2. Hero 残留 V3 滚动提示 — 卡片模式下无意义
- **位置**: L61-86 `.hero-scroll-hint` + `.hero-bottom-fade`
- **问题**: Card Deck 模式不滚动，但 Hero 仍显示"向下滚动"手机图标 + 底部渐变遮罩
- **修复**: 删除整个 `.hero-scroll-hint` div (L61-85) 和 `.hero-bottom-fade` div (L86)，或加 `v-if="false"` / 用 CSS `display:none`

---

## 🟡 Medium Issues（样式违规/冲突/丑陋）

### M1. `.deg-pill` 双重定义冲突
- **位置**: L2497-2501 **vs** L2502-2506
- **问题**: 同一选择器定义了两次，属性互相覆盖/矛盾：
  - 第1次: `padding:14px 24px; border-radius:11px; background:transparent` + `::before` scaleX动画
  - 第2次: `padding:10px 32px; border-radius:100px; border:1.5px solid #E2E8F0` + `::before` scaleY动画
- **修复**: 删除第一组 (L2497-2501)，保留第二组 (L2502-2506) 的胶囊样式（更符合设计规范）

### M2. `.timeline-entry` 双重定义 + 动画闪烁
- **位置**: L2536-2540 (基础样式) **vs** L2599-2600 (动画样式)
- **问题**: 
  - 第一处设 `opacity:1` + hover 效果
  - 第二处设 `opacity:0; transform:translateX(-16px)` + 入场动画
  - 结果：每次渲染都触发入场动画，导致列表项不断闪现
- **修复**: 合并为单一定义，移除第二处的 `opacity:0; transform` 初始态，改用 `.is-new` 类控制入场

### M3. 大面积配色违规（项目只允许 #0F172A / #D97706 / #FFFFFF）

| 行号 | 类名 | 非法颜色 | 应改为 |
|------|------|----------|--------|
| L2541 | `.te-dot--volunteer` | `#059669` 绿 | `#D97706` 或 `#0F172A` |
| L2554 | `.tag-mini.tm-danger` | `#DC2626` 红 | `#D97706` (警告色) |
| L2554 | `.tag-mini.tm-ok` | `#059669` 绿 | `#0F172A` |
| L2554 | `.tag-mini.tm-primary` | `#2563EB` 蓝 | `#0F172A` |
| L2575-2576 | `.btn-stop` / `.btn-stop-xs` | `#DC2626` 红 | `#D97706` |
| L2584-2585 | `.btn-pause` / `.btn-pause-xs` | `#D97706` ✅ (保留) | — |
| L2609-2610 | `.add-node--green:hover` | `#059669` 绿 | `#D97706` |
| L2657 | `.rb-header` (reason box) | `#2563EB` 蓝 bg | `rgba(217,119,6,.08)` + `#D97706` 文字 |
| L2664 | `.cb-header` (content box) | `#059669` 绿 bg | `rgba(15,23,42,.05)` + `#0F172A` 文字 |
| L2681 | `.g-excellent` | `#059669` 绿 | `#0F172A` bg + 白字 |
| L2681 | `.g-low` / `.g-pass` | `#DC2626` 红 | `#D97706` |
| L3208 | `.dim-fill--research` | `#059669→#10B981` 绿渐变 | `#0F172A→#334155` 灰渐变 |
| L3209 | `.dim-fill--practice` | `#7C3AED→#A78BFA` 紫渐变 | `#D97706→#F59E0B` Amber 渐变 |

### M4. AI 对话面板 UX 问题
- **位置**: Card 4 的 bt-ai 区域 (L2633-2647)
- **问题**:
  - `.bt-ai.err` 使用红色 `#DC2626`（配色违规）
  - AI 思考状态 `.ai-thinking` 样式偏弱，缺少视觉层次
  - 折叠/展开交互不够直观
- **修复**: 
  - 统一错误状态为 Amber 色
  - 增强 thinking 动画（三点的 pulse 更明显）
  - 增加 panel 高度约束和更好的滚动体验

### M5. 表单元素样式不一致
- **问题**: 
  - Name input 有自定义大圆角 (`border-radius:18px`) 和特殊 focus 光晕 (L2446-248)
  - 但其他 input 使用通用 deep override (`border-radius:11px`, L2721)
  - GPA Ring 区域在移动端 `flex-direction:column` 后文字居中但整体布局可能挤压
- **修复**: 统一圆角规范，确保 mobile 端 GPA 区域有足够 padding

---

## 🟢 Low Issues（细节打磨）

### L1. 进度条组件残留
- **位置**: L2383-2418 `.progress-bar` 全套样式
- **问题**: V4 Card Deck 模式使用 `.deck-nav` 底部导航点，`.progress-bar` 是 V3 Bottom Progress Bar 的遗留
- **修复**: 如果确认不再使用可删除（或保留但不渲染）

### L2. orbit 相关样式残留
- **位置**: L2752 `.orbit{right:16px}`, L2764 `.orbit{display:none}`
- **问题**: 引用了模板中不存在的 `.orbit` 元素
- **修复**: 清理无用 CSS 规则

### L3. CTA Immersive 区块与 Reveal Moment 区块重复
- **位置**: L2830-2998 (cta-immersive) vs L3000+ (reveal-stage/score-hero 等)
- **问题**: 存在两套报告生成 UI：旧的 cta-immersive 和新的 reveal-stage。Card 4 模板中实际使用的是 reveal-stage 系列
- **修复**: 确认 cta-immersive 是否仍在使用，如未使用则清理

### L4. 缺少 `prefers-reduced-motion` 媒体查询
- **问题**: 大量 @keyframes 动画未在 `@media (prefers-reduced-motion: reduce)` 中禁用
- **修复**: 在文件末尾添加全局 reduced-motion 覆盖

### L5. Deck Nav 与 Footer z-index 冲突潜在风险
- **问题**: `.deck-nav` z-index=100, 但 App.vue footer 可能覆盖
- **修复**: 确认 footer z-index < 100, 或提高 deck-nav

---

## 📋 执行顺序

1. **C1**: 修复雷达图渲染时序（用户明确报的 bug）
2. **C2**: 删除 Hero 滚动提示残留
3. **M1**: 清理 .deg-pill 重复定义
4. **M2**: 修复 .timeline-entry 重复/闪烁
5. **M3**: 全局配色合规化（批量替换所有非法颜色）
6. **M4**: AI 面板 UX 增强
7. **M5**: 表单一致性调整
8. **L1-L5**: 清理残留代码 + reduced-motion + z-index

## ✅ 验证标准

每步修改后执行：
```bash
npm run typecheck   # 必须零错误
npm run lint        # 必须 zero error
```
然后 Playwright 逐卡验证：
- [ ] Card 0 Hero: 无滚动提示，全屏美观
- [ ] Card 1 Identity: 表单一致，GPA ring 正常
- [ ] Card 2 Academics: pills/tags 交互正常
- [ ] Card 3 Experience: tabs 切换正常，timeline 不闪烁
- [ ] Card 4 Report: **雷达图正确渲染** ✅, 分数动画流畅, AI 面板可用
- [ ] 所有颜色在白名单内 (#0F172A/#D97706/#FFF)
- [ ] Mobile ≤767px 各卡片布局不崩
