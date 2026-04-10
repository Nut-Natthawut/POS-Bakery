create table public.users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  role text not null check (role in ('ADMIN', 'STAFF')),
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id),
  name text not null,
  price numeric(10,2) not null,
  stock integer not null default 0,
  vat_rate numeric(10,2) not null,
  discount_price numeric(10,2),
  image_url text,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  subtotal numeric(10,2) not null default 0,
  total_vat numeric(10,2) not null default 0,
  total_discount numeric(10,2) not null default 0,
  grand_total numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null,
  price_at_sale numeric(10,2) not null,
  vat_at_sale numeric(10,2) not null,
  created_at timestamptz not null default now()
);
