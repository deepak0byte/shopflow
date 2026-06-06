"use client";
import { useState, useEffect, useCallback } from "react";
import { ProductCard } from "@/components/ProductCard";
import { api, type Product, type ProductStats } from "@/lib/api";

const SORT_OPTIONS = [
  { value: "",           label: "Featured" },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "name",       label: "Name A–Z" },
  { value: "newest",     label: "Newest" },
  { value: "discount",   label: "Best Deals" },
];

export default function Home() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats,      setStats]      = useState<ProductStats | null>(null);
  const [loading,    setLoading]    = useState(true);

  const [search,      setSearch]      = useState("");
  const [category,    setCategory]    = useState("");
  const [sortBy,      setSortBy]      = useState("");
  const [priceMin,    setPriceMin]    = useState("");
  const [priceMax,    setPriceMax]    = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.products({
        category:  category || undefined,
        sort_by:   sortBy   || undefined,
        search:    search   || undefined,
        price_min: priceMin  ? Number(priceMin)  : undefined,
        price_max: priceMax  ? Number(priceMax)  : undefined,
        in_stock:  inStockOnly || undefined,
      });
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, sortBy, search, priceMin, priceMax, inStockOnly]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    api.categories().then(setCategories).catch(() => {});
    api.productStats().then(setStats).catch(() => {});
  }, []);

  function clearFilters() {
    setSearch(""); setCategory(""); setSortBy("");
    setPriceMin(""); setPriceMax(""); setInStockOnly(false);
  }

  const hasFilters = !!(search || category || sortBy || priceMin || priceMax || inStockOnly);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-brand rounded-2xl px-8 py-12 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-2">
            New arrivals · Free shipping over $75
          </p>
          <h1 className="text-white text-4xl font-extrabold mb-3 leading-tight">
            Premium Tech,<br />Delivered Fast ⚡
          </h1>
          <p className="text-white/60 max-w-md">
            Top-rated gear curated for developers, designers, and power users.
            Use <span className="font-mono text-brand-accent">SAVE20</span> at checkout.
          </p>
        </div>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-brand-accent rounded-full opacity-10" />
      </div>

      {/* ── Stats Bar ─────────────────────────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Products", value: stats.total_products },
            { label: "In Stock",       value: stats.in_stock },
            { label: "On Sale",        value: stats.on_sale },
            { label: "Avg Price",      value: `$${stats.avg_price.toFixed(2)}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-sm text-center">
              <p className="text-2xl font-extrabold text-brand">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Search + Filters ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-8 space-y-4">

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 focus:border-brand rounded-xl text-sm outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-end">
          {/* Category */}
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border-2 border-gray-200 focus:border-brand rounded-xl px-3 py-2 text-sm outline-none bg-white"
            >
              <option value="">All categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Sort */}
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Sort by</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full border-2 border-gray-200 focus:border-brand rounded-xl px-3 py-2 text-sm outline-none bg-white"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Price range */}
          <div className="flex gap-2 items-center">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Min $</label>
              <input
                type="number" min="0" placeholder="0"
                value={priceMin}
                onChange={e => setPriceMin(e.target.value)}
                className="w-24 border-2 border-gray-200 focus:border-brand rounded-xl px-3 py-2 text-sm outline-none"
              />
            </div>
            <span className="text-gray-400 mt-5">–</span>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Max $</label>
              <input
                type="number" min="0" placeholder="∞"
                value={priceMax}
                onChange={e => setPriceMax(e.target.value)}
                className="w-24 border-2 border-gray-200 focus:border-brand rounded-xl px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          {/* In stock */}
          <label className="flex items-center gap-2 cursor-pointer select-none mt-5">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={e => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-brand"
            />
            <span className="text-sm font-medium text-gray-700">In stock only</span>
          </label>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-5 text-sm text-brand-accent font-semibold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ── Category Pills ────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategory("")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              !category ? "bg-brand text-white border-brand" : "bg-white border-gray-200 text-gray-600 hover:border-brand"
            }`}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c === category ? "" : c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                category === c ? "bg-brand text-white border-brand" : "bg-white border-gray-200 text-gray-600 hover:border-brand"
              }`}
            >
              {c}
              {stats?.by_category[c] ? (
                <span className="ml-1.5 text-xs opacity-70">({stats.by_category[c]})</span>
              ) : null}
            </button>
          ))}
        </div>
      )}

      {/* ── Results header ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading ? "Loading…" : `${products.length} product${products.length !== 1 ? "s" : ""}`}
          {hasFilters ? " matching filters" : ""}
        </p>
      </div>

      {/* ── Grid ──────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-semibold text-lg">No products found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
          {hasFilters && (
            <button onClick={clearFilters} className="mt-4 text-brand font-semibold hover:underline">
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
