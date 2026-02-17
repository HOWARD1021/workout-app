"use client";

import { useSession } from "@/lib/auth-client";
import GoogleLoginButton from "./GoogleLoginButton";
import UserMenu from "./UserMenu";

export default function AuthStatus() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!session) {
    return <GoogleLoginButton />;
  }

  return <UserMenu />;
}
