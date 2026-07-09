"use client";

import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import PlatformIcon from "@/components/PlatformIcon";

interface CommunityCardProps {
  name: string;
  platform: "WhatsApp" | "Discord";
  description?: string;
  url: string;
}

export default function CommunityCard({ name, platform, description, url }: CommunityCardProps) {
  const isWhatsApp = platform === "WhatsApp";

  return (
    <div className="group flex flex-col justify-between p-6 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
      <div>
        {/* Card Top Title & Platform Badge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <PlatformIcon platform={platform} />
          
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
            isWhatsApp
              ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
              : "bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400"
          }`}>
            {platform}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {name}
        </h3>
        
        {description && (
          <p className="mt-2 text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
            {description}
          </p>
        )}
      </div>

      {/* Action Trigger */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-full h-9 rounded-xl border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-colors duration-200 cursor-pointer flex items-center gap-1.5 justify-center font-semibold"
          )}
        >
          Join Community
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
