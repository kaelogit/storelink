"use client";

import { useEffect, useRef, useState } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { MapPin, Loader2 } from "lucide-react";
import { getGoogleMapsBrowserKey } from "@/lib/googlePlacesParsed";
import type { ParsedGooglePlace } from "@/lib/googlePlacesParsed";
import { parseGooglePlace } from "@/lib/googlePlacesParsed";

function useLatest<T>(value: T) {
  const r = useRef(value);
  r.current = value;
  return r;
}

type Props = {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChangeText: (text: string) => void;
  onResolved: (parsed: ParsedGooglePlace) => void;
  /** Fired when the user edits the text after a pick so structured fields (city/state/coords) should be cleared in the parent. */
  onSelectionInvalidated?: () => void;
  disabled?: boolean;
  /** ISO 3166-1 alpha-2, e.g. "ng". Omit for worldwide suggestions. */
  countryBias?: string;
};

export default function GooglePlacesAutocomplete({
  id,
  label,
  hint,
  value,
  onChangeText,
  onResolved,
  onSelectionInvalidated,
  disabled,
  countryBias,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [mapsReady, setMapsReady] = useState(false);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const apiKey = getGoogleMapsBrowserKey();
  const onResolvedRef = useLatest(onResolved);
  const onChangeTextRef = useLatest(onChangeText);
  const onSelectionInvalidatedRef = useLatest(onSelectionInvalidated);
  const lastResolvedFormattedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!apiKey || !inputRef.current) return;

    let cancelled = false;

    setOptions({ key: apiKey, v: "weekly" });

    importLibrary("places")
      .then(() => {
        if (cancelled || !inputRef.current) return;
        const opts: google.maps.places.AutocompleteOptions = {
          fields: ["formatted_address", "geometry", "address_components", "name"],
          types: ["address"],
        };
        if (countryBias) {
          opts.componentRestrictions = { country: countryBias };
        }
        const ac = new google.maps.places.Autocomplete(inputRef.current, opts);
        ac.addListener("place_changed", () => {
          const place = ac.getPlace();
          const parsed = parseGooglePlace(place);
          if (parsed?.formattedAddress) {
            lastResolvedFormattedRef.current = parsed.formattedAddress;
            onChangeTextRef.current(parsed.formattedAddress);
            onResolvedRef.current(parsed);
          }
        });
        acRef.current = ac;
        setMapsReady(true);
      })
      .catch((e: unknown) => {
        setLoadErr(e instanceof Error ? e.message : "Could not load Google Maps");
      });

    return () => {
      cancelled = true;
      acRef.current = null;
    };
  }, [apiKey, countryBias, onChangeTextRef, onResolvedRef]);

  if (!apiKey) {
    return null;
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
        <MapPin size={14} className="text-emerald-600 shrink-0" />
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="off"
          disabled={disabled}
          value={value}
          onChange={(e) => {
            const next = e.target.value;
            onChangeText(next);
            const last = lastResolvedFormattedRef.current;
            if (last != null && next.trim() !== last.trim()) {
              lastResolvedFormattedRef.current = null;
              onSelectionInvalidatedRef.current?.();
            }
          }}
          placeholder="Start typing — pick an address from suggestions"
          className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 font-medium text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
        />
        {!mapsReady && !loadErr && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Loader2 className="animate-spin" size={18} />
          </span>
        )}
      </div>
      {loadErr && <p className="text-[11px] font-bold text-amber-700">{loadErr}</p>}
      {hint && <p className="text-[11px] text-gray-500 font-medium">{hint}</p>}
    </div>
  );
}
