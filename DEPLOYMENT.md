# Workout App 部署指南

## 架構
- **Frontend**: Next.js 15 + OpenNext (Cloudflare 適配)
- **Backend**: Cloudflare Workers + D1 Database
- **Hosting**: Cloudflare Pages

## 部署方式

### 方式一：手動部署（推薦）
```bash
# 1. 建置 OpenNext
npm run build:cf

# 2. 部署到 Cloudflare Pages
npx wrangler pages deploy .open-next --project-name=workout-app
```

### 方式二：GitHub 自動部署
需要在 Cloudflare Pages Dashboard 設定：
- **Build command**: `npm run build:cf`
- **Build output directory**: `.open-next`
- **Production branch**: `main`

⚠️ 注意：如果專案原本是用直接上傳方式建立，連結 GitHub 後需要手動設定 build 配置。

## 重要檔案
- `wrangler.toml` - Cloudflare 配置，包含 `pages_build_output_dir`
- `open-next.config.ts` - OpenNext 配置
- `.open-next/` - 建置輸出目錄（不要 commit）

## 資料庫

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
A: 檢查 Cloudflare Pages Dashboard 的 Build settings，確保 build command 和 output directory 正確設定。

### Q: 本地沒有模板資料？
A: 執行 `wrangler d1 execute workout-db --local --file=./drizzle/0002_seed_templates.sql`

### Q: Exercise ID 不匹配導致外鍵錯誤？
A: 本地和遠端的 seed 可能產生不同的 ID。需要先查詢實際的 exercise ID 再手動插入 templates。
