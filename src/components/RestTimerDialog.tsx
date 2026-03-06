"use client";

import { Timer, Plus, SkipForward, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestTimerDialogProps {
  restTimer: number;
  defaultRestTime: number;
  onAddTime: (seconds: number) => void;
  onSkip: () => void;
  onMinimize: () => void;
}

function CircularProgress({
  current,
  total,
  size = 200,
}: {
  current: number;
  total: number;
  size?: number;
}) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, current / total));
  const dashOffset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="white"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        className="transition-[stroke-dashoffset] duration-1000 ease-linear"
      />
    </svg>
  );
}

export default function RestTimerDialog({
  restTimer,
  defaultRestTime,
  onAddTime,
  onSkip,
  onMinimize,
}: RestTimerDialogProps) {
  const minutes = Math.floor(restTimer / 60);
  const seconds = restTimer % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  // Calculate a reasonable total for the progress ring
  // Use the max of defaultRestTime and current restTimer to handle +30s additions
  const progressTotal = Math.max(defaultRestTime, restTimer + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onMinimize}
      />

      {/* Dialog Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6">
        {/* Minimize button */}
        <button
          onClick={onMinimize}
          className="absolute -top-2 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
        >
          <Minus className="h-5 w-5" />
        </button>

        {/* Label */}
        <div className="flex items-center gap-2 text-white/70">
          <Timer className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wider">
            Rest Timer
          </span>
        </div>

        {/* Circular Progress + Time */}
        <div className="relative">
          <CircularProgress
            current={restTimer}
            total={progressTotal}
            size={220}
          />
          {/* Time in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-white font-mono tracking-tight">
              {timeDisplay}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="bg-white/10 hover:bg-white/20 text-white rounded-full px-5 py-3 h-auto font-semibold"
            onClick={() => onAddTime(-15)}
          >
            -15s
          </Button>
          <Button
            variant="ghost"
            className="bg-white/10 hover:bg-white/20 text-white rounded-full px-5 py-3 h-auto font-semibold"
            onClick={() => onAddTime(30)}
          >
            <Plus className="h-4 w-4 mr-1" />
            30s
          </Button>
          <Button
            variant="ghost"
            className="bg-white/15 hover:bg-white/25 text-white rounded-full px-5 py-3 h-auto font-semibold"
            onClick={onSkip}
          >
            <SkipForward className="h-4 w-4 mr-1" />
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}
