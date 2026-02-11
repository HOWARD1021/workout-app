# Better Auth 會員系統實作規格

## 概述
在 Workout App 整合 Better Auth 實現使用者認證功能，支援 Email/Password 和 OAuth 登入。

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

#### 4. verification_tokens (Email 驗證)
```sql
CREATE TABLE verification_tokens (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
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
│   ├── LoginForm.tsx              # 登入表單
│   ├── RegisterForm.tsx           # 註冊表單
│   └── UserMenu.tsx               # 使用者選單
└── middleware.ts                   # 路由保護
```

## API Routes

### Better Auth 處理的路由
- `POST /api/auth/sign-up` - 註冊
- `POST /api/auth/sign-in/email` - Email 登入
- `POST /api/auth/sign-in/social` - OAuth 登入
- `POST /api/auth/sign-out` - 登出
- `GET /api/auth/session` - 取得 session
- `POST /api/auth/forgot-password` - 忘記密碼
- `POST /api/auth/reset-password` - 重設密碼

## 認證流程

### Email/Password 登入
1. 使用者填寫 email 和 password
2. 呼叫 `/api/auth/sign-in/email`
3. Better Auth 驗證並建立 session
4. 返回 session token，存入 cookie

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

### LoginForm
```tsx
// Email/Password 登入表單
interface LoginFormProps {
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

# OAuth (可選)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## 實作步驟

### Phase 1: 基礎設定
1. [ ] 安裝 better-auth 套件
2. [ ] 建立 auth.ts 設定檔
3. [ ] 建立 auth API route
4. [ ] 新增 Drizzle migration 建立 users/sessions/accounts 表

### Phase 2: UI 元件
1. [ ] 建立 LoginForm 元件
2. [ ] 建立 RegisterForm 元件
3. [ ] 建立 AuthButton 元件
4. [ ] 建立 UserMenu 元件
5. [ ] 更新首頁加入登入入口

### Phase 3: 路由保護
1. [ ] 建立 middleware.ts
2. [ ] 保護需要登入的路由
3. [ ] 更新 API routes 加入 user 驗證

### Phase 4: 資料關聯
1. [ ] 修改 workouts 加入 user_id
2. [ ] 修改 workout_templates 加入 user_id
3. [ ] 修改 exercises 加入 user_id
4. [ ] 更新所有 API 根據 user_id 過濾資料

### Phase 5: OAuth (可選)
1. [ ] 設定 Google OAuth
2. [ ] 加入 "使用 Google 登入" 按鈕

## 注意事項

1. **Hydration**: Auth 狀態需要處理 SSR hydration mismatch
2. **Session 過期**: 需要處理 session 過期的自動登出
3. **資料遷移**: 現有資料需要關聯到預設使用者或保持匿名
4. **錯誤處理**: 登入失敗需要友善的錯誤提示

## 測試檢查項目

- [ ] 註冊新帳號成功
- [ ] Email/Password 登入成功
- [ ] 登出成功
- [ ] 未登入時訪問受保護路由會重導向
- [ ] 登入後只能看到自己的資料
- [ ] Session 過期後自動登出
