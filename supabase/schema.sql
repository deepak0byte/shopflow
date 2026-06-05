-- ShopFlow database schema
-- Run this in Supabase SQL editor to set up the production database

create table if not exists products (
  id          serial primary key,
  name        text not null,
  description text,
  price       numeric(10,2) not null,
  compare_at_price numeric(10,2),
  stock       integer not null default 0,
  category    text,
  image_url   text,
  created_at  timestamptz not null default now()
);

create table if not exists orders (
  id           serial primary key,
  order_number text not null unique,
  user_email   text not null,
  status       text not null default 'pending',
  total        numeric(10,2) not null,
  promo_code   text,
  discount_amount numeric(10,2) not null default 0,
  shipping_address jsonb,
  created_at   timestamptz not null default now()
);

create table if not exists order_items (
  id           serial primary key,
  order_id     integer not null references orders(id) on delete cascade,
  product_id   integer not null references products(id),
  product_name text not null,
  quantity     integer not null,
  unit_price   numeric(10,2) not null,
  total_price  numeric(10,2) not null
);

create table if not exists payments (
  id             serial primary key,
  order_id       integer not null references orders(id) on delete cascade,
  amount         numeric(10,2) not null,
  status         text not null default 'pending',
  gateway_ref    text,
  created_at     timestamptz not null default now()
);

-- Indexes
create index if not exists idx_orders_user_email on orders(user_email);
create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_payments_order_id on payments(order_id);
