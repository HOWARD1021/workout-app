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
    isWorkoutActive,
    completedSummary,
    startWorkout,
    clearCompletedSummary,
  } = useWorkout();

  // Start a new workout if navigated here without an active one
  useEffect(() => {
    if (!isWorkoutActive && !completedSummary) {
      startWorkout(templateId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
