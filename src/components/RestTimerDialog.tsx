"use client";

import { useId, useState } from "react";
import { Timer, Plus, SkipForward, Minus } from "lucide-react";
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
  size = 248,
}: {
  current: number;
  total: number;
  size?: number;
}) {
  const id = useId().replace(/:/g, "");
  const gradientId = `${id}-fuse`;
  const emberGradientId = `${id}-ember`;
  const glowId = `${id}-glow`;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, current / total));
  const remainingLength = circumference * progress;
  const dashGap = Math.max(0, circumference - remainingLength);
  const emberAngle = (-90 + progress * 360) * (Math.PI / 180);
  const emberX = size / 2 + radius * Math.cos(emberAngle);
  const emberY = size / 2 + radius * Math.sin(emberAngle);
  const isFinalStretch = current <= 10;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="overflow-visible"
      role="img"
      aria-label={`Rest timer ${current} seconds remaining`}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={isFinalStretch ? "#ff4b4b" : "#fff4c2"} />
          <stop offset="46%" stopColor={isFinalStretch ? "#ff8c42" : "#ffb347"} />
          <stop offset="100%" stopColor={isFinalStretch ? "#ffd166" : "#58cc02"} />
        </linearGradient>
        <radialGradient id={emberGradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="32%" stopColor="#ffe7a3" />
          <stop offset="72%" stopColor="#ff8c42" />
          <stop offset="100%" stopColor="#ff4b4b" stopOpacity="0" />
        </radialGradient>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Spent fuse */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius - 18}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        strokeDasharray="2 10"
      />

      {/* Remaining fuse */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${remainingLength} ${dashGap}`}
        strokeDashoffset="0"
        filter={`url(#${glowId})`}
        className="origin-center -rotate-90 transition-[stroke-dasharray,stroke] duration-1000 ease-linear"
      />

      {/* Moving ember */}
      <g
        className="transition-transform duration-1000 ease-linear"
        style={{
          transform: `translate(${emberX}px, ${emberY}px)`,
        }}
      >
        <circle r="15" fill={`url(#${emberGradientId})`} opacity="0.95" />
        <circle r="5" fill="#ffffff" />
      </g>
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
  const [visualTotal, setVisualTotal] = useState(() =>
    Math.max(defaultRestTime, restTimer, 1)
  );
  const isFinalStretch = restTimer <= 10;

  const progressPct = Math.round((restTimer / visualTotal) * 100);
  const handleAddTime = (secondsToAdd: number) => {
    if (secondsToAdd > 0) {
      setVisualTotal((currentTotal) =>
        Math.max(currentTotal + secondsToAdd, restTimer + secondsToAdd, 1)
      );
    }
    onAddTime(secondsToAdd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,140,66,0.18),transparent_32%),linear-gradient(180deg,#171716_0%,#060706_100%)] backdrop-blur-sm"
        onClick={onMinimize}
      />

      {/* Dialog Content */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 px-6">
        {/* Minimize button */}
        <button
          onClick={onMinimize}
          className="absolute -top-2 right-6 rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20"
          aria-label="Minimize rest timer"
        >
          <Minus className="h-5 w-5" />
        </button>

        {/* Label */}
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-white/[0.74] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <Timer className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wider">
            Rest Timer · {progressPct}%
          </span>
        </div>

        {/* Circular Progress + Time */}
        <div
          className={`relative rounded-full p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] ${
            isFinalStretch
              ? "bg-[#2a120d]/80"
              : "bg-[#10140e]/80"
          }`}
        >
          <CircularProgress
            current={restTimer}
            total={visualTotal}
            size={248}
          />
          {/* Time in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`font-mono text-7xl font-black leading-none tracking-tight ${
                isFinalStretch ? "text-[#ffddd2]" : "text-white"
              }`}
            >
              {timeDisplay}
            </span>
            <span className="mt-3 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white/58">
              {isFinalStretch ? "Final seconds" : "Recover"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid w-full grid-cols-3 gap-3">
          <Button
            variant="ghost"
            className="h-12 rounded-full bg-white/10 px-4 font-semibold text-white hover:bg-white/20"
            onClick={() => handleAddTime(-15)}
          >
            -15s
          </Button>
          <Button
            variant="ghost"
            className="h-12 rounded-full bg-white/10 px-4 font-semibold text-white hover:bg-white/20"
            onClick={() => handleAddTime(30)}
          >
            <Plus className="h-4 w-4 mr-1" />
            30s
          </Button>
          <Button
            variant="ghost"
            className="h-12 rounded-full bg-white/15 px-4 font-semibold text-white hover:bg-white/25"
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
