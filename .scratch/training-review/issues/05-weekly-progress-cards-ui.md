# 05 — 第一屏「預期／已完成」週進度卡片 UI

**What to build:** `/analytics` 頁面最頂端顯示本週每個計畫肌群的「已完成 / 預期」進度卡片，例如「胸 1/2 次」、「背 2/2 次」、「腿 0/1 次」。這是 Training Review 的第一印象——使用者打開頁面立刻知道本週進度。

卡片規則：
- 每個 accepted weekly goal 中的肌群各一張卡片
- 第一層只顯示 session count（「1/2 次」），不顯示動作清單、組數或重量
- 所有計畫中的肌群都必須顯示（不只顯示有進度的）
- 使用 ticket 04 的 `getWeeklySessionCounts` 取得數據

空狀態處理：
- **無 active goal**：顯示目標建立入口（明確的 CTA，引導建立第一個目標）
- **無訓練歷史**：顯示新手導引（不是空白圖表），引導第一次訓練
- **有 active goal 但本週還沒訓練**：所有肌群顯示 0/N，不隱藏

現有統計數據網格（總次數、總重量、總組數）從頂部下移到頁面更低的位置。

UI 使用繁體中文標籤。風格遵循現有的淺色 mobile-first 設計。

**Blocked by:** 04 — 核心計算與聚合邏輯層

**Status:** ready-for-agent

- [ ] 週進度卡片顯示在 `/analytics` 頁面最頂端（header 下方）
- [ ] 每個 accepted weekly goal 的肌群各一張卡片，顯示「胸 1/2 次」格式
- [ ] 第一層不顯示動作名稱、組數或重量
- [ ] 所有計畫肌群都顯示（包括尚無進度的）
- [ ] 數據來自 ticket 04 的聚合層
- [ ] 無 active goal 時顯示「建立訓練目標」入口
- [ ] 無訓練歷史時顯示新手導引
- [ ] 現有統計數據網格（totalWorkouts / totalVolume / totalSets）下移
- [ ] 繁體中文標籤
- [ ] 元件測試覆蓋：有目標+有進度、有目標+無進度、無目標、無歷史
- [ ] `npm run typecheck` 與 `npm run test` 通過
