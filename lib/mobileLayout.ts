/**
 * Shared horizontal rhythm for storefront (mobile-first).
 * Safe-area aware: notches / home-indicator gutters without double-padding from `px-*`.
 */
export const STOREFRONT_GUTTER_X =
  "pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pl-[max(1.25rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.25rem,env(safe-area-inset-right,0px))] md:pl-[max(1.5rem,env(safe-area-inset-left,0px))] md:pr-[max(1.5rem,env(safe-area-inset-right,0px))] lg:pl-[max(2rem,env(safe-area-inset-left,0px))] lg:pr-[max(2rem,env(safe-area-inset-right,0px))]";

/** Bottom padding above home indicator / gesture bar. */
export const STOREFRONT_SAFE_BOTTOM = "pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]";

/** Minimum tap target (WCAG 2.5.5 / Apple HIG ~44pt). */
export const TOUCH_TARGET = "min-h-[44px] min-w-[44px] inline-flex items-center justify-center";
