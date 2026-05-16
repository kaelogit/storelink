"use client";

/**
 * Skeleton grid matching the public storefront product grid (2 / 3 / 4 columns).
 */
export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-2.5 shadow-sm">
          <div className="sf-skeleton mb-3 aspect-square w-full rounded-xl" />
          <div className="sf-skeleton mb-2 h-3 w-[75%] rounded-md" />
          <div className="sf-skeleton h-4 w-1/2 rounded-md" />
        </div>
      ))}
    </div>
  );
}
