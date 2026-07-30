import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import WorkoutComplete from "@/components/WorkoutComplete";
import * as membershipLib from "@/lib/membership";
import * as api from "@/lib/api";

const duckMascotMock = vi.hoisted(() => vi.fn());

// Mock dependencies
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/i18n", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  useI18n: () => ({ locale: "zh-TW" }),
}));

vi.mock("@/components/DuckMascot", () => ({
  default: (props: { variant?: string }) => {
    duckMascotMock(props);
    return <div data-testid="duck-mascot" data-variant={props.variant} />;
  },
}));

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

const baseSummary = {
  exerciseCount: 3,
  totalSets: 9,
  totalVolume: 5000,
  duration: 3600,
  exercises: [
    { name: "Bench Press", maxWeight: 80, totalSets: 3, totalVolume: 2000 },
  ],
  muscleGroups: [{ name: "Chest", volume: 5000, color: "#FF4B4B" }],
  newPRs: [],
};

const emptyMonthlyRecap = {
  month: "2026-07",
  start: "2026-07-01T00:00:00.000Z",
  end: "2026-08-01T00:00:00.000Z",
  workoutCount: 0,
  exerciseCount: 0,
  totalSets: 0,
  totalReps: 0,
  totalVolume: 0,
  totalDurationMinutes: 0,
  averageDurationMinutes: 0,
  exercises: [],
  muscleGroups: [],
};

describe("WorkoutComplete cost efficiency card", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    const storage = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: vi.fn((key: string) => storage.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storage.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        storage.delete(key);
      }),
      clear: vi.fn(() => {
        storage.clear();
      }),
    });
    duckMascotMock.mockClear();

    // Default: achievements check returns empty
    vi.spyOn(api.achievementsApi, "check").mockResolvedValue({
      newUnlocks: [],
    });
    vi.spyOn(api.analyticsApi, "monthlyRecap").mockResolvedValue(emptyMonthlyRecap);
  });

  it("uses the normal completion mascot when no PR was broken", () => {
    render(<WorkoutComplete summary={baseSummary} />);

    expect(screen.getByTestId("duck-mascot")).toHaveAttribute(
      "data-variant",
      "complete"
    );
  });

  it("uses the PR mascot only when the workout produced new PRs", () => {
    render(
      <WorkoutComplete
        summary={{
          ...baseSummary,
          newPRs: [
            { exerciseName: "Bench Press", weight: 85, previousBest: 80 },
          ],
        }}
      />
    );

    expect(screen.getByTestId("duck-mascot")).toHaveAttribute(
      "data-variant",
      "pr"
    );
    expect(screen.getByText("1 個新紀錄！")).toBeInTheDocument();
  });

  it("shows a month-end recap with exercises and visit count", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-07-30T12:00:00+08:00"));
    vi.spyOn(api.analyticsApi, "monthlyRecap").mockResolvedValue({
      month: "2026-07",
      start: "2026-06-30T16:00:00.000Z",
      end: "2026-07-31T16:00:00.000Z",
      workoutCount: 5,
      exerciseCount: 2,
      totalSets: 18,
      totalReps: 144,
      totalVolume: 10880,
      totalDurationMinutes: 310,
      averageDurationMinutes: 62,
      exercises: [
        {
          exerciseId: "bench",
          exerciseName: "Bench Press",
          muscleGroup: "Chest",
          totalSets: 10,
          totalReps: 80,
          totalVolume: 6400,
          maxWeight: 85,
          workoutCount: 3,
          lastTrainedAt: "2026-07-28T10:00:00.000Z",
        },
      ],
      muscleGroups: [
        { muscleGroup: "Chest", totalSets: 10, totalVolume: 6400 },
      ],
    });

    render(<WorkoutComplete summary={baseSummary} />);

    expect(await screen.findByText("本月訓練回顧")).toBeInTheDocument();
    expect(screen.getByText("本月已來 5 次，完成 2 個動作")).toBeInTheDocument();
    expect(screen.getAllByText("Bench Press").length).toBeGreaterThanOrEqual(1);
    expect(localStorage.getItem("workout-monthly-recap-seen:2026-07")).toBe(
      "1"
    );
  });

  it("shows cost efficiency card when membership is configured", async () => {
    const membership = {
      cost: 1500,
      period: "monthly" as const,
      startDate: "2025-01-01",
    };

    vi.spyOn(membershipLib, "loadMembership").mockReturnValue(membership);
    vi.spyOn(membershipLib, "calculateMembershipStats").mockReturnValue({
      daysSinceStart: 45,
      totalCostSoFar: 3000,
      costPerVisit: 300,
      costPerDay: 67,
      nextVisitCost: 273,
    });

    // Mock workoutsApi.list to return workouts after membership start
    vi.spyOn(api.workoutsApi, "list").mockResolvedValue([
      {
        id: "1",
        templateId: null,
        startedAt: "2025-01-15T10:00:00Z",
        endedAt: "2025-01-15T11:00:00Z",
        note: null,
        createdAt: null,
        deletedAt: null,
      },
      {
        id: "2",
        templateId: null,
        startedAt: "2025-02-01T10:00:00Z",
        endedAt: "2025-02-01T11:00:00Z",
        note: null,
        createdAt: null,
        deletedAt: null,
      },
    ]);

    render(<WorkoutComplete summary={baseSummary} />);

    await waitFor(() => {
      expect(screen.getByText("會費效率")).toBeInTheDocument();
    });

    expect(screen.getByText("$300")).toBeInTheDocument();
    expect(
      screen.getByText(/再去一次就降到 \$273/)
    ).toBeInTheDocument();
  });

  it("does NOT show cost card when no membership configured", async () => {
    vi.spyOn(membershipLib, "loadMembership").mockReturnValue(null);

    render(<WorkoutComplete summary={baseSummary} />);

    // Wait a tick for effects to run
    await new Promise((r) => setTimeout(r, 50));

    expect(screen.queryByText("會費效率")).not.toBeInTheDocument();
  });

  it("does NOT show cost card when no workouts since membership start", async () => {
    const membership = {
      cost: 1500,
      period: "monthly" as const,
      startDate: "2026-01-01",
    };

    vi.spyOn(membershipLib, "loadMembership").mockReturnValue(membership);
    vi.spyOn(api.workoutsApi, "list").mockResolvedValue([
      {
        id: "1",
        templateId: null,
        startedAt: "2024-12-01T10:00:00Z", // Before membership start
        endedAt: "2024-12-01T11:00:00Z",
        note: null,
        createdAt: null,
        deletedAt: null,
      },
    ]);

    render(<WorkoutComplete summary={baseSummary} />);

    await new Promise((r) => setTimeout(r, 50));

    expect(screen.queryByText("會費效率")).not.toBeInTheDocument();
  });
});
