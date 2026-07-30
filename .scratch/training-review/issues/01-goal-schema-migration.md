# 01 — Goal Schema 與資料庫遷移

**What to build:** 新增訓練目標所需的資料庫表結構。使用者建立目標後，系統需要持久化目標類型、選定動作、Baseline、Target、Goal Window、狀態與時間戳。每週目標集合需要獨立追蹤預期與實際進度。目標調整事件需要記錄每次 target/window 變更，保留歷史證據不被覆寫。

需要三張新表：

- `training_goals`：儲存目標類型（strength/frequency/volume）、綁定的 exercise_id（strength 專用）、goal_baseline、goal_target、window_start、window_end（預設 8 週）、status（active/ended/archived）、user_id、timestamps。
- `weekly_goal_sets`：儲存每週的預期與接受狀態。關聯到 training_goal，包含 week_start、muscle_group、expected_sessions、status（suggested/accepted/adjusted）、timestamps。
- `goal_adjustment_events`：記錄目標的 target 或 window 變更事件。關聯到 training_goal，包含 event_type（target_change/window_change/replacement）、previous_value、new_value、timestamps。

Schema 定義在 `src/lib/db/schema.ts`，migration 放在 `drizzle/` 下。所有新表的 TypeScript types 必須匯出。

**Blocked by:** None — can start immediately

**Status:** ready-for-agent

- [ ] `training_goals` 表在 schema.ts 中定義，包含 id、userId、goalType、exerciseId（nullable）、goalBaseline、goalTarget、windowStart、windowEnd、status、createdAt、updatedAt、endedAt
- [ ] `weekly_goal_sets` 表在 schema.ts 中定義，包含 id、goalId（FK）、weekStart、muscleGroup、expectedSessions、status、createdAt、updatedAt
- [ ] `goal_adjustment_events` 表在 schema.ts 中定義，包含 id、goalId（FK）、eventType、previousValue、newValue、createdAt
- [ ] userId 加上 FK reference 到 user 表，exerciseId 加上 FK reference 到 exercises 表
- [ ] 所有新表的 Select/Insert types 匯出
- [ ] Drizzle migration 產生並可成功執行
- [ ] 現有 schema 與 migration 未被修改（純新增）
- [ ] `npm run typecheck` 通過
