"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/data/dal";
import type { Preference } from "@/lib/data/types";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

/**
 * Set (or clear, when preference is null) the current user's preference for a
 * section. The 2-"have" limit and ownership are enforced by the database; this
 * action mirrors the ownership check and surfaces friendly errors.
 */
export async function submitPreference(
  sectionId: number,
  preference: Preference | null,
): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const supabase = await createClient();

  if (preference === null) {
    const { error } = await supabase
      .from("swap_preferences")
      .delete()
      .eq("user_id", user.id)
      .eq("section_id", sectionId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from("swap_preferences").upsert(
      { user_id: user.id, section_id: sectionId, preference },
      { onConflict: "user_id,section_id" },
    );
    if (error) {
      // The have-limit trigger raises with a check_violation.
      const friendly = error.message.includes("at most 2")
        ? "You can mark 'Have' for a maximum of 2 sections."
        : error.message;
      return { ok: false, error: friendly };
    }
  }

  revalidatePath("/section-swap");
  return { ok: true };
}
