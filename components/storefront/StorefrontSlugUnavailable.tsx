import Link from "next/link";
import { Search, Store, UserRound } from "lucide-react";
import { storefrontAbsolutePath, storefrontSiteBase } from "@/lib/storefrontPublicUrl";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";

type Props =
  | { variant: "buyer-account"; slug: string; displayLabel: string }
  | { variant: "unknown"; slug: string };

/**
 * Shown at `/{slug}` (or `{slug}.storelink.ng`) when there is no active seller storefront for that handle.
 */
export default function StorefrontSlugUnavailable(props: Props) {
  const marketplaceHref = storefrontAbsolutePath("/marketplace");
  const shopHomeHref = `${storefrontSiteBase()}/`;

  const isBuyer = props.variant === "buyer-account";
  const title = isBuyer ? "No storefront at this link" : "Store not found";
  const slugLabel = props.slug;

  return (
    <div
      className={`flex min-h-dvh flex-col items-center justify-center bg-gray-50 px-6 text-center ${STOREFRONT_GUTTER_X} ${STOREFRONT_SAFE_BOTTOM}`}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-sm">
        {isBuyer ? (
          <UserRound className="h-9 w-9 text-sky-600" strokeWidth={2} aria-hidden />
        ) : (
          <Search className="h-9 w-9 text-gray-400" strokeWidth={2} aria-hidden />
        )}
      </div>

      <h1 className="mb-3 max-w-lg text-2xl font-black uppercase tracking-tight text-gray-900">{title}</h1>

      {isBuyer ? (
        <p className="mb-2 max-w-md text-sm font-medium leading-relaxed text-gray-600">
          <span className="font-mono font-bold text-gray-800">{slugLabel}</span> is a shopper profile on StoreLink, not a
          seller shop. Seller links look the same, but only accounts with an open storefront resolve here.
        </p>
      ) : (
        <p className="mb-2 max-w-md text-sm font-medium leading-relaxed text-gray-600">
          We couldn&apos;t find a shop for{" "}
          <span className="font-mono font-bold text-gray-800">{slugLabel}</span>. The link may be mistyped, the store may
          have moved, or it may not be on StoreLink yet.
        </p>
      )}

      {isBuyer ? (
        <p className="mb-8 max-w-sm text-xs text-gray-500">
          Signed in as <span className="font-semibold text-gray-700">{props.displayLabel}</span>? Use your dashboard to
          shop or start selling — this URL is only for customer-facing stores.
        </p>
      ) : (
        <p className="mb-8 max-w-sm text-xs text-gray-500">
          Try the marketplace to discover sellers, or open the shop home and search from there.
        </p>
      )}

      <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <Link
          href={marketplaceHref}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-200/50 transition hover:bg-emerald-700"
        >
          <Store className="h-4 w-4" aria-hidden />
          Browse marketplace
        </Link>
        <Link
          href="/account/start-selling"
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-900 bg-gray-900 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-gray-800"
        >
          Start selling
        </Link>
        <Link
          href={shopHomeHref}
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-widest text-gray-800 transition hover:bg-gray-50 sm:w-auto sm:flex-none"
        >
          Shop home
        </Link>
      </div>
    </div>
  );
}
