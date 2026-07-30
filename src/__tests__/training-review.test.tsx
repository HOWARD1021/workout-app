import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TrainingReview from "@/components/TrainingReview";
import type { TrainingReviewData } from "@/lib/api";

const review = vi.hoisted(() => ({
  current: null as TrainingReviewData | null,
  initial: {
    activeGoal: {
      id: "goal-1",
      type: "strength" as const,
      name: "臥推力量",
      exerciseId: "bench",
      baseline: 90,
      target: 110,
      windowWeeks: 8,
      startsAt: "2026-07-27",
      endsAt: "2026-09-21",
      status: "active" as const,
    },
    state: "goal-ready" as const,
    currentWeekStart: "2026-07-27",
    weeklyGoalSet: {
      id: "set-1",
      status: "accepted" as const,
      actions: [{ id: "bench", label: "臥推", exerciseId: "bench", expectedSessions: 2 }],
      acceptedAt: "2026-07-27T00:00:00.000Z",
    },
    weeklyProgress: [{ id: "bench", label: "臥推", exerciseId: "bench", expectedSessions: 2, achievedSessions: 1, completed: false }],
    progressSummary: { completedActions: 0, expectedActions: 1, currentValue: 101, baseline: 90, delta: 11, hasObservation: true },
    growthCurve: [
      { weekStart: "2026-07-27", value: 101, actualWeight: 85, reps: 6, setCount: 3, weeklyVolume: 2100, evidence: [] },
      { weekStart: "2026-08-03", value: null, actualWeight: null, reps: null, setCount: 0, weeklyVolume: 0, evidence: [] },
    ],
    milestones: [],
    timeline: [],
    supportingMetrics: { frequency: { value: 1, label: "本週訓練次數" }, volume: { value: 2100, label: "本週訓練量" } },
  },
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/lib/api", () => ({
  goalsApi: {
    review: vi.fn(async () => review.current!),
    create: vi.fn(),
    updateWeekly: vi.fn(),
    createWeekly: vi.fn(),
  },
  exercisesApi: { list: vi.fn(async () => [{ id: "bench", name: "Bench Press", nameZh: "臥推", type: "Strength" }]) },
}));

describe("TrainingReview", () => {
  beforeEach(() => {
    review.current = review.initial;
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify([{ id: "workout-1" }]), { status: 200 })));
  });

  it("prioritizes weekly progress, summary, curve, and focused timeline", async () => {
    render(<TrainingReview />);
    expect(await screen.findByText("訓練回顧")).toBeInTheDocument();
    expect(await screen.findByText("本週進度")).toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
    expect(screen.getByText(/本週完成 0\/1 個週目標/)).toBeInTheDocument();
    expect(screen.getByText("成長曲線")).toBeInTheDocument();
    expect(screen.getByText("本週相關訓練")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("本週訓練次數")).toBeInTheDocument());
  });

  it("shows a useful setup state without an active goal", async () => {
    review.current = { ...review.current!, activeGoal: null, state: "no-goal", weeklyProgress: [], growthCurve: [], milestones: [], timeline: [], supportingMetrics: { frequency: { value: 0, label: "本週訓練次數" }, volume: { value: 0, label: "本週訓練量" } } };
    render(<TrainingReview />);
    expect(await screen.findByText("尚未設定訓練目標")).toBeInTheDocument();
    expect(screen.getByText("建立訓練目標")).toBeInTheDocument();
    expect(screen.getByLabelText("目標類型")).toBeInTheDocument();
  });
});
