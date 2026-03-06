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
    emailAndPassword: {
      enabled: false,
    },
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

// Helper to get current user from request
export async function getCurrentUser(request: Request) {
  const auth = getAuth();
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  return session?.user || null;
}

// Helper to require authenticated user (throws 401 if not logged in)
export async function requireUser(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}
