# 001 Google-Only Auth - Result

## Completed
- 已完成 Google-only 認證程式碼改造。
- 已將首頁改為登入閘道，未登入狀態只提供 Google 登入。
- 已補齊 Cloudflare env 型別，`tsc` 可通過。

## Verification Output
- Type check: pass (`npx tsc --noEmit`)
- Lint (changed files): pass with 1 existing warning in `src/components/UserMenu.tsx` (`@next/next/no-img-element`)

## Follow-up
- 實機測試 Google OAuth callback（local + production）。
- 視需求將 `UserMenu` 的 `<img>` 改為 `next/image`。
