module.exports = [
"[project]/storelink-app-and-web/store-link-storefront/utils/marketplaceDiscovery.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Matches store-link-mobile seller plans: Standard (free) vs Diamond (paid boost).
 * Legacy DB values `free` and `premium` are treated as Standard unless Diamond is active.
 */ __turbopack_context__.s([
    "applyMarketplaceStoreCaps",
    ()=>applyMarketplaceStoreCaps,
    "effectiveSellerTier",
    ()=>effectiveSellerTier,
    "hasActiveDiamondBoost",
    ()=>hasActiveDiamondBoost
]);
function effectiveSellerTier(plan, expiry, subscription_status) {
    const p = (plan || "").toLowerCase();
    if (p !== "diamond") return "standard";
    if ((subscription_status || "").toLowerCase() === "expired") return "standard";
    const now = new Date();
    if (expiry) {
        const exp = new Date(expiry);
        if (!Number.isNaN(exp.getTime()) && exp < now) return "standard";
    }
    return "diamond";
}
const TIER_RANK = {
    diamond: 2,
    standard: 1
};
function applyMarketplaceStoreCaps(products, caps = {
    diamond: 14,
    standard: 5
}) {
    const tierOf = (s)=>effectiveSellerTier(s?.subscription_plan, s?.subscription_expiry, s?.subscription_status);
    const sorted = [
        ...products
    ].sort((a, b)=>{
        const ea = tierOf(a.stores);
        const eb = tierOf(b.stores);
        return TIER_RANK[eb] - TIER_RANK[ea];
    });
    const counts = new Map();
    const out = [];
    for (const p of sorted){
        const eff = tierOf(p.stores);
        const cap = eff === "diamond" ? caps.diamond : caps.standard;
        const capKey = p.stores?.id || p.seller_id;
        const n = counts.get(capKey) || 0;
        if (n < cap) {
            counts.set(capKey, n + 1);
            out.push(p);
        }
    }
    return out;
}
function hasActiveDiamondBoost(plan, expiry, subscription_status) {
    return effectiveSellerTier(plan, expiry, subscription_status) === "diamond";
}
}),
"[project]/storelink-app-and-web/store-link-storefront/components/onboarding/OnboardingProgressCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OnboardingProgressCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
"use client";
;
;
function OnboardingProgressCard({ continueHref, missingFields }) {
    if (!continueHref && missingFields.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-emerald-200 bg-emerald-50 p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[10px] font-black uppercase tracking-widest text-emerald-700",
                children: "Setup status"
            }, void 0, false, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/onboarding/OnboardingProgressCard.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            missingFields.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs font-medium text-emerald-900 mt-1",
                children: [
                    "Missing: ",
                    missingFields.join(" · ")
                ]
            }, void 0, true, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/onboarding/OnboardingProgressCard.tsx",
                lineNumber: 17,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs font-medium text-emerald-900 mt-1",
                children: "Core onboarding fields are complete."
            }, void 0, false, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/onboarding/OnboardingProgressCard.tsx",
                lineNumber: 21,
                columnNumber: 9
            }, this),
            continueHref && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: continueHref,
                className: "inline-flex mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest",
                children: "Continue setup"
            }, void 0, false, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/onboarding/OnboardingProgressCard.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/onboarding/OnboardingProgressCard.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
}),
"[project]/storelink-app-and-web/store-link-storefront/lib/onboardingChecklist.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMissingOnboardingFields",
    ()=>getMissingOnboardingFields
]);
function getMissingOnboardingFields(profile, isSeller, store) {
    const missing = [];
    if (!profile?.full_name?.trim()) missing.push("Full name");
    if (!profile?.slug?.trim()) missing.push("Profile slug");
    if (!profile?.phone_number?.trim()) missing.push("Phone number");
    if (!profile?.location_state?.trim()) missing.push("State");
    if (!profile?.location_city?.trim()) missing.push("City");
    if (!profile?.location?.trim()) missing.push("Home address");
    if (isSeller) {
        // Storefront sellers may have profile-level slug/location even when store row isn't readable yet.
        const storeSlug = store?.slug?.trim() || profile?.slug?.trim() || "";
        const storeAddress = store?.location?.trim() || profile?.location?.trim() || "";
        if (!storeSlug) missing.push("Store slug");
        if (!storeAddress) missing.push("Store address");
    } else {
        const oc = profile?.onboarding_completed === true;
        const step = (profile?.onboarding_step || "").toLowerCase();
        if (!oc || step === "buyer_interests") {
            const n = Array.isArray(profile?.buyer_interested_categories) ? profile.buyer_interested_categories.filter(Boolean).length : 0;
            if (n < 3) missing.push("Shopping interests (pick 3+ categories)");
        }
    }
    return missing;
}
}),
"[project]/storelink-app-and-web/store-link-storefront/lib/claimGuestOrders.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "claimGuestOrdersForSession",
    ()=>claimGuestOrdersForSession
]);
async function claimGuestOrdersForSession(supabase, params) {
    const email = params.email?.trim() || null;
    const digits = params.phoneDigits?.replace(/\D/g, "") || "";
    const phone = digits.length >= 10 ? digits : null;
    if (!email && !phone) return {
        claimedCount: 0
    };
    const { data, error } = await supabase.rpc("claim_guest_orders", {
        p_user_id: params.userId,
        p_email: email,
        p_phone: phone
    });
    if (error) {
        return {
            claimedCount: 0
        };
    }
    const row = Array.isArray(data) ? data[0] : data;
    const n = typeof row?.claimed_count === "number" ? row.claimed_count : 0;
    return {
        claimedCount: n
    };
}
}),
"[project]/storelink-app-and-web/store-link-storefront/lib/slugAvailability.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkSlugAvailability",
    ()=>checkSlugAvailability,
    "normalizeSlug",
    ()=>normalizeSlug
]);
function normalizeSlug(raw) {
    return raw.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
async function checkSlugAvailability(supabase, slugRaw, currentProfileId) {
    const slug = normalizeSlug(slugRaw);
    if (!slug) return "taken";
    const [{ data: profileHit }, { data: storeHit }] = await Promise.all([
        supabase.from("profiles").select("id").eq("slug", slug).maybeSingle(),
        supabase.from("stores").select("id").eq("slug", slug).maybeSingle()
    ]);
    if (profileHit && currentProfileId && profileHit.id === currentProfileId) {
        return "available";
    }
    return profileHit || storeHit ? "taken" : "available";
}
}),
"[project]/storelink-app-and-web/store-link-storefront/lib/ensureWebStorefront.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ensureWebStorefrontFromProfile",
    ()=>ensureWebStorefrontFromProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$slugAvailability$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/lib/slugAvailability.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$onboardingState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/lib/onboardingState.ts [app-ssr] (ecmascript)");
;
;
/** Normalize phone for stores.whatsapp_number (same rules as merchant setup). */ function normalizeWhatsApp(raw) {
    let wa = String(raw || "").replace(/\D/g, "");
    if (!wa) return "";
    if (wa.startsWith("0")) wa = "234" + wa.substring(1);
    else if (!wa.startsWith("234")) wa = "234" + wa;
    return wa;
}
async function pickAvailableStoreSlug(supabase, userId, baseRaw) {
    const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$slugAvailability$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeSlug"])(baseRaw) || `seller-${userId.slice(0, 8)}`;
    const candidates = [
        base,
        `${base}-shop`,
        `${base}-store`,
        `shop-${userId.replace(/-/g, "").slice(0, 12)}`,
        `store-${userId.replace(/-/g, "").slice(0, 12)}`,
        `sl-${userId.replace(/-/g, "").slice(0, 16)}`
    ];
    for (const c of candidates){
        const slug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$slugAvailability$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeSlug"])(c);
        if (!slug) continue;
        const { data } = await supabase.from("stores").select("owner_id").eq("slug", slug).maybeSingle();
        const row = data;
        if (!row?.owner_id) return slug;
        if (row.owner_id === userId) return slug;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$slugAvailability$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeSlug"])(`seller-${userId}`) || `seller-${userId.replace(/-/g, "")}`;
}
async function ensureWebStorefrontFromProfile(supabase, userId, userEmail) {
    const { data: existing } = await supabase.from("stores").select("id").eq("owner_id", userId).maybeSingle();
    if (existing?.id) {
        return {
            ok: true,
            created: false,
            storeId: existing.id
        };
    }
    const { data: profile } = await supabase.from("profiles").select("slug, display_name, full_name, bio, logo_url, category, location, phone_number, location_state, location_city, is_seller, onboarding_completed, onboarding_step").eq("id", userId).maybeSingle();
    const p = profile;
    if (!p?.is_seller || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$onboardingState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isProfileOnboardingComplete"])(p)) {
        return {
            ok: false,
            reason: "not_eligible"
        };
    }
    const displayName = p.display_name?.trim() || p.full_name?.trim() || "My storefront";
    const slugSource = p.slug?.trim() || displayName;
    const slug = await pickAvailableStoreSlug(supabase, userId, slugSource);
    const locationParts = [
        p.location?.trim(),
        p.location_city?.trim(),
        p.location_state?.trim()
    ].filter(Boolean);
    const locationStr = locationParts.length > 0 ? locationParts.join(", ") : "Nigeria";
    let whatsapp = normalizeWhatsApp(p.phone_number);
    if (!whatsapp) whatsapp = "2340000000001";
    const logoUrl = p.logo_url?.trim() || null;
    const row = {
        owner_id: userId,
        owner_email: userEmail,
        name: displayName,
        slug,
        category: (p.category?.trim() || "general").toLowerCase(),
        location: locationStr,
        whatsapp_number: whatsapp,
        description: p.bio?.trim() || "",
        instagram_handle: "",
        tiktok_url: "",
        logo_url: logoUrl,
        cover_image_url: logoUrl,
        subscription_plan: "standard",
        subscription_expiry: null,
        status: "active"
    };
    const { data: inserted, error } = await supabase.from("stores").insert(row).select("id").single();
    if (error) {
        console.warn("[ensureWebStorefrontFromProfile]", error.message);
        return {
            ok: false,
            reason: "insert_failed",
            detail: error.message
        };
    }
    const ins = inserted;
    return {
        ok: true,
        created: true,
        storeId: ins?.id ?? null
    };
}
}),
"[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UnifiedHubLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-ssr] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-ssr] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/bell.js [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/log-out.js [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/menu.js [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/crown.js [app-ssr] (ecmascript) <export default as Crown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$badge$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BadgeCheck$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/badge-check.js [app-ssr] (ecmascript) <export default as BadgeCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/coins.js [app-ssr] (ecmascript) <export default as Coins>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/heart.js [app-ssr] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$life$2d$buoy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LifeBuoy$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/life-buoy.js [app-ssr] (ecmascript) <export default as LifeBuoy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/store.js [app-ssr] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$utils$2f$marketplaceDiscovery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/utils/marketplaceDiscovery.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$onboardingState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/lib/onboardingState.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$components$2f$onboarding$2f$OnboardingProgressCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/components/onboarding/OnboardingProgressCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$onboardingChecklist$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/lib/onboardingChecklist.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$claimGuestOrders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/lib/claimGuestOrders.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$ensureWebStorefront$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/lib/ensureWebStorefront.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
function linkActive(pathname, href) {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/account") return pathname === "/account";
    return pathname === href || pathname.startsWith(href + "/");
}
function UnifiedHubLayout({ children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [effectivePlan, setEffectivePlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("standard");
    const [unreadCount, setUnreadCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [onboardingPath, setOnboardingPath] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [missingFields, setMissingFields] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [meName, setMeName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [meLogoUrl, setMeLogoUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hasStore, setHasStore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSellerFlag, setIsSellerFlag] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sellingLinks, setSellingLinks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [shoppingLinks, setShoppingLinks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [growLinks, setGrowLinks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        let notifyChannel = null;
        const load = async ()=>{
            const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            const [{ data: storeRes }, notifyRes, profileRes, ctx] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("stores").select("id, subscription_expiry, subscription_plan, subscription_status, slug, location").eq("owner_id", user.id).maybeSingle(),
                __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("notifications").select("*", {
                    count: "exact",
                    head: true
                }).eq("user_id", user.id).eq("is_read", false),
                __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("profiles").select("full_name, phone_number, slug, location_state, location_city, location, display_name, logo_url, is_seller, onboarding_completed, onboarding_step, buyer_interested_categories").eq("id", user.id).maybeSingle(),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$onboardingState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchOnboardingContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"], user.id)
            ]);
            const resume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$onboardingState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAccountOnboardingContinuePath"])(ctx, ctx.profile);
            if (resume.startsWith("/onboarding")) {
                router.replace(resume);
                return;
            }
            const profile = profileRes.data;
            const onboardingDone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$onboardingState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isProfileOnboardingComplete"])(ctx.profile);
            const pPhone = String(profile?.phone_number ?? "");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$claimGuestOrders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["claimGuestOrdersForSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"], {
                userId: user.id,
                email: user.email ?? null,
                phoneDigits: pPhone || null
            });
            if (cancelled) return;
            let store = storeRes;
            const seller = !!profile?.is_seller;
            if (!store?.id && seller && onboardingDone) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$ensureWebStorefront$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ensureWebStorefrontFromProfile"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"], user.id, user.email ?? null);
                const { data: storeAgain } = await __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("stores").select("id, subscription_expiry, subscription_plan, subscription_status, slug, location").eq("owner_id", user.id).maybeSingle();
                if (storeAgain) store = storeAgain;
            }
            const has = !!store?.id;
            setHasStore(has);
            setIsSellerFlag(seller);
            setMeName(String(profile?.display_name || profile?.full_name || user.email?.split("@")[0] || "Account").trim());
            setMeLogoUrl(profile?.logo_url ? String(profile.logo_url).trim() || null : null);
            const postLoginPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$onboardingState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getOnboardingHubRedirect"])(ctx);
            setOnboardingPath(postLoginPath.startsWith("/onboarding") ? postLoginPath : null);
            setMissingFields((0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$onboardingChecklist$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMissingOnboardingFields"])(profile, Boolean(profile?.is_seller), store));
            const unread = notifyRes.count || 0;
            setUnreadCount(unread);
            if (store?.subscription_plan != null) {
                setEffectivePlan((0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$utils$2f$marketplaceDiscovery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["effectiveSellerTier"])(store.subscription_plan, store.subscription_expiry, store.subscription_status));
            }
            const sell = has ? [
                {
                    name: "Store orders",
                    href: "/dashboard/orders",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"]
                },
                {
                    name: "Notifications",
                    href: "/dashboard/notifications",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"],
                    badge: unread > 0 ? unread : null
                },
                {
                    name: "Store Coin loyalty",
                    href: "/dashboard/loyalty",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__["Coins"],
                    isNew: true,
                    color: "text-amber-500"
                },
                {
                    name: "Visibility & plans",
                    href: "/dashboard/subscription",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__["Crown"]
                },
                {
                    name: "Verification",
                    href: "/dashboard/verification",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$badge$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BadgeCheck$3e$__["BadgeCheck"]
                },
                {
                    name: "Seller settings",
                    href: "/dashboard/settings",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
                }
            ] : [];
            const shop = [
                {
                    name: "My purchases",
                    href: "/account/orders",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"]
                },
                {
                    name: "Wallet",
                    href: "/account/wallet",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__["Coins"]
                },
                {
                    name: "Wishlist",
                    href: "/account/wishlist",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"]
                },
                {
                    name: "Profile",
                    href: "/account/profile",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]
                },
                {
                    name: "Account settings",
                    href: "/account/settings",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
                },
                {
                    name: "Help & support",
                    href: "/account/support",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$life$2d$buoy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LifeBuoy$3e$__["LifeBuoy"]
                }
            ];
            const grow = [];
            if (!has && !seller) {
                grow.push({
                    name: "Start selling",
                    href: "/account/start-selling",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"]
                });
            } else if (!has && seller && !onboardingDone) {
                grow.push({
                    name: "Continue storefront setup",
                    href: "/onboarding/seller/identity",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"]
                });
            }
            setSellingLinks(sell);
            setShoppingLinks(shop);
            setGrowLinks(grow);
            notifyChannel = __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].channel(`user-notifications-${user.id}`).on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "notifications",
                filter: `user_id=eq.${user.id}`
            }, ()=>setUnreadCount((prev)=>prev + 1)).subscribe();
            setLoading(false);
        };
        load();
        return ()=>{
            cancelled = true;
            if (notifyChannel) __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].removeChannel(notifyChannel);
        };
    }, [
        router
    ]);
    const handleLogout = async ()=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
        window.location.assign("/login");
    };
    const planHint = effectivePlan === "diamond" ? "Diamond visibility boost active" : hasStore ? "Standard — free storefront" : "Shopping profile";
    const overviewHref = "/dashboard";
    const renderLink = (link, onNavigate)=>{
        const active = linkActive(pathname, link.href);
        const Icon = link.icon;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            href: link.href,
            onClick: onNavigate,
            className: `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${active ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            size: 18,
                            className: link.color ? link.color : ""
                        }, void 0, false, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                            lineNumber: 232,
                            columnNumber: 11
                        }, this),
                        link.badge ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "absolute -top-1.5 -right-1.5 flex h-3 w-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                    lineNumber: 235,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                    lineNumber: 236,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                            lineNumber: 234,
                            columnNumber: 13
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                    lineNumber: 231,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: link.name
                }, void 0, false, {
                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                    lineNumber: 240,
                    columnNumber: 9
                }, this),
                link.badge ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "ml-auto bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md",
                    children: link.badge
                }, void 0, false, {
                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                    lineNumber: 242,
                    columnNumber: 11
                }, this) : null,
                link.isNew && !active && !link.badge ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "ml-auto bg-amber-100 text-amber-600 text-[8px] font-black px-1.5 py-0.5 rounded-md animate-pulse",
                    children: "NEW"
                }, void 0, false, {
                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                    lineNumber: 245,
                    columnNumber: 11
                }, this) : null
            ]
        }, link.name + link.href, true, {
            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
            lineNumber: 223,
            columnNumber: 7
        }, this);
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-screen flex items-center justify-center bg-gray-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "animate-spin text-gray-400"
            }, void 0, false, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                lineNumber: 254,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
            lineNumber: 253,
            columnNumber: 7
        }, this);
    }
    const closeMobile = ()=>setIsMobileMenuOpen(false);
    const navInner = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 border-b border-gray-100 shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "font-extrabold text-xl text-gray-900 flex items-center gap-2 tracking-tight",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"], {
                                className: "text-emerald-600",
                                size: 24
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                lineNumber: 265,
                                columnNumber: 11
                            }, this),
                            " StoreLink"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                        lineNumber: 264,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-4",
                        children: "Your hub"
                    }, void 0, false, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 mt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-11 h-11 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0 flex items-center justify-center",
                                children: meLogoUrl ? // eslint-disable-next-line @next/next/no-img-element
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: meLogoUrl,
                                    alt: "",
                                    className: "w-full h-full object-cover"
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                    lineNumber: 272,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-black text-gray-400 uppercase",
                                    children: meName.slice(0, 1)
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                    lineNumber: 274,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                lineNumber: 269,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-bold text-gray-900 text-sm truncate",
                                        children: meName
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                        lineNumber: 278,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-1.5 mt-1",
                                        children: [
                                            hasStore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md",
                                                children: "Seller"
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                                lineNumber: 281,
                                                columnNumber: 17
                                            }, this),
                                            !hasStore && isSellerFlag && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md",
                                                children: "Becoming a seller"
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                                lineNumber: 286,
                                                columnNumber: 17
                                            }, this),
                                            !isSellerFlag && !hasStore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] font-black uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md",
                                                children: "Shopper"
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                                lineNumber: 291,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                        lineNumber: 279,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                lineNumber: 277,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                lineNumber: 263,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1 p-4 space-y-1 overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "px-4 pt-2 pb-1 text-[9px] font-black uppercase tracking-widest text-gray-400",
                        children: "Overview"
                    }, void 0, false, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                        lineNumber: 301,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: overviewHref,
                        onClick: closeMobile,
                        className: `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${pathname === "/dashboard" ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"], {
                                size: 18,
                                className: "text-emerald-600"
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                lineNumber: 309,
                                columnNumber: 11
                            }, this),
                            "Home"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                        lineNumber: 302,
                        columnNumber: 9
                    }, this),
                    sellingLinks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "px-4 pt-6 pb-1 text-[9px] font-black uppercase tracking-widest text-gray-400",
                                children: "Selling"
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                lineNumber: 315,
                                columnNumber: 13
                            }, this),
                            sellingLinks.map((l)=>renderLink(l, closeMobile))
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "px-4 pt-6 pb-1 text-[9px] font-black uppercase tracking-widest text-gray-400",
                        children: "Shopping"
                    }, void 0, false, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                        lineNumber: 320,
                        columnNumber: 9
                    }, this),
                    shoppingLinks.map((l)=>renderLink(l, closeMobile)),
                    growLinks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "px-4 pt-6 pb-1 text-[9px] font-black uppercase tracking-widest text-gray-400",
                                children: "Grow"
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                lineNumber: 325,
                                columnNumber: 13
                            }, this),
                            growLinks.map((l)=>renderLink(l, closeMobile))
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                lineNumber: 300,
                columnNumber: 7
            }, this),
            hasStore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-4 mb-2 p-3 rounded-xl border bg-emerald-50/50 border-emerald-100 shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] font-black text-emerald-800 uppercase tracking-widest leading-relaxed",
                        children: planHint
                    }, void 0, false, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                        lineNumber: 333,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[9px] text-emerald-800/75 mt-1 leading-snug",
                        children: "Standard is free forever. Upgrade for marketplace visibility boosts."
                    }, void 0, false, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                        lineNumber: 334,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                lineNumber: 332,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-t border-gray-100 shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: handleLogout,
                    className: "flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                            lineNumber: 344,
                            columnNumber: 11
                        }, this),
                        " Log out"
                    ]
                }, void 0, true, {
                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                    lineNumber: 339,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                lineNumber: 338,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-30",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "font-extrabold text-lg text-gray-900 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"], {
                                className: "text-emerald-600",
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                lineNumber: 354,
                                columnNumber: 11
                            }, this),
                            " StoreLink"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                        lineNumber: 353,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard/notifications",
                                className: "p-2 bg-red-50 rounded-lg text-red-600 relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                        lineNumber: 359,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                        lineNumber: 360,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                lineNumber: 358,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setIsMobileMenuOpen(true),
                                className: "p-2 text-gray-700 hover:bg-gray-100 rounded-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                    size: 24
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                    lineNumber: 364,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                lineNumber: 363,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                        lineNumber: 356,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                lineNumber: 352,
                columnNumber: 7
            }, this),
            isMobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 md:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity",
                        onClick: closeMobile
                    }, void 0, false, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                        lineNumber: 371,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-y-0 left-0 w-72 bg-white border-r border-gray-200 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200 overflow-y-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 flex justify-end border-b border-gray-100",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: closeMobile,
                                    className: "p-2 text-gray-500 hover:bg-gray-100 rounded-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 24
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                        lineNumber: 375,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                    lineNumber: 374,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                                lineNumber: 373,
                                columnNumber: 13
                            }, this),
                            navInner
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                        lineNumber: 372,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                lineNumber: 370,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "w-72 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-screen top-0 overflow-hidden z-20 no-scrollbar",
                children: navInner
            }, void 0, false, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                lineNumber: 383,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 md:ml-72 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-full overflow-hidden flex flex-col gap-4 min-h-screen",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$components$2f$onboarding$2f$OnboardingProgressCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        continueHref: onboardingPath,
                        missingFields: missingFields
                    }, void 0, false, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                        lineNumber: 388,
                        columnNumber: 9
                    }, this),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
                lineNumber: 387,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx",
        lineNumber: 351,
        columnNumber: 5
    }, this);
}
}),
"[project]/storelink-app-and-web/store-link-storefront/app/dashboard/layout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$components$2f$dashboard$2f$UnifiedHubLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/components/dashboard/UnifiedHubLayout.tsx [app-ssr] (ecmascript)");
"use client";
;
;
function DashboardLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$components$2f$dashboard$2f$UnifiedHubLayout$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/layout.tsx",
        lineNumber: 6,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=storelink-app-and-web_store-link-storefront_e3029bd6._.js.map