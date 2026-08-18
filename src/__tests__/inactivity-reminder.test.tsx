import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import InactivityReminder from "@/components/InactivityReminder";
import zhTW from "@/lib/i18n/locales/zh-TW.json";

// Use the real zh-TW strings with parameter interpolation so we assert the
// exact copy the user sees (dates, fees, cost-per-visit).
function translate(key: string, params?: Record<string, string | number>): string {
  const value = key
    .split(".")
    .reduce<unknown>((acc, part) => (acc as Record<string, unknown>)?.[part], zhTW);
  let text = typeof value === "string" ? value : key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

vi.mock("@/lib/i18n", () => ({
  useTranslation: () => ({ t: translate }),
  useI18n: () => ({ locale: "zh-TW" }),
}));

vi.mock("@/components/DuckMascot", () => ({
  default: () => <div data-testid="duck-mascot" />,
}));

const noop = () => {};

describe("InactivityReminder money feedback", () => {
  it("shows the last workout date and days-ago", () => {
    render(
      <InactivityReminder
        daysSinceLastWorkout={5}
        lastWorkoutDate="2026-08-10T09:00:00+08:00"
        onStartWorkout={noop}
        onDismiss={noop}
      />
    );

    expect(screen.getByText("上次運動")).toBeInTheDocument();
    // zh-TW long month formatting -> "8月10日（5 天前）"
    expect(screen.getByText("8月10日（5 天前）")).toBeInTheDocument();
  });

  it("shows monthly fee and this-month cost per visit", () => {
    render(
      <InactivityReminder
        daysSinceLastWorkout={4}
        lastWorkoutDate="2026-08-10T09:00:00+08:00"
        monthlyFee={1500}
        thisMonthWorkouts={2}
        onStartWorkout={noop}
        onDismiss={noop}
      />
    );

    expect(screen.getByText("月費")).toBeInTheDocument();
    expect(screen.getByText("$1,500 / 月")).toBeInTheDocument();
    expect(screen.getByText("本月每次成本")).toBeInTheDocument();
    // 1500 / 2 = 750
    expect(screen.getByText("$750")).toBeInTheDocument();
    expect(screen.getByText("越晚去，每次越貴 📈")).toBeInTheDocument();
  });

  it("normalizes a yearly fee to a monthly figure before dividing", () => {
    render(
      <InactivityReminder
        daysSinceLastWorkout={10}
        monthlyFee={1000} /* already normalized by the dashboard (12000/12) */
        thisMonthWorkouts={4}
        onStartWorkout={noop}
        onDismiss={noop}
      />
    );

    // 1000 / 4 = 250
    expect(screen.getByText("$250")).toBeInTheDocument();
  });

  it("surfaces the wasted fee when there were zero visits this month", () => {
    render(
      <InactivityReminder
        daysSinceLastWorkout={20}
        monthlyFee={1500}
        thisMonthWorkouts={0}
        onStartWorkout={noop}
        onDismiss={noop}
      />
    );

    // No division by zero — show the full fee and the "wasted" message.
    expect(screen.getByText("$1,500")).toBeInTheDocument();
    expect(
      screen.getByText("本月一次都沒去，$1,500 等於白繳了")
    ).toBeInTheDocument();
  });

  it("offers a setup prompt when no membership fee is configured", () => {
    const onSetupCost = vi.fn();
    render(
      <InactivityReminder
        daysSinceLastWorkout={3}
        lastWorkoutDate="2026-08-10T09:00:00+08:00"
        monthlyFee={null}
        thisMonthWorkouts={0}
        onStartWorkout={noop}
        onDismiss={noop}
        onSetupCost={onSetupCost}
      />
    );

    expect(screen.queryByText("月費")).not.toBeInTheDocument();
    const setup = screen.getByText("設定會員費，算出每次運動成本 →");
    expect(setup).toBeInTheDocument();
    setup.click();
    expect(onSetupCost).toHaveBeenCalledOnce();
  });
});
