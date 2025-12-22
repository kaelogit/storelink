"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { Product, Store } from "@/types";

export type CartItem = { 
  product: Product; 
  store: Store; 
  qty: number 
};

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number; // Raw subtotal
  finalTotal: number; // Final price customer pays
  addToCart: (product: Product, store: Store) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  // ✨ EMPIRE ECONOMY PROPERTIES
  useCoins: boolean;
  setUseCoins: (use: boolean) => void;
  redeemableCoins: number; // Actual amount being deducted (Max 15%)
  actualBalance: number;   // Full user bank balance
  setActualBalance: Dispatch<SetStateAction<number>>; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // ✨ EMPIRE STATES
  const [useCoins, setUseCoins] = useState(false);
  // 🔥 BALANCE ALWAYS STARTS AT 0 (Safety first)
  const [userCoinBalance, setUserCoinBalance] = useState(0);

  // 1. ✨ INITIAL LOAD: Only pull the Cart items
  useEffect(() => {
    const savedCart = localStorage.getItem("storelink_cart");
    
    if (savedCart) {
      try { 
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed); 
      } catch (e) { console.error("Cart parse error", e); }
    }
    
    // 🔥 REMOVED: No longer reading savedBalance from localStorage. 
    // This kills the "ghost coin" reload bug.
    setIsInitialized(true);
  }, []);

  // 2. PERSISTENCE: Only save Cart items
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("storelink_cart", JSON.stringify(cart));
      // 🔥 REMOVED: No longer saving userCoinBalance to localStorage.
    }
  }, [cart, isInitialized]);

  // 3. ✨ SAFETY: Reset "Apply Coins" toggle on page refresh
  useEffect(() => {
    setUseCoins(false);
  }, []);

  const addToCart = (product: Product, store: Store) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, store, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) => 
      prev.map((item) => 
        item.product.id === productId 
          ? { ...item, qty: Math.max(1, quantity) } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setUseCoins(false);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // --- CALCULATIONS ---
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.qty), 0);

  // --- ✨ EMPIRE 15% SAFETY LOGIC ---
  const MAX_DISCOUNT_PERCENTAGE = 0.15;
  const maxAllowedDiscount = Math.floor(cartTotal * MAX_DISCOUNT_PERCENTAGE);

  // Strict check: Balance must be current
  const coinsToRedeem = (useCoins && cart.length > 0) 
    ? Math.min(userCoinBalance, maxAllowedDiscount) 
    : 0;

  const finalTotal = cartTotal - coinsToRedeem;

  return (
    <CartContext.Provider
      value={{
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
        setActualBalance: setUserCoinBalance, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};