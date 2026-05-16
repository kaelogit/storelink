"use client";

import type { Store } from "@/types";
import { useCart } from "@/context/CartContext";
import { normalizeStorefrontTheme } from "@/lib/storefrontTheme";
import StorefrontCatalogProductCard from "@/components/storefront/public/StorefrontCatalogProductCard";
import { isStorefrontMerchFlagOn } from "@/lib/storefrontMerchFlags";
import { cn } from "@/lib/utils";

export type ProductMoreFromSellerGridProps = {
  products: any[];
  store: Store;
};

export default function ProductMoreFromSellerGrid({ products, store }: ProductMoreFromSellerGridProps) {
  const { addToCart } = useCart();
  const editorial = normalizeStorefrontTheme(store.storefront_theme).layout === "editorial";

  return (
    <div
      className={cn(
        "grid gap-3 md:gap-6",
        "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
      )}
    >
      {products.map((product) => (
        <StorefrontCatalogProductCard
          key={product.id}
          product={product}
          store={store}
          featured={false}
          isMinimal={false}
          editorial={editorial}
          onAddToCart={(p) => addToCart(p, store)}
          newArrivalRibbon={isStorefrontMerchFlagOn(product.storefront_new_arrival)}
          bestSellerRibbon={isStorefrontMerchFlagOn(product.storefront_best_seller)}
        />
      ))}
    </div>
  );
}
