"use client";

import React from "react";
import { FaWhatsapp, FaDiscord } from "react-icons/fa6";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformIconProps {
  platform: string;
  className?: string;
}

export default function PlatformIcon({ platform, className }: PlatformIconProps) {
  const p = platform.trim().toLowerCase();

  if (p === "whatsapp") {
    return (
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.12)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_16px_rgba(16,185,129,0.22)] dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400",
          className
        )}
      >
        <FaWhatsapp className="h-6 w-6" />
      </div>
    );
  }

  if (p === "discord") {
    return (
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100/50 text-[#5865F2] shadow-[0_0_12px_rgba(88,101,242,0.12)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_16px_rgba(88,101,242,0.22)] dark:bg-blue-950/15 dark:border-blue-900/30 dark:text-[#7289da]",
          className
        )}
      >
        <FaDiscord className="h-6 w-6" />
      </div>
    );
  }

  // Fallback icon for unknown platforms
  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-500 transition-all duration-300 group-hover:scale-105 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400",
        className
      )}
    >
      <Users className="h-6 w-6" />
    </div>
  );
}
