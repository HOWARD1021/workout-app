"use client";

import { useState } from "react";
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
  Trash2,
  GripVertical,
  Eye,
  Bell,
  BellOff,
  MessageSquare,
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
import { type Exercise } from "@/lib/api";
import { useWorkout, type ExerciseBlock } from "@/contexts/WorkoutContext";
import { useRouter } from "next/navigation";
import DuckMascot from "./DuckMascot";
import ExerciseImageDialog from "./ExerciseImageDialog";
import RestTimerDialog from "./RestTimerDialog";

// Sortable Exercise Card Component
function SortableExerciseCard({
  block,
  blockIndex,
  getPrevious,
  updateSet,
  toggleSetComplete,
  deleteSet,
  addSet,
  onViewExercise,
  onUpdateBlockNote,
}: {
  block: ExerciseBlock;
  blockIndex: number;
  getPrevious: (exerciseId: string) => string;
  updateSet: (blockIndex: number, setIndex: number, field: "weight" | "reps", value: string) => void;
  toggleSetComplete: (blockIndex: number, setIndex: number) => void;
  deleteSet: (blockIndex: number, setIndex: number) => void;
  addSet: (blockIndex: number) => void;
  onViewExercise: (name: string, muscleGroup: string | null, gifUrl?: string | null, imageUrl?: string | null) => void;
  onUpdateBlockNote: (blockIndex: number, note: string) => void;
}) {
  const [showNote, setShowNote] = useState(!!block.note);

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
      className={`mb-4 gap-0 overflow-hidden bg-white py-0 ${isDragging ? "shadow-lg" : ""}`}
    >
      <CardHeader className="border-b border-[#ededf0] px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-base text-[#111111]">
          <button
            {...attributes}
            {...listeners}
            className="-ml-1 touch-none cursor-grab rounded-lg p-1 active:cursor-grabbing active:bg-[#f2f2f7]"
          >
            <GripVertical className="h-5 w-5 text-[#8e8e93]" />
          </button>
          <Dumbbell className="h-5 w-5 text-[#248a3d]" />
          <span className="flex-1 truncate">
            {block.exercise.nameZh || block.exercise.name}
          </span>
          {block.exercise.nameZh && (
            <span className="text-xs text-[#8e8e93] shrink-0">{block.exercise.name}</span>
          )}
          <button
            onClick={() => setShowNote(!showNote)}
            className={`p-1.5 rounded-md transition-colors ${
              block.note
                ? "bg-[#fff3df] text-[#b25b00]"
                : "text-[#8e8e93] hover:bg-[#f2f2f7] hover:text-[#111111]"
            }`}
            title="筆記"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewExercise(block.exercise.nameZh || block.exercise.name, block.exercise.muscleGroup, block.exercise.gifUrl, block.exercise.imageUrl)}
            className="rounded-md p-1.5 text-[#8e8e93] transition-colors hover:bg-[#e9f8ee] hover:text-[#248a3d]"
            title="查看動作"
          >
            <Eye className="h-4 w-4" />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-3">
        {/* Exercise Note */}
        {showNote && (
          <div className="mb-3">
            <textarea
              placeholder="筆記：握距、節奏、注意事項..."
              value={block.note || ""}
              onChange={(e) => onUpdateBlockNote(blockIndex, e.target.value)}
              className="w-full resize-none rounded-xl border-0 bg-[#f2f2f7] p-3 text-sm outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-[#34c759]/20"
              rows={2}
            />
          </div>
        )}

        {/* Table Header */}
        <div className="mb-2 grid grid-cols-[34px_1fr_72px_72px_44px] gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#8e8e93]">
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
            className={`group relative mb-2 grid grid-cols-[34px_1fr_72px_72px_44px] items-center gap-2 rounded-xl transition-all duration-200 ${
              set.completed
                ? "bg-[#e9f8ee] p-2 -mx-1"
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
                set.completed ? "text-[#248a3d]" : "text-[#111111]"
              }`}
            >
              {set.set_order}
            </div>
            <div
              className={`text-sm ${
                set.completed
                  ? "text-[#248a3d] line-through"
                  : "text-[#8e8e93]"
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
                  ? "bg-white text-[#248a3d] font-semibold"
                  : "bg-[#f2f2f7] focus:bg-white"
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
                  ? "bg-white text-[#248a3d] font-semibold"
                  : "bg-[#f2f2f7] focus:bg-white"
              }`}
              disabled={set.completed}
            />
            <Button
              variant={set.completed ? "default" : "outline"}
              size="icon"
              className={
                set.completed
                  ? "bg-[#34c759] hover:bg-[#2fb84f] text-white"
                  : "border-0 bg-[#f2f2f7] text-[#8e8e93] hover:bg-[#e9f8ee] hover:text-[#248a3d]"
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
          size="sm"
          className="h-8 rounded-full bg-[#f2f2f7] px-3 text-[#6f6f78] hover:bg-[#e9e9ee]"
          >
            <Clock className="h-4 w-4 mr-1" />
            1:00
          </Button>
        </div>

        {/* Add Set Button */}
        <Button
          variant="secondary"
          className="w-full bg-[#f2f2f7] text-[#111111] hover:bg-[#e9e9ee]"
          onClick={() => addSet(blockIndex)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Set
        </Button>
      </CardContent>
    </Card>
  );
}

export default function WorkoutLogger() {
  const router = useRouter();
  const workout = useWorkout();

  const {
    exerciseBlocks,
    startTime,
    elapsedTime,
    templateInfo,
    exercises,
    getPrevious,
    addExercise: ctxAddExercise,
    addSet,
    deleteSet,
    updateSet,
    toggleSetComplete,
    updateBlockNote,
    reorderBlocks,
    finishWorkout,
    restTimer,
    isRestTimerRunning,
    isRestTimerExpanded,
    defaultRestTime,
    REST_TIME_OPTIONS,
    setDefaultRestTime,
    addRestTime,
    startRestTimer,
    stopRestTimer,
    setIsRestTimerExpanded,
  } = workout;

  // UI-only local state
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageDialog, setImageDialog] = useState<{
    open: boolean;
    name: string;
    muscleGroup: string | null;
    gifUrl: string | null;
    imageUrl: string | null;
  }>({ open: false, name: "", muscleGroup: null, gifUrl: null, imageUrl: null });
  const [notifPermission, setNotifPermission] = useState<string>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "unsupported"
  );

  const handleEnableNotifications = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
    if (result === "granted") {
      // Send a test notification to confirm it works
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification("通知已開啟！✅", {
            body: "休息計時器結束時會通知你",
            icon: "/images/duck-mascot.png",
            tag: "test",
            silent: false,
          });
        });
      } else {
        new Notification("通知已開啟！✅", {
          body: "休息計時器結束時會通知你",
          icon: "/images/duck-mascot.png",
          silent: false,
        });
      }
    }
  };

  const openImageDialog = (name: string, muscleGroup: string | null, gifUrl?: string | null, imageUrl?: string | null) => {
    setImageDialog({ open: true, name, muscleGroup, gifUrl: gifUrl || null, imageUrl: imageUrl || null });
  };

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

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleAddExercise = async (exercise: Exercise) => {
    await ctxAddExercise(exercise);
    setShowExercisePicker(false);
    setSearchQuery("");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderBlocks(String(active.id), String(over.id));
    }
  };

  const filteredExercises = exercises.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.nameZh || "").includes(searchQuery) ||
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
    <div className="ios-page">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[#d7d7dc]/80 bg-[#f9f9fb]/90 backdrop-blur-xl">
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
            <div className="flex items-center gap-2 rounded-full bg-[#ededf0] px-3 py-1.5 text-[#111111]">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
            </div>
            <Button
              className="bg-[#111111] text-white hover:bg-[#242424]"
              onClick={finishWorkout}
              disabled={exerciseBlocks.length === 0}
            >
              Finish
            </Button>
          </div>
        </div>
      </div>

      {/* Workout Title Card */}
      <div className="mx-auto max-w-2xl px-4 py-4">
        <Card className="mb-4 gap-0 py-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DuckMascot 
                muscleGroup={templateInfo?.muscleGroup} 
                size="sm" 
                animate={false} 
              />
              <div>
                <h2 className="text-xl font-bold text-[#111111]">
                  {templateInfo ? templateInfo.name : "自由訓練"}
                </h2>
                <p className="text-[#6f6f78] text-sm">
                  {startTime?.toLocaleDateString()} - {formatTime(elapsedTime)}
                  {templateInfo?.muscleGroup && (
                    <span className="ml-2 rounded-full bg-[#e9f8ee] px-2 py-0.5 text-xs text-[#248a3d]">
                      {templateInfo.muscleGroup}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rest Time Settings */}
        <Card className="mb-4 gap-0 py-0">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#111111]">
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
                        ? "bg-[#111111] text-white hover:bg-[#242424]"
                        : "text-[#6f6f78] hover:bg-[#f2f2f7] hover:text-[#111111]"
                    }`}
                    onClick={() => setDefaultRestTime(time)}
                  >
                    {time >= 60 ? `${time / 60}m` : `${time}s`}
                  </Button>
                ))}
              </div>
            </div>
            {/* Notification Permission */}
            <div className="flex items-center justify-between border-t border-[#ededf0] pt-2">
              <div className="flex items-center gap-2">
                {notifPermission === "granted" ? (
                  <Bell className="h-4 w-4 text-[#248a3d]" />
                ) : (
                  <BellOff className="h-4 w-4 text-[#8e8e93]" />
                )}
                <span className="text-sm text-[#111111]">
                  {notifPermission === "granted"
                    ? "通知已開啟"
                    : notifPermission === "denied"
                    ? "通知被封鎖"
                    : "背景通知"}
                </span>
              </div>
              {notifPermission !== "granted" && notifPermission !== "denied" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-[#111111] px-3 py-1 text-xs text-white hover:bg-[#242424]"
                  onClick={handleEnableNotifications}
                >
                  開啟通知
                </Button>
              )}
              {notifPermission === "denied" && (
                <span className="text-xs text-[#8e8e93]">
                  請到系統設定開啟
                </span>
              )}
              {notifPermission === "granted" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-[#ededf0] px-3 py-1 text-xs text-[#111111] hover:bg-[#e0e0e6]"
                  onClick={() => startRestTimer(3)}
                >
                  3s 測試
                </Button>
              )}
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
                onViewExercise={openImageDialog}
                onUpdateBlockNote={updateBlockNote}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Add Exercise Button */}
        <Button
          className="w-full bg-white py-6 text-[#111111] hover:bg-[#f7f7fa]"
          onClick={() => setShowExercisePicker(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Exercise
        </Button>
      </div>

      {/* Rest Timer */}
      {isRestTimerRunning && restTimer !== null && (
        isRestTimerExpanded ? (
          <RestTimerDialog
            restTimer={restTimer}
            defaultRestTime={defaultRestTime}
            onAddTime={(seconds) => addRestTime(seconds)}
            onSkip={stopRestTimer}
            onMinimize={() => setIsRestTimerExpanded(false)}
          />
        ) : (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <button
              onClick={() => setIsRestTimerExpanded(true)}
              className="flex items-center gap-2 rounded-full bg-[#111111] px-4 py-2 text-white shadow-lg transition-colors hover:bg-[#242424]"
            >
              <Timer className="h-5 w-5" />
              <span className="font-bold font-mono text-lg">
                {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, "0")}
              </span>
            </button>
          </div>
        )
      )}

      {/* Exercise Image Dialog */}
      <ExerciseImageDialog
        open={imageDialog.open}
        onOpenChange={(open) => setImageDialog((prev) => ({ ...prev, open }))}
        exerciseName={imageDialog.name}
        muscleGroup={imageDialog.muscleGroup}
        gifUrl={imageDialog.gifUrl}
        imageUrl={imageDialog.imageUrl}
      />

      {/* Exercise Picker Dialog */}
      <Dialog open={showExercisePicker} onOpenChange={setShowExercisePicker}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Select Exercise</DialogTitle>
          </DialogHeader>

          <div className="px-4 py-2">
            <Input
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#f2f2f7] focus:bg-white"
            />
          </div>

          {/* Muscle Group Filter Tabs */}
          <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto scrollbar-hide">
            {["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Full Body"].map((mg) => (
              <button
                key={mg}
                onClick={() => setSearchQuery(mg === "All" ? "" : mg)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  (mg === "All" && !searchQuery) || searchQuery === mg
                    ? "bg-[#111111] text-white"
                    : "bg-[#f2f2f7] text-[#111111] hover:bg-[#e9e9ee]"
                }`}
              >
                {mg}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-4">
              {Object.entries(groupedExercises).map(([group, groupExercises]) => (
                <div key={group}>
                  <h3 className="mb-2 flex items-center text-sm font-medium text-[#8e8e93]">
                    <ChevronDown className="h-4 w-4 mr-1" />
                    {group}
                  </h3>
                  <div className="space-y-1">
                    {groupExercises.map((exercise) => (
                      <Button
                        key={exercise.id}
                        variant="ghost"
                        className="w-full justify-start text-[#111111] hover:bg-[#f2f2f7]"
                        onClick={() => handleAddExercise(exercise)}
                      >
                        {exercise.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={exercise.imageUrl} alt="" className="w-8 h-8 rounded mr-2 object-cover" />
                        ) : (
                          <Dumbbell className="mr-2 h-4 w-4 text-[#8e8e93]" />
                        )}
                        <span className="truncate">{exercise.nameZh || exercise.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
