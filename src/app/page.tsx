import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/40 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 flex flex-col justify-center">
        <Hero />
        <Dashboard />
      </main>
      
      {/* Premium minimal footer */}
      <footer className="w-full border-t border-zinc-200/50 py-8 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} KIIT Hub Community. All rights reserved.</p>
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
    </div>
  );
}
