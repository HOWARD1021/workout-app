# Deploy 指南

## 帳號資訊
- **Cloudflare Account**: Ms04626730@gmail.com
- **Account ID**: `63198f63d50664023e78af2d617cea07`
- **D1 Database**: `workout-db` (`94c0f610-8616-4105-9d25-93ffcdb13d3c`)
- **Worker Name**: `workout-app`
- **Production URL**: https://workout-app.ms04626730.workers.dev

## 重要：環境變數衝突
系統有設定 `CLOUDFLARE_API_TOKEN`，指向舊帳號 (`Howpetsprotectors@gmail.com`)。
**每次 deploy 前必須先 unset 並指定正確 Account ID**：

```bash
unset CLOUDFLARE_API_TOKEN
export CLOUDFLARE_ACCOUNT_ID=63198f63d50664023e78af2d617cea07
```

或在每個指令前加：
```bash
unset CLOUDFLARE_API_TOKEN && CLOUDFLARE_ACCOUNT_ID=63198f63d50664023e78af2d617cea07 npx wrangler deploy
```

## 登入方式
如果 OAuth token 過期，重新登入：
```bash
unset CLOUDFLARE_API_TOKEN
npx wrangler login
```
瀏覽器會打開 Cloudflare OAuth 頁面，用 `ms04626730@gmail.com` 登入。

## 部署步驟

### 1. Build + Deploy App
```bash
# 先 build OpenNext for Cloudflare
npm run build:cf

# Deploy to Workers
unset CLOUDFLARE_API_TOKEN && CLOUDFLARE_ACCOUNT_ID=63198f63d50664023e78af2d617cea07 npx wrangler deploy
```

### 2. 執行 DB Migration（如有新 SQL）
```bash
unset CLOUDFLARE_API_TOKEN && CLOUDFLARE_ACCOUNT_ID=63198f63d50664023e78af2d617cea07 \
  npx wrangler d1 execute workout-db --remote --file=./drizzle/<migration_file>.sql
```

### 3. 完整一鍵部署（含 build）
```bash
unset CLOUDFLARE_API_TOKEN && CLOUDFLARE_ACCOUNT_ID=63198f63d50664023e78af2d617cea07 \
  bash -c 'npm run build:cf && npx wrangler deploy'
```

## 常用指令

### 查看 D1 資料庫列表
```bash
unset CLOUDFLARE_API_TOKEN && CLOUDFLARE_ACCOUNT_ID=63198f63d50664023e78af2d617cea07 npx wrangler d1 list
```

### 查詢 Remote DB
```bash
unset CLOUDFLARE_API_TOKEN && CLOUDFLARE_ACCOUNT_ID=63198f63d50664023e78af2d617cea07 \
  npx wrangler d1 execute workout-db --remote --command="SELECT count(*) FROM exercises"
```

### 本地開發
```bash
npm run local
# 這會 build + 用 wrangler 在 port 8788 跑 local 版本（含 local D1）
```

### 本地 DB 重置
```bash
npm run db:local:setup
```

## 已部署的 SQL Migrations
依序：
1. `drizzle/migrations/0000_nosy_giant_girl.sql`
2. `drizzle/migrations/0001_supreme_the_renegades.sql`
3. `drizzle/seed.sql`
4. `drizzle/0002_seed_templates.sql`
5. `drizzle/0003_more_templates.sql`
6. `drizzle/0004_achievements.sql`
7. `drizzle/0005_friends.sql`
8. `drizzle/0006_more_exercises.sql` ← 2026-03-28 新增

## 故障排除

### "Authentication error [code: 10000]"
原因：`CLOUDFLARE_API_TOKEN` 指向錯誤帳號。
解法：`unset CLOUDFLARE_API_TOKEN`，確保 `CLOUDFLARE_ACCOUNT_ID` 設為 `63198f63d50664023e78af2d617cea07`。

### "D1 binding references database which was not found"
原因：wrangler.toml 的 database_id 和 account 不匹配。
解法：確認用正確的 Account ID deploy。

### Build 成功但 deploy 失敗 (Pages Authentication error)
原因：`npm run deploy` 用的是 Pages deploy，Token 可能沒有 Pages 權限。
解法：改用 `npx wrangler deploy`（Workers deploy），不走 Pages。

### React 19 "setState synchronously within an effect"
原因：React 19 strict mode 不允許在 useEffect 中同步呼叫多個 setState。
解法：用 `useState(() => initialValue)` 初始化，或用 `useReducer`。
