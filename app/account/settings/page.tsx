"use client";

import AccountProfilePage from "@/app/account/profile/page";
import { STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";

export default function UnifiedSettingsPage() {
  return (
    <div className={`mx-auto max-w-3xl py-8 ${STOREFRONT_GUTTER_X} ${STOREFRONT_SAFE_BOTTOM}`}>
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Account settings</h1>
        <p className="mt-1 text-sm text-gray-500">Profile, addresses, and how you appear on StoreLink.</p>
      </header>
      <AccountProfilePage />
    </div>
  );
}
