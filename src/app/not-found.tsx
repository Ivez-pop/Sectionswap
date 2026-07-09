import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--kh-paper)] px-6 text-center">
      <p className="text-5xl font-extrabold tracking-tight text-[var(--kh-ink)]">
        404
      </p>
      <p className="mt-2 text-sm text-[var(--kh-ink2)]">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center rounded-xl px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-px"
        style={{ background: "var(--kh-accent)", boxShadow: "0 3px 0 var(--kh-accent-d)" }}
      >
        Go home
      </Link>
    </div>
  );
}
