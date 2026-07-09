export interface CommunityLink {
  id: number;
  name: string;
  platform: "WhatsApp" | "Discord";
  url: string;
  visible: boolean;
  category: "General" | "Section Swap";
  description?: string;
}

// Initial seed data for community links
export const initialCommunityLinks: CommunityLink[] = [
  {
    id: 1,
    name: "Section Swap Group",
    platform: "WhatsApp",
    url: "https://chat.whatsapp.com/Gwq8MfQhkqCBlaj179pLQZ?s=cl&p=a&ilr=0",
    visible: true,
    category: "Section Swap",
    description: "Stay updated with section swaps, announcements, important notices, and connect directly with fellow KIIT students.",
  },
  {
    id: 2,
    name: "Coding Community",
    platform: "Discord",
    url: "https://discord.gg/coding-kiit",
    visible: true,
    category: "General",
    description: "Discuss coding questions, competitive programming, project ideas, hackathons, and collaborate on development projects.",
  },
  {
    id: 3,
    name: "Animeholics",
    platform: "WhatsApp",
    url: "https://chat.whatsapp.com/anime-kiit",
    visible: true,
    category: "General",
    description: "Connect with fellow anime lovers, discuss latest manga chapters, anime releases, and share art.",
  },
  {
    id: 4,
    name: "Cinephiles",
    platform: "WhatsApp",
    url: "https://chat.whatsapp.com/cinephiles-kiit",
    visible: true,
    category: "General",
    description: "A hub for movie buffs to discuss cinematography, latest blockbusters, classics, reviews, and watch parties.",
  },
  {
    id: 5,
    name: "Gaming Community",
    platform: "Discord",
    url: "https://discord.gg/gaming-kiit",
    visible: true,
    category: "General",
    description: "Find players for PC, console, or mobile games, coordinate esports squads, and discuss gaming hardware.",
  },
  {
    id: 6,
    name: "Startup Community",
    platform: "WhatsApp",
    url: "https://chat.whatsapp.com/startup-kiit",
    visible: true,
    category: "General",
    description: "Share pitch decks, brainstorm startup ideas, discuss funding pathways, incubation, and find co-founders.",
  },
  {
    id: 7,
    name: "Photography Club",
    platform: "WhatsApp",
    url: "https://chat.whatsapp.com/photography-kiit",
    visible: true,
    category: "General",
    description: "Share shots, critique compositions, organize photo walks, and share tips about camera gear and editing tools.",
  }
];
