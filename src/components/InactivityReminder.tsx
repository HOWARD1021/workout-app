"use client";

import { CalendarDays, Wallet, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DuckMascot from "./DuckMascot";
import { useTranslation, useI18n } from "@/lib/i18n";

interface InactivityReminderProps {
  daysSinceLastWorkout: number;
  /** ISO timestamp of the most recent workout, if any. */
  lastWorkoutDate?: string | null;
  /** Normalized membership fee per month (yearly plans are divided by 12). */
  monthlyFee?: number | null;
  /** Number of workouts logged in the current calendar month. */
  thisMonthWorkouts?: number | null;
  onStartWorkout: () => void;
  onDismiss: () => void;
  /** Navigate to the membership screen to set up the fee. */
  onSetupCost?: () => void;
}

export default function InactivityReminder({
  daysSinceLastWorkout,
  lastWorkoutDate,
  monthlyFee,
  thisMonthWorkouts,
  onStartWorkout,
  onDismiss,
  onSetupCost,
}: InactivityReminderProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const isZh = locale === "zh-TW";

  const hasMembership = typeof monthlyFee === "number" && monthlyFee > 0;
  const feeDisplay = hasMembership ? Math.round(monthlyFee!).toLocaleString() : "";

  // This month's cost-per-visit — the emotional hook. Zero visits => the whole
  // monthly fee is "wasted", which we surface explicitly instead of dividing by 0.
  const visits = thisMonthWorkouts ?? 0;
  const costPerWorkout =
    hasMembership && visits > 0 ? Math.round(monthlyFee! / visits) : null;
  const wastedThisMonth = hasMembership && visits === 0;

  const lastWorkoutLabel = lastWorkoutDate
    ? new Intl.DateTimeFormat(isZh ? "zh-TW" : "en", {
        month: isZh ? "long" : "short",
        day: "numeric",
      }).format(new Date(lastWorkoutDate))
    : null;

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
          <h2 className="text-2xl font-bold text-[#2D3648] mb-2">{t("reminder.title")}</h2>
          <p className="text-lg text-[#AFAFAF] mb-6">
            {t("reminder.message", { days: daysSinceLastWorkout })}
          </p>

          {/* Info panel: last workout date + membership money feedback */}
          <div className="mb-6 space-y-2 text-left">
            {lastWorkoutLabel && (
              <div className="flex items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium text-[#6f6f78]">
                  <CalendarDays className="h-4 w-4 text-[#FF8C42]" />
                  {t("reminder.lastWorkout")}
                </div>
                <span className="text-sm font-semibold text-[#2D3648]">
                  {t("reminder.lastWorkoutValue", {
                    date: lastWorkoutLabel,
                    days: daysSinceLastWorkout,
                  })}
                </span>
              </div>
            )}

            {hasMembership && (
              <div className="flex items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium text-[#6f6f78]">
                  <Wallet className="h-4 w-4 text-[#CE82FF]" />
                  {t("reminder.monthlyFee")}
                </div>
                <span className="text-sm font-semibold text-[#2D3648]">
                  {t("reminder.monthlyFeeValue", { fee: feeDisplay })}
                </span>
              </div>
            )}

            {hasMembership && (
              <div className="rounded-2xl bg-[#FFF0E9] px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#C2410C]">
                    <TrendingUp className="h-4 w-4" />
                    {t("reminder.costThisMonth")}
                  </div>
                  {costPerWorkout !== null ? (
                    <span className="text-lg font-black text-[#EA580C]">
                      {t("reminder.costThisMonthValue", {
                        cost: costPerWorkout.toLocaleString(),
                      })}
                    </span>
                  ) : (
                    <span className="text-lg font-black text-[#EA580C]">
                      ${feeDisplay}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs font-medium text-[#C2410C]/80">
                  {wastedThisMonth
                    ? t("reminder.wastedThisMonth", { fee: feeDisplay })
                    : t("reminder.costClimbs")}
                </p>
              </div>
            )}

            {!hasMembership && onSetupCost && (
              <button
                onClick={onSetupCost}
                className="flex w-full items-center justify-center rounded-2xl bg-[#F7F7F7] px-4 py-3 text-sm font-semibold text-[#248a3d]"
              >
                {t("reminder.setupCost")}
              </button>
            )}
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            className="w-full bg-[#58CC02] hover:bg-[#46A302] text-white text-lg py-6 rounded-2xl font-bold mb-3"
            onClick={onStartWorkout}
          >
            {t("reminder.startNow")}
          </Button>

          {/* Dismiss Button */}
          <Button
            variant="ghost"
            className="w-full text-[#AFAFAF] hover:text-[#2D3648]"
            onClick={onDismiss}
          >
            {t("reminder.later")}
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
