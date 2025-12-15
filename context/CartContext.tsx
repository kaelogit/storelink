"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, Store } from "@/types";

export type CartItem = { 
  product: Product; 
  store: Store; 
  qty: number 
};

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: Product, store: Store) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number; // <--- The correct total number
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // <--- PREVENTS WIPING DATA

  // 1. Load Cart on Mount
  useEffect(() => {
    const savedCart = localStorage.getItem("storelink_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsInitialized(true); // Mark as loaded
  }, []);

  // 2. Save Cart (Only after initialization)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("storelink_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

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
    // We do NOT auto-open cart here anymore, per your request
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Calculate Total Quantity (e.g., 2 apples + 1 banana = 3 items)
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount, // <--- EXPOSING THE CORRECT COUNT
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