"use client";

import { useState } from "react";
import SectionGrid from "./SectionGrid";
import PeopleModal from "./PeopleModal";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Preference, Section } from "@/lib/data/types";

const academicSessions = ["2026–2027"];
const studentYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

interface DashboardProps {
  sections: Section[];
  myPreferences: Record<number, Preference>;
}

export default function Dashboard({ sections, myPreferences }: DashboardProps) {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2026–2027");
  const [selectedStudentYear, setSelectedStudentYear] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<Section | null>(null);

  const isFilterActive = selectedAcademicYear && selectedStudentYear;

  return (
    <section id="swap-dashboard" className="w-full max-w-7xl mx-auto px-6 pb-24">
      {/* Title Header, Filters & Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-zinc-200/60 pb-5 mb-6 dark:border-zinc-800/60">
        {/* Left: Headers */}
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Available Sections
          </h2>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Browse through {sections.length} sections to view swap preferences or
            submit yours.
          </p>
        </div>

        {/* Right: Compact Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Academic Session */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 shrink-0 hidden sm:inline">
              Session
            </span>
            <Select value={selectedAcademicYear} onValueChange={(val) => setSelectedAcademicYear(val || "")}>
              <SelectTrigger className="w-full sm:w-28 h-9 px-2 text-xs rounded-xl border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50">
                <SelectValue placeholder="Session" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-xl p-1 shadow-md z-50">
                {academicSessions.map((session) => (
                  <SelectItem key={session} value={session} className="text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 px-3 py-2 rounded-lg cursor-pointer">
                    {session}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Year */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 shrink-0 hidden sm:inline">
              Year
            </span>
            <Select value={selectedStudentYear} onValueChange={(val) => setSelectedStudentYear(val || "")}>
              <SelectTrigger className="w-full sm:w-32 h-9 px-2 text-xs rounded-xl border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-xl p-1 shadow-md z-50">
                {studentYears.map((year) => (
                  <SelectItem key={year} value={year} className="text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 px-3 py-2 rounded-lg cursor-pointer">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Control */}
          <div className="relative w-full sm:w-44">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-8.5 pr-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {isFilterActive ? (
        <SectionGrid
          sections={sections}
          myPreferences={myPreferences}
          searchQuery={searchQuery}
          onViewPeople={setActiveSection}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-12 py-16 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/30 dark:border-zinc-800 dark:bg-zinc-900/10 transition-all duration-300">
          <span className="text-3xl mb-4">✨</span>
          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
            Please select your academic session and current year to continue.
          </p>
        </div>
      )}

      <PeopleModal
        isOpen={activeSection !== null}
        onClose={() => setActiveSection(null)}
        section={activeSection}
      />
    </section>
  );
}
