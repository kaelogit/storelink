/**
 * Client-side Paystack public key helpers.
 */
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  NGN: "NG",
  GHS: "GH",
  ZAR: "ZA",
  KES: "KE",
  XOF: "CI",
  EGP: "EG",
  RWF: "RW",
  USD: "US",
};

const COUNTRY_NAMES: Record<string, string> = {
  NG: "Nigeria",
  GH: "Ghana",
  ZA: "South Africa",
  KE: "Kenya",
  CI: "Cote d'Ivoire",
  EG: "Egypt",
  RW: "Rwanda",
  US: "United States",
};

export function getPaystackPublicKey(currencyCode: string): string | undefined {
  const code = currencyCode.toUpperCase();
  const country = CURRENCY_TO_COUNTRY[code] ?? code.slice(0, 2);
  if (typeof process === "undefined") return undefined;
  const byCountry = process.env[`NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY_${country}`];
  const legacy = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  return (byCountry as string | undefined) || (code === "NGN" ? legacy : undefined);
}

export function paystackCountryNameForCurrency(currencyCode: string): string {
  const code = currencyCode.toUpperCase();
  const country = CURRENCY_TO_COUNTRY[code] ?? "NG";
  return COUNTRY_NAMES[country] ?? "your country";
}

export function toSmallestUnit(amount: number, currencyCode: string = "NGN"): number {
  const code = currencyCode.toUpperCase();
  const decimals = ["XOF", "RWF"].includes(code) ? 0 : 2;
  return Math.round(Number(amount || 0) * 10 ** decimals);
}
