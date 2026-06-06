const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  stock: number;
  category: string | null;
  image_url: string | null;
  sku: string | null;
};

export type ProductFilters = {
  category?: string;
  sort_by?: string;
  search?: string;
  price_min?: number;
  price_max?: number;
  in_stock?: boolean;
};

export type ProductStats = {
  total_products: number;
  in_stock: number;
  out_of_stock: number;
  on_sale: number;
  avg_price: number;
  min_price: number;
  max_price: number;
  by_category: Record<string, number>;
};

export type CartItemIn = { product_id: number; quantity: number };

export type ShippingAddress = {
  full_name: string;
  address:   string;
  city:      string;
  state:     string;
  zip_code:  string;
  country:   string;
};

export type CheckoutIn = {
  user_email:        string;
  items:             CartItemIn[];
  promo_code?:       string;
  shipping_address?: ShippingAddress;
};

export type CheckoutOut = {
  order_id:     string;
  order_number: string;
  total:        number;
  status:       string;
  message:      string;
};

export type PromoResult = {
  code:            string;
  discount_type:   string;
  discount_value:  number;
  discount_amount: number;
  final_total:     number;
};

export type OrderItem = {
  product_id:   number;
  product_name: string;
  quantity:     number;
  unit_price:   number;
  total_price:  number;
};

export type Payment = {
  id:             number;
  amount:         number;
  status:         string;
  payment_method: string;
  created_at:     string;
};

export type Order = {
  id:              string;
  order_number:    string;
  user_email:      string;
  status:          string;
  subtotal:        number;
  discount_amount: number;
  total:           number;
  promo_code:      string | null;
  created_at:      string;
  items:           OrderItem[];
  payments:        Payment[];
};

export const api = {
  products: (filters?: ProductFilters) => {
    const qs = new URLSearchParams();
    if (filters?.category)  qs.set("category",  filters.category);
    if (filters?.sort_by)   qs.set("sort_by",   filters.sort_by);
    if (filters?.search)    qs.set("search",    filters.search);
    if (filters?.price_min != null) qs.set("price_min", String(filters.price_min));
    if (filters?.price_max != null) qs.set("price_max", String(filters.price_max));
    if (filters?.in_stock)  qs.set("in_stock",  "true");
    const q = qs.toString();
    return request<Product[]>(q ? `/products?${q}` : "/products");
  },

  product:      (slug: string)   => request<Product>(`/products/${slug}`),
  categories:   ()               => request<string[]>("/products/categories"),
  productStats: ()               => request<ProductStats>("/products/stats"),

  validatePromo: (code: string, subtotal: number) =>
    request<PromoResult>("/products/promo/validate", {
      method: "POST",
      body: JSON.stringify({ code, subtotal }),
    }),

  checkout: (body: CheckoutIn) =>
    request<CheckoutOut>("/checkout", { method: "POST", body: JSON.stringify(body) }),

  orders: (email: string) => request<Order[]>(`/orders/${encodeURIComponent(email)}`),
  order:  (id: string)    => request<Order>(`/orders/detail/${id}`),
};
