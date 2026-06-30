"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { LogOut, User, Crown, Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";

export default function UserMenu() {
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { locale, setLocale } = useI18n();
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
        className="h-10 w-10 overflow-hidden rounded-full bg-white ring-1 ring-black/5 transition active:scale-95"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#111111]">
            <User className="h-4 w-4 text-white" />
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
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
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-[#111111] transition-colors hover:bg-[#f2f2f7]"
          >
            <Crown className="w-4 h-4" />
            {isZh ? "升級 Pro" : "Upgrade to Pro"}
          </button>
          <button
            onClick={() => {
              setLocale(locale === "zh-TW" ? "en" : "zh-TW");
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-[#111111] transition-colors hover:bg-[#f2f2f7]"
          >
            <Globe className="w-4 h-4" />
            {locale === "zh-TW" ? "English" : "中文"}
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
