export type Platform = "WhatsApp" | "Discord";
export type LinkCategory = "General" | "Section Swap";
export type Preference = "have" | "need";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  whatsapp_number: string | null;
  discord_handle: string | null;
}

export interface Section {
  id: number;
  name: string;
  sort_order: number | null;
  semester: number;
}

export interface CommunityLink {
  id: number;
  name: string;
  platform: Platform;
  url: string;
  visible: boolean;
  category: LinkCategory;
  description: string | null;
  display_order: number;
}

export interface Person {
  id: string;
  full_name: string | null;
  email: string;
  whatsapp_number: string | null;
  discord_handle: string | null;
}

export interface SectionPeople {
  have: Person[];
  need: Person[];
}
