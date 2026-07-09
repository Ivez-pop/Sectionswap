/**
 * KIIT login restriction. Keep in sync with app.allowed_email_domain() in the
 * database migration — the DB trigger is the hard gate; this is the app-side
 * check for a clean UX and defense in depth.
 */
export const ALLOWED_EMAIL_DOMAIN = "kiit.ac.in";

export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  return domain === ALLOWED_EMAIL_DOMAIN;
}
