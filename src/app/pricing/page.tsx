"use client";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Check,
  Crown,
  Dumbbell,
  Sparkles,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation, useI18n } from "@/lib/i18n";
import { useSession, authClient } from "@/lib/auth-client";
import { useSubscription } from "@/hooks/useSubscription";

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center"><span className="text-gray-400">Loading...</span></div>}>
      <PricingContent />
    </Suspense>
  );
}

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { locale } = useI18n();
  const isZh = locale === "zh-TW";
  const { data: session } = useSession();
  const { isPro, isLoading } = useSubscription();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const isSuccess = searchParams.get("success") === "true";

  const handleUpgrade = async () => {
    if (!session) {
      router.push("/");
      return;
    }
    try {
      setCheckoutLoading(true);
      await authClient.checkout({ slug: "pro" });
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      await authClient.customer.portal();
    } catch (err) {
      console.error("Portal redirect failed:", err);
    }
  };

  const freeFeatures = isZh
    ? [
        "基本訓練紀錄",
        "3 個自訂模板",
        "基本統計數據",
        "動作庫瀏覽",
        "成就系統",
      ]
    : [
        "Basic workout logging",
        "3 custom templates",
        "Basic statistics",
        "Exercise library",
        "Achievement system",
      ];

  const proFeatures = isZh
    ? [
        "所有免費功能",
        "無限自訂模板",
        "進階趨勢分析",
        "訓練數據匯出",
        "肌群分佈圖表",
        "個人紀錄追蹤 (PR)",
        "優先客服支援",
      ]
    : [
        "All free features",
        "Unlimited templates",
        "Advanced trend analytics",
        "Workout data export",
        "Muscle group charts",
        "Personal record tracking (PR)",
        "Priority support",
      ];

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
              {isZh ? "升級方案" : "Pricing"}
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Success banner */}
        {isSuccess && (
          <Card className="bg-[#58CC02] border-0 text-white">
            <CardContent className="p-4 text-center">
              <Sparkles className="h-6 w-6 mx-auto mb-2" />
              <p className="font-bold">
                {isZh ? "歡迎加入 Pro！🎉" : "Welcome to Pro! 🎉"}
              </p>
              <p className="text-sm text-white/80 mt-1">
                {isZh
                  ? "你的所有進階功能已解鎖"
                  : "All premium features are now unlocked"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Free Plan */}
        <Card className="bg-white border-2 border-[#E5E5E5]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#2D3648] text-lg flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-[#AFAFAF]" />
                Free
              </CardTitle>
              <span className="text-2xl font-black text-[#2D3648]">$0</span>
            </div>
            <p className="text-sm text-[#AFAFAF]">
              {isZh ? "永久免費" : "Free forever"}
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {freeFeatures.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-[#2D3648]"
                >
                  <Check className="h-4 w-4 text-[#AFAFAF] flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="bg-white border-2 border-[#58CC02] relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#58CC02] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            {isZh ? "推薦" : "POPULAR"}
          </div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#2D3648] text-lg flex items-center gap-2">
                <Crown className="h-5 w-5 text-[#FF8C42]" />
                Pro
              </CardTitle>
              <div className="text-right">
                <span className="text-2xl font-black text-[#2D3648]">
                  $4.99
                </span>
                <span className="text-sm text-[#AFAFAF]">
                  /{isZh ? "月" : "mo"}
                </span>
              </div>
            </div>
            <p className="text-sm text-[#AFAFAF]">
              {isZh ? "解鎖所有進階功能" : "Unlock all premium features"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {proFeatures.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-[#2D3648]"
                >
                  <Check className="h-4 w-4 text-[#58CC02] flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {isLoading ? (
              <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ) : isPro ? (
              <Button
                className="w-full bg-[#2D3648] hover:bg-[#1a2030] text-white py-5"
                onClick={handleManageSubscription}
              >
                {isZh ? "管理訂閱" : "Manage Subscription"}
              </Button>
            ) : (
              <Button
                className="w-full bg-[#58CC02] hover:bg-[#46A302] text-white py-5 text-base font-bold"
                onClick={handleUpgrade}
                disabled={checkoutLoading}
              >
                {checkoutLoading
                  ? isZh
                    ? "跳轉中..."
                    : "Redirecting..."
                  : isZh
                    ? "升級到 Pro"
                    : "Upgrade to Pro"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="bg-white border-2 border-[#E5E5E5]">
          <CardContent className="p-4 space-y-3">
            <p className="font-medium text-[#2D3648] text-sm">
              {isZh ? "常見問題" : "FAQ"}
            </p>
            <div>
              <p className="text-sm font-medium text-[#2D3648]">
                {isZh ? "可以隨時取消嗎？" : "Can I cancel anytime?"}
              </p>
              <p className="text-xs text-[#AFAFAF]">
                {isZh
                  ? "可以！隨時在客戶入口網站取消訂閱，不會被收取額外費用。"
                  : "Yes! Cancel anytime from the customer portal. No extra charges."}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#2D3648]">
                {isZh ? "支援哪些付款方式？" : "What payment methods are accepted?"}
              </p>
              <p className="text-xs text-[#AFAFAF]">
                {isZh
                  ? "支援信用卡、金融卡等主流付款方式，由 Polar 安全處理。"
                  : "Credit cards, debit cards, and more. Securely processed by Polar."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
