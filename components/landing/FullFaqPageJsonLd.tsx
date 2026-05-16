"use client";

import { useMemo } from "react";
import { flattenFullFaqForJsonLd } from "@/lib/fullFaqContent";
import { storefrontAbsolutePath } from "@/lib/storefrontPublicUrl";

/** FAQPage JSON-LD for `/faq` (full help center). */
export default function FullFaqPageJsonLd() {
  const jsonLd = useMemo(() => {
    const pageUrl = storefrontAbsolutePath("/faq");
    const items = flattenFullFaqForJsonLd();
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${pageUrl}#faqpage`,
      mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };
  }, []);

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}
