"use client";

import { Suspense, useState } from "react";
import WorkoutLogger, { WorkoutSummary } from "@/components/WorkoutLogger";
import WorkoutComplete from "@/components/WorkoutComplete";

function LogPageContent() {
  const [completedSummary, setCompletedSummary] = useState<WorkoutSummary | null>(null);

  if (completedSummary) {
    return <WorkoutComplete summary={completedSummary} />;
  }

  return <WorkoutLogger onFinish={setCompletedSummary} />;
}

export default function LogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <LogPageContent />
    </Suspense>
  );
}
