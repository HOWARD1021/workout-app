# 10 — 成長曲線上的 Progress Milestone 標註

**What to build:** 在 Growth Curve 上標註少數有意義的事件，幫助使用者一眼找到重要的進步節點。Milestone 是資料點上的註解標記，不是獨立的徽章牆。

Milestone 類型（全部）：
1. **新 PR**：該資料點的 Estimated 1RM 超過歷史最高
2. **每週目標完成**：該週的 accepted weekly goal 全部達成
3. **目標達成**：資料點達到或超過 Goal Target
4. **目標調整**：在調整事件發生的那週標記（來自 ticket 09 的 goal_adjustment_events）

視覺規格：
- Milestone 以小型圖示或標記附加在對應的資料點上
- 保持稀疏——一個資料點最多顯示一個 milestone（優先級：目標達成 > 新 PR > 每週目標完成 > 目標調整）
- 不取代資料點本身
- 點擊 milestone 時的行為與點擊資料點相同（展開 Traceable Growth Evidence）

數據計算：
- 新 PR 判斷：比較該資料點的 Estimated 1RM 與所有歷史週的最高值
- 每週目標完成判斷：使用 ticket 04 的 `getWeeklySessionCounts` 比對 accepted weekly goal
- 目標達成判斷：比較資料點值與 goal target
- 目標調整判斷：查詢 `goal_adjustment_events` 表

**Blocked by:** 06 — Growth Curve 與 Progress Summary, 09 — 目標生命週期管理

**Status:** ready-for-agent

- [ ] Growth Curve 上可見 milestone 標記
- [ ] 支援四種 milestone 類型：新 PR、每週目標完成、目標達成、目標調整
- [ ] 每個資料點最多一個 milestone（按優先級選擇）
- [ ] Milestone 保持稀疏，不變成每個點都有標記
- [ ] 點擊 milestone 展開與資料點相同的 Traceable Growth Evidence
- [ ] 新 PR 正確比較歷史最高 Estimated 1RM
- [ ] 每週目標完成正確比對 accepted weekly goal
- [ ] 目標達成正確比對 goal target
- [ ] 目標調整從 goal_adjustment_events 讀取
- [ ] 元件測試覆蓋：有 milestone、無 milestone、多種 milestone 競爭同一點
- [ ] `npm run typecheck` 與 `npm run test` 通過
