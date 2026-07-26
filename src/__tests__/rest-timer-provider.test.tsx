import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

let resolveAudioResume!: () => void;
let oscillatorStarts = 0;
let postServiceWorkerMessage: ReturnType<typeof vi.fn>;

class DeferredAudioContext {
  state: AudioContextState = "suspended";
  currentTime = 0;
  destination = {};
  resume = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        resolveAudioResume = () => {
          this.state = "running";
          resolve();
        };
      })
  );

  createOscillator() {
    return {
      connect: vi.fn(),
      frequency: { value: 0 },
      type: "sine" as OscillatorType,
      start: vi.fn(() => {
        oscillatorStarts += 1;
      }),
      stop: vi.fn(),
    };
  }

  createGain() {
    return {
      connect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
    };
  }
}

function TimerProbe() {
  const { startRestTimer } = useWorkout();
  return <button onClick={() => startRestTimer(1)}>start timer</button>;
}

describe("rest timer provider alerts", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    oscillatorStarts = 0;
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
      value: DeferredAudioContext,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (navigator as unknown as { serviceWorker?: unknown }).serviceWorker;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("waits for AudioContext resume before playing the rest alert", async () => {
    render(
      <WorkoutProvider>
        <TimerProbe />
      </WorkoutProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "start timer" }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_000);
    });

    expect(oscillatorStarts).toBe(0);

    resolveAudioResume();
    await act(async () => {
      await Promise.resolve();
    });

    expect(oscillatorStarts).toBeGreaterThan(0);
  });

  it("stops the background timer when the page completes the alert", async () => {
    render(
      <WorkoutProvider>
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
