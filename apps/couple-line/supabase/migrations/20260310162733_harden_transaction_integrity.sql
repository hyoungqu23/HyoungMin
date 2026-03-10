alter table public.transactions
drop constraint if exists check_transaction_logic;

alter table public.transactions
add constraint check_transaction_logic
check (
  (
    type = '수입'
    and from_category_id is not null
    and to_account_id is not null
    and from_account_id is null
    and to_category_id is null
  ) or (
    type = '지출'
    and from_account_id is not null
    and to_category_id is not null
    and from_category_id is null
    and to_account_id is null
  ) or (
    type = '이체'
    and from_account_id is not null
    and to_account_id is not null
    and from_category_id is null
    and to_category_id is null
    and from_account_id <> to_account_id
  )
);

create or replace function public.validate_transaction_integrity()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  resolved_from_account_space uuid;
  resolved_to_account_space uuid;
  resolved_from_category_space uuid;
  resolved_to_category_space uuid;
begin
  if new.space_id is null then
    raise exception 'transactions.space_id is required';
  end if;

  if new.type = '수입' then
    if not (
      new.from_category_id is not null
      and new.to_account_id is not null
      and new.from_account_id is null
      and new.to_category_id is null
    ) then
      raise exception 'Income transactions must use from_category_id and to_account_id only';
    end if;
  elsif new.type = '지출' then
    if not (
      new.from_account_id is not null
      and new.to_category_id is not null
      and new.from_category_id is null
      and new.to_account_id is null
    ) then
      raise exception 'Expense transactions must use from_account_id and to_category_id only';
    end if;
  elsif new.type = '이체' then
    if not (
      new.from_account_id is not null
      and new.to_account_id is not null
      and new.from_category_id is null
      and new.to_category_id is null
    ) then
      raise exception 'Transfer transactions must use from_account_id and to_account_id only';
    end if;

    if new.from_account_id = new.to_account_id then
      raise exception 'Transfer transactions cannot use the same account on both sides';
    end if;
  end if;

  if new.from_account_id is not null then
    select space_id
    into resolved_from_account_space
    from public.accounts
    where id = new.from_account_id;

    if resolved_from_account_space is null then
      raise exception 'from_account_id must reference an existing account';
    end if;

    if resolved_from_account_space <> new.space_id then
      raise exception 'from_account_id must belong to the same space as the transaction';
    end if;
  end if;

  if new.to_account_id is not null then
    select space_id
    into resolved_to_account_space
    from public.accounts
    where id = new.to_account_id;

    if resolved_to_account_space is null then
      raise exception 'to_account_id must reference an existing account';
    end if;

    if resolved_to_account_space <> new.space_id then
      raise exception 'to_account_id must belong to the same space as the transaction';
    end if;
  end if;

  if new.from_category_id is not null then
    select space_id
    into resolved_from_category_space
    from public.categories
    where id = new.from_category_id;

    if resolved_from_category_space is null then
      raise exception 'from_category_id must reference an existing category';
    end if;

    if resolved_from_category_space <> new.space_id then
      raise exception 'from_category_id must belong to the same space as the transaction';
    end if;
  end if;

  if new.to_category_id is not null then
    select space_id
    into resolved_to_category_space
    from public.categories
    where id = new.to_category_id;

    if resolved_to_category_space is null then
      raise exception 'to_category_id must reference an existing category';
    end if;

    if resolved_to_category_space <> new.space_id then
      raise exception 'to_category_id must belong to the same space as the transaction';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists validate_transaction_integrity_trigger on public.transactions;

create trigger validate_transaction_integrity_trigger
before insert or update on public.transactions
for each row execute function public.validate_transaction_integrity();
