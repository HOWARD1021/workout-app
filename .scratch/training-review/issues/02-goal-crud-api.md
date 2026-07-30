# 02 — 訓練目標 CRUD API

**What to build:** 使用者可以建立、讀取、更新訓練目標。建立時系統根據近期完整訓練紀錄自動計算 Goal Baseline（例如力量目標取最近 4 週同一動作的最高 Estimated 1RM）。只有目標擁有者可以讀取和修改自己的目標。

API 端點：
- `POST /api/goals` — 建立目標，回傳含自動計算 baseline 的完整目標物件
- `GET /api/goals` — 列出當前使用者的 active + archived 目標
- `GET /api/goals/[goalId]` — 讀取單一目標詳情
- `PATCH /api/goals/[goalId]` — 更新 target、window、status

計算邏輯：
- Strength Goal 的 Baseline 從近期同動作的 qualifying sets 計算 Estimated 1RM（Epley 公式：weight × (1 + reps / 30)）
- Frequency Goal 的 Baseline 從近 4 週平均每週訓練次數計算
- Volume Goal 的 Baseline 從近 4 週平均每週總量計算
- Qualifying Set 定義：weight > 0 且 reps > 0，來自未刪除的已完成 workout

遵循現有 API 慣例：Cloudflare context、`getCurrentUser` auth、snake_case API / camelCase schema。

**Blocked by:** 01 — Goal Schema 與資料庫遷移

**Status:** ready-for-agent

- [ ] `POST /api/goals` 建立 strength/frequency/volume 三種目標，回傳含 baseline 的完整物件
- [ ] `GET /api/goals` 列出當前使用者的所有目標（active + archived）
- [ ] `GET /api/goals/[goalId]` 回傳單一目標，非擁有者返回 403
- [ ] `PATCH /api/goals/[goalId]` 可更新 target、windowEnd、status
- [ ] Strength Goal baseline 使用 Epley 公式從 qualifying sets 計算
- [ ] Frequency/Volume baseline 從近 4 週歷史計算
- [ ] Qualifying Set 過濾：weight > 0、reps > 0、workout 未刪除且已完成
- [ ] 未登入返回 401，操作他人目標返回 403
- [ ] `api.ts` 新增 `goalsApi` client 方法與對應 TypeScript types
- [ ] API route 測試覆蓋 baseline 計算、ownership 驗證、qualifying set 過濾
- [ ] `npm run typecheck` 與 `npm run test` 通過
