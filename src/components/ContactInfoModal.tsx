"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { updateContactInfo } from "@/app/actions/profile";

/** Mounted only while open (see Navbar), so local state always starts fresh. */
export default function ContactInfoModal({
  onClose,
  whatsappNumber,
  discordHandle,
}: {
  onClose: () => void;
  whatsappNumber: string | null;
  discordHandle: string | null;
}) {
  const [whatsapp, setWhatsapp] = useState(whatsappNumber ?? "");
  const [discord, setDiscord] = useState(discordHandle ?? "");
  const [isPending, startTransition] = useTransition();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateContactInfo(whatsapp, discord);
      if (!result.ok) {
        toast.error(result.error ?? "Could not save contact info.");
        return;
      }
      toast.success("Contact info saved.");
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[rgba(44,40,34,.4)] backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <form
        onSubmit={handleSave}
        className="relative w-full max-w-sm rounded-2xl border border-[var(--kh-line2)] bg-[var(--kh-card)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl text-[var(--kh-ink)]">Your contact info</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--kh-mut)] hover:text-[var(--kh-ink)] cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--kh-ink2)]">
          Shown to fellow KIIT students only when they tap &ldquo;reveal&rdquo; on your
          name in a section you&rsquo;ve responded to.
        </p>

        <div className="mt-5 space-y-3.5">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[var(--kh-mut)]">
              WhatsApp number
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+91 90000 00000"
              disabled={isPending}
              className="w-full rounded-xl border border-[var(--kh-line2)] bg-[var(--kh-paper)] px-3.5 py-2.5 text-sm text-[var(--kh-ink)] outline-none placeholder:text-[var(--kh-mut)] focus:border-[var(--kh-accent)]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[var(--kh-mut)]">
              Discord handle
            </label>
            <input
              type="text"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              placeholder="@yourhandle"
              disabled={isPending}
              className="w-full rounded-xl border border-[var(--kh-line2)] bg-[var(--kh-paper)] px-3.5 py-2.5 text-sm text-[var(--kh-ink)] outline-none placeholder:text-[var(--kh-mut)] focus:border-[var(--kh-accent)]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-xl bg-[var(--kh-accent)] py-3 text-sm font-bold text-white shadow-[0_3px_0_var(--kh-accent-d)] transition-transform disabled:opacity-60 cursor-pointer"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
