"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import CommunityCard from "@/components/CommunityCard";
import type { CommunityLink } from "@/lib/data/types";

export default function CommunityDirectory({
  communities,
}: {
  communities: CommunityLink[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return communities;
    return communities.filter(
      (link) =>
        link.name.toLowerCase().includes(q) ||
        (link.description || "").toLowerCase().includes(q),
    );
  }, [communities, searchQuery]);

  return (
    <>
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

      {/* Directory Grid */}
      <div className="w-full pt-12">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-200/80 rounded-2xl dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-900/10">
            <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
              No interest groups found matching &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((community) => (
              <CommunityCard
                key={community.id}
                name={community.name}
                platform={community.platform}
                description={community.description ?? undefined}
                url={community.url}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
