"use client";

import { useState, useEffect, useCallback } from "react";
import {
  templatesApi,
  type WorkoutTemplate,
  type TemplateExercise,
} from "@/lib/api";

export type { WorkoutTemplate, TemplateExercise };

export function useWorkoutTemplates() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await templatesApi.list();
      setTemplates(data);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const createTemplate = useCallback(
    async (
      name: string,
      exercises: Array<{
        exercise_id: string;
        default_sets?: number;
        default_reps?: number;
        default_weight?: number;
      }>,
      description?: string,
      isFavorite?: boolean,
      muscleGroup?: string
    ) => {
      try {
        const template = await templatesApi.create({
          name,
          exercises,
          description,
          is_favorite: isFavorite,
          muscle_group: muscleGroup,
        });
        await fetchTemplates();
        return template.id;
      } catch (err) {
        console.error("Failed to create template:", err);
        throw err;
      }
    },
    [fetchTemplates]
  );

  const updateTemplateUsage = useCallback(async (templateId: string) => {
    try {
      // Get current template to increment count
      const currentTemplate = templates.find((t) => t.id === templateId);
      await templatesApi.update(templateId, {
        use_count: (currentTemplate?.useCount || 0) + 1,
        last_used_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to update template usage:", err);
    }
  }, [templates]);

  const deleteTemplate = useCallback(
    async (templateId: string) => {
      try {
        await templatesApi.delete(templateId);
        await fetchTemplates();
      } catch (err) {
        console.error("Failed to delete template:", err);
        throw err;
      }
    },
    [fetchTemplates]
  );

  const toggleFavorite = useCallback(
    async (templateId: string, isFavorite: boolean) => {
      try {
        await templatesApi.update(templateId, { is_favorite: isFavorite });
        await fetchTemplates();
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
        throw err;
      }
    },
    [fetchTemplates]
  );

  return {
    templates,
    loading,
    error,
    refetch: fetchTemplates,
    createTemplate,
    updateTemplateUsage,
    deleteTemplate,
    toggleFavorite,
  };
}

export function useTemplateDetails(templateId: string | null) {
  const [exercises, setExercises] = useState<TemplateExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) {
      setExercises([]);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await templatesApi.get(templateId);
        setExercises(data);
      } catch (err) {
        console.error("Failed to fetch template details:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch template details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [templateId]);

  return { exercises, loading, error };
}
