import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 * Uses the current request's cookie store via the getAll/setAll API.
 *
 * Server Components cannot write cookies, so `setAll` throwing there is
 * expected and swallowed — the Proxy (src/proxy.ts) refreshes the session
 * cookies on every request instead.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = getSupabaseEnv();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — safe to ignore. The Proxy handles
          // writing refreshed session cookies.
        }
      },
    },
  });
}
