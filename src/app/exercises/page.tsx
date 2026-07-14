"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Dumbbell, Search, Plus, Eye } from "lucide-react";
import { exercisesApi, type Exercise } from "@/lib/api";
import { useRouter } from "next/navigation";
import ExerciseImageDialog from "@/components/ExerciseImageDialog";
import { useTranslation, useI18n } from "@/lib/i18n";

export default function ExercisesPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { locale } = useI18n();
  const isZh = locale === "zh-TW";
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageDialog, setImageDialog] = useState<{
    open: boolean;
    name: string;
    muscleGroup: string | null;
    gifUrl: string | null;
    imageUrl: string | null;
  }>({ open: false, name: "", muscleGroup: null, gifUrl: null, imageUrl: null });

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
              {t("common.back")}
            </Button>
            <h1 className="font-bold text-lg text-[#2D3648]">{t("exercises.title")}</h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#AFAFAF]" />
          <Input
            placeholder={t("workout.searchExercises")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-2 border-[#E5E5E5] focus:border-[#58CC02]"
          />
        </div>

        {/* Exercise Groups */}
        {Object.entries(groupedExercises).map(([group, groupExercises]) => (
          <Card key={group} className="bg-white border-2 border-[#E5E5E5] mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#2D3648] text-lg">{group}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {groupExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#F7F7F7]"
                  >
                    {exercise.imageUrl || exercise.gifUrl ? (
                      <img
                        src={exercise.imageUrl || exercise.gifUrl || ""}
                        alt={exercise.name}
                        className="w-12 h-12 rounded-lg object-cover bg-white"
                      />
                    ) : (
                      <Dumbbell className="h-5 w-5 text-[#58CC02] shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#2D3648] truncate">
                        {isZh && exercise.nameZh ? exercise.nameZh : exercise.name}
                      </p>
                      {isZh && exercise.nameZh && (
                        <p className="text-xs text-[#AFAFAF] truncate">{exercise.name}</p>
                      )}
                      <p className="text-xs text-[#AFAFAF]">{exercise.type}</p>
                    </div>
                    <button
                      onClick={() =>
                        setImageDialog({
                          open: true,
                          name: isZh && exercise.nameZh ? exercise.nameZh : exercise.name,
                          muscleGroup: exercise.muscleGroup,
                          gifUrl: exercise.gifUrl,
                          imageUrl: exercise.imageUrl,
                        })
                      }
                      className="p-2 rounded-md hover:bg-[#E8F5E9] text-[#AFAFAF] hover:text-[#58CC02] transition-colors"
                      title="查看動作"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Exercise Image Dialog */}
        <ExerciseImageDialog
          open={imageDialog.open}
          onOpenChange={(open) => setImageDialog((prev) => ({ ...prev, open }))}
          exerciseName={imageDialog.name}
          muscleGroup={imageDialog.muscleGroup}
          gifUrl={imageDialog.gifUrl}
          imageUrl={imageDialog.imageUrl}
        />

        {/* Add Exercise Button (placeholder) */}
        <Button
          className="w-full bg-[#1CB0F6] hover:bg-[#0A9AD6] text-white py-6"
          disabled
        >
          <Plus className="h-5 w-5 mr-2" />
          {t("exercises.addCustom")}
        </Button>
      </div>
    </div>
  );
}
