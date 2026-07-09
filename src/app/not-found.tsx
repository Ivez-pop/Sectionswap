import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50/40 px-6 text-center dark:bg-zinc-950">
      <p className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
        404
      </p>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
      >
        Go home
      </Link>
    </div>
  );
}
