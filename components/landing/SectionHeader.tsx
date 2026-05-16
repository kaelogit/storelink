"use client";

import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  headline: ReactNode;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
}

export default function SectionHeader({ 
  eyebrow, 
  headline, 
  description, 
  align = "left",
  dark = false
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto items-center flex flex-col" : "text-left";

  return (
    <div className={`max-w-4xl mx-auto mb-10 md:mb-16 ${alignClass} px-4`}>
      {/* Eyebrow */}
      <div className={`inline-flex items-center gap-3 mb-4 md:mb-5 ${align === "center" ? "justify-center" : ""}`}>
        <span className={`h-px w-6 ${dark ? 'bg-emerald-400/50' : 'bg-emerald-500/60'}`} />
        <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>
          {eyebrow}
        </span>
        {align === "center" && <span className={`h-px w-6 ${dark ? 'bg-emerald-400/50' : 'bg-emerald-500/60'}`} />}
      </div>

      {/* Headline — hero sizes */}
      <h2 className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-4 md:mb-5 max-w-full ${dark ? 'text-white' : 'text-gray-900'}`}>
        {headline}
      </h2>

      {/* Description */}
      {description && (
        <p className={`text-sm md:text-base lg:text-lg leading-relaxed ${dark ? 'text-white/40' : 'text-gray-400'} max-w-2xl`}>
          {description}
        </p>
      )}
    </div>
  );
}