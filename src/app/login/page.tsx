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
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50/40 px-6 dark:bg-zinc-950">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            KIIT Hub Community
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in with your{" "}
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              @{ALLOWED_EMAIL_DOMAIN}
            </span>{" "}
            Google account to continue.
          </p>
        </div>

        {error === "domain" && (
          <p className="mt-6 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-center text-xs font-medium text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
            Only @{ALLOWED_EMAIL_DOMAIN} accounts can sign in. Please use your
            KIIT email.
          </p>
        )}

        <div className="mt-6">
          <LoginButton next={safeNext} />
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-600">
          Access is restricted to verified KIIT students and staff.
        </p>
      </div>
    </div>
  );
}
