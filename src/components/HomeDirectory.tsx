"use client";

import { useMemo, useState } from "react";
import PlatformIcon from "@/components/PlatformIcon";
import type { CommunityLink } from "@/lib/data/types";

const filters = ["All", "WhatsApp", "Discord"] as const;
type Filter = (typeof filters)[number];

export default function HomeDirectory({
  communities,
}: {
  communities: CommunityLink[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = communities.filter(
      (c) => filter === "All" || c.platform === filter,
    );
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description ?? "").toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q),
      );
    }
    return list
      .slice()
      .sort(
        (a, b) =>
          (b.category === "Section Swap" ? 1 : 0) -
          (a.category === "Section Swap" ? 1 : 0),
      );
  }, [communities, query, filter]);

  return (
    <>
      <div className="mt-[26px] flex flex-wrap items-center gap-3">
        <div className="flex min-w-[240px] flex-1 items-center gap-2.5 rounded-xl border-[1.5px] border-[var(--kh-line2)] bg-[var(--kh-card)] px-[15px] py-[11px]">
          <span className="text-[var(--kh-mut)]">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities…"
            className="w-full border-none bg-transparent text-[15px] font-medium text-[var(--kh-ink)] outline-none placeholder:text-[var(--kh-mut)]"
          />
        </div>
        <div className="flex gap-[7px]">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-[20px] px-[15px] py-2 text-[13px] font-semibold transition-colors cursor-pointer ${
                filter === f
                  ? "border-[1.5px] border-[var(--kh-ink)] bg-[var(--kh-ink)] text-[var(--kh-paper)]"
                  : "border-[1.5px] border-[var(--kh-line2)] bg-[var(--kh-card)] text-[var(--kh-ink2)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-14 text-center text-[var(--kh-mut)]">
          <div className="text-[34px]">🔍</div>
          <div className="mt-2 font-bold text-[var(--kh-ink)]">
            No communities match &ldquo;{query}&rdquo;
          </div>
          <div className="mt-1 text-sm">
            Try a different search, or ask an admin to add it.
          </div>
        </div>
      ) : (
        <div
          className="kh-stagger mt-[22px] grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
        >
          {filtered.map((c) => {
            const featured = c.category === "Section Swap";
            return (
              <div
                key={c.id}
                className="flex flex-col rounded-2xl border-[1.5px] p-[18px] transition-all duration-150 hover:-translate-y-[3px]"
                style={{
                  background: featured
                    ? "color-mix(in srgb, var(--kh-accent) 6%, var(--kh-card))"
                    : "var(--kh-card)",
                  borderColor: featured ? "var(--kh-accent)" : "var(--kh-line)",
                  boxShadow: featured
                    ? "0 6px 20px rgba(191,93,52,.12)"
                    : "0 1px 0 rgba(44,40,34,.02)",
                }}
              >
                <div className="flex items-start gap-3">
                  <PlatformIcon platform={c.platform} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-[7px] text-base font-bold leading-[1.25] text-[var(--kh-ink)]">
                      {c.name}
                      {featured && (
                        <span className="whitespace-nowrap rounded-[5px] bg-[var(--kh-accent)] px-[6px] py-[2.5px] font-mono text-[9px] font-bold tracking-wider text-white">
                          PINNED
                        </span>
                      )}
                    </div>
                    <div className="mt-[3px] font-mono text-[10.5px] uppercase tracking-wider text-[var(--kh-mut)]">
                      {c.platform}
                    </div>
                  </div>
                  <span
                    className="whitespace-nowrap rounded-[6px] px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-wider"
                    style={{
                      color: featured ? "var(--kh-accent)" : "var(--kh-ink2)",
                      background: featured
                        ? "color-mix(in srgb, var(--kh-accent) 12%, transparent)"
                        : "var(--kh-paper2)",
                    }}
                  >
                    {c.category}
                  </span>
                </div>

                {c.description && (
                  <p className="mt-[13px] line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-[var(--kh-ink2)]">
                    {c.description}
                  </p>
                )}

                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 rounded-[10px] py-2.5 text-center text-[13.5px] font-bold transition-transform"
                  style={
                    featured
                      ? {
                          background: "var(--kh-accent)",
                          color: "#fff",
                          boxShadow: "0 3px 0 var(--kh-accent-d)",
                        }
                      : {
                          border: "1.5px solid var(--kh-line2)",
                          color: "var(--kh-ink)",
                        }
                  }
                >
                  Join group →
                </a>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
