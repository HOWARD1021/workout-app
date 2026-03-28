# 004 - Bug 修復、回饋改進與新功能 (2026-03-28)

## 概述
修復 4 個關鍵 Bug、改進回饋直觀度、新增 3 個功能。

## 變更清單

### Bug #1: 重整頁面資料消失
**問題：** `I18nProvider` 在 hydration 期間回傳 `null`，導致整棵 React tree 被卸載，`WorkoutProvider` 的 state 重置。加上 `log/page.tsx` 的 useEffect 在 localStorage restore 前就啟動新 workout（race condition）。

**修復：**
- `src/lib/i18n/index.tsx` — 移除 `isHydrated` guard，不再回傳 `null`，改為直接渲染 children
- `src/contexts/WorkoutContext.tsx` — 新增 `isRestored` state，restore 完成後設為 `true`
- `src/app/log/page.tsx` — useEffect 依賴 `isRestored`，等 restore 完成才決定是否啟動新 workout

### Bug #2: 離開頁面倒數停止
**問題：** Rest timer 用 `setInterval` 遞減，手機瀏覽器切 tab/鎖屏時 interval 被 throttle。

**修復：**
- `WorkoutContext` 新增 `restEndTimeRef`（絕對時間戳）
- `startRestTimerFn` 改為計算 `endTime = Date.now() + seconds * 1000`，interval 內用 `Math.ceil((endTime - now) / 1000)` 取剩餘秒數
- `addRestTimeFn` 改為調整 `restEndTimeRef` 而非直接加減 state
- 新增 `visibilitychange` 事件監聽，tab 回到前景時同步 elapsed time 和 rest timer

### Bug #3: 休息完成音效太小聲
**修復（`WorkoutContext.tsx` playRestEndSound）：**
- gain: `0.3` → `0.8`
- 頻率: 單一 880Hz → 雙頻疊加 880Hz + 1320Hz（最後一聲 1100Hz + 1500Hz）
- 每聲 beep: `0.15s` → `0.2s`
- 聲數: 3 → 4

### Bug #4: 菜單太少
**修復：** 新增 `drizzle/0006_more_exercises.sql`，包含約 60 個新動作：
- Chest: 5 個（Decline Bench Press, Chest Press Machine, Pec Deck, Incline DB Fly, DB Bench Press）
- Back: 6 個（T-Bar Row, Single Arm DB Row, Reverse Fly, Hyperextension, Straight Arm Pulldown, Meadows Row）
- Legs: 10 個（Hip Thrust, Walking Lunge, Hack Squat, Goblet Squat, Sumo Deadlift, Glute Kickback, Step Up, Seated Calf Raise, Leg Press 45°, Good Morning）
- Shoulders: 8 個（Arnold Press, Reverse Pec Deck, Upright Row, Barbell/DB Shrug, DB Lateral Raise, DB OHP, Rear Delt Raise）
- Arms: 10 個（Preacher Curl, Concentration Curl, OH Tricep Extension, Tricep Dip, Cable Curl, Reverse Grip Curl, Diamond Push Up, Close Grip BP, Rope Pushdown, EZ Bar Curl）
- Core: 8 個（Ab Wheel, Cable Crunch, Dead Bug, Hanging Leg Raise, Woodchop, Mountain Climber, Side Plank, Bicycle Crunch）
- Cardio: 6 個（Stair Climber, Elliptical, Battle Rope, Swimming, Treadmill Walk, Burpee）
- Flexibility: 3 個（Foam Rolling, Yoga Flow, Hip Flexor Stretch）

**部署注意：** 需在 remote D1 執行 `0006_more_exercises.sql`，見 `agent/deploy.md`。

### 改進: 回饋資料直觀化

**WorkoutComplete（`src/components/WorkoutComplete.tsx`）：**
- Stats 改為 2x2 grid：總組數、總容量、時長、訓練密度（kg/min）
- 新增肌群分布色條圖（stacked bar）+ 圖例
- 動作列表顯示所有動作（不限 3 個）+ 組數標籤

**WorkoutSummary 型別擴充（`WorkoutContext.tsx`）：**
- 新增 `totalSets: number`
- `exercises[]` 新增 `totalSets` 和 `totalVolume` 欄位
- 新增 `muscleGroups: Array<{ name, volume, color }>`

**Analytics（`src/app/analytics/page.tsx`）：**
- 新增「本週 vs 上週」對比卡片（差異以 ↑↓ 顯示）
- 新增 8 週日曆熱力圖（GitHub-style heatmap）
- 最近訓練紀錄新增訓練時長（從 endedAt - startedAt 計算）

### 新功能: 會員費用計算器
**檔案：** `src/app/membership/page.tsx`（新增）

功能：
- 輸入會員費用（NT$）、計費方式（月繳/年繳）、開始日期
- 自動計算：每次運動花費、每日平均、總花費、天數、訓練次數
- 激勵訊息：「再多去一次，每次花費就降到 $X！」
- 存取 `localStorage`（key: `workout-membership`）

入口：Dashboard 底部新增「會員」按鈕（`WorkoutDashboard.tsx`）

### 新功能: 目標反饋
**檔案：** `src/components/WorkoutDashboard.tsx`（修改）

功能：
- 每週訓練目標可自訂（2-7 天），存 `localStorage`（key: `workout-weekly-goal`）
- 進度條顯示真實的「本週訓練次數 / 目標」（以週一為起始計算）
- 達標時進度條變金色 + 顯示 🏆
- 點擊目標文字展開數字選擇器

### 新功能: 肌肉分類篩選
**檔案：** `src/components/WorkoutLogger.tsx`（修改）

功能：
- Exercise Picker Dialog 新增肌群快速篩選按鈕列（All / Chest / Back / Legs / Shoulders / Arms / Core / Full Body）
- 點擊按鈕等同填入搜尋文字
- Dialog 改為 flex column + overflow-y-auto 適應更多內容

## 相關 Commits
- `88499a3` — 主要變更（bug fixes + features）
- `60b8518` — membership page React 19 相容修復

## 注意事項
- React 19 不允許在 `useEffect` 中同步呼叫多個 `setState`（cascading renders），需用 `useState` initializer 或 `useReducer`
- `I18nProvider` 不可在 hydration 時回傳 `null`，否則整棵 tree 被卸載
- Rest timer 在手機瀏覽器必須用絕對時間戳，不能依賴 `setInterval` 的準確性
