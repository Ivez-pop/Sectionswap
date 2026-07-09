/**
 * Centralized, validated access to the public Supabase environment variables.
 * These are `NEXT_PUBLIC_*` so they are safe to expose to the browser — the
 * publishable/anon key is a public client key, never the service_role key.
 */
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) " +
        "in .env.local. See .env.example.",
    );
  }

  return { url, key };
}
