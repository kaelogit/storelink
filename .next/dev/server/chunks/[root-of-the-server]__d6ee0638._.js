module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/store-link/app/sitemap.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>sitemap,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2d$link$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/store-link/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
const BASE_URL = 'https://storelink.ng';
const revalidate = 0; // Force-revalidate every single time
async function sitemap() {
    // 1. MANUALLY CREATE CLIENT TO BYPASS IMPORT ISSUES
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2d$link$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://yolqfndprzohjkrizbzu.supabase.co"), process.env.SUPABASE_SERVICE_ROLE_KEY || ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvbHFmbmRwcnpvaGprcml6Ynp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MTcyNjgsImV4cCI6MjA4MTE5MzI2OH0.EMR9Pqts44-TGo8_3hiA_PRAKUUlXB_zmdR-8_5MEVM"));
    // 2. STATIC ROUTES
    const staticRoutes = [
        {
            url: `${BASE_URL}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1
        },
        {
            url: `${BASE_URL}/marketplace`,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 0.9
        },
        {
            url: `${BASE_URL}/empire-coins`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8
        },
        {
            url: `${BASE_URL}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5
        },
        {
            url: `${BASE_URL}/signup`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5
        }
    ];
    try {
        // 3. FETCH STOREFRONTS
        // 3. FETCH STOREFRONTS
        const { data: stores, error } = await supabase.from('stores').select('slug, created_at'); // Changed updated_at to created_at
        if (error) {
            console.error("❌ SITEMAP DATABASE ERROR:", error.message);
            return staticRoutes;
        }
        // ... inside the .map function ...
        const storefrontRoutes = stores.map((store)=>({
                url: `${BASE_URL}/${store.slug}`,
                lastModified: new Date(store.created_at || new Date()),
                changeFrequency: 'weekly',
                priority: 0.7
            }));
        console.log(`✅ SITEMAP SUCCESS: Generated ${storefrontRoutes.length} storefront links.`);
        return [
            ...staticRoutes,
            ...storefrontRoutes
        ];
    } catch (err) {
        console.error("💥 SITEMAP CRITICAL CRASH:", err);
        return staticRoutes;
    }
}
}),
"[project]/store-link/app/sitemap--route-entry.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2d$link$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store-link/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2d$link$2f$app$2f$sitemap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store-link/app/sitemap.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2d$link$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$metadata$2f$resolve$2d$route$2d$data$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store-link/node_modules/next/dist/build/webpack/loaders/metadata/resolve-route-data.js [app-route] (ecmascript)");
;
;
;
const contentType = "application/xml";
const cacheControl = "public, max-age=0, must-revalidate";
const fileType = "sitemap";
if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$store$2d$link$2f$app$2f$sitemap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"] !== 'function') {
    throw new Error('Default export is missing in "./sitemap.ts"');
}
async function GET() {
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2d$link$2f$app$2f$sitemap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2d$link$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$metadata$2f$resolve$2d$route$2d$data$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveRouteData"])(data, fileType);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$store$2d$link$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](content, {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': cacheControl
        }
    });
}
;
}),
"[project]/store-link/app/sitemap--route-entry.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$store$2d$link$2f$app$2f$sitemap$2d2d$route$2d$entry$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["GET"],
    "revalidate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$store$2d$link$2f$app$2f$sitemap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["revalidate"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2d$link$2f$app$2f$sitemap$2d2d$route$2d$entry$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/store-link/app/sitemap--route-entry.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2d$link$2f$app$2f$sitemap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store-link/app/sitemap.ts [app-route] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d6ee0638._.js.map