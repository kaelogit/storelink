import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { STOREFRONT_GUTTER_X } from "@/lib/mobileLayout";

const VIDEO_URL = process.env.NEXT_PUBLIC_STORELINK_OVERVIEW_VIDEO_URL?.trim();

/** Section A — embed when `NEXT_PUBLIC_STORELINK_OVERVIEW_VIDEO_URL` is set (YouTube watch or youtu.be). */
export default function OverviewVideo() {
  const embedSrc = (() => {
    if (!VIDEO_URL) return null;
    try {
      const u = new URL(VIDEO_URL);
      if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
        return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
      }
      if (u.hostname === "youtu.be") {
        const id = u.pathname.replace(/^\//, "");
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
      return null;
    } catch {
      return null;
    }
  })();

  return (
    <section className={`bg-gray-50 py-14 md:py-16 ${STOREFRONT_GUTTER_X}`} aria-labelledby="overview-video-heading">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 mb-2">See it in motion</p>
        <h2 id="overview-video-heading" className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-4">
          Product overview
        </h2>
        <p className="text-gray-600 text-sm md:text-base font-medium mb-8 max-w-xl mx-auto">
          {embedSrc
            ? "Walkthrough from the team—how storefront, checkout, and discovery fit together."
            : "A hosted video tour can live here—set NEXT_PUBLIC_STORELINK_OVERVIEW_VIDEO_URL to a YouTube link. Until then, jump into the journey below or talk to support for a live walkthrough."}
        </p>

        {embedSrc ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] border border-gray-200 bg-black shadow-2xl">
            <iframe
              title="StoreLink overview"
              src={embedSrc}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-gray-200 bg-white px-8 py-14">
            <PlayCircle className="h-14 w-14 text-gray-300" strokeWidth={1.25} aria-hidden />
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/#seller-journey"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-gray-900 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-emerald-600 transition"
              >
                View seller journey
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-800 hover:border-gray-900 transition"
              >
                Request a walkthrough
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
