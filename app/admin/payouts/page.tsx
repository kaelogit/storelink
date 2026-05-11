import { Suspense } from "react";
import AdminPayoutsClient from "@/components/admin/AdminPayoutsClient";

export default function AdminOrderPayoutsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[50vh] flex flex-col items-center justify-center gap-3 text-gray-500 text-sm font-medium">
          <span className="inline-block h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          Loading payouts…
        </div>
      }
    >
      <AdminPayoutsClient />
    </Suspense>
  );
}
