"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocializBadgeProps {
  className?: string;
  size?: "xs" | "sm" | "md";
}

export default function SocializBadge({ className, size = "sm" }: SocializBadgeProps) {
  // Balanced scaling for different layout contexts
  const sizeClasses = {
    xs: "px-2 py-0.5 text-[9px] gap-1 shadow-[0_0_10px_rgba(251,191,36,0.15)] hover:shadow-[0_0_15px_rgba(251,191,36,0.25)] border-amber-300/30",
    sm: "px-3.5 py-0.5 text-[10px] sm:text-xs gap-1.5 shadow-[0_0_15px_rgba(251,191,36,0.20)] hover:shadow-[0_0_20px_rgba(251,191,36,0.30)] border-amber-300/40",
    md: "px-4.5 py-1 text-xs sm:text-sm gap-2 shadow-[0_0_25px_rgba(251,191,36,0.25)] hover:shadow-[0_0_30px_rgba(251,191,36,0.35)] border-amber-300/50",
  };

  const iconSizes = {
    xs: "h-2.5 w-2.5",
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-bold tracking-wider uppercase rounded-full border bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 text-amber-950 select-none hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-default",
        sizeClasses[size],
        className
      )}
    >
      <Sparkles className={cn("text-amber-950 fill-amber-950/20 shrink-0", iconSizes[size])} />
      <span>Powered by Socializ</span>
    </div>
  );
}
