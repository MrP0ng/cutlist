-- Fix the part quota policy that failed in the previous migration
-- Drop and recreate with correct syntax

-- Drop the failed policy if it exists
drop policy if exists part_quota on parts;

-- Create the corrected part quota policy
-- Note: For INSERT policies, we need to reference the inserting row differently
create policy part_quota
  on parts for insert
  with check (
    exists (
      select 1 from projects p 
      where p.id = parts.project_id 
      and p.owner = auth.uid()
      and (
        (select count(*) from parts existing_parts where existing_parts.project_id = p.id) < 50
        or exists (select 1 from profiles prof where prof.id = auth.uid() and prof.role = 'pro')
      )
    )
  );
