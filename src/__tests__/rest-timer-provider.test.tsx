import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import { WorkoutProvider, useWorkout } from "@/contexts/WorkoutContext";
import * as api from "@/lib/api";

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

let postServiceWorkerMessage: ReturnType<typeof vi.fn>;

// Minimal AudioContext stub so the provider's interaction-time init succeeds.
// The actual rest/reward cues are delegated to uisfx and are not exercised here.
class StubAudioContext {
  state: AudioContextState = "running";
  currentTime = 0;
  destination = {};
  resume = vi.fn(() => Promise.resolve());
}

function TimerProbe() {
  const { startRestTimer } = useWorkout();
  return <button onClick={() => startRestTimer(1)}>start timer</button>;
}

describe("rest timer provider alerts", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const storage = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
    });
    vi.spyOn(api.exercisesApi, "list").mockResolvedValue([]);
    postServiceWorkerMessage = vi.fn();
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { controller: { postMessage: postServiceWorkerMessage } },
    });
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      writable: true,
      value: StubAudioContext,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (navigator as unknown as { serviceWorker?: unknown }).serviceWorker;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("fires the rest-over alert when the timer completes", async () => {
    render(
      <WorkoutProvider userId="user-1">
        <TimerProbe />
      </WorkoutProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "start timer" }));

    expect(toast.success).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_000);
    });

    // The audio cue itself is delegated to uisfx (best-effort, browser-only);
    // the durable, observable contract is that the rest-over alert fires.
    expect(toast.success).toHaveBeenCalledWith(
      expect.stringContaining("休息結束"),
      expect.anything()
    );
  });

  it("stops the background timer when the page completes the alert", async () => {
    render(
      <WorkoutProvider userId="user-1">
        <TimerProbe />
      </WorkoutProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "start timer" }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_000);
    });

    expect(postServiceWorkerMessage).toHaveBeenCalledWith({
      type: "START_TIMER",
      endTime: expect.any(Number),
    });
    expect(postServiceWorkerMessage).toHaveBeenCalledWith({
      type: "STOP_TIMER",
    });
  });
});
