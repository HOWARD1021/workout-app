"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import { achievementsApi, type AchievementWithStatus } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";
import confetti from "canvas-confetti";

const CATEGORIES = [
  { key: "all", labelZh: "全部", labelEn: "All" },
  { key: "first", labelZh: "初次", labelEn: "Firsts" },
  { key: "streak", labelZh: "連續", labelEn: "Streaks" },
  { key: "count", labelZh: "次數", labelEn: "Count" },
  { key: "volume", labelZh: "訓練量", labelEn: "Volume" },
  { key: "muscle", labelZh: "部位", labelEn: "Muscle" },
  { key: "pr", labelZh: "紀錄", labelEn: "PRs" },
] as const;

export default function AchievementsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { locale } = useI18n();
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const hasChecked = useRef(false);

  useEffect(() => {
    const fetchAndCheck = async () => {
      try {
        // First check for new achievements
        if (!hasChecked.current) {
          hasChecked.current = true;
          const { newUnlocks } = await achievementsApi.check();
          if (newUnlocks.length > 0) {
            // Fire confetti for new unlocks!
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#58CC02", "#FF8C42", "#1CB0F6", "#FFD700"],
            });
          }
        }

        // Then fetch all achievements
        const data = await achievementsApi.list();
        setAchievements(data);
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndCheck();
  }, []);

  const isZh = locale === "zh-TW";
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  const filtered =
    activeCategory === "all"
      ? achievements
      : achievements.filter((a) => a.category === activeCategory);

  // Sort: unlocked first, then by category
  const sorted = [...filtered].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return 0;
  });

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
              {t("achievements.title")}
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Progress Summary */}
        <div className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm text-center">
          <div className="text-4xl mb-2">🏆</div>
          <p className="text-2xl font-bold text-[#2D3648]">
            {unlockedCount} / {totalCount}
          </p>
          <p className="text-sm text-[#AFAFAF]">
            {t("achievements.unlocked")}
          </p>
          {/* Progress bar */}
          <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#58CC02] rounded-full transition-all duration-500"
              style={{
                width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.key
                  ? "bg-[#58CC02] text-white shadow-sm"
                  : "bg-white text-[#2D3648] border border-gray-200"
              }`}
            >
              {isZh ? cat.labelZh : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-2 gap-3">
          {sorted.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-2xl p-4 text-center transition-all ${
                achievement.unlocked
                  ? "bg-white border-2 border-[#58CC02] shadow-sm"
                  : "bg-gray-100 border-2 border-gray-200 opacity-60"
              }`}
            >
              {/* Icon */}
              <div className="text-4xl mb-2">
                {achievement.unlocked ? (
                  achievement.icon
                ) : (
                  <Lock className="w-8 h-8 mx-auto text-gray-400" />
                )}
              </div>

              {/* Name */}
              <p
                className={`font-bold text-sm mb-1 ${
                  achievement.unlocked ? "text-[#2D3648]" : "text-gray-400"
                }`}
              >
                {isZh ? achievement.name : achievement.nameEn}
              </p>

              {/* Description */}
              <p
                className={`text-xs ${
                  achievement.unlocked ? "text-[#AFAFAF]" : "text-gray-300"
                }`}
              >
                {isZh ? achievement.description : achievement.descriptionEn}
              </p>

              {/* Unlocked date */}
              {achievement.unlocked && achievement.unlockedAt && (
                <p className="text-xs text-[#58CC02] mt-2 font-medium">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-12 text-[#AFAFAF]">
            {t("achievements.noAchievements")}
          </div>
        )}
      </div>
    </div>
  );
}
