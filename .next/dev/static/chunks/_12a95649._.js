(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/context/CartContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function CartProvider({ children }) {
    _s();
    const [cart, setCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isCartOpen, setIsCartOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isInitialized, setIsInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ✨ EMPIRE STATES
    const [useCoins, setUseCoins] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [userCoinBalance, setUserCoinBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // 1. ✨ INITIAL LOAD
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            const savedCart = localStorage.getItem("storelink_cart");
            const savedBalance = localStorage.getItem("empire_user_balance");
            if (savedCart) {
                try {
                    setCart(JSON.parse(savedCart));
                } catch (e) {
                    console.error(e);
                }
            }
            if (savedBalance) setUserCoinBalance(Number(savedBalance));
            setIsInitialized(true);
        }
    }["CartProvider.useEffect"], []);
    // 2. PERSISTENCE: Syncs cart and balance to localStorage whenever they change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            if (isInitialized) {
                localStorage.setItem("storelink_cart", JSON.stringify(cart));
                localStorage.setItem("empire_user_balance", userCoinBalance.toString());
            }
        }
    }["CartProvider.useEffect"], [
        cart,
        userCoinBalance,
        isInitialized
    ]);
    const addToCart = (product, store)=>{
        setCart((prev)=>{
            const existing = prev.find((item)=>item.product.id === product.id);
            if (existing) {
                return prev.map((item)=>item.product.id === product.id ? {
                        ...item,
                        qty: item.qty + 1
                    } : item);
            }
            return [
                ...prev,
                {
                    product,
                    store,
                    qty: 1
                }
            ];
        });
    };
    const removeFromCart = (productId)=>{
        setCart((prev)=>prev.filter((item)=>item.product.id !== productId));
    };
    const updateQuantity = (productId, quantity)=>{
        setCart((prev)=>prev.map((item)=>item.product.id === productId ? {
                    ...item,
                    qty: Math.max(1, quantity)
                } : item));
    };
    const clearCart = ()=>{
        setCart([]);
        setUseCoins(false);
    };
    const openCart = ()=>setIsCartOpen(true);
    const closeCart = ()=>setIsCartOpen(false);
    // --- CALCULATIONS ---
    const cartCount = cart.reduce((acc, item)=>acc + item.qty, 0);
    const cartTotal = cart.reduce((total, item)=>{
        return total + item.product.price * item.qty;
    }, 0);
    // --- ✨ EMPIRE 15% SAFETY LOGIC ---
    // Audit: Calculate the ceiling (Max discount allowed is 15% of cart total)
    const MAX_DISCOUNT_PERCENTAGE = 0.15;
    const maxAllowedDiscount = Math.floor(cartTotal * MAX_DISCOUNT_PERCENTAGE);
    // Audit: Determine how many coins can be applied
    // It's either their whole balance OR the 15% cap, whichever is smaller.
    const coinsToRedeem = useCoins ? Math.min(userCoinBalance, maxAllowedDiscount) : 0;
    const finalTotal = cartTotal - coinsToRedeem;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            cart,
            cartCount,
            cartTotal,
            finalTotal,
            isCartOpen,
            setIsCartOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            openCart,
            closeCart,
            useCoins,
            setUseCoins,
            redeemableCoins: coinsToRedeem,
            actualBalance: userCoinBalance,
            setActualBalance: setUserCoinBalance
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/CartContext.tsx",
        lineNumber: 123,
        columnNumber: 5
    }, this);
}
_s(CartProvider, "W4K0qKiI47hWDq4SSifXv6v7SfQ=");
_c = CartProvider;
const useCart = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
_s1(useCart, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "CartProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://yolqfndprzohjkrizbzu.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvbHFmbmRwcnpvaGprcml6Ynp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MTcyNjgsImV4cCI6MjA4MTE5MzI2OH0.EMR9Pqts44-TGo8_3hiA_PRAKUUlXB_zmdR-8_5MEVM"));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/shared/GlobalCartSidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GlobalCartSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/CartContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/coins.js [app-client] (ecmascript) <export default as Coins>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-client] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/history.js [app-client] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-client] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-down-left.js [app-client] (ecmascript) <export default as ArrowDownLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$next$2f$third$2d$parties$2f$dist$2f$google$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@next/third-parties/dist/google/index.js [app-client] (ecmascript)");
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
function GlobalCartSidebar() {
    _s();
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, useCoins, setUseCoins, actualBalance, setActualBalance } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        phone: "",
        address: ""
    });
    const [loadingStoreId, setLoadingStoreId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSyncingWallet, setIsSyncingWallet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobalCartSidebar.useEffect": ()=>{
            const saved = localStorage.getItem("storelink_billing");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setFormData(parsed);
                    if (parsed.phone && parsed.phone.length >= 10) {
                        syncEmpireWallet(parsed.phone);
                    }
                } catch (e) {
                    console.error("Billing parse error", e);
                }
            }
        }
    }["GlobalCartSidebar.useEffect"], []);
    // 2. ✨ LEDGER FETCHING (Transparency for the user)
    const fetchHistory = async (phone)=>{
        const cleanPhone = phone.replace(/\s+/g, '');
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('coin_transactions').select('*, stores(name)').eq('phone_number', cleanPhone).order('created_at', {
            ascending: false
        }).limit(5);
        setHistory(data || []);
    };
    const syncEmpireWallet = async (phone)=>{
        const cleanPhone = phone.replace(/\s+/g, '').trim();
        if (cleanPhone.length < 10) return;
        setIsSyncingWallet(true);
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('sync_or_create_wallet', {
                phone: cleanPhone
            });
            if (error) throw error;
            if (data && data.length > 0) {
                setActualBalance(data[0].balance);
                fetchHistory(cleanPhone); // Sync the ledger history
                if (data[0].c_name && !formData.name) {
                    setFormData((prev)=>({
                            ...prev,
                            name: data[0].c_name
                        }));
                }
            }
        } catch (err) {
            console.error("Wallet Sync Error:", err.message);
        } finally{
            setIsSyncingWallet(false);
        }
    };
    const handleChange = (field, value)=>{
        const newData = {
            ...formData,
            [field]: value
        };
        setFormData(newData);
        localStorage.setItem("storelink_billing", JSON.stringify(newData));
        if (field === "phone" && value.length >= 10) {
            syncEmpireWallet(value);
        }
    };
    const isInternalPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
    if (isInternalPage || !isCartOpen) return null;
    const cartByVendor = cart.reduce((acc, item)=>{
        const storeId = item.store.id;
        if (!acc[storeId]) acc[storeId] = {
            store: item.store,
            items: []
        };
        acc[storeId].items.push(item);
        return acc;
    }, {});
    // 3. ✨ CHECKOUT LOGIC (With Real-time Multi-Vendor Sync)
    const handleCheckout = async (storeId, storeData, items)=>{
        setLoadingStoreId(storeId);
        const cleanPhone = formData.phone.replace(/\s+/g, '').trim();
        try {
            // 1. FINANCIAL CALCULATIONS
            const storeTotal = items.reduce((sum, i)=>sum + i.product.price * i.qty, 0);
            const MAX_DISCOUNT_PERCENT = 0.15;
            const maxAllowedDiscount = Math.floor(storeTotal * MAX_DISCOUNT_PERCENT);
            const coinsToApply = useCoins ? Math.min(actualBalance, maxAllowedDiscount) : 0;
            const finalPayable = storeTotal - coinsToApply;
            const orderItemsForRPC = items.map((item)=>({
                    product_id: item.product.id,
                    product_name: item.product.name,
                    quantity: item.qty,
                    price: item.product.price
                }));
            // 2. DATABASE TRANSACTION (SUPABASE RPC)
            const { data: newOrderId, error: orderError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('create_new_order', {
                store_uuid: storeId,
                customer_name: formData.name,
                customer_phone: cleanPhone,
                customer_email: null,
                customer_address: formData.address,
                total_amount_paid: finalPayable,
                coins_used: coinsToApply,
                order_items_array: orderItemsForRPC
            });
            if (orderError) throw orderError;
            // 3. GOOGLE ANALYTICS INTELLIGENCE (CONVERSION TRACKING)
            // We trigger this immediately after the order is secured in the DB
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$next$2f$third$2d$parties$2f$dist$2f$google$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendGAEvent"])('event', 'conversion_whatsapp_order', {
                transaction_id: newOrderId,
                value: finalPayable,
                currency: 'NGN',
                store_name: storeData.name,
                coins_used: coinsToApply,
                items_count: items.length
            });
            // 4. EMPIRE COIN DEDUCTION (IF APPLICABLE)
            if (coinsToApply > 0) {
                const { error: walletError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('decrement_wallet', {
                    phone: cleanPhone,
                    amount: Math.floor(coinsToApply)
                });
                if (!walletError) {
                    const newBalance = actualBalance - coinsToApply;
                    setActualBalance(newBalance);
                    if (newBalance <= 0) setUseCoins(false);
                    fetchHistory(cleanPhone); // Refresh history trail
                }
            }
            // 5. WHATSAPP MESSAGE PREPARATION
            let cleanWhatsApp = storeData.whatsapp_number?.replace(/\D/g, '') || "";
            if (cleanWhatsApp.startsWith('0')) cleanWhatsApp = '234' + cleanWhatsApp.substring(1);
            const itemLines = items.map((i)=>`- ${i.qty}x ${i.product.name}`).join('\n');
            const msg = `*New Order #${newOrderId.slice(0, 8)}* 📦\n\n` + `Hello *${storeData.name}*, I've just placed an order via StoreLink:\n\n` + `${itemLines}\n\n` + `--------------------------\n` + `*Subtotal:* ₦${storeTotal.toLocaleString()}\n` + (coinsToApply > 0 ? `*Empire Coins Applied:* -₦${coinsToApply.toLocaleString()} ✨\n` + `_(Loyalty discount processed via StoreLink)_\n` : "") + `*TOTAL PAYABLE:* ₦${finalPayable.toLocaleString()}\n` + `--------------------------\n\n` + `📍 *Deliver to:* ${formData.address}\n` + `👤 *Customer Name:* ${formData.name}\n` + `📞 *Customer Phone:* ${cleanPhone}\n\n` + `🚀 _Order verified via StoreLink. Please confirm item availability and share your account details to finalize payment!_`;
            // 6. WHATSAPP REDIRECTION (THE HANDOFF)
            window.open(`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(msg)}`, "_blank");
            // 7. CART CLEANUP
            // Only clear items for THIS specific vendor
            items.forEach((item)=>removeFromCart(item.product.id));
            if (cart.length === items.length) setIsCartOpen(false);
        } catch (err) {
            console.error("Checkout Failed:", err);
            alert(`Order Failed: ${err.message}`);
        } finally{
            setLoadingStoreId(null);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0",
                onClick: ()=>setIsCartOpen(false)
            }, void 0, false, {
                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                lineNumber: 213,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-5 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "font-black text-xl flex items-center gap-2 uppercase tracking-tighter",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                        className: "text-emerald-600"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                        lineNumber: 220,
                                        columnNumber: 14
                                    }, this),
                                    " My Bag (",
                                    cart.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                lineNumber: 219,
                                columnNumber: 12
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsCartOpen(false),
                                className: "p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                    lineNumber: 222,
                                    columnNumber: 126
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                lineNumber: 222,
                                columnNumber: 12
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto p-5 bg-gray-50 no-scrollbar pb-20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-black text-gray-900 mb-4 text-[10px] uppercase tracking-widest flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    size: 14,
                                                    className: "text-emerald-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 231,
                                                    columnNumber: 21
                                                }, this),
                                                " Delivery Details"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                            lineNumber: 230,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    placeholder: "Full Name",
                                                    className: "w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none",
                                                    value: formData.name,
                                                    onChange: (e)=>handleChange("name", e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 234,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            placeholder: "WhatsApp Number",
                                                            className: "w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none",
                                                            value: formData.phone,
                                                            onChange: (e)=>handleChange("phone", e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                            lineNumber: 236,
                                                            columnNumber: 23
                                                        }, this),
                                                        isSyncingWallet && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                            size: 16,
                                                            className: "absolute right-4 top-4 animate-spin text-amber-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                            lineNumber: 237,
                                                            columnNumber: 43
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 235,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    placeholder: "Full Delivery Address",
                                                    className: "w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none h-20 resize-none",
                                                    value: formData.address,
                                                    onChange: (e)=>handleChange("address", e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 239,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                            lineNumber: 233,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                    lineNumber: 229,
                                    columnNumber: 16
                                }, this),
                                actualBalance > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3 animate-in zoom-in duration-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `p-5 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center justify-between ${useCoins ? 'bg-amber-500 border-amber-400 shadow-xl shadow-amber-200' : 'bg-white border-gray-100'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `${useCoins ? 'bg-white text-amber-500' : 'bg-amber-500 text-white'} p-2.5 rounded-2xl shadow-sm`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__["Coins"], {
                                                                size: 20,
                                                                fill: "currentColor"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                lineNumber: 250,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                            lineNumber: 249,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: `text-[9px] font-black uppercase tracking-widest leading-none mb-1 ${useCoins ? 'text-white' : 'text-amber-600'}`,
                                                                    children: "Global Balance"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                    lineNumber: 253,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: `text-lg font-black ${useCoins ? 'text-white' : 'text-gray-900'}`,
                                                                    children: [
                                                                        "₦",
                                                                        actualBalance.toLocaleString()
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                    lineNumber: 254,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                            lineNumber: 252,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 248,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setUseCoins(!useCoins),
                                                    className: `px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${useCoins ? 'bg-white text-amber-600 shadow-lg' : 'bg-amber-500 text-white'}`,
                                                    children: useCoins ? "Applied" : "Apply Coins"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                            lineNumber: 247,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-blue-50/50 border border-blue-100 p-5 rounded-[2rem] flex gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-blue-500/10 p-2 h-fit rounded-xl",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                                                        size: 18,
                                                        className: "text-blue-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                        lineNumber: 265,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 264,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] font-black text-blue-900 uppercase tracking-tight mb-1",
                                                            children: "What are Empire Coins?"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                            lineNumber: 268,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[9px] font-bold text-blue-700/70 leading-relaxed uppercase tracking-tight",
                                                            children: [
                                                                "You earn these coins automatically whenever you complete an order at any StoreLink shop. Use them for ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-blue-900 underline decoration-blue-900/30",
                                                                    children: "instant discounts"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                    lineNumber: 273,
                                                                    columnNumber: 42
                                                                }, this),
                                                                " anywhere!"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                            lineNumber: 271,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 267,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                            lineNumber: 263,
                                            columnNumber: 21
                                        }, this),
                                        history.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-black text-[9px] text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                                            size: 14
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                            lineNumber: 282,
                                                            columnNumber: 27
                                                        }, this),
                                                        " Your Ledger"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 281,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: history.map((tx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `p-1.5 rounded-lg ${tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`,
                                                                            children: tx.amount > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                                                                size: 12
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                                lineNumber: 289,
                                                                                columnNumber: 52
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownLeft$3e$__["ArrowDownLeft"], {
                                                                                size: 12
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                                lineNumber: 289,
                                                                                columnNumber: 80
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                            lineNumber: 288,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "min-w-0",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "font-black text-[10px] uppercase tracking-tighter text-gray-800 truncate max-w-[120px]",
                                                                                    children: tx.transaction_type === 'earn' ? `Earn: ${tx.stores?.name}` : tx.transaction_type === 'refund' ? `Refund: ${tx.stores?.name}` : tx.description
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                                    lineNumber: 292,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-[8px] font-bold text-gray-400 uppercase",
                                                                                    children: new Date(tx.created_at).toLocaleDateString()
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                                    lineNumber: 296,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                            lineNumber: 291,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                    lineNumber: 287,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `font-black text-xs ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`,
                                                                    children: [
                                                                        tx.amount > 0 ? '+' : '',
                                                                        "₦",
                                                                        Math.abs(tx.amount).toLocaleString()
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                    lineNumber: 299,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, tx.id, true, {
                                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                            lineNumber: 286,
                                                            columnNumber: 29
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 284,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/empire-coins",
                                                    className: "mt-4 flex items-center justify-center gap-1 text-[9px] font-black text-amber-600 uppercase tracking-widest hover:underline transition-all",
                                                    children: [
                                                        "Manage Digital Gold ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                            size: 12
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                            lineNumber: 306,
                                                            columnNumber: 47
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 305,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                            lineNumber: 280,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                    lineNumber: 245,
                                    columnNumber: 18
                                }, this),
                                Object.values(cartByVendor).map(({ store, items })=>{
                                    const storeTotal = items.reduce((sum, i)=>sum + i.product.price * i.qty, 0);
                                    const maxDiscount = Math.floor(storeTotal * 0.15);
                                    // ✨ Dynamic re-calculation ensures Store B updates when Store A checks out
                                    const discount = useCoins ? Math.min(actualBalance, maxDiscount) : 0;
                                    const finalTotal = storeTotal - discount;
                                    const earnedFromThis = store.loyalty_enabled ? Math.floor(finalTotal * (store.loyalty_percentage / 100)) : 0;
                                    // ✨ FRAUD PREVENTION UI: Alert vendor if they try to earn from themselves
                                    const isSelfBuying = formData.phone.replace(/\s+/g, '') === store.whatsapp_number?.replace(/\D/g, '');
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative",
                                        children: [
                                            isSelfBuying && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-0 left-0 right-0 bg-red-500 text-white text-[8px] font-black text-center py-1 uppercase tracking-widest",
                                                children: "Self-Earning Disabled for this shop"
                                            }, void 0, false, {
                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                lineNumber: 332,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center border-b border-gray-50 pb-4 mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-black text-[11px] uppercase tracking-tighter text-gray-400",
                                                        children: store.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                        lineNumber: 338,
                                                        columnNumber: 26
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-right",
                                                        children: [
                                                            discount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] text-gray-300 line-through font-bold",
                                                                children: [
                                                                    "₦",
                                                                    storeTotal.toLocaleString()
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                lineNumber: 340,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-emerald-600 font-black text-xl tracking-tighter",
                                                                children: [
                                                                    "₦",
                                                                    finalTotal.toLocaleString()
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                lineNumber: 341,
                                                                columnNumber: 28
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                        lineNumber: 339,
                                                        columnNumber: 26
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                lineNumber: 337,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4 mb-6",
                                                children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-4 items-center group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative w-12 h-12 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100",
                                                                children: item.product.image_urls?.[0] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    src: item.product.image_urls[0],
                                                                    alt: "",
                                                                    fill: true,
                                                                    className: "object-cover"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                    lineNumber: 349,
                                                                    columnNumber: 66
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                lineNumber: 348,
                                                                columnNumber: 30
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "font-bold text-[13px] text-gray-900 line-clamp-1 uppercase",
                                                                        children: item.product.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                        lineNumber: 352,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-[10px] font-black text-gray-400 uppercase tracking-widest",
                                                                        children: [
                                                                            item.qty,
                                                                            " x ₦",
                                                                            item.product.price.toLocaleString()
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                        lineNumber: 353,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                lineNumber: 351,
                                                                columnNumber: 30
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>removeFromCart(item.product.id),
                                                                className: "text-gray-300 hover:text-red-500 transition-colors p-2",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                    size: 16
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                    lineNumber: 355,
                                                                    columnNumber: 153
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                lineNumber: 355,
                                                                columnNumber: 30
                                                            }, this)
                                                        ]
                                                    }, item.product.id, true, {
                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                        lineNumber: 347,
                                                        columnNumber: 27
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                lineNumber: 345,
                                                columnNumber: 23
                                            }, this),
                                            discount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4 bg-amber-50 border border-amber-100 p-3 rounded-2xl flex justify-between items-center text-[9px] font-black uppercase text-amber-700 animate-in zoom-in",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                lineNumber: 362,
                                                                columnNumber: 72
                                                            }, this),
                                                            " Empire Discount Applied"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                        lineNumber: 362,
                                                        columnNumber: 28
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "-₦",
                                                            discount.toLocaleString()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                        lineNumber: 363,
                                                        columnNumber: 28
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                lineNumber: 361,
                                                columnNumber: 25
                                            }, this),
                                            earnedFromThis > 0 && !isSelfBuying && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-emerald-50 text-emerald-700 text-[9px] font-black p-3 rounded-2xl mb-6 flex items-center gap-2 border border-emerald-100 animate-in slide-in-from-bottom-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                        size: 14,
                                                        fill: "currentColor",
                                                        className: "animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                        lineNumber: 369,
                                                        columnNumber: 28
                                                    }, this),
                                                    " Earn +₦",
                                                    earnedFromThis.toLocaleString(),
                                                    " Coins"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                lineNumber: 368,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleCheckout(store.id, store, items),
                                                disabled: !formData.name || !formData.phone || !formData.address || loadingStoreId === store.id,
                                                className: "w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all disabled:bg-gray-100 disabled:text-gray-300 flex items-center justify-center gap-2 shadow-xl shadow-gray-100 active:scale-95",
                                                children: loadingStoreId === store.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "animate-spin",
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 379,
                                                    columnNumber: 28
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                            size: 18
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                            lineNumber: 381,
                                                            columnNumber: 30
                                                        }, this),
                                                        " Complete Checkout"
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                lineNumber: 373,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, store.id, true, {
                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                        lineNumber: 329,
                                        columnNumber: 20
                                    }, this);
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                            lineNumber: 226,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
        lineNumber: 212,
        columnNumber: 5
    }, this);
}
_s(GlobalCartSidebar, "vJ/AGsVlxsjy9X8jOcNQPiEMxSU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = GlobalCartSidebar;
var _c;
__turbopack_context__.k.register(_c, "GlobalCartSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_12a95649._.js.map