"use client";

import { CalendarCheck, Clock, Dumbbell, ListChecks, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import type { MonthlyRecapData } from "@/lib/api";

interface MonthlyRecapCardProps {
  recap: MonthlyRecapData;
  compact?: boolean;
  className?: string;
}

function formatMonth(month: string, locale: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(new Date(year, monthNumber - 1, 1));
}

export function getLocalMonthRange(date = new Date()) {
  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 1);

  return {
    month: `${year}-${String(monthIndex + 1).padStart(2, "0")}`,
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export function isMonthlyRecapWindow(date = new Date()) {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return lastDay - date.getDate() <= 2;
}

export default function MonthlyRecapCard({
  recap,
  compact = false,
  className = "",
}: MonthlyRecapCardProps) {
  const { locale } = useI18n();
  const isZh = locale === "zh-TW";
  const visibleExercises = recap.exercises.slice(0, compact ? 5 : 8);
  const hiddenExerciseCount = Math.max(0, recap.exercises.length - visibleExercises.length);

  return (
    <Card className={`bg-white/95 backdrop-blur border-0 shadow-xl ${className}`}>
      <CardContent className={compact ? "p-4" : "p-5"}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#58CC02]">
              {formatMonth(recap.month, locale)}
            </p>
            <h2 className="text-lg font-black text-[#2D3648]">
              {isZh ? "本月訓練回顧" : "Monthly Recap"}
            </h2>
            <p className="text-xs text-[#AFAFAF] mt-0.5">
              {isZh
                ? `本月已來 ${recap.workoutCount} 次，完成 ${recap.exerciseCount} 個動作`
                : `${recap.workoutCount} workout${recap.workoutCount === 1 ? "" : "s"} across ${recap.exerciseCount} exercise${recap.exerciseCount === 1 ? "" : "s"}`}
            </p>
          </div>
          <div className="h-10 w-10 shrink-0 rounded-lg bg-[#58CC02]/15 flex items-center justify-center">
            <CalendarCheck className="h-5 w-5 text-[#58CC02]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="rounded-lg bg-[#F7F7F7] p-3">
            <CalendarCheck className="h-4 w-4 text-[#58CC02] mb-1" />
            <p className="text-xl font-black text-[#2D3648]">{recap.workoutCount}</p>
            <p className="text-[11px] text-[#AFAFAF]">{isZh ? "來館次數" : "Visits"}</p>
          </div>
          <div className="rounded-lg bg-[#F7F7F7] p-3">
            <TrendingUp className="h-4 w-4 text-[#1CB0F6] mb-1" />
            <p className="text-xl font-black text-[#2D3648]">
              {recap.totalVolume.toLocaleString()}
            </p>
            <p className="text-[11px] text-[#AFAFAF]">{isZh ? "總容量 kg" : "Volume kg"}</p>
          </div>
          <div className="rounded-lg bg-[#F7F7F7] p-3">
            <ListChecks className="h-4 w-4 text-[#FF8C42] mb-1" />
            <p className="text-xl font-black text-[#2D3648]">{recap.totalSets}</p>
            <p className="text-[11px] text-[#AFAFAF]">{isZh ? "總組數" : "Sets"}</p>
          </div>
          <div className="rounded-lg bg-[#F7F7F7] p-3">
            <Clock className="h-4 w-4 text-[#CE82FF] mb-1" />
            <p className="text-xl font-black text-[#2D3648]">
              {recap.averageDurationMinutes}
            </p>
            <p className="text-[11px] text-[#AFAFAF]">{isZh ? "平均分鐘" : "Avg min"}</p>
          </div>
        </div>

        {visibleExercises.length > 0 && (
          <div className="border-t border-[#E5E5E5] pt-3">
            <h3 className="text-xs font-bold text-[#AFAFAF] mb-2 flex items-center gap-1.5">
              <Dumbbell className="h-3.5 w-3.5" />
              {isZh ? "本月做過的動作" : "Exercises This Month"}
            </h3>
            <div className="space-y-2">
              {visibleExercises.map((exercise) => (
                <div
                  key={exercise.exerciseId}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg bg-[#F7F7F7] px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#2D3648] truncate">
                      {exercise.exerciseName}
                    </p>
                    <p className="text-[11px] text-[#AFAFAF] truncate">
                      {exercise.workoutCount}
                      {isZh ? " 次" : "x"} · {exercise.totalSets}
                      {isZh ? " 組" : " sets"} · {exercise.totalReps}
                      {isZh ? " 下" : " reps"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-[#58CC02]">
                      {exercise.totalVolume.toLocaleString()} kg
                    </p>
                    <p className="text-[10px] text-[#AFAFAF]">
                      {isZh ? "最高" : "Max"} {exercise.maxWeight} kg
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {hiddenExerciseCount > 0 && (
              <p className="text-center text-xs text-[#AFAFAF] mt-2">
                {isZh
                  ? `還有 ${hiddenExerciseCount} 個動作可在統計頁查看`
                  : `${hiddenExerciseCount} more in statistics`}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
