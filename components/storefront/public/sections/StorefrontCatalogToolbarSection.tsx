"use client";

import { Search } from "lucide-react";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";
import { cn } from "@/lib/utils";

export type StorefrontCatalogToolbarSectionProps = {
  /** Must match hero “Browse catalog” link target (`CATALOG_ANCHOR`). */
  catalogAnchorId: string;
  categories: { id: string; name: string }[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  activeCategory: string;
  onActiveCategoryChange: (name: string) => void;
  /** Nav height matches `StoreFront` sticky header. */
  isMinimal: boolean;
  /** When false, toolbar slides away on small screens (scroll-down hide). */
  toolbarVisible: boolean;
  /** Softer category chips for `editorial` layout. */
  editorial?: boolean;
};

function pillClass(active: boolean, editorial?: boolean) {
  return cn(
    "min-h-[40px] shrink-0 px-4 py-1.5 transition",
    editorial
      ? "rounded-full text-xs font-semibold tracking-tight"
      : "rounded-lg text-[10px] font-black uppercase tracking-widest",
    active ? "sf-pill-active text-white shadow-md" : "border border-gray-200 bg-white text-gray-500 hover:border-gray-300",
  );
}

/**
 * Sticky search + category filters for the public storefront catalog (`catalog_toolbar` in mini-site model).
 */
export default function StorefrontCatalogToolbarSection({
  categories,
  searchTerm,
  onSearchTermChange,
  activeCategory,
  onActiveCategoryChange,
  isMinimal,
  toolbarVisible,
  catalogAnchorId,
  editorial,
}: StorefrontCatalogToolbarSectionProps) {
  return (
    <section
      id={catalogAnchorId}
      aria-label="Catalog filters"
      className={cn(
        "sticky z-30 border-b border-gray-200/90 bg-white/90 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-all duration-300 ease-in-out supports-[backdrop-filter]:bg-white/75 supports-[backdrop-filter]:backdrop-blur-md",
        isMinimal ? "top-14" : "top-16",
        toolbarVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-24 opacity-0 md:pointer-events-auto md:translate-y-0 md:opacity-100",
      )}
    >
      <div className={cn("mx-auto max-w-7xl", STOREFRONT_GUTTER_X, "py-3 md:py-4")}>
        <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-4">
          <div className="relative w-full md:max-w-sm md:shrink-0">
            <label htmlFor="storefront-catalog-search" className="sr-only">
              Search products in this shop
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400 md:left-4"
              aria-hidden
            />
            <input
              id="storefront-catalog-search"
              type="search"
              autoComplete="off"
              enterKeyHint="search"
              className={cn(
                "sf-input-focus min-h-[48px] w-full border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm font-semibold text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 md:min-h-[52px] md:pl-11 md:text-base",
                editorial ? "rounded-2xl" : "rounded-xl",
              )}
              placeholder="Search this shop…"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
          </div>

          <div
            className="no-scrollbar flex min-h-[48px] flex-1 flex-wrap items-center gap-2 overflow-x-auto md:min-h-[52px] md:gap-2.5"
            role="toolbar"
            aria-label="Product categories"
          >
            <button type="button" onClick={() => onActiveCategoryChange("All")} className={pillClass(activeCategory === "All", editorial)}>
              All
            </button>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => onActiveCategoryChange(cat.name)}
                className={pillClass(activeCategory === cat.name, editorial)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
