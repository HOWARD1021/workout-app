"use client";

import { Suspense, useEffect } from "react";
import WorkoutLogger from "@/components/WorkoutLogger";
import WorkoutComplete from "@/components/WorkoutComplete";
import { useWorkout } from "@/contexts/WorkoutContext";
import { useSearchParams, useRouter } from "next/navigation";

function LogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const {
    isRestored,
    isWorkoutActive,
    completedSummary,
    startWorkout,
    clearCompletedSummary,
  } = useWorkout();

  // Start a new workout only after restore is complete and no active workout exists
  useEffect(() => {
    if (!isRestored) return;
    if (!isWorkoutActive && !completedSummary) {
      startWorkout(templateId);
    }
  }, [isRestored]); // eslint-disable-line react-hooks/exhaustive-deps

  if (completedSummary) {
    return (
      <WorkoutComplete
        summary={completedSummary}
        onDone={() => {
          clearCompletedSummary();
          router.push("/");
        }}
      />
    );
  }

  if (!isWorkoutActive) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">Starting workout...</div>
      </div>
    );
  }

  return <WorkoutLogger />;
}

export default function LogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <LogPageContent />
    </Suspense>
  );
}
