create extension if not exists pgcrypto;

create type public.user_role as enum ('OWNER', 'MANAGER', 'MEMBER');
create type public.tx_type as enum ('수입', '지출', '이체');

create table if not exists public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.spaces (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  invite_password text,
  created_at timestamptz default now()
);

create table if not exists public.space_members (
  space_id uuid references public.spaces on delete cascade,
  user_id uuid references public.user_profiles on delete cascade,
  role public.user_role default 'MEMBER',
  joined_at timestamptz default now(),
  primary key (space_id, user_id)
);

create table if not exists public.accounts (
  id uuid default gen_random_uuid() primary key,
  space_id uuid references public.spaces on delete cascade,
  name text not null,
  type text not null,
  sub_type text,
  asset_group text,
  owner text,
  initial_balance numeric default 0,
  created_at timestamptz default now()
);

create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  space_id uuid references public.spaces on delete cascade,
  name text not null,
  type text not null,
  created_at timestamptz default now()
);

create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  space_id uuid references public.spaces on delete cascade,
  user_id uuid references public.user_profiles,
  date date not null,
  type public.tx_type not null,
  amount numeric not null,
  memo text,
  from_account_id uuid references public.accounts(id),
  from_category_id uuid references public.categories(id),
  to_account_id uuid references public.accounts(id),
  to_category_id uuid references public.categories(id),
  created_at timestamptz default now(),
  constraint check_transaction_logic check (
    (type = '수입' and from_category_id is not null and to_account_id is not null) or
    (type = '지출' and from_account_id is not null and to_category_id is not null) or
    (type = '이체' and from_account_id is not null and to_account_id is not null)
  )
);

create index if not exists idx_space_members_user_id on public.space_members (user_id, space_id);
create index if not exists idx_accounts_space_id on public.accounts (space_id);
create index if not exists idx_categories_space_id on public.categories (space_id, type);
create index if not exists idx_transactions_space_date on public.transactions (space_id, date desc);
create index if not exists idx_transactions_from_account on public.transactions (from_account_id);
create index if not exists idx_transactions_to_account on public.transactions (to_account_id);
create index if not exists idx_transactions_from_category on public.transactions (from_category_id);
create index if not exists idx_transactions_to_category on public.transactions (to_category_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(
      new.raw_user_meta_data ->> 'name',
      split_part(coalesce(new.email, '사용자'), '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
    set email = excluded.email,
        name = excluded.name,
        avatar_url = excluded.avatar_url;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_space_member(target_space_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.space_members
    where space_id = target_space_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.can_manage_space(target_space_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.space_members
    where space_id = target_space_id
      and user_id = auth.uid()
      and role in ('OWNER', 'MANAGER')
  );
$$;

create or replace function public.create_space_with_owner(space_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  new_space_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  insert into public.spaces (name)
  values (space_name)
  returning id into new_space_id;

  insert into public.space_members (space_id, user_id, role)
  values (new_space_id, current_user_id, 'OWNER');

  return new_space_id;
end;
$$;

create or replace function public.get_space_invite_info(
  target_space_id uuid,
  hashed_password text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_space public.spaces%rowtype;
begin
  select *
  into resolved_space
  from public.spaces
  where id = target_space_id;

  return jsonb_build_object(
    'space_name', coalesce(resolved_space.name, '우리 공간'),
    'is_direct_link_valid',
      case
        when resolved_space.id is null then false
        when hashed_password is null then false
        else resolved_space.invite_password = hashed_password
      end
  );
end;
$$;

create or replace function public.join_space_with_invite(
  target_space_id uuid,
  plain_password text default null,
  hashed_password text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  resolved_space public.spaces%rowtype;
  password_valid boolean := false;
  already_member boolean := false;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select *
  into resolved_space
  from public.spaces
  where id = target_space_id;

  if resolved_space.id is null then
    return jsonb_build_object(
      'joined', false,
      'already_member', false,
      'valid', false,
      'space_name', null
    );
  end if;

  select exists (
    select 1
    from public.space_members
    where space_id = target_space_id
      and user_id = current_user_id
  )
  into already_member;

  if already_member then
    return jsonb_build_object(
      'joined', false,
      'already_member', true,
      'valid', true,
      'space_name', resolved_space.name
    );
  end if;

  password_valid :=
    case
      when hashed_password is not null then resolved_space.invite_password = hashed_password
      when plain_password is not null and resolved_space.invite_password is not null then crypt(plain_password, resolved_space.invite_password) = resolved_space.invite_password
      else false
    end;

  if not password_valid then
    return jsonb_build_object(
      'joined', false,
      'already_member', false,
      'valid', false,
      'space_name', resolved_space.name
    );
  end if;

  insert into public.space_members (space_id, user_id, role)
  values (target_space_id, current_user_id, 'MEMBER')
  on conflict (space_id, user_id) do nothing;

  return jsonb_build_object(
    'joined', true,
    'already_member', false,
    'valid', true,
    'space_name', resolved_space.name
  );
end;
$$;

create or replace function public.set_space_invite_password(
  target_space_id uuid,
  plain_password text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  hashed_password text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.can_manage_space(target_space_id) then
    raise exception 'Only owner or manager can create invite links';
  end if;

  hashed_password := crypt(plain_password, gen_salt('bf'));

  update public.spaces
  set invite_password = hashed_password
  where id = target_space_id;

  return hashed_password;
end;
$$;

create or replace function public.update_space_member_role(
  target_space_id uuid,
  target_user_id uuid,
  next_role public.user_role
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  owner_count integer;
  target_current_role public.user_role;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1
    from public.space_members
    where space_id = target_space_id
      and user_id = auth.uid()
      and role = 'OWNER'
  ) then
    raise exception 'Only owner can update roles';
  end if;

  if auth.uid() = target_user_id then
    raise exception 'You cannot change your own role';
  end if;

  select role
  into target_current_role
  from public.space_members
  where space_id = target_space_id
    and user_id = target_user_id;

  if target_current_role = 'OWNER' and next_role <> 'OWNER' then
    select count(*)
    into owner_count
    from public.space_members
    where space_id = target_space_id
      and role = 'OWNER';

    if owner_count <= 1 then
      raise exception 'At least one owner must remain';
    end if;
  end if;

  update public.space_members
  set role = next_role
  where space_id = target_space_id
    and user_id = target_user_id;
end;
$$;

alter table public.user_profiles enable row level security;
alter table public.spaces enable row level security;
alter table public.space_members enable row level security;
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "profiles are viewable by shared-space members" on public.user_profiles;
create policy "profiles are viewable by shared-space members"
on public.user_profiles
for select
using (
  id = auth.uid()
  or exists (
    select 1
    from public.space_members me
    join public.space_members other on me.space_id = other.space_id
    where me.user_id = auth.uid()
      and other.user_id = public.user_profiles.id
  )
);

drop policy if exists "users can insert own profile" on public.user_profiles;
create policy "users can insert own profile"
on public.user_profiles
for insert
with check (id = auth.uid());

drop policy if exists "users can update own profile" on public.user_profiles;
create policy "users can update own profile"
on public.user_profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "spaces are viewable by members" on public.spaces;
create policy "spaces are viewable by members"
on public.spaces
for select
using (public.is_space_member(id));

drop policy if exists "space members can read memberships" on public.space_members;
create policy "space members can read memberships"
on public.space_members
for select
using (public.is_space_member(space_id));

drop policy if exists "accounts are readable by members" on public.accounts;
create policy "accounts are readable by members"
on public.accounts
for select
using (public.is_space_member(space_id));

drop policy if exists "accounts are mutable by members" on public.accounts;
create policy "accounts are mutable by members"
on public.accounts
for all
using (public.is_space_member(space_id))
with check (public.is_space_member(space_id));

drop policy if exists "categories are readable by members" on public.categories;
create policy "categories are readable by members"
on public.categories
for select
using (public.is_space_member(space_id));

drop policy if exists "categories are mutable by members" on public.categories;
create policy "categories are mutable by members"
on public.categories
for all
using (public.is_space_member(space_id))
with check (public.is_space_member(space_id));

drop policy if exists "transactions are readable by members" on public.transactions;
create policy "transactions are readable by members"
on public.transactions
for select
using (public.is_space_member(space_id));

drop policy if exists "transactions are mutable by members" on public.transactions;
create policy "transactions are mutable by members"
on public.transactions
for all
using (public.is_space_member(space_id))
with check (public.is_space_member(space_id));

grant execute on function public.create_space_with_owner(text) to authenticated;
grant execute on function public.get_space_invite_info(uuid, text) to anon, authenticated;
grant execute on function public.join_space_with_invite(uuid, text, text) to authenticated;
grant execute on function public.set_space_invite_password(uuid, text) to authenticated;
grant execute on function public.update_space_member_role(uuid, uuid, public.user_role) to authenticated;
