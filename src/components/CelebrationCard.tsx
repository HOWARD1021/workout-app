"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Zap, Dumbbell, Timer } from "lucide-react";
import DuckDepositTank from "./DuckDepositTank";

export function CelebrationCard() {
  return (
    <div className="min-h-screen bg-[#58CC02] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Lottie Animation Area with Character */}
        <div className="w-full relative flex flex-col items-center justify-center mt-2 mb-6">
          {/* Confetti/Burst Animation overlaying the character */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-80 pointer-events-none scale-150">
            <DotLottieReact
              src="https://lottie.host/9f506e7a-36fb-40cd-a931-15c46da7227d/xQjS581n20.lottie"
              loop
              autoplay
            />
          </div>
          {/* Tank Animation */}
          <div className="relative z-10">
            <DuckDepositTank amount={15} unit="XP" label="Workout Complete" />
          </div>
        </div>
        
        {/* Text Section */}
        <h1 className="text-3xl font-bold text-[#FFC800] mb-3 drop-shadow-sm">
          Speaking star!
        </h1>
        <p className="text-[#AFB2B6] font-semibold mb-8 text-lg px-4">
          You completed 3 speaking exercises in this lesson
        </p>

        {/* Stats Section */}
        <div className="flex w-full justify-between gap-3">
          {/* Volume Card */}
          <div className="flex-1 rounded-2xl overflow-hidden border-[3px] border-[#FFC800] flex flex-col">
            <div className="bg-[#FFC800] text-white text-[11px] font-black py-1.5 uppercase tracking-widest leading-none flex items-center justify-center">
              Total Volume
            </div>
            <div className="bg-white py-3 flex items-baseline justify-center gap-1 flex-1">
              <Zap className="fill-[#FFC800] text-[#FFC800] w-5 h-5 self-center translate-y-[-1px]" />
              <span className="text-slate-800 font-black text-xl tracking-tight">4,250</span>
              <span className="text-slate-500 font-bold text-xs ml-[1px]">kg</span>
            </div>
          </div>

          {/* Sets Card */}
          <div className="flex-1 rounded-2xl overflow-hidden border-[3px] border-[#58CC02] flex flex-col">
            <div className="bg-[#58CC02] text-white text-[11px] font-black py-1.5 uppercase tracking-widest leading-none flex items-center justify-center">
              Total Sets
            </div>
            <div className="bg-white py-3 flex items-center justify-center gap-1.5 flex-1">
              <Dumbbell className="w-5 h-5 stroke-[2.5] text-[#58CC02]" />
              <span className="text-slate-800 font-black text-xl tracking-tight">24</span>
            </div>
          </div>

          {/* Duration Card */}
          <div className="flex-1 rounded-2xl overflow-hidden border-[3px] border-[#1CB0F6] flex flex-col">
            <div className="bg-[#1CB0F6] text-white text-[11px] font-black py-1.5 uppercase tracking-widest leading-none flex items-center justify-center">
              Duration
            </div>
            <div className="bg-white py-3 flex items-baseline justify-center gap-1 flex-1">
              <Timer className="w-5 h-5 stroke-[2.5] text-[#1CB0F6] self-center translate-y-[-1px]" />
              <span className="text-slate-800 font-black text-xl tracking-tight">1<span className="text-sm font-bold text-slate-500 ml-[1px] mr-1">h</span>15<span className="text-sm font-bold text-slate-500 ml-[1px]">m</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
