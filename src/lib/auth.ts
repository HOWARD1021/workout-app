import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getAuth() {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    baseURL: env.BETTER_AUTH_URL || "http://localhost:3000",
    secret: env.BETTER_AUTH_SECRET,
  });
}

// Type helper for session inference
export type Auth = ReturnType<typeof getAuth>;
