"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  UserPlus,
  Check,
  X,
  Users,
  Activity,
  Share2,
} from "lucide-react";
import { friendsApi, feedApi, type FriendData, type FeedItem } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";

type Tab = "friends" | "feed";

export default function FriendsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("friends");
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [friendData, feedData] = await Promise.all([
        friendsApi.list().catch(() => []),
        feedApi.list().catch(() => []),
      ]);
      setFriends(friendData);
      setFeed(feedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setError(null);
    try {
      await friendsApi.invite(inviteEmail.trim());
      setInviteEmail("");
      setShowInvite(false);
      await fetchData();
    } catch (err) {
      setError(t("friends.inviteFailed"));
    } finally {
      setInviting(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await friendsApi.respond(id, "accepted");
      await fetchData();
    } catch (error) {
      console.error("Failed to accept:", error);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await friendsApi.respond(id, "declined");
      await fetchData();
    } catch (error) {
      console.error("Failed to decline:", error);
    }
  };

  const handleShareThreads = () => {
    // Phase 2: Threads integration
    // Pre-wire: open Threads compose URL
    const text = encodeURIComponent("Just finished a workout! 💪🏋️ #FitnessJourney");
    window.open(`https://www.threads.net/intent/post?text=${text}`, "_blank");
  };

  const accepted = friends.filter((f) => f.status === "accepted");
  const pendingIncoming = friends.filter(
    (f) => f.status === "pending" && f.isIncoming
  );
  const pendingOutgoing = friends.filter(
    (f) => f.status === "pending" && !f.isIncoming
  );

  const FEED_ICONS: Record<string, string> = {
    workout: "🏋️",
    achievement: "🏆",
    streak: "🔥",
  };

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
              {t("friends.title")}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInvite(!showInvite)}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Invite Form */}
        {showInvite && (
          <Card className="bg-white border-2 border-[#58CC02]">
            <CardContent className="p-4">
              <p className="text-sm font-bold text-[#2D3648] mb-2">
                {t("friends.addFriend")}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder={t("friends.emailPlaceholder")}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#58CC02]"
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                />
                <Button
                  onClick={handleInvite}
                  disabled={inviting}
                  className="bg-[#58CC02] hover:bg-[#46A302] text-white"
                >
                  {t("friends.send")}
                </Button>
              </div>
              {error && (
                <p className="text-xs text-red-500 mt-2">{error}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab Switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === "friends"
                ? "bg-[#58CC02] text-white"
                : "bg-white text-[#2D3648] border border-gray-200"
            }`}
          >
            <Users className="w-4 h-4" />
            {t("friends.friendList")} ({accepted.length})
          </button>
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === "feed"
                ? "bg-[#58CC02] text-white"
                : "bg-white text-[#2D3648] border border-gray-200"
            }`}
          >
            <Activity className="w-4 h-4" />
            {t("friends.activityFeed")}
          </button>
        </div>

        {/* Friends Tab */}
        {activeTab === "friends" && (
          <>
            {/* Pending Incoming */}
            {pendingIncoming.length > 0 && (
              <Card className="bg-white border-2 border-[#FF8C42]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#2D3648] text-base">
                    {t("friends.pendingRequests")} ({pendingIncoming.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {pendingIncoming.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#FFF8F0]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FF8C42] flex items-center justify-center text-white font-bold">
                          {f.friendName.charAt(0)}
                        </div>
                        <span className="font-medium text-[#2D3648]">
                          {f.friendName}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(f.id)}
                          className="p-2 rounded-full bg-[#58CC02] text-white hover:bg-[#46A302]"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDecline(f.id)}
                          className="p-2 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Accepted Friends */}
            <Card className="bg-white border-2 border-[#E5E5E5]">
              <CardContent className="p-4">
                {accepted.length === 0 && pendingOutgoing.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-[#AFAFAF]">{t("friends.noFriends")}</p>
                    <p className="text-xs text-gray-300 mt-1">
                      {t("friends.noFriendsHint")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {accepted.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#F7F7F7]"
                      >
                        <div className="flex items-center gap-3">
                          {f.friendImage ? (
                            <img
                              src={f.friendImage}
                              alt={f.friendName}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#58CC02] flex items-center justify-center text-white font-bold">
                              {f.friendName.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium text-[#2D3648]">
                            {f.friendName}
                          </span>
                        </div>
                        <span className="text-xs text-[#58CC02] font-bold">
                          ✓ {t("friends.connected")}
                        </span>
                      </div>
                    ))}
                    {pendingOutgoing.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#F7F7F7] opacity-60"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                            {f.friendName.charAt(0)}
                          </div>
                          <span className="font-medium text-[#2D3648]">
                            {f.friendName}
                          </span>
                        </div>
                        <span className="text-xs text-[#AFAFAF]">
                          {t("friends.pending")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Threads Share Button (Phase 2 Pre-wire) */}
            <button
              onClick={handleShareThreads}
              className="w-full py-4 rounded-2xl bg-black text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all"
            >
              <Share2 className="w-5 h-5" />
              {t("friends.shareThreads")}
            </button>
          </>
        )}

        {/* Feed Tab */}
        {activeTab === "feed" && (
          <Card className="bg-white border-2 border-[#E5E5E5]">
            <CardContent className="p-4">
              {feed.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-[#AFAFAF]">{t("friends.noActivity")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {feed.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 rounded-lg bg-[#F7F7F7]"
                    >
                      <div className="text-2xl flex-shrink-0">
                        {FEED_ICONS[item.type] || "📝"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#2D3648] text-sm">
                          <span className="font-bold">
                            {item.isOwn ? t("friends.you") : item.userName}
                          </span>{" "}
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-xs text-[#AFAFAF] mt-0.5">
                            {item.description}
                          </p>
                        )}
                        <p className="text-[10px] text-gray-300 mt-1">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
