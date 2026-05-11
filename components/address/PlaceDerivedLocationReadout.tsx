"use client";

type Props = {
  city: string;
  state: string;
  /** Main caption above city/state — matches mobile personal info blocks */
  title?: string;
  /** Shown under the values — explains why fields are read-only */
  footnote?: string;
  /** e.g. dim when “use home as shop” mirrors home */
  muted?: boolean;
};

/**
 * City and region from a Google Places selection — same stacked layout as the mobile app
 * (not a two-column grid of separate editable fields).
 */
export default function PlaceDerivedLocationReadout({
  city,
  state,
  title = "CITY & REGION (FROM SELECTION)",
  footnote,
  muted,
}: Props) {
  const cityShow = city.trim() || "—";
  const stateShow = state.trim() || "—";

  return (
    <div
      className={`mt-4 space-y-3 rounded-2xl border border-gray-200 bg-gray-50/90 p-4 ${muted ? "opacity-60" : ""}`}
    >
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</p>
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">City</p>
        <p className="text-base font-bold text-gray-900">{cityShow}</p>
      </div>
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">State / region</p>
        <p className="text-base font-bold text-gray-900">{stateShow}</p>
      </div>
      {footnote ? <p className="text-[11px] font-medium leading-relaxed text-gray-500">{footnote}</p> : null}
    </div>
  );
}
