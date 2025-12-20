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
    // 1. ✨ INITIAL LOAD & BALANCE SYNC
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            const savedCart = localStorage.getItem("storelink_cart");
            if (savedCart) {
                try {
                    setCart(JSON.parse(savedCart));
                } catch (e) {
                    console.error(e);
                }
            }
            // Initial balance check from storage
            const savedBalance = localStorage.getItem("empire_user_balance");
            if (savedBalance) setUserCoinBalance(Number(savedBalance));
            setIsInitialized(true);
            // ✨ LISTEN FOR HUD UPDATES: This ensures when they sync in the pill, 
            // the cart context sees the new balance immediately.
            const handleStorageChange = {
                "CartProvider.useEffect.handleStorageChange": ()=>{
                    const updatedBalance = localStorage.getItem("empire_user_balance");
                    if (updatedBalance) setUserCoinBalance(Number(updatedBalance));
                }
            }["CartProvider.useEffect.handleStorageChange"];
            window.addEventListener("storage", handleStorageChange);
            // Poll for changes every 2 seconds for same-tab updates
            const interval = setInterval(handleStorageChange, 2000);
            return ({
                "CartProvider.useEffect": ()=>{
                    window.removeEventListener("storage", handleStorageChange);
                    clearInterval(interval);
                }
            })["CartProvider.useEffect"];
        }
    }["CartProvider.useEffect"], []);
    // 2. PERSIST CART
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            if (isInitialized) {
                localStorage.setItem("storelink_cart", JSON.stringify(cart));
            }
        }
    }["CartProvider.useEffect"], [
        cart,
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
    // Calculate the ceiling (Max discount allowed is 15% of cart total)
    const MAX_DISCOUNT_PERCENTAGE = 0.15;
    const maxAllowedDiscount = Math.floor(cartTotal * MAX_DISCOUNT_PERCENTAGE);
    // Determine how many coins we can actually apply
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
            actualBalance: userCoinBalance
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/CartContext.tsx",
        lineNumber: 138,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function GlobalCartSidebar() {
    _s();
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, useCoins, setUseCoins, actualBalance } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        phone: "",
        address: ""
    });
    const [loadingStoreId, setLoadingStoreId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ✨ AUDIT: Hooks MUST be called here, at the top level
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobalCartSidebar.useEffect": ()=>{
            const saved = localStorage.getItem("storelink_billing");
            if (saved) {
                try {
                    setFormData(JSON.parse(saved));
                } catch (e) {
                    console.error("Billing parse error", e);
                }
            }
        }
    }["GlobalCartSidebar.useEffect"], []);
    // ✨ AUDIT: Move the "Hide Logic" AFTER all Hooks
    const isInternalPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
    // If it's an internal page or the cart is closed, return null down here
    if (isInternalPage || !isCartOpen) return null;
    const handleChange = (field, value)=>{
        const newData = {
            ...formData,
            [field]: value
        };
        setFormData(newData);
        localStorage.setItem("storelink_billing", JSON.stringify(newData));
    };
    const cartByVendor = cart.reduce((acc, item)=>{
        const storeId = item.store.id;
        if (!acc[storeId]) acc[storeId] = {
            store: item.store,
            items: []
        };
        acc[storeId].items.push(item);
        return acc;
    }, {});
    const handleCheckout = async (storeId, storeData, items)=>{
        setLoadingStoreId(storeId);
        try {
            const storeTotal = items.reduce((sum, i)=>sum + i.product.price * i.qty, 0);
            const MAX_DISCOUNT_PERCENT = 0.15;
            const maxAllowedDiscount = Math.floor(storeTotal * MAX_DISCOUNT_PERCENT);
            const coinsToApply = useCoins ? Math.min(actualBalance, maxAllowedDiscount) : 0;
            const finalPayable = storeTotal - coinsToApply;
            const earnedFromThis = storeData.loyalty_enabled ? Math.floor(finalPayable * (storeData.loyalty_percentage / 100)) : 0;
            const orderItemsForRPC = items.map((item)=>({
                    product_id: item.product.id,
                    product_name: item.product.name,
                    quantity: item.qty,
                    price: item.product.price
                }));
            const { data: newOrderId, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('create_new_order', {
                store_uuid: storeId,
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_email: null,
                customer_address: formData.address,
                total_amount_paid: finalPayable,
                coins_used: coinsToApply,
                order_items_array: orderItemsForRPC
            });
            if (error) throw error;
            if (coinsToApply > 0) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('decrement_wallet', {
                    phone: formData.phone,
                    amount: coinsToApply
                });
            }
            if (earnedFromThis > 0) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('increment_wallet', {
                    phone: formData.phone,
                    amount: earnedFromThis,
                    c_name: formData.name
                });
            }
            let cleanNumber = storeData.whatsapp_number?.replace(/\D/g, '') || "";
            if (cleanNumber.startsWith('0')) cleanNumber = '234' + cleanNumber.substring(1);
            const itemLines = items.map((i)=>`- ${i.qty}x ${i.product.name} (₦${(i.product.price * i.qty).toLocaleString()})`).join('\n');
            const msg = `*New Order #${newOrderId.slice(0, 8)}* 📦\n\n` + `Hello ${storeData.name}, I'd like to place an order:\n\n${itemLines}\n\n` + `*Subtotal: ₦${storeTotal.toLocaleString()}*\n` + (coinsToApply > 0 ? `*Empire Discount (15% Max): -₦${coinsToApply.toLocaleString()}*\n` : "") + `*Total Payable: ₦${finalPayable.toLocaleString()}*\n\n` + `*Delivery Details:*\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}\n\n` + `I've applied my Empire Coins for a discount. Please send payment details and delivery timeline!`;
            window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, "_blank");
            items.forEach((item)=>removeFromCart(item.product.id));
            if (cart.length === items.length) setIsCartOpen(false);
        } catch (err) {
            console.error("Checkout Failed:", err);
            alert(`Failed to save order: ${err.message}`);
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
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-5 border-b border-gray-100 flex justify-between items-center bg-white z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "font-black text-xl flex items-center gap-2 uppercase tracking-tighter",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                        className: "text-emerald-600"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                        lineNumber: 146,
                                        columnNumber: 14
                                    }, this),
                                    " My Bag (",
                                    cart.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                lineNumber: 145,
                                columnNumber: 12
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsCartOpen(false),
                                className: "p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                    lineNumber: 149,
                                    columnNumber: 14
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                lineNumber: 148,
                                columnNumber: 12
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto p-5 bg-gray-50",
                        children: cart.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full flex flex-col items-center justify-center text-gray-400 opacity-60",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                    size: 64,
                                    className: "mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                    lineNumber: 156,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-bold uppercase text-xs tracking-widest",
                                    children: "Your bag is empty"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                    lineNumber: 157,
                                    columnNumber: 16
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                            lineNumber: 155,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-black text-gray-900 mb-4 text-[10px] uppercase tracking-widest flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    size: 14,
                                                    className: "text-emerald-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 163,
                                                    columnNumber: 21
                                                }, this),
                                                " Billing Details"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                            lineNumber: 162,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    placeholder: "Your Name",
                                                    className: "w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 font-bold outline-none",
                                                    value: formData.name,
                                                    onChange: (e)=>handleChange("name", e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    placeholder: "WhatsApp Number",
                                                    className: "w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 font-bold outline-none",
                                                    value: formData.phone,
                                                    onChange: (e)=>handleChange("phone", e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    placeholder: "Full Delivery Address",
                                                    className: "w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 resize-none h-24 font-bold outline-none",
                                                    value: formData.address,
                                                    onChange: (e)=>handleChange("address", e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                            lineNumber: 165,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                    lineNumber: 161,
                                    columnNumber: 16
                                }, this),
                                actualBalance > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `p-5 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center justify-between ${useCoins ? 'bg-amber-500 border-amber-400 shadow-xl shadow-amber-100' : 'bg-white border-gray-100'}`,
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
                                                        lineNumber: 191,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 190,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: `text-[9px] font-black uppercase tracking-widest leading-none mb-1 ${useCoins ? 'text-white' : 'text-amber-600'}`,
                                                            children: "Empire Balance"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                            lineNumber: 194,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: `text-base font-black ${useCoins ? 'text-white' : 'text-gray-900'}`,
                                                            children: [
                                                                "₦",
                                                                actualBalance.toLocaleString()
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                            lineNumber: 195,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 193,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                            lineNumber: 189,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setUseCoins(!useCoins),
                                            className: `px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm ${useCoins ? 'bg-white text-amber-600' : 'bg-amber-500 text-white'}`,
                                            children: useCoins ? "Applied" : "Apply Coins"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                            lineNumber: 198,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                    lineNumber: 188,
                                    columnNumber: 18
                                }, this),
                                Object.values(cartByVendor).map(({ store, items })=>{
                                    const storeTotal = items.reduce((sum, i)=>sum + i.product.price * i.qty, 0);
                                    const maxDiscount = Math.floor(storeTotal * 0.15);
                                    const discount = useCoins ? Math.min(actualBalance, maxDiscount) : 0;
                                    const finalTotal = storeTotal - discount;
                                    const earnedFromThis = store.loyalty_enabled ? Math.floor(finalTotal * (store.loyalty_percentage / 100)) : 0;
                                    const isFormValid = formData.name && formData.phone && formData.address;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center border-b border-gray-50 pb-4 mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-black text-sm uppercase tracking-tight",
                                                        children: store.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                        lineNumber: 221,
                                                        columnNumber: 26
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-right",
                                                        children: [
                                                            discount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] text-gray-300 line-through",
                                                                children: [
                                                                    "₦",
                                                                    storeTotal.toLocaleString()
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                lineNumber: 223,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-emerald-600 font-black text-lg tracking-tighter",
                                                                children: [
                                                                    "₦",
                                                                    finalTotal.toLocaleString()
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                lineNumber: 224,
                                                                columnNumber: 28
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                        lineNumber: 222,
                                                        columnNumber: 26
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                lineNumber: 220,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4 mb-6",
                                                children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-4 items-center",
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
                                                                    lineNumber: 233,
                                                                    columnNumber: 35
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                lineNumber: 231,
                                                                columnNumber: 30
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "font-bold text-[13px] text-gray-900 line-clamp-1",
                                                                        children: item.product.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                        lineNumber: 237,
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
                                                                        lineNumber: 238,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                lineNumber: 236,
                                                                columnNumber: 30
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>removeFromCart(item.product.id),
                                                                className: "text-gray-200 hover:text-red-500 transition-colors p-2",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                    size: 16
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                    lineNumber: 241,
                                                                    columnNumber: 33
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                lineNumber: 240,
                                                                columnNumber: 30
                                                            }, this)
                                                        ]
                                                    }, item.product.id, true, {
                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                        lineNumber: 230,
                                                        columnNumber: 27
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                lineNumber: 228,
                                                columnNumber: 23
                                            }, this),
                                            discount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4 bg-amber-50 border border-amber-100 p-3 rounded-2xl flex justify-between items-center text-[10px] font-black uppercase text-amber-700",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                                lineNumber: 249,
                                                                columnNumber: 72
                                                            }, this),
                                                            " Empire Discount"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                        lineNumber: 249,
                                                        columnNumber: 28
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "-₦",
                                                            discount.toLocaleString()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                        lineNumber: 250,
                                                        columnNumber: 28
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                lineNumber: 248,
                                                columnNumber: 25
                                            }, this),
                                            earnedFromThis > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-emerald-50 text-emerald-700 text-[10px] font-black p-3 rounded-2xl mb-6 flex items-center gap-2 border border-emerald-100",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                        size: 14,
                                                        fill: "currentColor",
                                                        className: "animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                        lineNumber: 256,
                                                        columnNumber: 28
                                                    }, this),
                                                    " You'll earn +₦",
                                                    earnedFromThis.toLocaleString(),
                                                    " Coins"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                lineNumber: 255,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleCheckout(store.id, store, items),
                                                disabled: !isFormValid || loadingStoreId === store.id,
                                                className: "w-full bg-gray-900 text-white py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.1em] hover:bg-emerald-600 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-xl shadow-gray-100 flex items-center justify-center gap-2",
                                                children: loadingStoreId === store.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "animate-spin",
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                    lineNumber: 266,
                                                    columnNumber: 28
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                            lineNumber: 268,
                                                            columnNumber: 30
                                                        }, this),
                                                        " Checkout on WhatsApp"
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                                lineNumber: 260,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, store.id, true, {
                                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                                        lineNumber: 219,
                                        columnNumber: 20
                                    }, this);
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                            lineNumber: 160,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/shared/GlobalCartSidebar.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
_s(GlobalCartSidebar, "QcAfIkGOlJhVNekGlLPr2J+FZIA=", false, function() {
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
"[project]/components/shared/EmpireWalletHUD.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EmpireWalletHUD
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/coins.js [app-client] (ecmascript) <export default as Coins>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wallet.js [app-client] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)"); // ✨ For floating/swiping logic
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function EmpireWalletHUD() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const constraintsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null); // Ref for draggable area
    // --- STATES ---
    const [balance, setBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [customerName, setCustomerName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSynced, setIsSynced] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 1. ✨ HIDE LOGIC
    const isInternalPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
    if (isInternalPage) return null;
    // 2. ✨ PERSISTENCE & INITIAL LOAD
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EmpireWalletHUD.useEffect": ()=>{
            const savedPhone = localStorage.getItem("empire_user_phone");
            const savedName = localStorage.getItem("empire_user_name");
            if (savedName) setCustomerName(savedName);
            if (savedPhone) {
                setPhone(savedPhone);
                fetchBalance(savedPhone);
            }
        }
    }["EmpireWalletHUD.useEffect"], []);
    // 3. ✨ SYNC LOGIC (Force Balance Update)
    const fetchBalance = async (phoneNumber)=>{
        if (!phoneNumber) return;
        setLoading(true);
        try {
            // Calling the RPC we created earlier
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('sync_or_create_wallet', {
                phone: phoneNumber
            });
            if (data && data.length > 0) {
                const wallet = data[0];
                setBalance(wallet.balance);
                setCustomerName(wallet.c_name);
                setIsSynced(true);
                localStorage.setItem("empire_user_phone", phoneNumber);
                localStorage.setItem("empire_user_balance", wallet.balance.toString());
                if (wallet.c_name) localStorage.setItem("empire_user_name", wallet.c_name);
            }
        } catch (error) {
            console.error("Empire Sync Error:", error);
            setBalance(0);
        } finally{
            setLoading(false);
        }
    };
    const handleCheck = (e)=>{
        e.preventDefault();
        if (phone.length > 8) fetchBalance(phone);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: constraintsRef,
        className: "fixed inset-0 pointer-events-none z-[50]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            layout: true,
            drag: true,
            dragDirectionLock: true,
            dragConstraints: constraintsRef,
            dragElastic: 0.1,
            dragMomentum: false,
            style: {
                touchAction: "none"
            },
            className: "pointer-events-auto cursor-grab active:cursor-grabbing absolute flex flex-col items-end gap-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setIsOpen(!isOpen),
                    className: "bg-white/90 backdrop-blur-md border-2 border-amber-100 shadow-2xl rounded-2xl flex items-center justify-center transition-all active:scale-95 group h-[42px] w-[42px] md:h-auto md:w-auto md:px-4 md:py-2 md:gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-amber-500 p-1.5 rounded-xl text-white shadow-lg shadow-amber-200 shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__["Coins"], {
                                size: 18,
                                fill: "currentColor"
                            }, void 0, false, {
                                fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                lineNumber: 97,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-left hidden md:block",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[8px] font-black text-amber-600 uppercase tracking-widest leading-none",
                                    children: "Empire Wallet"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-black text-gray-900 leading-tight",
                                    children: balance !== null ? `₦${balance.toLocaleString()}` : "Sync Wallet"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this),
                        balance !== null && balance > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "md:hidden pr-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-black text-gray-900",
                                children: balance > 999 ? `${(balance / 1000).toFixed(1)}k` : `₦${balance}`
                            }, void 0, false, {
                                fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                lineNumber: 110,
                                columnNumber: 16
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                            lineNumber: 109,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this),
                isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] p-6 w-[88vw] max-w-[320px] animate-in slide-in-from-top-4 duration-300",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center mb-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-black text-gray-900 uppercase text-[10px] tracking-widest flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"], {
                                            size: 14,
                                            className: "text-amber-500"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                            lineNumber: 122,
                                            columnNumber: 17
                                        }, this),
                                        " My Empire Savings"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                    lineNumber: 121,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setIsOpen(false),
                                    className: "p-2 bg-gray-50 rounded-full text-gray-300 hover:text-gray-900 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                        lineNumber: 125,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                    lineNumber: 124,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                            lineNumber: 120,
                            columnNumber: 13
                        }, this),
                        !isSynced ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleCheck,
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "tel",
                                    placeholder: "WhatsApp Number",
                                    value: phone,
                                    onChange: (e)=>setPhone(e.target.value),
                                    className: "w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:border-amber-500 transition-all outline-none"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                    lineNumber: 131,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    disabled: loading,
                                    className: "w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-50",
                                    children: loading ? "Syncing..." : "Access My Balance"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                    lineNumber: 138,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                            lineNumber: 130,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-in zoom-in duration-300",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-5 bg-emerald-50 rounded-[2rem] text-center border border-emerald-100 mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[9px] font-black text-emerald-600/60 uppercase tracking-widest mb-1",
                                            children: customerName ? `Welcome, ${customerName.split(' ')[0]}` : "Current Balance"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                            lineNumber: 148,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-3xl font-black text-emerald-700 tracking-tighter",
                                            children: [
                                                "₦",
                                                balance?.toLocaleString() || 0
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                            lineNumber: 151,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                    lineNumber: 147,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setIsSynced(false),
                                    className: "flex items-center gap-2 mx-auto text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-amber-600 transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                            size: 12
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                            lineNumber: 157,
                                            columnNumber: 19
                                        }, this),
                                        " Switch Number"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                    lineNumber: 153,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                            lineNumber: 146,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 space-y-3 pt-5 border-t border-gray-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                            size: 14,
                                            className: "text-emerald-500 shrink-0 mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                            lineNumber: 164,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] text-gray-500 font-medium leading-tight",
                                            children: "1 Empire Coin = ₦1 Discount."
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                            lineNumber: 165,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                    lineNumber: 163,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                            size: 14,
                                            className: "text-emerald-500 shrink-0 mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                            lineNumber: 168,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] text-gray-500 font-medium leading-tight",
                                            children: "Redeem up to 15% per order."
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                            lineNumber: 169,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                    lineNumber: 167,
                                    columnNumber: 16
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                            lineNumber: 162,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 pt-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/empire-coins",
                                onClick: ()=>setIsOpen(false),
                                className: "flex items-center justify-between w-full bg-gray-50 p-4 rounded-2xl group hover:bg-amber-50 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-left",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] font-black text-gray-900 uppercase tracking-tighter",
                                                children: "Empire Manual"
                                            }, void 0, false, {
                                                fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                                lineNumber: 180,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-gray-400 font-bold",
                                                children: "How it works"
                                            }, void 0, false, {
                                                fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                                lineNumber: 181,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                        lineNumber: 179,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                        size: 16,
                                        className: "text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                        lineNumber: 183,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                                lineNumber: 174,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                            lineNumber: 173,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
                    lineNumber: 119,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
            lineNumber: 81,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/shared/EmpireWalletHUD.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_s(EmpireWalletHUD, "ZbwxEPXvxm6HFS2a6ZSIrne3Vn8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = EmpireWalletHUD;
var _c;
__turbopack_context__.k.register(_c, "EmpireWalletHUD");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_17fcc00b._.js.map