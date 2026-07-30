import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RestTimerDialog from "@/components/RestTimerDialog";

describe("RestTimerDialog", () => {
  it("shows a burn-ring countdown with readable remaining time", () => {
    render(
      <RestTimerDialog
        restTimer={45}
        defaultRestTime={90}
        onAddTime={vi.fn()}
        onSkip={vi.fn()}
        onMinimize={vi.fn()}
      />
    );

    expect(screen.getByText("0:45")).toBeInTheDocument();
    expect(screen.getByText("Rest Timer · 50%")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Rest timer 45 seconds remaining" })
    ).toBeInTheDocument();
  });

  it("marks the final stretch when there are 10 seconds or less", () => {
    render(
      <RestTimerDialog
        restTimer={8}
        defaultRestTime={90}
        onAddTime={vi.fn()}
        onSkip={vi.fn()}
        onMinimize={vi.fn()}
      />
    );

    expect(screen.getByText("Final seconds")).toBeInTheDocument();
  });

  it("wires rest timer controls to their callbacks", () => {
    const onAddTime = vi.fn();
    const onSkip = vi.fn();
    const onMinimize = vi.fn();

    render(
      <RestTimerDialog
        restTimer={45}
        defaultRestTime={90}
        onAddTime={onAddTime}
        onSkip={onSkip}
        onMinimize={onMinimize}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "-15s" }));
    fireEvent.click(screen.getByRole("button", { name: /30s/ }));
    fireEvent.click(screen.getByRole("button", { name: /Skip/ }));
    fireEvent.click(screen.getByRole("button", { name: "Minimize rest timer" }));

    expect(onAddTime).toHaveBeenCalledWith(-15);
    expect(onAddTime).toHaveBeenCalledWith(30);
    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(onMinimize).toHaveBeenCalledTimes(1);
  });
});
