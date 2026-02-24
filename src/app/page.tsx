"use client";

import WorkoutDashboard from "@/components/WorkoutDashboard";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import UserMenu from "@/components/UserMenu";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-400">Loading...</div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white px-6">
        <h1 className="text-2xl font-bold text-gray-800">Workout App</h1>
        <p className="text-sm text-gray-500 text-center">
          請使用 Google 帳號登入以開始記錄訓練
        </p>
        <GoogleSignInButton />
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
