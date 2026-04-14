"use client";

import { useEffect, useState } from "react";
import { Flame, Heart, ChevronRight, Trophy, Target, LayoutTemplate, Award, Users, Wallet, TrendingDown } from "lucide-react";
import { workoutsApi } from "@/lib/api";
import DuckMascot from "./DuckMascot";
import TemplateSelector from "./TemplateSelector";
import InactivityReminder from "./InactivityReminder";
import { useRouter } from "next/navigation";
import { useWorkout } from "@/contexts/WorkoutContext";
import { useTranslation, useI18n } from "@/lib/i18n";
import { loadMembership, calculateMembershipStats } from "@/lib/membership";

const GOAL_KEY = "workout-weekly-goal";
function loadGoal(): number {
  try {
    const v = localStorage.getItem(GOAL_KEY);
    return v ? parseInt(v, 10) : 4;
  } catch { return 4; }
}
function saveGoal(v: number) {
  try { localStorage.setItem(GOAL_KEY, String(v)); } catch {}
}

interface Stats {
  total_sessions: number;
  total_volume_kg: number;
  streak_days: number;
  hearts: number;
  daysSinceLastWorkout: number;
  thisWeekWorkouts: number;
}

export default function WorkoutDashboard() {
  const router = useRouter();
  const { startWorkout } = useWorkout();
  const { t } = useTranslation();
  const { locale } = useI18n();
  const isZh = locale === "zh-TW";
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showInactivityReminder, setShowInactivityReminder] = useState(false);
  const [weeklyGoal, setWeeklyGoalState] = useState(4);
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [costPerVisit, setCostPerVisit] = useState<number | null>(null);

  // Load weekly goal from localStorage
  useEffect(() => {
    setWeeklyGoalState(loadGoal());
  }, []);

  const setWeeklyGoal = (v: number) => {
    setWeeklyGoalState(v);
    saveGoal(v);
    setShowGoalPicker(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const allWorkouts = await workoutsApi.list();

      let totalVolume = 0;
      allWorkouts.forEach((workout) => {
        (workout.workout_logs || []).forEach((log) => {
          const volume = (log.weight || 0) * (log.reps || 0);
          totalVolume += volume;
        });
      });

      // Calculate streak and days since last workout
      let streakDays = 0;
      let daysSinceLastWorkout = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (allWorkouts.length > 0) {

        const workoutDates = new Set(
          allWorkouts.map(
            (w) => new Date(w.startedAt).toISOString().split("T")[0]
          )
        );

        for (let i = 0; i < 365; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - i);
          const dateStr = checkDate.toISOString().split("T")[0];

          if (workoutDates.has(dateStr)) {
            streakDays++;
          } else if (i > 0) {
            break;
          }
        }

        // Calculate days since last workout
        const lastWorkoutDate = new Date(allWorkouts[0].startedAt);
        lastWorkoutDate.setHours(0, 0, 0, 0);
        daysSinceLastWorkout = Math.floor(
          (today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24)
        );
      }

      // Calculate this week's workouts
      const weekStart = new Date(today);
      const dayOfWeek = weekStart.getDay();
      weekStart.setDate(weekStart.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      const thisWeekWorkouts = allWorkouts.filter((w) => {
        const d = new Date(w.startedAt);
        d.setHours(0, 0, 0, 0);
        return d >= weekStart;
      }).length;

      setStats({
        total_sessions: allWorkouts.length,
        total_volume_kg: Math.round(totalVolume),
        streak_days: streakDays,
        hearts: 70,
        daysSinceLastWorkout,
        thisWeekWorkouts,
      });

      // Show inactivity reminder if > 2 days since last workout
      if (daysSinceLastWorkout > 2) {
        setShowInactivityReminder(true);
      }

      // Calculate membership cost per visit
      const membership = loadMembership();
      if (membership) {
        const workoutsSinceMembership = allWorkouts.filter(
          (w) => new Date(w.startedAt) >= new Date(membership.startDate)
        ).length;
        if (workoutsSinceMembership > 0) {
          const mStats = calculateMembershipStats(membership, workoutsSinceMembership);
          setCostPerVisit(mStats.costPerVisit);
        }
      }
    } catch (error) {
      console.error("Failed to fetch workout data:", error);
    } finally {
      setLoading(false);
    }
  };

  const thisWeekWorkouts = stats?.thisWeekWorkouts || 0;
  const progressPercent = Math.min(100, (thisWeekWorkouts / weeklyGoal) * 100);
  const goalReached = thisWeekWorkouts >= weeklyGoal;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        {/* Logo */}
        <div className="text-xl font-bold text-[#58CC02]">Workout</div>

        {/* Streak */}
        <div className="flex items-center gap-1">
          <Flame className="w-7 h-7 text-[#FF8C42]" fill="#FF8C42" />
          <span className="font-bold text-lg text-gray-700">
            {stats?.streak_days || 0}
          </span>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1">
          <Heart className="w-7 h-7 text-[#FF4B4B]" fill="#FF4B4B" />
          <span className="font-bold text-lg text-gray-700">
            {stats?.hearts || 0}
          </span>
        </div>
      </div>

      {/* Weekly Goal Progress */}
      <div className="px-4 py-3 bg-white">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => setShowGoalPicker(!showGoalPicker)}
            className="text-xs text-[#AFAFAF] font-medium hover:text-[#58CC02] transition-colors"
          >
            {isZh ? `週目標 ${thisWeekWorkouts}/${weeklyGoal}` : `Week ${thisWeekWorkouts}/${weeklyGoal}`} ✏️
          </button>
          {goalReached && <span className="text-xs font-bold text-[#58CC02]">{isZh ? "✅ 達標！" : "✅ Done!"}</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${goalReached ? "bg-[#FFD700]" : "bg-[#58CC02]"}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-2xl">{goalReached ? "🏆" : "⭐"}</span>
        </div>
        {/* Goal Picker */}
        {showGoalPicker && (
          <div className="flex gap-2 mt-2 justify-center">
            {[2, 3, 4, 5, 6, 7].map((n) => (
              <button
                key={n}
                onClick={() => setWeeklyGoal(n)}
                className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                  weeklyGoal === n
                    ? "bg-[#58CC02] text-white"
                    : "bg-gray-100 text-[#2D3648] hover:bg-gray-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-5 py-4">
        {/* Duck Mascot + Speech Bubble */}
        <div className="flex items-center gap-3 mb-4">
          {/* Duck */}
          <div className="w-28 h-28 flex items-center justify-center flex-shrink-0">
            <DuckMascot size="xl" animate />
          </div>

          {/* Speech Bubble */}
          <div className="relative bg-white border-2 border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm">
            <p className="text-sm font-semibold text-[#2D3648] whitespace-nowrap">
              {t("home.timeToLift")}
            </p>
            {/* Arrow pointing left */}
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-3 bg-white border-l-2 border-b-2 border-gray-200 transform rotate-45" />
          </div>
        </div>

        {/* Progress Button */}
        <button
          onClick={() => router.push("/analytics")}
          className="mb-5 px-5 py-2.5 rounded-full border-2 border-[#58CC02] text-[#58CC02] font-bold text-sm flex items-center gap-1 hover:bg-green-50 active:scale-95 transition-all"
        >
          {t("home.progressWorkouts", { count: stats?.total_sessions || 0 })}
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Main Action Buttons */}
        <div className="w-full space-y-3">
          {/* Start Workout */}
          <button
            onClick={() => setShowTemplateSelector(true)}
            className="w-full py-5 rounded-2xl bg-[#58CC02] text-white font-black text-lg uppercase tracking-wide shadow-[0_4px_0_0_#46A302] hover:bg-[#4CB302] active:shadow-none active:translate-y-1 transition-all"
          >
            {t("home.startWorkout")}
          </button>

          {/* Daily Goal */}
          <button
            onClick={() => router.push("/exercises")}
            className="w-full py-5 rounded-2xl bg-[#FF8C42] text-white font-black text-lg uppercase tracking-wide shadow-[0_4px_0_0_#E07A35] hover:bg-[#E07A35] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <Target className="w-5 h-5" />
            {t("home.exerciseLibrary")}
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-5 pb-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
            <p className="text-3xl font-bold text-[#58CC02]">
              {stats?.total_sessions || 0}
            </p>
            <p className="text-sm text-gray-500 font-medium">{t("home.workouts")}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
            <p className="text-3xl font-bold text-[#1CB0F6]">
              {stats?.total_volume_kg.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-500 font-medium">{t("home.totalKg")}</p>
          </div>
        </div>

        {/* Membership Cost Banner */}
        {costPerVisit !== null && (
          <button
            onClick={() => router.push("/membership")}
            className="w-full mb-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#58CC02] to-[#46A302] text-white flex items-center justify-between shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-bold">
                {isZh ? `每次運動 $${costPerVisit}` : `$${costPerVisit}/visit`}
              </span>
            </div>
            <span className="text-xs text-white/70">
              {isZh ? "查看詳情 ›" : "Details ›"}
            </span>
          </button>
        )}

        {/* Bottom Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button
            onClick={() => router.push("/templates")}
            className="py-4 rounded-2xl border-2 border-[#1CB0F6] text-[#1CB0F6] font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-blue-50 active:scale-[0.98] transition-all"
          >
            <LayoutTemplate className="w-4 h-4" />
            {t("home.templates")}
          </button>
          <button
            onClick={() => router.push("/analytics")}
            className="py-4 rounded-2xl border-2 border-[#FF8C42] text-[#FF8C42] font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-orange-50 active:scale-[0.98] transition-all"
          >
            <Trophy className="w-4 h-4" />
            {t("home.statistics")}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => router.push("/achievements")}
            className="py-4 rounded-2xl border-2 border-[#FFD700] text-[#DAA520] font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-yellow-50 active:scale-[0.98] transition-all"
          >
            <Award className="w-4 h-4" />
            {t("achievements.title")}
          </button>
          <button
            onClick={() => router.push("/friends")}
            className="py-4 rounded-2xl border-2 border-[#CE82FF] text-[#CE82FF] font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-purple-50 active:scale-[0.98] transition-all"
          >
            <Users className="w-4 h-4" />
            {t("friends.title")}
          </button>
          <button
            onClick={() => router.push("/membership")}
            className="py-4 rounded-2xl border-2 border-[#58CC02] text-[#58CC02] font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-green-50 active:scale-[0.98] transition-all"
          >
            <Wallet className="w-4 h-4" />
            {isZh ? "會員" : "Cost"}
          </button>
        </div>
      </div>

      {/* Bottom Safe Area */}
      <div className="h-6 bg-[#FAFAF8]" />

      {/* Template Selector Modal */}
      <TemplateSelector
        open={showTemplateSelector}
        onOpenChange={setShowTemplateSelector}
        onSelectTemplate={(templateId) => {
          startWorkout(templateId);
          router.push(`/log?template=${templateId}`);
        }}
        onStartEmpty={() => {
          startWorkout(null);
          router.push("/log");
        }}
      />

      {/* Inactivity Reminder */}
      {showInactivityReminder && stats && (
        <InactivityReminder
          daysSinceLastWorkout={stats.daysSinceLastWorkout}
          onStartWorkout={() => {
            setShowInactivityReminder(false);
            setShowTemplateSelector(true);
          }}
          onDismiss={() => setShowInactivityReminder(false)}
        />
      )}
    </div>
  );
}
