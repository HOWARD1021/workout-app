"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import DuckMascot from "./DuckMascot";
import { playRewardSfx } from "@/lib/sfx";
import { Sparkles, RotateCcw, Droplets } from "lucide-react";

export interface DuckDepositTankProps {
  /** The target number to deposit (e.g. total volume in kg) */
  amount: number;
  /** Unit label (e.g. "kg", "組", "$") */
  unit?: string;
  /** Subtitle or descriptor (e.g. "今日訓練總容量") */
  label?: string;
  /** Duck variant (complete, pr, default) */
  variant?: "complete" | "pr" | "default";
  /** Is this a new PR workout? */
  isPR?: boolean;
  /** Automatically start animation on mount */
  autoStart?: boolean;
  /** Optional callback when the deposit surge finishes */
  onAnimationDone?: () => void;
  /** Additional container classes */
  className?: string;
}

// Pre-calculated bubble parameters for reproducible, fluttery bubbles
const BUBBLE_DATA = [
  { left: "22%", size: 10, delay: "0s", duration: "2.4s" },
  { left: "38%", size: 6, delay: "0.5s", duration: "2.1s" },
  { left: "50%", size: 12, delay: "0.2s", duration: "2.6s" },
  { left: "62%", size: 8, delay: "0.8s", duration: "2.0s" },
  { left: "75%", size: 7, delay: "0.3s", duration: "2.3s" },
  { left: "30%", size: 5, delay: "1.1s", duration: "1.9s" },
  { left: "58%", size: 11, delay: "0.6s", duration: "2.5s" },
  { left: "45%", size: 9, delay: "1.4s", duration: "2.2s" },
];

export default function DuckDepositTank({
  amount,
  unit = "kg",
  label = "今日訓練存款",
  variant = "complete",
  isPR = false,
  autoStart = true,
  onAnimationDone,
  className = "",
}: DuckDepositTankProps) {
  // Water height percentage: starts low at 14% (shallow base), rises to 65%
  const BASE_WATER = 14;
  const TARGET_WATER = 65;

  const [waterHeight, setWaterHeight] = useState<number>(BASE_WATER);
  const [displayAmount, setDisplayAmount] = useState<number>(0);
  const [isSurging, setIsSurging] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const isMountedRef = useRef<boolean>(true);
  const initialTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSurge = useCallback(() => {
    if (initialTimeoutRef.current) clearTimeout(initialTimeoutRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    // If reduced motion is requested, complete immediately
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setWaterHeight(TARGET_WATER);
      setDisplayAmount(amount);
      setIsSurging(false);
      setIsComplete(true);
      return;
    }

    // Reset state
    setWaterHeight(BASE_WATER);
    setDisplayAmount(0);
    setIsSurging(true);
    setIsComplete(false);

    // Give a tiny tick before water starts surging upward
    initialTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      setWaterHeight(TARGET_WATER);

      // Number count-up in ~30 smooth steps over 2000ms
      const duration = 2000;
      const steps = 30;
      const stepDuration = duration / steps;
      let currentStep = 0;

      timerRef.current = setInterval(() => {
        if (!isMountedRef.current) return;
        currentStep++;
        const progress = currentStep / steps;
        // Ease-out curve for counting
        const eased = 1 - Math.pow(1 - progress, 3);
        const nextVal = Math.round(amount * eased);

        setDisplayAmount(nextVal);

        if (currentStep >= steps) {
          if (timerRef.current) clearInterval(timerRef.current);
          setDisplayAmount(amount);
          setIsSurging(false);
          setIsComplete(true);
          playRewardSfx();
          if (onAnimationDone) onAnimationDone();
        }
      }, stepDuration);
    }, 150);
  }, [amount, onAnimationDone]);

  useEffect(() => {
    isMountedRef.current = true;
    if (autoStart) {
      startSurge();
    } else {
      setDisplayAmount(amount);
      setWaterHeight(TARGET_WATER);
      setIsComplete(true);
    }
    return () => {
      isMountedRef.current = false;
      if (initialTimeoutRef.current) clearTimeout(initialTimeoutRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoStart, startSurge, amount]);

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Deposit Header Tag */}
      <div className="flex items-center gap-1.5 mb-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-sm text-xs font-bold tracking-wide">
        <Droplets className="w-3.5 h-3.5 text-cyan-200 animate-bounce" />
        <span>{label}</span>
        {isComplete && (
          <span className="flex items-center gap-0.5 text-amber-200 ml-1">
            <Sparkles className="w-3 h-3" />
            已入庫
          </span>
        )}
      </div>

      {/* Main Glass Water Tank Wrapper */}
      <div className="relative w-72 h-64">
        {/* Inner Tank with Overflow Hidden */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 bg-gradient-to-b from-sky-50/20 via-sky-100/10 to-sky-200/30 backdrop-blur-sm">
          {/* Glass Sheen / Highlight reflection */}
          <div className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-white/40 rounded-3xl" />
          <div className="absolute top-2 left-3 w-16 h-2 rounded-full bg-white/40 pointer-events-none" />

          {/* Dynamic Water Level (Surges from bottom up) */}
          <div
            className="absolute left-0 right-0 bottom-0 z-10 transition-all duration-[2000ms] ease-out"
            style={{ height: `${waterHeight}%` }}
          >
            {/* Animated Wave Top Surface */}
            <div className="absolute -top-4 left-0 w-[200%] h-6 pointer-events-none flex opacity-90 text-cyan-300 fill-current animate-wave-slide-slow">
              <svg viewBox="0 0 800 60" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,20 C150,50 250,-10 400,20 C550,50 650,-10 800,20 L800,60 L0,60 Z" />
              </svg>
              <svg viewBox="0 0 800 60" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,20 C150,50 250,-10 400,20 C550,50 650,-10 800,20 L800,60 L0,60 Z" />
              </svg>
            </div>

            <div className="absolute -top-3 left-0 w-[200%] h-5 pointer-events-none flex opacity-60 text-blue-400 fill-current animate-wave-slide-fast">
              <svg viewBox="0 0 800 60" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,25 C180,0 220,50 400,25 C580,0 620,50 800,25 L800,60 L0,60 Z" />
              </svg>
              <svg viewBox="0 0 800 60" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,25 C180,0 220,50 400,25 C580,0 620,50 800,25 L800,60 L0,60 Z" />
              </svg>
            </div>

            {/* Deep Water Body Gradient */}
            <div className="w-full h-full bg-gradient-to-b from-cyan-400/85 via-blue-500/90 to-indigo-600/95 shadow-inner" />

            {/* Aerator Bubbles Rising from Bottom */}
            {BUBBLE_DATA.map((b, i) => (
              <div
                key={i}
                className="absolute bottom-1 rounded-full bg-white/70 shadow-sm animate-bubble-rise pointer-events-none"
                style={{
                  left: b.left,
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  animationDelay: b.delay,
                  animationDuration: b.duration,
                }}
              />
            ))}
          </div>

          {/* Tank Bottom: Aerator & Gravel Base */}
          <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-amber-900/30 to-transparent z-10 flex items-center justify-center gap-1">
            {/* Subtle bubbles source aerator */}
            <div className="w-16 h-1.5 rounded-full bg-cyan-200/50 blur-[0.5px]" />
          </div>
        </div>

        {/* Duck Mascot on Boat: Floats directly on the surging water surface (Outside overflow-hidden) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-40 transition-all duration-[2000ms] ease-out pointer-events-none"
          style={{
            bottom: `calc(${waterHeight}% - 30px)`,
          }}
        >
          {/* Bobbing and gentle wave motion on the water */}
          <div
            className={`transition-transform duration-300 ${
              isComplete ? "animate-duck-wave" : isSurging ? "animate-duck-breathe" : "animate-duck-float"
            }`}
          >
            <img 
              src="/images/duck-boat-transparent.png" 
              alt="Duck on a boat" 
              className="w-32 h-32 object-contain drop-shadow-md"
            />
          </div>

          {/* Ripple rings under the duck when resting on water */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-white/30 blur-[1px] animate-pulse" />
        </div>
      </div>

      {/* Jumping & Bouncing Numbers (Deposit counter) */}
      <div className="mt-4 text-center">
        <div className="flex items-baseline justify-center gap-1.5">
          <span
            className={`font-black text-white tracking-tight transition-transform duration-150 ${
              isSurging ? "scale-110 text-yellow-300" : "scale-100"
            }`}
            style={{ fontSize: "2.4rem", textShadow: "0 4px 12px rgba(0,0,0,0.18)" }}
          >
            {displayAmount.toLocaleString()}
          </span>
          <span className="text-xl font-bold text-white/90">{unit}</span>
        </div>

        <p className="text-xs text-white/80 font-medium mt-0.5">
          {isSurging ? "🌊 泉水注入中..." : isComplete ? "🎉 汗水成功入帳！" : "準備注水中..."}
        </p>

        {/* Replay Button */}
        <button
          onClick={startSurge}
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition active:scale-95"
          title="重新播放注水存款特效"
        >
          <RotateCcw className="w-3 h-3" />
          <span>再看一次湧水</span>
        </button>
      </div>
    </div>
  );
}
