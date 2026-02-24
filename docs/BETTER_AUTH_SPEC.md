# Better Auth 會員系統實作規格

## 概述
在 Workout App 整合 Better Auth 實現使用者認證功能，只支援 Google OAuth 登入。

## 技術選型
- **Auth Library**: [Better Auth](https://better-auth.com/)
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM

## 資料庫變更

### 新增資料表

#### 1. users (使用者)
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_verified INTEGER DEFAULT 0,
  name TEXT,
  image TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

#### 2. sessions (登入 Session)
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

#### 3. accounts (OAuth 帳號連結)
```sql
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  access_token_expires_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(provider, provider_account_id)
);
```

### 修改現有資料表

需要在以下資料表加入 `user_id` 欄位：
- `workouts` - 記錄屬於哪個使用者
- `workout_templates` - 模板屬於哪個使用者 (可選，也可以是公開)
- `exercises` - 自訂動作屬於哪個使用者

```sql
-- 為現有資料表加入 user_id
ALTER TABLE workouts ADD COLUMN user_id TEXT REFERENCES users(id);
ALTER TABLE workout_templates ADD COLUMN user_id TEXT REFERENCES users(id);
ALTER TABLE exercises ADD COLUMN user_id TEXT REFERENCES users(id);
```

## 檔案結構

```
src/
├── lib/
│   ├── auth.ts                    # Better Auth 設定
│   └── auth-client.ts             # 客戶端 auth hooks
├── app/
│   └── api/
│       └── auth/
│           └── [...all]/
│               └── route.ts       # Auth API routes
├── components/
│   ├── AuthButton.tsx             # 登入/登出按鈕
│   ├── GoogleSignInButton.tsx     # Google 登入按鈕
│   └── UserMenu.tsx               # 使用者選單
└── middleware.ts                   # 路由保護
```

## API Routes

### Better Auth 處理的路由
- `POST /api/auth/sign-in/social` - OAuth 登入
- `POST /api/auth/sign-out` - 登出
- `GET /api/auth/session` - 取得 session

## 認證流程

### OAuth 登入 (Google)
1. 使用者點擊 "使用 Google 登入"
2. 重導向至 Google OAuth consent
3. Google callback 回到 `/api/auth/callback/google`
4. Better Auth 建立/連結使用者帳號
5. 建立 session 並重導向回應用

## 元件規格

### AuthButton
```tsx
// 顯示登入或使用者頭像
interface AuthButtonProps {
  variant?: "default" | "minimal";
}
```

### GoogleSignInButton
```tsx
// Google OAuth 登入按鈕
interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  redirectTo?: string;
}
```

### UserMenu
```tsx
// 下拉選單顯示使用者資訊和登出
interface UserMenuProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
}
```

## Middleware 保護

需要登入才能訪問的路由：
- `/log` - 記錄訓練
- `/templates` - 模板管理
- `/analytics` - 統計資料

公開路由：
- `/` - 首頁 (可顯示 demo 模式)
- `/exercises` - 動作庫

## 環境變數

```env
# .dev.vars (Cloudflare)
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# OAuth (Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Google OAuth 必要設定

### 1. Google Cloud Console
1. 建立 OAuth 2.0 Client (Web application)
2. Authorized JavaScript origins 加入：
   - `http://localhost:3000` (本機)
   - `https://<your-production-domain>` (正式環境)
3. Authorized redirect URIs 加入：
   - `http://localhost:3000/api/auth/callback/google`
   - `https://<your-production-domain>/api/auth/callback/google`
4. 將 Client ID / Secret 寫入 `GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET`

### 2. Better Auth 伺服器設定 (`src/lib/auth.ts`)
```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

### 3. API Route (`src/app/api/auth/[...all]/route.ts`)
```ts
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(auth);
```

### 4. 前端 Google 登入按鈕
```tsx
import { authClient } from "@/lib/auth-client";

await authClient.signIn.social({
  provider: "google",
  callbackURL: "/",
});
```

### 5. 重要注意
- `BETTER_AUTH_URL` 必須和實際站點網址一致，否則 callback 會失敗
- 本機與正式環境都要在 Google Console 加上對應 callback URL
- 若有 `middleware` 保護首頁，`callbackURL` 請改成可公開訪問的頁面

## 實作步驟

### Phase 1: 基礎設定
1. [ ] 安裝 better-auth 套件
2. [ ] 建立 auth.ts 設定檔
3. [ ] 建立 auth API route
4. [ ] 新增 Drizzle migration 建立 users/sessions/accounts 表

### Phase 2: UI 元件
1. [ ] 建立 GoogleSignInButton 元件
2. [ ] 建立 AuthButton 元件
3. [ ] 建立 UserMenu 元件
4. [ ] 更新首頁加入登入入口

### Phase 3: 路由保護
1. [ ] 建立 middleware.ts
2. [ ] 保護需要登入的路由
3. [ ] 更新 API routes 加入 user 驗證

### Phase 4: 資料關聯
1. [ ] 修改 workouts 加入 user_id
2. [ ] 修改 workout_templates 加入 user_id
3. [ ] 修改 exercises 加入 user_id
4. [ ] 更新所有 API 根據 user_id 過濾資料

### Phase 5: OAuth (Google Only)
1. [ ] 在 Google Cloud Console 建立 OAuth client
2. [ ] 設定 redirect URI: `/api/auth/callback/google`
3. [ ] 寫入 `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
4. [ ] 在 `auth.ts` 啟用 `socialProviders.google`
5. [ ] 加入 "使用 Google 登入" 按鈕
6. [ ] 驗證 callback 後可成功建立 session

## 注意事項

1. **Hydration**: Auth 狀態需要處理 SSR hydration mismatch
2. **Session 過期**: 需要處理 session 過期的自動登出
3. **資料遷移**: 現有資料需要關聯到預設使用者或保持匿名
4. **錯誤處理**: 登入失敗需要友善的錯誤提示

## 測試檢查項目

- [ ] Google 登入成功（首次登入自動建立帳號）
- [ ] Google 登入成功（已存在帳號可正常登入）
- [ ] 登出成功
- [ ] 未登入時訪問受保護路由會重導向
- [ ] 登入後只能看到自己的資料
- [ ] Session 過期後自動登出
