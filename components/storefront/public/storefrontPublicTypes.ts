/** Public storefront CMS blocks (subset of `storefront_blocks` rows). */
export type StorefrontBlockPublic = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  sort_order: number;
};
