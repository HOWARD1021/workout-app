"use client";

import { useEffect, useState } from "react";
import { Flame, Heart, ChevronRight, Trophy, Target, LayoutTemplate, Award, Users } from "lucide-react";
import { workoutsApi } from "@/lib/api";
import DuckMascot from "./DuckMascot";
import TemplateSelector from "./TemplateSelector";
import InactivityReminder from "./InactivityReminder";
import { useRouter } from "next/navigation";
import { useWorkout } from "@/contexts/WorkoutContext";
import { useTranslation } from "@/lib/i18n";

interface Stats {
  total_sessions: number;
  total_volume_kg: number;
  streak_days: number;
  hearts: number;
  daysSinceLastWorkout: number;
}

export default function WorkoutDashboard() {
  const router = useRouter();
  const { startWorkout } = useWorkout();
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showInactivityReminder, setShowInactivityReminder] = useState(false);

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

      if (allWorkouts.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

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

      setStats({
        total_sessions: allWorkouts.length,
        total_volume_kg: Math.round(totalVolume),
        streak_days: streakDays,
        hearts: 70,
        daysSinceLastWorkout,
      });

      // Show inactivity reminder if > 2 days since last workout
      if (daysSinceLastWorkout > 2) {
        setShowInactivityReminder(true);
      }
    } catch (error) {
      console.error("Failed to fetch workout data:", error);
    } finally {
      setLoading(false);
    }
  };

  const weeklyGoal = 5;
  const thisWeekWorkouts = stats ? stats.total_sessions % weeklyGoal : 0;
  const progressPercent = (thisWeekWorkouts / weeklyGoal) * 100;

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

      {/* Progress Bar */}
      <div className="px-4 py-3 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#58CC02] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-2xl">⭐</span>
        </div>
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
        <div className="grid grid-cols-2 gap-3">
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
