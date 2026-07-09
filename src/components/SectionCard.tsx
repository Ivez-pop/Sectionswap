"use client";

import React, { useState, useTransition } from "react";
import {
  BookOpen,
  Code,
  Cpu,
  Database,
  Globe,
  Server,
  Terminal,
  Laptop,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitPreference } from "@/app/actions/preferences";
import type { Preference, Section } from "@/lib/data/types";

const icons = [BookOpen, Code, Cpu, Database, Globe, Server, Terminal, Laptop];

interface SectionCardProps {
  section: Section;
  iconIndex: number;
  initialPreference: Preference | null;
  onViewPeople: (section: Section) => void;
}

export default function SectionCard({
  section,
  iconIndex,
  initialPreference,
  onViewPeople,
}: SectionCardProps) {
  const [submittedPref, setSubmittedPref] = useState<Preference | null>(
    initialPreference,
  );
  const [preference, setPreference] = useState<Preference | null>(
    initialPreference,
  );
  const [isSubmitted, setIsSubmitted] = useState(initialPreference !== null);
  const [isPending, startTransition] = useTransition();

  const IconComponent = icons[iconIndex % icons.length];

  const handleOptionClick = (option: Preference) => {
    if (isSubmitted || isPending) return;
    setPreference((prev) => (prev === option ? null : option));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await submitPreference(section.id, preference);
      if (!result.ok) {
        toast.error(result.error ?? "Could not save preference.");
        return;
      }
      setSubmittedPref(preference);
      setIsSubmitted(preference !== null);
      toast.success(
        preference === null
          ? `Cleared preference for ${section.name}`
          : `Submitted preference for ${section.name}`,
      );
    });
  };

  const handleEdit = () => setIsSubmitted(false);

  const hasChanges = preference !== submittedPref;

  return (
    <div className="group flex flex-col justify-between p-5 rounded-2xl border border-zinc-200 bg-white hover:border-blue-500/50 hover:shadow-lg hover:shadow-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-500/30 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
      <div>
        {/* Card Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-500 group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:group-hover:bg-blue-950/50 dark:group-hover:text-blue-400 transition-colors duration-300">
            <IconComponent className="h-4.5 w-4.5" />
          </div>
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            {section.name}
          </span>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2.5">
            {(["have", "need"] as const).map((option) => (
              <div
                key={option}
                role="radio"
                aria-checked={preference === option}
                onClick={() => handleOptionClick(option)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  isSubmitted || isPending
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900"
                } ${
                  preference === option
                    ? "border-blue-600 bg-blue-50/10 text-blue-600 dark:border-blue-500 dark:text-blue-400"
                    : "border-zinc-200/60 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                    preference === option
                      ? "border-blue-600 dark:border-blue-500"
                      : "border-zinc-300 dark:border-zinc-700"
                  }`}
                >
                  {preference === option && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500" />
                  )}
                </span>
                <span>
                  {option === "have" ? "Have this Section" : "Need this Section"}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-1.5">
            {isSubmitted && submittedPref !== null && (
              <div className="flex items-center justify-between py-2 px-3 bg-emerald-50 border border-emerald-100 rounded-xl dark:bg-emerald-950/20 dark:border-emerald-900/30 mb-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  Preference Submitted
                </span>
                <button
                  type="button"
                  onClick={handleEdit}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitted || !hasChanges || isPending}
              className="w-full h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-all duration-200 cursor-pointer border-0"
            >
              {isPending ? "Saving…" : "Submit Preference"}
            </Button>
          </div>
        </form>
      </div>

      {/* View People outline button */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900">
        <Button
          type="button"
          variant="outline"
          onClick={() => onViewPeople(section)}
          className="w-full h-9 rounded-xl border-zinc-200/80 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-colors duration-200 cursor-pointer"
        >
          View People
        </Button>
      </div>
    </div>
  );
}
