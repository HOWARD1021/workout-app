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
  X,
  Trash2,
  GripVertical,
  Eye,
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
}: {
  block: ExerciseBlock;
  blockIndex: number;
  getPrevious: (exerciseId: string) => string;
  updateSet: (blockIndex: number, setIndex: number, field: "weight" | "reps", value: string) => void;
  toggleSetComplete: (blockIndex: number, setIndex: number) => void;
  deleteSet: (blockIndex: number, setIndex: number) => void;
  addSet: (blockIndex: number) => void;
  onViewExercise: (name: string, muscleGroup: string | null) => void;
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
        <CardTitle className="flex items-center gap-2 text-[#2D3648]">
          <button
            {...attributes}
            {...listeners}
            className="touch-none cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="h-5 w-5 text-[#AFAFAF]" />
          </button>
          <Dumbbell className="h-5 w-5" />
          <span className="flex-1">{block.exercise.name}</span>
          <button
            onClick={() => onViewExercise(block.exercise.name, block.exercise.muscleGroup)}
            className="p-1.5 rounded-md hover:bg-[#E8F5E9] text-[#AFAFAF] hover:text-[#58CC02] transition-colors"
            title="查看動作"
          >
            <Eye className="h-4 w-4" />
          </button>
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
                set.completed ? "text-[#58CC02]" : "text-[#2D3648]"
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
    reorderBlocks,
    finishWorkout,
    restTimer,
    isRestTimerRunning,
    isRestTimerExpanded,
    defaultRestTime,
    REST_TIME_OPTIONS,
    setDefaultRestTime,
    addRestTime,
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
  }>({ open: false, name: "", muscleGroup: null });

  const openImageDialog = (name: string, muscleGroup: string | null) => {
    setImageDialog({ open: true, name, muscleGroup });
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
            <div className="flex items-center gap-2 text-[#2D3648]">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
            </div>
            <Button
              className="bg-[#58CC02] hover:bg-[#46A302] text-white"
              onClick={finishWorkout}
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
                muscleGroup={templateInfo?.muscleGroup} 
                size="sm" 
                animate={false} 
              />
              <div>
                <h2 className="text-xl font-bold text-[#2D3648]">
                  {templateInfo ? templateInfo.name : "自由訓練"}
                </h2>
                <p className="text-[#AFAFAF] text-sm">
                  {startTime?.toLocaleDateString()} - {formatTime(elapsedTime)}
                  {templateInfo?.muscleGroup && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#58CC02] text-xs">
                      {templateInfo.muscleGroup}
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
              <div className="flex items-center gap-2 text-[#2D3648]">
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
                        : "text-[#AFAFAF] hover:text-[#2D3648]"
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
                onViewExercise={openImageDialog}
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
              className="bg-[#1CB0F6] text-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2 hover:bg-[#0A9AD6] transition-colors"
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
      />

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
                      className="w-full justify-start text-[#2D3648] hover:bg-[#F7F7F7]"
                      onClick={() => handleAddExercise(exercise)}
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
