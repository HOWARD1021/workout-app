# 07 — 目標焦點訓練歷程 (Timeline) 與 Supporting Metric Cards

**What to build:** 在 Growth Curve 下方呈現兩個元素：

1. **Goal-Focused Training Timeline**：本週已完成與待完成的訓練歷程，只列出與 active goal 相關的項目。無關動作在第一層隱藏。每個歷程項目可展開查看完整組數細節（每組的重量、次數、備註）。

2. **Supporting Metric Cards**：頻率與訓練量各一張獨立卡片，提供主曲線的補充脈絡。它們不與主曲線共用 Y 軸或疊加在同一張圖上。

Timeline 規格：
- 按時間倒序排列
- 第一層顯示：日期、動作名稱、簡要摘要（例如「3 組 × 80kg」）
- 展開後顯示每組的 weight、reps、note
- 只顯示本週紀錄
- 只顯示與 active goal 相關的動作（例如 strength goal 綁定臥推，就只顯示臥推）
- 已刪除 workout 不顯示

Supporting Metric Cards 規格：
- 頻率卡：本週完成次數 / 目標次數
- 訓練量卡：本週總量（kg）
- 獨立呈現，不混入主曲線

數據來源：ticket 04 的 `getGoalFocusedTimeline` 和 `getWeeklySessionCounts`。

**Blocked by:** 04 — 核心計算與聚合邏輯層

**Status:** ready-for-agent

- [ ] Goal-Focused Timeline 顯示在 Growth Curve 下方
- [ ] Timeline 只列出本週與 active goal 相關的訓練
- [ ] 無關動作在第一層隱藏
- [ ] 歷程項目可展開查看每組 weight、reps、note
- [ ] 已刪除 workout 不出現
- [ ] Supporting Metric Card：頻率（本週 N/M 次）
- [ ] Supporting Metric Card：訓練量（本週 N kg）
- [ ] 指標卡獨立呈現，不與主曲線共用 Y 軸
- [ ] 無 active goal 時 timeline 區域顯示適當的空狀態
- [ ] 元件測試覆蓋：有歷程、展開細節、無歷程、無目標
- [ ] `npm run typecheck` 與 `npm run test` 通過
