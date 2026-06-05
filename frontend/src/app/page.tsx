import { ProductCard } from "@/components/ProductCard";
import { api, type Product } from "@/lib/api";

export const revalidate = 60;

export default async function Home() {
  let products: Product[] = [];
  try {
    products = await api.products();
  } catch {
    // backend may not be running in preview
  }

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="bg-brand rounded-2xl px-8 py-12 mb-10 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-2">
            New arrivals · Free shipping over $75
          </p>
          <h1 className="text-white text-4xl font-extrabold mb-3 leading-tight">
            Premium Tech,<br />Delivered Fast ⚡
          </h1>
          <p className="text-white/60 max-w-md">
            Top-rated gear curated for developers, designers, and power users.
            Use promo code <span className="font-mono text-brand-accent">SAVE20</span> at checkout.
          </p>
        </div>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-brand-accent rounded-full opacity-10" />
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <span
              key={cat}
              className="bg-white border border-gray-200 text-gray-600 text-sm px-4 py-1.5 rounded-full font-medium"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Products */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔌</p>
          <p className="font-semibold">Backend is offline</p>
          <code className="text-sm mt-2 block">uvicorn main:app --port 8001</code>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
