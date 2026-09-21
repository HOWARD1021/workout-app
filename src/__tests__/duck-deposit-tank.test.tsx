import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import DuckDepositTank from "@/components/DuckDepositTank";

vi.mock("@/components/DuckMascot", () => ({
  default: ({ variant }: { variant?: string }) => (
    <div data-testid="duck-mascot" data-variant={variant} />
  ),
}));

vi.mock("@/lib/sfx", () => ({
  playRewardSfx: vi.fn(),
}));

describe("DuckDepositTank component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with target amount and labels", () => {
    render(
      <DuckDepositTank
        amount={3500}
        unit="kg"
        label="今日汗水存款"
        autoStart={false}
      />
    );

    expect(screen.getByText("今日汗水存款")).toBeInTheDocument();
    expect(screen.getByText("3,500")).toBeInTheDocument();
    expect(screen.getByText("kg")).toBeInTheDocument();
    expect(screen.getByTestId("duck-mascot")).toHaveAttribute("data-variant", "complete");
  });

  it("renders with PR variant when isPR is true", () => {
    render(
      <DuckDepositTank
        amount={5000}
        unit="kg"
        isPR={true}
        autoStart={false}
      />
    );

    expect(screen.getByTestId("duck-mascot")).toHaveAttribute("data-variant", "pr");
  });

  it("counts up number smoothly when autoStart is enabled", () => {
    render(
      <DuckDepositTank
        amount={3000}
        unit="kg"
        autoStart={true}
      />
    );

    // Initial state before surge tick
    expect(screen.getByText("0")).toBeInTheDocument();

    // Fast-forward initial delay
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Fast-forward through the surge animation
    act(() => {
      vi.advanceTimersByTime(2200);
    });

    expect(screen.getByText("3,000")).toBeInTheDocument();
  });
});
