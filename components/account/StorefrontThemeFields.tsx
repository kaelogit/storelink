"use client";

import type { StorefrontFontPreset } from "@/lib/storefrontTheme";
import { STOREFRONT_DEFAULT_ACCENT, storefrontFontClass } from "@/lib/storefrontTheme";
import type { StorefrontLayoutPreset } from "@/lib/storefrontMiniSite";
import { LayoutGrid, Minimize2, Newspaper, Sparkles, Palette } from "lucide-react";

const ACCENT_PRESETS = ["#059669", "#2563eb", "#7c3aed", "#db2777", "#ea580c", "#0f766e"] as const;

const LAYOUT_OPTIONS: {
  id: StorefrontLayoutPreset;
  label: string;
  hint: string;
  icon: typeof LayoutGrid;
}[] = [
  { id: "grid", label: "Grid", hint: "Balanced catalog — default shop window.", icon: LayoutGrid },
  { id: "minimal", label: "Minimal", hint: "Tighter hero and nav; fewer decorative rows.", icon: Minimize2 },
  { id: "hero_featured", label: "Hero", hint: "First product spans two columns on desktop.", icon: Sparkles },
  { id: "editorial", label: "Editorial", hint: "Wider headline type and a more magazine-like feel.", icon: Newspaper },
];

type Props = {
  accent: string;
  font: StorefrontFontPreset;
  layout: StorefrontLayoutPreset;
  hideOutOfStock: boolean;
  onAccentChange: (hex: string) => void;
  onFontChange: (font: StorefrontFontPreset) => void;
  onLayoutChange: (layout: StorefrontLayoutPreset) => void;
  onHideOutOfStockChange: (value: boolean) => void;
};

export default function StorefrontThemeFields({
  accent,
  font,
  layout,
  hideOutOfStock,
  onAccentChange,
  onFontChange,
  onLayoutChange,
  onHideOutOfStockChange,
}: Props) {
  return (
    <div className="scroll-mt-24 space-y-5 rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Palette size={20} />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">Storefront theme</p>
        </div>
      </div>

      <div className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50/80 px-4 py-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Catalog</p>
          <p className="mt-1 text-xs font-medium leading-relaxed text-gray-600">
            Hide sold-out items on your public shop link so buyers only see what they can order.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={hideOutOfStock}
          onClick={() => onHideOutOfStockChange(!hideOutOfStock)}
          className={`relative h-8 w-14 shrink-0 rounded-full transition ${hideOutOfStock ? "bg-gray-900" : "bg-gray-300"}`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${hideOutOfStock ? "left-7" : "left-1"}`}
          />
        </button>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Page layout</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LAYOUT_OPTIONS.map((row) => {
            const Icon = row.icon;
            const active = layout === row.id;
            return (
              <button
                key={row.id}
                type="button"
                onClick={() => onLayoutChange(row.id)}
                className={`rounded-2xl border px-3 py-3 text-left transition ${
                  active ? "border-gray-900 bg-gray-900 text-white shadow-md" : "border-gray-200 bg-gray-50 text-gray-800 hover:border-gray-300"
                }`}
              >
                <Icon size={18} className={active ? "text-emerald-300" : "text-gray-500"} />
                <p className="mt-2 text-[10px] font-black uppercase tracking-widest opacity-80">{row.label}</p>
                <p className={`mt-1 text-[10px] font-medium leading-snug ${active ? "text-gray-200" : "text-gray-500"}`}>{row.hint}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Accent colour</p>
        <div className="flex flex-wrap items-center gap-2">
          {ACCENT_PRESETS.map((hex) => (
            <button
              key={hex}
              type="button"
              title={hex}
              onClick={() => onAccentChange(hex)}
              className={`h-9 w-9 rounded-xl border-2 transition ${
                accent.toLowerCase() === hex.toLowerCase() ? "border-gray-900 ring-2 ring-gray-900/20" : "border-gray-200"
              }`}
              style={{ backgroundColor: hex }}
            />
          ))}
          <label className="ml-1 flex items-center gap-2 text-xs font-bold text-gray-700">
            <span className="text-gray-400">Custom</span>
            <input
              type="color"
              value={/^#[0-9a-fA-F]{6}$/i.test(accent) ? accent : STOREFRONT_DEFAULT_ACCENT}
              onChange={(e) => onAccentChange(e.target.value)}
              className="h-9 w-14 cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white p-0"
            />
            <input
              type="text"
              value={accent}
              onChange={(e) => onAccentChange(e.target.value)}
              placeholder="#059669"
              maxLength={7}
              autoCapitalize="characters"
              className="w-28 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-900"
            />
          </label>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Heading font</p>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: "sans" as const, label: "Sans", sample: "Clean & modern" },
              { id: "serif" as const, label: "Serif", sample: "Editorial tone" },
              { id: "display" as const, label: "Display", sample: "Bold storefront" },
            ] as const
          ).map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => onFontChange(row.id)}
              className={`rounded-2xl border px-3 py-3 text-left transition ${
                font === row.id
                  ? "border-gray-900 bg-gray-900 text-white shadow-md"
                  : "border-gray-200 bg-gray-50 text-gray-800 hover:border-gray-300"
              }`}
            >
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{row.label}</p>
              <p className={`mt-1 text-sm font-bold ${storefrontFontClass(row.id)}`}>{row.sample}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
