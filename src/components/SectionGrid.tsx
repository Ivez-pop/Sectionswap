"use client";

import { useMemo } from "react";
import SectionCard from "./SectionCard";
import type { Preference, Section } from "@/lib/data/types";

interface SectionGridProps {
  sections: Section[];
  myPreferences: Record<number, Preference>;
  searchQuery?: string;
  onViewPeople: (section: Section) => void;
}

export default function SectionGrid({
  sections,
  myPreferences,
  searchQuery = "",
  onViewPeople,
}: SectionGridProps) {
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter((s) => s.name.toLowerCase().includes(q));
  }, [sections, searchQuery]);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-200/80 rounded-2xl dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-900/10">
        <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
          No sections found matching &ldquo;{searchQuery}&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filtered.map((section, index) => (
        <SectionCard
          key={section.id}
          section={section}
          iconIndex={index}
          initialPreference={myPreferences[section.id] ?? null}
          onViewPeople={onViewPeople}
        />
      ))}
    </div>
  );
}
