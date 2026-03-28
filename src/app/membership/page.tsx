"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Wallet, Calendar, TrendingDown, Dumbbell } from "lucide-react";
import { useRouter } from "next/navigation";
import { workoutsApi, type Workout } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";

const STORAGE_KEY = "workout-membership";

interface MembershipData {
  cost: number;
  period: "monthly" | "yearly";
  startDate: string;
}

function loadMembership(): MembershipData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveMembership(data: MembershipData | null) {
  try {
    if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export default function MembershipPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { locale } = useI18n();
  const isZh = locale === "zh-TW";

  const [membership, setMembership] = useState<MembershipData | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [cost, setCost] = useState("");
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const saved = loadMembership();
    if (saved) {
      setMembership(saved);
      setCost(String(saved.cost));
      setPeriod(saved.period);
      setStartDate(saved.startDate);
    } else {
      setEditing(true);
    }

    workoutsApi
      .list()
      .then(setWorkouts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = () => {
    const costNum = parseFloat(cost);
    if (isNaN(costNum) || costNum <= 0 || !startDate) return;
    const data: MembershipData = { cost: costNum, period, startDate };
    saveMembership(data);
    setMembership(data);
    setEditing(false);
  };

  const handleClear = () => {
    saveMembership(null);
    setMembership(null);
    setCost("");
    setEditing(true);
  };

  // Calculate stats
  const startDateObj = membership ? new Date(membership.startDate) : null;
  const today = new Date();

  const daysSinceStart = startDateObj
    ? Math.max(1, Math.floor((today.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const workoutsSinceStart = membership
    ? workouts.filter((w) => new Date(w.startedAt) >= startDateObj!).length
    : 0;

  const totalCostSoFar = membership
    ? membership.period === "monthly"
      ? membership.cost * Math.ceil(daysSinceStart / 30)
      : membership.cost * Math.ceil(daysSinceStart / 365)
    : 0;

  const costPerVisit =
    workoutsSinceStart > 0 ? Math.round(totalCostSoFar / workoutsSinceStart) : 0;

  const costPerDay =
    daysSinceStart > 0 ? Math.round(totalCostSoFar / daysSinceStart) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t("common.back")}
            </Button>
            <h1 className="font-bold text-lg text-[#2D3648]">
              {isZh ? "會員費用計算" : "Membership Cost"}
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Settings Card */}
        {(editing || !membership) ? (
          <Card className="bg-white border-2 border-[#E5E5E5]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#2D3648] text-base">
                {isZh ? "設定會員資訊" : "Membership Settings"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-[#AFAFAF] mb-1 block">
                  {isZh ? "費用 (NT$)" : "Cost"}
                </label>
                <Input
                  type="number"
                  placeholder={isZh ? "例如：1500" : "e.g. 1500"}
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="border-2 border-[#E5E5E5] focus:border-[#58CC02]"
                />
              </div>

              <div>
                <label className="text-sm text-[#AFAFAF] mb-1 block">
                  {isZh ? "計費方式" : "Billing Period"}
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={period === "monthly" ? "default" : "outline"}
                    className={period === "monthly"
                      ? "bg-[#58CC02] hover:bg-[#46A302] text-white flex-1"
                      : "border-2 border-[#E5E5E5] text-[#AFAFAF] flex-1"}
                    onClick={() => setPeriod("monthly")}
                  >
                    {isZh ? "月繳" : "Monthly"}
                  </Button>
                  <Button
                    variant={period === "yearly" ? "default" : "outline"}
                    className={period === "yearly"
                      ? "bg-[#58CC02] hover:bg-[#46A302] text-white flex-1"
                      : "border-2 border-[#E5E5E5] text-[#AFAFAF] flex-1"}
                    onClick={() => setPeriod("yearly")}
                  >
                    {isZh ? "年繳" : "Yearly"}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-[#AFAFAF] mb-1 block">
                  {isZh ? "開始日期" : "Start Date"}
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-2 border-[#E5E5E5] focus:border-[#58CC02]"
                />
              </div>

              <Button
                className="w-full bg-[#58CC02] hover:bg-[#46A302] text-white py-5"
                onClick={handleSave}
                disabled={!cost || parseFloat(cost) <= 0}
              >
                {isZh ? "儲存" : "Save"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Stats */}
            <Card className="bg-gradient-to-br from-[#58CC02] to-[#46A302] border-0 text-white">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <p className="text-white/70 text-sm mb-1">
                    {isZh ? "每次運動花費" : "Cost Per Visit"}
                  </p>
                  <p className="text-5xl font-black">
                    ${costPerVisit}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/15 rounded-xl p-3 text-center">
                    <p className="text-white/70 text-xs">{isZh ? "每日平均" : "Daily Avg"}</p>
                    <p className="text-xl font-bold">${costPerDay}</p>
                  </div>
                  <div className="bg-white/15 rounded-xl p-3 text-center">
                    <p className="text-white/70 text-xs">{isZh ? "已花費" : "Total Spent"}</p>
                    <p className="text-xl font-bold">${totalCostSoFar.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detail Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-white border-2 border-[#E5E5E5]">
                <CardContent className="p-4 text-center">
                  <Calendar className="h-6 w-6 mx-auto text-[#FF8C42] mb-2" />
                  <p className="text-2xl font-bold text-[#2D3648]">{daysSinceStart}</p>
                  <p className="text-xs text-[#AFAFAF]">{isZh ? "天（自開始）" : "Days"}</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-2 border-[#E5E5E5]">
                <CardContent className="p-4 text-center">
                  <Dumbbell className="h-6 w-6 mx-auto text-[#1CB0F6] mb-2" />
                  <p className="text-2xl font-bold text-[#2D3648]">{workoutsSinceStart}</p>
                  <p className="text-xs text-[#AFAFAF]">{isZh ? "次訓練" : "Workouts"}</p>
                </CardContent>
              </Card>
            </div>

            {/* Membership Info */}
            <Card className="bg-white border-2 border-[#E5E5E5]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-[#CE82FF]" />
                    <span className="font-medium text-[#2D3648]">
                      {isZh ? "會員資訊" : "Membership Info"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#AFAFAF]"
                    onClick={() => setEditing(true)}
                  >
                    {t("common.edit")}
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#AFAFAF]">{isZh ? "費用" : "Cost"}</span>
                    <span className="text-[#2D3648] font-medium">
                      ${membership.cost}/{membership.period === "monthly" ? (isZh ? "月" : "mo") : (isZh ? "年" : "yr")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AFAFAF]">{isZh ? "起始日期" : "Start"}</span>
                    <span className="text-[#2D3648] font-medium">
                      {new Date(membership.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Motivation */}
            {workoutsSinceStart > 0 && (
              <Card className="bg-white border-2 border-[#E5E5E5]">
                <CardContent className="p-4 text-center">
                  <TrendingDown className="h-6 w-6 mx-auto text-[#58CC02] mb-2" />
                  <p className="text-sm text-[#2D3648] font-medium">
                    {isZh
                      ? `再多去一次，每次花費就降到 $${workoutsSinceStart + 1 > 0 ? Math.round(totalCostSoFar / (workoutsSinceStart + 1)) : 0}！`
                      : `One more visit drops it to $${workoutsSinceStart + 1 > 0 ? Math.round(totalCostSoFar / (workoutsSinceStart + 1)) : 0}!`}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Clear Button */}
            <Button
              variant="ghost"
              className="w-full text-[#AFAFAF] hover:text-red-500"
              onClick={handleClear}
            >
              {isZh ? "清除會員資料" : "Clear Membership Data"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
