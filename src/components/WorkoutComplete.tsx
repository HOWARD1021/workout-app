"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { playRewardSfx } from "@/lib/sfx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Clock, Dumbbell, TrendingUp, TrendingDown, Zap, Timer } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import DuckDepositTank from "./DuckDepositTank";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";
import {
  achievementsApi,
  analyticsApi,
  workoutsApi,
  type AchievementWithStatus,
  type MonthlyRecapData,
} from "@/lib/api";
import { loadMembership, calculateMembershipStats } from "@/lib/membership";
import { type WorkoutSummary } from "@/contexts/WorkoutContext";
import MonthlyRecapCard, {
  getLocalMonthRange,
  isMonthlyRecapWindow,
} from "./MonthlyRecapCard";

const MONTHLY_RECAP_SEEN_PREFIX = "workout-monthly-recap-seen:";

function hasSeenMonthlyRecap(month: string) {
  try {
    return localStorage.getItem(`${MONTHLY_RECAP_SEEN_PREFIX}${month}`) === "1";
  } catch {
    return false;
  }
}

function markMonthlyRecapSeen(month: string) {
  try {
    localStorage.setItem(`${MONTHLY_RECAP_SEEN_PREFIX}${month}`, "1");
  } catch {}
}

interface WorkoutCompleteProps {
  summary: WorkoutSummary;
  onDone?: () => void;
}

export default function WorkoutComplete({ summary, onDone }: WorkoutCompleteProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { locale } = useI18n();
  const [newAchievements, setNewAchievements] = useState<AchievementWithStatus[]>([]);
  const [costStats, setCostStats] = useState<{ costPerVisit: number; nextVisitCost: number } | null>(null);
  const [monthlyRecap, setMonthlyRecap] = useState<MonthlyRecapData | null>(null);
  const hasChecked = useRef(false);
  const isZh = locale === "zh-TW";
  const hasNewPRs = summary.newPRs.length > 0;

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) {
      return `${h}h ${m}m`;
    }
    return `${m} min`;
  };

  const fireConfetti = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const colors = ["#58CC02", "#1CB0F6", "#FF8C42", "#FF4B4B", "#CE82FF"];
    const sharedOptions = {
      particleCount: 40,
      spread: 55,
      ticks: 120,
      colors,
      disableForReducedMotion: true,
    };

    confetti({
      ...sharedOptions,
      angle: 60,
      origin: { x: 0, y: 0.65 },
    });
    confetti({
      ...sharedOptions,
      angle: 120,
      origin: { x: 1, y: 0.65 },
    });
  }, []);

  useEffect(() => {
    // Fire confetti on mount
    fireConfetti();
    // Reward cue to celebrate the finished workout
    playRewardSfx();

    // Check for new achievements
    if (!hasChecked.current) {
      hasChecked.current = true;
      achievementsApi.check().then(({ newUnlocks }) => {
        if (newUnlocks.length > 0) {
          setNewAchievements(newUnlocks);
        }
      }).catch(console.error);

      // Calculate membership cost efficiency
      const membership = loadMembership();
      if (membership) {
        workoutsApi.list().then((workouts) => {
          const count = workouts.filter(
            (w) => new Date(w.startedAt) >= new Date(membership.startDate)
          ).length;
          if (count > 0) {
            const stats = calculateMembershipStats(membership, count);
            setCostStats({ costPerVisit: stats.costPerVisit, nextVisitCost: stats.nextVisitCost });
          }
        }).catch(console.error);
      }

      const monthRange = getLocalMonthRange();
      if (isMonthlyRecapWindow() && !hasSeenMonthlyRecap(monthRange.month)) {
        analyticsApi.monthlyRecap(monthRange).then((recap) => {
          if (recap.workoutCount === 0) return;
          setMonthlyRecap(recap);
          markMonthlyRecapSeen(recap.month);
          toast.success(
            isZh
              ? `本月回顧：已訓練 ${recap.workoutCount} 次`
              : `Monthly recap: ${recap.workoutCount} workouts`,
            { duration: 5000 }
          );
        }).catch(console.error);
      }
    }
  }, [fireConfetti, isZh]);

  const encouragements = [
    t("complete.great"),
    t("complete.awesome"),
    t("complete.keepGoing"),
    t("complete.fitnessPro"),
    t("complete.amazing"),
  ];
  const encouragement =
    encouragements[
      Math.abs(summary.totalSets + summary.totalVolume + summary.duration) %
        encouragements.length
    ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7CE728] to-[#58CC02] flex flex-col items-center justify-center p-5 font-sans relative overflow-hidden">
      
      {/* Main White Card Container */}
      <div className="w-full max-w-md bg-white rounded-[32px] p-5 pb-7 shadow-[0_12px_24px_rgba(0,0,0,0.15)] flex flex-col items-center text-center relative z-10 border-b-[6px] border-black/5">
        
        {/* Header Typography */}
        <div className="mb-4 mt-2 select-none">
          <h1 
            className="text-4xl font-black text-white mb-1 tracking-wide leading-[1.1] drop-shadow-md whitespace-pre-line"
            style={{ 
              WebkitTextStroke: '2px #388E00', 
              textShadow: '0 4px 0 #388E00, 0 8px 16px rgba(0,0,0,0.15)' 
            }}
          >
            {isZh ? "完成訓練！" : "WORKOUT\nCOMPLETE!"}
          </h1>
          <p className="text-[#58CC02] font-black tracking-widest uppercase text-[13px] mt-2">
            {encouragement}
          </p>
        </div>

        {/* Lottie Animation Area with Character */}
        <div className="w-full relative flex flex-col items-center justify-center mt-2 mb-6">
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-80 pointer-events-none scale-150">
            <DotLottieReact
              src="https://lottie.host/9f506e7a-36fb-40cd-a931-15c46da7227d/xQjS581n20.lottie"
              loop
              autoplay
            />
          </div>
          <div className="relative z-10 scale-[1.02]">
            <DuckDepositTank
              amount={summary.totalVolume > 0 ? summary.totalVolume : summary.totalSets}
              unit={summary.totalVolume > 0 ? "kg" : isZh ? "組" : "Sets"}
              label={
                hasNewPRs
                  ? isZh
                    ? "🏆 破紀錄汗水存款"
                    : "🏆 PR Sweat Deposit"
                  : isZh
                  ? "🌊 今日汗水存款"
                  : "🌊 Sweat Deposit"
              }
              isPR={hasNewPRs}
              variant={hasNewPRs ? "pr" : "complete"}
            />
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="flex w-full justify-between gap-3 select-none">
          {/* Volume Card */}
          <div className="flex-1 rounded-2xl overflow-hidden border-[3px] border-[#FFC800] flex flex-col shadow-sm">
            <div className="bg-[#FFC800] text-white text-[10px] font-black py-1.5 uppercase tracking-widest leading-none flex items-center justify-center">
              {isZh ? "總容量" : "Total Volume"}
            </div>
            <div className="bg-white py-2.5 flex items-baseline justify-center gap-1 flex-1">
              <Zap className="fill-[#FFC800] text-[#FFC800] w-4 h-4 self-center translate-y-[-1px]" />
              <span className="text-slate-800 font-black text-[19px] tracking-tight">{summary.totalVolume.toLocaleString()}</span>
              <span className="text-slate-500 font-bold text-[10px] ml-[1px]">kg</span>
            </div>
          </div>

          {/* Sets Card */}
          <div className="flex-1 rounded-2xl overflow-hidden border-[3px] border-[#58CC02] flex flex-col shadow-sm">
            <div className="bg-[#58CC02] text-white text-[10px] font-black py-1.5 uppercase tracking-widest leading-none flex items-center justify-center">
              {isZh ? "總組數" : "Total Sets"}
            </div>
            <div className="bg-white py-2.5 flex items-center justify-center gap-1 flex-1">
              <Dumbbell className="w-4 h-4 stroke-[2.5] text-[#58CC02]" />
              <span className="text-slate-800 font-black text-[19px] tracking-tight">{summary.totalSets}</span>
            </div>
          </div>

          {/* Duration Card */}
          <div className="flex-1 rounded-2xl overflow-hidden border-[3px] border-[#1CB0F6] flex flex-col shadow-sm">
            <div className="bg-[#1CB0F6] text-white text-[10px] font-black py-1.5 uppercase tracking-widest leading-none flex items-center justify-center">
              {t("complete.duration")}
            </div>
            <div className="bg-white py-2.5 flex items-baseline justify-center gap-[2px] flex-1">
              <Timer className="w-4 h-4 stroke-[2.5] text-[#1CB0F6] self-center translate-y-[-1px]" />
              <span className="text-slate-800 font-black text-[19px] tracking-tight">
                {Math.floor(summary.duration / 3600) > 0 && (
                  <>
                    {Math.floor(summary.duration / 3600)}
                    <span className="text-xs font-bold text-slate-500 mx-[1px]">{isZh ? "時" : "h"}</span>
                  </>
                )}
                {Math.floor((summary.duration % 3600) / 60)}
                <span className="text-xs font-bold text-slate-500 ml-[1px]">{isZh ? "分" : "m"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Muscle Group Breakdown */}
        {summary.muscleGroups.length > 0 && (
          <>
            <div className="w-full h-px bg-slate-100 mt-6 mb-5" />
            <div className="w-full text-left mb-2">
              <p className="text-xs font-bold text-[#AFAFAF] mb-2">{isZh ? "肌群分布" : "Muscle Groups"}</p>
              <div className="flex rounded-full overflow-hidden h-3 bg-slate-100 shadow-inner">
                {summary.muscleGroups.map((mg, i) => {
                  const totalVol = summary.muscleGroups.reduce((s, m) => s + m.volume, 0);
                  const pct = totalVol > 0 ? (mg.volume / totalVol) * 100 : 0;
                  return (
                    <div
                      key={i}
                      style={{ width: `${pct}%`, backgroundColor: mg.color }}
                      className="transition-all"
                      title={`${mg.name}: ${mg.volume} kg`}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                {summary.muscleGroups.map((mg, i) => (
                  <span key={i} className="text-[11px] font-bold text-[#AFAFAF] flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: mg.color }} />
                    {mg.name}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Exercise List */}
        {summary.exercises.length > 0 && (
          <>
            <div className="w-full h-px bg-slate-100 mt-5 mb-4" />
            <div className="w-full text-left">
              <h3 className="text-xs font-bold text-[#AFAFAF] mb-3 flex items-center gap-1.5">
                <Trophy className="h-4 w-4" />
                {t("complete.todayBest")}
              </h3>
              <div className="space-y-2">
                {summary.exercises.map((ex, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center text-sm px-3 py-1.5 ${
                      ex.isPR ? "bg-[#FFF8E1] rounded-xl border-[1.5px] border-[#FFD700] shadow-sm" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {ex.isPR && <span className="text-sm shrink-0">🏆</span>}
                      <span className={`truncate ${ex.isPR ? "text-slate-800 font-black" : "text-slate-700 font-bold"}`}>{ex.name}</span>
                      <span className="text-[11px] font-bold text-[#AFAFAF] shrink-0">{ex.totalSets}{isZh ? "組" : "s"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className={`font-black text-base ${ex.isPR ? "text-[#FF8C42]" : "text-[#58CC02]"}`}>
                        {ex.maxWeight} kg
                      </span>
                      {ex.isPR && (
                        <span className="text-[9px] font-black text-[#FF8C42] bg-[#FF8C42]/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                          PR!
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* New PRs Celebration */}
      {hasNewPRs && (
        <Card className="w-full max-w-sm bg-gradient-to-r from-[#FFD700] to-[#FF8C42] border-0 shadow-xl mt-4 z-10">
          <CardContent className="p-4">
            <div className="text-center mb-3">
              <p className="text-2xl">🏆</p>
              <p className="text-white font-black text-lg">
                {isZh ? `${summary.newPRs.length} 個新紀錄！` : `${summary.newPRs.length} New PR${summary.newPRs.length > 1 ? "s" : ""}!`}
              </p>
            </div>
            <div className="space-y-2">
              {summary.newPRs.map((pr, i) => (
                <div key={i} className="bg-white/20 rounded-xl px-3 py-2 flex justify-between items-center">
                  <span className="text-white font-medium text-sm truncate">{pr.exerciseName}</span>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-white font-black">{pr.weight} kg</span>
                    {pr.previousBest > 0 && (
                      <span className="text-white/70 text-xs ml-1">
                        (+{pr.weight - pr.previousBest})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Recap Notification */}
      {monthlyRecap && (
        <div className="z-10 w-full flex justify-center">
          <MonthlyRecapCard
            recap={monthlyRecap}
            compact
            className="w-full max-w-sm mt-4"
          />
        </div>
      )}

      {/* Membership Cost Efficiency */}
      {costStats && (
        <Card className="w-full max-w-sm bg-white/95 backdrop-blur border-0 shadow-xl mt-4 z-10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#58CC02]/15 flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-[#58CC02]" />
              </div>
              <span className="text-sm font-bold text-[#2D3648]">
                {isZh ? "會費效率" : "Cost Efficiency"}
              </span>
            </div>
            <div className="text-center">
              <p className="text-sm text-[#AFAFAF] mb-1">
                {isZh ? "本次運動讓每次花費降到" : "Cost per visit is now"}
              </p>
              <p className="text-3xl font-black text-[#58CC02]">
                ${costStats.costPerVisit}
              </p>
              {costStats.nextVisitCost < costStats.costPerVisit && (
                <p className="text-xs text-[#AFAFAF] mt-2">
                  {isZh
                    ? `再去一次就降到 $${costStats.nextVisitCost}！繼續加油 💪`
                    : `One more visit drops it to $${costStats.nextVisitCost}! 💪`}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Achievements */}
      {newAchievements.length > 0 && (
        <div className="w-full max-w-sm mt-4 z-10">
          <p className="text-white/80 text-sm font-bold text-center mb-2">
            🎉 {t("achievements.title")}
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {newAchievements.map((a) => (
              <div
                key={a.id}
                className="bg-white/95 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg"
              >
                <span className="text-xl">{a.icon}</span>
                <span className="text-sm font-bold text-[#2D3648]">
                  {isZh ? a.name : a.nameEn}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="w-full max-w-md mt-6 space-y-3 z-10">
        <button 
          onClick={() => (onDone ? onDone() : router.push("/"))}
          className="w-full bg-[#58CC02] text-white font-black text-xl rounded-2xl py-4 shadow-[0_6px_0_#46A302] hover:translate-y-[2px] hover:shadow-[0_4px_0_#46A302] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest border-2 border-white/20 select-none"
        >
          {t("complete.backHome")}
        </button>
        <Button
          variant="ghost"
          className="w-full py-4 text-white/80 hover:text-white hover:bg-white/10 font-bold"
          onClick={() => router.push("/analytics")}
        >
          {t("complete.viewStats")}
        </Button>
      </div>
    </div>
  );
}
