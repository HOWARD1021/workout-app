"use client";

import { useState } from "react";
import DuckDepositTank from "@/components/DuckDepositTank";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Dumbbell, Sparkles, RefreshCw } from "lucide-react";

export default function TankPreviewPage() {
  const [amount, setAmount] = useState<number>(4250);
  const [unit, setUnit] = useState<string>("kg");
  const [isPR, setIsPR] = useState<boolean>(false);
  const [replayKey, setReplayKey] = useState<number>(0);

  const presets = [
    { label: "輕量訓練 (1,200 kg)", amount: 1200, unit: "kg", isPR: false },
    { label: "標準訓練 (4,250 kg)", amount: 4250, unit: "kg", isPR: false },
    { label: "突破新紀錄 (8,800 kg PR 🏆)", amount: 8800, unit: "kg", isPR: true },
    { label: "會費回本存款 ($150)", amount: 150, unit: "元", isPR: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#58CC02] to-[#46A302] flex flex-col items-center justify-center p-4">
      {/* Top Title */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1 text-xs font-bold text-white/90 bg-white/20 px-3 py-1 rounded-full mb-2">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          特效預覽 (Dev Preview)
        </span>
        <h1 className="text-3xl font-black text-white drop-shadow-sm">
          小鴨水缸湧水存款
        </h1>
        <p className="text-white/80 text-sm mt-1">
          運動完成時，水從底部湧現、小鴨隨水漂浮、汗水數字跳動入庫！
        </p>
      </div>

      {/* Main Tank Component */}
      <div className="my-2">
        <DuckDepositTank
          key={replayKey}
          amount={amount}
          unit={unit}
          label={isPR ? "🏆 破紀錄汗水存款" : "🌊 今日訓練存款"}
          isPR={isPR}
          variant={isPR ? "pr" : "complete"}
          autoStart={true}
        />
      </div>

      {/* Controller Card */}
      <Card className="w-full max-w-sm bg-white/95 backdrop-blur border-0 shadow-xl mt-6">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#2D3648] flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-[#58CC02]" />
              預設情境切換
            </span>
            <button
              onClick={() => setReplayKey((k) => k + 1)}
              className="text-xs font-semibold text-[#58CC02] hover:text-[#46A302] flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              重新播放
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {presets.map((p, idx) => (
              <Button
                key={idx}
                variant={amount === p.amount && isPR === p.isPR ? "default" : "outline"}
                size="sm"
                className={`justify-start text-xs h-9 ${
                  amount === p.amount && isPR === p.isPR
                    ? "bg-[#58CC02] hover:bg-[#46A302] text-white"
                    : "text-[#2D3648]"
                }`}
                onClick={() => {
                  setAmount(p.amount);
                  setUnit(p.unit);
                  setIsPR(p.isPR);
                  setReplayKey((k) => k + 1);
                }}
              >
                {p.label}
              </Button>
            ))}
          </div>

          {/* Custom Amount Controls */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>自訂數值：{amount} {unit}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsPR(!isPR);
                  setReplayKey((k) => k + 1);
                }}
                className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition ${
                  isPR ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"
                }`}
              >
                <Trophy className="w-3 h-3" />
                {isPR ? "PR 鴨鴨 (啟用)" : "一般完成鴨"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
