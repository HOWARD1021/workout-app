import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import confetti from "canvas-confetti";
import WorkoutComplete from "@/components/WorkoutComplete";
import * as api from "@/lib/api";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/i18n", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  useI18n: () => ({ locale: "zh-TW" }),
}));

vi.mock("@/components/DuckMascot", () => ({
  default: () => <div data-testid="duck-mascot" />,
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

const summary = {
  exerciseCount: 1,
  totalSets: 1,
  totalVolume: 640,
  duration: 60,
  exercises: [
    {
      name: "Bench Press",
      maxWeight: 80,
      totalSets: 1,
      totalVolume: 640,
    },
  ],
  muscleGroups: [{ name: "Chest", volume: 640, color: "#FF4B4B" }],
  newPRs: [],
};

describe("WorkoutComplete animation performance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(api.achievementsApi, "check").mockResolvedValue({
      newUnlocks: [],
    });
    vi.spyOn(api.analyticsApi, "monthlyRecap").mockResolvedValue({
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
    });
  });

  it("uses a bounded confetti burst without scheduling work every frame", () => {
    const requestAnimationFrame = vi.fn();
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);

    render(<WorkoutComplete summary={summary} />);

    expect(confetti).toHaveBeenCalledTimes(2);
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });
});
