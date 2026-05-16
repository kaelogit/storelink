"use client";

import { useMemo } from "react";
import { LANDING_PAGE_FAQS } from "@/lib/landingFaqContent";
import { storefrontAbsolutePath } from "@/lib/storefrontPublicUrl";

/**
 * FAQPage JSON-LD for the home landing (`#faq`). Keeps answers in sync via `LANDING_PAGE_FAQS`.
 */
export default function FaqJsonLd() {
  const jsonLd = useMemo(() => {
    const pageUrl = storefrontAbsolutePath("/");
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: LANDING_PAGE_FAQS.map((item) => ({
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
