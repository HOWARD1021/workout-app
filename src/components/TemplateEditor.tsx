"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Save, X } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  type: string;
  muscleGroup: string;
}

interface TemplateExercise {
  exercise_id: string;
  exercise_name?: string;
  default_sets: number;
  default_reps: number | null;
  default_weight: number | null;
}

interface TemplateEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (template: {
    name: string;
    description: string;
    muscle_group: string;
    exercises: TemplateExercise[];
  }) => void;
  initialData?: {
    id?: string;
    name: string;
    description: string;
    muscleGroup: string;
    exercises: TemplateExercise[];
  };
  exercises: Exercise[];
}

const MUSCLE_GROUPS = [
  { value: "Chest", label: "胸 Chest" },
  { value: "Back", label: "背 Back" },
  { value: "Legs", label: "腿 Legs" },
  { value: "Arms", label: "手臂 Arms" },
  { value: "Shoulders", label: "肩膀 Shoulders" },
  { value: "Core", label: "核心 Core" },
  { value: "Full Body", label: "全身 Full Body" },
];

export function TemplateEditor({
  open,
  onClose,
  onSave,
  initialData,
  exercises,
}: TemplateEditorProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [templateExercises, setTemplateExercises] = useState<TemplateExercise[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setMuscleGroup(initialData.muscleGroup || "");
      setTemplateExercises(initialData.exercises || []);
    } else {
      setName("");
      setDescription("");
      setMuscleGroup("");
      setTemplateExercises([]);
    }
  }, [initialData, open]);

  const addExercise = () => {
    setTemplateExercises([
      ...templateExercises,
      { exercise_id: "", default_sets: 3, default_reps: 10, default_weight: null },
    ]);
  };

  const removeExercise = (index: number) => {
    setTemplateExercises(templateExercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: string, value: string | number | null) => {
    const updated = [...templateExercises];
    updated[index] = { ...updated[index], [field]: value };
    
    // Update exercise name when exercise_id changes
    if (field === "exercise_id") {
      const exercise = exercises.find((e) => e.id === value);
      updated[index].exercise_name = exercise?.name;
    }
    
    setTemplateExercises(updated);
  };

  const moveExercise = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= templateExercises.length) return;
    const updated = [...templateExercises];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setTemplateExercises(updated);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    if (templateExercises.length === 0) return;
    if (templateExercises.some((e) => !e.exercise_id)) return;

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        muscle_group: muscleGroup,
        exercises: templateExercises,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  // Group exercises by muscle group for easier selection
  const exercisesByGroup = exercises.reduce((acc, ex) => {
    const group = ex.muscleGroup || "Other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(ex);
    return acc;
  }, {} as Record<string, Exercise[]>);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "編輯模板" : "建立新模板"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">模板名稱 *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：胸日、PPL 推"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="簡短描述這個模板的訓練目標"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="muscleGroup">主要肌群</Label>
              <Select value={muscleGroup} onValueChange={setMuscleGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇肌群" />
                </SelectTrigger>
                <SelectContent>
                  {MUSCLE_GROUPS.map((group) => (
                    <SelectItem key={group.value} value={group.value}>
                      {group.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Exercises */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>訓練動作 *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addExercise}>
                <Plus className="w-4 h-4 mr-1" />
                新增動作
              </Button>
            </div>

            {templateExercises.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                點擊「新增動作」來加入訓練動作
              </div>
            ) : (
              <div className="space-y-3">
                {templateExercises.map((te, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Drag handle and order */}
                        <div className="flex flex-col items-center gap-1 pt-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <div className="flex flex-col gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => moveExercise(index, index - 1)}
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => moveExercise(index, index + 1)}
                              disabled={index === templateExercises.length - 1}
                            >
                              ↓
                            </Button>
                          </div>
                        </div>

                        {/* Exercise details */}
                        <div className="flex-1 space-y-3">
                          <Select
                            value={te.exercise_id}
                            onValueChange={(v) => updateExercise(index, "exercise_id", v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="選擇動作" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(exercisesByGroup).map(([group, exs]) => (
                                <div key={group}>
                                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                                    {group}
                                  </div>
                                  {exs.map((ex) => (
                                    <SelectItem key={ex.id} value={ex.id}>
                                      {ex.name}
                                    </SelectItem>
                                  ))}
                                </div>
                              ))}
                            </SelectContent>
                          </Select>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs">組數</Label>
                              <Input
                                type="number"
                                min={1}
                                value={te.default_sets}
                                onChange={(e) =>
                                  updateExercise(index, "default_sets", parseInt(e.target.value) || 3)
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">次數</Label>
                              <Input
                                type="number"
                                min={1}
                                value={te.default_reps || ""}
                                onChange={(e) =>
                                  updateExercise(
                                    index,
                                    "default_reps",
                                    e.target.value ? parseInt(e.target.value) : null
                                  )
                                }
                                placeholder="選填"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">重量 (kg)</Label>
                              <Input
                                type="number"
                                min={0}
                                step={0.5}
                                value={te.default_weight || ""}
                                onChange={(e) =>
                                  updateExercise(
                                    index,
                                    "default_weight",
                                    e.target.value ? parseFloat(e.target.value) : null
                                  )
                                }
                                placeholder="選填"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Delete button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeExercise(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-1" />
              取消
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !name.trim() || templateExercises.length === 0}
            >
              <Save className="w-4 h-4 mr-1" />
              {saving ? "儲存中..." : "儲存模板"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
