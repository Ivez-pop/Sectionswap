"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--kh-paper)] px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "color-mix(in srgb, var(--kh-accent) 14%, transparent)", color: "var(--kh-accent)" }}>
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h1 className="mt-5 text-xl font-extrabold tracking-tight text-[var(--kh-ink)]">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-sm text-sm text-[var(--kh-ink2)]">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex h-10 items-center rounded-xl px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-px cursor-pointer"
        style={{ background: "var(--kh-accent)", boxShadow: "0 3px 0 var(--kh-accent-d)" }}
      >
        Try again
      </button>
    </div>
  );
}
