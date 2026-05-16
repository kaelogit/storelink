import type { CSSProperties } from "react";
import { normalizeStorefrontLayout, type StorefrontLayoutPreset } from "@/lib/storefrontMiniSite";

/** Default accent matches StoreLink emerald brand when seller leaves theme blank. */
export const STOREFRONT_DEFAULT_ACCENT = "#059669";

export type StorefrontFontPreset = "sans" | "serif" | "display";

export type StorefrontThemeNormalized = {
  accent: string;
  font: StorefrontFontPreset;
  banner_secondary_url: string | null;
  /** Public `[slug]` layout preset — stored in `storefront_theme.layout` JSON. */
  layout: StorefrontLayoutPreset;
  /** When true, sold-out SKUs are hidden on the public web storefront. */
  hide_out_of_stock: boolean;
};

export type { StorefrontLayoutPreset };

const HEX = /^#([0-9a-fA-F]{6})$/;

function parseJsonRecord(raw: unknown): Record<string, unknown> {
  if (raw == null) return {};
  if (typeof raw === "string") {
    try {
      const v = JSON.parse(raw) as unknown;
      return typeof v === "object" && v != null && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  if (typeof raw === "object" && !Array.isArray(raw)) return raw as Record<string, unknown>;
  return {};
}

export function normalizeStorefrontTheme(raw: unknown): StorefrontThemeNormalized {
  const o = parseJsonRecord(raw);
  const accentRaw = typeof o.accent === "string" ? o.accent.trim() : "";
  const accent = HEX.test(accentRaw) ? accentRaw : STOREFRONT_DEFAULT_ACCENT;
  const fontRaw = typeof o.font === "string" ? o.font.trim().toLowerCase() : "sans";
  const font: StorefrontFontPreset =
    fontRaw === "serif" || fontRaw === "display" ? (fontRaw as StorefrontFontPreset) : "sans";
  const banner =
    typeof o.banner_secondary_url === "string" && o.banner_secondary_url.trim().length > 0
      ? o.banner_secondary_url.trim()
      : null;
  const layout = normalizeStorefrontLayout(o.layout);
  const hideRaw = o.hide_out_of_stock;
  const hide_out_of_stock = hideRaw === true || hideRaw === "true" || hideRaw === 1 || hideRaw === "1";
  return { accent, font, banner_secondary_url: banner, layout, hide_out_of_stock };
}

/**
 * CSS variables for the seller mini-site root. Safe fallbacks live in `globals.css` (`.storefront-root`).
 * Uses `color-mix` so we do not need JS color math for hover / soft fills.
 */
export function themeToCssVars(theme: StorefrontThemeNormalized): CSSProperties {
  const a = theme.accent;
  return {
    ["--sf-accent" as string]: a,
    ["--sf-accent-soft" as string]: `color-mix(in srgb, ${a} 16%, white)`,
    ["--sf-accent-softer" as string]: `color-mix(in srgb, ${a} 10%, white)`,
    ["--sf-accent-foreground" as string]: `color-mix(in srgb, ${a} 8%, #0f172a)`,
    ["--sf-accent-strong" as string]: `color-mix(in srgb, ${a} 78%, #020617)`,
  } as CSSProperties;
}

export function storefrontFontClass(font: StorefrontFontPreset): string {
  if (font === "serif") return "sf-font-serif";
  if (font === "display") return "sf-font-display";
  return "";
}
