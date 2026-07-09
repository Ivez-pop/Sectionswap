"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Edit,
  X,
  Check,
  AlertCircle,
  ExternalLink,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
import { addSection, removeSection, updateSection } from "@/app/actions/sections";
import {
  addCommunityLink,
  updateCommunityLink,
  deleteCommunityLink,
  toggleCommunityLinkVisibility,
  reorderCommunityLink,
  type CommunityLinkInput,
} from "@/app/actions/community";
import { ordinal } from "@/lib/utils";
import type {
  CommunityLink,
  LinkCategory,
  Platform,
  Section,
} from "@/lib/data/types";

interface AdminPanelProps {
  sections: Section[];
  links: CommunityLink[];
}

export default function AdminPanel({ sections, links }: AdminPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<"sections" | "links">("sections");

  const semesters = useMemo(() => {
    const set = new Set(sections.map((s) => s.semester));
    return [...set].sort((a, b) => a - b);
  }, [sections]);
  const [adminSemester, setAdminSemester] = useState<number>(semesters[0] ?? 3);

  const [newSectionName, setNewSectionName] = useState("");
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editingSectionName, setEditingSectionName] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formPlatform, setFormPlatform] = useState<Platform>("WhatsApp");
  const [formUrl, setFormUrl] = useState("");
  const [formVisible, setFormVisible] = useState(true);
  const [formCategory, setFormCategory] = useState<LinkCategory>("General");
  const [formDescription, setFormDescription] = useState("");
  const [formError, setFormError] = useState("");

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newSectionName.trim();
    if (!name) {
      toast.error("Section name cannot be empty");
      return;
    }
    startTransition(async () => {
      const result = await addSection(name, adminSemester);
      if (!result.ok) {
        toast.error(result.error ?? "Could not add section.");
        return;
      }
      toast.success(`Section "${name}" added.`);
      setNewSectionName("");
      router.refresh();
    });
  };

  const handleRemoveSection = (id: number) => {
    startTransition(async () => {
      const result = await removeSection(id);
      if (!result.ok) toast.error(result.error ?? "Could not remove section.");
      else {
        toast.success("Section deleted.");
        router.refresh();
      }
    });
  };

  const handleUpdateSection = (id: number) => {
    const name = editingSectionName.trim();
    if (!name) {
      toast.error("Section name cannot be empty");
      return;
    }
    startTransition(async () => {
      const result = await updateSection(id, name);
      if (!result.ok) toast.error(result.error ?? "Could not rename section.");
      else {
        toast.success(`Renamed to "${name}"`);
        setEditingSectionId(null);
        router.refresh();
      }
    });
  };

  const openLinkModal = (link?: CommunityLink) => {
    setFormError("");
    if (link) {
      setEditingLinkId(link.id);
      setFormName(link.name);
      setFormPlatform(link.platform);
      setFormUrl(link.url);
      setFormVisible(link.visible);
      setFormCategory(link.category);
      setFormDescription(link.description ?? "");
    } else {
      setEditingLinkId(null);
      setFormName("");
      setFormPlatform("WhatsApp");
      setFormUrl("");
      setFormVisible(true);
      setFormCategory("General");
      setFormDescription("");
    }
    setIsModalOpen(true);
  };

  const closeLinkModal = () => {
    setIsModalOpen(false);
    setEditingLinkId(null);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!formName.trim()) {
      setFormError("Community name is required");
      return;
    }
    if (!formUrl.trim()) {
      setFormError("Invite link URL is required");
      return;
    }
    const input: CommunityLinkInput = {
      name: formName,
      platform: formPlatform,
      url: formUrl,
      visible: formVisible,
      category: formCategory,
      description: formDescription,
    };
    startTransition(async () => {
      const result =
        editingLinkId !== null
          ? await updateCommunityLink(editingLinkId, input)
          : await addCommunityLink(input);
      if (!result.ok) {
        setFormError(result.error ?? "Could not save link.");
        return;
      }
      toast.success(editingLinkId !== null ? "Link updated." : "Link added.");
      closeLinkModal();
      router.refresh();
    });
  };

  const handleDeleteLink = (id: number) => {
    startTransition(async () => {
      const result = await deleteCommunityLink(id);
      if (!result.ok) toast.error(result.error ?? "Could not delete link.");
      else {
        toast.success("Community link deleted.");
        router.refresh();
      }
    });
  };

  const handleToggleVisibility = (id: number, current: boolean) => {
    startTransition(async () => {
      const result = await toggleCommunityLinkVisibility(id, !current);
      if (!result.ok) toast.error(result.error ?? "Could not update visibility.");
      else router.refresh();
    });
  };

  const handleReorder = (id: number, direction: "up" | "down") => {
    startTransition(async () => {
      const result = await reorderCommunityLink(id, direction);
      if (!result.ok) toast.error(result.error ?? "Could not reorder.");
      else router.refresh();
    });
  };

  const semesterSections = sections.filter((s) => s.semester === adminSemester);

  return (
    <main className="mx-auto w-full max-w-[1080px] flex-1 px-[22px] pb-14 pt-9">
      <div className="flex items-center gap-2.5">
        <span
          className="rounded-[6px] px-[9px] py-1 font-mono text-[11px] uppercase tracking-wider"
          style={{ background: "var(--kh-ink)", color: "var(--kh-paper)" }}
        >
          Admin
        </span>
        <span className="font-mono text-[11px] text-[var(--kh-mut)]">
          changes go live to students instantly
        </span>
      </div>
      <h1 className="mt-2.5 mb-[22px] font-serif text-[42px] font-normal tracking-tight text-[var(--kh-ink)]">
        Manage the Hub
      </h1>

      <div className="mb-[22px] flex gap-1.5 border-b border-[var(--kh-line)]">
        <button
          onClick={() => setTab("sections")}
          className="mr-4 border-b-2 bg-transparent px-1 py-[11px] text-[15px] font-bold cursor-pointer"
          style={{
            color: tab === "sections" ? "var(--kh-ink)" : "var(--kh-mut)",
            borderColor: tab === "sections" ? "var(--kh-accent)" : "transparent",
          }}
        >
          Sections
        </button>
        <button
          onClick={() => setTab("links")}
          className="mr-4 border-b-2 bg-transparent px-1 py-[11px] text-[15px] font-bold cursor-pointer"
          style={{
            color: tab === "links" ? "var(--kh-ink)" : "var(--kh-mut)",
            borderColor: tab === "links" ? "var(--kh-accent)" : "transparent",
          }}
        >
          Community links
        </button>
      </div>

      {tab === "sections" ? (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-[11px] border-[1.5px] border-[var(--kh-line2)] bg-[var(--kh-card)] py-1 pl-3.5 pr-1">
              <span className="font-mono text-[11px] text-[var(--kh-mut)]">SEM</span>
              {semesters.length === 0 && (
                <span className="rounded-lg px-3 py-[7px] font-mono text-xs text-[var(--kh-mut)]">
                  none yet
                </span>
              )}
              {semesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => setAdminSemester(sem)}
                  className="rounded-lg px-3 py-[7px] text-[13px] font-bold cursor-pointer"
                  style={
                    adminSemester === sem
                      ? { background: "var(--kh-ink)", color: "var(--kh-paper)" }
                      : { background: "transparent", color: "var(--kh-ink2)" }
                  }
                >
                  {ordinal(sem)}
                </button>
              ))}
            </div>

            <form onSubmit={handleAddSection} className="flex min-w-[240px] flex-1 gap-2">
              <input
                type="number"
                min={1}
                max={12}
                value={adminSemester}
                onChange={(e) => setAdminSemester(Number(e.target.value) || 1)}
                title="Semester for the new section"
                className="w-[70px] rounded-[11px] border-[1.5px] border-[var(--kh-line2)] bg-[var(--kh-card)] px-2.5 py-[11px] text-sm font-semibold text-[var(--kh-ink)] outline-none focus:border-[var(--kh-accent)]"
              />
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="New section — e.g. CSE 31"
                disabled={isPending}
                className="flex-1 rounded-[11px] border-[1.5px] border-[var(--kh-line2)] bg-[var(--kh-card)] px-3.5 py-[11px] text-sm font-medium text-[var(--kh-ink)] outline-none focus:border-[var(--kh-accent)]"
              />
              <button
                type="submit"
                disabled={isPending}
                className="whitespace-nowrap rounded-[11px] px-[18px] text-sm font-bold text-white shadow-[0_3px_0_var(--kh-accent-d)] cursor-pointer disabled:opacity-60"
                style={{ background: "var(--kh-accent)" }}
              >
                + Add
              </button>
            </form>
          </div>

          <div
            className="grid gap-[9px]"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
          >
            {semesterSections.length === 0 ? (
              <p className="col-span-full py-6 text-center text-xs text-[var(--kh-mut)]">
                No sections in {ordinal(adminSemester)} semester yet.
              </p>
            ) : (
              semesterSections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center gap-2 rounded-[11px] border-[1.5px] border-[var(--kh-line)] bg-[var(--kh-card)] px-[13px] py-[11px]"
                >
                  {editingSectionId === section.id ? (
                    <div className="flex w-full items-center gap-1.5">
                      <input
                        type="text"
                        value={editingSectionName}
                        onChange={(e) => setEditingSectionName(e.target.value)}
                        className="h-7 flex-1 rounded border border-[var(--kh-line2)] bg-[var(--kh-paper)] px-2 text-[11px] text-[var(--kh-ink)] outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdateSection(section.id)}
                        className="rounded p-1 text-[var(--kh-have)] cursor-pointer"
                        title="Save"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingSectionId(null)}
                        className="rounded p-1 text-[var(--kh-mut)] cursor-pointer"
                        title="Cancel"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 truncate text-[15px] font-bold text-[var(--kh-ink)]">
                        {section.name}
                      </span>
                      <button
                        onClick={() => {
                          setEditingSectionId(section.id);
                          setEditingSectionName(section.name);
                        }}
                        className="rounded p-1 text-[var(--kh-mut)] hover:text-[var(--kh-accent)] cursor-pointer"
                        title={`Rename ${section.name}`}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveSection(section.id)}
                        className="rounded p-1 text-[var(--kh-mut)] hover:text-[var(--kh-accent)] cursor-pointer"
                        title={`Remove ${section.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <div className="mb-3.5 flex justify-end">
            <button
              onClick={() => openLinkModal()}
              className="flex items-center gap-1.5 rounded-[11px] px-[18px] py-[11px] text-sm font-bold text-white shadow-[0_3px_0_var(--kh-accent-d)] cursor-pointer"
              style={{ background: "var(--kh-accent)" }}
            >
              <Plus className="h-4 w-4" />
              Add community
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {links.length === 0 ? (
              <p className="py-8 text-center text-xs text-[var(--kh-mut)]">
                No community links configured. Click &ldquo;Add community&rdquo; to
                create one.
              </p>
            ) : (
              links.map((link, index) => (
                <div
                  key={link.id}
                  className="flex items-center gap-3 rounded-[13px] border-[1.5px] border-[var(--kh-line)] bg-[var(--kh-card)] px-3.5 py-3"
                  style={{ opacity: link.visible ? 1 : 0.55 }}
                >
                  <div
                    className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] font-mono text-xs font-extrabold text-white"
                    style={{
                      background:
                        link.platform === "WhatsApp" ? "var(--kh-wa)" : "var(--kh-dc)",
                    }}
                  >
                    {link.platform === "WhatsApp" ? "WA" : "DC"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-bold text-[var(--kh-ink)]">
                      {link.name}
                    </div>
                    <div className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--kh-mut)]">
                      {link.platform} · {link.category}
                    </div>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden max-w-[140px] items-center gap-1 truncate text-xs text-[var(--kh-mut)] hover:text-[var(--kh-accent)] sm:flex"
                  >
                    <span className="truncate">{link.url}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleReorder(link.id, "up")}
                      disabled={isPending || index === 0}
                      className="rounded-lg border border-[var(--kh-line2)] p-1.5 text-[var(--kh-ink2)] cursor-pointer disabled:opacity-20"
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleReorder(link.id, "down")}
                      disabled={isPending || index === links.length - 1}
                      className="rounded-lg border border-[var(--kh-line2)] p-1.5 text-[var(--kh-ink2)] cursor-pointer disabled:opacity-20"
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleToggleVisibility(link.id, link.visible)}
                    className="whitespace-nowrap rounded-[9px] px-3 py-[7px] text-xs font-bold cursor-pointer"
                    style={
                      link.visible
                        ? { background: "var(--kh-have-bg)", color: "var(--kh-have)", border: "1px solid var(--kh-have-line)" }
                        : { color: "var(--kh-mut)", border: "1px solid var(--kh-line2)" }
                    }
                  >
                    {link.visible ? "👁 Visible" : "🚫 Hidden"}
                  </button>
                  <button
                    onClick={() => openLinkModal(link)}
                    className="rounded-lg border border-[var(--kh-line2)] p-1.5 text-[var(--kh-ink2)] cursor-pointer"
                    title="Edit"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="rounded-lg border border-[var(--kh-line2)] p-1.5 text-[var(--kh-accent)] cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(44,40,34,.4)] p-4 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={closeLinkModal} />
          <form
            onSubmit={handleSaveLink}
            className="relative w-full max-w-md space-y-5 rounded-2xl border-[1.5px] border-[var(--kh-line2)] bg-[var(--kh-card)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-[var(--kh-line)] pb-3">
              <h3 className="font-serif text-2xl text-[var(--kh-ink)]">
                {editingLinkId !== null ? "Edit community link" : "Add community link"}
              </h3>
              <button
                type="button"
                onClick={closeLinkModal}
                className="rounded-lg p-1.5 text-[var(--kh-mut)] hover:text-[var(--kh-ink)] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-1.5 rounded-xl border border-[var(--kh-need-line)] bg-[var(--kh-need-bg)] px-3 py-2 text-xs text-[var(--kh-need)]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4">
              <Field label="Community name">
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. KIIT Hub Discord Community"
                  className="w-full rounded-xl border-[1.5px] border-[var(--kh-line2)] bg-[var(--kh-paper)] px-3 py-2.5 text-sm text-[var(--kh-ink)] outline-none focus:border-[var(--kh-accent)]"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Platform">
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value as Platform)}
                    className="w-full rounded-xl border-[1.5px] border-[var(--kh-line2)] bg-[var(--kh-paper)] px-3 py-2.5 text-sm text-[var(--kh-ink)] outline-none focus:border-[var(--kh-accent)]"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Discord">Discord</option>
                  </select>
                </Field>
                <Field label="Category">
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as LinkCategory)}
                    className="w-full rounded-xl border-[1.5px] border-[var(--kh-line2)] bg-[var(--kh-paper)] px-3 py-2.5 text-sm text-[var(--kh-ink)] outline-none focus:border-[var(--kh-accent)]"
                  >
                    <option value="General">General</option>
                    <option value="Section Swap">Section Swap</option>
                  </select>
                </Field>
              </div>

              <Field label="Visible">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={formVisible}
                    onChange={(e) => setFormVisible(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div
                    className="h-5 w-9 rounded-full transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"
                    style={{ background: formVisible ? "var(--kh-accent)" : "var(--kh-line2)" }}
                  />
                  <span className="ml-2 text-xs font-medium text-[var(--kh-ink2)]">
                    {formVisible ? "Visible" : "Hidden"}
                  </span>
                </label>
              </Field>

              <Field label="Invite link URL">
                <input
                  type="text"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://chat.whatsapp.com/... or https://discord.gg/..."
                  className="w-full rounded-xl border-[1.5px] border-[var(--kh-line2)] bg-[var(--kh-paper)] px-3 py-2.5 text-sm text-[var(--kh-ink)] outline-none focus:border-[var(--kh-accent)]"
                />
              </Field>

              <Field label="Description (optional)">
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="A short description of this community…"
                  className="h-20 w-full resize-none rounded-xl border-[1.5px] border-[var(--kh-line2)] bg-[var(--kh-paper)] p-3 text-sm text-[var(--kh-ink)] outline-none focus:border-[var(--kh-accent)]"
                />
              </Field>
            </div>

            <div className="flex justify-end gap-2 border-t border-[var(--kh-line)] pt-3">
              <button
                type="button"
                onClick={closeLinkModal}
                className="rounded-xl border-[1.5px] border-[var(--kh-line2)] px-4 py-2.5 text-xs font-semibold text-[var(--kh-ink2)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-[0_3px_0_var(--kh-accent-d)] cursor-pointer disabled:opacity-60"
                style={{ background: "var(--kh-accent)" }}
              >
                {isPending ? "Saving…" : "Save link"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[var(--kh-mut)]">
        {label}
      </label>
      {children}
    </div>
  );
}
