# 06 — 成長曲線 (Growth Curve) 與 Progress Summary

**What to build:** 在週進度卡片下方呈現兩個核心元素：

1. **Progress Summary**（事實型摘要）：一段簡潔文字，描述本週完成狀態與從 baseline 至今的變化。例如：「本週胸已完成 1/2 次。臥推 Estimated 1RM 從 85kg 提升至 92kg（+8.2%，共 6 週）。」不使用鼓勵性或模糊文案。

2. **Growth Curve**（成長曲線）：SVG 折線圖，呈現 8 週 Goal Window 內的每週進度。

曲線規格：
- **主要資料線**：一次只顯示一個指標。Strength Goal 用每週最高 Estimated 1RM；Frequency Goal 用每週完成次數；Volume Goal 用每週總量
- **Goal Baseline**：水平虛線，標示目標起始值
- **Goal Target Line**：水平虛線，標示目標終點值
- **不畫線性預測線**（避免讓正常的非線性進步看起來像失敗）
- **Strength Goal 缺席週**：資料點之間斷開（gap），不連線也不歸零
- **Frequency/Volume Goal 缺席週**：顯示為 0
- **預設範圍**：active 8 週 Goal Window
- **動作切換器**：Strength Goal 可切換不同動作（但同時只顯示一條線）

互動功能：
- **點擊資料點**：展開 Traceable Growth Evidence，顯示日期、實際重量、實際次數、組數、該週總量
- **Estimated 1RM 標示**：必須標註為推算值，旁邊顯示實際的 weight × reps

數據來源：ticket 04 的 `getGrowthCurvePoints`。

**Blocked by:** 04 — 核心計算與聚合邏輯層

**Status:** ready-for-agent

- [ ] Progress Summary 顯示在曲線上方，使用事實型文案（不用鼓勵語）
- [ ] Summary 包含本週完成狀態與從 baseline 的變化量
- [ ] SVG 折線圖正確繪製 8 週 Goal Window 資料
- [ ] Goal Baseline 與 Goal Target Line 以水平虛線呈現
- [ ] 不繪製線性預測線
- [ ] Strength Goal 缺席週呈現為 gap（斷線）
- [ ] Frequency/Volume Goal 缺席週呈現為 0
- [ ] Strength Goal 可透過動作切換器切換動作
- [ ] 同時只顯示一條主要資料線
- [ ] 點擊資料點展開 Traceable Growth Evidence（日期、重量、次數、組數、總量）
- [ ] Estimated 1RM 標註為推算值，附帶實際 weight × reps
- [ ] 數據來源為 ticket 04 聚合層
- [ ] 元件測試覆蓋：有資料、有 gap、無目標、點擊展開
- [ ] `npm run typecheck` 與 `npm run test` 通過
