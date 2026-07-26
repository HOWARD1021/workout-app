import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WorkoutProvider, useWorkout } from "@/contexts/WorkoutContext";
import WorkoutLogger from "@/components/WorkoutLogger";
import * as api from "@/lib/api";
import { toast } from "sonner";

vi.mock("next/navigation", () => ({
  usePathname: () => "/log",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/hooks/usePreviousExerciseData", () => ({
  usePreviousExerciseData: () => ({
    getPrevious: () => "-- × --",
    fetchForExercise: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock("@/hooks/useWorkoutTemplates", () => ({
  useTemplateDetails: () => ({ exercises: [] }),
  useWorkoutTemplates: () => ({
    templates: [],
    updateTemplateUsage: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  },
}));

const mockExercise = {
  id: "exercise-1",
  name: "Bench Press",
  nameZh: "臥推",
  type: "Strength",
  muscleGroup: "Chest",
  imageUrl: null,
  gifUrl: null,
  isCustom: false,
  createdAt: null,
  deletedAt: null,
};

function FinishProbe() {
  const { isWorkoutActive, isFinishing, completedSummary, finishWorkout } =
    useWorkout();

  return (
    <div>
      <span>{isWorkoutActive ? "active" : "inactive"}</span>
      <span>{isFinishing ? "saving" : "idle"}</span>
      <span>{completedSummary ? "summary-ready" : "no-summary"}</span>
      <button onClick={() => void finishWorkout()}>finish</button>
    </div>
  );
}

describe("workout finish flow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const storage = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
    });
    localStorage.setItem(
      "workout-active-session",
      JSON.stringify({
        exerciseBlocks: [
          {
            id: "block-1",
            exercise: {
              id: "exercise-1",
              name: "Bench Press",
              nameZh: "臥推",
              type: "Strength",
              muscleGroup: "Chest",
              imageUrl: null,
              gifUrl: null,
              isCustom: false,
              createdAt: null,
              deletedAt: null,
            },
            sets: [
              {
                set_order: 1,
                weight: 80,
                reps: 8,
                completed: true,
              },
            ],
          },
        ],
        startTimeISO: "2026-07-14T08:00:00.000Z",
        templateId: null,
      })
    );

    vi.spyOn(api.exercisesApi, "list").mockResolvedValue([mockExercise]);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("does not let optional PR analytics block saving or completing", async () => {
    vi.spyOn(api.analyticsApi, "prs").mockImplementation(
      () => new Promise(() => {})
    );
    const createWorkout = vi
      .spyOn(api.workoutsApi, "create")
      .mockResolvedValue({
        id: "workout-1",
        templateId: null,
        startedAt: "2026-07-14T08:00:00.000Z",
        endedAt: "2026-07-14T09:00:00.000Z",
        note: null,
        createdAt: null,
        deletedAt: null,
      });

    render(
      <WorkoutProvider>
        <FinishProbe />
      </WorkoutProvider>
    );

    expect(screen.getByText("active")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "finish" }));

    expect(createWorkout).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000);
    });

    expect(screen.getByText("inactive")).toBeInTheDocument();
    expect(screen.getByText("summary-ready")).toBeInTheDocument();
  });

  it("prevents duplicate saves while a finish is in progress", async () => {
    vi.spyOn(api.analyticsApi, "prs").mockResolvedValue([]);
    let resolveSave!: (workout: api.Workout) => void;
    const createWorkout = vi
      .spyOn(api.workoutsApi, "create")
      .mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveSave = resolve;
          })
      );

    render(
      <WorkoutProvider>
        <FinishProbe />
      </WorkoutProvider>
    );

    const finishButton = screen.getByRole("button", { name: "finish" });
    fireEvent.click(finishButton);
    fireEvent.click(finishButton);

    expect(createWorkout).toHaveBeenCalledTimes(1);
    expect(screen.getByText("saving")).toBeInTheDocument();

    await act(async () => {
      resolveSave({
        id: "workout-1",
        templateId: null,
        startedAt: "2026-07-14T08:00:00.000Z",
        endedAt: "2026-07-14T09:00:00.000Z",
        note: null,
        createdAt: null,
        deletedAt: null,
      });
    });

    expect(screen.getByText("idle")).toBeInTheDocument();
    expect(screen.getByText("inactive")).toBeInTheDocument();
  });

  it("unlocks the workout when the save request times out", async () => {
    vi.spyOn(api.analyticsApi, "prs").mockResolvedValue([]);
    vi.spyOn(api.workoutsApi, "create").mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <WorkoutProvider>
        <FinishProbe />
      </WorkoutProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "finish" }));
    expect(screen.getByText("saving")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000);
    });

    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("idle")).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("儲存逾時，請再試一次。");
  });

  it("keeps the workout recoverable and reports a save failure", async () => {
    vi.spyOn(api.analyticsApi, "prs").mockResolvedValue([]);
    vi.spyOn(api.workoutsApi, "create").mockRejectedValue(
      new api.ApiError(401, "Unauthorized")
    );
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <WorkoutProvider>
        <FinishProbe />
      </WorkoutProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "finish" }));
      await Promise.resolve();
    });

    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("idle")).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith(
      "登入已過期，請重新登入後再儲存。"
    );
  });

  it("sends resolved exercise ids when saving completed sets", async () => {
    vi.spyOn(api.analyticsApi, "prs").mockResolvedValue([]);
    const createWorkout = vi
      .spyOn(api.workoutsApi, "create")
      .mockResolvedValue({
        id: "workout-1",
        templateId: null,
        startedAt: "2026-07-14T08:00:00.000Z",
        endedAt: "2026-07-14T09:00:00.000Z",
        note: null,
        createdAt: null,
        deletedAt: null,
      });

    render(
      <WorkoutProvider>
        <FinishProbe />
      </WorkoutProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "finish" }));
      await Promise.resolve();
    });

    expect(createWorkout).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        logs: [
          expect.objectContaining({
            exercise_id: "exercise-1",
            set_order: 1,
            weight: 80,
            reps: 8,
          }),
        ],
      }),
      { signal: expect.any(AbortSignal) }
    );
  });

  it("opens a close confirmation from the active workout logger", async () => {
    render(
      <WorkoutProvider>
        <WorkoutLogger />
      </WorkoutProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(
      screen.getByRole("heading", { name: "結束此次訓練？" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /繼續訓練/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /放棄此次訓練/ })).toBeInTheDocument();
  });

  it("discards the active workout and clears local recovery data", async () => {
    render(
      <WorkoutProvider>
        <WorkoutLogger />
        <FinishProbe />
      </WorkoutProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getByRole("button", { name: /放棄此次訓練/ }));

    expect(screen.getByText("inactive")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "結束此次訓練？" })).not.toBeInTheDocument();
    expect(localStorage.getItem("workout-active-session")).toBeNull();
  });

  it("lets an empty active workout exit without enabling an invalid save", async () => {
    localStorage.setItem(
      "workout-active-session",
      JSON.stringify({
        exerciseBlocks: [],
        startTimeISO: "2026-07-14T08:00:00.000Z",
        templateId: null,
      })
    );

    render(
      <WorkoutProvider>
        <WorkoutLogger />
        <FinishProbe />
      </WorkoutProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByRole("button", { name: "Finish" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getByRole("button", { name: /放棄此次訓練/ }));

    expect(screen.getByText("inactive")).toBeInTheDocument();
  });

  it("shows a retry action after a close-flow save failure", async () => {
    vi.spyOn(api.analyticsApi, "prs").mockResolvedValue([]);
    vi.spyOn(api.workoutsApi, "create").mockRejectedValue(
      new api.ApiError(503, "Failed")
    );

    render(
      <WorkoutProvider>
        <WorkoutLogger />
        <FinishProbe />
      </WorkoutProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getByRole("button", { name: /結束並儲存/ }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByRole("alert")).toHaveTextContent("伺服器暫時無法儲存");
    expect(screen.getByRole("button", { name: /重試儲存/ })).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("idle")).toBeInTheDocument();
  });

  it("reuses the same submission identity when a save is retried", async () => {
    vi.spyOn(api.analyticsApi, "prs").mockResolvedValue([]);
    const createWorkout = vi
      .spyOn(api.workoutsApi, "create")
      .mockRejectedValueOnce(new api.ApiError(503, "Failed"))
      .mockResolvedValueOnce({
        id: "workout-1",
        templateId: null,
        startedAt: "2026-07-14T08:00:00.000Z",
        endedAt: "2026-07-14T09:00:00.000Z",
        note: null,
        createdAt: null,
        deletedAt: null,
      });

    render(
      <WorkoutProvider>
        <FinishProbe />
      </WorkoutProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "finish" }));
      await Promise.resolve();
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "finish" }));
      await Promise.resolve();
    });

    expect(createWorkout).toHaveBeenCalledTimes(2);
    expect(createWorkout.mock.calls[0][0].id).toBe(
      createWorkout.mock.calls[1][0].id
    );
    expect(screen.getByText("inactive")).toBeInTheDocument();
  });
});
