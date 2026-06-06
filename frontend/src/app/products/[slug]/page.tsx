import { api, type Product } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  let product: Product;
  try {
    product = await api.product(params.slug);
  } catch {
    notFound();
  }

  let related: Product[] = [];
  try {
    const all = await api.products({ category: product.category! });
    related = all.filter(p => p.id !== product.id).slice(0, 4);
  } catch {
    // non-critical
  }

  const hasDiscount = product.compare_at_price !== null;
  const discountPct = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  const stockLabel =
    product.stock === 0 ? "Out of stock"
    : product.stock <= 3 ? `Only ${product.stock} left`
    : `${product.stock} in stock`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/" className="text-sm text-brand font-medium hover:underline mb-6 inline-block">
        ← Back to products
      </Link>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-80 md:h-full min-h-[320px] bg-gray-100">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">📦</div>
            )}
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-brand-accent text-white text-sm font-bold px-3 py-1 rounded-full">
                SALE
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col">
            {product.category && (
              <p className="text-xs font-bold uppercase tracking-widest text-brand-accent mb-2">
                {product.category}
              </p>
            )}
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-extrabold text-brand">${product.price.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ${product.compare_at_price!.toFixed(2)}
                  </span>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Save {Math.abs(discountPct)}%
                  </span>
                </>
              )}
            </div>

            {hasDiscount && (
              <p className="text-sm text-green-700 mb-4 font-medium">
                You save ${(product.compare_at_price! - product.price).toFixed(2)}
              </p>
            )}

            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">{product.description}</p>
            )}

            {/* Stock */}
            <p className={`text-sm font-semibold mb-4 ${
              product.stock === 0 ? "text-red-500"
              : product.stock <= 3 ? "text-amber-500"
              : "text-green-600"
            }`}>
              {stockLabel}
            </p>

            <AddToCartButton product={product} />

            {product.sku && (
              <p className="text-xs text-gray-300 mt-4">SKU: {product.sku}</p>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-extrabold mb-5">More in {product.category}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => {
              const savings = p.compare_at_price
                ? (p.compare_at_price - p.price).toFixed(2)
                : null;
              return (
                <Link key={p.id} href={`/products/${p.slug}`} className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-36 bg-gray-100">
                    {p.image_url && (
                      <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="200px" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold truncate group-hover:text-brand transition-colors">{p.name}</p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-sm font-bold text-brand">${p.price.toFixed(2)}</span>
                      {savings && <span className="text-xs text-green-600">-${savings}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
