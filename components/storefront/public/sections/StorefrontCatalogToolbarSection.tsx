"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export type StorefrontCatalogToolbarSectionProps = {
  catalogAnchorId: string;
  categories: { id: string; name: string }[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  activeCategory: string;
  onActiveCategoryChange: (name: string) => void;
  isMinimal: boolean;
  toolbarVisible: boolean;
  editorial?: boolean;
};

function pillClass(active: boolean, editorial?: boolean) {
  return cn(
    "shrink-0 px-4 py-2 transition select-none touch-manipulation",
    editorial
      ? "rounded-full text-xs font-semibold tracking-tight"
      : "rounded-lg text-[10px] font-black uppercase tracking-widest",
    active
      ? "sf-pill-active text-white shadow-md"
      : "border border-gray-200 bg-white text-gray-500 hover:border-gray-300 active:bg-gray-50"
  );
}

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
  const [showFilters, setShowFilters] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on category select or outside click
  useEffect(() => {
    if (!showFilters) return;
    const handleClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showFilters]);

  const hasActiveFilter = activeCategory !== "All";

  return (
    <section
      id={catalogAnchorId}
      aria-label="Catalog filters"
      className={cn(
        "sticky z-30 border-b border-gray-200/90 bg-white/90 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-transform duration-300 ease-out supports-[backdrop-filter]:bg-white/75 supports-[backdrop-filter]:backdrop-blur-md",
        isMinimal ? "top-14" : "top-16",
        toolbarVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className={cn("mx-auto max-w-7xl", STOREFRONT_GUTTER_X, "py-3 md:py-4")}>
        {/* Mobile: Search + Filter icon inline */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="relative flex-1">
            <label htmlFor="storefront-catalog-search" className="sr-only">
              Search products in this shop
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <input
              id="storefront-catalog-search"
              type="search"
              autoComplete="off"
              enterKeyHint="search"
              inputMode="search"
              className={cn(
                "h-12 w-full border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm font-semibold text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10",
                editorial ? "rounded-2xl" : "rounded-xl"
              )}
              placeholder="Search this shop…"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition",
              hasActiveFilter || showFilters
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-gray-200 bg-white text-gray-500"
            )}
            aria-expanded={showFilters}
            aria-controls="mobile-filter-drawer"
            aria-label="Toggle category filters"
          >
            {showFilters ? <X size={18} /> : <SlidersHorizontal size={18} />}
          </button>
        </div>

        {/* Desktop: Search + Categories inline */}
        <div className="hidden md:flex md:items-stretch md:gap-4">
          <div className="relative w-full max-w-sm shrink-0">
            <label htmlFor="storefront-catalog-search-desktop" className="sr-only">
              Search products in this shop
            </label>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <input
              id="storefront-catalog-search-desktop"
              type="search"
              autoComplete="off"
              enterKeyHint="search"
              inputMode="search"
              className={cn(
                "h-[52px] w-full border border-gray-200 bg-white py-2.5 pl-11 pr-3 text-base font-semibold text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10",
                editorial ? "rounded-2xl" : "rounded-xl"
              )}
              placeholder="Search this shop…"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
          </div>

          <div
            className="flex min-h-[52px] flex-1 flex-wrap items-center gap-2.5"
            role="toolbar"
            aria-label="Product categories"
          >
            <button
              type="button"
              onClick={() => onActiveCategoryChange("All")}
              className={pillClass(activeCategory === "All", editorial)}
            >
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

        {/* Mobile filter drawer (pills) */}
        <div
          ref={drawerRef}
          id="mobile-filter-drawer"
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-out",
            showFilters ? "mt-3 max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-wrap gap-2 pb-1">
            <button
              type="button"
              onClick={() => {
                onActiveCategoryChange("All");
                setShowFilters(false);
              }}
              className={pillClass(activeCategory === "All", editorial)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => {
                  onActiveCategoryChange(cat.name);
                  setShowFilters(false);
                }}
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