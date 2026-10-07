import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import sharp from "sharp";
import path from "node:path";
import DuckDepositTank from "@/components/DuckDepositTank";

vi.mock("@/lib/sfx", () => ({
  playRewardSfx: vi.fn(),
}));

describe("DuckDepositTank component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
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
    expect(screen.getByRole("img", { name: "Duck on a boat" })).toHaveAttribute("src", "/images/duck-boat-transparent.png");
  });

  it("keeps the transparent boat artwork for PR celebrations", () => {
    render(
      <DuckDepositTank
        amount={5000}
        unit="kg"
        isPR={true}
        autoStart={false}
      />
    );

    expect(screen.getByRole("img", { name: "Duck on a boat" })).toHaveAttribute("src", "/images/duck-boat-transparent.png");
  });

  it("ships artwork with transparent corners instead of a white square", async () => {
    render(<DuckDepositTank amount={1} autoStart={false} />);
    const src = screen.getByRole("img", { name: "Duck on a boat" }).getAttribute("src")!;
    const { data, info } = await sharp(path.join(process.cwd(), "public", src))
      .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (const pixel of [0, info.width - 1, (info.height - 1) * info.width, info.width * info.height - 1]) {
      expect(data[pixel * info.channels + 3]).toBe(0);
    }
    expect(data.some((value, index) => index % info.channels === 3 && value === 255)).toBe(true);
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
