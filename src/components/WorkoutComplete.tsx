"use client";

import { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Clock, Dumbbell, TrendingUp } from "lucide-react";
import DuckMascot from "./DuckMascot";
import { useRouter } from "next/navigation";

interface WorkoutCompleteProps {
  summary: {
    exerciseCount: number;
    totalVolume: number;
    duration: number;
    exercises: Array<{ name: string; maxWeight: number }>;
  };
}

export default function WorkoutComplete({ summary }: WorkoutCompleteProps) {
  const router = useRouter();

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) {
      return `${h}h ${m}m`;
    }
    return `${m} min`;
  };

  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#58CC02", "#1CB0F6", "#FF9600", "#FF4B4B", "#CE82FF"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  useEffect(() => {
    // Fire confetti on mount
    fireConfetti();
  }, [fireConfetti]);

  const encouragements = [
    "你很棒！💪",
    "太厲害了！🔥",
    "繼續保持！🌟",
    "健身達人！🏆",
    "超級棒！✨",
  ];
  const randomEncouragement =
    encouragements[Math.floor(Math.random() * encouragements.length)];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#58CC02] to-[#46A302] flex flex-col items-center justify-center p-4">
      {/* Celebration Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-black text-white mb-2">
          {randomEncouragement}
        </h1>
        <p className="text-white/80 text-lg">訓練完成！</p>
      </div>

      {/* Duck Mascot */}
      <div className="mb-6">
        <DuckMascot variant="pr" size="xl" animate />
      </div>

      {/* Stats Card */}
      <Card className="w-full max-w-sm bg-white/95 backdrop-blur border-0 shadow-xl">
        <CardContent className="p-6">
          {/* Main Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Dumbbell className="h-5 w-5 text-[#58CC02]" />
              </div>
              <p className="text-2xl font-bold text-[#3C3C3C]">
                {summary.exerciseCount}
              </p>
              <p className="text-xs text-[#AFAFAF]">動作</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-5 w-5 text-[#1CB0F6]" />
              </div>
              <p className="text-2xl font-bold text-[#3C3C3C]">
                {summary.totalVolume.toLocaleString()}
              </p>
              <p className="text-xs text-[#AFAFAF]">總容量 kg</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-5 w-5 text-[#FF9600]" />
              </div>
              <p className="text-2xl font-bold text-[#3C3C3C]">
                {formatDuration(summary.duration)}
              </p>
              <p className="text-xs text-[#AFAFAF]">時長</p>
            </div>
          </div>

          {/* Exercise List */}
          {summary.exercises.length > 0 && (
            <div className="border-t border-[#E5E5E5] pt-4">
              <h3 className="text-sm font-medium text-[#AFAFAF] mb-3 flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                今日最佳
              </h3>
              <div className="space-y-2">
                {summary.exercises.slice(0, 3).map((ex, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-[#3C3C3C]">{ex.name}</span>
                    <span className="font-bold text-[#58CC02]">
                      {ex.maxWeight} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="w-full max-w-sm mt-6 space-y-3">
        <Button
          className="w-full py-6 bg-white text-[#58CC02] font-bold text-lg hover:bg-white/90"
          onClick={() => router.push("/")}
        >
          返回首頁
        </Button>
        <Button
          variant="ghost"
          className="w-full py-4 text-white/80 hover:text-white hover:bg-white/10"
          onClick={() => router.push("/analytics")}
        >
          查看統計
        </Button>
      </div>
    </div>
  );
}
