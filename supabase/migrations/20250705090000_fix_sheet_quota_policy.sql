-- Fix infinite recursion in sheet_quota policy
-- The issue is that the policy queries the same table it's protecting during INSERT

-- Drop the problematic policies
drop policy if exists sheet_quota on sheets;
drop policy if exists part_quota on parts;

-- For now, let's disable quotas and just enforce ownership
-- We can implement quotas in the application layer instead of RLS

-- Create simple ownership-only policies
create policy sheets_owner_only
  on sheets for all
  using (project_id in (select id from projects where owner = auth.uid()))
  with check (project_id in (select id from projects where owner = auth.uid()));

create policy parts_owner_only  
  on parts for all
  using (project_id in (select id from projects where owner = auth.uid()))
  with check (project_id in (select id from projects where owner = auth.uid()));
