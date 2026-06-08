/// <reference types="@cloudflare/workers-types" />

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    IMAGE_API_BASE?: string;
    IMAGE_API_KEY?: string;
    IMAGE_MODEL?: string;
    POLAR_ACCESS_TOKEN: string;
    POLAR_WEBHOOK_SECRET: string;
  }
}

export {};
