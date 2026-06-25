import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import WorkoutComplete from "@/components/WorkoutComplete";
import * as membershipLib from "@/lib/membership";
import * as api from "@/lib/api";

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
  default: () => <div data-testid="duck-mascot" />,
}));

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
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

describe("WorkoutComplete cost efficiency card", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Default: achievements check returns empty
    vi.spyOn(api.achievementsApi, "check").mockResolvedValue({
      newUnlocks: [],
    });
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
