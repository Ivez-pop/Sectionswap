"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocializBadge from "@/components/SocializBadge";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center py-20 md:py-28 overflow-hidden">
      {/* Premium background accent */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,rgba(59,130,246,0.07),transparent)] dark:bg-[radial-gradient(45rem_50rem_at_top,rgba(59,130,246,0.03),transparent)]" />
      
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center px-6">
        {/* Title Stack */}
        <h1 className="flex flex-col gap-1.5 md:gap-2">
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
            KIIT Hub Community
          </span>
          <div className="flex justify-center mt-2.5 mb-1.5">
            <SocializBadge size="sm" />
          </div>
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-blue-600 dark:text-blue-500 mt-2 sm:mt-3">
            Section Swap
          </span>
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-6 max-w-xl text-base sm:text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
          Find students who have or need your section and connect with them effortlessly.
        </p>

        {/* Action Button */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <Button
            size="lg"
            className="h-11 px-6 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-2 group border-0"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          
          {/* Custom Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 px-3.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 shadow-sm animate-pulse-slow">
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500" />
            ✨ Built for KIIT Students
          </span>
        </div>
      </div>
    </section>
  );
}
