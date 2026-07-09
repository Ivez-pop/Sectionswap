import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Sign-in error — KIIT Hub Community",
};

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50/40 px-6 text-center dark:bg-zinc-950">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h1 className="mt-5 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
        Could not complete sign-in
      </h1>
      <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        The sign-in link was invalid or expired. Please try signing in again.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-flex h-10 items-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
      >
        Back to sign in
      </Link>
    </div>
  );
}
