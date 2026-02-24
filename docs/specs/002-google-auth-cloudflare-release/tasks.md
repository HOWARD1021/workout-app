# 002 Google Auth Cloudflare Release - Tasks

## A. Pre-Commit
- [ ] `git status` 確認變更
- [ ] 只 stage source/docs/spec files
- [ ] 排除 `.open-next/`, `.wrangler/state/`, `.dev.vars`
- [ ] `npx tsc --noEmit`
- [ ] `npm run build:cf`

建議指令：
```bash
git add .gitignore \
  src/lib/auth.ts src/lib/auth-client.ts src/lib/db/schema.ts \
  src/app/page.tsx src/components/AuthStatus.tsx src/components/GoogleSignInButton.tsx \
  src/env.d.ts \
  package.json LOCAL_DEV.md .env.example .dev.vars.example \
  docs/BETTER_AUTH_SPEC.md \
  docs/specs/001-google-only-auth \
  docs/specs/002-google-auth-cloudflare-release

git rm src/components/GoogleLoginButton.tsx
git status
```

## B. Commit
- [ ] `git commit -m "feat(auth): migrate to google-only login and prepare cloudflare release"`

## C. Cloudflare Worker Deploy
- [ ] 設定 secrets (`wrangler secret put ...`)
- [ ] 設定 `BETTER_AUTH_URL` 對應正式網域
- [ ] `npm run deploy:cf`

建議指令：
```bash
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put BETTER_AUTH_URL

npm run deploy:cf
```

## D. Production Verification
- [ ] `GET /api/auth/get-session` 未登入為 `null`
- [ ] Google OAuth 登入成功
- [ ] 登出後 session 清除
