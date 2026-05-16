"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Loader2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { normalizeStorefrontTheme, type StorefrontFontPreset } from "@/lib/storefrontTheme";
import type { StorefrontLayoutPreset } from "@/lib/storefrontMiniSite";
import StorefrontThemeFields from "@/components/account/StorefrontThemeFields";
import { STOREFRONT_HERO_HEADLINE_MAX, STOREFRONT_HERO_TAGLINE_MAX } from "@/lib/storefrontHeroLimits";

type BlockRow = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  sort_order: number;
  is_visible: boolean;
};

export default function DashboardStorefrontBlocksPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<BlockRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [heroDrafts, setHeroDrafts] = useState<Record<string, { headline: string; tagline: string }>>({});
  const [themeAccent, setThemeAccent] = useState("#059669");
  const [themeFont, setThemeFont] = useState<StorefrontFontPreset>("sans");
  const [themeLayout, setThemeLayout] = useState<StorefrontLayoutPreset>("grid");
  const [themeHideOos, setThemeHideOos] = useState(false);
  /** Keeps `banner_secondary_url` stable when the URL field was removed from the dashboard form. */
  const lastNormalizedThemeRef = useRef<ReturnType<typeof normalizeStorefrontTheme> | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth?.user?.id;
    if (!uid) {
      setSellerId(null);
      setBlocks([]);
      return;
    }
    const { data: prof, error: pErr } = await supabase
      .from("profiles")
      .select("id, is_seller, slug, storefront_theme")
      .eq("id", uid)
      .maybeSingle();
    if (pErr) throw pErr;
    if (!prof?.is_seller) {
      setSellerId(null);
      setBlocks([]);
      return;
    }
    setSellerId(uid);
    setSlug(typeof prof.slug === "string" ? prof.slug : null);
    const t = normalizeStorefrontTheme(prof.storefront_theme);
    lastNormalizedThemeRef.current = t;
    setThemeAccent(t.accent);
    setThemeFont(t.font);
    setThemeLayout(t.layout);
    setThemeHideOos(t.hide_out_of_stock);

    const { data, error: bErr } = await supabase
      .from("storefront_blocks")
      .select("id, type, payload, sort_order, is_visible")
      .eq("seller_id", uid)
      .eq("type", "hero")
      .order("sort_order", { ascending: true });

    if (bErr) {
      if (bErr.code === "42P01" || bErr.message?.includes("storefront_blocks")) {
        setBlocks([]);
        setError("Storefront blocks are not available yet. Apply the latest database migration, then refresh this page.");
        return;
      }
      throw bErr;
    }
    const rows = (data || []) as BlockRow[];
    let effectiveRows = rows;
    if (effectiveRows.length === 0) {
      const { data: inserted, error: insErr } = await supabase
        .from("storefront_blocks")
        .insert({
          seller_id: uid,
          type: "hero",
          payload: {
            headline: "Your headline in a few bold words",
            tagline: "One line about shipping, drops, or what makes you different.",
          },
          sort_order: 0,
          is_visible: true,
        })
        .select("id, type, payload, sort_order, is_visible")
        .single();
      if (!insErr && inserted) {
        effectiveRows = [inserted as BlockRow];
      }
    }
    setBlocks(effectiveRows);
    const nextHero: Record<string, { headline: string; tagline: string }> = {};
    for (const b of effectiveRows) {
      if (b.type === "hero") {
        const pl = b.payload || {};
        nextHero[b.id] = {
          headline: typeof pl.headline === "string" ? pl.headline : "",
          tagline: typeof pl.tagline === "string" ? pl.tagline : "",
        };
      }
    }
    setHeroDrafts(nextHero);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        await load();
      } catch (e: unknown) {
        if (mounted) setError(e instanceof Error ? e.message : "Could not load blocks.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [load]);

  const saveHero = async (id: string) => {
    setSavingId(id);
    setError(null);
    try {
      const raw = heroDrafts[id] ?? { headline: "", tagline: "" };
      const headline = raw.headline.trim().slice(0, STOREFRONT_HERO_HEADLINE_MAX);
      const tagline = raw.tagline.trim().slice(0, STOREFRONT_HERO_TAGLINE_MAX);
      let finalHeadline = headline;
      if (!finalHeadline) finalHeadline = "Welcome to our shop";
      const { error: upErr } = await supabase
        .from("storefront_blocks")
        .update({
          payload: { headline: finalHeadline, tagline },
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (upErr) throw upErr;
      router.replace("/dashboard?storefront_saved=hero");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not save hero.");
    } finally {
      setSavingId(null);
    }
  };

  const saveStorefrontTheme = async () => {
    if (!sellerId) return;
    setSavingId("theme");
    setError(null);
    try {
      const themePayload = normalizeStorefrontTheme({
        accent: themeAccent,
        font: themeFont,
        banner_secondary_url: lastNormalizedThemeRef.current?.banner_secondary_url ?? null,
        layout: themeLayout,
        hide_out_of_stock: themeHideOos,
      });
      const { error: upErr } = await supabase
        .from("profiles")
        .update({
          storefront_theme: {
            accent: themePayload.accent,
            font: themePayload.font,
            banner_secondary_url: themePayload.banner_secondary_url,
            layout: themePayload.layout,
            hide_out_of_stock: themePayload.hide_out_of_stock,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", sellerId);
      if (upErr) throw upErr;
      lastNormalizedThemeRef.current = themePayload;
      router.replace("/dashboard?storefront_saved=appearance");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not save theme.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  if (!sellerId) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm font-semibold text-gray-600">Storefront sections are available once you are set up as a seller.</p>
        <Link
          href="/account/start-selling"
          className="mt-4 inline-block text-sm font-black uppercase tracking-widest text-emerald-600 hover:underline"
        >
          Start selling
        </Link>
      </div>
    );
  }

  const previewHref = slug ? `/${slug}` : null;

  return (
    <div className={`mx-auto max-w-3xl pb-16`}>
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dashboard</p>
        <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-gray-900 md:text-3xl">Storefront customization</h1>
        <p className="mt-2 text-sm font-medium text-gray-600">
          Tune how your public shop{" "}
          <strong className="font-mono text-gray-900">{slug ? `/${slug}` : "link"}</strong> looks and behaves: colors, layout, fonts, catalog rules, then your{" "}
          <strong className="text-gray-900">hero</strong> copy. Logo and cover still open from the <strong className="text-gray-900">About</strong> panel on the live shop.
        </p>
        {previewHref ? (
          <a
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-700 hover:underline"
          >
            <ExternalLink size={14} />
            Preview live storefront
          </a>
        ) : null}
      </div>

      {error ? (
        <p className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">{error}</p>
      ) : null}

      <section aria-label="Storefront appearance" className="mb-10 space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Appearance &amp; catalog</h2>
        <StorefrontThemeFields
          accent={themeAccent}
          font={themeFont}
          layout={themeLayout}
          hideOutOfStock={themeHideOos}
          onAccentChange={setThemeAccent}
          onFontChange={setThemeFont}
          onLayoutChange={setThemeLayout}
          onHideOutOfStockChange={setThemeHideOos}
        />
        <button
          type="button"
          disabled={!!savingId}
          onClick={() => void saveStorefrontTheme()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-gray-800 disabled:opacity-50 sm:w-auto"
        >
          {savingId === "theme" ? (
            <>
              <Loader2 className="inline h-4 w-4 animate-spin" /> Saving…
            </>
          ) : (
            "Save appearance"
          )}
        </button>
      </section>

      <h2 className="mb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Hero</h2>

      {blocks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/80 px-6 py-10 text-center text-sm font-medium text-gray-600">
          Hero copy could not be created automatically. Apply the latest database migration, then refresh this page.
        </div>
      ) : (
        <ul className="space-y-4">
          {blocks.map((row) => (
            <li key={row.id} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                <Sparkles size={16} className="text-emerald-500" />
                Hero
              </div>

              <div className="mt-4 space-y-4">
                <div
                  className="overflow-hidden rounded-2xl border border-gray-200 px-5 py-8 text-center text-white shadow-inner"
                  style={{
                    background: `linear-gradient(125deg, color-mix(in srgb, ${themeAccent} 88%, #020617) 0%, color-mix(in srgb, ${themeAccent} 40%, #0f172a) 100%)`,
                  }}
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">Preview</p>
                  <p className="mt-2 text-lg font-black uppercase leading-tight tracking-tight md:text-2xl">
                    {(heroDrafts[row.id]?.headline || "Headline").slice(0, STOREFRONT_HERO_HEADLINE_MAX).toUpperCase()}
                  </p>
                  {(heroDrafts[row.id]?.tagline || "").trim() ? (
                    <p className="mt-3 text-xs font-semibold text-white/85">
                      {(heroDrafts[row.id]?.tagline || "").slice(0, STOREFRONT_HERO_TAGLINE_MAX)}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Headline</label>
                  <input
                    type="text"
                    maxLength={STOREFRONT_HERO_HEADLINE_MAX}
                    value={heroDrafts[row.id]?.headline ?? ""}
                    onChange={(e) =>
                      setHeroDrafts((d) => ({
                        ...d,
                        [row.id]: { ...(d[row.id] || { headline: "", tagline: "" }), headline: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="e.g. Transform your routine here"
                  />
                  <p className="text-right text-[10px] font-bold text-gray-400">
                    {(heroDrafts[row.id]?.headline || "").length}/{STOREFRONT_HERO_HEADLINE_MAX}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tagline</label>
                  <input
                    type="text"
                    maxLength={STOREFRONT_HERO_TAGLINE_MAX}
                    value={heroDrafts[row.id]?.tagline ?? ""}
                    onChange={(e) =>
                      setHeroDrafts((d) => ({
                        ...d,
                        [row.id]: { ...(d[row.id] || { headline: "", tagline: "" }), tagline: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="e.g. Same-day Lagos delivery · Cruelty-free"
                  />
                  <p className="text-right text-[10px] font-bold text-gray-400">
                    {(heroDrafts[row.id]?.tagline || "").length}/{STOREFRONT_HERO_TAGLINE_MAX}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={savingId === row.id}
                  onClick={() => void saveHero(row.id)}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  {savingId === row.id ? "Saving…" : "Save hero"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
