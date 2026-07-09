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
  const { error } = await supabase.from("community_links").insert({
    name: input.name.trim(),
    platform: input.platform,
    url: input.url.trim(),
    visible: input.visible,
    category: input.category,
    description: input.description.trim() || null,
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
  const { error } = await supabase
    .from("community_links")
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidate();
  return { ok: true };
}
