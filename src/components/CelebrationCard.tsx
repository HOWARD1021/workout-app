"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Zap, Dumbbell, Timer } from "lucide-react";
import DuckDepositTank from "./DuckDepositTank";

export function CelebrationCard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7CE728] to-[#58CC02] flex flex-col items-center justify-center p-5 font-sans relative overflow-hidden">
      
      {/* Main White Card Container */}
      <div className="w-full max-w-md bg-white rounded-[32px] p-5 pb-7 shadow-[0_12px_24px_rgba(0,0,0,0.15)] flex flex-col items-center text-center relative z-10 border-b-[6px] border-black/5">
        
        {/* Header Typography */}
        <div className="mb-4 mt-2 select-none">
          <h1 
            className="text-4xl font-black text-white mb-1 tracking-wide leading-[1.1] drop-shadow-md"
            style={{ 
              WebkitTextStroke: '2px #388E00', 
              textShadow: '0 4px 0 #388E00, 0 8px 16px rgba(0,0,0,0.15)' 
            }}
          >
            WORKOUT<br/>COMPLETE!
          </h1>
          <p className="text-[#58CC02] font-black tracking-widest uppercase text-[13px] mt-2">
            Level Up!
          </p>
        </div>

        {/* Lottie Animation Area with Character */}
        <div className="w-full relative flex flex-col items-center justify-center mt-2 mb-6">
          {/* Confetti/Burst Animation */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-80 pointer-events-none scale-150">
            <DotLottieReact
              src="https://lottie.host/9f506e7a-36fb-40cd-a931-15c46da7227d/xQjS581n20.lottie"
              loop
              autoplay
            />
          </div>
          {/* Tank Animation */}
          <div className="relative z-10 scale-[1.02]">
            <DuckDepositTank amount={4250} unit="kg" label="Volume Complete" />
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="flex w-full justify-between gap-3 select-none">
          {/* Volume Card */}
          <div className="flex-1 rounded-2xl overflow-hidden border-[3px] border-[#FFC800] flex flex-col shadow-sm">
            <div className="bg-[#FFC800] text-white text-[10px] font-black py-1.5 uppercase tracking-widest leading-none flex items-center justify-center">
              Total Volume
            </div>
            <div className="bg-white py-2.5 flex items-baseline justify-center gap-1 flex-1">
              <Zap className="fill-[#FFC800] text-[#FFC800] w-4 h-4 self-center translate-y-[-1px]" />
              <span className="text-slate-800 font-black text-[19px] tracking-tight">4,250</span>
              <span className="text-slate-500 font-bold text-[10px] ml-[1px]">kg</span>
            </div>
          </div>

          {/* Sets Card */}
          <div className="flex-1 rounded-2xl overflow-hidden border-[3px] border-[#58CC02] flex flex-col shadow-sm">
            <div className="bg-[#58CC02] text-white text-[10px] font-black py-1.5 uppercase tracking-widest leading-none flex items-center justify-center">
              Total Sets
            </div>
            <div className="bg-white py-2.5 flex items-center justify-center gap-1 flex-1">
              <Dumbbell className="w-4 h-4 stroke-[2.5] text-[#58CC02]" />
              <span className="text-slate-800 font-black text-[19px] tracking-tight">24</span>
            </div>
          </div>

          {/* Duration Card */}
          <div className="flex-1 rounded-2xl overflow-hidden border-[3px] border-[#1CB0F6] flex flex-col shadow-sm">
            <div className="bg-[#1CB0F6] text-white text-[10px] font-black py-1.5 uppercase tracking-widest leading-none flex items-center justify-center">
              Duration
            </div>
            <div className="bg-white py-2.5 flex items-baseline justify-center gap-[2px] flex-1">
              <Timer className="w-4 h-4 stroke-[2.5] text-[#1CB0F6] self-center translate-y-[-1px]" />
              <span className="text-slate-800 font-black text-[19px] tracking-tight">1<span className="text-xs font-bold text-slate-500 mx-[1px]">h</span>15<span className="text-xs font-bold text-slate-500 ml-[1px]">m</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button className="w-full max-w-md mt-6 bg-[#58CC02] text-white font-black text-xl rounded-2xl py-4 shadow-[0_6px_0_#46A302] hover:translate-y-[2px] hover:shadow-[0_4px_0_#46A302] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest border-2 border-white/20 select-none">
        Continue
      </button>
    </div>
  );
}
