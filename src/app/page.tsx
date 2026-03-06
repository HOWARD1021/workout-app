"use client";

import WorkoutDashboard from "@/components/WorkoutDashboard";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import UserMenu from "@/components/UserMenu";
import DuckMascot from "@/components/DuckMascot";
import { useSession } from "@/lib/auth-client";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const { data: session, isPending } = useSession();
  const { t } = useTranslation();

  if (isPending) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-400">Loading...</div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white px-6">
        {/* Mascot with floating animation */}
        <div className="animate-fade-in-up">
          <DuckMascot size="2xl" animationStyle="wave" />
        </div>

        {/* Welcome text with staggered fade-in */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800 animate-fade-in-up-delay-1">
            {t("home.title")}
          </h1>
          <p className="text-sm text-gray-500 text-center animate-fade-in-up-delay-2">
            {t("common.loginPrompt")}
          </p>
        </div>

        {/* Sign-in button */}
        <div className="animate-fade-in-up-delay-3">
          <GoogleSignInButton />
        </div>
      </main>
    );
  }

  return (
    <>
      <div className="fixed top-3 right-4 z-50">
        <UserMenu />
      </div>
      <WorkoutDashboard />
    </>
  );
}
