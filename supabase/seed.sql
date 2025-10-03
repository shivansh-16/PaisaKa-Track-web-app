drop trigger if exists trg_budget_alert_txn on public.transactions;
drop function if exists public.check_budget_alert_for_transaction();

create or replace function public.check_budget_alert_for_transaction()
returns trigger
language plpgsql
as $$
declare
  month_start timestamptz := date_trunc('month', new.occurred_at);
  spent numeric := 0;
begin
  -- Only for expenses
  if new.type::text <> 'expense' then
    return new;
  end if;

  -- Sum current-month expenses for user (optionally category-scoped)
  select coalesce(sum(amount), 0) into spent
  from public.transactions
  where user_id = new.user_id
    and type = 'expense'
    and occurred_at >= month_start
    and occurred_at < (month_start + interval '1 month')
    and (category_id is null or category_id = new.category_id or new.category_id is null);

  -- Insert notifications for budgets that cross threshold
  insert into public.notifications (user_id, type, message, metadata)
  select
    b.user_id,
    'budget_alert',
    'Budget alert: you have spent ' || round((spent / b.amount) * 100, 1) || '% of ' || b.name,
    jsonb_build_object('budget_id', b.id, 'spent', spent, 'limit', b.amount)
  from public.budgets b
  where b.user_id = new.user_id
    and b.period = 'monthly'
    and (b.category_id is null or b.category_id = new.category_id)
    and b.amount > 0
    and (spent / b.amount) * 100 >= b.alerts_threshold;

  return new;
end;
$$;

create trigger trg_budget_alert_txn
  after insert on public.transactions
  for each row execute function public.check_budget_alert_for_transaction();