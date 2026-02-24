# Workout App 本地開發指南

## 快速啟動
```bash
npm run local
```
這會自動執行 build + 啟動本地伺服器，開啟 http://localhost:8788

## 架構說明

### 開發模式比較
| 指令 | 用途 | 資料庫 |
|------|------|--------|
| `npm run dev` | Next.js 原生開發 | ❌ 無法連接 D1 |
| `npm run local` | Cloudflare 本地開發 | ✅ 本地 D1 |
| `npm run preview:cf` | 僅啟動伺服器（需先 build） | ✅ 本地 D1 |

### 資料庫位置
- **本地 D1**: `.wrangler/state/v3/d1/`
- **遠端 D1**: Cloudflare Dashboard

## 本地資料庫操作

### 初始化本地資料庫（首次設定）
```bash
# 1. 建立 app schema
wrangler d1 execute workout-db --local --file=./drizzle/migrations/0000_nosy_giant_girl.sql

# 2. 建立 Better Auth schema
wrangler d1 execute workout-db --local --file=./drizzle/migrations/0001_supreme_the_renegades.sql

# 3. Seed exercises（固定 ID）
wrangler d1 execute workout-db --local --file=./drizzle/seed.sql

# 4. Seed templates
wrangler d1 execute workout-db --local --file=./drizzle/0002_seed_templates.sql
```

或直接執行：
```bash
npm run db:local:setup
```

### Google OAuth 本機環境變數
請建立 `.dev.vars`（可由 `.dev.vars.example` 複製）並填入：
```env
NEXTJS_ENV=local
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:8788
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Google Cloud Console 的 Authorized redirect URI 請加入：
- `http://localhost:8788/api/auth/callback/google`

### 重置本地資料庫
```bash
rm -rf .wrangler/state
# 然後執行上面的初始化步驟
```

### 同步遠端資料到本地
```bash
# 查看遠端資料
wrangler d1 execute workout-db --remote --command="SELECT * FROM workouts"
wrangler d1 execute workout-db --remote --command="SELECT * FROM workout_logs"

# 手動將資料插入本地（參考 drizzle/sync_remote_data.sql）
```

## 常見問題

### Q: Port 8788 被佔用？
```bash
# 找出佔用的程序
lsof -i :8788

# 殺掉程序
kill <PID>
```

### Q: 本地沒有資料？
本地 D1 和遠端 D1 是獨立的。需要手動同步或重新 seed。

### Q: `npm run dev` 看不到資料？
`npm run dev` 無法連接 D1，請改用 `npm run local`。

## 部署
```bash
# 部署到 Cloudflare Pages
npm run deploy
```
