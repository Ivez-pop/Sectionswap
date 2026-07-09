"use client";

export default function Hero() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 mb-6">
      <div className="flex flex-col gap-1 text-left">
        {/* Title Stack */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          <span className="text-zinc-900 dark:text-zinc-50">
            KIIT Hub Community
          </span>
          <span className="mx-2 text-zinc-300 dark:text-zinc-700">|</span>
          <span className="text-blue-600 dark:text-blue-500">
            Section Swap
          </span>
        </h1>
        {/* Subtitle */}
        <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-normal">
          Connect with students to exchange sections.
        </p>
      </div>
    </div>
  );
}



