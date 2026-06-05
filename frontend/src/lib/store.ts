"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./api";

export type CartItem = { product: Product; quantity: number };

type CartStore = {
  items:        CartItem[];
  addItem:      (product: Product) => void;
  removeItem:   (productId: number) => void;
  updateQty:    (productId: number, qty: number) => void;
  clearCart:    () => void;
  itemCount:    () => number;
  subtotal:     () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((s) => {
          const existing = s.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...s.items, { product, quantity: 1 }] };
        }),

      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.product.id !== productId) })),

      updateQty: (productId, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.product.id !== productId)
              : s.items.map((i) =>
                  i.product.id === productId ? { ...i, quantity: qty } : i
                ),
        })),

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal:  () => get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
    }),
    { name: "shopflow-cart" }
  )
);
