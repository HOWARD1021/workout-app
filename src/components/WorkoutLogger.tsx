"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Check,
  Plus,
  ChevronDown,
  Dumbbell,
  Clock,
  ArrowLeft,
  Timer,
  X,
  Trash2,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { exercisesApi, workoutsApi, type Exercise } from "@/lib/api";
import { usePreviousExerciseData } from "@/hooks/usePreviousExerciseData";
import {
  useTemplateDetails,
  useWorkoutTemplates,
} from "@/hooks/useWorkoutTemplates";
import { useRouter, useSearchParams } from "next/navigation";
import DuckMascot from "./DuckMascot";

interface SetLog {
  set_order: number;
  weight: number | null;
  reps: number | null;
  completed: boolean;
  previous?: string;
}

interface ExerciseBlock {
  id: string; // Unique ID for drag-and-drop
  exercise: Exercise;
  sets: SetLog[];
}

// Sortable Exercise Card Component
function SortableExerciseCard({
  block,
  blockIndex,
  getPrevious,
  updateSet,
  toggleSetComplete,
  deleteSet,
  addSet,
}: {
  block: ExerciseBlock;
  blockIndex: number;
  getPrevious: (exerciseId: string) => string;
  updateSet: (blockIndex: number, setIndex: number, field: "weight" | "reps", value: string) => void;
  toggleSetComplete: (blockIndex: number, setIndex: number) => void;
  deleteSet: (blockIndex: number, setIndex: number) => void;
  addSet: (blockIndex: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`bg-white border-2 border-[#E5E5E5] mb-4 ${isDragging ? "shadow-lg" : ""}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-[#3C3C3C]">
          <button
            {...attributes}
            {...listeners}
            className="touch-none cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="h-5 w-5 text-[#AFAFAF]" />
          </button>
          <Dumbbell className="h-5 w-5" />
          {block.exercise.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Table Header */}
        <div className="grid grid-cols-[40px_1fr_80px_80px_50px] gap-2 mb-2 text-sm text-[#AFAFAF] font-medium">
          <div>Set</div>
          <div>Previous</div>
          <div className="text-center">kg</div>
          <div className="text-center">Reps</div>
          <div className="text-center">
            <Check className="h-4 w-4 mx-auto" />
          </div>
        </div>

        {/* Sets */}
        {block.sets.map((set, setIndex) => (
          <div
            key={setIndex}
            className={`group relative grid grid-cols-[40px_1fr_80px_80px_50px] gap-2 mb-2 items-center transition-all duration-200 ${
              set.completed
                ? "bg-[#C8F7C5] rounded-lg p-2 -mx-1 border-2 border-[#58CC02]"
                : ""
            }`}
          >
            {/* Delete button - appears on hover/touch */}
            {block.sets.length > 1 && !set.completed && (
              <button
                onClick={() => deleteSet(blockIndex, setIndex)}
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-red-100 text-red-500 hover:bg-red-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <div
              className={`font-bold ${
                set.completed ? "text-[#58CC02]" : "text-[#3C3C3C]"
              }`}
            >
              {set.set_order}
            </div>
            <div
              className={`text-sm ${
                set.completed
                  ? "text-[#58CC02] line-through"
                  : "text-[#AFAFAF]"
              }`}
            >
              {getPrevious(block.exercise.id)}
            </div>
            <Input
              type="number"
              placeholder="0"
              value={set.weight ?? ""}
              onChange={(e) =>
                updateSet(blockIndex, setIndex, "weight", e.target.value)
              }
              onFocus={(e) => e.target.select()}
              className={`h-10 text-center border-2 ${
                set.completed
                  ? "border-[#58CC02] bg-white text-[#58CC02] font-bold"
                  : "border-[#E5E5E5] focus:border-[#58CC02]"
              }`}
              disabled={set.completed}
            />
            <Input
              type="number"
              placeholder="0"
              value={set.reps ?? ""}
              onChange={(e) =>
                updateSet(blockIndex, setIndex, "reps", e.target.value)
              }
              onFocus={(e) => e.target.select()}
              className={`h-10 text-center border-2 ${
                set.completed
                  ? "border-[#58CC02] bg-white text-[#58CC02] font-bold"
                  : "border-[#E5E5E5] focus:border-[#58CC02]"
              }`}
              disabled={set.completed}
            />
            <Button
              variant={set.completed ? "default" : "outline"}
              size="icon"
              className={
                set.completed
                  ? "bg-[#58CC02] hover:bg-[#46A302] text-white shadow-md"
                  : "border-2 border-[#E5E5E5] text-[#AFAFAF] hover:border-[#58CC02] hover:text-[#58CC02]"
              }
              onClick={() => toggleSetComplete(blockIndex, setIndex)}
            >
              <Check className="h-5 w-5" />
            </Button>
          </div>
        ))}

        {/* Rest Timer Placeholder */}
        <div className="flex justify-center my-3">
          <Button
            variant="outline"
            size="sm"
            className="border-2 border-[#E5E5E5] text-[#AFAFAF]"
          >
            <Clock className="h-4 w-4 mr-1" />
            1:00
          </Button>
        </div>

        {/* Add Set Button */}
        <Button
          variant="outline"
          className="w-full border-2 border-[#58CC02] text-[#58CC02] hover:bg-[#E8F5E9]"
          onClick={() => addSet(blockIndex)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Set
        </Button>
      </CardContent>
    </Card>
  );
}

export interface WorkoutSummary {
  exerciseCount: number;
  totalVolume: number;
  duration: number;
  exercises: Array<{ name: string; maxWeight: number }>;
}

interface WorkoutLoggerProps {
  onFinish?: (summary: WorkoutSummary) => void;
  onExercisesChange?: (
    exercises: Array<{ exercise_id: string; name: string; muscle_group?: string }>
  ) => void;
}

export default function WorkoutLogger({
  onFinish,
  onExercisesChange,
}: WorkoutLoggerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseBlocks, setExerciseBlocks] = useState<ExerciseBlock[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [templateLoaded, setTemplateLoaded] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Rest timer state
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [defaultRestTime, setDefaultRestTime] = useState(90); // Default 90 seconds
  const REST_TIME_OPTIONS = [30, 60, 90, 120, 180]; // Available rest time options
  const [isRestTimerExpanded, setIsRestTimerExpanded] = useState(true); // For floating timer

  // Track exercise IDs for fetching previous data
  const exerciseIds = useMemo(
    () => exerciseBlocks.map((block) => block.exercise.id),
    [exerciseBlocks]
  );
  const { getPrevious, fetchForExercise } = usePreviousExerciseData(exerciseIds);

  // Load template details
  const { exercises: templateExercises } = useTemplateDetails(templateId);
  const { templates, updateTemplateUsage } = useWorkoutTemplates();

  // Get current template info
  const currentTemplate = useMemo(() => {
    if (!templateId) return null;
    return templates.find((t) => t.id === templateId) || null;
  }, [templateId, templates]);

  // Load exercises from template
  useEffect(() => {
    if (templateId && templateExercises.length > 0 && !templateLoaded) {
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
      // Use functional update to avoid lint warning
      setExerciseBlocks(() => blocks);
      setTemplateLoaded(() => true);

      // Update template usage count
      updateTemplateUsage(templateId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, templateExercises.length, templateLoaded]);

  // Notify parent of exercise changes (for saving as template)
  useEffect(() => {
    if (onExercisesChange) {
      const exerciseList = exerciseBlocks.map((block) => ({
        exercise_id: block.exercise.id,
        name: block.exercise.name,
        muscle_group: block.exercise.muscleGroup || undefined,
      }));
      onExercisesChange(exerciseList);
    }
  }, [exerciseBlocks, onExercisesChange]);

  // Fetch exercises on mount
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await exercisesApi.list();
        setExercises(data);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      }
    };
    fetchExercises();
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const addExercise = async (exercise: Exercise) => {
    // Fetch previous data for this exercise
    await fetchForExercise(exercise.id);

    setExerciseBlocks((prev) => [
      ...prev,
      {
        id: `block-${exercise.id}-${Date.now()}`,
        exercise,
        sets: [{ set_order: 1, weight: null, reps: null, completed: false }],
      },
    ]);
    setShowExercisePicker(false);
    setSearchQuery("");
  };

  const addSet = (blockIndex: number) => {
    setExerciseBlocks((prev) => {
      const updated = [...prev];
      const block = updated[blockIndex];
      // Get the last completed set's values to pre-fill
      const lastCompletedSet = [...block.sets].reverse().find(s => s.completed);
      block.sets.push({
        set_order: block.sets.length + 1,
        weight: lastCompletedSet?.weight ?? null,
        reps: lastCompletedSet?.reps ?? null,
        completed: false,
      });
      return updated;
    });
  };

  const deleteSet = (blockIndex: number, setIndex: number) => {
    setExerciseBlocks((prev) => {
      const updated = [...prev];
      const block = updated[blockIndex];
      // Don't allow deleting if only one set remains
      if (block.sets.length <= 1) return prev;
      
      block.sets.splice(setIndex, 1);
      // Re-number the sets
      block.sets.forEach((s, i) => {
        s.set_order = i + 1;
      });
      return updated;
    });
  };

  const updateSet = (
    blockIndex: number,
    setIndex: number,
    field: "weight" | "reps",
    value: string
  ) => {
    setExerciseBlocks((prev) => {
      const updated = [...prev];
      const numValue = value === "" ? null : parseFloat(value);
      updated[blockIndex].sets[setIndex][field] = numValue;
      return updated;
    });
  };

  const toggleSetComplete = (blockIndex: number, setIndex: number) => {
    const block = exerciseBlocks[blockIndex];
    const set = block.sets[setIndex];

    // If trying to mark as complete, validate inputs
    if (!set.completed) {
      if (
        set.weight === null ||
        set.weight <= 0 ||
        set.reps === null ||
        set.reps <= 0
      ) {
        alert("請先輸入重量和次數！");
        return;
      }
    }

    // Deep clone to trigger React re-render
    setExerciseBlocks((prev) => {
      const newBlocks = prev.map((b, bi) => {
        if (bi !== blockIndex) return b;
        return {
          ...b,
          sets: b.sets.map((s, si) => {
            if (si !== setIndex) return s;
            return { ...s, completed: !s.completed };
          }),
        };
      });
      return newBlocks;
    });

    // Start rest timer when completing a set (not when uncompleting)
    if (!set.completed) {
      startRestTimer(defaultRestTime);
      
      // Auto-fill next uncompleted set with same weight/reps
      const nextSetIndex = setIndex + 1;
      if (nextSetIndex < block.sets.length) {
        const nextSet = block.sets[nextSetIndex];
        if (!nextSet.completed) {
          setExerciseBlocks((prev) => {
            const newBlocks = [...prev];
            const targetBlock = newBlocks[blockIndex];
            if (targetBlock.sets[nextSetIndex]) {
              targetBlock.sets[nextSetIndex] = {
                ...targetBlock.sets[nextSetIndex],
                weight: set.weight,
                reps: set.reps,
              };
            }
            return newBlocks;
          });
        }
      }
    }
  };

  // Play notification sound using Web Audio API
  const playRestEndSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      // Play 3 short beeps
      const playBeep = (time: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 880; // A5 note
        oscillator.type = "sine";
        
        gainNode.gain.setValueAtTime(0.3, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
        
        oscillator.start(time);
        oscillator.stop(time + 0.15);
      };
      
      const now = audioContext.currentTime;
      playBeep(now);
      playBeep(now + 0.2);
      playBeep(now + 0.4);
    } catch (error) {
      console.error("Failed to play sound:", error);
    }
  }, []);

  // Rest timer functions
  const startRestTimer = (seconds: number) => {
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
    }
    setRestTimer(seconds);
    setIsRestTimerRunning(true);
    setIsRestTimerExpanded(true);

    restTimerRef.current = setInterval(() => {
      setRestTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(restTimerRef.current!);
          setIsRestTimerRunning(false);
          playRestEndSound(); // Play sound when rest ends
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRestTimer = () => {
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
    }
    setRestTimer(null);
    setIsRestTimerRunning(false);
  };

  const addRestTime = (seconds: number) => {
    setRestTimer((prev) => (prev || 0) + seconds);
  };

  // Cleanup rest timer on unmount
  useEffect(() => {
    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, []);

  const calculateSummary = useCallback((): WorkoutSummary => {
    let totalVolume = 0;
    const exerciseSummaries: Array<{ name: string; maxWeight: number }> = [];

    exerciseBlocks.forEach((block) => {
      let maxWeight = 0;
      block.sets.forEach((set) => {
        if (set.completed && set.weight && set.reps) {
          totalVolume += set.weight * set.reps;
          if (set.weight > maxWeight) maxWeight = set.weight;
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

  const handleFinish = async () => {
    const endTime = new Date();

    // Prepare workout data
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
      if (onFinish) {
        onFinish(summary);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to save workout:", error);
    }
  };

  // Handle drag end for reordering exercise blocks
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setExerciseBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const filteredExercises = exercises.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.muscleGroup || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedExercises = filteredExercises.reduce(
    (acc, exercise) => {
      const group = exercise.muscleGroup || "Other";
      if (!acc[group]) acc[group] = [];
      acc[group].push(exercise);
      return acc;
    },
    {} as Record<string, Exercise[]>
  );

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center gap-2 text-[#3C3C3C]">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
            </div>
            <Button
              className="bg-[#58CC02] hover:bg-[#46A302] text-white"
              onClick={handleFinish}
              disabled={exerciseBlocks.length === 0}
            >
              Finish
            </Button>
          </div>
        </div>
      </div>

      {/* Workout Title Card */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <Card className="bg-white border-2 border-[#E5E5E5] mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DuckMascot 
                muscleGroup={currentTemplate?.muscleGroup} 
                size="sm" 
                animate={false} 
              />
              <div>
                <h2 className="text-xl font-bold text-[#3C3C3C]">
                  {currentTemplate ? currentTemplate.name : "自由訓練"}
                </h2>
                <p className="text-[#AFAFAF] text-sm">
                  {startTime.toLocaleDateString()} - {formatTime(elapsedTime)}
                  {currentTemplate?.muscleGroup && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#58CC02] text-xs">
                      {currentTemplate.muscleGroup}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rest Time Settings */}
        <Card className="bg-white border-2 border-[#E5E5E5] mb-4">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#3C3C3C]">
                <Timer className="h-4 w-4" />
                <span className="text-sm font-medium">預設休息時間</span>
              </div>
              <div className="flex gap-1">
                {REST_TIME_OPTIONS.map((time) => (
                  <Button
                    key={time}
                    variant="ghost"
                    size="sm"
                    className={`px-2 py-1 text-xs ${
                      defaultRestTime === time
                        ? "bg-[#58CC02] text-white hover:bg-[#46A302]"
                        : "text-[#AFAFAF] hover:text-[#3C3C3C]"
                    }`}
                    onClick={() => setDefaultRestTime(time)}
                  >
                    {time >= 60 ? `${time / 60}m` : `${time}s`}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Blocks with Drag and Drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={exerciseBlocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {exerciseBlocks.map((block, blockIndex) => (
              <SortableExerciseCard
                key={block.id}
                block={block}
                blockIndex={blockIndex}
                getPrevious={getPrevious}
                updateSet={updateSet}
                toggleSetComplete={toggleSetComplete}
                deleteSet={deleteSet}
                addSet={addSet}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Add Exercise Button */}
        <Button
          className="w-full bg-[#1CB0F6] hover:bg-[#0A9AD6] text-white py-6"
          onClick={() => setShowExercisePicker(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Exercise
        </Button>
      </div>

      {/* Floating Rest Timer */}
      {isRestTimerRunning && restTimer !== null && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          {isRestTimerExpanded ? (
            // Expanded view
            <div className="bg-[#1CB0F6] text-white rounded-2xl shadow-lg px-5 py-4 min-w-[280px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Timer className="h-6 w-6" />
                  <div>
                    <p className="text-sm opacity-80">休息時間</p>
                    <p className="text-3xl font-bold font-mono">
                      {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 px-2"
                    onClick={() => addRestTime(30)}
                  >
                    +30s
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-8 w-8"
                    onClick={() => setIsRestTimerExpanded(false)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-8 w-8"
                    onClick={stopRestTimer}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Minimized view - small pill
            <button
              onClick={() => setIsRestTimerExpanded(true)}
              className="bg-[#1CB0F6] text-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2 hover:bg-[#0A9AD6] transition-colors"
            >
              <Timer className="h-5 w-5" />
              <span className="font-bold font-mono text-lg">
                {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, "0")}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Exercise Picker Dialog */}
      <Dialog open={showExercisePicker} onOpenChange={setShowExercisePicker}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Exercise</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />

          <div className="space-y-4">
            {Object.entries(groupedExercises).map(([group, groupExercises]) => (
              <div key={group}>
                <h3 className="text-sm font-medium text-[#AFAFAF] mb-2 flex items-center">
                  <ChevronDown className="h-4 w-4 mr-1" />
                  {group}
                </h3>
                <div className="space-y-1">
                  {groupExercises.map((exercise) => (
                    <Button
                      key={exercise.id}
                      variant="ghost"
                      className="w-full justify-start text-[#3C3C3C] hover:bg-[#F7F7F7]"
                      onClick={() => addExercise(exercise)}
                    >
                      <Dumbbell className="h-4 w-4 mr-2 text-[#AFAFAF]" />
                      {exercise.name}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
