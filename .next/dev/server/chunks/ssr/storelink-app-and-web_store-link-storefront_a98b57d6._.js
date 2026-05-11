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
"[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StoreManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/shield.js [app-ssr] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/phone.js [app-ssr] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/ban.js [app-ssr] (ecmascript) <export default as Ban>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/camera.js [app-ssr] (ecmascript) <export default as Camera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$utils$2f$marketplaceDiscovery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/utils/marketplaceDiscovery.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function StoreManager({ store, onClose, onUpdate }) {
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [confirmBan, setConfirmBan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loyaltyPercent, setLoyaltyPercent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(store.loyalty_percentage || 1);
    // ✨ DAYS REMAINING CALCULATION
    const getDaysLeft = (expiryDate)=>{
        if (!expiryDate) return null;
        const now = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    const daysLeft = getDaysLeft(store.subscription_expiry);
    const effectiveTier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$utils$2f$marketplaceDiscovery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["effectiveSellerTier"])(store.subscription_plan, store.subscription_expiry, store.subscription_status);
    const rawPlan = (store.subscription_plan || "").toLowerCase();
    const staleDiamondRow = rawPlan === "diamond" && effectiveTier === "standard";
    async function patchSeller(payload) {
        const res = await fetch(`/api/admin/sellers/${store.id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const j = await res.json().catch(()=>({}));
        if (!res.ok) throw new Error(j.error || res.statusText);
    }
    async function updatePlan(newPlan) {
        if (!store?.id) {
            alert("Error: Missing seller profile id.");
            return;
        }
        if (!confirm(`Set this seller to ${newPlan} plan on their profile?`)) return;
        setLoading(true);
        let expiryDate = null;
        if (newPlan === "diamond") {
            const date = new Date();
            date.setDate(date.getDate() + 30);
            expiryDate = date.toISOString();
        }
        try {
            await patchSeller({
                subscription_plan: newPlan,
                subscription_expiry: expiryDate,
                subscription_status: "active"
            });
            alert(`Success: ${store.name} is now ${newPlan.toUpperCase()}`);
            onUpdate();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Update failed");
        } finally{
            setLoading(false);
        }
    }
    async function toggleBan() {
        setLoading(true);
        const lifting = store.status === "banned";
        try {
            await patchSeller({
                account_status: lifting ? "active" : "suspended"
            });
            onUpdate();
            onClose();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Update failed");
        } finally{
            setLoading(false);
        }
    }
    async function updateLoyaltySettings() {
        setLoading(true);
        try {
            await patchSeller({
                loyalty_enabled: !store.loyalty_enabled,
                loyalty_percentage: loyaltyPercent
            });
            onUpdate();
            alert("Loyalty settings updated on profile.");
        } catch (err) {
            alert(err instanceof Error ? err.message : "Update failed");
        } finally{
            setLoading(false);
        }
    }
    async function toggleVerification() {
        setLoading(true);
        const isNowVerified = !store.is_verified;
        try {
            await patchSeller({
                is_verified: isNowVerified,
                verification_status: isNowVerified ? "verified" : "none"
            });
            alert(`Verification ${isNowVerified ? "granted" : "revoked"} on profile`);
            onUpdate();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Update failed");
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-[#111] border border-gray-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 border-b border-gray-800 flex justify-between items-start",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-black text-white uppercase tracking-tighter",
                                            children: store.name
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 145,
                                            columnNumber: 16
                                        }, this),
                                        store.is_verified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                            size: 20,
                                            className: "text-blue-500 fill-blue-500/20"
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 146,
                                            columnNumber: 38
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                    lineNumber: 144,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-gray-400 text-sm mt-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono text-xs bg-gray-900 px-2 py-0.5 rounded text-gray-500",
                                            children: [
                                                store.id.slice(0, 8),
                                                "..."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 149,
                                            columnNumber: 16
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "•"
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 150,
                                            columnNumber: 16
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: `/${store.slug}`,
                                            target: "_blank",
                                            className: "text-emerald-500 hover:underline font-bold",
                                            children: [
                                                "/",
                                                store.slug
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 151,
                                            columnNumber: 16
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                            lineNumber: 143,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "p-2 bg-gray-800 rounded-full hover:bg-gray-700 text-gray-400 transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                            lineNumber: 156,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                    lineNumber: 142,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]",
                                            children: "Owner Details"
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 165,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 p-3 bg-gray-900 rounded-xl border border-gray-800",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                    className: "text-blue-500",
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-300 select-all text-sm truncate font-medium",
                                                    children: store.owner_email || "No Email"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 20
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 166,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 p-3 bg-gray-900 rounded-xl border border-gray-800",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                    className: "text-emerald-500",
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 171,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-300 select-all text-sm font-medium",
                                                    children: store.whatsapp_number || "No Phone"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 20
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 170,
                                            columnNumber: 18
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                    lineNumber: 164,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]",
                                            children: "Performance"
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 177,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between p-3 bg-gray-900 rounded-xl border border-gray-800",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-400 text-xs font-bold uppercase tracking-widest",
                                                    children: "Revenue"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-black text-white text-lg tracking-tighter",
                                                    children: [
                                                        "₦",
                                                        store.total_revenue?.toLocaleString() || '0'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 178,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between p-3 bg-gray-900 rounded-xl border border-gray-800",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-400 text-xs font-bold uppercase tracking-widest",
                                                    children: "Region"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 185,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-black text-white uppercase text-xs",
                                                    children: "Nigeria (NGN)"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 184,
                                            columnNumber: 18
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                    lineNumber: 176,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                            lineNumber: 163,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-px bg-gray-800"
                        }, void 0, false, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                            lineNumber: 191,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 195,
                                            columnNumber: 17
                                        }, this),
                                        " Identity Documents"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                    lineNumber: 194,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-4",
                                    children: [
                                        store.verification_doc_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: store.verification_doc_url,
                                            target: "_blank",
                                            className: "p-4 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-between group hover:border-emerald-500 transition shadow-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                            size: 20,
                                                            className: "text-gray-500 group-hover:text-emerald-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                            lineNumber: 201,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs font-bold text-gray-300",
                                                            children: "View ID Card"
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                            lineNumber: 202,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 200,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                    size: 14,
                                                    className: "text-gray-600 group-hover:text-emerald-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 204,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 199,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 bg-gray-900/30 border border-gray-800/50 rounded-2xl flex items-center gap-3 opacity-40",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                    size: 20,
                                                    className: "text-gray-700"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 208,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-bold text-gray-600",
                                                    children: "No ID Uploaded"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 209,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 207,
                                            columnNumber: 19
                                        }, this),
                                        store.verification_selfie_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: store.verification_selfie_url,
                                            target: "_blank",
                                            className: "p-4 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-between group hover:border-blue-500 transition shadow-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"], {
                                                            size: 20,
                                                            className: "text-gray-500 group-hover:text-blue-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                            lineNumber: 216,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs font-bold text-gray-300",
                                                            children: "View Selfie"
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                            lineNumber: 217,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 215,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                    size: 14,
                                                    className: "text-gray-600 group-hover:text-blue-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 214,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 bg-gray-900/30 border border-gray-800/50 rounded-2xl flex items-center gap-3 opacity-40",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"], {
                                                    size: 20,
                                                    className: "text-gray-700"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 223,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-bold text-gray-600",
                                                    children: "No Selfie Uploaded"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 224,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 222,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                    lineNumber: 197,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                            lineNumber: 193,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-px bg-gray-800"
                        }, void 0, false, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                            lineNumber: 230,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4",
                                            children: "Subscription Tier"
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 234,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                "standard",
                                                "diamond"
                                            ].map((plan)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>updatePlan(plan),
                                                    disabled: loading || plan === "diamond" && effectiveTier === "diamond" || plan === "standard" && effectiveTier === "standard" && !staleDiamondRow,
                                                    className: `flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${(plan === "standard" ? effectiveTier === "standard" : effectiveTier === "diamond") ? 'bg-emerald-600 text-white cursor-default shadow-lg shadow-emerald-900/20' : 'bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-gray-300'}`,
                                                    children: plan
                                                }, plan, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 237,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 235,
                                            columnNumber: 18
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                    lineNumber: 233,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4",
                                            children: "Godmode Control"
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 258,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: toggleVerification,
                                                    disabled: loading,
                                                    className: `w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${store.is_verified ? 'bg-blue-900/20 text-blue-400 border-blue-900 hover:bg-blue-900/40' : 'bg-gray-800 text-gray-500 border-gray-700 hover:text-white hover:border-gray-600'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                            size: 16,
                                                            className: store.is_verified ? "fill-blue-400" : ""
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                            lineNumber: 269,
                                                            columnNumber: 24
                                                        }, this),
                                                        store.is_verified ? "Revoke Verification" : "Verify Vendor"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 260,
                                                    columnNumber: 21
                                                }, this),
                                                !confirmBan ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setConfirmBan(true),
                                                    disabled: loading,
                                                    className: `w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${store.status === 'banned' ? 'bg-emerald-900/20 text-emerald-500 border-emerald-900' : 'bg-red-900/20 text-red-500 border-red-900 hover:bg-red-900/30'}`,
                                                    children: [
                                                        store.status === 'banned' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                            lineNumber: 283,
                                                            columnNumber: 56
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__["Ban"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                            lineNumber: 283,
                                                            columnNumber: 83
                                                        }, this),
                                                        store.status === 'banned' ? "Lift Store Ban" : "Ban Merchant"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 274,
                                                    columnNumber: 24
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-red-900/10 border border-red-900/50 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-red-400 text-[10px] mb-4 font-black uppercase tracking-widest text-center",
                                                            children: store.status === 'banned' ? "Restore this vendor?" : "Danger: This will hide all products."
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                            lineNumber: 288,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setConfirmBan(false),
                                                                    className: "flex-1 py-2 bg-gray-800 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-white",
                                                                    children: "Cancel"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                                    lineNumber: 292,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: toggleBan,
                                                                    disabled: loading,
                                                                    className: "flex-1 py-2 bg-red-600 rounded-xl text-[10px] font-black uppercase text-white shadow-lg shadow-red-900/20",
                                                                    children: "Confirm"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                                    lineNumber: 293,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                            lineNumber: 291,
                                                            columnNumber: 26
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 287,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 259,
                                            columnNumber: 18
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                    lineNumber: 257,
                                    columnNumber: 16
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                            lineNumber: 232,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-px bg-gray-800"
                        }, void 0, false, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                            lineNumber: 301,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                            size: 14,
                                            fill: "currentColor"
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 305,
                                            columnNumber: 17
                                        }, this),
                                        " Store Coin loyalty"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                    lineNumber: 304,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-900/50 p-5 rounded-2xl border border-gray-800 space-y-5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs font-bold text-gray-300",
                                                            children: "Reward Percentage"
                                                        }, void 0, false, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                            lineNumber: 310,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] text-gray-500 uppercase",
                                                            children: [
                                                                "Current Cashback: ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-amber-500 font-black",
                                                                    children: [
                                                                        loyaltyPercent,
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                                    lineNumber: 311,
                                                                    columnNumber: 92
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                            lineNumber: 311,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 309,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: "1",
                                                    max: "15",
                                                    value: loyaltyPercent,
                                                    onChange: (e)=>setLoyaltyPercent(parseInt(e.target.value)),
                                                    className: "w-32 accent-amber-500 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 313,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 308,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: updateLoyaltySettings,
                                            disabled: loading,
                                            className: `w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-2 ${store.loyalty_enabled ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20' : 'bg-gray-800 text-gray-500 border-gray-700 hover:text-white'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                    size: 14,
                                                    fill: store.loyalty_enabled ? "currentColor" : "none"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                                    lineNumber: 331,
                                                    columnNumber: 21
                                                }, this),
                                                store.loyalty_enabled ? "Engine: Running (Update Settings)" : "Engine: Offline (Activate Engine)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                            lineNumber: 322,
                                            columnNumber: 18
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                                    lineNumber: 307,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                            lineNumber: 303,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-8 py-4 bg-gray-900/50 border-t border-gray-800 flex justify-between items-center text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]",
                    children: [
                        "Administrator Session Active",
                        store.subscription_expiry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `tracking-widest ${daysLeft !== null && daysLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-amber-500/50'}`,
                            children: [
                                "Expires: ",
                                new Date(store.subscription_expiry).toLocaleDateString(),
                                daysLeft !== null && ` (${daysLeft <= 0 ? 'Expired' : `${daysLeft} Days Left`})`
                            ]
                        }, void 0, true, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                            lineNumber: 341,
                            columnNumber: 14
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
                    lineNumber: 338,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
            lineNumber: 140,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx",
        lineNumber: 139,
        columnNumber: 5
    }, this);
}
}),
"[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ManageStoresPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/funnel.js [app-ssr] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/shield-alert.js [app-ssr] (ecmascript) <export default as ShieldAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$components$2f$admin$2f$StoreManager$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/components/admin/StoreManager.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$utils$2f$marketplaceDiscovery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/utils/marketplaceDiscovery.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function ManageStoresPage() {
    const [stores, setStores] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedStore, setSelectedStore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchStores();
    }, []);
    async function fetchStores() {
        const res = await fetch("/api/admin/sellers", {
            credentials: "include"
        });
        const j = await res.json();
        if (!res.ok) {
            console.error("Sellers load error:", j.error || res.statusText);
            return;
        }
        setStores([
            ...j.sellers || []
        ]);
    }
    const filteredStores = stores.filter((s)=>s.name.toLowerCase().includes(search.toLowerCase()) || s.slug.toLowerCase().includes(search.toLowerCase()));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col md:flex-row justify-between items-end gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-3xl font-black text-white uppercase tracking-tighter",
                                children: "Sellers"
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-400 text-sm",
                                children: [
                                    "Seller profiles (",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-gray-500",
                                        children: "profiles.is_seller"
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                        lineNumber: 37,
                                        columnNumber: 30
                                    }, this),
                                    ") — subscription, verification, and account status. Updates use the service role via admin APIs."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 w-full md:w-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex-1 md:flex-none",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-500",
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                        lineNumber: 43,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search by name or slug...",
                                        className: "w-full md:w-64 bg-gray-800 border border-gray-700 rounded-xl py-2 pl-10 pr-4 text-white outline-none focus:border-emerald-500 transition",
                                        value: search,
                                        onChange: (e)=>setSearch(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                        lineNumber: 44,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>fetchStores(),
                                className: "p-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition-all active:scale-95",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gray-800/50 border border-gray-700 rounded-3xl overflow-hidden min-h-[500px] shadow-2xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full text-left",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "bg-gray-900/50 text-gray-400 text-[10px] uppercase font-black tracking-widest sticky top-0 backdrop-blur-md border-b border-gray-700",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4",
                                        children: "Store Identity"
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                        lineNumber: 62,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4",
                                        children: "Subscription"
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                        lineNumber: 63,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4",
                                        children: "System Status"
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                        lineNumber: 64,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4 text-right",
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                        lineNumber: 65,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                lineNumber: 61,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "divide-y divide-gray-700/50",
                            children: filteredStores.map((store)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: `hover:bg-white/5 transition group ${store.status === 'banned' ? 'bg-red-500/5' : ''}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-inner ${store.status === 'banned' ? 'bg-red-900/40 text-red-500 border border-red-500/20' : 'bg-emerald-900/40 text-emerald-500 border border-emerald-500/20'}`,
                                                        children: store.name.charAt(0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                        lineNumber: 78,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: `font-bold transition ${store.status === 'banned' ? 'text-red-400' : 'text-white group-hover:text-emerald-400'}`,
                                                                        children: store.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                                        lineNumber: 88,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    store.is_verified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                        size: 14,
                                                                        className: "text-blue-400 fill-blue-400/20"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                                        lineNumber: 93,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    !store.is_verified && store.verification_status === 'pending' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        title: "Verification Pending",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                            size: 14,
                                                                            className: "text-amber-500 animate-pulse"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                                            lineNumber: 98,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                                        lineNumber: 97,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                                lineNumber: 87,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] text-gray-500 font-mono",
                                                                children: [
                                                                    "/",
                                                                    store.slug
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                                lineNumber: 102,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                        lineNumber: 86,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                lineNumber: 77,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                            lineNumber: 76,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border w-fit ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$utils$2f$marketplaceDiscovery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["effectiveSellerTier"])(store.subscription_plan, store.subscription_expiry, store.subscription_status) === "diamond" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-gray-700/30 text-gray-400 border-gray-600/30"}`,
                                                    children: [
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$utils$2f$marketplaceDiscovery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["effectiveSellerTier"])(store.subscription_plan, store.subscription_expiry, store.subscription_status) === "diamond" ? "diamond" : "standard",
                                                        store.subscription_plan && store.subscription_plan !== "standard" && store.subscription_plan !== "diamond" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[9px] font-mono normal-case opacity-60",
                                                            children: [
                                                                " ",
                                                                "(",
                                                                store.subscription_plan,
                                                                ")"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                            lineNumber: 127,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                    lineNumber: 108,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                lineNumber: 107,
                                                columnNumber: 20
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                            lineNumber: 106,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4",
                                            children: store.status === 'banned' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-red-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                        lineNumber: 138,
                                                        columnNumber: 25
                                                    }, this),
                                                    " Banned"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                lineNumber: 137,
                                                columnNumber: 21
                                            }, this) : store.verification_status === 'pending' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-amber-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 25
                                                    }, this),
                                                    " Review Needed"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                lineNumber: 141,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-emerald-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                        lineNumber: 146,
                                                        columnNumber: 25
                                                    }, this),
                                                    " Active"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                lineNumber: 145,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                            lineNumber: 135,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 text-right",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSelectedStore(store),
                                                className: "px-4 py-2 bg-gray-900 hover:bg-emerald-600 hover:text-white text-gray-300 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-gray-700 hover:border-emerald-500 flex items-center gap-2 ml-auto active:scale-90",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                        lineNumber: 155,
                                                        columnNumber: 22
                                                    }, this),
                                                    " Manage"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                                lineNumber: 151,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                            lineNumber: 150,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, store.id, true, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                                    lineNumber: 70,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            selectedStore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$components$2f$admin$2f$StoreManager$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                store: selectedStore,
                onClose: ()=>setSelectedStore(null),
                onUpdate: ()=>{
                    // 🔥 FIX: Re-fetch stores after any change in StoreManager
                    fetchStores();
                    setSelectedStore(null); // Close modal on success
                }
            }, void 0, false, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
                lineNumber: 165,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/admin/stores/page.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=storelink-app-and-web_store-link-storefront_a98b57d6._.js.map