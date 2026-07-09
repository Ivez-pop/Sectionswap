"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/dal";
import type { LinkCategory, Platform } from "@/lib/data/types";
import type { ActionResult } from "./preferences";

export interface CommunityLinkInput {
  name: string;
  platform: Platform;
  url: string;
  visible: boolean;
  category: LinkCategory;
  description: string;
}

async function assertAdmin(): Promise<ActionResult | null> {
  const profile = await getProfile();
  if (!profile) return { ok: false, error: "You must be signed in." };
  if (!profile.is_admin) return { ok: false, error: "Admin access required." };
  return null;
}

function validate(input: CommunityLinkInput): string | null {
  if (!input.name.trim()) return "Community name is required.";
  if (!input.url.trim()) return "Invite link URL is required.";
  try {
    new URL(input.url);
  } catch {
    return "Please enter a valid URL (include http:// or https://).";
  }
  if (input.platform !== "WhatsApp" && input.platform !== "Discord")
    return "Invalid platform.";
  if (input.category !== "General" && input.category !== "Section Swap")
    return "Invalid category.";
  return null;
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addCommunityLink(
  input: CommunityLinkInput,
): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return denied;

  const invalid = validate(input);
  if (invalid) return { ok: false, error: invalid };

  const supabase = await createClient();

  // Query maximum display_order to calculate max(display_order) + 1
  const { data: maxOrderData, error: maxOrderError } = await supabase
    .from("community_links")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1);

  if (maxOrderError) return { ok: false, error: maxOrderError.message };
  const nextOrder = maxOrderData && maxOrderData.length > 0
    ? (maxOrderData[0].display_order ?? 0) + 1
    : 1;

  const { error } = await supabase.from("community_links").insert({
    name: input.name.trim(),
    platform: input.platform,
    url: input.url.trim(),
    visible: input.visible,
    category: input.category,
    description: input.description.trim() || null,
    display_order: nextOrder,
  });
  if (error) return { ok: false, error: error.message };

  revalidate();
  return { ok: true };
}

export async function updateCommunityLink(
  id: number,
  input: CommunityLinkInput,
): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return denied;

  const invalid = validate(input);
  if (invalid) return { ok: false, error: invalid };

  const supabase = await createClient();
  const { error } = await supabase
    .from("community_links")
    .update({
      name: input.name.trim(),
      platform: input.platform,
      url: input.url.trim(),
      visible: input.visible,
      category: input.category,
      description: input.description.trim() || null,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidate();
  return { ok: true };
}

export async function deleteCommunityLink(id: number): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return denied;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("community_links")
    .delete()
    .eq("id", id)
    .select();

  if (error) return { ok: false, error: error.message };
  if (!data || data.length === 0) {
    return {
      ok: false,
      error: "Delete failed. Row not found or blocked by Row Level Security (RLS) policies. Please ensure your user profile has 'is_admin' set to true in the profiles database table.",
    };
  }

  // Renumber remaining links to prevent gaps
  const { data: remaining, error: fetchErr } = await supabase
    .from("community_links")
    .select("id")
    .order("display_order", { ascending: true });

  if (fetchErr) return { ok: false, error: fetchErr.message };

  if (remaining && remaining.length > 0) {
    const updates = remaining.map((link, idx) =>
      supabase
          .from("community_links")
          .update({ display_order: idx + 1 })
          .eq("id", link.id)
    );
    await Promise.all(updates);
  }

  revalidate();
  return { ok: true };
}

export async function toggleCommunityLinkVisibility(
  id: number,
  visible: boolean,
): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return denied;

  const supabase = await createClient();
  const { error } = await supabase
    .from("community_links")
    .update({ visible })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidate();
  return { ok: true };
}

export async function reorderCommunityLink(
  id: number,
  direction: "up" | "down",
): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return denied;

  const supabase = await createClient();

  // Fetch all community links ordered by display_order
  const { data: links, error: fetchErr } = await supabase
    .from("community_links")
    .select("id, display_order")
    .order("display_order", { ascending: true });

  if (fetchErr) return { ok: false, error: fetchErr.message };
  if (!links) return { ok: false, error: "No community links found." };

  const currentIndex = links.findIndex((link) => link.id === id);
  if (currentIndex === -1) return { ok: false, error: "Link not found." };

  let targetIndex = -1;
  if (direction === "up") {
    targetIndex = currentIndex - 1;
  } else if (direction === "down") {
    targetIndex = currentIndex + 1;
  }

  if (targetIndex < 0 || targetIndex >= links.length) {
    return { ok: false, error: "Movement out of bounds." };
  }

  const currentItem = links[currentIndex];
  const targetItem = links[targetIndex];

  const currentOrder = currentItem.display_order;
  const targetOrder = targetItem.display_order;

  // Swap display_order in the database
  const { error: err1 } = await supabase
    .from("community_links")
    .update({ display_order: currentOrder })
    .eq("id", targetItem.id);

  if (err1) return { ok: false, error: err1.message };

  const { error: err2 } = await supabase
    .from("community_links")
    .update({ display_order: targetOrder })
    .eq("id", currentItem.id);

  if (err2) {
    // Attempt rollback
    await supabase
      .from("community_links")
      .update({ display_order: targetOrder })
      .eq("id", targetItem.id);
    return { ok: false, error: err2.message };
  }

  revalidate();
  return { ok: true };
}
