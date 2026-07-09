import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "./types";

/**
 * Data Access Layer. Centralizes session verification and authorization so
 * every data path performs the check in one place (see the Next.js
 * authentication guide). `cache` memoizes each call for a single render pass.
 */

/** The authenticated Supabase user, verified against the auth server. */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** The current user's profile row, or null if unauthenticated. */
export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, is_admin, whatsapp_number, discord_handle")
    .eq("id", user.id)
    .single();

  return (data as Profile) ?? null;
});

/** Require a session; redirect to /login otherwise. Returns the profile. */
export const requireUser = cache(async (): Promise<Profile> => {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  return profile;
});

/** Require an admin; redirect non-admins away. Returns the profile. */
export const requireAdmin = cache(async (): Promise<Profile> => {
  const profile = await requireUser();
  if (!profile.is_admin) redirect("/");
  return profile;
});
