"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import CommunityCard from "@/components/CommunityCard";
import { useApp } from "@/context/AppContext";
import { Search } from "lucide-react";
import SocializBadge from "@/components/SocializBadge";

export default function Home() {
  const { communityLinks } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter general communities that are visible
  const generalCommunities = communityLinks.filter(
    (link) => link.category === "General" && link.visible
  );

  const filteredCommunities = generalCommunities.filter((link) =>
    link.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
    (link.description || "").toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/40 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col justify-start">
        {/* Banner Hero Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3.5 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              KIIT Hub Community
            </h1>
            <div className="flex justify-center pt-2">
              <SocializBadge size="sm" />
            </div>
          </div>
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed pt-2">
            Find and join your favorite interest groups at KIIT. Connect directly with students sharing similar passions.
          </p>

          {/* Search bar inside hero banner */}
          <div className="relative max-w-md mx-auto pt-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search coding, gaming, photography..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200 shadow-sm"
            />
          </div>
        </div>

        {/* Directory Grid */}
        <div className="w-full">
          {filteredCommunities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-200/80 rounded-2xl dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-900/10">
              <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                No interest groups found matching &ldquo;{searchQuery}&rdquo;
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  name={community.name}
                  platform={community.platform}
                  description={community.description}
                  url={community.url}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Premium minimal footer */}
      <footer className="w-full border-t border-zinc-200/50 py-8 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 dark:text-zinc-500">
          <div className="flex flex-col sm:items-start items-center gap-0.5">
            <p>© {new Date().getFullYear()} KIIT Hub Community. All rights reserved.</p>
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
    </div>
  );
}
