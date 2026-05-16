/**
 * Server-only Paystack **secret** (never `NEXT_PUBLIC_*`).
 * Aligns with payout-processor / admin: `PAYSTACK_SECRET_KEY_NG`, etc., then `PAYSTACK_SECRET_KEY` for NGN.
 */
export function getPaystackSecretKeyForCurrency(currencyCode?: string | null): string | undefined {
  const code = String(currencyCode || "NGN").toUpperCase();
  const suffix =
    code === "NGN"
      ? "NG"
      : code === "GHS"
        ? "GH"
        : code === "ZAR"
          ? "ZA"
          : code === "KES"
            ? "KE"
            : code === "XOF"
              ? "CI"
              : code === "EGP"
                ? "EG"
                : code === "RWF"
                  ? "RW"
                  : "NG";
  const byCountry = process.env[`PAYSTACK_SECRET_KEY_${suffix}`]?.trim();
  if (byCountry) return byCountry;
  if (code === "NGN") {
    const legacy = process.env.PAYSTACK_SECRET_KEY?.trim();
    if (legacy) return legacy;
  }
  return undefined;
}

export function paystackSecretMissingMessage(): string {
  return (
    "Paystack secret is not configured on this server. " +
    "Add PAYSTACK_SECRET_KEY or PAYSTACK_SECRET_KEY_NG to the storefront environment (e.g. Vercel → Project → Settings → Environment Variables). " +
    "Never put the secret in NEXT_PUBLIC_* — only the public key belongs there."
  );
}
