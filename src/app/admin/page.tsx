"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useApp } from "@/context/AppContext";
import { CommunityLink } from "@/lib/communityLinks";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Layers, 
  Globe, 
  X, 
  Check, 
  AlertCircle,
  ExternalLink 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const { 
    sections, 
    addSection, 
    removeSection, 
    communityLinks, 
    addCommunityLink, 
    updateCommunityLink, 
    deleteCommunityLink 
  } = useApp();

  // Section State
  const [newSectionName, setNewSectionName] = useState("");
  const [sectionError, setSectionError] = useState("");
  const [sectionSuccess, setSectionSuccess] = useState("");

  // Link Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
  
  // Link Form States
  const [formName, setFormName] = useState("");
  const [formPlatform, setFormPlatform] = useState<"WhatsApp" | "Discord">("WhatsApp");
  const [formUrl, setFormUrl] = useState("");
  const [formVisible, setFormVisible] = useState(true);
  const [formCategory, setFormCategory] = useState<"General" | "Section Swap">("General");
  const [formDescription, setFormDescription] = useState("");
  const [formError, setFormError] = useState("");

  // Handle Section Add
  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    setSectionError("");
    setSectionSuccess("");

    if (!newSectionName.trim()) {
      setSectionError("Section name cannot be empty");
      return;
    }

    const success = addSection(newSectionName);
    if (success) {
      setSectionSuccess(`Section "${newSectionName}" added successfully!`);
      setNewSectionName("");
      setTimeout(() => setSectionSuccess(""), 3000);
    } else {
      setSectionError("Section already exists or is invalid");
    }
  };

  // Open Link Modal (for add or edit)
  const openLinkModal = (link?: CommunityLink) => {
    setFormError("");
    if (link) {
      setEditingLinkId(link.id);
      setFormName(link.name);
      setFormPlatform(link.platform);
      setFormUrl(link.url);
      setFormVisible(link.visible);
      setFormCategory(link.category);
      setFormDescription(link.description || "");
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

  // Close Link Modal
  const closeLinkModal = () => {
    setIsModalOpen(false);
    setEditingLinkId(null);
  };

  // Handle Link Form Save
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
    
    // Quick URL validation
    try {
      new URL(formUrl);
    } catch {
      setFormError("Please enter a valid URL (include http:// or https://)");
      return;
    }

    if (editingLinkId !== null) {
      updateCommunityLink(editingLinkId, {
        name: formName,
        platform: formPlatform,
        url: formUrl,
        visible: formVisible,
        category: formCategory,
        description: formDescription,
      });
    } else {
      addCommunityLink({
        name: formName,
        platform: formPlatform,
        url: formUrl,
        visible: formVisible,
        category: formCategory,
        description: formDescription,
      });
    }

    closeLinkModal();
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/40 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 space-y-10">
        
        {/* Title Header */}
        <div className="border-b border-zinc-200/60 pb-6 dark:border-zinc-800/60">
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
            Manage website content without modifying the code.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Section Management (Span 1) */}
          <div className="lg:col-span-1 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Section Management
              </h2>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-6">
              Create new sections or clean up legacy ones. Real-time updates reflect on the student section grid immediately.
            </p>

            {/* Add Section Form */}
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
                    className="flex-1 h-9 px-3 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200"
                  />
                  <Button
                    type="submit"
                    className="h-9 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm border-0 cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Feedbacks */}
              {sectionError && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{sectionError}</span>
                </div>
              )}
              {sectionSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  <span>{sectionSuccess}</span>
                </div>
              )}
            </form>

            {/* List of active sections */}
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
                        key={section}
                        className="flex items-center justify-between bg-white border border-zinc-200/80 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-800 shadow-sm dark:bg-zinc-950 dark:border-zinc-900 dark:text-zinc-300 transition-colors"
                      >
                        <span>{section}</span>
                        <button
                          onClick={() => removeSection(section)}
                          className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
                          title={`Remove ${section}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Column 2: Community Links Management (Span 2) */}
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

            {/* Table Area */}
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
                  {communityLinks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-xs text-zinc-400">
                        No community links configured. Click &ldquo;Add Community Link&rdquo; to create one.
                      </td>
                    </tr>
                  ) : (
                    communityLinks.map((link) => (
                      <tr 
                        key={link.id}
                        className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors"
                      >
                        <td className="px-4 py-3.5 text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                          {link.name}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            link.platform === "WhatsApp"
                              ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
                              : "bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400"
                          }`}>
                            {link.platform}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            link.category === "Section Swap"
                              ? "bg-purple-50 border-purple-100 text-purple-700 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-400"
                              : "bg-zinc-100 border-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
                          }`}>
                            {link.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-zinc-500 dark:text-zinc-400 max-w-[160px] truncate">
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
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-flex items-center text-xs font-bold ${
                            link.visible 
                              ? "text-emerald-600 dark:text-emerald-400" 
                              : "text-zinc-400 dark:text-zinc-600"
                          }`}>
                            {link.visible ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openLinkModal(link)}
                              className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-colors text-zinc-500 cursor-pointer"
                              title="Edit link"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => deleteCommunityLink(link.id)}
                              className="p-1.5 rounded-lg border border-red-200/80 hover:bg-red-50 hover:text-red-600 dark:border-red-950/40 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors text-red-500 cursor-pointer"
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

      </main>

      {/* Modal - Add / Edit Community Link */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute inset-0" onClick={closeLinkModal} />
          
          <form 
            onSubmit={handleSaveLink}
            className="relative w-full max-w-md transform rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl transition-all dark:border-zinc-800 dark:bg-zinc-950 animate-in fade-in zoom-in-95 duration-200 space-y-5"
          >
            {/* Header */}
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

            {/* Error Message */}
            {formError && (
              <div className="flex items-center gap-1.5 py-2 px-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Community Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
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
                    onChange={(e) => setFormPlatform(e.target.value as "WhatsApp" | "Discord")}
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
                    onChange={(e) => setFormCategory(e.target.value as "General" | "Section Swap")}
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
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
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
                  onChange={(e) => setFormUrl(e.target.value)}
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
                  placeholder="A short description of this community..."
                  className="w-full h-20 p-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-900">
              <button
                type="button"
                onClick={closeLinkModal}
                className="h-9 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-600 transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="submit"
                className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm border-0 cursor-pointer"
              >
                Save Link
              </Button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}
