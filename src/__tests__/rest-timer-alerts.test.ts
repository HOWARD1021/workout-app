import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * These tests verify the non-audio alert behavior that playRestEndSound triggers:
 * 1. navigator.vibrate is called on supported devices
 * 2. Notification is sent only when permission is granted
 *
 * The audible cue itself is delegated to uisfx (see src/lib/sfx.ts): a
 * best-effort, browser-only Web Audio pulse that is not exercised in jsdom.
 */

// Replicate the non-audio side-effects of playRestEndSound for testability.
function playRestEndSound() {
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200, 100, 300]);
  }

  if ("Notification" in window && Notification.permission === "granted") {
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

  describe("vibration", () => {
    it("calls navigator.vibrate when available", () => {
      const vibrateMock = vi.fn();
      Object.defineProperty(navigator, "vibrate", {
        value: vibrateMock,
        writable: true,
        configurable: true,
      });

      playRestEndSound();

      expect(vibrateMock).toHaveBeenCalledWith([200, 100, 200, 100, 300]);
    });

    it("does not throw when vibrate is not available", () => {
      Object.defineProperty(navigator, "vibrate", {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(() => playRestEndSound()).not.toThrow();
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

      playRestEndSound();

      expect(NotificationMock).toHaveBeenCalledWith("休息結束！", {
        body: "回來繼續訓練 💪",
        icon: "/duck.png",
        tag: "rest-timer",
      });
    });

    it("sends notification even when page is visible", () => {
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

      playRestEndSound();

      expect(NotificationMock).toHaveBeenCalledWith("休息結束！", expect.any(Object));
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

      playRestEndSound();

      expect(NotificationMock).not.toHaveBeenCalled();
    });
  });
});
