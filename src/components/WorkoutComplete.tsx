"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Clock, Dumbbell, TrendingUp, TrendingDown } from "lucide-react";
import DuckMascot from "./DuckMascot";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";
import { achievementsApi, workoutsApi, type AchievementWithStatus } from "@/lib/api";
import { loadMembership, calculateMembershipStats } from "@/lib/membership";
import { type WorkoutSummary } from "@/contexts/WorkoutContext";

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
  const hasChecked = useRef(false);
  const isZh = locale === "zh-TW";

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

    const colors = ["#58CC02", "#1CB0F6", "#FF8C42", "#FF4B4B", "#CE82FF"];

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
    }
  }, [fireConfetti]);

  const encouragements = [
    t("complete.great"),
    t("complete.awesome"),
    t("complete.keepGoing"),
    t("complete.fitnessPro"),
    t("complete.amazing"),
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
        <p className="text-white/80 text-lg">{t("complete.workoutComplete")}</p>
      </div>

      {/* Duck Mascot */}
      <div className="mb-6">
        <DuckMascot variant="pr" size="xl" animate />
      </div>

      {/* Stats Card */}
      <Card className="w-full max-w-sm bg-white/95 backdrop-blur border-0 shadow-xl">
        <CardContent className="p-6">
          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#F7F7F7] rounded-xl p-3 text-center">
              <Dumbbell className="h-5 w-5 text-[#58CC02] mx-auto mb-1" />
              <p className="text-2xl font-bold text-[#2D3648]">
                {summary.totalSets}
              </p>
              <p className="text-xs text-[#AFAFAF]">{isZh ? "組" : "Sets"}</p>
            </div>
            <div className="bg-[#F7F7F7] rounded-xl p-3 text-center">
              <TrendingUp className="h-5 w-5 text-[#1CB0F6] mx-auto mb-1" />
              <p className="text-2xl font-bold text-[#2D3648]">
                {summary.totalVolume.toLocaleString()}
              </p>
              <p className="text-xs text-[#AFAFAF]">{isZh ? "總容量 kg" : "Volume kg"}</p>
            </div>
            <div className="bg-[#F7F7F7] rounded-xl p-3 text-center">
              <Clock className="h-5 w-5 text-[#FF8C42] mx-auto mb-1" />
              <p className="text-2xl font-bold text-[#2D3648]">
                {formatDuration(summary.duration)}
              </p>
              <p className="text-xs text-[#AFAFAF]">{t("complete.duration")}</p>
            </div>
            <div className="bg-[#F7F7F7] rounded-xl p-3 text-center">
              <span className="text-lg block mb-1">⚡</span>
              <p className="text-2xl font-bold text-[#2D3648]">
                {summary.duration > 0 ? Math.round(summary.totalVolume / (summary.duration / 60)) : 0}
              </p>
              <p className="text-xs text-[#AFAFAF]">{isZh ? "kg/分鐘" : "kg/min"}</p>
            </div>
          </div>

          {/* Muscle Group Breakdown */}
          {summary.muscleGroups.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-[#AFAFAF] mb-2">{isZh ? "肌群分布" : "Muscle Groups"}</p>
              <div className="flex rounded-full overflow-hidden h-3">
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
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                {summary.muscleGroups.map((mg, i) => (
                  <span key={i} className="text-[10px] text-[#AFAFAF] flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: mg.color }} />
                    {mg.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Exercise List */}
          {summary.exercises.length > 0 && (
            <div className="border-t border-[#E5E5E5] pt-3">
              <h3 className="text-xs font-medium text-[#AFAFAF] mb-2 flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5" />
                {t("complete.todayBest")}
              </h3>
              <div className="space-y-1.5">
                {summary.exercises.map((ex, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center text-sm ${
                      ex.isPR ? "bg-[#FFF8E1] rounded-lg px-2 py-1.5 -mx-2 border border-[#FFD700]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {ex.isPR && <span className="text-sm shrink-0">🏆</span>}
                      <span className="text-[#2D3648] truncate">{ex.name}</span>
                      <span className="text-[10px] text-[#AFAFAF] shrink-0">{ex.totalSets}{isZh ? "組" : "s"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className={`font-bold ${ex.isPR ? "text-[#FF8C42]" : "text-[#58CC02]"}`}>
                        {ex.maxWeight} kg
                      </span>
                      {ex.isPR && (
                        <span className="text-[9px] font-bold text-[#FF8C42] bg-[#FF8C42]/10 px-1.5 py-0.5 rounded-full">
                          PR!
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New PRs Celebration */}
      {summary.newPRs && summary.newPRs.length > 0 && (
        <Card className="w-full max-w-sm bg-gradient-to-r from-[#FFD700] to-[#FF8C42] border-0 shadow-xl mt-4">
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

      {/* Membership Cost Efficiency */}
      {costStats && (
        <Card className="w-full max-w-sm bg-white/95 backdrop-blur border-0 shadow-xl mt-4">
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
        <div className="w-full max-w-sm mt-4">
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
      <div className="w-full max-w-sm mt-6 space-y-3">
        <Button
          className="w-full py-6 bg-white text-[#58CC02] font-bold text-lg hover:bg-white/90"
          onClick={() => (onDone ? onDone() : router.push("/"))}
        >
          {t("complete.backHome")}
        </Button>
        <Button
          variant="ghost"
          className="w-full py-4 text-white/80 hover:text-white hover:bg-white/10"
          onClick={() => router.push("/analytics")}
        >
          {t("complete.viewStats")}
        </Button>
      </div>
    </div>
  );
}
