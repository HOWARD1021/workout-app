import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadMembership,
  saveMembership,
  calculateMembershipStats,
  type MembershipData,
} from "@/lib/membership";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("membership utility", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("loadMembership", () => {
    it("returns null when no data saved", () => {
      expect(loadMembership()).toBeNull();
    });

    it("returns saved membership data", () => {
      const data: MembershipData = {
        cost: 1500,
        period: "monthly",
        startDate: "2025-01-01",
      };
      localStorage.setItem("workout-membership", JSON.stringify(data));
      expect(loadMembership()).toEqual(data);
    });

    it("returns null for invalid JSON", () => {
      localStorage.setItem("workout-membership", "not-json");
      expect(loadMembership()).toBeNull();
    });
  });

  describe("saveMembership", () => {
    it("saves membership data to localStorage", () => {
      const data: MembershipData = {
        cost: 1500,
        period: "monthly",
        startDate: "2025-01-01",
      };
      saveMembership(data);
      expect(JSON.parse(localStorage.getItem("workout-membership")!)).toEqual(
        data
      );
    });

    it("removes data when null is passed", () => {
      localStorage.setItem("workout-membership", "something");
      saveMembership(null);
      expect(localStorage.getItem("workout-membership")).toBeNull();
    });
  });

  describe("calculateMembershipStats", () => {
    it("calculates cost per visit for monthly membership", () => {
      // Mock today as 2025-02-15 (45 days after start → 2 months billed)
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-02-15"));

      const membership: MembershipData = {
        cost: 1500,
        period: "monthly",
        startDate: "2025-01-01",
      };

      const stats = calculateMembershipStats(membership, 10);

      // 45 days → ceil(45/30) = 2 months → $3000 total
      expect(stats.totalCostSoFar).toBe(3000);
      // 3000 / 10 visits = 300
      expect(stats.costPerVisit).toBe(300);
      // 3000 / 11 visits = ~273
      expect(stats.nextVisitCost).toBe(Math.round(3000 / 11));
      expect(stats.daysSinceStart).toBe(45);

      vi.useRealTimers();
    });

    it("calculates cost per visit for yearly membership", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-01"));

      const membership: MembershipData = {
        cost: 12000,
        period: "yearly",
        startDate: "2025-01-01",
      };

      const stats = calculateMembershipStats(membership, 60);

      // 151 days → ceil(151/365) = 1 year → $12000
      expect(stats.totalCostSoFar).toBe(12000);
      // 12000 / 60 = 200
      expect(stats.costPerVisit).toBe(200);

      vi.useRealTimers();
    });

    it("returns 0 cost per visit when no workouts", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-02-01"));

      const membership: MembershipData = {
        cost: 1500,
        period: "monthly",
        startDate: "2025-01-01",
      };

      const stats = calculateMembershipStats(membership, 0);
      expect(stats.costPerVisit).toBe(0);
      expect(stats.nextVisitCost).toBe(0);

      vi.useRealTimers();
    });

    it("nextVisitCost is always less than costPerVisit", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-03-01"));

      const membership: MembershipData = {
        cost: 1500,
        period: "monthly",
        startDate: "2025-01-01",
      };

      const stats = calculateMembershipStats(membership, 5);
      expect(stats.nextVisitCost).toBeLessThan(stats.costPerVisit);

      vi.useRealTimers();
    });
  });
});
