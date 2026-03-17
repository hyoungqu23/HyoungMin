-- Add expiration column for invite links
alter table public.spaces
add column if not exists invite_expires_at timestamptz;

-- Update set_space_invite_password to accept expiration hours (default 72h)
create or replace function public.set_space_invite_password(
  target_space_id uuid,
  plain_password text,
  expire_hours integer default 72
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
  set invite_password = hashed_password,
      invite_expires_at = now() + (expire_hours || ' hours')::interval
  where id = target_space_id;

  return hashed_password;
end;
$$;

-- Update join_space_with_invite to check expiration
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
      'expired', false,
      'space_name', null
    );
  end if;

  -- Check if invite link has expired
  if resolved_space.invite_expires_at is not null
     and resolved_space.invite_expires_at < now() then
    return jsonb_build_object(
      'joined', false,
      'already_member', false,
      'valid', false,
      'expired', true,
      'space_name', resolved_space.name
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
      'expired', false,
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
      'expired', false,
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
    'expired', false,
    'space_name', resolved_space.name
  );
end;
$$;

-- Update get_space_invite_info to return expiration status
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
  is_expired boolean;
begin
  select *
  into resolved_space
  from public.spaces
  where id = target_space_id;

  is_expired := resolved_space.invite_expires_at is not null
    and resolved_space.invite_expires_at < now();

  return jsonb_build_object(
    'space_name', coalesce(resolved_space.name, '우리 공간'),
    'is_expired', is_expired,
    'is_direct_link_valid',
      case
        when resolved_space.id is null then false
        when is_expired then false
        when hashed_password is null then false
        else resolved_space.invite_password = hashed_password
      end
  );
end;
$$;

-- Update grant for new parameter
grant execute on function public.set_space_invite_password(uuid, text, integer) to authenticated;
