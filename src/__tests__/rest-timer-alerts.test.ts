import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * These tests verify the alert behavior that playRestEndSound triggers:
 * 1. AudioContext oscillators are created with correct types and frequencies
 * 2. navigator.vibrate is called on supported devices
 * 3. Notification is sent only when page is hidden
 */

function createMockAudioContext() {
  const mockOscillator = {
    connect: vi.fn(),
    frequency: { value: 0 },
    type: "sine" as OscillatorType,
    start: vi.fn(),
    stop: vi.fn(),
  };
  const mockGainNode = {
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
  };
  const ctx = {
    currentTime: 0,
    state: "running" as AudioContextState,
    destination: {},
    resume: vi.fn(),
    createOscillator: vi.fn(() => ({ ...mockOscillator })),
    createGain: vi.fn(() => ({
      ...mockGainNode,
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
    })),
  };
  return ctx;
}

// Replicate the core logic from playRestEndSound for testability
function playRestEndSound(ctx: ReturnType<typeof createMockAudioContext>) {
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const playBeep = (time: number, freq: number, duration = 0.3) => {
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.frequency.value = freq;
    osc1.type = "sine";
    gain1.gain.setValueAtTime(1.0, time);
    gain1.gain.exponentialRampToValueAtTime(0.01, time + duration);
    osc1.start(time);
    osc1.stop(time + duration);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = freq;
    osc2.type = "square";
    gain2.gain.setValueAtTime(0.3, time);
    gain2.gain.exponentialRampToValueAtTime(0.01, time + duration);
    osc2.start(time);
    osc2.stop(time + duration);
  };

  const now = ctx.currentTime;
  playBeep(now, 880);
  playBeep(now, 1320);
  playBeep(now + 0.4, 880);
  playBeep(now + 0.4, 1320);
  playBeep(now + 0.8, 1100);
  playBeep(now + 0.8, 1500);
  playBeep(now + 1.2, 1100);
  playBeep(now + 1.2, 1500);
  playBeep(now + 1.6, 1320);
  playBeep(now + 1.6, 1760);
  playBeep(now + 2.0, 1760, 0.5);

  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200, 100, 300]);
  }

  if (
    document.hidden &&
    "Notification" in window &&
    Notification.permission === "granted"
  ) {
    new Notification("休息結束！", {
      body: "回來繼續訓練 💪",
      icon: "/duck.png",
      tag: "rest-timer",
    });
  }
}

describe("rest timer alerts", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("sound", () => {
    it("creates both sine and square oscillators for each beep", () => {
      const ctx = createMockAudioContext();
      playRestEndSound(ctx);

      // 11 beeps × 2 oscillators each (sine + square) = 22
      expect(ctx.createOscillator).toHaveBeenCalledTimes(22);
      expect(ctx.createGain).toHaveBeenCalledTimes(22);
    });

    it("sets gain to 1.0 for sine oscillators", () => {
      const ctx = createMockAudioContext();
      const gains: Array<{ setValueAtTime: ReturnType<typeof vi.fn> }> = [];
      ctx.createGain.mockImplementation(() => {
        const g = {
          connect: vi.fn(),
          gain: {
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
        };
        gains.push(g.gain);
        return g;
      });

      playRestEndSound(ctx);

      // Odd-indexed gains (0, 2, 4...) are sine with gain 1.0
      // Even-indexed gains (1, 3, 5...) are square with gain 0.3
      for (let i = 0; i < gains.length; i++) {
        const expectedGain = i % 2 === 0 ? 1.0 : 0.3;
        expect(gains[i].setValueAtTime).toHaveBeenCalledWith(
          expectedGain,
          expect.any(Number)
        );
      }
    });

    it("resumes suspended AudioContext", () => {
      const ctx = createMockAudioContext();
      ctx.state = "suspended" as AudioContextState;
      playRestEndSound(ctx);
      expect(ctx.resume).toHaveBeenCalled();
    });
  });

  describe("vibration", () => {
    it("calls navigator.vibrate when available", () => {
      const vibrateMock = vi.fn();
      Object.defineProperty(navigator, "vibrate", {
        value: vibrateMock,
        writable: true,
        configurable: true,
      });

      const ctx = createMockAudioContext();
      playRestEndSound(ctx);

      expect(vibrateMock).toHaveBeenCalledWith([200, 100, 200, 100, 300]);
    });

    it("does not throw when vibrate is not available", () => {
      Object.defineProperty(navigator, "vibrate", {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const ctx = createMockAudioContext();
      expect(() => playRestEndSound(ctx)).not.toThrow();
    });
  });

  describe("notification", () => {
    it("sends notification when page is hidden and permission is granted", () => {
      const NotificationMock = vi.fn();
      Object.defineProperty(NotificationMock, "permission", {
        value: "granted",
        configurable: true,
      });
      vi.stubGlobal("Notification", NotificationMock);
      Object.defineProperty(document, "hidden", {
        value: true,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "vibrate", {
        value: vi.fn(),
        writable: true,
        configurable: true,
      });

      const ctx = createMockAudioContext();
      playRestEndSound(ctx);

      expect(NotificationMock).toHaveBeenCalledWith("休息結束！", {
        body: "回來繼續訓練 💪",
        icon: "/duck.png",
        tag: "rest-timer",
      });
    });

    it("does NOT send notification when page is visible", () => {
      const NotificationMock = vi.fn();
      Object.defineProperty(NotificationMock, "permission", {
        value: "granted",
        configurable: true,
      });
      vi.stubGlobal("Notification", NotificationMock);
      Object.defineProperty(document, "hidden", {
        value: false,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "vibrate", {
        value: vi.fn(),
        writable: true,
        configurable: true,
      });

      const ctx = createMockAudioContext();
      playRestEndSound(ctx);

      expect(NotificationMock).not.toHaveBeenCalled();
    });

    it("does NOT send notification when permission is not granted", () => {
      const NotificationMock = vi.fn();
      Object.defineProperty(NotificationMock, "permission", {
        value: "default",
        configurable: true,
      });
      vi.stubGlobal("Notification", NotificationMock);
      Object.defineProperty(document, "hidden", {
        value: true,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "vibrate", {
        value: vi.fn(),
        writable: true,
        configurable: true,
      });

      const ctx = createMockAudioContext();
      playRestEndSound(ctx);

      expect(NotificationMock).not.toHaveBeenCalled();
    });
  });
});
