export type Platform = "WhatsApp" | "Discord";
export type LinkCategory = "General" | "Section Swap";
export type Preference = "have" | "need";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
}

export interface Section {
  id: number;
  name: string;
  sort_order: number | null;
}

export interface CommunityLink {
  id: number;
  name: string;
  platform: Platform;
  url: string;
  visible: boolean;
  category: LinkCategory;
  description: string | null;
}

export interface Person {
  id: string;
  full_name: string | null;
  email: string;
}

export interface SectionPeople {
  have: Person[];
  need: Person[];
}
