"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TemplateEditor } from "@/components/TemplateEditor";
import {
  Home,
  Plus,
  Star,
  Trash2,
  Edit,
  Dumbbell,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string | null;
  muscleGroup: string | null;
  isFavorite: boolean;
  useCount: number;
  exercise_count: number;
}

interface Exercise {
  id: string;
  name: string;
  type: string;
  muscleGroup: string;
}

interface TemplateExercise {
  id: string;
  exerciseId: string;
  orderIndex: number;
  defaultSets: number;
  defaultReps: number | null;
  defaultWeight: number | null;
  exercise: {
    id: string;
    name: string;
    type: string;
    muscleGroup: string;
  };
}

const MUSCLE_GROUP_COLORS: Record<string, string> = {
  Chest: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Back: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Legs: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Arms: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Shoulders: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Core: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Full Body": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<{
    id?: string;
    name: string;
    description: string;
    muscleGroup: string;
    exercises: Array<{
      exercise_id: string;
      exercise_name?: string;
      default_sets: number;
      default_reps: number | null;
      default_weight: number | null;
    }>;
  } | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [templateExercises, setTemplateExercises] = useState<Record<string, TemplateExercise[]>>({});

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch("/api/templates");
      if (res.ok) {
        const data = await res.json() as Template[];
        setTemplates(data);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  }, []);

  const fetchExercises = useCallback(async () => {
    try {
      const res = await fetch("/api/exercises");
      if (res.ok) {
        const data = await res.json() as Exercise[];
        setExercises(data);
      }
    } catch (error) {
      console.error("Failed to fetch exercises:", error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      await Promise.all([fetchTemplates(), fetchExercises()]);
      if (mounted) {
        setLoading(false);
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, [fetchTemplates, fetchExercises]);

  const fetchTemplateExercises = async (templateId: string) => {
    if (templateExercises[templateId]) return;
    
    try {
      const res = await fetch(`/api/templates/${templateId}`);
      if (res.ok) {
        const data = await res.json() as TemplateExercise[];
        setTemplateExercises((prev) => ({ ...prev, [templateId]: data }));
      }
    } catch (error) {
      console.error("Failed to fetch template exercises:", error);
    }
  };

  const toggleExpand = (templateId: string) => {
    if (expandedTemplate === templateId) {
      setExpandedTemplate(null);
    } else {
      setExpandedTemplate(templateId);
      fetchTemplateExercises(templateId);
    }
  };

  const handleToggleFavorite = async (template: Template) => {
    try {
      await fetch(`/api/templates/${template.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_favorite: !template.isFavorite }),
      });
      fetchTemplates();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleDelete = async (templateId: string) => {
    try {
      await fetch(`/api/templates/${templateId}`, { method: "DELETE" });
      setDeleteConfirm(null);
      fetchTemplates();
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  const handleEdit = async (template: Template) => {
    // Fetch template exercises for editing
    let exerciseData: TemplateExercise[] = templateExercises[template.id] || [];
    if (!templateExercises[template.id]) {
      try {
        const res = await fetch(`/api/templates/${template.id}`);
        if (res.ok) {
          exerciseData = await res.json() as TemplateExercise[];
          setTemplateExercises((prev) => ({ ...prev, [template.id]: exerciseData }));
        }
      } catch (error) {
        console.error("Failed to fetch template exercises:", error);
      }
    }

    setEditingTemplate({
      id: template.id,
      name: template.name,
      description: template.description || "",
      muscleGroup: template.muscleGroup || "",
      exercises: exerciseData.map((te) => ({
        exercise_id: te.exerciseId,
        exercise_name: te.exercise?.name,
        default_sets: te.defaultSets,
        default_reps: te.defaultReps,
        default_weight: te.defaultWeight ? Number(te.defaultWeight) : null,
      })),
    });
    setEditorOpen(true);
  };

  const handleSave = async (templateData: {
    name: string;
    description: string;
    muscle_group: string;
    exercises: Array<{
      exercise_id: string;
      default_sets: number;
      default_reps: number | null;
      default_weight: number | null;
    }>;
  }) => {
    try {
      if (editingTemplate?.id) {
        // For now, delete and recreate (proper update would need backend support)
        await fetch(`/api/templates/${editingTemplate.id}`, { method: "DELETE" });
      }
      
      await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateData),
      });
      
      setEditingTemplate(undefined);
      fetchTemplates();
    } catch (error) {
      console.error("Failed to save template:", error);
    }
  };

  const openNewTemplate = () => {
    setEditingTemplate(undefined);
    setEditorOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-semibold">訓練模板</h1>
          </div>
          <Button onClick={openNewTemplate}>
            <Plus className="w-4 h-4 mr-1" />
            新增模板
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container px-4 py-6 space-y-4">
        {templates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Dumbbell className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">還沒有任何訓練模板</p>
              <Button onClick={openNewTemplate}>
                <Plus className="w-4 h-4 mr-1" />
                建立第一個模板
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        {template.isFavorite && (
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                      {template.description && (
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFavorite(template)}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            template.isFavorite
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setDeleteConfirm(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 mb-3">
                    {template.muscleGroup && (
                      <Badge
                        className={MUSCLE_GROUP_COLORS[template.muscleGroup] || "bg-gray-100"}
                        variant="secondary"
                      >
                        {template.muscleGroup}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {template.exercise_count} 個動作
                    </Badge>
                    {template.useCount > 0 && (
                      <Badge variant="outline">
                        使用 {template.useCount} 次
                      </Badge>
                    )}
                  </div>

                  {/* Expandable exercises list */}
                  <button
                    onClick={() => toggleExpand(template.id)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        expandedTemplate === template.id ? "rotate-90" : ""
                      }`}
                    />
                    {expandedTemplate === template.id ? "收起動作" : "查看動作"}
                  </button>

                  {expandedTemplate === template.id && templateExercises[template.id] && (
                    <div className="mt-3 space-y-2 pl-4 border-l-2">
                      {templateExercises[template.id].map((te, index) => (
                        <div
                          key={te.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>
                            {index + 1}. {te.exercise?.name || "Unknown"}
                          </span>
                          <span className="text-muted-foreground">
                            {te.defaultSets} 組
                            {te.defaultReps && ` × ${te.defaultReps} 次`}
                            {te.defaultWeight && ` @ ${te.defaultWeight}kg`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Start workout button */}
                  <div className="mt-4">
                    <Link href={`/log?template=${template.id}`}>
                      <Button className="w-full">
                        <Dumbbell className="w-4 h-4 mr-2" />
                        使用此模板開始訓練
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Template Editor Dialog */}
      <TemplateEditor
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingTemplate(undefined);
        }}
        onSave={handleSave}
        initialData={editingTemplate}
        exercises={exercises}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除此模板？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作無法復原。模板將被永久刪除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
