"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  CalendarDays,
  ChevronRight,
  Dumbbell,
  Flame,
  LayoutTemplate,
  Plus,
  TrendingDown,
  Trophy,
} from "lucide-react";
import { workoutsApi } from "@/lib/api";
import TemplateSelector from "./TemplateSelector";
import InactivityReminder from "./InactivityReminder";
import UserMenu from "./UserMenu";
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
    <div className="ios-page">
      <div className="ios-screen flex flex-col pb-28">
        <header className="px-5 pb-3 pt-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#6f6f78]">
                {new Intl.DateTimeFormat(isZh ? "zh-TW" : "en", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                }).format(new Date())}
              </p>
              <h1 className="mt-1 text-[34px] font-bold tracking-[-0.02em] text-[#111111]">
                {isZh ? "今天" : "Today"}
              </h1>
            </div>
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 space-y-6 px-5">
          <section className="ios-group p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#6f6f78]">
                  {isZh ? "下一次訓練" : "Next workout"}
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-[-0.02em] text-[#111111]">
                  {isZh ? "開始一組訓練" : "Start a session"}
                </h2>
                <p className="mt-2 max-w-[220px] text-sm leading-5 text-[#6f6f78]">
                  {isZh
                    ? "選模板或自由訓練，專注記錄重量、次數和休息。"
                    : "Choose a template or lift freely. Keep weight, reps, and rest in flow."}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f8ee] text-[#248a3d]">
                <Dumbbell className="h-6 w-6" />
              </div>
            </div>
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="ios-primary-button mt-5 flex w-full items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              {t("home.startWorkout")}
            </button>
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <p className="ios-section-title px-0">
                {isZh ? "本週目標" : "This week"}
              </p>
              <button
                onClick={() => setShowGoalPicker(!showGoalPicker)}
                className="text-sm font-semibold text-[#248a3d]"
              >
                {isZh ? "調整" : "Edit"}
              </button>
            </div>
            <div className="ios-group p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold tracking-[-0.03em]">
                    {thisWeekWorkouts}
                    <span className="text-base font-semibold text-[#6f6f78]">
                      {" / "}
                      {weeklyGoal}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-[#6f6f78]">
                    {goalReached
                      ? isZh ? "已達成本週目標" : "Weekly goal reached"
                      : isZh ? "訓練次數" : "sessions"}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-[#fff3df] px-3 py-1.5 text-sm font-semibold text-[#b25b00]">
                  <Flame className="h-4 w-4" />
                  {stats?.streak_days || 0}
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e5e5ea]">
                <div
                  className="h-full rounded-full bg-[#34c759] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {showGoalPicker && (
                <div className="mt-4 grid grid-cols-6 gap-2">
                  {[2, 3, 4, 5, 6, 7].map((n) => (
                    <button
                      key={n}
                      onClick={() => setWeeklyGoal(n)}
                      className={`h-9 rounded-full text-sm font-semibold transition-all ${
                        weeklyGoal === n
                          ? "bg-[#111111] text-white"
                          : "bg-[#f2f2f7] text-[#111111]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="space-y-2">
            <p className="ios-section-title">
              {isZh ? "摘要" : "Summary"}
            </p>
            <div className="ios-group">
              <button
                onClick={() => router.push("/analytics")}
                className="ios-row w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e9f8ee] text-[#248a3d]">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111]">
                      {stats?.total_sessions || 0} {t("home.workouts")}
                    </p>
                    <p className="text-sm text-[#6f6f78]">
                      {Math.round(stats?.total_volume_kg || 0).toLocaleString()} {t("home.totalKg")}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-[#c7c7cc]" />
              </button>
              {costPerVisit !== null && (
                <button
                  onClick={() => router.push("/membership")}
                  className="ios-row w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef0ff] text-[#4b55a1]">
                      <TrendingDown className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#111111]">
                        {isZh ? `每次運動 $${costPerVisit}` : `$${costPerVisit}/visit`}
                      </p>
                      <p className="text-sm text-[#6f6f78]">
                        {isZh ? "會員成本" : "Membership cost"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#c7c7cc]" />
                </button>
              )}
            </div>
          </section>

          <section className="space-y-2">
            <p className="ios-section-title">
              {isZh ? "工具" : "Tools"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push("/templates")}
                className="ios-secondary-button flex flex-col items-start gap-3 p-4 text-left"
              >
                <LayoutTemplate className="h-5 w-5 text-[#248a3d]" />
                <span>{t("home.templates")}</span>
              </button>
              <button
                onClick={() => router.push("/analytics")}
                className="ios-secondary-button flex flex-col items-start gap-3 p-4 text-left"
              >
                <Trophy className="h-5 w-5 text-[#b25b00]" />
                <span>{t("home.statistics")}</span>
              </button>
            </div>
          </section>
        </main>

        <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-[#d7d7dc]/80 bg-[#f9f9fb]/90 px-5 pb-5 pt-2 backdrop-blur-xl">
          <div className="grid grid-cols-4 text-[11px] font-medium text-[#8e8e93]">
            <button className="flex flex-col items-center gap-1 text-[#248a3d]">
              <CalendarDays className="h-5 w-5" />
              {isZh ? "今天" : "Today"}
            </button>
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="flex flex-col items-center gap-1"
            >
              <Dumbbell className="h-5 w-5" />
              {isZh ? "訓練" : "Log"}
            </button>
            <button
              onClick={() => router.push("/templates")}
              className="flex flex-col items-center gap-1"
            >
              <LayoutTemplate className="h-5 w-5" />
              {t("home.templates")}
            </button>
            <button
              onClick={() => router.push("/analytics")}
              className="flex flex-col items-center gap-1"
            >
              <BarChart3 className="h-5 w-5" />
              {isZh ? "進度" : "Progress"}
            </button>
          </div>
        </nav>
      </div>

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
