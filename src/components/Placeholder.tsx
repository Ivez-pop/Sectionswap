"use client";

import { LayoutGrid, SlidersHorizontal, Search, Sparkles } from "lucide-react";

export default function Placeholder() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 pb-24">
      {/* Premium Dashboard Shell Container */}
      <div className="relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none overflow-hidden">
        {/* Subtle grid pattern background in the container */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(9,9,11,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(9,9,11,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]" />

        {/* Dashboard Header Skeleton */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-6 dark:border-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800">
              <LayoutGrid className="h-4 w-4" />
            </div>
            <div>
              <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="h-3 w-16 rounded bg-zinc-100 dark:bg-zinc-900 mt-1.5 animate-pulse" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-32 items-center gap-2 rounded-lg border border-zinc-100 bg-zinc-50/50 px-3 text-zinc-300 dark:border-zinc-900 dark:bg-zinc-900/50">
              <Search className="h-4 w-4 shrink-0" />
              <div className="h-3 w-16 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            </div>
            <div className="flex h-9 w-24 items-center gap-2 rounded-lg border border-zinc-100 bg-zinc-50/50 px-3 text-zinc-300 dark:border-zinc-900 dark:bg-zinc-900/50">
              <SlidersHorizontal className="h-4 w-4 shrink-0" />
              <div className="h-3 w-10 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            </div>
          </div>
        </div>

        {/* Dashboard Grid Skeleton of 49 Section Cards (showing 6 as blurred placeholder) */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 filter blur-[2px] opacity-40 select-none pointer-events-none">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-5 dark:border-zinc-800/80 dark:bg-zinc-900/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                  <div>
                    <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                    <div className="h-3 w-12 rounded bg-zinc-100 dark:bg-zinc-900 mt-1.5 animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              </div>
              <div className="mt-6 flex gap-2">
                <div className="h-8 flex-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="h-8 flex-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Floating Centered Glassmorphic Message Container */}
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-white/10 dark:bg-black/10 backdrop-blur-[1px]">
          <div className="max-w-md w-full rounded-2xl border border-zinc-200/80 bg-white/95 p-8 text-center shadow-2xl shadow-zinc-200/50 dark:border-zinc-800/80 dark:bg-zinc-950/95 dark:shadow-none transition-all duration-300 hover:scale-[1.01] hover:border-blue-500/30">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 mb-4 shadow-inner">
              <Sparkles className="h-6 w-6" />
            </div>
            
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Section Swap Dashboard
            </h3>
            
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              The directory containing all 49 section cards and swap requests is currently under construction.
            </p>
            
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-100 px-4 py-2 text-xs font-semibold text-yellow-800 dark:bg-yellow-950/40 dark:border-yellow-900/50 dark:text-yellow-400">
              <span className="text-sm">🚧</span> Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
