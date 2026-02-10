import { Suspense } from "react";
import WorkoutLogger from "@/components/WorkoutLogger";

function LogPageContent() {
  return <WorkoutLogger />;
}

export default function LogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <LogPageContent />
    </Suspense>
  );
}
