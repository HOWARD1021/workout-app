"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { LogOut, User, Crown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

export default function UserMenu() {
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { locale } = useI18n();
  const isZh = locale === "zh-TW";

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isPending) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#58CC02] hover:border-[#46A302] transition-colors"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#58CC02] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-56 bg-white rounded-xl border-2 border-gray-200 shadow-lg z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-bold text-sm text-gray-800 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          {/* Actions */}
          <button
            onClick={() => {
              router.push("/pricing");
              setOpen(false);
            }}
            className="w-full px-4 py-3 text-left text-sm font-medium text-[#FF8C42] hover:bg-orange-50 flex items-center gap-2 transition-colors"
          >
            <Crown className="w-4 h-4" />
            {isZh ? "升級 Pro" : "Upgrade to Pro"}
          </button>
          <button
            onClick={async () => {
              await signOut();
              setOpen(false);
              window.location.reload();
            }}
            className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {isZh ? "登出" : "Sign Out"}
          </button>
        </div>
      )}
    </div>
  );
}
