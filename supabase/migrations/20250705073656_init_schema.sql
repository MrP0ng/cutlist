-- Task 2: Supabase Schema, RLS & Anonymous Auth
-- Create relational schema for profiles, projects, sheets, and parts
-- Implement Row Level Security (RLS) with quota enforcement

-- Profiles (one-to-one with auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text default 'free',
  pro_until timestamptz
);

-- Projects (logical jobs)
create table projects (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id),
  name text,
  created_at timestamptz default now()
);

-- Sheets (source panels)
create table sheets (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references projects(id) on delete cascade,
    material text,
    length_mm int not null,
    width_mm  int not null,
    thickness_mm int,
    price numeric,
    created_at timestamptz default now()
);

-- Parts (rectangles to cut)
create table parts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  width_mm int not null,
  height_mm int not null,
  qty int default 1,
  label text
);

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table projects enable row level security;
alter table sheets   enable row level security;
alter table parts    enable row level security;

-- Owner read/write policies
create policy owner_rw_projects
  on projects for all
  using  ( owner = auth.uid() )
  with check ( owner = auth.uid() );

create policy owner_rw_sheets
  on sheets for all
  using  ( project_id in (select id from projects where owner = auth.uid()) )
  with check ( project_id in (select id from projects where owner = auth.uid()) );

create policy owner_rw_parts
  on parts for all
  using  ( project_id in (select id from projects where owner = auth.uid()) )
  with check ( project_id in (select id from projects where owner = auth.uid()) );

-- Profiles policy - users can read/write their own profile
create policy owner_rw_profiles
  on profiles for all
  using ( id = auth.uid() )
  with check ( id = auth.uid() );

-- Free-tier quotas (bypass if role = 'pro')
create policy project_quota
  on projects for insert
  with check (
    ( select count(*) from projects where owner = auth.uid() ) < 5
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'pro')
  );

create policy sheet_quota
  on sheets for insert
  with check (
    ( select count(*)
        from sheets
        where project_id in (select id from projects where owner = auth.uid())
    ) < 5
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'pro')
  );

create policy part_quota
  on parts for insert
  with check (
    ( select count(*) from parts where project_id = parts.project_id ) < 50
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'pro')
  );

-- Function to automatically create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'free');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger to automatically create profile when user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Function to check usage quotas
create or replace function get_usage()
returns json as $$
declare
  user_id uuid := auth.uid();
  project_count int;
  sheet_count int;
  part_count int;
  user_role text;
  pro_expires timestamptz;
begin
  -- Get user role and pro expiration
  select role, pro_until into user_role, pro_expires
  from profiles where id = user_id;
  
  -- Count projects
  select count(*) into project_count
  from projects where owner = user_id;
  
  -- Count sheets
  select count(*) into sheet_count
  from sheets s
  join projects p on s.project_id = p.id
  where p.owner = user_id;
  
  -- Count parts across all user projects
  select count(*) into part_count
  from parts pt
  join projects p on pt.project_id = p.id
  where p.owner = user_id;
  
  return json_build_object(
    'projects', project_count,
    'sheets', sheet_count,
    'parts', part_count,
    'role', coalesce(user_role, 'free'),
    'pro_until', pro_expires,
    'limits', json_build_object(
      'projects', case when coalesce(user_role, 'free') = 'pro' then null else 5 end,
      'sheets', case when coalesce(user_role, 'free') = 'pro' then null else 5 end,
      'parts_per_project', case when coalesce(user_role, 'free') = 'pro' then null else 50 end
    )
  );
end;
$$ language plpgsql security definer set search_path = public;
