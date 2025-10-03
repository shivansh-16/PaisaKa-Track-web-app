-- Profiles
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- Categories
drop policy if exists "categories_select" on public.categories;
drop policy if exists "categories_modify_own" on public.categories;

create policy "categories_select" on public.categories
  for select using (is_system OR owner_id = auth.uid());
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

create policy "group_members_select_members" on public.group_members
  for select using (public.is_group_member(group_id));
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