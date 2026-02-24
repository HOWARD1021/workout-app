# 001 Google-Only Auth

## Summary
Workout App 認證模式改為 Google OAuth only，不支援 Email/Password 註冊與登入。

## Goals
- 使用者僅能透過 Google 登入。
- 未登入時可清楚看到 Google 登入入口。
- 已登入後可正常使用既有受保護功能（`/log`、`/templates`、`/analytics`）。

## Non-Goals
- 不實作 Email/Password、forgot password、reset password。
- 不在本次調整多 provider（如 Apple、GitHub）。

## User Stories
- 作為使用者，我在首頁未登入時能一鍵用 Google 登入。
- 作為已登入使用者，我能在首頁進入訓練儀表板並可登出。

## Acceptance Criteria
1. Better Auth 設定明確關閉 Email/Password。
2. 前端 auth API 只提供 Google sign-in helper。
3. 首頁未登入狀態顯示 Google 登入 CTA，已登入顯示 Dashboard。
4. 認證元件命名統一為 `GoogleSignInButton`。
5. TypeScript type check 通過。
