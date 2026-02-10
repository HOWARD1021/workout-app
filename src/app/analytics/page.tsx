"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Calendar, Dumbbell } from "lucide-react";
import { workoutsApi, type Workout } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await workoutsApi.list();
        setWorkouts(data);
      } catch (error) {
        console.error("Failed to fetch workouts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  // Calculate stats
  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((acc, w) => {
    return (
      acc +
      (w.workout_logs || []).reduce(
        (sum, log) => sum + (log.weight || 0) * (log.reps || 0),
        0
      )
    );
  }, 0);
  const totalSets = workouts.reduce(
    (acc, w) => acc + (w.workout_logs || []).length,
    0
  );

  // Get recent workouts (last 7)
  const recentWorkouts = workouts.slice(0, 7);

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
            <h1 className="font-bold text-lg text-[#3C3C3C]">Analytics</h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-white border-2 border-[#E5E5E5]">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto text-[#58CC02] mb-2" />
              <p className="text-2xl font-bold text-[#3C3C3C]">{totalWorkouts}</p>
              <p className="text-xs text-[#AFAFAF]">Workouts</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-[#E5E5E5]">
            <CardContent className="p-4 text-center">
              <Dumbbell className="h-6 w-6 mx-auto text-[#1CB0F6] mb-2" />
              <p className="text-2xl font-bold text-[#3C3C3C]">
                {Math.round(totalVolume).toLocaleString()}
              </p>
              <p className="text-xs text-[#AFAFAF]">Total kg</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-[#E5E5E5]">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto text-[#FF9600] mb-2" />
              <p className="text-2xl font-bold text-[#3C3C3C]">{totalSets}</p>
              <p className="text-xs text-[#AFAFAF]">Total Sets</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Workouts */}
        <Card className="bg-white border-2 border-[#E5E5E5]">
          <CardHeader>
            <CardTitle className="text-[#3C3C3C]">Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            {recentWorkouts.length === 0 ? (
              <p className="text-center text-[#AFAFAF] py-8">
                No workouts yet. Start your first workout!
              </p>
            ) : (
              <div className="space-y-3">
                {recentWorkouts.map((workout) => {
                  const volume = (workout.workout_logs || []).reduce(
                    (sum, log) => sum + (log.weight || 0) * (log.reps || 0),
                    0
                  );
                  const date = new Date(workout.startedAt);

                  return (
                    <div
                      key={workout.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#F7F7F7]"
                    >
                      <div>
                        <p className="font-medium text-[#3C3C3C]">
                          {date.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-[#AFAFAF]">
                          {(workout.workout_logs || []).length} sets
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#58CC02]">
                          {Math.round(volume).toLocaleString()} kg
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
