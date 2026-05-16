"use client";

import { useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Store } from "@/types";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";
import StorefrontCatalogProductCard from "@/components/storefront/public/StorefrontCatalogProductCard";
import { cn } from "@/lib/utils";

export type StorefrontNewArrivalsSectionProps = {
  products: any[];
  store: Store;
  onAddToCart: (product: any) => void;
  /** Tighter vertical rhythm (e.g. minimal storefront layout). */
  dense?: boolean;
  /** Magazine-style section titles (`editorial` layout). */
  editorial?: boolean;
};

/**
 * New arrivals horizontal strip — same product cards as the main catalog, plus “New” ribbon.
 */
export default function StorefrontNewArrivalsSection({
  products,
  store,
  onAddToCart,
  dense,
  editorial,
}: StorefrontNewArrivalsSectionProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollStrip = useCallback((direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.min(Math.max(el.clientWidth * 0.75, 220), 420) * direction;
    el.scrollBy({ left: step, behavior: "smooth" });
  }, []);

  if (!products.length) return null;

  const arrowBtn =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 shadow-md transition hover:bg-gray-900 hover:text-white active:scale-95 md:h-12 md:w-12";

  return (
    <section
      aria-label="New arrivals"
      className={cn(
        "border-b border-gray-100 bg-gradient-to-b from-white to-emerald-50/25",
        dense ? "py-8 md:py-10" : "py-10 md:py-14",
      )}
    >
      <div className={cn("mx-auto max-w-7xl", STOREFRONT_GUTTER_X)}>
        <div
          className={cn(
            "flex flex-col items-center justify-center text-center",
            dense ? "mb-6 md:mb-8" : "mb-8 md:mb-12",
          )}
        >
          <h2
            className={cn(
              "sf-heading text-black",
              editorial
                ? "text-4xl font-semibold normal-case tracking-tight md:text-5xl"
                : "text-3xl font-bold uppercase tracking-widest md:text-4xl",
            )}
          >
            New arrivals
          </h2>
          <p className={cn("max-w-md text-sm tracking-wide text-gray-500 md:text-base", dense ? "mt-3" : "mt-4")}>
            Just landed in store
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button type="button" className={arrowBtn} aria-label="Scroll new arrivals left" onClick={() => scrollStrip(-1)}>
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} />
          </button>
          <div
            ref={scrollerRef}
            className="no-scrollbar min-w-0 flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth pb-1"
          >
            <div className="flex w-max gap-3 md:gap-4 lg:gap-5">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={cn(
                    "w-[44vw] shrink-0 snap-start max-w-[230px] sm:max-w-[250px]",
                    dense
                      ? "md:w-[228px] md:max-w-[228px] lg:w-[248px] lg:max-w-[248px] xl:w-[260px] xl:max-w-[260px]"
                      : "md:w-[280px] md:max-w-[280px] lg:w-[308px] lg:max-w-[308px] xl:w-[328px] xl:max-w-[328px]",
                  )}
                >
                  <StorefrontCatalogProductCard
                    product={product}
                    store={store}
                    featured={false}
                    isMinimal={dense}
                    editorial={editorial}
                    onAddToCart={onAddToCart}
                    newArrivalRibbon
                  />
                </div>
              ))}
            </div>
          </div>
          <button type="button" className={arrowBtn} aria-label="Scroll new arrivals right" onClick={() => scrollStrip(1)}>
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
