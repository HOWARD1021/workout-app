# 04 — 核心計算與聚合邏輯層 (Aggregation Seam)

**What to build:** 建立一組共用的 server-side 計算函式，讓週進度卡片、Progress Summary、Growth Curve 和 Timeline 都從同一個來源取得數據，避免不同元件對「什麼算完成」產生分歧。

這是整個 Training Review 的計算核心，下游所有 UI ticket 都依賴它。

需要的共用函式：

1. **`getWeeklySessionCounts(goalId, weekStart)`** — 計算指定週的各肌群 achieved vs expected session count。一個 completed workout 包含至少一個該肌群的 qualifying set 才算一次 session。

2. **`getWeeklyStrengthPoint(exerciseId, weekStart)`** — 計算指定週的最高 Estimated 1RM（Epley 公式）。該週無 qualifying set 時回傳 null（gap），不回傳 0。

3. **`getGrowthCurvePoints(goalId)`** — 產生整個 Goal Window 內的每週資料點陣列。Strength Goal 缺席週為 gap；Frequency/Volume Goal 缺席週為 0。

4. **`getGoalFocusedTimeline(goalId, weekStart)`** — 本週與 active goal 相關的訓練歷程，過濾掉無關動作。

共用規則（所有函式一致遵守）：
- 一致的 `getWeekStart()` 函式：Monday start
- 一致的時區處理：所有日期比較使用同一個 timezone 規則
- Qualifying Set：weight > 0 且 reps > 0
- 已刪除的 workout（deletedAt 不為 null）一律排除
- 只計算目標擁有者的 workout

建議放在 `src/lib/goal-aggregation.ts`，讓 API routes 和未來的 Server Components 都能引用。

**Blocked by:** 01 — Goal Schema 與資料庫遷移, 02 — 訓練目標 CRUD API

**Status:** ready-for-agent

- [ ] `getWeeklySessionCounts` 正確計算各肌群的 achieved / expected
- [ ] `getWeeklyStrengthPoint` 使用 Epley 公式計算最高 Estimated 1RM
- [ ] Strength Goal 缺席週回傳 null（gap），Frequency/Volume Goal 缺席週回傳 0
- [ ] `getGrowthCurvePoints` 產生整個 Goal Window 的週資料點陣列
- [ ] `getGoalFocusedTimeline` 只回傳與 active goal 相關的本週訓練
- [ ] 所有函式使用同一個 `getWeekStart()`（Monday start）
- [ ] 已刪除 workout 一律排除
- [ ] Qualifying Set 過濾：weight > 0 且 reps > 0
- [ ] 只處理目標擁有者的資料
- [ ] 同一週多次同動作訓練只取最高 1RM 作為該週資料點
- [ ] 單元測試覆蓋：不同重量/次數組合、同週多次訓練、空組/零值組、中斷的 workout、已刪除 workout、週邊界兩側的 workout
- [ ] Estimated 1RM 函式獨立可測
- [ ] `npm run typecheck` 與 `npm run test` 通過
