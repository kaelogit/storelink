"use client";

import { useMemo } from "react";
import { storefrontAbsolutePath } from "@/lib/storefrontPublicUrl";
import { SELLER_DIAMOND_PRICE_NGN } from "@/lib/subscriptionPricing";

/** WebPage JSON-LD for `/pricing` (SEO). */
export default function PricingJsonLd() {
  const jsonLd = useMemo(() => {
    const url = storefrontAbsolutePath("/pricing");
    const price = SELLER_DIAMOND_PRICE_NGN.toLocaleString("en-NG");
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: "StoreLink — Seller pricing",
      description: `Standard seller plan is free (₦0/mo). Diamond optional upgrade from ₦${price}/mo in the app—storefront, checkout, and marketplace discovery.`,
      url,
      isPartOf: {
        "@type": "WebSite",
        name: "StoreLink",
        url: storefrontAbsolutePath("/"),
      },
    };
  }, []);

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
