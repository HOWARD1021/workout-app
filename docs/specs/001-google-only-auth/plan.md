# 001 Google-Only Auth - Plan

## Technical Design
- Server:
  - 在 `src/lib/auth.ts` 使用 `emailAndPassword.enabled = false`。
  - 保留 `socialProviders.google` 作為唯一登入來源。
- Client:
  - 在 `src/lib/auth-client.ts` 封裝 `signInWithGoogle(callbackURL)`。
  - 移除元件直接呼叫 generic `signIn` 的方式。
- UI:
  - 將按鈕元件統一為 `src/components/GoogleSignInButton.tsx`。
  - `src/app/page.tsx` 作為登入閘道：未登入顯示 CTA，登入後顯示 `WorkoutDashboard`。
- Types:
  - 在 `src/env.d.ts` 補齊 `BETTER_AUTH_*`、`GOOGLE_*` env 型別。

## Risks
- 若 Google OAuth callback URL 與 `BETTER_AUTH_URL` 不一致會造成登入失敗。
- 若本機 `.dev.vars` 缺少 Google credentials，登入流程無法完成。

## Validation
- `npx tsc --noEmit`
- 針對改動檔案執行 `npx eslint <files>`
