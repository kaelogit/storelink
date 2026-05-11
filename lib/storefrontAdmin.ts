/**
 * Emails allowed to use `/admin` and admin APIs.
 * Configure in deployment: set `STOREFRONT_ADMIN_EMAIL` (server-side only).
 * Use one address or a comma-separated list. If unset or empty, no user is treated as admin.
 */
function getStorefrontAdminEmails(): string[] {
  const raw = process.env.STOREFRONT_ADMIN_EMAIL?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/** First configured admin email, or empty string if none (legacy / display helpers). */
export function getStorefrontAdminEmail(): string {
  return getStorefrontAdminEmails()[0] ?? "";
}

export function isStorefrontAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allow = getStorefrontAdminEmails();
  if (allow.length === 0) return false;
  return allow.includes(email.trim().toLowerCase());
}
