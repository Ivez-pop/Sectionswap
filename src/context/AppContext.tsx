"use client";

import React, { createContext, useContext, useState } from "react";
import { initialSections } from "@/lib/sections";
import { initialCommunityLinks, CommunityLink } from "@/lib/communityLinks";

interface AppContextType {
  sections: string[];
  addSection: (name: string) => boolean;
  removeSection: (name: string) => void;
  communityLinks: CommunityLink[];
  addCommunityLink: (link: Omit<CommunityLink, "id">) => void;
  updateCommunityLink: (id: number, link: Partial<CommunityLink>) => void;
  deleteCommunityLink: (id: number) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<string[]>(initialSections);
  const [communityLinks, setCommunityLinks] = useState<CommunityLink[]>(initialCommunityLinks);
  const [isAdmin, setIsAdmin] = useState(true); // Default control access set to true

  const addSection = (name: string): boolean => {
    const formatted = name.trim();
    if (formatted && !sections.includes(formatted)) {
      setSections((prev) => {
        // Keep them sorted nicely by comparing Section names (e.g. CSE 1, CSE 2)
        const newSections = [...prev, formatted];
        return newSections.sort((a, b) => {
          const numA = parseInt(a.replace(/^\D+/g, ""), 10);
          const numB = parseInt(b.replace(/^\D+/g, ""), 10);
          if (isNaN(numA) || isNaN(numB)) return a.localeCompare(b);
          return numA - numB;
        });
      });
      return true;
    }
    return false;
  };

  const removeSection = (name: string) => {
    setSections((prev) => prev.filter((s) => s !== name));
  };

  const addCommunityLink = (link: Omit<CommunityLink, "id">) => {
    const newLink: CommunityLink = {
      ...link,
      id: Date.now(),
    };
    setCommunityLinks((prev) => [...prev, newLink]);
  };

  const updateCommunityLink = (id: number, updatedFields: Partial<CommunityLink>) => {
    setCommunityLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, ...updatedFields } : link))
    );
  };

  const deleteCommunityLink = (id: number) => {
    setCommunityLinks((prev) => prev.filter((link) => link.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        sections,
        addSection,
        removeSection,
        communityLinks,
        addCommunityLink,
        updateCommunityLink,
        deleteCommunityLink,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
