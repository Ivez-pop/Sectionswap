"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/dal";
import type { ActionResult } from "./preferences";

async function assertAdmin(): Promise<ActionResult | null> {
  const profile = await getProfile();
  if (!profile) return { ok: false, error: "You must be signed in." };
  if (!profile.is_admin)
    return { ok: false, error: "Admin access required." };
  return null;
}

/** Derive a numeric sort order from a trailing number in the name, if any. */
function deriveSortOrder(name: string): number | null {
  const match = name.match(/(\d+)\s*$/);
  return match ? Number.parseInt(match[1], 10) : null;
}

export async function addSection(name: string): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return denied;

  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "Section name cannot be empty." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("sections")
    .insert({ name: trimmed, sort_order: deriveSortOrder(trimmed) });

  if (error) {
    if (error.code === "23505")
      return { ok: false, error: "Section already exists." };
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/section-swap");
  return { ok: true };
}

export async function removeSection(id: number): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return denied;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
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

  revalidatePath("/admin");
  revalidatePath("/section-swap");
  return { ok: true };
}

export async function updateSection(
  id: number,
  name: string,
): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return denied;

  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "Section name cannot be empty." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("sections")
    .update({ name: trimmed, sort_order: deriveSortOrder(trimmed) })
    .eq("id", id);

  if (error) {
    if (error.code === "23505")
      return { ok: false, error: "Section already exists." };
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/section-swap");
  return { ok: true };
}
