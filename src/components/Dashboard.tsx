"use client";

import { useState } from "react";
import SectionGrid from "./SectionGrid";
import PeopleModal from "./PeopleModal";
import { Search } from "lucide-react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSectionForModal, setActiveSectionForModal] = useState<string | null>(null);

  const handleViewPeople = (sectionName: string) => {
    setActiveSectionForModal(sectionName);
  };

  const handleCloseModal = () => {
    setActiveSectionForModal(null);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-6 pb-24">
      {/* Title Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200/60 pb-6 mb-8 dark:border-zinc-800/60">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Available Sections
          </h2>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Browse through 49 sections to view swap preferences or submit yours.
          </p>
        </div>

        {/* Search Control */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Grid containing cards */}
      <SectionGrid
        searchQuery={searchQuery}
        onViewPeople={handleViewPeople}
      />

      {/* Shared reusable modal */}
      <PeopleModal
        isOpen={activeSectionForModal !== null}
        onClose={handleCloseModal}
        sectionName={activeSectionForModal || ""}
      />
    </section>
  );
}
