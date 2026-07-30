"use client";

import Image from "next/image";

type AnimationStyle = "bounce" | "float" | "wiggle" | "breathe" | "wave" | "none";

interface DuckMascotProps {
  muscleGroup?: string | null;
  variant?: "default" | "complete" | "pr" | "failure";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  animate?: boolean;
  animationStyle?: AnimationStyle;
}

const sizeMap = {
  sm: 48,
  md: 80,
  lg: 120,
  xl: 160,
  "2xl": 200,
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

const animationClasses: Record<AnimationStyle, string> = {
  bounce: "animate-bounce",
  float: "animate-duck-float",
  wiggle: "animate-duck-wiggle",
  breathe: "animate-duck-breathe",
  wave: "animate-duck-wave",
  none: "",
};

export default function DuckMascot({
  muscleGroup,
  variant = "default",
  size = "md",
  className = "",
  animate = true,
  animationStyle = "bounce",
}: DuckMascotProps) {
  // Determine which duck image to show
  let duckImage = "/images/duck-mascot.png";

  if (variant === "complete") {
    duckImage = "/images/duck-complete.png";
  } else if (variant === "pr") {
    duckImage = "/images/duck-pr.png";
  } else if (variant === "failure") {
    duckImage = "/images/duck-failure.png";
  } else if (muscleGroup && muscleGroupToDuck[muscleGroup]) {
    duckImage = muscleGroupToDuck[muscleGroup];
  }

  const dimension = sizeMap[size];
  const animClass = animate ? animationClasses[animationStyle] : "";

  return (
    <div
      className={`${className} ${animClass}`}
      style={{ width: dimension, height: dimension }}
    >
      <Image
        src={duckImage}
        alt={`Duck mascot - ${muscleGroup || variant}`}
        width={dimension}
        height={dimension}
        className="object-contain drop-shadow-lg"
        priority
      />
    </div>
  );
}
