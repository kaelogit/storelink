"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { Product, Store } from "@/types";
import { productDisplayPrice } from "@/lib/productFlashDrop";

export type CartItem = { 
  product: Product; 
  store: Store; 
  qty: number 
};

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number; 
  finalTotal: number; 
  addToCart: (product: Product, store: Store) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  openCart: () => void;
  closeCart: () => void;

  useCoins: boolean;
  setUseCoins: (use: boolean) => void;
  redeemableCoins: number;
  actualBalance: number;  
  setActualBalance: Dispatch<SetStateAction<number>>; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [useCoins, setUseCoins] = useState(false);
  const [userCoinBalance, setUserCoinBalance] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem("storelink_cart");

    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          const normalized: CartItem[] = [];
          for (const raw of parsed) {
            const product = raw?.product;
            const store = raw?.store;
            if (!product?.id || !store) continue;
            const ownerId =
              (typeof store.owner_id === "string" && store.owner_id.trim()) ||
              (typeof product.seller_id === "string" && product.seller_id.trim()) ||
              "";
            if (!ownerId) continue;
            normalized.push({
              product,
              store: { ...store, owner_id: ownerId },
              qty: typeof raw.qty === "number" && raw.qty > 0 ? raw.qty : 1,
            });
          }
          setCart(normalized);
        }
      } catch (e) {
        console.error("Cart parse error", e);
      }
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("storelink_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  useEffect(() => {
    setUseCoins(false);
  }, []);

  function snapshotProductForCart(product: Product): Product {
    const list = Number(product.price);
    const effective = productDisplayPrice({ ...product, price: list });
    if (Number.isFinite(list) && effective !== list) {
      return { ...product, price: effective, compare_at_price: list };
    }
    const { compare_at_price: _omitCompareAt, ...rest } = product;
    return { ...rest, price: effective };
  }

  const addToCart = (product: Product, store: Store) => {
    const lineProduct = snapshotProductForCart(product);
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + 1, product: { ...item.product, ...lineProduct } }
            : item
        );
      }
      return [...prev, { product: lineProduct, store, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) return prev.filter((item) => item.product.id !== productId);
      return prev.map((item) =>
        item.product.id === productId ? { ...item, qty: quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
    setUseCoins(false);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.qty), 0);

  const MAX_DISCOUNT_PERCENTAGE = 0.05;
  const maxAllowedDiscount = Math.floor(cartTotal * MAX_DISCOUNT_PERCENTAGE);

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