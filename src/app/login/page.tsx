import { redirect } from "next/navigation";
import { getUser } from "@/lib/data/dal";
import { ALLOWED_EMAIL_DOMAIN } from "@/lib/auth/kiit";
import Logo from "@/components/Logo";
import LoginButton from "./LoginButton";

export const metadata = {
  title: "Sign in — KIIT Hub",
};

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await props.searchParams;

  // Already signed in — skip the login screen.
  const user = await getUser();
  if (user) redirect("/");

  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";

  return (
    <div
      className="kh-grain flex min-h-screen items-center justify-center p-8"
      style={{
        background:
          "linear-gradient(160deg, var(--kh-paper), var(--kh-paper2))",
      }}
    >
      <div className="flex w-full max-w-[420px] flex-col items-center text-center animate-in fade-in duration-500">
        <Logo size="lg" />
        <div className="mt-[22px] font-serif text-[46px] leading-[1.02] tracking-tight text-[var(--kh-ink)]">
          KIIT&nbsp;Hub
        </div>
        <div className="mt-2 max-w-[330px] text-base leading-relaxed text-[var(--kh-ink2)]">
          Your campus clubhouse — find your crowd, swap your section, all in
          one tidy place.
        </div>

        <div className="mt-7 w-full">
          <LoginButton next={safeNext} />
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-[var(--kh-need-line)] px-3.5 py-2 text-[13px] text-[var(--kh-mut)]"
          style={{ background: "color-mix(in srgb, var(--kh-accent) 7%, transparent)" }}
        >
          <span>🔑</span> KIIT student emails only —{" "}
          <b className="font-bold text-[var(--kh-accent)]">
            @{ALLOWED_EMAIL_DOMAIN}
          </b>
        </div>

        {error === "domain" && (
          <p className="mt-4 max-w-[320px] rounded-xl border border-[var(--kh-need-line)] bg-[var(--kh-need-bg)] px-3.5 py-2.5 text-center text-xs font-medium text-[var(--kh-need)]">
            Only @{ALLOWED_EMAIL_DOMAIN} accounts can sign in. Please use your
            KIIT email.
          </p>
        )}

        <div className="mt-3.5 max-w-[320px] font-serif text-base italic leading-relaxed text-[var(--kh-mut)]">
          &ldquo;No KIIT mail, no key to the clubhouse. Nothing personal —
          house rules.&rdquo;
        </div>
      </div>
    </div>
  );
}
