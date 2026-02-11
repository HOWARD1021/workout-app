"use client";

import { useState, useRef, TouchEvent } from "react";
import { Trash2 } from "lucide-react";

interface SwipeableSetRowProps {
  children: React.ReactNode;
  onDelete: () => void;
  disabled?: boolean;
}

export default function SwipeableSetRow({
  children,
  onDelete,
  disabled = false,
}: SwipeableSetRowProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  const DELETE_THRESHOLD = -80;
  const MAX_SWIPE = -100;

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled) return;
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = translateX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (disabled || !isDragging) return;
    const diff = e.touches[0].clientX - startXRef.current;
    let newTranslate = currentXRef.current + diff;

    // Only allow left swipe
    if (newTranslate > 0) newTranslate = 0;
    if (newTranslate < MAX_SWIPE) newTranslate = MAX_SWIPE;

    setTranslateX(newTranslate);
  };

  const handleTouchEnd = () => {
    if (disabled) return;
    setIsDragging(false);

    if (translateX < DELETE_THRESHOLD) {
      // Show delete button
      setTranslateX(MAX_SWIPE);
    } else {
      // Snap back
      setTranslateX(0);
    }
  };

  const handleDelete = () => {
    onDelete();
    setTranslateX(0);
  };

  const resetSwipe = () => {
    setTranslateX(0);
  };

  return (
    <div className="relative overflow-hidden" onClick={resetSwipe}>
      {/* Delete button background */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-end bg-red-500 transition-opacity"
        style={{
          width: Math.abs(MAX_SWIPE),
          opacity: translateX < 0 ? 1 : 0,
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="flex items-center justify-center w-full h-full text-white"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* Main content */}
      <div
        className={`relative bg-white ${isDragging ? "" : "transition-transform duration-200"}`}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
