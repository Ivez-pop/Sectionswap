"use client";

import { X, Users, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Person, Section, SectionPeople } from "@/lib/data/types";

interface PeopleModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: Section | null;
}

export default function PeopleModal({
  isOpen,
  onClose,
  section,
}: PeopleModalProps) {
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState<SectionPeople>({ have: [], need: [] });
  const [error, setError] = useState<string | null>(null);

  // Prevent background scroll while open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Fetch people whenever a section is opened.
  useEffect(() => {
    if (!isOpen || !section) return;
    let cancelled = false;
    const sectionId = section.id;

    async function load() {
      setLoading(true);
      setError(null);
      setPeople({ have: [], need: [] });

      const supabase = createClient();
      const { data, error } = await supabase
        .from("swap_preferences")
        .select("preference, profile:profiles(id, full_name, email)")
        .eq("section_id", sectionId);

      if (cancelled) return;
      if (error) {
        setError("Could not load responses.");
        setLoading(false);
        return;
      }

      const result: SectionPeople = { have: [], need: [] };
      for (const row of data ?? []) {
        const profile = row.profile as unknown as Person | null;
        if (!profile) continue;
        if (row.preference === "have") result.have.push(profile);
        else if (row.preference === "need") result.need.push(profile);
      }
      setPeople(result);
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [isOpen, section]);

  if (!isOpen || !section) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-300">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md transform rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl transition-all dark:border-zinc-800 dark:bg-zinc-950 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Users className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {section.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors duration-200 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-zinc-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <PeopleList title="Have" people={people.have} />
            <PeopleList title="Need" people={people.need} />
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto h-9 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-600 transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function PeopleList({ title, people }: { title: string; people: Person[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2.5">
        {title}
        <span className="ml-1.5 text-zinc-300 dark:text-zinc-600">
          ({people.length})
        </span>
      </h4>
      {people.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-4 text-center text-sm text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-900/30 dark:text-zinc-400">
          No responses yet
        </div>
      ) : (
        <ul className="space-y-1.5">
          {people.map((person) => (
            <li
              key={person.id}
              className="flex flex-col rounded-xl border border-zinc-100 bg-white px-3.5 py-2 text-sm dark:border-zinc-900 dark:bg-zinc-950"
            >
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {person.full_name || person.email.split("@")[0]}
              </span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                {person.email}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
