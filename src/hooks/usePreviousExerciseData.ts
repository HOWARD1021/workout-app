"use client";

import { useState, useEffect, useCallback } from "react";
import { exercisesApi } from "@/lib/api";

export interface PreviousData {
  weight: number;
  reps: number;
  date: string;
}

export function usePreviousExerciseData(exerciseIds: string[]) {
  const [previousData, setPreviousData] = useState<Map<string, PreviousData>>(
    new Map()
  );
  const [loading, setLoading] = useState(false);

  const fetchPreviousData = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return;

    setLoading(true);
    try {
      const data = await exercisesApi.getPrevious(ids);

      const dataMap = new Map<string, PreviousData>();
      Object.entries(data).forEach(([exerciseId, prevData]) => {
        dataMap.set(exerciseId, prevData);
      });

      setPreviousData(dataMap);
    } catch (err) {
      console.error("Failed to fetch previous exercise data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (exerciseIds.length > 0) {
      fetchPreviousData(exerciseIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseIds.length, fetchPreviousData]);

  const getPrevious = useCallback(
    (exerciseId: string): string => {
      const data = previousData.get(exerciseId);
      if (data) {
        return `${data.weight}kg × ${data.reps}`;
      }
      return "-- × --";
    },
    [previousData]
  );

  const fetchForExercise = useCallback(
    async (exerciseId: string) => {
      await fetchPreviousData([exerciseId]);
    },
    [fetchPreviousData]
  );

  return {
    previousData,
    loading,
    getPrevious,
    fetchForExercise,
    refetch: () => fetchPreviousData(exerciseIds),
  };
}
