import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { getUser } from "@/lib/data/dal";
import { ALLOWED_EMAIL_DOMAIN } from "@/lib/auth/kiit";
import LoginButton from "./LoginButton";

export const metadata = {
  title: "Sign in — KIIT Hub Community",
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
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-50/40 px-6 dark:bg-zinc-900 overflow-hidden">
      {/* Subtle radial gradient background in Dark Mode */}
      <div className="absolute inset-0 -z-10 hidden dark:block" style={{ background: "radial-gradient(circle at top, rgba(59,130,246,0.08), transparent 50%)" }} />

      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-10 sm:p-12 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 dark:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            <GraduationCap className="h-10 w-10" />
          </div>
          <h1 className="mt-8 text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            KIIT Hub Community
          </h1>
          <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-white">
            Sign in with your{" "}
            <span className="font-semibold text-zinc-600 dark:text-white">
              @{ALLOWED_EMAIL_DOMAIN}
            </span>{" "}
            Google account to continue.
          </p>
        </div>

        {error === "domain" && (
          <p className="mt-8 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-center text-xs font-medium text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
            Only @{ALLOWED_EMAIL_DOMAIN} accounts can sign in. Please use your
            KIIT email.
          </p>
        )}

        <div className="mt-8">
          <LoginButton next={safeNext} />
        </div>

        <p className="mt-8 text-center text-sm font-medium leading-relaxed text-zinc-500 dark:text-white max-w-xs mx-auto">
          This portal is exclusively available to verified KIIT students and staff using their{" "}
          <span className="font-semibold text-zinc-600 dark:text-white">
            @{ALLOWED_EMAIL_DOMAIN}
          </span>{" "}
          Google account.
        </p>
      </div>
    </div>
  );
}
