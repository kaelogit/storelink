/** True when PostgREST reports the wallet table is missing (remote schema differs). */
export function isWalletTableUnavailable(err: unknown): boolean {
  const msg = String((err as { message?: string })?.message || err || "").toLowerCase();
  return (
    msg.includes("user_wallets") ||
    msg.includes("could not find the table") ||
    msg.includes("schema cache")
  );
}
