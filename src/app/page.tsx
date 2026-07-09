import HomeDirectory from "@/components/HomeDirectory";
import SiteFooter from "@/components/SiteFooter";
import { getVisibleCommunities } from "@/lib/data/queries";

export default async function Home() {
  const communities = await getVisibleCommunities();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-[1080px] flex-1 px-[22px]">
        <div className="py-10 md:pb-14">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-[560px]">
              <div className="font-mono text-xs uppercase tracking-[.14em] text-[var(--kh-accent)]">
                The Directory
              </div>
              <h1 className="mt-2 font-serif text-[52px] font-normal leading-[1.02] tracking-tight text-[var(--kh-ink)]">
                Find your people.
              </h1>
              <p className="mt-3 text-base leading-relaxed text-[var(--kh-ink2)]">
                Every KIIT group worth joining, in one place — coding grinds,
                film nights, gaming squads, and the all-important
                section-swap crew.
              </p>
            </div>
            <div className="whitespace-nowrap pb-1.5 font-mono text-[13px] text-[var(--kh-mut)]">
              {communities.length} communities
            </div>
          </div>

          <HomeDirectory communities={communities} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
