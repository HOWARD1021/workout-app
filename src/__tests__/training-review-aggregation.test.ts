import { describe, expect, it } from "vitest";
import {
  aggregateMetricWeeks,
  aggregateStrengthWeeks,
  calculateActionProgress,
  calculateGoalBaseline,
  estimateOneRepMax,
  getWeekStart,
  isCompletedWorkout,
  isQualifyingSet,
  type GoalWorkoutRow,
} from "@/lib/goal-aggregation";

function row(overrides: Partial<GoalWorkoutRow> = {}): GoalWorkoutRow {
  return {
    workoutId: "workout-1",
    startedAt: "2026-07-27T10:00:00.000Z",
    endedAt: "2026-07-27T11:00:00.000Z",
    deletedAt: null,
    logId: "log-1",
    exerciseId: "bench",
    exerciseName: "Bench Press",
    muscleGroup: "Chest",
    weight: 80,
    reps: 8,
    ...overrides,
  };
}

describe("training review aggregation", () => {
  it("uses one Monday-start UTC week boundary", () => {
    expect(getWeekStart("2026-07-27T00:00:00.000Z")).toBe("2026-07-27");
    expect(getWeekStart("2026-08-02T23:59:59.000Z")).toBe("2026-07-27");
    expect(getWeekStart("2026-08-03T00:00:00.000Z")).toBe("2026-08-03");
  });

  it("filters incomplete, deleted, and non-positive records", () => {
    expect(isCompletedWorkout(row())).toBe(true);
    expect(isCompletedWorkout(row({ endedAt: null }))).toBe(false);
    expect(isCompletedWorkout(row({ deletedAt: "2026-07-28T00:00:00.000Z" }))).toBe(false);
    expect(isQualifyingSet(row())).toBe(true);
    expect(isQualifyingSet(row({ weight: 0 }))).toBe(false);
    expect(isQualifyingSet(row({ reps: 0 }))).toBe(false);
    expect(estimateOneRepMax(80, 8)).toBe(101.33);
  });

  it("selects the highest valid weekly estimated 1RM and exposes gaps", () => {
    const points = aggregateStrengthWeeks(
      [
        row({ workoutId: "w-a", logId: "l-a", weight: 80, reps: 8 }),
        row({ workoutId: "w-b", logId: "l-b", startedAt: "2026-07-30T10:00:00.000Z", endedAt: "2026-07-30T11:00:00.000Z", weight: 85, reps: 6 }),
        row({ workoutId: "w-c", logId: "l-c", startedAt: "2026-08-10T10:00:00.000Z", endedAt: "2026-08-10T11:00:00.000Z", weight: 90, reps: 5 }),
      ],
      "bench",
      "2026-07-27",
      3
    );
    expect(points).toHaveLength(3);
    expect(points[0]).toMatchObject({ value: 102, actualWeight: 85, reps: 6, setCount: 2 });
    expect(points[1].value).toBeNull();
    expect(points[2]).toMatchObject({ value: 105, actualWeight: 90, reps: 5 });
    expect(points[0].evidence[0]).toMatchObject({ actualWeight: 85, reps: 6 });
  });

  it("represents empty frequency and volume weeks as zero", () => {
    const frequency = aggregateMetricWeeks([row()], "frequency", "2026-07-27", 3);
    const volume = aggregateMetricWeeks([row()], "volume", "2026-07-27", 3);
    expect(frequency.map((point) => point.value)).toEqual([1, 0, 0]);
    expect(volume.map((point) => point.value)).toEqual([640, 0, 0]);
  });

  it("counts each qualifying workout once for an action", () => {
    const progress = calculateActionProgress(
      [
        { id: "chest", label: "胸", muscleGroup: "Chest", expectedSessions: 2 },
        { id: "bench", label: "Bench Press", exerciseId: "bench", expectedSessions: 1 },
      ],
      [
        row({ workoutId: "w-a", logId: "l-a" }),
        row({ workoutId: "w-a", logId: "l-b", weight: 75 }),
        row({ workoutId: "w-b", logId: "l-c" }),
        row({ workoutId: "w-c", logId: "l-d", weight: 0 }),
      ],
      "2026-07-27"
    );
    expect(progress[0]).toMatchObject({ achievedSessions: 2, completed: true });
    expect(progress[1]).toMatchObject({ achievedSessions: 2, completed: true });
  });

  it("calculates a baseline from qualifying history only", () => {
    expect(
      calculateGoalBaseline(
        [
          row({ startedAt: "2026-07-01T10:00:00.000Z", weight: 80, reps: 8 }),
          row({ startedAt: "2026-07-08T10:00:00.000Z", weight: 90, reps: 5 }),
          row({ startedAt: "2026-07-15T10:00:00.000Z", weight: 0 }),
        ],
        "strength",
        "bench"
      )
    ).toBe(105);
  });

  it("includes inactive weeks when averaging frequency and volume baselines", () => {
    const history = [
      row({ workoutId: "w-a", startedAt: "2026-07-20T10:00:00.000Z", endedAt: "2026-07-20T11:00:00.000Z", weight: 100, reps: 10 }),
      row({ workoutId: "w-b", startedAt: "2026-07-06T10:00:00.000Z", endedAt: "2026-07-06T11:00:00.000Z", weight: 50, reps: 10 }),
    ];
    expect(calculateGoalBaseline(history, "frequency", null, "2026-08-03")).toBe(0.25);
    expect(calculateGoalBaseline(history, "volume", null, "2026-08-03")).toBe(187.5);
  });
});
