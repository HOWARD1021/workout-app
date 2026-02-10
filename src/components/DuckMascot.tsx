"use client";

import Image from "next/image";

interface DuckMascotProps {
  muscleGroup?: string | null;
  variant?: "default" | "pr" | "failure";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
}

const sizeMap = {
  sm: 48,
  md: 80,
  lg: 120,
  xl: 160,
};

// Muscle group to duck image mapping
const muscleGroupToDuck: Record<string, string> = {
  Chest: "/images/duck-chest.png",
  Back: "/images/duck-back.png",
  Legs: "/images/duck-legs.png",
  Arms: "/images/duck-arms.png",
  Shoulders: "/images/duck-arms.png",
  Core: "/images/duck-mascot.png",
  "Full Body": "/images/duck-mascot.png",
};

export default function DuckMascot({
  muscleGroup,
  variant = "default",
  size = "md",
  className = "",
  animate = true,
}: DuckMascotProps) {
  // Determine which duck image to show
  let duckImage = "/images/duck-mascot.png";

  if (variant === "pr") {
    duckImage = "/images/duck-pr.png";
  } else if (variant === "failure") {
    duckImage = "/images/duck-failure.png";
  } else if (muscleGroup && muscleGroupToDuck[muscleGroup]) {
    duckImage = muscleGroupToDuck[muscleGroup];
  }

  const dimension = sizeMap[size];

  return (
    <div
      className={`${className} ${animate ? "animate-bounce" : ""}`}
      style={{ width: dimension, height: dimension }}
    >
      <Image
        src={duckImage}
        alt={`Duck mascot - ${muscleGroup || variant}`}
        width={dimension}
        height={dimension}
        className="object-contain"
        priority
      />
    </div>
  );
}
