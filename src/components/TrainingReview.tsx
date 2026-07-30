"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CalendarCheck, ChevronDown, Dumbbell, Plus, Target, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { exercisesApi, goalsApi, type Exercise, type GoalType, type TrainingReviewData, type Workout } from "@/lib/api";

const groupLabels: Record<string, string> = {
  Chest: "胸",
  Back: "背",
  Legs: "腿",
  Shoulders: "肩",
  Arms: "手臂",
  Core: "核心",
  "Full Body": "全身",
  Other: "其他",
};

const typeLabels: Record<GoalType, string> = {
  strength: "力量",
  frequency: "頻率",
  volume: "訓練量",
};

function formatValue(value: number | null, type: GoalType) {
  if (value === null) return "—";
  return type === "volume" ? `${Math.round(value).toLocaleString()} kg` : `${Math.round(value * 10) / 10}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("zh-TW", { month: "numeric", day: "numeric" });
}

function GoalSetup({ exercises, onCreated }: { exercises: Exercise[]; onCreated: () => Promise<void> }) {
  const [type, setType] = useState<GoalType>("strength");
  const [exerciseId, setExerciseId] = useState(exercises[0]?.id || "");
  const [target, setTarget] = useState("100");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      await goalsApi.create({ type, target: Number(target), ...(type === "strength" ? { exerciseId } : {}) });
      await onCreated();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "目標建立失敗");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border border-[#e6e6eb] bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#202124]"><Target className="h-5 w-5 text-[#58CC02]" />建立訓練目標</CardTitle>
        <p className="text-sm text-[#73747c]">先選擇一個可量化的方向，系統會用既有完整訓練建立基準。</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="block text-sm font-semibold text-[#45464d]">目標類型
          <select aria-label="目標類型" className="mt-1 h-10 w-full rounded-xl bg-[#f2f2f7] px-3" value={type} onChange={(event) => setType(event.target.value as GoalType)}>
            <option value="strength">力量（估算 1RM）</option>
            <option value="frequency">頻率（每週次數）</option>
            <option value="volume">訓練量（每週 kg）</option>
          </select>
        </label>
        {type === "strength" && (
          <label className="block text-sm font-semibold text-[#45464d]">追蹤動作
            <select aria-label="追蹤動作" className="mt-1 h-10 w-full rounded-xl bg-[#f2f2f7] px-3" value={exerciseId} onChange={(event) => setExerciseId(event.target.value)}>
              {exercises.filter((exercise) => exercise.type === "Strength" || !exercise.type).map((exercise) => <option key={exercise.id} value={exercise.id}>{exercise.nameZh || exercise.name}</option>)}
            </select>
          </label>
        )}
        <label className="block text-sm font-semibold text-[#45464d]">目標值
          <Input aria-label="目標值" className="mt-1" min="1" step="0.1" type="number" value={target} onChange={(event) => setTarget(event.target.value)} />
        </label>
        {error && <p className="text-sm text-[#d64545]">{error}</p>}
        <Button className="w-full bg-[#58CC02] hover:bg-[#48ad00]" disabled={saving || (type === "strength" && !exerciseId)} onClick={submit}>{saving ? "建立中…" : "建立 8 週目標"}</Button>
      </CardContent>
    </Card>
  );
}

function WeeklyProgress({ review, onAccepted }: { review: TrainingReviewData; onAccepted: () => Promise<void> }) {
  const suggestion = review.weeklyGoalSet?.status === "suggested" ? review.weeklyGoalSet.actions : null;
  const actions = review.weeklyProgress.length > 0 ? review.weeklyProgress : suggestion || [];
  const [accepting, setAccepting] = useState(false);
  const acceptSuggestion = async () => {
    if (!review.activeGoal || !suggestion) return;
    setAccepting(true);
    try {
      if (review.weeklyGoalSet?.id) {
        await goalsApi.updateWeekly({ id: review.weeklyGoalSet.id, status: "accepted" });
      } else {
        await goalsApi.createWeekly({ goalId: review.activeGoal.id, actions: suggestion, status: "accepted" });
      }
      await onAccepted();
    } finally {
      setAccepting(false);
    }
  };

  if (actions.length === 0) return null;
  return (
    <Card className="border border-[#e6e6eb] bg-white">
      <CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-base text-[#202124]">本週進度</CardTitle>{suggestion && <span className="rounded-full bg-[#fff4d7] px-2 py-1 text-xs font-semibold text-[#956c00]">建議</span>}</div><p className="text-sm text-[#73747c]">只計入完整訓練與有效紀錄。</p></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-3">
          {actions.map((action) => {
            const achieved = action.achievedSessions ?? 0;
            return <div className="rounded-2xl bg-[#f7f7f9] p-3" key={action.id}>
              <div className="flex items-center justify-between"><span className="font-semibold text-[#292a31]">{groupLabels[action.muscleGroup || ""] || action.label}</span><span className="text-sm font-bold text-[#58CC02]">{suggestion ? `預計 ${action.expectedSessions} 次` : `${achieved}/${action.expectedSessions}`}</span></div>
              {!suggestion && <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e1e1e7]"><div className="h-full rounded-full bg-[#58CC02]" style={{ width: `${Math.min(100, (achieved / action.expectedSessions) * 100)}%` }} /></div>}
            </div>;
          })}
        </div>
        {suggestion && <Button className="w-full" disabled={accepting} onClick={acceptSuggestion}>{accepting ? "接受中…" : "接受本週目標"}</Button>}
      </CardContent>
    </Card>
  );
}

function GrowthCurve({ review }: { review: TrainingReviewData }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const points = review.growthCurve;
  const goal = review.activeGoal;
  if (!goal || points.length === 0) return <Card className="border border-[#e6e6eb] bg-white"><CardContent className="py-8 text-center text-sm text-[#73747c]">目前沒有可比較的成長資料。</CardContent></Card>;
  const observed = points.filter((point) => point.value !== null).map((point) => point.value as number);
  const max = Math.max(goal.target, goal.baseline, ...observed, 1);
  const min = Math.max(0, Math.min(goal.baseline, ...observed, goal.target) * 0.85);
  const y = (value: number) => 102 - ((value - min) / Math.max(1, max - min)) * 82;
  const x = (index: number) => 28 + (index / Math.max(1, points.length - 1)) * 276;
  const segments: string[][] = [];
  let segment: string[] = [];
  points.forEach((point, index) => {
    if (point.value === null) {
      if (segment.length > 0) segments.push(segment);
      segment = [];
    } else segment.push(`${x(index)},${y(point.value)}`);
  });
  if (segment.length > 0) segments.push(segment);
  const selected = selectedIndex === null ? null : points[selectedIndex];
  return <Card className="border border-[#e6e6eb] bg-white">
    <CardHeader className="pb-0"><div className="flex items-start justify-between"><div><CardTitle className="text-base text-[#202124]">成長曲線</CardTitle><p className="mt-1 text-sm text-[#73747c]">{typeLabels[goal.type]} · 目前目標週期 {goal.windowWeeks} 週</p></div><span className="rounded-full bg-[#e8f8df] px-2 py-1 text-xs font-semibold text-[#428d16]">估算值</span></div></CardHeader>
    <CardContent className="pt-3">
      <svg aria-label="訓練成長曲線" className="h-44 w-full" role="img" viewBox="0 0 320 130">
        <line stroke="#e7e7eb" x1="28" x2="304" y1={y(goal.target)} y2={y(goal.target)} strokeDasharray="4 4" />
        <line stroke="#b7bbc3" x1="28" x2="304" y1={y(goal.baseline)} y2={y(goal.baseline)} strokeDasharray="2 3" />
        {segments.map((path, index) => <polyline fill="none" key={index} points={path.join(" ")} stroke="#58CC02" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />)}
        {points.map((point, index) => point.value === null ? <circle aria-label={`${point.weekStart} 無資料`} className="cursor-pointer" cx={x(index)} cy="112" fill="#fff" key={point.weekStart} onClick={() => setSelectedIndex(index)} r="3" stroke="#c9cbd1" /> : <circle aria-label={`${point.weekStart} ${point.value}`} className="cursor-pointer" cx={x(index)} cy={y(point.value)} fill="#58CC02" key={point.weekStart} onClick={() => setSelectedIndex(index)} r={selectedIndex === index ? 6 : 4} stroke="#fff" strokeWidth="2" />)}
        <text fill="#8a8c94" fontSize="8" x="304" y={y(goal.target) - 3} textAnchor="end">目標 {formatValue(goal.target, goal.type)}</text>
        <text fill="#8a8c94" fontSize="8" x="304" y={y(goal.baseline) - 3} textAnchor="end">基準 {formatValue(goal.baseline, goal.type)}</text>
      </svg>
      <div className="flex justify-between text-[10px] text-[#8a8c94]"><span>{formatDate(points[0].weekStart)}</span><span>{formatDate(points[points.length - 1].weekStart)}</span></div>
      {selected && <div className="mt-3 rounded-2xl bg-[#f7f7f9] p-3 text-sm text-[#45464d]" data-testid="growth-evidence">
        <div className="flex items-center justify-between"><strong>{formatDate(selected.weekStart)} 的證據</strong><button aria-label="關閉證據" className="text-[#73747c]" onClick={() => setSelectedIndex(null)}>×</button></div>
        {selected.value === null ? <p className="mt-2 text-[#73747c]">這週沒有有效力量紀錄，保留為空白。</p> : <><p className="mt-2">估算 1RM：<strong>{formatValue(selected.value, goal.type)}</strong></p><p className="text-[#73747c]">實際完成：{selected.actualWeight} kg × {selected.reps} 次 · {selected.setCount} 組 · 週訓練量 {Math.round(selected.weeklyVolume).toLocaleString()} kg</p></>}
      </div>}
    </CardContent>
  </Card>;
}

function TrainingTimeline({ review }: { review: TrainingReviewData }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return <Card className="border border-[#e6e6eb] bg-white"><CardHeader className="pb-3"><CardTitle className="text-base text-[#202124]">本週相關訓練</CardTitle><p className="text-sm text-[#73747c]">只列出與目前目標相關的完整訓練。</p></CardHeader><CardContent>
    {review.timeline.length === 0 ? <p className="py-5 text-center text-sm text-[#73747c]">本週還沒有可追蹤的相關訓練。</p> : <div className="divide-y divide-[#eeeeF2]">{review.timeline.map((item) => <div className="py-3 first:pt-0 last:pb-0" key={item.workoutId}>
      <button className="flex w-full items-center justify-between text-left" onClick={() => setExpanded(expanded === item.workoutId ? null : item.workoutId)}><div><p className="font-semibold text-[#292a31]">{formatDate(item.date)} · {item.exercises.join("、")}</p><p className="mt-1 text-xs text-[#73747c]">{item.setCount} 組 · {Math.round(item.volume).toLocaleString()} kg</p></div><ChevronDown className={`h-4 w-4 text-[#8a8c94] transition-transform ${expanded === item.workoutId ? "rotate-180" : ""}`} /></button>
      {expanded === item.workoutId && <div className="mt-3 space-y-1 rounded-xl bg-[#f7f7f9] p-3 text-xs text-[#5e6068]">{item.sets.map((set) => <div className="flex justify-between" key={set.logId}><span>{set.exerciseName || "動作"}</span><span>{set.weight} kg × {set.reps} · {Math.round(set.volume)} kg</span></div>)}</div>}
    </div>)}</div>}
  </CardContent></Card>;
}

function HistoricalTraining({ workouts }: { workouts: Workout[] }) {
  if (workouts.length === 0) return null;
  return <Card className="border border-[#e6e6eb] bg-white"><CardHeader className="pb-3"><CardTitle className="text-base text-[#202124]">歷史訓練紀錄</CardTitle><p className="text-sm text-[#73747c]">共 {workouts.length} 次完整紀錄；未列入目前目標的內容仍保留。</p></CardHeader><CardContent><div className="space-y-2">{workouts.slice(0, 5).map((workout) => <div className="flex items-center justify-between rounded-xl bg-[#f7f7f9] px-3 py-2.5" key={workout.id}><div><p className="text-sm font-semibold text-[#292a31]">{formatDate(workout.startedAt)}</p><p className="text-xs text-[#73747c]">{workout.workout_logs?.length || 0} 組</p></div><span className="text-xs text-[#73747c]">{workout.endedAt ? "已完成" : "未完成"}</span></div>)}</div></CardContent></Card>;
}

export default function TrainingReview() {
  const router = useRouter();
  const [review, setReview] = useState<TrainingReviewData | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyCount, setHistoryCount] = useState(0);

  const refresh = useCallback(async () => {
    const [nextReview, exerciseList] = await Promise.all([goalsApi.review(), exercisesApi.list().catch(() => [])]);
    setReview(nextReview);
    setExercises(exerciseList);
  }, []);
  useEffect(() => {
    let cancelled = false;
    const loadInitialReview = async () => {
      try {
        const [nextReview, exerciseList, workoutResponse] = await Promise.all([
          goalsApi.review(),
          exercisesApi.list().catch(() => []),
          fetch("/api/workouts", { credentials: "include" }).then((response) => response.ok ? response.json() : []).catch(() => []),
        ]);
        if (cancelled) return;
        setReview(nextReview);
        setExercises(exerciseList);
        setWorkouts(Array.isArray(workoutResponse) ? workoutResponse : []);
        setHistoryCount(Array.isArray(workoutResponse) ? workoutResponse.length : 0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void loadInitialReview();
    return () => { cancelled = true; };
  }, []);

  if (loading || !review) return <div className="flex min-h-screen items-center justify-center bg-[#f7f7f9] text-[#73747c]">載入訓練回顧…</div>;
  const goal = review.activeGoal;
  const summary = review.progressSummary;
  const deltaLabel = summary?.delta === null || summary?.delta === undefined ? "尚無本週觀察值" : `${summary.delta >= 0 ? "+" : ""}${formatValue(summary.delta, goal?.type || "strength")} 相較基準`;

  return <main className="min-h-screen bg-[#f7f7f9] pb-10"><header className="sticky top-0 z-10 border-b border-[#e8e8ed] bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3"><Button aria-label="返回" size="sm" variant="ghost" onClick={() => router.push("/")}><ArrowLeft className="h-4 w-4" />返回</Button><h1 className="font-bold text-[#202124]">訓練回顧</h1><div className="w-16" /></div></header>
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-4">
      {!goal ? <><Card className="border border-[#e6e6eb] bg-white"><CardContent className="py-7"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f8df]"><Target className="h-6 w-6 text-[#58CC02]" /></div><h2 className="text-xl font-bold text-[#202124]">尚未設定訓練目標</h2><p className="mt-2 text-sm leading-6 text-[#73747c]">{historyCount > 0 ? "你仍可查看既有訓練紀錄；建立目標後，這裡會顯示週進度與成長證據。" : "先完成一次訓練，再設定目標，回顧才會有可比較的資料。"}</p></CardContent></Card><GoalSetup exercises={exercises} onCreated={refresh} /></> : <>
        <section><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#73747c]">目前目標 · {typeLabels[goal.type]}</p><div className="mt-1 flex items-end justify-between"><h2 className="text-2xl font-bold text-[#202124]">{goal.name || (goal.type === "strength" ? "力量成長" : `每週${typeLabels[goal.type]}`)}</h2><span className="text-sm text-[#73747c]">{formatValue(goal.target, goal.type)} / {goal.windowWeeks} 週</span></div></section>
        <WeeklyProgress review={review} onAccepted={refresh} />
        <Card className="border border-[#e6e6eb] bg-white"><CardContent className="py-5"><div className="flex items-start gap-3"><CalendarCheck className="mt-0.5 h-5 w-5 text-[#58CC02]" /><div><p className="text-xs font-semibold text-[#73747c]">進度摘要</p><p className="mt-1 font-semibold text-[#292a31]">本週完成 {summary?.completedActions || 0}/{summary?.expectedActions || 0} 個週目標；{deltaLabel}。</p></div></div></CardContent></Card>
        <GrowthCurve review={review} /><TrainingTimeline review={review} />
        <div className="grid grid-cols-2 gap-3"><Card className="border border-[#e6e6eb] bg-white"><CardContent className="p-4"><Dumbbell className="h-5 w-5 text-[#1CB0F6]" /><p className="mt-3 text-2xl font-bold text-[#202124]">{review.supportingMetrics.frequency.value}</p><p className="text-xs text-[#73747c]">本週訓練次數</p></CardContent></Card><Card className="border border-[#e6e6eb] bg-white"><CardContent className="p-4"><TrendingUp className="h-5 w-5 text-[#58CC02]" /><p className="mt-3 text-2xl font-bold text-[#202124]">{Math.round(review.supportingMetrics.volume.value).toLocaleString()}</p><p className="text-xs text-[#73747c]">本週訓練量 kg</p></CardContent></Card></div>
      </>}
      <HistoricalTraining workouts={workouts} />
      <Button className="w-full" variant="outline" onClick={() => router.push("/log")}><Plus className="h-4 w-4" />記錄訓練</Button>
    </div>
  </main>;
}
