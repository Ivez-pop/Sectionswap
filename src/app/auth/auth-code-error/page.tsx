import Link from "next/link";
import { ALLOWED_EMAIL_DOMAIN } from "@/lib/auth/kiit";

export const metadata = {
  title: "Sign-in error — KIIT Hub",
};

export default function AuthCodeErrorPage() {
  return (
    <div
      className="kh-grain flex min-h-screen items-center justify-center p-8"
      style={{
        background:
          "linear-gradient(160deg, var(--kh-paper), var(--kh-paper2))",
      }}
    >
      <div className="w-full max-w-[440px] rounded-[20px] border-[1.5px] border-[var(--kh-line2)] bg-[var(--kh-card)] p-[40px_34px] text-center shadow-[0_18px_44px_rgba(44,40,34,.14)] animate-in fade-in duration-500">
        <div className="text-[46px]">🚧</div>
        <div className="mt-3 font-serif text-[32px] leading-[1.1] text-[var(--kh-ink)]">
          That&rsquo;s not a KIIT email
        </div>
        <div className="mt-3 text-[15px] leading-[1.55] text-[var(--kh-ink2)]">
          This clubhouse is KIIT-only. Sign in with your{" "}
          <b className="text-[var(--kh-accent)]">@{ALLOWED_EMAIL_DOMAIN}</b>{" "}
          address and we&rsquo;ll wave you right through — promise it&rsquo;s
          the friendliest bouncer on campus.
        </div>
        <Link
          href="/login"
          className="mt-[26px] inline-flex items-center rounded-xl bg-[var(--kh-accent)] px-[22px] py-[13px] text-[15px] font-bold text-white shadow-[0_3px_0_var(--kh-accent-d)] transition-transform hover:-translate-y-px"
        >
          ← Back to login
        </Link>
      </div>
    </div>
  );
}
