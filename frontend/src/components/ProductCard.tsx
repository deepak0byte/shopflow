"use client";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/api";
import { useState } from "react";
import clsx from "clsx";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const stockLabel =
    product.stock === 0
      ? "Out of stock"
      : product.stock <= 2
      ? `Only ${product.stock} left!`
      : `${product.stock} in stock`;

  const stockClass =
    product.stock === 0
      ? "text-red-500 font-semibold"
      : product.stock <= 2
      ? "text-amber-500 font-semibold"
      : "text-gray-400";

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <div className="relative w-full h-48 bg-gray-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
            📦
          </div>
        )}
        {product.compare_at_price && (
          <span className="absolute top-3 left-3 bg-brand-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
            SALE
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        {product.category && (
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent mb-1">
            {product.category}
          </p>
        )}
        <h3 className="font-bold text-gray-900 mb-1 leading-snug">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">{product.description}</p>
        )}

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-extrabold text-brand">${product.price.toFixed(2)}</span>
          {product.compare_at_price && (
            <span className="text-sm text-gray-400 line-through">
              ${product.compare_at_price.toFixed(2)}
            </span>
          )}
        </div>
        <p className={clsx("text-xs mb-3", stockClass)}>{stockLabel}</p>

        <button
          disabled={product.stock === 0}
          onClick={handleAdd}
          className={clsx(
            "w-full py-2.5 rounded-xl font-semibold text-sm transition-all",
            product.stock === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : added
              ? "bg-green-500 text-white"
              : "bg-brand text-white hover:bg-brand/90 active:scale-95"
          )}
        >
          {product.stock === 0 ? "Out of Stock" : added ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
