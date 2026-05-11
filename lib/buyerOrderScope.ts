/**
 * Buyer-owned product orders: rows where the shopper is either `user_id` (normal / app checkout)
 * or `claimed_by_user_id` (guest storefront checkout claimed after sign-in).
 */
export function buyerOrdersOrFilter(userId: string): string {
  return `user_id.eq.${userId},claimed_by_user_id.eq.${userId}`;
}
