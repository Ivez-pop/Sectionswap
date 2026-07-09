"use client";

import React, { useState } from "react";
import { BookOpen, Code, Cpu, Database, Globe, Server, Terminal, Laptop, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const icons = [BookOpen, Code, Cpu, Database, Globe, Server, Terminal, Laptop];

interface SectionCardProps {
  id: number;
  name: string;
  onViewPeople: (sectionName: string) => void;
}

export default function SectionCard({ id, name, onViewPeople }: SectionCardProps) {
  const [preference, setPreference] = useState<"have" | "need" | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Distribute icons across the cards dynamically based on ID
  const IconComponent = icons[id % icons.length];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (preference) {
      setIsSubmitted(true);
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="group flex flex-col justify-between p-5 rounded-2xl border border-zinc-200 bg-white hover:border-blue-500/50 hover:shadow-lg hover:shadow-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-500/30 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
      <div>
        {/* Card Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-500 group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:group-hover:bg-blue-950/50 dark:group-hover:text-blue-400 transition-colors duration-300">
            <IconComponent className="h-4.5 w-4.5" />
          </div>
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            {name}
          </span>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2.5">
            {/* Have option */}
            <label
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                isSubmitted
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900"
              } ${
                preference === "have"
                  ? "border-blue-600 bg-blue-50/10 text-blue-600 dark:border-blue-500 dark:text-blue-400"
                  : "border-zinc-200/60 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <input
                type="radio"
                name={`preference-${id}`}
                value="have"
                checked={preference === "have"}
                disabled={isSubmitted}
                onChange={() => setPreference("have")}
                className="sr-only"
              />
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                  preference === "have"
                    ? "border-blue-600 dark:border-blue-500"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                {preference === "have" && (
                  <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500" />
                )}
              </span>
              <span>Have this Section</span>
            </label>

            {/* Need option */}
            <label
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                isSubmitted
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900"
              } ${
                preference === "need"
                  ? "border-blue-600 bg-blue-50/10 text-blue-600 dark:border-blue-500 dark:text-blue-400"
                  : "border-zinc-200/60 dark:border-zinc-800/80 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <input
                type="radio"
                name={`preference-${id}`}
                value="need"
                checked={preference === "need"}
                disabled={isSubmitted}
                onChange={() => setPreference("need")}
                className="sr-only"
              />
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                  preference === "need"
                    ? "border-blue-600 dark:border-blue-500"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                {preference === "need" && (
                  <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500" />
                )}
              </span>
              <span>Need this Section</span>
            </label>
          </div>

          <div className="pt-1.5">
            {/* Preference Submitted Badge */}
            {isSubmitted && (
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
              disabled={isSubmitted || preference === null}
              className="w-full h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-all duration-200 cursor-pointer border-0"
            >
              Submit Preference
            </Button>
          </div>
        </form>
      </div>

      {/* View People outline button */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900">
        <Button
          type="button"
          variant="outline"
          onClick={() => onViewPeople(name)}
          className="w-full h-9 rounded-xl border-zinc-200/80 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-colors duration-200 cursor-pointer"
        >
          View People
        </Button>
      </div>
    </div>
  );
}
