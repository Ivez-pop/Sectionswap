"use client";

import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

import { useApp } from "@/context/AppContext";

export default function WhatsAppCTA() {
  const { communityLinks } = useApp();

  // Find the first visible WhatsApp community link that belongs to Section Swap
  const activeWhatsAppLink = communityLinks.find(
    (link) => link.platform === "WhatsApp" && link.visible && link.category === "Section Swap"
  );

  if (!activeWhatsAppLink) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mb-12">
      <div className="group relative rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-50/10 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-500/20 dark:hover:shadow-none overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-16 -top-16 -z-10 h-32 w-32 rounded-full bg-emerald-50/30 blur-2xl transition-all duration-500 group-hover:bg-emerald-50/50 dark:bg-emerald-950/5 dark:group-hover:bg-emerald-950/10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
          {/* Text and Icon section */}
          <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <WhatsAppIcon className="h-6 w-6" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                Join the {activeWhatsAppLink.name} WhatsApp Group
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                Stay updated with section swaps, announcements, important notices, and connect directly with fellow KIIT students.
              </p>
            </div>
          </div>

          {/* Action button and social proof section */}
          <div className="flex flex-col sm:items-start md:items-end justify-center shrink-0 gap-2.5">
            <a
              href={activeWhatsAppLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full sm:w-auto h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all duration-200 cursor-pointer shadow-sm shadow-emerald-600/10 border-0 flex items-center gap-2 justify-center"
              )}
            >
              Join WhatsApp Group
              <ExternalLink className="h-4 w-4" />
            </a>
            
            <p className="text-xs text-zinc-400 dark:text-zinc-500 sm:pl-1 md:pl-0">
              Already <span className="font-semibold text-zinc-600 dark:text-zinc-400">2,000+ students</span> are part of the KIIT Hub Community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
