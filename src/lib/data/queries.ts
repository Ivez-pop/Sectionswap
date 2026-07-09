import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "./dal";
import type {
  CommunityLink,
  LinkCategory,
  Preference,
  Section,
  SectionPeople,
} from "./types";

export async function getSections(): Promise<Section[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .select("id, name, sort_order")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });

  if (error) throw error;
  return (data as Section[]) ?? [];
}

export async function getCommunityLinks(): Promise<CommunityLink[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("community_links")
    .select("id, name, platform, url, visible, category, description, display_order")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data as CommunityLink[]) ?? [];
}

export async function getVisibleCommunities(
  category: LinkCategory,
): Promise<CommunityLink[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("community_links")
    .select("id, name, platform, url, visible, category, description, display_order")
    .eq("visible", true)
    .eq("category", category)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data as CommunityLink[]) ?? [];
}

/** Map of section_id -> the current user's preference for that section. */
export async function getMyPreferences(): Promise<Record<number, Preference>> {
  const user = await getUser();
  if (!user) return {};

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("swap_preferences")
    .select("section_id, preference")
    .eq("user_id", user.id);

  if (error) throw error;

  const map: Record<number, Preference> = {};
  for (const row of data ?? []) {
    map[row.section_id as number] = row.preference as Preference;
  }
  return map;
}

/** Students who have / need a given section (People modal). */
export async function getPeopleForSection(
  sectionId: number,
): Promise<SectionPeople> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("swap_preferences")
    .select("preference, profile:profiles(id, full_name, email)")
    .eq("section_id", sectionId);

  if (error) throw error;

  const result: SectionPeople = { have: [], need: [] };
  for (const row of data ?? []) {
    const profile = row.profile as unknown as {
      id: string;
      full_name: string | null;
      email: string;
    } | null;
    if (!profile) continue;
    if (row.preference === "have") result.have.push(profile);
    else if (row.preference === "need") result.need.push(profile);
  }
  return result;
}
