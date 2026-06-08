import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Polar } from "@polar-sh/sdk";
import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth";

export function getAuth() {
  const { env } = getCloudflareContext();
  const db = getDb(env.DB);

  const polarClient = new Polar({
    accessToken: env.POLAR_ACCESS_TOKEN,
    // Switch to 'production' when ready to go live
    server: "sandbox",
  });

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
    plugins: [
      polar({
        client: polarClient,
        createCustomerOnSignUp: true,
        use: [
          checkout({
            products: [
              {
                // TODO: Replace with your actual Polar Product ID from Dashboard
                productId: "YOUR_POLAR_PRODUCT_ID",
                slug: "pro",
              },
            ],
            successUrl: "/pricing?success=true",
            authenticatedUsersOnly: true,
          }),
          portal(),
          webhooks({
            secret: env.POLAR_WEBHOOK_SECRET,
            onSubscriptionActive: async (payload) => {
              console.log("Subscription activated:", payload.data.id);
            },
            onSubscriptionCanceled: async (payload) => {
              console.log("Subscription canceled:", payload.data.id);
            },
            onOrderPaid: async (payload) => {
              console.log("Order paid:", payload.data.id);
            },
          }),
        ],
      }),
    ],
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
