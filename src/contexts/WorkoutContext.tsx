"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { exercisesApi, workoutsApi, type Exercise } from "@/lib/api";
import { usePreviousExerciseData } from "@/hooks/usePreviousExerciseData";
import {
  useTemplateDetails,
  useWorkoutTemplates,
} from "@/hooks/useWorkoutTemplates";
import { useRouter, usePathname } from "next/navigation";

// ── Types ──────────────────────────────────────────────
export interface SetLog {
  set_order: number;
  weight: number | null;
  reps: number | null;
  completed: boolean;
  previous?: string;
}

export interface ExerciseBlock {
  id: string;
  exercise: Exercise;
  sets: SetLog[];
}

export interface WorkoutSummary {
  exerciseCount: number;
  totalVolume: number;
  duration: number;
  exercises: Array<{ name: string; maxWeight: number }>;
}

interface WorkoutContextValue {
  // State
  isWorkoutActive: boolean;
  exerciseBlocks: ExerciseBlock[];
  startTime: Date | null;
  elapsedTime: number;
  templateId: string | null;
  templateInfo: { name: string; muscleGroup: string | null } | null;
  completedSummary: WorkoutSummary | null;

  // Rest timer
  restTimer: number | null;
  isRestTimerRunning: boolean;
  isRestTimerExpanded: boolean;
  defaultRestTime: number;
  REST_TIME_OPTIONS: number[];

  // Previous exercise data
  getPrevious: (exerciseId: string) => string;

  // Exercise list (for picker)
  exercises: Exercise[];

  // Actions
  startWorkout: (templateId?: string | null) => void;
  finishWorkout: () => Promise<void>;
  discardWorkout: () => void;
  clearCompletedSummary: () => void;
  addExercise: (exercise: Exercise) => Promise<void>;
  addSet: (blockIndex: number) => void;
  deleteSet: (blockIndex: number, setIndex: number) => void;
  updateSet: (
    blockIndex: number,
    setIndex: number,
    field: "weight" | "reps",
    value: string
  ) => void;
  toggleSetComplete: (blockIndex: number, setIndex: number) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  setDefaultRestTime: (seconds: number) => void;
  startRestTimer: (seconds: number) => void;
  stopRestTimer: () => void;
  addRestTime: (seconds: number) => void;
  setIsRestTimerExpanded: (expanded: boolean) => void;
  setExerciseBlocks: React.Dispatch<React.SetStateAction<ExerciseBlock[]>>;
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function useWorkout() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkout must be used within WorkoutProvider");
  return ctx;
}

// ── Provider ───────────────────────────────────────────
export function WorkoutProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // ── Core workout state ──
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [exerciseBlocks, setExerciseBlocks] = useState<ExerciseBlock[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [completedSummary, setCompletedSummary] =
    useState<WorkoutSummary | null>(null);

  // ── Exercise list ──
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // ── Rest timer ──
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);
  const [defaultRestTime, setDefaultRestTime] = useState(90);
  const [isRestTimerExpanded, setIsRestTimerExpanded] = useState(true);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);
  const REST_TIME_OPTIONS = [30, 60, 90, 120, 180];

  // ── Audio ──
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioInitializedRef = useRef(false);

  // ── Previous exercise data ──
  const exerciseIds = exerciseBlocks.map((b) => b.exercise.id);
  const { getPrevious, fetchForExercise } = usePreviousExerciseData(exerciseIds);

  // ── Template hooks ──
  const { exercises: templateExercises } = useTemplateDetails(
    isWorkoutActive ? templateId : null
  );
  const { templates, updateTemplateUsage } = useWorkoutTemplates();

  const templateInfo = templateId
    ? (() => {
        const t = templates.find((t) => t.id === templateId);
        return t ? { name: t.name, muscleGroup: t.muscleGroup } : null;
      })()
    : null;

  // ── Initialize AudioContext on first user interaction ──
  useEffect(() => {
    const initAudio = () => {
      if (!audioInitializedRef.current) {
        try {
          audioContextRef.current = new (window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext)();
          // Resume in case it's suspended (mobile Safari)
          audioContextRef.current.resume();
          audioInitializedRef.current = true;
        } catch (e) {
          console.error("Failed to init AudioContext:", e);
        }
      }
    };
    document.addEventListener("touchstart", initAudio, { once: true });
    document.addEventListener("click", initAudio, { once: true });
    return () => {
      document.removeEventListener("touchstart", initAudio);
      document.removeEventListener("click", initAudio);
    };
  }, []);

  // ── Fetch exercises on mount ──
  useEffect(() => {
    exercisesApi.list().then(setExercises).catch(console.error);
  }, []);

  // ── Elapsed time ticker ──
  useEffect(() => {
    if (!isWorkoutActive || !startTime) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isWorkoutActive, startTime]);

  // ── Load template exercises into blocks ──
  useEffect(() => {
    if (
      isWorkoutActive &&
      templateId &&
      templateExercises.length > 0 &&
      !templateLoaded
    ) {
      const blocks: ExerciseBlock[] = templateExercises.map((te, index) => ({
        id: `block-${te.exercise?.id || index}-${Date.now()}`,
        exercise: {
          id: te.exercise?.id || "",
          name: te.exercise?.name || "",
          type: te.exercise?.type || null,
          muscleGroup: te.exercise?.muscleGroup || null,
          isCustom: null,
          createdAt: null,
          deletedAt: null,
        },
        sets: Array.from({ length: te.defaultSets || 3 }, (_, i) => ({
          set_order: i + 1,
          weight: te.defaultWeight || null,
          reps: te.defaultReps || null,
          completed: false,
        })),
      }));
      setExerciseBlocks(blocks);
      setTemplateLoaded(true);
      updateTemplateUsage(templateId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWorkoutActive, templateId, templateExercises.length, templateLoaded]);

  // ── Sound ──
  const playRestEndSound = useCallback(() => {
    try {
      const ctx =
        audioContextRef.current ||
        new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
      audioContextRef.current = ctx;

      // Make sure context is running
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const playBeep = (time: number) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.frequency.value = 880;
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.3, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
        oscillator.start(time);
        oscillator.stop(time + 0.15);
      };

      const now = ctx.currentTime;
      playBeep(now);
      playBeep(now + 0.2);
      playBeep(now + 0.4);
    } catch (error) {
      console.error("Failed to play sound:", error);
    }
  }, []);

  // ── Rest timer ──
  const startRestTimerFn = useCallback(
    (seconds: number) => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
      setRestTimer(seconds);
      setIsRestTimerRunning(true);
      setIsRestTimerExpanded(true);

      restTimerRef.current = setInterval(() => {
        setRestTimer((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(restTimerRef.current!);
            setIsRestTimerRunning(false);
            playRestEndSound();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [playRestEndSound]
  );

  const stopRestTimer = useCallback(() => {
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    setRestTimer(null);
    setIsRestTimerRunning(false);
  }, []);

  const addRestTimeFn = useCallback((seconds: number) => {
    setRestTimer((prev) => (prev || 0) + seconds);
  }, []);

  // Cleanup rest timer on unmount
  useEffect(() => {
    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, []);

  // ── Workout lifecycle ──
  const startWorkout = useCallback((tid?: string | null) => {
    setIsWorkoutActive(true);
    setStartTime(new Date());
    setElapsedTime(0);
    setExerciseBlocks([]);
    setTemplateId(tid || null);
    setTemplateLoaded(false);
    setCompletedSummary(null);
  }, []);

  const calculateSummary = useCallback((): WorkoutSummary => {
    let totalVolume = 0;
    const exerciseSummaries: Array<{ name: string; maxWeight: number }> = [];

    exerciseBlocks.forEach((block) => {
      let maxWeight = 0;
      block.sets.forEach((set) => {
        if (set.completed && set.weight !== null && set.reps) {
          totalVolume += Math.abs(set.weight) * set.reps;
          if (Math.abs(set.weight) > maxWeight)
            maxWeight = Math.abs(set.weight);
        }
      });
      if (maxWeight > 0) {
        exerciseSummaries.push({ name: block.exercise.name, maxWeight });
      }
    });

    return {
      exerciseCount: exerciseBlocks.length,
      totalVolume: Math.round(totalVolume),
      duration: elapsedTime,
      exercises: exerciseSummaries,
    };
  }, [exerciseBlocks, elapsedTime]);

  const finishWorkout = useCallback(async () => {
    if (!startTime) return;
    const endTime = new Date();

    const logs: Array<{
      exercise_id: string;
      set_order: number;
      weight: number | null;
      reps: number | null;
    }> = [];

    exerciseBlocks.forEach((block) => {
      block.sets.forEach((set) => {
        if (set.completed) {
          logs.push({
            exercise_id: block.exercise.id,
            set_order: set.set_order,
            weight: set.weight,
            reps: set.reps,
          });
        }
      });
    });

    try {
      await workoutsApi.create({
        started_at: startTime.toISOString(),
        ended_at: endTime.toISOString(),
        template_id: templateId || undefined,
        logs,
      });

      const summary = calculateSummary();
      stopRestTimer();
      setIsWorkoutActive(false);
      setCompletedSummary(summary);
    } catch (error) {
      console.error("Failed to save workout:", error);
    }
  }, [startTime, exerciseBlocks, templateId, calculateSummary, stopRestTimer]);

  const discardWorkout = useCallback(() => {
    stopRestTimer();
    setIsWorkoutActive(false);
    setExerciseBlocks([]);
    setStartTime(null);
    setElapsedTime(0);
    setTemplateId(null);
    setTemplateLoaded(false);
    setCompletedSummary(null);
  }, [stopRestTimer]);

  const clearCompletedSummary = useCallback(() => {
    setCompletedSummary(null);
  }, []);

  // ── Exercise block mutations ──
  const addExercise = useCallback(
    async (exercise: Exercise) => {
      await fetchForExercise(exercise.id);
      setExerciseBlocks((prev) => [
        ...prev,
        {
          id: `block-${exercise.id}-${Date.now()}`,
          exercise,
          sets: [{ set_order: 1, weight: null, reps: null, completed: false }],
        },
      ]);
    },
    [fetchForExercise]
  );

  const addSet = useCallback((blockIndex: number) => {
    setExerciseBlocks((prev) => {
      const updated = prev.map((b, i) => {
        if (i !== blockIndex) return b;
        const lastCompleted = [...b.sets].reverse().find((s) => s.completed);
        return {
          ...b,
          sets: [
            ...b.sets,
            {
              set_order: b.sets.length + 1,
              weight: lastCompleted?.weight ?? null,
              reps: lastCompleted?.reps ?? null,
              completed: false,
            },
          ],
        };
      });
      return updated;
    });
  }, []);

  const deleteSet = useCallback((blockIndex: number, setIndex: number) => {
    setExerciseBlocks((prev) => {
      const block = prev[blockIndex];
      if (block.sets.length <= 1) return prev;
      return prev.map((b, i) => {
        if (i !== blockIndex) return b;
        const newSets = b.sets
          .filter((_, si) => si !== setIndex)
          .map((s, si) => ({ ...s, set_order: si + 1 }));
        return { ...b, sets: newSets };
      });
    });
  }, []);

  const updateSet = useCallback(
    (
      blockIndex: number,
      setIndex: number,
      field: "weight" | "reps",
      value: string
    ) => {
      setExerciseBlocks((prev) =>
        prev.map((b, bi) => {
          if (bi !== blockIndex) return b;
          return {
            ...b,
            sets: b.sets.map((s, si) => {
              if (si !== setIndex) return s;
              return { ...s, [field]: value === "" ? null : parseFloat(value) };
            }),
          };
        })
      );
    },
    []
  );

  const toggleSetComplete = useCallback(
    (blockIndex: number, setIndex: number) => {
      const block = exerciseBlocks[blockIndex];
      const set = block.sets[setIndex];

      // Validate: allow weight=0 or negative for assisted exercises
      if (!set.completed) {
        if (set.weight === null || set.reps === null || set.reps <= 0) {
          alert("請先輸入重量和次數！");
          return;
        }
      }

      setExerciseBlocks((prev) =>
        prev.map((b, bi) => {
          if (bi !== blockIndex) return b;
          return {
            ...b,
            sets: b.sets.map((s, si) => {
              if (si !== setIndex) return s;
              return { ...s, completed: !s.completed };
            }),
          };
        })
      );

      // Start rest timer & auto-fill next set when completing
      if (!set.completed) {
        startRestTimerFn(defaultRestTime);

        const nextSetIndex = setIndex + 1;
        if (nextSetIndex < block.sets.length) {
          const nextSet = block.sets[nextSetIndex];
          if (!nextSet.completed) {
            setExerciseBlocks((prev) =>
              prev.map((b, bi) => {
                if (bi !== blockIndex) return b;
                return {
                  ...b,
                  sets: b.sets.map((s, si) => {
                    if (si !== nextSetIndex) return s;
                    return { ...s, weight: set.weight, reps: set.reps };
                  }),
                };
              })
            );
          }
        }
      }
    },
    [exerciseBlocks, defaultRestTime, startRestTimerFn]
  );

  const reorderBlocks = useCallback((activeId: string, overId: string) => {
    setExerciseBlocks((items) => {
      const oldIndex = items.findIndex((i) => i.id === activeId);
      const newIndex = items.findIndex((i) => i.id === overId);
      if (oldIndex === -1 || newIndex === -1) return items;
      const result = [...items];
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      return result;
    });
  }, []);

  // ── Context value ──
  const value: WorkoutContextValue = {
    isWorkoutActive,
    exerciseBlocks,
    startTime,
    elapsedTime,
    templateId,
    templateInfo,
    completedSummary,
    restTimer,
    isRestTimerRunning,
    isRestTimerExpanded,
    defaultRestTime,
    REST_TIME_OPTIONS,
    getPrevious,
    exercises,
    startWorkout,
    finishWorkout,
    discardWorkout,
    clearCompletedSummary,
    addExercise,
    addSet,
    deleteSet,
    updateSet,
    toggleSetComplete,
    reorderBlocks,
    setDefaultRestTime,
    startRestTimer: startRestTimerFn,
    stopRestTimer,
    addRestTime: addRestTimeFn,
    setIsRestTimerExpanded,
    setExerciseBlocks,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
      {/* Active workout banner — shown outside /log when workout is active */}
      {isWorkoutActive && pathname !== "/log" && (
        <ActiveWorkoutBanner
          elapsedTime={elapsedTime}
          restTimer={restTimer}
          isRestTimerRunning={isRestTimerRunning}
          onClick={() => router.push("/log")}
        />
      )}
    </WorkoutContext.Provider>
  );
}

// ── Floating banner ────────────────────────────────────
function ActiveWorkoutBanner({
  elapsedTime,
  restTimer,
  isRestTimerRunning,
  onClick,
}: {
  elapsedTime: number;
  restTimer: number | null;
  isRestTimerRunning: boolean;
  onClick: () => void;
}) {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#58CC02] text-white rounded-full shadow-lg px-5 py-3 flex items-center gap-3 hover:bg-[#46A302] active:scale-95 transition-all"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
      </span>
      <span className="font-bold">運動中</span>
      <span className="font-mono">{formatTime(elapsedTime)}</span>
      {isRestTimerRunning && restTimer !== null && (
        <span className="bg-white/20 rounded-full px-2 py-0.5 text-sm font-mono">
          休息 {Math.floor(restTimer / 60)}:
          {(restTimer % 60).toString().padStart(2, "0")}
        </span>
      )}
      <span className="text-sm opacity-80">← 返回</span>
    </button>
  );
}
