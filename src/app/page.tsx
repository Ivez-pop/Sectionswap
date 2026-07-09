import CommunityDirectory from "@/components/CommunityDirectory";
import SocializBadge from "@/components/SocializBadge";
import SiteFooter from "@/components/SiteFooter";
import { getVisibleCommunities } from "@/lib/data/queries";

export default async function Home() {
  const communities = await getVisibleCommunities("General");

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/40 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col justify-start">
        {/* Banner Hero Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3.5 mb-4">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              KIIT Hub Community
            </h1>
            <div className="flex justify-center pt-2">
              <SocializBadge size="sm" />
            </div>
          </div>
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed pt-2">
            Find and join your favorite interest groups at KIIT. Connect directly
            with students sharing similar passions.
          </p>
        </div>

        <CommunityDirectory communities={communities} />
      </main>

      <SiteFooter />
    </div>
  );
}
