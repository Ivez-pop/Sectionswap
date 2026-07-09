"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SectionDetailDrawer from "@/components/SectionDetailDrawer";
import { ordinal } from "@/lib/utils";
import type { CommunityLink, Preference, Section } from "@/lib/data/types";

interface SectionSwapViewProps {
  sections: Section[];
  myPreferences: Record<number, Preference>;
  counts: Record<number, { have: number; need: number }>;
  whatsAppCta: CommunityLink | null;
}

export default function SectionSwapView({
  sections,
  myPreferences,
  counts,
  whatsAppCta,
}: SectionSwapViewProps) {
  const router = useRouter();

  const semesters = useMemo(() => {
    const map = new Map<number, number>();
    for (const s of sections) map.set(s.semester, (map.get(s.semester) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [sections]);

  const [semester, setSemester] = useState<number | null>(
    semesters[0]?.[0] ?? null,
  );
  const [semOpen, setSemOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hasOffers, setHasOffers] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const q = query.trim().toLowerCase();
  const shown = sections
    .filter((s) => s.semester === semester)
    .filter((s) => !q || s.name.toLowerCase().includes(q))
    .filter((s) => {
      if (!hasOffers) return true;
      const c = counts[s.id];
      return !!c && c.have + c.need > 0;
    });

  const selected = selectedId !== null ? sections.find((s) => s.id === selectedId) ?? null : null;

  return (
    <div className="pb-14 pt-9">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-[560px]">
          <div className="font-mono text-xs uppercase tracking-[.14em] text-[var(--kh-accent)]">
            Section Swap
          </div>
          <h1 className="mt-2 font-serif text-[46px] font-normal leading-[1.03] tracking-tight text-[var(--kh-ink)]">
            Got a section? Need a section?
          </h1>
          <p className="mt-2.5 text-[15.5px] leading-relaxed text-[var(--kh-ink2)]">
            Say what you <b className="font-bold text-[var(--kh-have)]">have</b> or{" "}
            <b className="font-bold text-[var(--kh-need)]">need</b>, then see who&rsquo;s
            a match. Sort out the actual swap in the group chat.
          </p>
        </div>
        {whatsAppCta && (
          <a
            href={whatsAppCta.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 whitespace-nowrap rounded-xl px-[17px] py-3 text-sm font-bold text-white shadow-[0_3px_0_rgba(45,90,60,.5)]"
            style={{ background: "var(--kh-wa)" }}
          >
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-white/25 font-mono text-[8px] font-bold">
              WA
            </span>
            Join swap group
          </a>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setSemOpen((v) => !v)}
            className="flex min-w-[190px] items-center justify-between gap-2.5 rounded-xl px-4 py-[11px] text-sm font-bold cursor-pointer"
            style={{ background: "var(--kh-ink)", color: "var(--kh-paper)" }}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">
              Semester
            </span>
            <span className="ml-1 flex-1 text-left">
              {semester !== null ? `${ordinal(semester)} sem` : "—"}
            </span>
            <span className="opacity-70">▾</span>
          </button>
          {semOpen && (
            <div className="absolute left-0 top-[52px] z-20 min-w-[190px] rounded-xl border-[1.5px] border-[var(--kh-line2)] bg-[var(--kh-card)] p-1.5 shadow-[0_14px_34px_rgba(44,40,34,.18)] animate-in fade-in duration-150">
              {semesters.map(([sem, count]) => (
                <button
                  key={sem}
                  onClick={() => {
                    setSemester(sem);
                    setSemOpen(false);
                    setSelectedId(null);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-[11px] py-2.5 text-left text-sm font-semibold text-[var(--kh-ink)] cursor-pointer"
                  style={{ background: semester === sem ? "var(--kh-paper2)" : "transparent" }}
                >
                  {ordinal(sem)} semester
                  <span className="ml-auto font-mono text-[11px] text-[var(--kh-mut)]">
                    {count} sections
                  </span>
                </button>
              ))}
              <div className="px-2.5 pb-1 pt-2 font-mono text-[10px] leading-relaxed text-[var(--kh-mut)]">
                More semesters appear as admins add batches.
              </div>
            </div>
          )}
        </div>

        <div className="flex min-w-[220px] flex-1 items-center gap-2.5 rounded-xl border-[1.5px] border-[var(--kh-line2)] bg-[var(--kh-card)] px-[15px] py-[11px]">
          <span className="text-[var(--kh-mut)]">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a section — e.g. CSE 23…"
            className="w-full border-none bg-transparent text-[15px] font-medium text-[var(--kh-ink)] outline-none placeholder:text-[var(--kh-mut)]"
          />
        </div>

        <button
          onClick={() => setHasOffers((v) => !v)}
          className="whitespace-nowrap rounded-xl px-4 py-[11px] text-[13px] font-semibold cursor-pointer"
          style={
            hasOffers
              ? { background: "var(--kh-ink)", color: "var(--kh-paper)", border: "1.5px solid var(--kh-ink)" }
              : { background: "var(--kh-card)", color: "var(--kh-ink2)", border: "1.5px solid var(--kh-line2)" }
          }
        >
          Has responses
        </button>
      </div>

      <div className="mt-[18px] flex items-center gap-4 text-[12.5px] text-[var(--kh-ink2)]">
        <span className="flex items-center gap-1.5">
          <span
            className="h-[11px] w-[11px] rounded-[3px]"
            style={{ background: "var(--kh-have)" }}
          />
          have this section
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-[11px] w-[11px] rounded-[3px]"
            style={{ background: "var(--kh-need)" }}
          />
          need this section
        </span>
        <span className="ml-auto font-mono text-[11px] text-[var(--kh-mut)]">
          {shown.length} shown
        </span>
      </div>

      {shown.length === 0 ? (
        <div className="py-13 text-center text-[var(--kh-mut)]">
          <div className="text-[32px]">🗂️</div>
          <div className="mt-2 font-bold text-[var(--kh-ink)]">
            Nothing matches &ldquo;{query}&rdquo;
          </div>
          <div className="mt-1 text-sm">
            Check the section number, or switch semester.
          </div>
        </div>
      ) : (
        <div
          className="mt-3.5 grid gap-[11px]"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
        >
          {shown.map((s) => {
            const c = counts[s.id] ?? { have: 0, need: 0 };
            const mine = myPreferences[s.id] !== undefined;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className="relative rounded-[14px] border-[1.5px] px-3.5 py-[15px] text-left transition-transform cursor-pointer"
                style={{
                  background: "var(--kh-card)",
                  borderColor: mine ? "var(--kh-ink)" : "var(--kh-line)",
                }}
              >
                {mine && (
                  <span
                    className="absolute right-2 top-2 rounded-[4px] px-[5px] py-0.5 font-mono text-[8px] font-bold tracking-wide"
                    style={{ background: "var(--kh-ink)", color: "var(--kh-paper)" }}
                  >
                    YOU
                  </span>
                )}
                <div className="text-[19px] font-extrabold tracking-tight text-[var(--kh-ink)]">
                  {s.name}
                </div>
                <div className="mt-[9px] flex gap-1.5">
                  <span
                    className="rounded-[7px] px-2 py-[3px] font-mono text-[11px] font-bold"
                    style={
                      c.have > 0
                        ? { background: "var(--kh-have-bg)", color: "var(--kh-have)", border: "1px solid var(--kh-have-line)" }
                        : { color: "var(--kh-mut)", border: "1px solid var(--kh-line)" }
                    }
                  >
                    {c.have} have
                  </span>
                  <span
                    className="rounded-[7px] px-2 py-[3px] font-mono text-[11px] font-bold"
                    style={
                      c.need > 0
                        ? { background: "var(--kh-need-bg)", color: "var(--kh-need)", border: "1px solid var(--kh-need-line)" }
                        : { color: "var(--kh-mut)", border: "1px solid var(--kh-line)" }
                    }
                  >
                    {c.need} need
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <SectionDetailDrawer
        section={selected}
        preference={selected ? myPreferences[selected.id] ?? null : null}
        onClose={() => setSelectedId(null)}
        onChanged={() => router.refresh()}
      />
    </div>
  );
}
