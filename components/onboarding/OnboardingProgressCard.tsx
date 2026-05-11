"use client";

import Link from "next/link";

type Props = {
  continueHref: string | null;
  missingFields: string[];
};

export default function OnboardingProgressCard({ continueHref, missingFields }: Props) {
  if (!continueHref && missingFields.length === 0) return null;

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Setup status</p>
      {missingFields.length > 0 ? (
        <p className="text-xs font-medium text-emerald-900 mt-1">
          Missing: {missingFields.join(" · ")}
        </p>
      ) : (
        <p className="text-xs font-medium text-emerald-900 mt-1">
          Core onboarding fields are complete.
        </p>
      )}
      {continueHref && (
        <Link
          href={continueHref}
          className="inline-flex mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest"
        >
          Continue setup
        </Link>
      )}
    </div>
  );
}
