"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dumbbell, Activity } from "lucide-react";
import {
  getExerciseDemoImage,
  getExerciseAnatomyImage,
} from "@/lib/exercise-images";

type Tab = "demo" | "anatomy";

interface ExerciseImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseName: string;
  muscleGroup?: string | null;
  gifUrl?: string | null;
  imageUrl?: string | null;
}

export default function ExerciseImageDialog({
  open,
  onOpenChange,
  exerciseName,
  muscleGroup,
  gifUrl,
  imageUrl,
}: ExerciseImageDialogProps) {
  const [activeTab, setActiveTab] = useState<Tab>("demo");
  const [demoError, setDemoError] = useState(false);
  const [anatomyError, setAnatomyError] = useState(false);

  const demoSrc = getExerciseDemoImage(exerciseName);
  const anatomySrc = getExerciseAnatomyImage(exerciseName);

  // Reset error state when dialog opens with a new exercise
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setDemoError(false);
      setAnatomyError(false);
      setActiveTab("demo");
    }
    onOpenChange(isOpen);
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "demo", label: "動作示範", icon: <Dumbbell className="h-4 w-4" /> },
    { key: "anatomy", label: "肌肉解剖", icon: <Activity className="h-4 w-4" /> },
  ];

  const hasError = activeTab === "demo" ? demoError : anatomyError;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#2D3648]">
            {exerciseName}
            {muscleGroup && (
              <span className="ml-2 text-sm font-normal px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#58CC02]">
                {muscleGroup}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-[#F7F7F7] rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-[#2D3648] shadow-sm"
                  : "text-[#AFAFAF] hover:text-[#2D3648]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Image display */}
        <div className="relative w-full aspect-square bg-[#F7F7F7] rounded-lg overflow-hidden flex items-center justify-center">
          {activeTab === "demo" && gifUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={gifUrl}
              alt={`${exerciseName} - 動作示範`}
              className="w-full h-full object-contain p-2"
            />
          ) : activeTab === "demo" && imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageUrl}
              alt={`${exerciseName} - 動作示範`}
              className="w-full h-full object-contain p-2"
            />
          ) : hasError ? (
            <div className="text-center text-[#AFAFAF] p-6">
              <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">圖片尚未生成</p>
              <p className="text-xs mt-1">即將推出</p>
            </div>
          ) : (
            <Image
              key={`${exerciseName}-${activeTab}`}
              src={activeTab === "demo" ? demoSrc : anatomySrc}
              alt={`${exerciseName} - ${activeTab === "demo" ? "動作示範" : "肌肉解剖"}`}
              fill
              className="object-contain p-2"
              onError={() => {
                if (activeTab === "demo") setDemoError(true);
                else setAnatomyError(true);
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
