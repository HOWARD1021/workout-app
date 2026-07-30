# Workout App 部署指南

## 架構
- **Frontend**: Next.js 15 + OpenNext (Cloudflare 適配)
- **Backend**: Cloudflare Workers + D1 Database
- **Hosting**: Cloudflare Workers（Worker 會透過 ASSETS binding 提供前端資產）

## 部署方式

### 手動部署（推薦）
```bash
# 建置並部署 OpenNext Worker
npm run deploy:cf
```

⚠️ 注意：不要使用 `wrangler pages deploy .open-next` 部署這個專案。`.open-next` 是
Cloudflare Worker bundle，不是 Pages 靜態網站輸出；Pages 上傳會讓 `/api/*` 路由失效。
若要設定 GitHub 自動部署，請讓 CI 執行 `npm run deploy:cf`，並使用具備 Workers 與 D1
權限的 Cloudflare token。

## 重要檔案
- `wrangler.toml` - Cloudflare Worker 與 D1 配置
- `open-next.config.ts` - OpenNext 配置
- `.open-next/` - 建置輸出目錄（不要 commit）

## 資料庫

新增功能的 D1 migration 需在 Worker 部署前套用：

```bash
npx wrangler d1 execute workout-db --remote --file=./drizzle/0010_workout_save_events.sql
npx wrangler d1 execute workout-db --remote --file=./drizzle/0011_training_review_goals.sql
```

正式環境請設定 `WORKOUT_APP_VERSION`（建議使用 commit SHA）與
`WORKOUT_MAINTAINER_USER_IDS`（逗號分隔的 Better Auth user ID 或 email），
以啟用版本追蹤與維護者診斷查詢。

診斷資料保留 30 天；可由受控的部署/維運排程執行：

```bash
npm run db:purge-save-events
```

### 本地開發
```bash
# 初始化本地 D1
npm run db:local:setup

# 如果需要 seed templates
wrangler d1 execute workout-db --local --file=./drizzle/0002_seed_templates.sql
```

### 遠端資料庫
```bash
# 執行 migration
wrangler d1 migrations apply workout-db --remote

# 執行 seed
wrangler d1 execute workout-db --remote --file=./drizzle/seed.sql
```

## 常見問題

### Q: 推送到 GitHub 後沒有自動部署？
A: 這個專案目前不是 Pages Git build；請在 CI 執行 `npm run deploy:cf`，並確認 Cloudflare
token 同時具備 Workers 部署與 D1 執行權限。

### Q: 本地沒有模板資料？
A: 執行 `wrangler d1 execute workout-db --local --file=./drizzle/0002_seed_templates.sql`

### Q: Exercise ID 不匹配導致外鍵錯誤？
A: 本地和遠端的 seed 可能產生不同的 ID。需要先查詢實際的 exercise ID 再手動插入 templates。
