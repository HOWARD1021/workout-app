"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DuckMascot from "./DuckMascot";

interface InactivityReminderProps {
  daysSinceLastWorkout: number;
  onStartWorkout: () => void;
  onDismiss: () => void;
}

export default function InactivityReminder({
  daysSinceLastWorkout,
  onStartWorkout,
  onDismiss,
}: InactivityReminderProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <Card className="bg-white rounded-3xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
        <CardContent className="p-8 text-center">
          {/* Shaking Duck */}
          <div className="flex justify-center mb-6">
            <div className="animate-shake">
              <DuckMascot variant="failure" size="xl" animate={false} />
            </div>
          </div>

          {/* Message */}
          <h2 className="text-2xl font-bold text-[#3C3C3C] mb-2">嘿！</h2>
          <p className="text-lg text-[#AFAFAF] mb-6">
            你已經{" "}
            <span className="font-bold text-[#FF4B4B]">
              {daysSinceLastWorkout}
            </span>{" "}
            天沒來運動了！
          </p>

          {/* CTA Button */}
          <Button
            size="lg"
            className="w-full bg-[#58CC02] hover:bg-[#46A302] text-white text-lg py-6 rounded-2xl font-bold mb-3"
            onClick={onStartWorkout}
          >
            現在開始運動 💪
          </Button>

          {/* Dismiss Button */}
          <Button
            variant="ghost"
            className="w-full text-[#AFAFAF] hover:text-[#3C3C3C]"
            onClick={onDismiss}
          >
            稍後提醒
          </Button>
        </CardContent>
      </Card>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) rotate(-3deg); }
          20%, 40%, 60%, 80% { transform: translateX(5px) rotate(3deg); }
        }
        .animate-shake {
          animation: shake 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
