(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/storelink-app-and-web/store-link-storefront/lib/subscriptionPricing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Matches store-link-mobile `SUBSCRIPTION_PRICES.NGN.seller_diamond` and term discounts. */ __turbopack_context__.s([
    "BILLING_DURATIONS",
    ()=>BILLING_DURATIONS,
    "SELLER_DIAMOND_PRICE_NGN",
    ()=>SELLER_DIAMOND_PRICE_NGN,
    "SUBSCRIPTION_PRICES",
    ()=>SUBSCRIPTION_PRICES,
    "calculateDiamondPrice",
    ()=>calculateDiamondPrice
]);
const SELLER_DIAMOND_PRICE_NGN = 7500;
const SUBSCRIPTION_PRICES = {
    NGN: {
        seller_diamond: 7500,
        buyer_diamond: 2500
    },
    GHS: {
        seller_diamond: 54,
        buyer_diamond: 14
    },
    ZAR: {
        seller_diamond: 1000,
        buyer_diamond: 267
    },
    KES: {
        seller_diamond: 625,
        buyer_diamond: 167
    },
    XOF: {
        seller_diamond: 8338,
        buyer_diamond: 2220
    },
    EGP: {
        seller_diamond: 150,
        buyer_diamond: 40
    },
    RWF: {
        seller_diamond: 21438,
        buyer_diamond: 5715
    },
    USD: {
        seller_diamond: 4.69,
        buyer_diamond: 1.25
    }
};
const BILLING_DURATIONS = [
    {
        months: 1,
        label: "Monthly",
        discount: 0
    },
    {
        months: 3,
        label: "Quarterly",
        discount: 0.05
    },
    {
        months: 6,
        label: "Biannual",
        discount: 0.08
    },
    {
        months: 12,
        label: "Yearly",
        discount: 0.12
    }
];
function calculateDiamondPrice(role, selectedMonths, currencyCode = "NGN") {
    const code = currencyCode.toUpperCase();
    const row = SUBSCRIPTION_PRICES[code] ?? SUBSCRIPTION_PRICES.NGN;
    const basePrice = role === "seller" ? row.seller_diamond : row.buyer_diamond;
    const config = BILLING_DURATIONS.find((d)=>d.months === selectedMonths);
    const discount = config?.discount ?? 0;
    const base = basePrice * selectedMonths;
    const finalPrice = Math.round(base * (1 - discount));
    const perMonth = Math.round(finalPrice / selectedMonths);
    return {
        finalPrice,
        perMonth,
        discount,
        currencyCode: code
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SubscriptionPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/trophy.js [app-client] (ecmascript) <export default as Trophy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$utils$2f$marketplaceDiscovery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/utils/marketplaceDiscovery.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$subscriptionPricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/lib/subscriptionPricing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/html2canvas/dist/html2canvas.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/jspdf/dist/jspdf.es.min.js [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
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
const PaystackButton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/storelink-app-and-web/store-link-storefront/node_modules/react-paystack/dist/index.es.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.PaystackButton), {
    loadableGenerated: {
        modules: [
            "[project]/storelink-app-and-web/store-link-storefront/node_modules/react-paystack/dist/index.es.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = PaystackButton;
function SubscriptionPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [currentPlan, setCurrentPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("standard");
    const [expiryDate, setExpiryDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [subscriptionStatus, setSubscriptionStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [storeName, setStoreName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [storeSlug, setStoreSlug] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [statusMsg, setStatusMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showSuccessModal, setShowSuccessModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [upgradedPlan, setUpgradedPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [receiptRef, setReceiptRef] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const receiptExportRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isDownloading, setIsDownloading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SubscriptionPage.useEffect": ()=>{
            const loadData = {
                "SubscriptionPage.useEffect.loadData": async ()=>{
                    const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
                    if (!user) return router.push("/login");
                    setUser(user);
                    const { data: profile } = await __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("profiles").select("display_name, full_name, slug, subscription_plan, subscription_expiry, subscription_status").eq("id", user.id).maybeSingle();
                    if (profile) {
                        const label = profile.display_name?.trim() || profile.full_name?.trim() || user.email?.split("@")[0] || "My storefront";
                        setStoreName(label);
                        setStoreSlug(profile.slug?.trim() || "");
                        setCurrentPlan(profile.subscription_plan || "standard");
                        setExpiryDate(profile.subscription_expiry ?? null);
                        setSubscriptionStatus(profile.subscription_status ?? null);
                    }
                    setLoading(false);
                }
            }["SubscriptionPage.useEffect.loadData"];
            loadData();
        }
    }["SubscriptionPage.useEffect"], [
        router
    ]);
    const handleSuccess = async (reference, amountPaid)=>{
        const now = new Date();
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        let newExpiryDate;
        const activeDiamond = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$utils$2f$marketplaceDiscovery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["effectiveSellerTier"])(currentPlan, expiryDate, subscriptionStatus) === "diamond";
        if (activeDiamond && expiryDate && new Date(expiryDate) > now) {
            newExpiryDate = new Date(new Date(expiryDate).getTime() + thirtyDaysInMs);
        } else {
            newExpiryDate = new Date(now.getTime() + thirtyDaysInMs);
        }
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("profiles").update({
            subscription_plan: "diamond",
            subscription_expiry: newExpiryDate.toISOString(),
            subscription_status: "active"
        }).eq("id", user.id);
        await __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("transactions").insert({
            seller_id: user.id,
            owner_id: user.id,
            amount: amountPaid,
            plan_type: "diamond",
            status: "success"
        });
        if (error) {
            setStatusMsg({
                type: "error",
                text: "Payment received but update failed. Contact Support."
            });
        } else {
            setReceiptRef(reference.reference);
            setUpgradedPlan("diamond");
            setExpiryDate(newExpiryDate.toISOString());
            setCurrentPlan("diamond");
            setSubscriptionStatus(null);
            setShowSuccessModal(true);
        }
    };
    const handleDownloadReceipt = async ()=>{
        if (!receiptExportRef.current) return;
        setIsDownloading(true);
        try {
            const element = receiptExportRef.current;
            const canvas = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(element, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#ffffff"
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = imgProps.height * pdfWidth / imgProps.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`StoreLink_Receipt_${receiptRef || 'Subscription'}.pdf`);
        } catch (err) {
            console.error("PDF Export failed", err);
        } finally{
            setIsDownloading(false);
        }
    };
    const getPaystackConfig = ()=>{
        const amount = __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$subscriptionPricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SELLER_DIAMOND_PRICE_NGN"];
        const activeDiamond = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$utils$2f$marketplaceDiscovery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["effectiveSellerTier"])(currentPlan, expiryDate, subscriptionStatus) === "diamond";
        const renewing = activeDiamond && expiryDate && new Date(expiryDate) > new Date();
        return {
            reference: new Date().getTime().toString(),
            email: user?.email || "customer@storelink.com",
            amount: amount * 100,
            publicKey: ("TURBOPACK compile-time value", "pk_test_fed9bf23a9bf19fe8d89f9c56d0d84f56eb77ded") || "",
            text: renewing ? "Renew Diamond" : "Upgrade to Diamond",
            onSuccess: (ref)=>handleSuccess(ref, amount),
            onClose: ()=>{
                setStatusMsg({
                    type: "error",
                    text: "Payment cancelled."
                });
                setTimeout(()=>setStatusMsg(null), 3000);
            }
        };
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-screen flex items-center justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
            className: "animate-spin text-gray-400"
        }, void 0, false, {
            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
            lineNumber: 164,
            columnNumber: 82
        }, this)
    }, void 0, false, {
        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
        lineNumber: 164,
        columnNumber: 23
    }, this);
    const effective = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$utils$2f$marketplaceDiscovery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["effectiveSellerTier"])(currentPlan, expiryDate, subscriptionStatus);
    const displayTier = effective === "diamond" ? "Diamond" : "Standard";
    const boostLapsed = currentPlan === "diamond" && effective === "standard";
    const diamondPriceLabel = __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$subscriptionPricing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SELLER_DIAMOND_PRICE_NGN"].toLocaleString("en-NG");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 pb-20 font-sans relative print:bg-white overflow-x-hidden",
        children: [
            showSuccessModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md animate-in fade-in duration-300 print:hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white w-full max-w-lg rounded-[2.5rem] p-6 md:p-10 text-center shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-500 overflow-y-auto max-h-[90vh]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                                    size: 40,
                                    className: "text-emerald-600 animate-bounce"
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                    lineNumber: 179,
                                    columnNumber: 18
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    className: "absolute -top-1 -right-1 text-amber-500 animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                    lineNumber: 180,
                                    columnNumber: 18
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                            lineNumber: 178,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl md:text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight",
                            children: "Plan upgraded!"
                        }, void 0, false, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                            lineNumber: 183,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 font-medium mb-8 text-sm md:text-base",
                            children: [
                                "Congratulations! ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gray-900 font-bold",
                                    children: storeName
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                    lineNumber: 185,
                                    columnNumber: 34
                                }, this),
                                " is now on the ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-emerald-600 font-black",
                                    children: upgradedPlan.toUpperCase()
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                    lineNumber: 185,
                                    columnNumber: 109
                                }, this),
                                " plan."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                            lineNumber: 184,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-50 border border-gray-100 rounded-[2rem] p-5 md:p-6 mb-8 text-left space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center pb-3 border-b border-gray-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"], {
                                                    className: "text-emerald-600",
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-bold text-[10px] uppercase tracking-tighter",
                                                    children: "Transaction Receipt"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                    lineNumber: 192,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                            lineNumber: 190,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] font-mono text-gray-400",
                                            children: [
                                                "#",
                                                receiptRef.slice(-8)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                            lineNumber: 194,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                    lineNumber: 189,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-500 font-bold uppercase text-[10px] tracking-widest",
                                            children: "Amount Paid"
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                            lineNumber: 197,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-black text-gray-900",
                                            children: [
                                                "₦",
                                                diamondPriceLabel
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                            lineNumber: 198,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                    lineNumber: 196,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleDownloadReceipt,
                                    disabled: isDownloading,
                                    className: "w-full flex items-center justify-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest py-3 border-2 border-emerald-100 rounded-xl hover:bg-emerald-50 transition disabled:opacity-50 mt-2",
                                    children: [
                                        isDownloading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            className: "animate-spin",
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                            lineNumber: 205,
                                            columnNumber: 36
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                            lineNumber: 205,
                                            columnNumber: 85
                                        }, this),
                                        isDownloading ? "Generating..." : "Download Official Receipt"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                    lineNumber: 200,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                            lineNumber: 188,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>window.location.href = "/dashboard",
                            className: "w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl",
                            children: "GO TO DASHBOARD"
                        }, void 0, false, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                            lineNumber: 210,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                    lineNumber: 177,
                    columnNumber: 12
                }, this)
            }, void 0, false, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                lineNumber: 176,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-[-9999px] top-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: receiptExportRef,
                    className: "w-[800px] bg-white p-12",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-2xl mx-auto border-[12px] border-emerald-50 p-10 rounded-[50px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-start mb-12",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"], {
                                                        className: "text-emerald-600",
                                                        size: 32
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 226,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-black text-3xl tracking-tighter text-gray-900 uppercase",
                                                        children: "StoreLink"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 225,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 font-bold text-xs uppercase tracking-[0.2em]",
                                                children: "Official Payment Receipt"
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 229,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 224,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-right",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-black text-gray-900 uppercase",
                                                children: "Diamond subscription"
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 232,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 text-xs font-mono",
                                                children: receiptRef
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 233,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 231,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                lineNumber: 223,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-12 mb-12 pb-12 border-b border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3",
                                                children: "Billed To"
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 239,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-bold text-gray-900 text-lg",
                                                children: storeName
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 240,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-500 text-sm",
                                                children: user?.email
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 241,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 238,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-right",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3",
                                                children: "Date Issued"
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 244,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-bold text-gray-900",
                                                children: new Date().toLocaleDateString()
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 245,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-500 text-sm",
                                                children: new Date().toLocaleTimeString()
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 246,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 243,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                lineNumber: 237,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full mb-12",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-b-2 border-gray-900",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "text-left py-4 text-xs font-black uppercase",
                                                    children: "Plan Description"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                    lineNumber: 253,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "text-right py-4 text-xs font-black uppercase",
                                                    children: "Amount"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                            lineNumber: 252,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 251,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-bold text-gray-900",
                                                            children: [
                                                                "StoreLink ",
                                                                upgradedPlan.toUpperCase(),
                                                                " Subscription"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                            lineNumber: 260,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-400",
                                                            children: "30 days full platform access"
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                            lineNumber: 261,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                    lineNumber: 259,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-6 text-right font-black text-xl text-gray-900",
                                                    children: [
                                                        "₦",
                                                        diamondPriceLabel
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                    lineNumber: 263,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                            lineNumber: 258,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 257,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                lineNumber: 250,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-900 text-white p-8 rounded-[30px] flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1",
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 272,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-black text-emerald-400 uppercase tracking-tight",
                                                children: "Payment Verified"
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 273,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 271,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-right",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1",
                                                children: "Total Paid"
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 276,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-black text-3xl",
                                                children: [
                                                    "₦",
                                                    diamondPriceLabel,
                                                    ".00"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 277,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 275,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                lineNumber: 270,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-center text-[10px] text-gray-300 font-bold mt-12 uppercase tracking-[0.3em]",
                                children: "Thank you for growing with StoreLink"
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                lineNumber: 281,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                        lineNumber: 222,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                    lineNumber: 221,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white border-b border-gray-200 px-6 py-6 md:py-10 mb-8 print:hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tighter",
                                    children: "Visibility & boosts"
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                    lineNumber: 289,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500 text-sm mt-1",
                                    children: [
                                        "Selling on Standard is free forever. Diamond is the optional paid boost for tools and marketplace visibility for ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold text-gray-900",
                                            children: storeName
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                            lineNumber: 290,
                                            columnNumber: 171
                                        }, this),
                                        "—same lineup as the StoreLink app."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                    lineNumber: 290,
                                    columnNumber: 16
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                            lineNumber: 288,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push("/dashboard"),
                            className: "flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 font-black text-[10px] uppercase tracking-widest bg-gray-100 px-6 py-3 rounded-2xl transition-all self-start sm:self-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                    lineNumber: 293,
                                    columnNumber: 15
                                }, this),
                                " Back to Dashboard"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                            lineNumber: 292,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                    lineNumber: 287,
                    columnNumber: 10
                }, this)
            }, void 0, false, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                lineNumber: 286,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-6xl mx-auto px-6 print:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 md:p-8 rounded-[2rem] border shadow-sm mb-12 bg-white border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400",
                                    children: "Effective tier"
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                    lineNumber: 302,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-3xl md:text-4xl font-black uppercase tracking-tighter ${effective === "diamond" ? "text-purple-600" : "text-gray-900"}`,
                                            children: displayTier
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                            lineNumber: 304,
                                            columnNumber: 15
                                        }, this),
                                        effective === "diamond" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200",
                                            children: "Boost active"
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                            lineNumber: 312,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                    lineNumber: 303,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-medium text-gray-500 max-w-xl leading-relaxed",
                                    children: "Your storefront link stays online on Standard. Diamond only changes tools and discovery priority—it never takes your store offline."
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                    lineNumber: 317,
                                    columnNumber: 13
                                }, this),
                                effective === "diamond" && expiryDate && new Date(expiryDate) >= new Date() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-bold text-gray-400",
                                    children: [
                                        "Paid boost renews on ",
                                        new Date(expiryDate).toLocaleDateString()
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                    lineNumber: 321,
                                    columnNumber: 15
                                }, this),
                                boostLapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 inline-block",
                                    children: expiryDate ? `Your Diamond period ended on ${new Date(expiryDate).toLocaleDateString()}. You're on Standard again—renew anytime for extra visibility.` : "Your Diamond boost has ended. You're on Standard again—renew anytime for extra visibility."
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                    lineNumber: 326,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                            lineNumber: 301,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                        lineNumber: 300,
                        columnNumber: 9
                    }, this),
                    statusMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `p-5 mb-8 rounded-[1.5rem] border flex items-center gap-3 animate-in slide-in-from-top-2 ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`,
                        children: [
                            statusMsg.type === 'success' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                size: 20,
                                strokeWidth: 3
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                lineNumber: 337,
                                columnNumber: 47
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                lineNumber: 337,
                                columnNumber: 85
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-black text-xs uppercase tracking-tight",
                                children: statusMsg.text
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                lineNumber: 338,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                        lineNumber: 336,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 items-stretch max-w-5xl mx-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `bg-white p-8 rounded-[2.5rem] border-2 flex flex-col transition-all duration-300 ${effective === "standard" ? "border-gray-900 shadow-xl scale-[1.02]" : "border-gray-100 shadow-sm opacity-80"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-6 bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                            size: 28
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                            lineNumber: 351,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 350,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-black text-gray-900 uppercase tracking-tighter",
                                        children: "Standard"
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 353,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 mb-8 flex items-baseline gap-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-4xl font-black",
                                            children: "Free"
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                            lineNumber: 355,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 354,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "space-y-5 text-xs font-bold text-gray-500 mb-10 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex gap-4 items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-emerald-100 text-emerald-600 p-1 rounded-md",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                            size: 14,
                                                            strokeWidth: 3
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                            lineNumber: 360,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 359,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Unlimited products"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 362,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 358,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex gap-4 items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-emerald-100 text-emerald-600 p-1 rounded-md",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                            size: 14,
                                                            strokeWidth: 3
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                            lineNumber: 366,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 365,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Full storefront & checkout"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 368,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 364,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex gap-4 items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-emerald-100 text-emerald-600 p-1 rounded-md",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                            size: 14,
                                                            strokeWidth: 3
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                            lineNumber: 372,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 371,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Fair marketplace discovery"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 374,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 370,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex gap-4 items-center opacity-40 italic",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 377,
                                                        columnNumber: 17
                                                    }, this),
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Diamond-only AI background removal"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 377,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 376,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 357,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        disabled: true,
                                        className: "w-full py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed",
                                        children: effective === "standard" ? "Your default plan" : "Included for every seller"
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 380,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                lineNumber: 343,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `bg-gray-900 p-8 rounded-[2.5rem] border-2 relative overflow-hidden flex flex-col transition-all duration-300 ${effective === "diamond" ? "border-purple-500 shadow-2xl scale-[1.02]" : "border-gray-800 shadow-xl shadow-gray-200"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-indigo-600 text-white text-[9px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-widest shadow-lg",
                                        children: "Diamond"
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 395,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-6 bg-gray-800 w-14 h-14 rounded-2xl flex items-center justify-center text-purple-400 border border-gray-700",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                            size: 28,
                                            fill: "currentColor"
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                            lineNumber: 399,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 398,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-black text-white uppercase tracking-tighter",
                                        children: "Diamond"
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 401,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 mb-8 flex items-baseline gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-4xl font-black text-white tracking-tight",
                                                children: [
                                                    "₦",
                                                    diamondPriceLabel
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 403,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-500 font-bold text-[10px] uppercase tracking-widest",
                                                children: "/ Month"
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 404,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 402,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "space-y-5 text-xs font-bold text-gray-300 mb-10 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex gap-4 items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-purple-500 text-white p-1 rounded-md",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                            size: 14,
                                                            strokeWidth: 3
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                            lineNumber: 409,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 408,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white",
                                                        children: "Higher discovery caps & ranking priority"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 411,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 407,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex gap-4 items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-purple-500 text-white p-1 rounded-md",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                            size: 14,
                                                            strokeWidth: 3
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                            lineNumber: 415,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 414,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white",
                                                        children: "Trending / homepage-style spotlight"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 417,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 413,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex gap-4 items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-purple-500 text-white p-1 rounded-md",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                            size: 14,
                                                            strokeWidth: 3
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                            lineNumber: 421,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 420,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white",
                                                        children: "Stronger marketplace presence vs Standard"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 423,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 419,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex gap-4 items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-purple-500 text-white p-1 rounded-md",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                            size: 14,
                                                            strokeWidth: 3
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                            lineNumber: 427,
                                                            columnNumber: 19
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 426,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "One-click AI background cleanup"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                        lineNumber: 429,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                                lineNumber: 425,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 406,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PaystackButton, {
                                        ...getPaystackConfig(),
                                        className: "w-full py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition-all shadow-xl shadow-purple-900/30"
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 432,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                lineNumber: 388,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                        lineNumber: 342,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white border border-gray-100 rounded-[2rem] p-8 text-center mb-20 max-w-2xl mx-auto shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2",
                                children: "Need a custom plan for your brand?"
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                lineNumber: 440,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-lg font-black text-gray-900 mb-4",
                                children: "Chat with the StoreLink Support Team"
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                lineNumber: 441,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "https://wa.me/2349125951202?text=Hi%20StoreLink%20Team!%20I%20am%20a%20vendor%20interested%20in%20a%20custom%20plan%20for%20my%20brand.%20Can%20we%20talk?",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "inline-flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-tighter hover:underline",
                                children: [
                                    "Contact Support ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "rotate-180",
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                        lineNumber: 448,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                                lineNumber: 442,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                        lineNumber: 439,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
                lineNumber: 298,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/dashboard/subscription/page.tsx",
        lineNumber: 173,
        columnNumber: 5
    }, this);
}
_s(SubscriptionPage, "oGbQ7ZZH2Zbqixt2fRuqTyfB0wg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = SubscriptionPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "PaystackButton");
__turbopack_context__.k.register(_c1, "SubscriptionPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=storelink-app-and-web_store-link-storefront_88cbc69d._.js.map