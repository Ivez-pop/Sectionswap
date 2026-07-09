import NavbarServer from "@/components/NavbarServer";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import SiteFooter from "@/components/SiteFooter";
import { getSections, getMyPreferences, getVisibleCommunities } from "@/lib/data/queries";

export default async function SectionSwapPage() {
  const [sections, myPreferences, sectionSwapLinks] = await Promise.all([
    getSections(),
    getMyPreferences(),
    getVisibleCommunities("Section Swap"),
  ]);

  const whatsAppCta =
    sectionSwapLinks.find((link) => link.platform === "WhatsApp") ?? null;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/40 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      <NavbarServer />

      <main className="flex-1 flex flex-col justify-center">
        <Hero />
        <WhatsAppCTA link={whatsAppCta} />
        <Dashboard sections={sections} myPreferences={myPreferences} />
      </main>

      <SiteFooter />
    </div>
  );
}
