export type ShippingAddress = {
  id: string;
  label: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_contact: string;
  is_default: boolean;
};

function newId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `addr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Normalizes `profiles.shipping_details` (array or legacy single object) into a list.
 */
export function parseShippingDetails(raw: unknown): ShippingAddress[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw
      .filter((a) => a && typeof a === "object" && String((a as ShippingAddress).street_address || "").trim())
      .map((a) => {
        const o = a as Record<string, unknown>;
        return {
          id: String(o.id || newId()),
          label: String(o.label || "Address"),
          street_address: String(o.street_address || ""),
          city: String(o.city || ""),
          state: String(o.state || ""),
          postal_code: String(o.postal_code || ""),
          country: String(o.country || ""),
          phone_contact: String(o.phone_contact || ""),
          is_default: Boolean(o.is_default),
        };
      });
  }
  const o = raw as Record<string, unknown>;
  if (o.street_address) {
    return [
      {
        id: newId(),
        label: "Default Address",
        street_address: String(o.street_address),
        city: String(o.city || ""),
        state: String(o.state || ""),
        postal_code: String(o.postal_code || ""),
        country: String(o.country || ""),
        phone_contact: String(o.phone_contact || ""),
        is_default: true,
      },
    ];
  }
  return [];
}

export function formatShippingAddressForCheckout(a: ShippingAddress): string {
  return `${a.street_address}, ${a.city}, ${a.state || ""} ${a.postal_code}, ${a.country}\n📞 ${a.phone_contact}`;
}

export function pickDefaultSavedAddress(addresses: ShippingAddress[]): ShippingAddress | null {
  if (!addresses.length) return null;
  return addresses.find((a) => a.is_default) ?? addresses[0];
}

/** Prefer digits ending in local 10 for wallet / Paystack-style flows. */
export function profilePhoneToFormValue(phone: string | null | undefined): string {
  const raw = String(phone ?? "").trim();
  if (!raw) return "";
  const d = raw.replace(/\D/g, "");
  if (d.length >= 13 && d.startsWith("234")) return `0${d.slice(-10)}`;
  if (d.length >= 10) return d.length > 10 ? d.slice(-10) : d;
  return raw;
}
