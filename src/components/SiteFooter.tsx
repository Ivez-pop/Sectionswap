import Logo from "@/components/Logo";
import SocializBadge from "@/components/SocializBadge";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--kh-line)]">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-4 px-[22px] py-[22px]">
        <div className="flex items-center gap-2.5">
          <Logo size="xs" />
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-[var(--kh-mut)]">
              KIIT Hub —{" "}
              <span className="font-serif text-[15px] italic text-[var(--kh-ink2)]">
                made for KIITians, by KIITians
              </span>
            </span>
            <SocializBadge size="xs" />
          </div>
        </div>
        <div className="font-mono text-[11px] text-[var(--kh-mut)]">
          🔒 Contacts stay inside KIIT · v0.1
        </div>
      </div>
    </footer>
  );
}
