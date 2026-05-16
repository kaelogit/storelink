"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, Package, Tag } from "lucide-react";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";
import { isProductFlashDropActive, productDisplayPrice, productFlashEndIso, type ProductFlashSource } from "@/lib/productFlashDrop";
import { cn } from "@/lib/utils";

export type StorefrontFlashDropsSectionProps = {
  /** Rows with flash metadata (may include expired); section filters by time each tick. */
  products: any[];
  /** Tighter vertical rhythm (e.g. minimal storefront layout). */
  dense?: boolean;
  editorial?: boolean;
};

function formatFlashCountdown(remainingMs: number): string {
  if (remainingMs <= 0) return "00:00";
  const totalSec = Math.max(0, Math.ceil(remainingMs / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

function remainingMsForFlashEnd(product: ProductFlashSource, now: Date): number {
  const iso = productFlashEndIso(product);
  if (!iso) return 0;
  return new Date(iso).getTime() - now.getTime();
}

/**
 * Flash drops — editorial horizontal strip with split Retail / Now price badge and live countdown.
 */
export default function StorefrontFlashDropsSection({ products, dense, editorial }: StorefrontFlashDropsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [now, setNow] = useState(() => new Date());
  /** Pause 1s ticks when far off-screen — avoids re-rendering large cards during scroll. */
  const [tickNearViewport, setTickNearViewport] = useState(true);

  const activeFlashProducts = useMemo(
    () => products.filter((p) => isProductFlashDropActive(p, now)).slice(0, 10),
    [products, now],
  );

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || activeFlashProducts.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const on = entries.some((e) => e.isIntersecting);
        setTickNearViewport(on);
        if (on) setNow(new Date());
      },
      { root: null, rootMargin: "160px 0px", threshold: 0 },
    );
    obs.observe(root);
    return () => obs.disconnect();
  }, [activeFlashProducts.length]);

  useEffect(() => {
    if (!tickNearViewport || activeFlashProducts.length === 0) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [tickNearViewport, activeFlashProducts.length]);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 400;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!products.length || !activeFlashProducts.length) return null;

  return (
    <section
      ref={sectionRef}
      aria-label="Flash drops"
      className={cn(
        "border-y border-gray-100 bg-[#fcfcfc]",
        dense ? "py-10 md:py-12" : editorial ? "py-14 md:py-20 lg:py-28" : "py-12 md:py-16 lg:py-24",
      )}
    >
      <div className={cn("mx-auto max-w-7xl", STOREFRONT_GUTTER_X)}>
        <div className="mb-8 flex items-end justify-between md:mb-12 lg:mb-12">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Tag size={14} className="text-red-600" aria-hidden />
              <span
                className={cn(
                  "text-[10px] font-bold text-red-600",
                  editorial ? "tracking-wide" : "uppercase tracking-[0.3em]",
                )}
              >
                Limited time
              </span>
            </div>
            <h2
              className={cn(
                "sf-heading text-black",
                editorial
                  ? "text-4xl font-semibold normal-case tracking-tight md:text-6xl"
                  : "text-3xl font-bold uppercase tracking-widest md:text-5xl",
              )}
            >
              Flash drops
            </h2>
          </div>

          <div className="hidden gap-3 md:flex">
            <button
              type="button"
              onClick={() => scrollBy("left")}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 text-black transition-colors hover:bg-black hover:text-white"
              aria-label="Scroll flash drops left"
            >
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy("right")}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 text-black transition-colors hover:bg-black hover:text-white"
              aria-label="Scroll flash drops right"
            >
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto pb-6 md:pb-10 [contain:inline-size]"
        >
          {activeFlashProducts.map((product) => {
            const img = product.image_urls?.[0];
            const listPrice = Number(product.price);
            const flashPrice = productDisplayPrice({ ...product, price: listPrice });
            const remainingMs = remainingMsForFlashEnd(product, now);
            const countdownLabel = formatFlashCountdown(remainingMs);

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className={cn(
                  "group relative block shrink-0 snap-center overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-xl",
                  dense
                    ? "h-[420px] w-[300px] md:h-[520px] md:w-[380px]"
                    : "h-[480px] w-[350px] md:h-[600px] md:w-[450px]",
                )}
              >
                {img ? (
                  <Image
                    src={img}
                    alt={product.name || "Product"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes={dense ? "(min-width: 768px) 380px, 300px" : "(min-width: 768px) 450px, 350px"}
                    loading="lazy"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                    <Package size={40} strokeWidth={1} />
                  </div>
                )}

                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/70 via-black/25 to-transparent pb-10 pt-4 md:pt-5">
                  <div className="flex justify-center px-4">
                    <div
                      className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/80 px-3 py-2 text-white shadow-lg md:px-4 md:py-2.5"
                      aria-live="polite"
                      aria-label={`Flash ends in ${countdownLabel}`}
                    >
                      <Clock size={14} className="shrink-0 text-red-400 md:size-4" strokeWidth={2} aria-hidden />
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 md:text-[10px]">
                        Ends in
                      </span>
                      <span className="font-mono text-sm font-bold tabular-nums tracking-tight text-white md:text-base">
                        {countdownLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute bottom-6 left-6 z-10 flex shadow-2xl md:bottom-8 md:left-8">
                  <div className="flex flex-col justify-center bg-black px-4 py-3 md:px-5 md:py-4">
                    <span className="mb-1 text-[8px] uppercase tracking-[0.2em] text-gray-400 md:text-[9px]">Retail</span>
                    <span className="font-mono text-xs text-gray-500 line-through decoration-gray-500 md:text-sm">
                      ₦{listPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center bg-white px-4 py-3 md:px-5 md:py-4">
                    <span className="mb-1 text-[8px] font-bold uppercase tracking-[0.2em] text-red-600 md:text-[9px]">Now</span>
                    <span className="font-mono text-sm font-bold text-black md:text-lg">
                      ₦{Number(flashPrice).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
