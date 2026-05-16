"use client";

import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  headline: ReactNode;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  singleLine?: boolean;
}

export default function SectionHeader({ 
  eyebrow, 
  headline, 
  description, 
  align = "left",
  dark = false,
  singleLine = false
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const maxWidth = singleLine ? "max-w-4xl mx-auto" : align === "center" ? "max-w-3xl mx-auto" : "max-w-2xl";

  return (
    <div className={`${maxWidth} mb-14 md:mb-18 ${alignClass}`}>
      {/* Eyebrow */}
      <div className={`inline-flex items-center gap-3 mb-5 ${align === "center" ? "justify-center" : ""}`}>
        <span className={`h-px w-6 ${dark ? 'bg-emerald-400/50' : 'bg-emerald-500/60'}`} />
        <span className={`text-[11px] font-bold uppercase tracking-[0.25em] ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>
          {eyebrow}
        </span>
        <span className={`h-px w-6 ${dark ? 'bg-emerald-400/50' : 'bg-emerald-500/60'}`} />
      </div>

      {/* Headline */}
      <h2 className={`font-bold tracking-tight mb-5 ${singleLine ? 'text-3xl md:text-5xl lg:text-6xl whitespace-nowrap' : 'text-4xl md:text-5xl lg:text-6xl leading-[1.05]' } ${dark ? 'text-white' : 'text-gray-900'}`}>
        {headline}
      </h2>

      {/* Description */}
      {description && (
        <p className={`text-base md:text-lg leading-relaxed ${dark ? 'text-white/40' : 'text-gray-400'}`}>
          {description}
        </p>
      )}
    </div>
  );
}