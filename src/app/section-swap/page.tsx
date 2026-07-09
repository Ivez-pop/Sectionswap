import SectionSwapView from "@/components/SectionSwapView";
import SiteFooter from "@/components/SiteFooter";
import {
  getSections,
  getMyPreferences,
  getPreferenceCounts,
  getVisibleCommunities,
} from "@/lib/data/queries";

export default async function SectionSwapPage() {
  const [sections, myPreferences, counts, sectionSwapLinks] = await Promise.all([
    getSections(),
    getMyPreferences(),
    getPreferenceCounts(),
    getVisibleCommunities("Section Swap"),
  ]);

  const whatsAppCta =
    sectionSwapLinks.find((link) => link.platform === "WhatsApp") ?? null;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-[1080px] flex-1 px-[22px]">
        <SectionSwapView
          sections={sections}
          myPreferences={myPreferences}
          counts={counts}
          whatsAppCta={whatsAppCta}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
