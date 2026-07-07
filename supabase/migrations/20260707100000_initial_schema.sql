-- ============================================================
-- Esquema base de la aplicación de notas
-- Tablas: profiles, notes + trigger de creación de perfil.
-- Se ejecuta ANTES de 20260707120000_note_sharing.sql.
-- Todo es idempotente (if not exists / drop policy if exists),
-- por lo que también puede ejecutarse sobre el proyecto actual
-- sin romper nada.
-- ============================================================

-- ------------------------------------------------------------
-- 1. PERFILES: copia pública de los datos básicos de auth.users
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Cada usuario solo ve y edita su propio perfil
drop policy if exists "users can view own profile" on public.profiles;
create policy "users can view own profile" on public.profiles
  for select using (id = auth.uid());

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ------------------------------------------------------------
-- 2. NOTAS
-- ------------------------------------------------------------
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  content text,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_user_id_idx on public.notes (user_id);
create index if not exists notes_updated_at_idx on public.notes (updated_at desc);

alter table public.notes enable row level security;

-- El dueño tiene control total sobre sus notas.
-- (El acceso de colaboradores se agrega en la migración de note_sharing.)
drop policy if exists "owner can read own notes" on public.notes;
create policy "owner can read own notes" on public.notes
  for select using (user_id = auth.uid());

drop policy if exists "owner can insert own notes" on public.notes;
create policy "owner can insert own notes" on public.notes
  for insert with check (user_id = auth.uid());

drop policy if exists "owner can update own notes" on public.notes;
create policy "owner can update own notes" on public.notes
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "owner can delete own notes" on public.notes;
create policy "owner can delete own notes" on public.notes
  for delete using (user_id = auth.uid());

-- ------------------------------------------------------------
-- 3. TRIGGER: crear el perfil automáticamente al registrarse.
-- El registro (app/register) envía full_name en los metadatos.
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Nuevo Usuario')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
