"use client";

import { useMemo } from "react";
import type { Store } from "@/types";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";
import StorefrontCatalogProductCard from "@/components/storefront/public/StorefrontCatalogProductCard";
import { cn } from "@/lib/utils";

export type StorefrontBestSellersSectionProps = {
  products: any[];
  store: Store;
  onAddToCart: (product: any) => void;
  /** Tighter vertical rhythm (e.g. minimal storefront layout). */
  dense?: boolean;
  editorial?: boolean;
};

/**
 * Best-sellers — two horizontal rows (split list), same catalog cards with “Best” ribbon.
 */
export default function StorefrontBestSellersSection({
  products,
  store,
  onAddToCart,
  dense,
  editorial,
}: StorefrontBestSellersSectionProps) {
  if (!products.length) return null;

  const [row1, row2] = useMemo(() => {
    const mid = Math.ceil(products.length / 2);
    return [products.slice(0, mid), products.slice(mid)] as const;
  }, [products]);

  const rows = [row1, row2].filter((r) => r.length > 0);

  return (
    <section
      aria-label="Best sellers"
      className={cn(
        "border-b border-gray-100 bg-white",
        dense ? "py-8 md:py-10" : "py-10 md:py-14",
      )}
    >
      <div className={cn("mx-auto max-w-7xl", STOREFRONT_GUTTER_X)}>
        <div
          className={cn(
            "flex flex-col items-center justify-center text-center",
            dense ? "mb-8 md:mb-10" : "mb-12 md:mb-16",
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
            Best sellers
          </h2>
          <div className="mt-6 h-[2px] w-12 bg-black" aria-hidden />
          <p className="mt-4 max-w-md text-sm tracking-wide text-gray-500 md:text-base">
            The products everyone is buying right now.
          </p>
        </div>

        <div className={cn("flex flex-col", dense ? "gap-2.5" : "gap-3 md:gap-4")}>
          {rows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="no-scrollbar flex gap-3 overflow-x-auto pb-0.5 md:gap-4 lg:gap-5"
            >
              {row.map((product) => (
                <div
                  key={product.id}
                  className={cn(
                    "w-[44vw] shrink-0 max-w-[230px] sm:max-w-[250px]",
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
                    bestSellerRibbon
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
