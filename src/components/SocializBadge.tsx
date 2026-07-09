"use client";

import { cn } from "@/lib/utils";

interface SocializBadgeProps {
  className?: string;
  size?: "xs" | "sm" | "md";
}

export default function SocializBadge({ className, size = "sm" }: SocializBadgeProps) {
  const sizeClasses = {
    xs: "text-[9px]",
    sm: "text-[10px] sm:text-xs",
    md: "text-xs sm:text-sm",
  };

  return (
    <span
      className={cn(
        "font-mono tracking-wide text-[var(--kh-mut)] select-none",
        sizeClasses[size],
        className,
      )}
    >
      Powered by Socializ
    </span>
  );
}
