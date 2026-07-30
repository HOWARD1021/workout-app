# 03 — 每週目標集合（Weekly Goal Set）API

**What to build:** 系統根據 active goal、近期訓練模式、可用訓練結構，為使用者生成 Suggested Weekly Goal Set。使用者可以檢視建議、接受或調整後轉為 Accepted Weekly Goal。一個週目標集合可包含多個肌群（例如胸 2 次、背 2 次、腿 1 次），每個肌群以 session count 為第一層單位。

API 端點：
- `GET /api/goals/[goalId]/weekly-sets` — 列出該目標的所有週目標集合
- `GET /api/goals/[goalId]/weekly-sets/current` — 取得本週的建議或已接受目標集合；若無已接受目標，系統自動生成建議
- `POST /api/goals/[goalId]/weekly-sets` — 接受或調整建議後建立 Accepted Weekly Goal
- `PATCH /api/goals/[goalId]/weekly-sets/[setId]` — 修改已接受的週目標

建議邏輯：
- 從 active goal 的類型與 target 推導合理的每週分配
- 從近 4 週實際訓練模式（哪幾天練什麼肌群）推導肌群分佈
- Suggestion 在被接受前不計入追蹤
- Accepted 狀態的週目標才會與實際表現比較

**Blocked by:** 01 — Goal Schema 與資料庫遷移, 02 — 訓練目標 CRUD API

**Status:** ready-for-agent

- [ ] `GET /api/goals/[goalId]/weekly-sets/current` 無已接受目標時自動生成建議
- [ ] 建議包含多肌群（例如胸/背/腿各自的預期 session count）
- [ ] `POST /api/goals/[goalId]/weekly-sets` 接受建議，status 轉為 accepted
- [ ] 使用者可在接受時調整 expected_sessions 數值
- [ ] Suggested 狀態的目標不計入完成追蹤
- [ ] `PATCH` 可修改已接受目標的 expected_sessions
- [ ] 非目標擁有者的請求返回 403
- [ ] `api.ts` 新增 `weeklyGoalSetsApi` client 方法與 types
- [ ] 測試覆蓋建議生成、接受流程、權限驗證
- [ ] `npm run typecheck` 與 `npm run test` 通過
