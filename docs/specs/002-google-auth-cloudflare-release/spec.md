# 002 Google Auth Cloudflare Release

## Summary
將目前已完成的 Google-only 認證功能整理為可提交、可部署到 Cloudflare Worker 的標準流程，避免把本機產物與敏感設定誤上傳。

## Context
- 2026-02-17 已完成本機 Google OAuth 登入驗證。
- `/api/auth/get-session` 在未登入時回傳 `200` 與 `null`。
- `/api/auth/sign-in/social` 可回傳 Google OAuth redirect URL（含 `Location` 與 `redirect: true`）。

## Goals
- 明確定義「應提交」與「禁止提交」的檔案。
- 建立可重複執行的提交步驟。
- 建立 Cloudflare Worker 上線步驟與驗收清單。

## Non-Goals
- 不在此 spec 內新增認證功能。
- 不調整 UI 設計風格。

## Scope
- Source code, docs, spec, and deployment procedure only.
- Exclude local runtime/cache/build artifacts and secrets.

## Acceptance Criteria
1. 提交內容僅包含可追蹤原始碼與文件，不包含 `.open-next/`、`.wrangler/state/`、`.dev.vars`。
2. Cloudflare 部署前可成功執行 `npm run build:cf`。
3. 部署後 production 可完成 Google OAuth 登入。
4. 部署後 `GET /api/auth/get-session` 可回傳登入狀態。
