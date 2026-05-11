module.exports = [
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
"[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AccountLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-ssr] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/store.js [app-ssr] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/menu.js [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/log-out.js [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-ssr] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/coins.js [app-ssr] (ecmascript) <export default as Coins>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$life$2d$buoy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LifeBuoy$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/life-buoy.js [app-ssr] (ecmascript) <export default as LifeBuoy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/heart.js [app-ssr] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$claimGuestOrders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/lib/claimGuestOrders.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$onboardingState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storelink-app-and-web/store-link-storefront/lib/onboardingState.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function AccountLayout({ children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sellerStoreId, setSellerStoreId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [me, setMe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        (async ()=>{
            const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
            if (!user) {
                router.replace("/login");
                return;
            }
            const [{ data: store }, { data: profile }] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("stores").select("id").eq("owner_id", user.id).maybeSingle(),
                __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("profiles").select("phone_number, display_name, full_name, logo_url, is_seller, onboarding_completed, onboarding_step, buyer_interested_categories, slug, location_state, location_city, location").eq("id", user.id).maybeSingle()
            ]);
            if (cancelled) return;
            const ctx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$onboardingState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchOnboardingContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"], user.id);
            const resume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$onboardingState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAccountOnboardingContinuePath"])(ctx, ctx.profile);
            if (resume.startsWith("/onboarding")) {
                router.replace(resume);
                return;
            }
            const p = profile;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$claimGuestOrders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["claimGuestOrdersForSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"], {
                userId: user.id,
                email: user.email ?? null,
                phoneDigits: p?.phone_number ?? null
            });
            const hasStore = !!store?.id;
            setSellerStoreId(store?.id ?? null);
            setMe({
                name: p?.display_name?.trim() || p?.full_name?.trim() || user.email?.split("@")[0] || "Account",
                logoUrl: p?.logo_url?.trim() || null,
                hasStore,
                isSellerFlag: !!p?.is_seller
            });
            setLoading(false);
        })();
        return ()=>{
            cancelled = true;
        };
    }, [
        router
    ]);
    const handleLogout = async ()=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
        window.location.assign("/login");
    };
    const links = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const base = [
            {
                name: "Overview",
                href: "/account",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
            }
        ];
        if (me?.isSellerFlag) {
            base.push({
                name: "Sales & inventory",
                href: "/dashboard",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"]
            }, {
                name: "Manage orders",
                href: "/dashboard/orders",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"]
            }, {
                name: "Verification",
                href: "/dashboard/verification",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]
            }, {
                name: "Membership & payouts",
                href: "/dashboard/subscription",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__["Coins"]
            }, {
                name: "Seller settings",
                href: "/dashboard/settings",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]
            });
        }
        base.push({
            name: "My purchases",
            href: "/account/orders",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"]
        }, {
            name: "My wallet",
            href: "/account/wallet",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__["Coins"]
        }, {
            name: "Wishlist",
            href: "/account/wishlist",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"]
        }, {
            name: "Profile",
            href: "/account/profile",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]
        }, {
            name: "Settings",
            href: "/account/settings",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
        }, {
            name: "Help & support",
            href: "/account/support",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$life$2d$buoy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LifeBuoy$3e$__["LifeBuoy"]
        });
        if (!sellerStoreId) {
            base.push({
                name: "Start selling",
                href: "/account/start-selling",
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"]
            });
        }
        return base;
    }, [
        sellerStoreId,
        me?.isSellerFlag
    ]);
    if (loading || !me) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-screen flex items-center justify-center bg-gray-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "animate-spin text-gray-400"
            }, void 0, false, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                lineNumber: 131,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
            lineNumber: 130,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 flex flex-col md:flex-row",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: `fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-100 transform transition-transform md:translate-x-0 md:static ${open ? "translate-x-0" : "-translate-x-full"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 border-b border-gray-100 flex items-center justify-between md:block",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400",
                                        children: "StoreLink"
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                        lineNumber: 145,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-black text-lg text-gray-900 uppercase tracking-tighter mt-1",
                                        children: me.isSellerFlag ? "Seller account" : "My account"
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                        lineNumber: 146,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 mt-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-11 h-11 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0 flex items-center justify-center",
                                                children: me.logoUrl ? // eslint-disable-next-line @next/next/no-img-element
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: me.logoUrl,
                                                    alt: "",
                                                    className: "w-full h-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                                    lineNumber: 153,
                                                    columnNumber: 19
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm font-black text-gray-400 uppercase",
                                                    children: me.name.slice(0, 1)
                                                }, void 0, false, {
                                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                                    lineNumber: 155,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                                lineNumber: 150,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-bold text-gray-900 text-sm truncate",
                                                        children: me.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                                        lineNumber: 159,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap gap-1.5 mt-1",
                                                        children: [
                                                            me.hasStore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md",
                                                                children: "Seller"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                                                lineNumber: 162,
                                                                columnNumber: 21
                                                            }, this),
                                                            !me.hasStore && me.isSellerFlag && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] font-black uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md",
                                                                children: "Seller profile"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                                                lineNumber: 167,
                                                                columnNumber: 21
                                                            }, this),
                                                            !me.isSellerFlag && !me.hasStore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] font-black uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md",
                                                                children: "Shopper"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                                                lineNumber: 172,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                                        lineNumber: 160,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                                lineNumber: 158,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                        lineNumber: 149,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] text-gray-400 font-medium mt-4 leading-snug",
                                        children: me.hasStore ? "Your storefront, orders, wallet, and profile — all in one place." : "Your orders, Store Coins, and profile."
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                        lineNumber: 179,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "md:hidden p-2 rounded-xl bg-gray-50",
                                onClick: ()=>setOpen(false),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                    lineNumber: 186,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                lineNumber: 185,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "p-4 space-y-1",
                        children: links.map((l)=>{
                            const active = l.href === "/account" ? pathname === "/account" : pathname === l.href || pathname.startsWith(l.href + "/");
                            const Icon = l.icon;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: l.href,
                                onClick: ()=>setOpen(false),
                                className: `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${active ? "bg-gray-900 text-white shadow-lg" : "text-gray-600 hover:bg-gray-50"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                        lineNumber: 205,
                                        columnNumber: 17
                                    }, this),
                                    l.name
                                ]
                            }, l.href + l.name, true, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                lineNumber: 197,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 mt-auto border-t border-gray-100",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleLogout,
                            className: "flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this),
                                "Log out"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                            lineNumber: 212,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                        lineNumber: 211,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "fixed inset-0 bg-black/40 z-30 md:hidden",
                "aria-label": "Close menu",
                onClick: ()=>setOpen(false)
            }, void 0, false, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                lineNumber: 224,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100 px-4 py-4 flex items-center gap-3 md:hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "p-2 rounded-xl bg-gray-50",
                                onClick: ()=>setOpen(true),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                    lineNumber: 230,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-black text-sm uppercase tracking-tighter text-gray-900",
                                children: "Account"
                            }, void 0, false, {
                                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                                lineNumber: 232,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                        lineNumber: 228,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storelink$2d$app$2d$and$2d$web$2f$store$2d$link$2d$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 p-6 md:p-10 max-w-4xl w-full mx-auto",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
                lineNumber: 227,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/storelink-app-and-web/store-link-storefront/app/account/layout.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=storelink-app-and-web_store-link-storefront_f2a1af29._.js.map