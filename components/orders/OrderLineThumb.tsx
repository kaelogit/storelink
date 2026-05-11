"use client";

import { Package } from "lucide-react";

type Props = {
  src?: string | null;
  alt: string;
  size?: "sm" | "md";
};

export default function OrderLineThumb({ src, alt, size = "md" }: Props) {
  const dim = size === "sm" ? "w-11 h-11 rounded-lg" : "w-14 h-14 rounded-xl";
  const trimmed = String(src ?? "").trim();

  if (trimmed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={trimmed}
        alt={alt}
        className={`${dim} object-cover border border-gray-100 shrink-0 bg-gray-50`}
      />
    );
  }

  return (
    <div className={`${dim} border border-gray-100 shrink-0 flex items-center justify-center bg-gray-100`}>
      <Package className={size === "sm" ? "w-5 h-5 text-gray-300" : "w-6 h-6 text-gray-300"} aria-hidden />
    </div>
  );
}
