import { readFileSync } from "node:fs";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

type ServiceWorkerEvent = {
  data: { type: string; endTime?: number };
  waitUntil?: (promise: Promise<unknown>) => void;
};

type Listener = (event: ServiceWorkerEvent) => void;

function loadServiceWorker() {
  const listeners = new Map<string, Listener>();
  const showNotification = vi.fn(() => Promise.resolve());
  const selfMock = {
    location: { origin: "https://workout.example" },
    registration: { showNotification },
    addEventListener: vi.fn((type: string, listener: Listener) => {
      listeners.set(type, listener);
    }),
    clients: {
      matchAll: vi.fn(() => Promise.resolve([])),
      openWindow: vi.fn(() => Promise.resolve()),
    },
  };
  const source = readFileSync(`${process.cwd()}/public/sw.js`, "utf8");

  new Function("self", source)(selfMock);

  return { listeners, showNotification };
}

describe("service worker rest timer", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("notifies immediately when a timer message is already expired", async () => {
    const { listeners, showNotification } = loadServiceWorker();
    const waitUntil = vi.fn();

    listeners.get("message")?.({
      data: { type: "START_TIMER", endTime: Date.now() - 1 },
      waitUntil,
    });

    expect(showNotification).toHaveBeenCalledTimes(1);
    expect(waitUntil).toHaveBeenCalledTimes(1);
  });

  it("replaces an existing timer instead of firing the old deadline", () => {
    const { listeners, showNotification } = loadServiceWorker();
    const message = listeners.get("message")!;

    message({ data: { type: "START_TIMER", endTime: Date.now() + 1_000 } });
    message({ data: { type: "START_TIMER", endTime: Date.now() + 2_000 } });

    vi.advanceTimersByTime(1_000);
    expect(showNotification).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1_000);
    expect(showNotification).toHaveBeenCalledTimes(1);
  });

  it("stops a pending timer without showing a notification", () => {
    const { listeners, showNotification } = loadServiceWorker();
    const message = listeners.get("message")!;

    message({ data: { type: "START_TIMER", endTime: Date.now() + 1_000 } });
    message({ data: { type: "STOP_TIMER" } });
    vi.advanceTimersByTime(2_000);

    expect(showNotification).not.toHaveBeenCalled();
  });
});
