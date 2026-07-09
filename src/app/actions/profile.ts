"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/data/dal";
import type { ActionResult } from "./preferences";

/**
 * Sets the current user's reveal-gated contact handle, shown to matched
 * students in the section detail drawer instead of their raw email.
 */
export async function updateContactInfo(
  whatsappNumber: string,
  discordHandle: string,
): Promise<ActionResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      whatsapp_number: whatsappNumber.trim() || null,
      discord_handle: discordHandle.trim() || null,
    })
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/section-swap");
  return { ok: true };
}
