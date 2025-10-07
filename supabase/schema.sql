-- Core enums
create type payment_method as enum ('UPI', 'Cash', 'Card', 'NetBanking');
create type txn_type as enum ('income', 'expense');

-- Profiles extend auth.users
create table if not exists public.profiles (
	id uuid primary key references auth.users(id) on delete cascade,
	full_name text,
	language text default 'en',
	currency text default 'INR',
	timezone text default 'Asia/Kolkata',
	created_at timestamptz default now(),
	updated_at timestamptz default now()
);

-- Categories (system + user custom)
create table if not exists public.categories (
	id bigserial primary key,
	owner_id uuid references auth.users(id) on delete cascade,
	name_en text not null,
	name_hi text,
	icon text,
	is_system boolean not null default false,
	created_at timestamptz default now(),
	unique(owner_id, name_en)
);
create index if not exists idx_categories_owner on public.categories(owner_id);

-- Transactions
create table if not exists public.transactions (
	id bigserial primary key,
	user_id uuid not null references auth.users(id) on delete cascade,
	type txn_type not null,
	amount numeric(12,2) not null check (amount >= 0),
	currency text not null default 'INR',
	category_id bigint references public.categories(id) on delete set null,
	payment_method payment_method,
	note text,
	occurred_at timestamptz not null default now(),
	receipt_file_id bigint,
	created_at timestamptz default now()
);
create index if not exists idx_transactions_user_at on public.transactions(user_id, occurred_at desc);
create index if not exists idx_transactions_category on public.transactions(category_id);

-- Groups
create table if not exists public.groups (
	id uuid primary key default gen_random_uuid(),
	owner_id uuid not null references auth.users(id) on delete cascade,
	name text not null,
	description text,
	created_at timestamptz default now()
);
create index if not exists idx_groups_owner on public.groups(owner_id);

-- Group members with roles
create type group_role as enum ('admin', 'contributor', 'viewer');
create table if not exists public.group_members (
	group_id uuid references public.groups(id) on delete cascade,
	user_id uuid references auth.users(id) on delete cascade,
	role group_role not null default 'contributor',
	joined_at timestamptz default now(),
	primary key (group_id, user_id)
);
create index if not exists idx_group_members_user on public.group_members(user_id);

-- Group expenses
create table if not exists public.group_expenses (
	id uuid primary key default gen_random_uuid(),
	group_id uuid not null references public.groups(id) on delete cascade,
	payer_id uuid not null references auth.users(id) on delete cascade,
	description text,
	amount numeric(12,2) not null check (amount >= 0),
	currency text not null default 'INR',
	occurred_at timestamptz not null default now(),
	created_at timestamptz default now()
);
create index if not exists idx_group_expenses_group_at on public.group_expenses(group_id, occurred_at desc);

-- Budgets
create type budget_period as enum ('monthly', 'weekly', 'yearly', 'custom');
create table if not exists public.budgets (
	id bigserial primary key,
	user_id uuid not null references auth.users(id) on delete cascade,
	name text not null,
	amount numeric(12,2) not null check (amount >= 0),
	currency text not null default 'INR',
	period budget_period not null default 'monthly',
	category_id bigint references public.categories(id) on delete set null,
	start_date date,
	end_date date,
	alerts_threshold numeric(5,2) default 80.0,
	created_at timestamptz default now()
);
create index if not exists idx_budgets_user on public.budgets(user_id);

-- Activity feed
create table if not exists public.activity_feed (
	id uuid primary key default gen_random_uuid(),
	group_id uuid references public.groups(id) on delete cascade,
	actor_id uuid references auth.users(id) on delete set null,
	action text not null,
	metadata jsonb,
	created_at timestamptz default now()
);
create index if not exists idx_activity_group_at on public.activity_feed(group_id, created_at desc);

-- Notifications
create table if not exists public.notifications (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users(id) on delete cascade,
	type text not null,
	message text not null,
	metadata jsonb,
	read boolean default false,
	created_at timestamptz default now()
);
create index if not exists idx_notifications_user_at on public.notifications(user_id, created_at desc);

-- Enable Row Level Security (policies defined separately)
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_expenses enable row level security;

-- Function and trigger to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, created_at, updated_at)
  values (new.id, new.raw_user_meta_data->>'full_name', new.created_at, new.created_at);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
