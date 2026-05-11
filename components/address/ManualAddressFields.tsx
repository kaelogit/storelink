"use client";

type Props = {
  locationState: string;
  locationCity: string;
  addressLine: string;
  onState: (v: string) => void;
  onCity: (v: string) => void;
  onAddress: (v: string) => void;
  addressLabel?: string;
};

/** Fallback when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is not set — same fields as before Places. */
export default function ManualAddressFields({
  locationState,
  locationCity,
  addressLine,
  onState,
  onCity,
  onAddress,
  addressLabel = "Home address",
}: Props) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">State / region</label>
          <input
            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-900 text-sm outline-none focus:ring-2 focus:ring-gray-900"
            value={locationState}
            onChange={(e) => onState(e.target.value)}
            placeholder="e.g. Lagos"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">City</label>
          <input
            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-gray-900 text-sm outline-none focus:ring-2 focus:ring-gray-900"
            value={locationCity}
            onChange={(e) => onCity(e.target.value)}
            placeholder="e.g. Lekki"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{addressLabel}</label>
        <textarea
          rows={2}
          className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 font-medium text-gray-900 text-sm outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          value={addressLine}
          onChange={(e) => onAddress(e.target.value)}
          placeholder="House number, street, area, landmark"
        />
      </div>
    </>
  );
}
