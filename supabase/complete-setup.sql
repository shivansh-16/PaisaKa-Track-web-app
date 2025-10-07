-- ============================================================================
-- PAISAKA TRACK - COMPLETE DATABASE SETUP
-- ============================================================================

-- ============================================================================
-- STEP 1: HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user is a member of a group
create or replace function public.is_group_member(p_group_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 
    from public.group_members 
    where group_id = p_group_id 
      and user_id = auth.uid()
  );
$$;

-- ============================================================================
-- STEP 2: SEED SYSTEM CATEGORIES (with Hindi translations)
-- ============================================================================

-- Insert system categories with bilingual names
insert into public.categories (owner_id, name_en, name_hi, icon, is_system) values
  (null, 'Food', 'भोजन', '🍕', true),
  (null, 'Transport', 'यातायात', '🚗', true),
  (null, 'Tea/Coffee', 'चाय/कॉफी', '☕', true),
  (null, 'Entertainment', 'मनोरंजन', '🎬', true),
  (null, 'Medical', 'चिकित्सा', '🏥', true),
  (null, 'Shopping', 'खरीदारी', '🛒', true),
  (null, 'Clothes', 'कपड़े', '👕', true),
  (null, 'Bills', 'बिल', '💡', true),
  (null, 'Education', 'शिक्षा', '🎓', true),
  (null, 'Rent', 'किराया', '🏠', true),
  (null, 'Groceries', 'किराना', '🛒', true),
  (null, 'Fuel', 'ईंधन', '⛽', true),
  (null, 'Mobile Recharge', 'मोबाइल रिचार्ज', '📱', true),
  (null, 'Internet', 'इंटरनेट', '🌐', true),
  (null, 'Electricity', 'बिजली', '💡', true),
  (null, 'Water', 'पानी', '💧', true),
  (null, 'Gas', 'गैस', '🔥', true),
  (null, 'Insurance', 'बीमा', '🛡️', true),
  (null, 'Investment', 'निवेश', '📈', true),
  (null, 'Salary', 'वेतन', '💰', true),
  (null, 'Gift', 'उपहार', '🎁', true),
  (null, 'Other', 'अन्य', '📝', true)
on conflict (owner_id, name_en) do nothing;

-- ============================================================================
-- STEP 3: UPDATE PROFILE CREATION TRIGGER
-- ============================================================================

-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Recreate function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Insert profile with metadata from signup
  insert into public.profiles (id, full_name, language, created_at, updated_at)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'language', 'en'),
    now(),
    now()
  );
  return new;
end;
$$;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_expenses enable row level security;
alter table public.budgets enable row level security;
alter table public.activity_feed enable row level security;
alter table public.notifications enable row level security;

-- ============================================================================
-- STEP 5: CREATE RLS POLICIES
-- ============================================================================

-- Profiles
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;

create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

-- Categories
drop policy if exists "categories_select" on public.categories;
drop policy if exists "categories_modify_own" on public.categories;
drop policy if exists "categories_insert_own" on public.categories;

create policy "categories_select" on public.categories
  for select using (is_system OR owner_id = auth.uid());
create policy "categories_insert_own" on public.categories
  for insert with check (owner_id = auth.uid());
create policy "categories_modify_own" on public.categories
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Transactions
drop policy if exists "transactions_owner" on public.transactions;

create policy "transactions_owner" on public.transactions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Groups
drop policy if exists "groups_select_members" on public.groups;
drop policy if exists "groups_insert_owner" on public.groups;
drop policy if exists "groups_update_owner" on public.groups;

create policy "groups_select_members" on public.groups
  for select using (public.is_group_member(id) OR owner_id = auth.uid());
create policy "groups_insert_owner" on public.groups
  for insert with check (owner_id = auth.uid());
create policy "groups_update_owner" on public.groups
  for update using (owner_id = auth.uid());

-- Group members
drop policy if exists "group_members_select_members" on public.group_members;
drop policy if exists "group_members_manage_owner" on public.group_members;
drop policy if exists "group_members_insert" on public.group_members;

create policy "group_members_select_members" on public.group_members
  for select using (public.is_group_member(group_id));
create policy "group_members_insert" on public.group_members
  for insert with check (public.is_group_member(group_id) or exists (select 1 from public.groups g where g.id = group_id and g.owner_id = auth.uid()));
create policy "group_members_manage_owner" on public.group_members
  for all using (
    exists (select 1 from public.groups g where g.id = group_id and g.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.groups g where g.id = group_id and g.owner_id = auth.uid())
  );

-- Group expenses
drop policy if exists "group_expenses_select_members" on public.group_expenses;
drop policy if exists "group_expenses_insert_contributor" on public.group_expenses;
drop policy if exists "group_expenses_update_payer_or_owner" on public.group_expenses;

create policy "group_expenses_select_members" on public.group_expenses
  for select using (public.is_group_member(group_id));
create policy "group_expenses_insert_contributor" on public.group_expenses
  for insert with check (public.is_group_member(group_id));
create policy "group_expenses_update_payer_or_owner" on public.group_expenses
  for update using (
    payer_id = auth.uid()
    OR exists (select 1 from public.groups g where g.id = group_id and g.owner_id = auth.uid())
  );

-- Budgets
drop policy if exists "budgets_owner" on public.budgets;

create policy "budgets_owner" on public.budgets
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Activity feed
drop policy if exists "activity_feed_select_members" on public.activity_feed;

create policy "activity_feed_select_members" on public.activity_feed
  for select using (public.is_group_member(group_id));

-- Notifications
drop policy if exists "notifications_owner_read" on public.notifications;
drop policy if exists "notifications_owner_update" on public.notifications;

create policy "notifications_owner_read" on public.notifications
  for select using (user_id = auth.uid());
create policy "notifications_owner_update" on public.notifications
  for update using (user_id = auth.uid());

-- ============================================================================
-- COMPLETE!
-- ============================================================================
