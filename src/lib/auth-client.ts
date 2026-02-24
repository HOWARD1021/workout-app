"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
});

export const { useSession, signOut } = authClient;

export async function signInWithGoogle(callbackURL = "/") {
  return authClient.signIn.social({
    provider: "google",
    callbackURL,
  });
}
