"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Zap, Target, Timer } from "lucide-react";

export function CelebrationCard() {
  return (
    <div className="min-h-screen bg-[#58CC02] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Lottie Animation Area with Character */}
        <div className="w-64 h-64 mb-2 relative flex items-center justify-center">
          {/* Confetti/Burst Animation overlaying the character */}
          <DotLottieReact
            src="https://lottie.host/9f506e7a-36fb-40cd-a931-15c46da7227d/xQjS581n20.lottie"
            loop
            autoplay
            className="absolute inset-0 z-0 opacity-80"
          />
          {/* Character Image (Using mix-blend-multiply to remove white background) */}
          <img 
            src="/images/duck-complete.png" 
            alt="Workout Complete" 
            className="w-48 h-48 object-contain relative z-10 mix-blend-multiply"
          />
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
          {/* XP Card */}
          <div className="flex-1 rounded-2xl overflow-hidden border-2 border-[#FFC800]">
            <div className="bg-[#FFC800] text-white text-xs font-bold py-1.5 uppercase tracking-wide">
              Total XP
            </div>
            <div className="bg-white py-3 flex items-center justify-center gap-1.5 text-[#FFC800] font-bold text-xl rounded-b-xl">
              <Zap className="fill-current w-5 h-5" />
              15
            </div>
          </div>

          {/* Good Card */}
          <div className="flex-1 rounded-2xl overflow-hidden border-2 border-[#58CC02]">
            <div className="bg-[#58CC02] text-white text-xs font-bold py-1.5 uppercase tracking-wide">
              Good
            </div>
            <div className="bg-white py-3 flex items-center justify-center gap-1.5 text-[#58CC02] font-bold text-xl rounded-b-xl">
              <Target className="w-5 h-5 stroke-[2.5]" />
              85%
            </div>
          </div>

          {/* Speedy Card */}
          <div className="flex-1 rounded-2xl overflow-hidden border-2 border-[#1CB0F6]">
            <div className="bg-[#1CB0F6] text-white text-xs font-bold py-1.5 uppercase tracking-wide">
              Speedy
            </div>
            <div className="bg-white py-3 flex items-center justify-center gap-1.5 text-[#1CB0F6] font-bold text-xl rounded-b-xl">
              <Timer className="w-5 h-5 stroke-[2.5]" />
              2:37
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
