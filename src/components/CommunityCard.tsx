"use client";

import { ExternalLink, Code, Tv, Film, Gamepad2, Lightbulb, Camera, Trophy, Music, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface CommunityCardProps {
  name: string;
  platform: "WhatsApp" | "Discord";
  description?: string;
  url: string;
}

// Icon router based on community name
const resolveIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("code") || n.includes("coding") || n.includes("dev")) return Code;
  if (n.includes("anime") || n.includes("manga")) return Tv;
  if (n.includes("cine") || n.includes("movie") || n.includes("film")) return Film;
  if (n.includes("game") || n.includes("gaming")) return Gamepad2;
  if (n.includes("start") || n.includes("incub") || n.includes("idea") || n.includes("biz")) return Lightbulb;
  if (n.includes("photo") || n.includes("camera") || n.includes("lens")) return Camera;
  if (n.includes("music") || n.includes("song") || n.includes("club") || n.includes("beat")) return Music;
  if (n.includes("sport") || n.includes("game") || n.includes("play") || n.includes("fit") || n.includes("athlet")) return Trophy;
  return Users;
};

const renderCommunityIcon = (name: string, className: string) => {
  const Icon = resolveIcon(name);
  return <Icon className={className} />;
};

export default function CommunityCard({ name, platform, description, url }: CommunityCardProps) {
  const isWhatsApp = platform === "WhatsApp";

  return (
    <div className="group flex flex-col justify-between p-6 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
      <div>
        {/* Card Top Title & Platform Badge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-500 group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:group-hover:bg-blue-950/50 dark:group-hover:text-blue-400 transition-colors duration-300">
            {renderCommunityIcon(name, "h-5 w-5")}
          </div>
          
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
