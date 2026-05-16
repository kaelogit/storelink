/**
 * Buyer-owned product orders: rows where the shopper is `user_id` or (legacy)
 * `claimed_by_user_id` after an order was linked to their account.
 */
export function buyerOrdersOrFilter(userId: string): string {
  return `user_id.eq.${userId},claimed_by_user_id.eq.${userId}`;
}
