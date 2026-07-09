"use client";

import SectionCard from "./SectionCard";

interface Section {
  id: number;
  name: string;
}

interface SectionGridProps {
  searchQuery?: string;
  onViewPeople: (sectionName: string) => void;
}

// Generate the 49 sections dynamically as required
const sections: Section[] = Array.from({ length: 49 }, (_, i) => ({
  id: i + 1,
  name: `CSE ${i + 1}`,
}));

export default function SectionGrid({ searchQuery = "", onViewPeople }: SectionGridProps) {
  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  if (filteredSections.length === 0) {
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
      {filteredSections.map((section) => (
        <SectionCard
          key={section.id}
          id={section.id}
          name={section.name}
          onViewPeople={onViewPeople}
        />
      ))}
    </div>
  );
}
