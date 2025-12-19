(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ViewTracker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ViewTracker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ViewTracker({ storeId }) {
    _s();
    const hasCounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ViewTracker.useEffect": ()=>{
            const sessionKey = `viewed_store_${storeId}`;
            if (sessionStorage.getItem(sessionKey) || hasCounted.current) {
                return;
            }
            const countView = {
                "ViewTracker.useEffect.countView": async ()=>{
                    try {
                        hasCounted.current = true;
                        sessionStorage.setItem(sessionKey, "true");
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('increment_store_view', {
                            store_uuid: storeId
                        });
                    } catch (error) {
                        console.error(error);
                    }
                }
            }["ViewTracker.useEffect.countView"];
            countView();
        }
    }["ViewTracker.useEffect"], [
        storeId
    ]);
    return null;
}
_s(ViewTracker, "9Z+fsgMExtclPh9jzdjOtBESKAo=");
_c = ViewTracker;
var _c;
__turbopack_context__.k.register(_c, "ViewTracker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_ViewTracker_tsx_869b64f6._.js.map