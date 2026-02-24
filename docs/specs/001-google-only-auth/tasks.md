# 001 Google-Only Auth - Tasks

## Implementation
- [x] 關閉 Email/Password auth (`src/lib/auth.ts`)
- [x] 封裝 `signInWithGoogle` (`src/lib/auth-client.ts`)
- [x] `GoogleLoginButton` 更名為 `GoogleSignInButton`
- [x] 更新 `AuthStatus` 使用新元件
- [x] 更新首頁未登入/已登入分流 UI (`src/app/page.tsx`)
- [x] 補齊 Cloudflare env 型別 (`src/env.d.ts`)

## Verification
- [x] `npx tsc --noEmit`
- [x] `npx eslint`（改動檔案）
- [ ] 手動驗證 Google OAuth 本機登入
- [ ] 手動驗證正式環境 callback
