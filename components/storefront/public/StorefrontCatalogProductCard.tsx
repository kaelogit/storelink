"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, Gem, Package, Plus, Sparkles, Zap } from "lucide-react";
import type { Store } from "@/types";
import {
  isProductFlashDropActive,
  productDisplayPrice,
  productFlashPriceNumber,
} from "@/lib/productFlashDrop";
import { cn } from "@/lib/utils";

export type StorefrontCatalogProductCardProps = {
  product: any;
  store: Store;
  /** First tile spans two columns on desktop (hero_featured layout). */
  featured?: boolean;
  /** Disables hover lift on the card shell when storefront layout is minimal. */
  isMinimal?: boolean;
  /** Softer product titles for `editorial` layout. */
  editorial?: boolean;
  onAddToCart: (product: any) => void;
  /** “Best seller” ribbon (Award) — used on curated strips; stacks with flash / TOP when needed. */
  bestSellerRibbon?: boolean;
  /** “New” ribbon (Sparkles) — web new-arrivals strip. */
  newArrivalRibbon?: boolean;
  className?: string;
};

/**
 * Standard product tile used in the public storefront catalog grid and horizontal strips.
 */
export default function StorefrontCatalogProductCard({
  product,
  store,
  featured = false,
  isMinimal = false,
  editorial = false,
  onAddToCart,
  bestSellerRibbon = false,
  newArrivalRibbon = false,
  className,
}: StorefrontCatalogProductCardProps) {
  const isFlash = isProductFlashDropActive(product);
  const isDiamond = store.subscription_plan === "diamond";
  const activePrice = productDisplayPrice({ ...product, price: Number(product.price) });
  const rewardCoins = store.loyalty_enabled ? Math.floor(activePrice * ((store.loyalty_percentage || 0) / 100)) : 0;

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border bg-white p-2.5 transition-all duration-500 active:scale-[0.98]",
        isDiamond
          ? "border-purple-200 shadow-[0_10px_30px_rgba(147,51,234,0.08)] ring-1 ring-purple-50"
          : "border-gray-100 shadow-sm",
        featured && "md:col-span-2",
        !isMinimal && "md:hover:-translate-y-1 md:hover:shadow-2xl",
        className,
      )}
    >
      <Link
        href={`/product/${product.id}`}
        className={cn(
          "relative mb-3 block overflow-hidden rounded-xl bg-gray-50",
          featured ? "aspect-[4/3] md:aspect-auto md:min-h-[280px]" : "aspect-square",
        )}
      >
        {product.image_urls?.[0] ? (
          <Image
            src={product.image_urls[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />
        ) : (
          <div className="flex h-full min-h-[140px] items-center justify-center text-gray-200">
            <Package size={32} />
          </div>
        )}

        {(bestSellerRibbon || newArrivalRibbon || isFlash || isDiamond) && (
          <div className="absolute left-2 top-2 z-20 flex flex-col items-start gap-1.5">
            {newArrivalRibbon ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-700 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-md">
                <Sparkles size={10} className="shrink-0 text-white" aria-hidden />
                New
              </span>
            ) : null}
            {bestSellerRibbon ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/50 bg-gray-900 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-amber-100 shadow-md">
                <Award size={10} className="shrink-0 text-amber-400" aria-hidden />
                Best
              </span>
            ) : null}
            {isFlash ? (
              <div className="flex animate-pulse items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-[9px] font-black text-white shadow-lg">
                <Zap size={10} fill="currentColor" /> FLASH SALES
              </div>
            ) : (
              isDiamond && (
                <span className="flex items-center gap-1 rounded-full bg-purple-600 px-2 py-1 text-[10px] font-bold uppercase text-white shadow-md">
                  <Gem size={10} className="fill-white" /> TOP
                </span>
              )
            )}
          </div>
        )}

        {rewardCoins > 0 && (
          <div className="sf-bg-accent absolute right-2 top-2 z-20 flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] font-black text-white shadow-lg backdrop-blur-sm">
            <Zap size={10} fill="white" /> +₦{rewardCoins.toLocaleString()}
          </div>
        )}

        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Sold out</span>
          </div>
        )}

        <button
          type="button"
          disabled={product.stock_quantity === 0}
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(product);
          }}
          className={cn(
            "absolute bottom-2 right-2 z-40 rounded-full p-2 shadow-lg transition-all active:scale-75",
            isFlash ? "bg-amber-500 text-white" : "sf-cart-fab bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-300",
          )}
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col px-1">
        <h3
          className={cn(
            "sf-heading truncate text-gray-900",
            editorial
              ? cn(
                  "font-semibold normal-case tracking-tight",
                  featured ? "text-sm md:text-lg" : "text-xs md:text-sm",
                )
              : cn(
                  "font-black uppercase tracking-tight",
                  featured ? "text-sm md:text-base" : "text-xs md:text-sm",
                ),
          )}
        >
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-2">
          {isFlash ? (
            <div className="flex flex-col">
              <p className="text-[9px] font-bold text-gray-300 line-through">₦{product.price.toLocaleString()}</p>
              <p className="sf-price text-sm font-black tracking-tighter md:text-base">
                ₦{(productFlashPriceNumber(product) ?? product.price).toLocaleString()}
              </p>
            </div>
          ) : (
            <p
              className={cn(
                "sf-price font-black tracking-tighter",
                featured ? "text-base md:text-xl" : "text-sm md:text-base",
              )}
            >
              ₦{product.price.toLocaleString()}
            </p>
          )}

          {rewardCoins > 0 && (
            <span className="sf-accent-text animate-pulse text-[8px] font-black uppercase italic tracking-widest opacity-40">
              Earn coin
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
