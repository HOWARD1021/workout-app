# 09 — 目標生命週期管理 (Archive / Adjust / Replace)

**What to build:** 完整的目標生命週期，讓使用者可以完成、調整、替換目標，同時保留所有歷史證據。

三個生命週期事件：

1. **Archived Goal**（目標歸檔）：
   - 使用者標記目標為完成或結束時，status 轉為 archived
   - 歸檔後的目標仍可查看完整紀錄（baseline、target、window、所有週目標、所有調整事件）
   - 不自動重設——使用者必須明確建立下一個目標
   - 歷史證據（growth curve points、weekly sets）保持穩定不變

2. **Goal Adjustment Event**（目標調整）：
   - 使用者修改 active goal 的 target 或 window 時，建立 `goal_adjustment_events` 記錄
   - 記錄 event_type（target_change / window_change）、previous_value、new_value
   - 調整改變未來的比較基準，但不覆寫已有的 baseline 或歷史證據
   - Growth Curve 上可看到調整事件標記

3. **Goal Replacement**（目標替換）：
   - 當使用者變更 Strength Goal 綁定的動作時，當前目標結束（archived），新目標建立
   - 不相容的動作曲線不會被拼接在一起
   - 舊目標保留完整歷史

額外：
- 完成目標後可建立下一個目標（新的 baseline 從當前狀態計算）
- 刪除 workout 時，所有相關的 goal 計算自動排除該 workout

**Blocked by:** 02 — 訓練目標 CRUD API, 03 — 每週目標集合 API

**Status:** ready-for-agent

- [ ] `PATCH /api/goals/[goalId]` 更新 status 為 archived，保留所有歷史數據
- [ ] Archived goal 可透過 `GET /api/goals` 查看（含 baseline、target、window、週目標、調整事件）
- [ ] 更新 target 時建立 goal_adjustment_event（type: target_change）
- [ ] 更新 windowEnd 時建立 goal_adjustment_event（type: window_change）
- [ ] Adjustment event 不覆寫已有 baseline
- [ ] 變更 Strength Goal 的 exerciseId 時：舊目標 archived、新目標建立（type: replacement）
- [ ] 不相容動作曲線不拼接
- [ ] 完成目標後可建立新目標，baseline 從當前狀態重新計算
- [ ] 已刪除 workout 從所有 goal 計算中排除
- [ ] API 測試覆蓋 archive、adjustment、replacement 三個流程
- [ ] `npm run typecheck` 與 `npm run test` 通過
