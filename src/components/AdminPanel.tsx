"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Edit,
  Layers,
  Globe,
  X,
  Check,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addSection, removeSection, updateSection } from "@/app/actions/sections";
import {
  addCommunityLink,
  updateCommunityLink,
  deleteCommunityLink,
  toggleCommunityLinkVisibility,
  type CommunityLinkInput,
} from "@/app/actions/community";
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

  // Section form state
  const [newSectionName, setNewSectionName] = useState("");
  const [sectionError, setSectionError] = useState("");
  const [sectionSuccess, setSectionSuccess] = useState("");

  // Section editing inline state
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editingSectionName, setEditingSectionName] = useState("");

  // Link modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formPlatform, setFormPlatform] = useState<Platform>("WhatsApp");
  const [formUrl, setFormUrl] = useState("");
  const [formVisible, setFormVisible] = useState(true);
  const [formCategory, setFormCategory] = useState<LinkCategory>("General");
  const [formDescription, setFormDescription] = useState("");
  const [formError, setFormError] = useState("");

  // Handler to add a new section
  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    setSectionError("");
    setSectionSuccess("");
    if (!newSectionName.trim()) {
      setSectionError("Section name cannot be empty");
      toast.error("Section name cannot be empty");
      return;
    }
    const name = newSectionName.trim();
    startTransition(async () => {
      try {
        const result = await addSection(name);
        if (!result.ok) {
          const errMsg = result.error ?? "Could not add section.";
          setSectionError(errMsg);
          toast.error(errMsg);
          return;
        }
        setSectionSuccess(`Section "${name}" added successfully!`);
        toast.success(`Section "${name}" added successfully`);
        setNewSectionName("");
        router.refresh();
        setTimeout(() => setSectionSuccess(""), 3000);
      } catch (err: any) {
        console.error("Add section failed:", err);
        const errMsg = err?.message || "An unexpected error occurred.";
        setSectionError(errMsg);
        toast.error(errMsg);
      }
    });
  };

  // Handler to remove an existing section
  const handleRemoveSection = (id: number, name: string) => {
    startTransition(async () => {
      try {
        const result = await removeSection(id);
        if (!result.ok) {
          const errMsg = result.error ?? "Could not remove section.";
          toast.error(errMsg);
        } else {
          toast.success("Section deleted.");
          router.refresh();
        }
      } catch (err: any) {
        console.error("Remove section failed:", err);
        toast.error(err?.message || "An unexpected error occurred.");
      }
    });
  };

  // Handler to update/rename a section inline
  const handleUpdateSection = (id: number) => {
    if (!editingSectionName.trim()) {
      toast.error("Section name cannot be empty");
      return;
    }
    const name = editingSectionName.trim();
    startTransition(async () => {
      try {
        const result = await updateSection(id, name);
        if (!result.ok) {
          const errMsg = result.error ?? "Could not rename section.";
          toast.error(errMsg);
        } else {
          toast.success(`Renamed section to "${name}"`);
          setEditingSectionId(null);
          setEditingSectionName("");
          router.refresh();
        }
      } catch (err: any) {
        console.error("Update section failed:", err);
        toast.error(err?.message || "An unexpected error occurred.");
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

  // Handler to save (create or update) a community link
  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim()) {
      setFormError("Community name is required");
      toast.error("Community name is required");
      return;
    }
    if (!formUrl.trim()) {
      setFormError("Invite link URL is required");
      toast.error("Invite link URL is required");
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
      try {
        const result =
          editingLinkId !== null
            ? await updateCommunityLink(editingLinkId, input)
            : await addCommunityLink(input);
        
        if (!result.ok) {
          const errMsg = result.error ?? "Could not save link.";
          setFormError(errMsg);
          toast.error(errMsg);
          return;
        }
        
        toast.success(editingLinkId !== null ? "Link updated successfully" : "Link added successfully");
        closeLinkModal();
        router.refresh();
      } catch (err: any) {
        console.error("Save link failed:", err);
        const errMsg = err?.message || "An unexpected error occurred.";
        setFormError(errMsg);
        toast.error(errMsg);
      }
    });
  };

  // Handler to delete a community link
  const handleDeleteLink = (id: number) => {
    startTransition(async () => {
      try {
        const result = await deleteCommunityLink(id);
        if (!result.ok) {
          const errMsg = result.error ?? "Could not delete link.";
          toast.error(errMsg);
        } else {
          toast.success("Community link deleted.");
          router.refresh();
        }
      } catch (err: any) {
        console.error("Delete link failed:", err);
        toast.error(err?.message || "An unexpected error occurred.");
      }
    });
  };

  // Handler to toggle community link visibility directly from the table
  const handleToggleLinkVisibility = (id: number, currentVisible: boolean) => {
    const nextVisible = !currentVisible;
    startTransition(async () => {
      try {
        const result = await toggleCommunityLinkVisibility(id, nextVisible);
        if (!result.ok) {
          const errMsg = result.error ?? "Could not update visibility.";
          toast.error(errMsg);
        } else {
          toast.success(nextVisible ? "Link is now visible" : "Link is now hidden");
          router.refresh();
        }
      } catch (err: any) {
        console.error("Toggle visibility failed:", err);
        toast.error(err?.message || "An unexpected error occurred.");
      }
    });
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 space-y-10">
      {/* Title Header */}
      <div className="border-b border-zinc-200/60 pb-6 dark:border-zinc-800/60">
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
          Manage website content. Changes are saved to the database instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section Management */}
        <div className="lg:col-span-1 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Section Management
            </h2>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6">
            Create, update, or remove student sections. Updates reflect on the
            student section grid immediately.
          </p>

          <form onSubmit={handleAddSection} className="space-y-3 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                Section Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="e.g. CSE 50"
                  disabled={isPending}
                  className="flex-1 h-9 px-3 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200"
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-9 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm border-0 cursor-pointer shrink-0 flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
            </div>

            {sectionError && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 animate-in fade-in duration-200">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{sectionError}</span>
              </div>
            )}
            {sectionSuccess && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-200">
                <Check className="h-3.5 w-3.5 shrink-0" />
                <span>{sectionSuccess}</span>
              </div>
            )}
          </form>

          <div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Active Sections
              </span>
              <span className="text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full text-zinc-500">
                {sections.length} Total
              </span>
            </div>

            <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-900 dark:bg-zinc-900/10">
              {sections.length === 0 ? (
                <p className="text-xs text-center text-zinc-400 py-6">
                  No active sections. Use the form above to add sections.
                </p>
              ) : (
                <div className="max-h-72 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center justify-between bg-white border border-zinc-200/80 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-800 shadow-sm dark:bg-zinc-950 dark:border-zinc-900 dark:text-zinc-300 transition-colors gap-2"
                    >
                      {editingSectionId === section.id ? (
                        <div className="flex items-center gap-1.5 w-full">
                          <input
                            type="text"
                            value={editingSectionName}
                            onChange={(e) => setEditingSectionName(e.target.value)}
                            className="flex-1 h-7 px-2 rounded border border-zinc-200 bg-white text-[11px] text-zinc-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                            placeholder="Rename..."
                            disabled={isPending}
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateSection(section.id)}
                            disabled={isPending}
                            className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all cursor-pointer disabled:opacity-50"
                            title="Save rename"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingSectionId(null);
                              setEditingSectionName("");
                            }}
                            disabled={isPending}
                            className="p-1 rounded text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer disabled:opacity-50"
                            title="Cancel rename"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="truncate">{section.name}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setEditingSectionId(section.id);
                                setEditingSectionName(section.name);
                              }}
                              disabled={isPending}
                              className="p-1 rounded text-zinc-400 hover:text-blue-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer disabled:opacity-50"
                              title={`Rename ${section.name}`}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                handleRemoveSection(section.id, section.name)
                              }
                              disabled={isPending}
                              className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer disabled:opacity-50"
                              title={`Remove ${section.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Community Links Management */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Community Links
              </h2>
            </div>
            <Button
              onClick={() => openLinkModal()}
              className="h-9 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm border-0 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Add Community Link
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/20 dark:bg-transparent">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 dark:border-zinc-900 dark:bg-zinc-900/30">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Name</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Platform</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Category</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">URL</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-center">Visible</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {links.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-xs text-zinc-400">
                      No community links configured. Click &ldquo;Add Community
                      Link&rdquo; to create one.
                    </td>
                  </tr>
                ) : (
                  links.map((link) => (
                    <tr
                      key={link.id}
                      className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-xs font-semibold text-zinc-900 dark:text-zinc-200 border-b-0">
                        {link.name}
                      </td>
                      <td className="px-4 py-3.5 border-b-0">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            link.platform === "WhatsApp"
                              ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
                              : "bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {link.platform}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 border-b-0">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            link.category === "Section Swap"
                              ? "bg-purple-50 border-purple-100 text-purple-700 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-400"
                              : "bg-zinc-100 border-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {link.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-zinc-500 dark:text-zinc-400 max-w-[160px] truncate border-b-0">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span className="truncate">{link.url}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </td>
                      <td className="px-4 py-3.5 text-center border-b-0">
                        <button
                          onClick={() => handleToggleLinkVisibility(link.id, link.visible)}
                          disabled={isPending}
                          className="inline-flex items-center text-xs font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer bg-transparent border-0 disabled:opacity-50"
                          title={`Toggle visibility to ${link.visible ? "hidden" : "visible"}`}
                        >
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full border ${
                              link.visible
                                ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
                                : "bg-zinc-50 border-zinc-100 text-zinc-500 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400"
                            }`}
                          >
                            {link.visible ? "Visible" : "Hidden"}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-right border-b-0">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openLinkModal(link)}
                            disabled={isPending}
                            className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-colors text-zinc-500 cursor-pointer disabled:opacity-50"
                            title="Edit link"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            disabled={isPending}
                            className="p-1.5 rounded-lg border border-red-200/80 hover:bg-red-50 hover:text-red-600 dark:border-red-950/40 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors text-red-500 cursor-pointer disabled:opacity-50"
                            title="Delete link"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Link Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute inset-0" onClick={closeLinkModal} />

          <form
            onSubmit={handleSaveLink}
            className="relative w-full max-w-md transform rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl transition-all dark:border-zinc-800 dark:bg-zinc-950 animate-in fade-in zoom-in-95 duration-200 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-900">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                {editingLinkId !== null ? "Edit Community Link" : "Add Community Link"}
              </h3>
              <button
                type="button"
                onClick={closeLinkModal}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors dark:hover:bg-zinc-900 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-1.5 py-2 px-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Community Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (formError) setFormError("");
                  }}
                  disabled={isPending}
                  placeholder="e.g. KIIT Hub Discord Community"
                  className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                    Platform
                  </label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value as Platform)}
                    disabled={isPending}
                    className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Discord">Discord</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as LinkCategory)}
                    disabled={isPending}
                    className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200"
                  >
                    <option value="General">General</option>
                    <option value="Section Swap">Section Swap</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Visible
                </label>
                <div className="flex h-10 items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formVisible}
                      onChange={(e) => setFormVisible(e.target.checked)}
                      disabled={isPending}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600" />
                    <span className="ml-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {formVisible ? "Visible" : "Hidden"}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Invite Link URL
                </label>
                <input
                  type="text"
                  value={formUrl}
                  onChange={(e) => {
                    setFormUrl(e.target.value);
                    if (formError) setFormError("");
                  }}
                  disabled={isPending}
                  placeholder="https://chat.whatsapp.com/... or https://discord.gg/..."
                  className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  disabled={isPending}
                  placeholder="A short description of this community..."
                  className="w-full h-20 p-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-900">
              <button
                type="button"
                onClick={closeLinkModal}
                disabled={isPending}
                className="h-9 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-600 transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm border-0 cursor-pointer flex items-center justify-center"
              >
                {isPending ? "Saving..." : "Save Link"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
