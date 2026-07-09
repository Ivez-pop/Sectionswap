"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ALLOWED_EMAIL_DOMAIN } from "@/lib/auth/kiit";

export default function LoginButton({ next }: { next: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            // Restrict the Google account chooser to the KIIT workspace. This
            // is a hint only — the server callback + DB trigger enforce it.
            hd: ALLOWED_EMAIL_DOMAIN,
            prompt: "select_account",
          },
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      }
      // On success the browser is redirected to Google.
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="flex w-full items-center justify-center gap-[11px] rounded-[13px] border-[1.5px] border-[var(--kh-line2)] bg-[var(--kh-card)] px-[18px] py-3.5 text-[15px] font-semibold text-[var(--kh-ink)] shadow-[0_2px_0_var(--kh-line2)] transition-all hover:-translate-y-px hover:shadow-[0_4px_0_var(--kh-line2)] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      >
        <GoogleIcon />
        {loading ? "Redirecting…" : "Continue with Google"}
      </button>
      {error && (
        <p className="mt-3 text-center text-xs font-medium text-[var(--kh-need)]">
          {error}
        </p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
