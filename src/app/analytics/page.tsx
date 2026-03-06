"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Calendar, Dumbbell } from "lucide-react";
import {
  workoutsApi,
  analyticsApi,
  type Workout,
  type MuscleGroupData,
  type TrendsData,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";

const MUSCLE_COLORS: Record<string, string> = {
  chest: "#FF4B4B",
  back: "#1CB0F6",
  legs: "#58CC02",
  shoulders: "#FF8C42",
  arms: "#CE82FF",
  core: "#FFD700",
  other: "#AFAFAF",
};

const MUSCLE_LABELS_ZH: Record<string, string> = {
  chest: "胸",
  back: "背",
  legs: "腿",
  shoulders: "肩",
  arms: "手臂",
  core: "核心",
  other: "其他",
};

export default function AnalyticsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroupData[]>([]);
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [workoutData, mgData, trendData] = await Promise.all([
          workoutsApi.list(),
          analyticsApi.muscleGroups().catch(() => []),
          analyticsApi.trends().catch(() => null),
        ]);
        setWorkouts(workoutData);
        setMuscleGroups(mgData);
        setTrends(trendData);
        if (trendData?.exerciseTrends?.length) {
          setSelectedExercise(trendData.exerciseTrends[0].exerciseId);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Calculate stats
  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((acc, w) => {
    return (
      acc +
      (w.workout_logs || []).reduce(
        (sum, log) => sum + (log.weight || 0) * (log.reps || 0),
        0
      )
    );
  }, 0);
  const totalSets = workouts.reduce(
    (acc, w) => acc + (w.workout_logs || []).length,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">{t("common.loading")}</div>
      </div>
    );
  }

  const maxMgVolume = muscleGroups.length > 0 ? muscleGroups[0].totalVolume : 1;
  const maxFrequency = trends
    ? Math.max(...trends.weeklyFrequency.map((w) => w.count), 1)
    : 1;

  const selectedTrend = trends?.exerciseTrends.find(
    (e) => e.exerciseId === selectedExercise
  );
  const maxTrendWeight = selectedTrend
    ? Math.max(...selectedTrend.weeks.map((w) => w.maxWeight), 1)
    : 1;

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t("common.back")}
            </Button>
            <h1 className="font-bold text-lg text-[#2D3648]">
              {t("analytics.title")}
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white border-2 border-[#E5E5E5]">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto text-[#58CC02] mb-2" />
              <p className="text-2xl font-bold text-[#2D3648]">
                {totalWorkouts}
              </p>
              <p className="text-xs text-[#AFAFAF]">{t("home.workouts")}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-[#E5E5E5]">
            <CardContent className="p-4 text-center">
              <Dumbbell className="h-6 w-6 mx-auto text-[#1CB0F6] mb-2" />
              <p className="text-2xl font-bold text-[#2D3648]">
                {Math.round(totalVolume).toLocaleString()}
              </p>
              <p className="text-xs text-[#AFAFAF]">{t("home.totalKg")}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-[#E5E5E5]">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto text-[#FF8C42] mb-2" />
              <p className="text-2xl font-bold text-[#2D3648]">{totalSets}</p>
              <p className="text-xs text-[#AFAFAF]">
                {t("analytics.totalSets")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Muscle Group Volume Chart */}
        {muscleGroups.length > 0 && (
          <Card className="bg-white border-2 border-[#E5E5E5]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#2D3648] text-base">
                {t("analytics.muscleGroups")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-3">
                {muscleGroups.map((mg) => {
                  const pct = (mg.totalVolume / maxMgVolume) * 100;
                  const color =
                    MUSCLE_COLORS[mg.muscleGroup] || MUSCLE_COLORS.other;
                  const label =
                    MUSCLE_LABELS_ZH[mg.muscleGroup] || mg.muscleGroup;
                  return (
                    <div key={mg.muscleGroup}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-[#2D3648]">
                          {label}
                        </span>
                        <span className="text-[#AFAFAF]">
                          {mg.totalVolume.toLocaleString()} kg
                        </span>
                      </div>
                      <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Frequency Chart */}
        {trends && (
          <Card className="bg-white border-2 border-[#E5E5E5]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#2D3648] text-base">
                {t("analytics.weeklyFrequency")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-end gap-2 h-32">
                {trends.weeklyFrequency.map((wf, i) => {
                  const heightPct = (wf.count / maxFrequency) * 100;
                  const weekLabel = new Date(wf.week).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric" }
                  );
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span className="text-xs font-bold text-[#2D3648]">
                        {wf.count}
                      </span>
                      <div className="w-full flex items-end" style={{ height: "80px" }}>
                        <div
                          className="w-full rounded-t-md transition-all duration-500"
                          style={{
                            height: `${Math.max(heightPct, 4)}%`,
                            backgroundColor:
                              i === trends.weeklyFrequency.length - 1
                                ? "#58CC02"
                                : "#E5E5E5",
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-[#AFAFAF] whitespace-nowrap">
                        {weekLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exercise Trend Lines */}
        {trends && trends.exerciseTrends.length > 0 && (
          <Card className="bg-white border-2 border-[#E5E5E5]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#2D3648] text-base">
                {t("analytics.trends")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              {/* Exercise selector */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-hide">
                {trends.exerciseTrends.map((ex) => (
                  <button
                    key={ex.exerciseId}
                    onClick={() => setSelectedExercise(ex.exerciseId)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      selectedExercise === ex.exerciseId
                        ? "bg-[#58CC02] text-white"
                        : "bg-gray-100 text-[#2D3648]"
                    }`}
                  >
                    {ex.exerciseName}
                  </button>
                ))}
              </div>

              {/* SVG Line Chart */}
              {selectedTrend && (
                <div>
                  <p className="text-xs text-[#AFAFAF] mb-2">
                    {t("analytics.maxWeight")} (kg)
                  </p>
                  <svg
                    viewBox="0 0 320 120"
                    className="w-full"
                    style={{ height: "120px" }}
                  >
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                      <line
                        key={pct}
                        x1="30"
                        y1={10 + (1 - pct) * 90}
                        x2="310"
                        y2={10 + (1 - pct) * 90}
                        stroke="#F0F0F0"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Y-axis labels */}
                    <text
                      x="25"
                      y="14"
                      textAnchor="end"
                      className="text-[9px]"
                      fill="#AFAFAF"
                    >
                      {maxTrendWeight}
                    </text>
                    <text
                      x="25"
                      y="104"
                      textAnchor="end"
                      className="text-[9px]"
                      fill="#AFAFAF"
                    >
                      0
                    </text>

                    {/* Line path */}
                    <polyline
                      fill="none"
                      stroke="#58CC02"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={selectedTrend.weeks
                        .map((w, i) => {
                          const x =
                            30 +
                            (i / (selectedTrend.weeks.length - 1)) * 280;
                          const y =
                            10 +
                            (1 - w.maxWeight / maxTrendWeight) * 90;
                          return `${x},${y}`;
                        })
                        .join(" ")}
                    />

                    {/* Data points */}
                    {selectedTrend.weeks.map((w, i) => {
                      const x =
                        30 +
                        (i / (selectedTrend.weeks.length - 1)) * 280;
                      const y =
                        10 + (1 - w.maxWeight / maxTrendWeight) * 90;
                      return (
                        <g key={i}>
                          <circle
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#58CC02"
                            stroke="white"
                            strokeWidth="2"
                          />
                          {w.maxWeight > 0 && (
                            <text
                              x={x}
                              y={y - 8}
                              textAnchor="middle"
                              className="text-[8px]"
                              fill="#2D3648"
                              fontWeight="bold"
                            >
                              {w.maxWeight}
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* X-axis labels */}
                    {selectedTrend.weeks.map((w, i) => {
                      const x =
                        30 +
                        (i / (selectedTrend.weeks.length - 1)) * 280;
                      const label = new Date(w.week).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric" }
                      );
                      return (
                        <text
                          key={i}
                          x={x}
                          y="118"
                          textAnchor="middle"
                          className="text-[8px]"
                          fill="#AFAFAF"
                        >
                          {label}
                        </text>
                      );
                    })}
                  </svg>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Workouts */}
        <Card className="bg-white border-2 border-[#E5E5E5]">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#2D3648] text-base">
              {t("analytics.recentWorkouts")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {workouts.length === 0 ? (
              <p className="text-center text-[#AFAFAF] py-8">
                {t("analytics.noWorkoutsYet")}
              </p>
            ) : (
              <div className="space-y-3">
                {workouts.slice(0, 7).map((workout) => {
                  const volume = (workout.workout_logs || []).reduce(
                    (sum, log) => sum + (log.weight || 0) * (log.reps || 0),
                    0
                  );
                  const date = new Date(workout.startedAt);
                  return (
                    <div
                      key={workout.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#F7F7F7]"
                    >
                      <div>
                        <p className="font-medium text-[#2D3648]">
                          {date.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-[#AFAFAF]">
                          {(workout.workout_logs || []).length}{" "}
                          {t("common.sets")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#58CC02]">
                          {Math.round(volume).toLocaleString()} kg
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
