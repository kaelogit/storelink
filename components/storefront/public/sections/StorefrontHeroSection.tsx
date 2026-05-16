"use client";

import { useMemo } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";
import { storefrontFontClass, type StorefrontFontPreset } from "@/lib/storefrontTheme";
import { cn } from "@/lib/utils";
import type { StorefrontBlockPublic } from "@/components/storefront/public/storefrontPublicTypes";
import { STOREFRONT_HERO_HEADLINE_MAX, STOREFRONT_HERO_TAGLINE_MAX } from "@/lib/storefrontHeroLimits";

const CATALOG_ANCHOR = "storefront-catalog";

export type StorefrontHeroSectionProps = {
  storefrontBlocks: StorefrontBlockPublic[];
  accent: string;
  font: StorefrontFontPreset;
  /** Optional shop mark — sits above the headline for a more “site” feel. */
  logoUrl?: string | null;
  /** Public storefront slug — eyebrow becomes “Welcome to /{slug}”. */
  storeSlug?: string | null;
  /** When no `hero` CMS block exists, we still render a hero from the shop profile. */
  fallbackStoreName: string;
  fallbackTagline?: string | null;
  /** Tighter hero for `minimal` layout preset. */
  dense?: boolean;
  /** Magazine-style headline for `editorial` layout (ignored when `dense`). */
  editorial?: boolean;
};

function useHeroBlocks(storefrontBlocks: StorefrontBlockPublic[]) {
  return useMemo(() => {
    const sorted = [...storefrontBlocks].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return sorted.filter((block) => {
      if (block.type !== "hero") return false;
      const pl = block.payload || {};
      const headline =
        typeof pl.headline === "string" ? pl.headline.trim().slice(0, STOREFRONT_HERO_HEADLINE_MAX) : "";
      return headline.length > 0;
    });
  }, [storefrontBlocks]);
}

function HeroBillboard({
  accent,
  font,
  logoUrl,
  headline,
  tagline,
  dense,
  editorial,
  eyebrow,
}: {
  accent: string;
  font: StorefrontFontPreset;
  logoUrl?: string | null;
  headline: string;
  tagline: string;
  dense?: boolean;
  editorial?: boolean;
  eyebrow: string;
}) {
  const displayHeadline = headline.trim().slice(0, STOREFRONT_HERO_HEADLINE_MAX).toUpperCase();
  const displayTagline = tagline.trim().slice(0, STOREFRONT_HERO_TAGLINE_MAX);
  return (
    <div className={cn("relative", dense ? "min-h-[220px] md:min-h-[260px]" : "min-h-[280px] md:min-h-[360px]")}>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(125deg, color-mix(in srgb, ${accent} 92%, #020617) 0%, color-mix(in srgb, ${accent} 45%, #0f172a) 42%, #0c1222 78%, #060a12 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-35 blur-3xl"
        style={{ background: `color-mix(in srgb, ${accent} 55%, white)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full opacity-25 blur-2xl"
        style={{ background: `color-mix(in srgb, ${accent} 40%, transparent)` }}
      />
      <div
        className={cn(
          "relative flex min-h-[inherit] flex-col justify-center",
          dense ? "py-10 md:py-14" : "py-14 md:py-24",
          STOREFRONT_GUTTER_X,
        )}
      >
        <div className="mx-auto max-w-5xl text-center">
          {logoUrl ? (
            <div className={cn("flex justify-center", dense ? "mb-4" : "mb-6")}>
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-white/25 bg-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/15 backdrop-blur-md",
                  dense ? "h-12 w-12 md:h-14 md:w-14" : "h-16 w-16 md:h-20 md:w-20",
                )}
              >
                <Image src={logoUrl} alt="" fill className="object-cover" unoptimized />
              </div>
            </div>
          ) : null}
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/50">{eyebrow}</p>
          <h2
            className={cn(
              "mt-3 text-balance font-black leading-[1.05] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]",
              editorial && !dense
                ? "max-w-4xl text-pretty font-semibold normal-case tracking-tight text-4xl md:text-6xl lg:text-7xl"
                : cn(
                    "uppercase tracking-tight",
                    dense ? "text-2xl md:text-4xl md:tracking-tighter" : "text-3xl md:text-6xl md:tracking-tighter",
                  ),
              storefrontFontClass(font),
            )}
          >
            {displayHeadline}
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-white/30" aria-hidden />
          {displayTagline ? (
            <p
              className={cn(
                "mx-auto max-w-2xl text-balance font-semibold leading-relaxed text-white/85",
                dense ? "mt-4 text-xs md:text-sm" : "mt-6 text-sm md:text-lg md:leading-relaxed",
              )}
            >
              {displayTagline}
            </p>
          ) : null}
          <div className={cn("flex flex-wrap items-center justify-center gap-3", dense ? "mt-6" : "mt-10")}>
            <a
              href={`#${CATALOG_ANCHOR}`}
              className={cn(
                "inline-flex items-center gap-2 border border-white/25 bg-white/10 px-6 py-3 text-white shadow-lg backdrop-blur-md transition hover:bg-white/15 active:scale-[0.98]",
                editorial && !dense
                  ? "rounded-2xl text-xs font-semibold tracking-wide"
                  : "rounded-full text-[10px] font-black uppercase tracking-[0.2em]",
              )}
            >
              Browse catalog
              <ChevronDown size={16} className="opacity-80" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * First fold of the public mini-site: `hero` storefront blocks when present; otherwise a
 * default billboard from the shop name + bio so every `/[slug]` page has a clear hero.
 */
function welcomeEyebrow(storeSlug?: string | null) {
  const s = (storeSlug || "").trim();
  return s ? `Welcome to ${s}` : "Welcome";
}

export default function StorefrontHeroSection({
  storefrontBlocks,
  accent,
  font,
  logoUrl,
  storeSlug,
  fallbackStoreName,
  fallbackTagline,
  dense,
  editorial,
}: StorefrontHeroSectionProps) {
  const heroBlocks = useHeroBlocks(storefrontBlocks);
  const eyebrow = welcomeEyebrow(storeSlug);

  const fallbackHeadline = (((fallbackStoreName || "").trim() || "Shop").slice(0, STOREFRONT_HERO_HEADLINE_MAX));
  const rawTag = (fallbackTagline || "").trim();
  const fallbackBody =
    rawTag.length > 0
      ? rawTag.slice(0, 280) + (rawTag.length > 280 ? "…" : "")
      : "Browse the catalog below — secure checkout on StoreLink.";

  if (!heroBlocks.length) {
    return (
      <section aria-label="Shop hero" className="relative overflow-hidden border-b border-black/10 pb-10 md:pb-16">
        <HeroBillboard
          accent={accent}
          font={font}
          logoUrl={logoUrl}
          headline={fallbackHeadline}
          tagline={fallbackBody}
          dense={dense}
          editorial={editorial}
          eyebrow={eyebrow}
        />
      </section>
    );
  }

  return (
    <section aria-label="Shop hero" className="relative overflow-hidden border-b border-black/10 pb-10 md:pb-16">
      {heroBlocks.map((block) => {
        const pl = block.payload || {};
        const headline = String(typeof pl.headline === "string" ? pl.headline : "")
          .trim()
          .slice(0, STOREFRONT_HERO_HEADLINE_MAX);
        const tagline = String(typeof pl.tagline === "string" ? pl.tagline : "")
          .trim()
          .slice(0, STOREFRONT_HERO_TAGLINE_MAX);
        return (
          <HeroBillboard
            key={block.id}
            accent={accent}
            font={font}
            logoUrl={logoUrl}
            headline={headline}
            tagline={tagline}
            dense={dense}
            editorial={editorial}
            eyebrow={eyebrow}
          />
        );
      })}
    </section>
  );
}

export { CATALOG_ANCHOR };
