# 003 User Data Isolation

## Summary
確保每個使用者只能看到自己的訓練資料，實現資料隔離。

## Problem
目前所有使用者共用同一份資料，不同 Google 帳號登入後看到相同的 workouts 和 templates。

## Goals
- 每個使用者只能查看、建立、修改自己的 workouts
- 每個使用者只能查看、建立、修改自己的 templates
- API 根據登入的 user_id 過濾資料

## Non-Goals
- 不處理共享 templates 功能
- 不處理團隊/群組功能

## Database Changes

### 1. workouts 表加入 user_id
```sql
ALTER TABLE workouts ADD COLUMN user_id TEXT REFERENCES user(id);
```

### 2. workout_templates 表加入 user_id
```sql
ALTER TABLE workout_templates ADD COLUMN user_id TEXT REFERENCES user(id);
```

## API Changes

### GET /api/workouts
- 需驗證登入狀態
- 只返回 `user_id = currentUser.id` 的資料

### POST /api/workouts
- 需驗證登入狀態
- 自動帶入 `user_id = currentUser.id`

### GET /api/templates
- 需驗證登入狀態
- 只返回 `user_id = currentUser.id` 的資料

### POST /api/templates
- 需驗證登入狀態
- 自動帶入 `user_id = currentUser.id`

## Implementation Steps

1. [ ] 在遠端 D1 執行 ALTER TABLE 加入 user_id 欄位
2. [ ] 更新 Drizzle schema 加入 user_id
3. [ ] 建立 auth helper 函數取得當前 user
4. [ ] 修改 /api/workouts 加入 user_id 過濾和寫入
5. [ ] 修改 /api/templates 加入 user_id 過濾和寫入
6. [ ] 測試不同帳號資料隔離

## Acceptance Criteria
1. 用戶 A 建立的 workout 只有用戶 A 看得到
2. 用戶 B 建立的 workout 只有用戶 B 看得到
3. 未登入時 API 返回 401
