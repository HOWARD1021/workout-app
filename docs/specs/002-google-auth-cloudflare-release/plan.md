# 002 Google Auth Cloudflare Release - Plan

## File Classification
### Commit (Required)
- `src/lib/auth.ts`
- `src/lib/auth-client.ts`
- `src/lib/db/schema.ts`
- `src/app/page.tsx`
- `src/components/AuthStatus.tsx`
- `src/components/GoogleSignInButton.tsx`
- `src/env.d.ts`
- `src/components/GoogleLoginButton.tsx` (delete)
- `package.json`
- `LOCAL_DEV.md`
- `docs/BETTER_AUTH_SPEC.md`
- `docs/specs/001-google-only-auth/*`
- `docs/specs/002-google-auth-cloudflare-release/*`
- `.dev.vars.example`
- `.env.example`

### Do Not Commit
- `.dev.vars` (secrets)
- `.open-next/**` (build output)
- `.wrangler/state/**` (local D1 data)
- `.wrangler/tmp/**` (tmp files)

## Commit Strategy
1. Stage only required files.
2. Re-check staged diff.
3. Commit with focused message.

Suggested commit message:
- `feat(auth): migrate to google-only login and prepare cloudflare release`

## Release Strategy (Cloudflare Worker)
1. 確認 Cloudflare runtime secrets 已設定：
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
2. 確認 Google OAuth production callback：
   - `https://<your-domain>/api/auth/callback/google`
3. Build and deploy:
   - `npm run build:cf`
   - `npm run deploy:cf`
4. Post-deploy verification:
   - `GET https://<your-domain>/api/auth/get-session`
   - Browser login flow (Google consent -> callback -> logged-in session)

## Risks
- `BETTER_AUTH_URL` 與實際網域不一致會導致 callback 失敗。
- OAuth client 未加入 production redirect URI 會導致 Google 回調錯誤。
- 誤提交 `.dev.vars` 會造成密鑰外洩。
