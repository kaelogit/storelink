/** True when either city or region/state is missing (after trim). */
export function missingCityOrState(city: string, state: string): boolean {
  return !String(city ?? "").trim() || !String(state ?? "").trim();
}

/** When a home address line is present, city and region must both be set. */
export function homeAddressCityStateError(line: string, city: string, state: string): string | null {
  if (!line.trim()) return null;
  if (missingCityOrState(city, state)) {
    return "City and region are required for your home address — pick a suggestion from the list or clear the address.";
  }
  return null;
}

/** When a shop/store address line is present, city and region must both be set. */
export function shopAddressCityStateError(line: string, city: string, state: string): string | null {
  if (!line.trim()) return null;
  if (missingCityOrState(city, state)) {
    return "City and region are required for your shop address — pick a suggestion from the list or clear the address.";
  }
  return null;
}

export function assertHomeCityStateIfAddressFilled(line: string, city: string, state: string): void {
  const err = homeAddressCityStateError(line, city, state);
  if (err) throw new Error(err);
}

export function assertShopCityStateIfAddressFilled(line: string, city: string, state: string): void {
  const err = shopAddressCityStateError(line, city, state);
  if (err) throw new Error(err);
}
