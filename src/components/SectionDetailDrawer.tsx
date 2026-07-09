"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { submitPreference } from "@/app/actions/preferences";
import { ordinal } from "@/lib/utils";
import type { Person, Preference, Section, SectionPeople } from "@/lib/data/types";

interface SectionDetailDrawerProps {
  section: Section | null;
  preference: Preference | null;
  onClose: () => void;
  onChanged: () => void;
}

export default function SectionDetailDrawer({
  section,
  preference,
  onClose,
  onChanged,
}: SectionDetailDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState<SectionPeople>({ have: [], need: [] });
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  const isOpen = section !== null;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!section) return;
    let cancelled = false;
    const sectionId = section.id;

    async function load() {
      setLoading(true);
      setRevealed({});
      const supabase = createClient();
      const { data, error } = await supabase
        .from("swap_preferences")
        .select(
          "preference, profile:profiles(id, full_name, email, whatsapp_number, discord_handle)",
        )
        .eq("section_id", sectionId);

      if (cancelled) return;
      if (error) {
        toast.error("Could not load responses.");
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
  }, [section]);

  if (!section) return null;

  const haveCount = people.have.length;
  const needCount = people.need.length;

  const respond = (next: Preference) => {
    const value = preference === next ? null : next;
    startTransition(async () => {
      const result = await submitPreference(section.id, value);
      if (!result.ok) {
        toast.error(result.error ?? "Could not save your response.");
        return;
      }
      onChanged();
    });
  };

  const clearResponse = () => {
    startTransition(async () => {
      const result = await submitPreference(section.id, null);
      if (!result.ok) {
        toast.error(result.error ?? "Could not remove your response.");
        return;
      }
      onChanged();
    });
  };

  const reveal = (id: string) => setRevealed((r) => ({ ...r, [id]: true }));

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex justify-end bg-[rgba(44,40,34,.4)] backdrop-blur-[2px] animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-[440px] overflow-y-auto bg-[var(--kh-card)] shadow-[-12px_0_40px_rgba(44,40,34,.2)] animate-in slide-in-from-right-6 duration-200"
      >
        <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-[var(--kh-line)] bg-[var(--kh-card)] px-[22px] py-5">
          <div>
            <div className="font-mono text-[11px] tracking-wider text-[var(--kh-mut)]">
              {ordinal(section.semester).toUpperCase()} SEMESTER
            </div>
            <div className="mt-0.5 font-serif text-[38px] leading-none text-[var(--kh-ink)]">
              {section.name}
            </div>
            <div className="mt-1.5 text-[13px] text-[var(--kh-ink2)]">
              <b className="font-bold text-[var(--kh-have)]">{haveCount} have</b>{" "}
              · <b className="font-bold text-[var(--kh-need)]">{needCount} need</b>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-[var(--kh-line2)] text-[var(--kh-ink2)] cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-[22px]">
          <div
            className="rounded-[14px] border-[1.5px] border-[var(--kh-line2)] p-4"
            style={{
              background:
                "linear-gradient(150deg, var(--kh-paper), var(--kh-paper2))",
            }}
          >
            <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--kh-ink2)]">
              Your response
            </div>
            <div className="mt-[11px] flex gap-[9px]">
              <button
                onClick={() => respond("have")}
                disabled={isPending}
                className="flex-1 rounded-[11px] border-[1.5px] py-3 text-sm font-bold transition-colors cursor-pointer disabled:opacity-60"
                style={
                  preference === "have"
                    ? { background: "var(--kh-have)", borderColor: "var(--kh-have)", color: "#fff" }
                    : { background: "var(--kh-card)", borderColor: "var(--kh-have-line)", color: "var(--kh-have)" }
                }
              >
                ✋ I have it
              </button>
              <button
                onClick={() => respond("need")}
                disabled={isPending}
                className="flex-1 rounded-[11px] border-[1.5px] py-3 text-sm font-bold transition-colors cursor-pointer disabled:opacity-60"
                style={
                  preference === "need"
                    ? { background: "var(--kh-need)", borderColor: "var(--kh-need)", color: "#fff" }
                    : { background: "var(--kh-card)", borderColor: "var(--kh-need-line)", color: "var(--kh-need)" }
                }
              >
                🙏 I need it
              </button>
            </div>
            {preference !== null && (
              <button
                onClick={clearResponse}
                disabled={isPending}
                className="mt-2.5 cursor-pointer bg-transparent text-[12.5px] font-medium text-[var(--kh-mut)] underline disabled:opacity-60"
              >
                Remove my response
              </button>
            )}
          </div>

          <PeopleList
            title="Have this section"
            color="var(--kh-have)"
            people={people.have}
            loading={loading}
            revealed={revealed}
            onReveal={reveal}
            emptyText="Nobody's offering this yet — be the first if you can spare it."
          />
          <PeopleList
            title="Need this section"
            color="var(--kh-need)"
            people={people.need}
            loading={loading}
            revealed={revealed}
            onReveal={reveal}
            emptyText="No takers yet. Post in the swap group to round some up."
          />

          <div className="mt-5 rounded-[10px] border border-[var(--kh-need-line)] bg-[var(--kh-need-bg)] px-3.5 py-3 text-xs leading-relaxed text-[var(--kh-mut)]">
            🔒 Contacts are only visible to signed-in KIIT students. Be decent
            — coordinate the actual swap in the group chat.
          </div>
        </div>
      </div>
    </div>
  );
}

function PeopleList({
  title,
  color,
  people,
  loading,
  revealed,
  onReveal,
  emptyText,
}: {
  title: string;
  color: string;
  people: Person[];
  loading: boolean;
  revealed: Record<string, boolean>;
  onReveal: (id: string) => void;
  emptyText: string;
}) {
  return (
    <div className="mt-[22px]">
      <div className="flex items-center gap-2 text-sm font-bold text-[var(--kh-ink)]">
        <span
          className="h-[9px] w-[9px] rounded-[3px]"
          style={{ background: color }}
        />
        {title}{" "}
        <span className="font-mono text-xs font-normal text-[var(--kh-mut)]">
          ({people.length})
        </span>
      </div>
      <div className="mt-[11px] flex flex-col gap-2">
        {loading ? (
          <div className="py-2.5 text-sm italic text-[var(--kh-mut)]">
            Loading…
          </div>
        ) : people.length === 0 ? (
          <div className="px-0.5 py-2.5 text-[13px] italic text-[var(--kh-mut)]">
            {emptyText}
          </div>
        ) : (
          people.map((p) => {
            const isRevealed = !!revealed[p.id];
            const contact = p.whatsapp_number || p.discord_handle;
            const contactLabel = p.whatsapp_number
              ? "WA"
              : p.discord_handle
                ? "DC"
                : "—";
            return (
              <div
                key={p.id}
                className="flex items-center gap-2.5 rounded-[11px] border border-[var(--kh-line)] bg-[var(--kh-paper)] px-3 py-[9px]"
              >
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                  style={{ background: color }}
                >
                  {(p.full_name || p.email)[0]?.toUpperCase()}
                </div>
                <span className="flex-1 text-sm font-semibold text-[var(--kh-ink)]">
                  {p.full_name || p.email.split("@")[0]}
                </span>
                {isRevealed ? (
                  <span
                    className="font-mono text-[11.5px] font-bold"
                    style={{ color }}
                  >
                    {contact || p.email}
                  </span>
                ) : (
                  <button
                    onClick={() => onReveal(p.id)}
                    className="whitespace-nowrap rounded-[7px] border border-[var(--kh-line2)] px-2.5 py-1 font-mono text-[10.5px] font-bold text-[var(--kh-ink2)] cursor-pointer"
                  >
                    {contactLabel} · reveal
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
