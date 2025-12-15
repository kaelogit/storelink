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
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, store: Store) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // <--- PREVENTS WIPING DATA

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
    setIsCartOpen(true); // Automatically open cart when adding
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) => 
      prev.map((item) => 
        item.product.id === productId 
          ? { ...item, qty: Math.max(1, quantity) } // Prevent going below 1
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);


  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const cartTotal = cart.reduce((total, item) => {
    return total + (item.product.price * item.qty);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
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