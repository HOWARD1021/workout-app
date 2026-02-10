"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Dumbbell, Search, Plus } from "lucide-react";
import { exercisesApi, type Exercise } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ExercisesPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await exercisesApi.list();
        setExercises(data);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="font-bold text-lg text-[#3C3C3C]">Exercise Library</h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#AFAFAF]" />
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-2 border-[#E5E5E5] focus:border-[#58CC02]"
          />
        </div>

        {/* Exercise Groups */}
        {Object.entries(groupedExercises).map(([group, groupExercises]) => (
          <Card key={group} className="bg-white border-2 border-[#E5E5E5] mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#3C3C3C] text-lg">{group}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {groupExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#F7F7F7]"
                  >
                    <Dumbbell className="h-5 w-5 text-[#58CC02]" />
                    <div>
                      <p className="font-medium text-[#3C3C3C]">{exercise.name}</p>
                      <p className="text-sm text-[#AFAFAF]">{exercise.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Exercise Button (placeholder) */}
        <Button
          className="w-full bg-[#1CB0F6] hover:bg-[#0A9AD6] text-white py-6"
          disabled
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Custom Exercise (Coming Soon)
        </Button>
      </div>
    </div>
  );
}
