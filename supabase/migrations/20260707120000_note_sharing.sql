-- ============================================================
-- Notas compartidas entre usuarios (colaboración)
-- Requiere el esquema base (20260707100000_initial_schema.sql),
-- donde notes.id es uuid. Si en un proyecto existente tu columna
-- notes.id fuera bigint, reemplaza "uuid" por "bigint" en note_id
-- y en los parámetros p_note_id de las funciones.
-- ============================================================

create table if not exists public.note_shares (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.notes(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  shared_with uuid not null references auth.users(id) on delete cascade,
  can_edit boolean not null default true,
  created_at timestamptz not null default now(),
  unique (note_id, shared_with)
);

alter table public.note_shares enable row level security;

-- Helpers SECURITY DEFINER: evitan recursión entre las políticas RLS
-- de notes y note_shares.
create or replace function public.is_note_owner(p_note_id uuid)
returns boolean
language sql security definer set search_path = public
as $$
  select exists (
    select 1 from public.notes n
    where n.id = p_note_id and n.user_id = auth.uid()
  );
$$;

create or replace function public.has_shared_access(p_note_id uuid)
returns boolean
language sql security definer set search_path = public
as $$
  select exists (
    select 1 from public.note_shares s
    where s.note_id = p_note_id and s.shared_with = auth.uid()
  );
$$;

create or replace function public.can_edit_shared_note(p_note_id uuid)
returns boolean
language sql security definer set search_path = public
as $$
  select exists (
    select 1 from public.note_shares s
    where s.note_id = p_note_id and s.shared_with = auth.uid() and s.can_edit
  );
$$;

-- Políticas de note_shares
drop policy if exists "owner manages shares" on public.note_shares;
create policy "owner manages shares" on public.note_shares
  for all
  using (public.is_note_owner(note_id))
  with check (owner_id = auth.uid() and public.is_note_owner(note_id));

drop policy if exists "shared user reads own shares" on public.note_shares;
create policy "shared user reads own shares" on public.note_shares
  for select using (shared_with = auth.uid());

drop policy if exists "shared user can leave" on public.note_shares;
create policy "shared user can leave" on public.note_shares
  for delete using (shared_with = auth.uid());

-- Políticas extra sobre notes: acceso de colaboradores
drop policy if exists "shared users can read notes" on public.notes;
create policy "shared users can read notes" on public.notes
  for select using (public.has_shared_access(id));

drop policy if exists "shared editors can update notes" on public.notes;
create policy "shared editors can update notes" on public.notes
  for update
  using (public.can_edit_shared_note(id))
  with check (public.can_edit_shared_note(id));

-- Compartir una nota buscando al usuario por su correo (tabla profiles)
create or replace function public.share_note_with_email(p_note_id uuid, p_email text)
returns json
language plpgsql security definer set search_path = public
as $$
declare
  v_target uuid;
begin
  if not public.is_note_owner(p_note_id) then
    return json_build_object('ok', false, 'error', 'Solo el dueño puede compartir esta nota.');
  end if;

  select id into v_target
  from public.profiles
  where lower(email) = lower(trim(p_email))
  limit 1;

  if v_target is null then
    return json_build_object('ok', false, 'error', 'No existe un usuario registrado con ese correo.');
  end if;

  if v_target = auth.uid() then
    return json_build_object('ok', false, 'error', 'No puedes compartir una nota contigo mismo.');
  end if;

  insert into public.note_shares (note_id, owner_id, shared_with)
  values (p_note_id, auth.uid(), v_target)
  on conflict (note_id, shared_with) do nothing;

  return json_build_object('ok', true);
end;
$$;

-- Listar colaboradores de una nota (visible para dueño y colaboradores)
create or replace function public.get_note_collaborators(p_note_id uuid)
returns table (share_id uuid, user_id uuid, email text, full_name text, can_edit boolean)
language sql security definer set search_path = public
as $$
  select s.id, s.shared_with, p.email, p.full_name, s.can_edit
  from public.note_shares s
  join public.profiles p on p.id = s.shared_with
  where s.note_id = p_note_id
    and (public.is_note_owner(p_note_id) or public.has_shared_access(p_note_id));
$$;
