import SocializBadge from "@/components/SocializBadge";

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-zinc-200/50 py-8 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 dark:text-zinc-500">
        <div className="flex flex-col sm:items-start items-center gap-0.5">
          <p>
            © {new Date().getFullYear()} KIIT Hub Community. All rights reserved.
          </p>
          <div className="mt-1 flex">
            <SocializBadge size="xs" />
          </div>
        </div>
        <div className="flex gap-4">
          <span className="hover:text-zinc-600 dark:hover:text-zinc-400 cursor-pointer transition-colors duration-200">
            Community Guidelines
          </span>
          <span>•</span>
          <span className="hover:text-zinc-600 dark:hover:text-zinc-400 cursor-pointer transition-colors duration-200">
            Support
          </span>
        </div>
      </div>
    </footer>
  );
}
