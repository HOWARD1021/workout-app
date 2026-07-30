# 08 — /analytics 頁面重構與現有卡片順序調整

**What to build:** 將 `/analytics` 頁面從現有的 analytics dashboard 重構為 Training Review 層級結構。整合 ticket 05/06/07 的元件，並將現有卡片降級到頁面下方。

頁面結構（由上到下）：
1. Header：標題改為「訓練回顧」（取代「數據分析」）
2. **週進度卡片**（ticket 05）
3. **Progress Summary**（ticket 06）
4. **Growth Curve**（ticket 06）
5. **Goal-Focused Timeline**（ticket 07）
6. **Supporting Metric Cards**（ticket 07）
7. —— 降級分隔線 ——
8. Monthly Recap（現有，保留）
9. Calendar Heatmap（現有，保留）
10. Muscle Group Volume（現有，保留）
11. Weekly Frequency（現有，保留）
12. Exercise Trend Lines（現有，保留）
13. Personal Records（現有，保留）
14. Recent Workouts（現有，保留）

規則：
- 路由保持 `/analytics` 不變，不新增 `/training-review`
- 現有卡片保留功能，只改變順序與視覺權重
- 頁面 header 的 i18n key 更新為 Training Review 相關文案
- 現有的 `analyticsApi` 呼叫保持不變（不破壞已有數據來源）
- Mobile-first layout，第一屏要能看到週進度

**Blocked by:** 05 — 週進度卡片 UI, 06 — Growth Curve 與 Progress Summary, 07 — Timeline 與 Supporting Metrics

**Status:** ready-for-agent

- [ ] `/analytics` 頁面標題改為「訓練回顧」
- [ ] 頁面結構按照上述順序排列
- [ ] 新元件（週進度、摘要、曲線、歷程、指標卡）整合到頁面中
- [ ] 現有卡片（monthly recap、heatmap、muscle groups、frequency、trends、PRs、recent workouts）保留在降級區域
- [ ] 現有的 analyticsApi 呼叫不被修改
- [ ] 路由保持 `/analytics`
- [ ] i18n keys 更新（header、可能的 section labels）
- [ ] Mobile viewport 第一屏可見週進度卡片
- [ ] 現有 analytics 測試不被破壞（regression）
- [ ] `npm run typecheck`、`npm run test`、`npm run build` 通過
