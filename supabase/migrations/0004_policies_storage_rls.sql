-- 0004_policies_storage_rls.sql
-- Strengthen RLS for policies and storage bucket for policy PDFs
-- Helper: current_agency_id() that works with either profiles.user_id or profiles.id matching auth.uid()
create or replace function public.current_agency_id() returns uuid language sql security definer
set search_path = public as $$
select p.agency_id
from public.profiles p
where p.user_id = auth.uid()
    or p.id = auth.uid()
limit 1;
$$;
grant execute on function public.current_agency_id() to authenticated;
-- Ensure RLS is enabled on policies
alter table if exists public.policies enable row level security;
-- Drop broad ALL policy if present to avoid OR-permissiveness
drop policy if exists policies_tenant_all on public.policies;
-- Policies per operation with same-agency enforcement
do $$ begin if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
        and tablename = 'policies'
        and policyname = 'policies_select_same_agency'
) then create policy policies_select_same_agency on public.policies for
select using (agency_id = public.current_agency_id());
end if;
end $$;
do $$ begin if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
        and tablename = 'policies'
        and policyname = 'policies_insert_same_agency'
) then create policy policies_insert_same_agency on public.policies for
insert with check (agency_id = public.current_agency_id());
end if;
end $$;
do $$ begin if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
        and tablename = 'policies'
        and policyname = 'policies_update_same_agency'
) then create policy policies_update_same_agency on public.policies for
update using (agency_id = public.current_agency_id()) with check (agency_id = public.current_agency_id());
end if;
end $$;
-- Only agency_owner can delete within same agency
do $$ begin if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
        and tablename = 'policies'
        and policyname = 'policies_delete_owner_only'
) then create policy policies_delete_owner_only on public.policies for delete using (
    exists (
        select 1
        from public.profiles pr
        where pr.user_id = auth.uid()
            and pr.agency_id = public.current_agency_id()
            and pr.role in ('platform_admin', 'agency_owner')
    )
    and agency_id = public.current_agency_id()
);
end if;
end $$;
-- Storage: ensure private bucket exists and remains private
insert into storage.buckets (id, name, public)
values ('policy-pdfs', 'policy-pdfs', false) on conflict (id) do
update
set public = excluded.public;
-- Ensure RLS is on for storage.objects
alter table if exists storage.objects enable row level security;
-- Remove legacy broad storage policies that could weaken isolation for policy-pdfs
drop policy if exists storage_read_policy on storage.objects;
drop policy if exists storage_insert_policy on storage.objects;
drop policy if exists storage_update_policy on storage.objects;
drop policy if exists storage_delete_policy on storage.objects;
-- Re-create payment proofs policies only (admin or same-agency)
do $$ begin if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
        and tablename = 'objects'
        and policyname = 'storage_payment_select'
) then create policy storage_payment_select on storage.objects for
select using (
        bucket_id = 'payment-proofs'
        and (
            public.is_platform_admin()
            or (metadata->>'agency_id')::uuid = public.current_agency_id()
        )
    );
end if;
end $$;
do $$ begin if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
        and tablename = 'objects'
        and policyname = 'storage_payment_insert'
) then create policy storage_payment_insert on storage.objects for
insert with check (
        bucket_id = 'payment-proofs'
        and (
            public.is_platform_admin()
            or (metadata->>'agency_id')::uuid = public.current_agency_id()
        )
    );
end if;
end $$;
do $$ begin if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
        and tablename = 'objects'
        and policyname = 'storage_payment_update'
) then create policy storage_payment_update on storage.objects for
update using (
        bucket_id = 'payment-proofs'
        and (
            public.is_platform_admin()
            or (metadata->>'agency_id')::uuid = public.current_agency_id()
        )
    ) with check (
        bucket_id = 'payment-proofs'
        and (
            public.is_platform_admin()
            or (metadata->>'agency_id')::uuid = public.current_agency_id()
        )
    );
end if;
end $$;
do $$ begin if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
        and tablename = 'objects'
        and policyname = 'storage_payment_delete'
) then create policy storage_payment_delete on storage.objects for delete using (
    bucket_id = 'payment-proofs'
    and (
        public.is_platform_admin()
        or (metadata->>'agency_id')::uuid = public.current_agency_id()
    )
);
end if;
end $$;
-- Storage policies limited to the policy-pdfs bucket, keyed by metadata.agency_id
do $$ begin if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
        and tablename = 'objects'
        and policyname = 'storage_policy_pdfs_select'
) then create policy storage_policy_pdfs_select on storage.objects for
select using (
        bucket_id = 'policy-pdfs'
        and (metadata->>'agency_id')::uuid = public.current_agency_id()
    );
end if;
end $$;
do $$ begin if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
        and tablename = 'objects'
        and policyname = 'storage_policy_pdfs_insert'
) then create policy storage_policy_pdfs_insert on storage.objects for
insert with check (
        bucket_id = 'policy-pdfs'
        and (metadata->>'agency_id')::uuid = public.current_agency_id()
    );
end if;
end $$;
do $$ begin if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
        and tablename = 'objects'
        and policyname = 'storage_policy_pdfs_update'
) then create policy storage_policy_pdfs_update on storage.objects for
update using (
        bucket_id = 'policy-pdfs'
        and (metadata->>'agency_id')::uuid = public.current_agency_id()
    ) with check (
        bucket_id = 'policy-pdfs'
        and (metadata->>'agency_id')::uuid = public.current_agency_id()
    );
end if;
end $$;
do $$ begin if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
        and tablename = 'objects'
        and policyname = 'storage_policy_pdfs_delete'
) then create policy storage_policy_pdfs_delete on storage.objects for delete using (
    bucket_id = 'policy-pdfs'
    and (metadata->>'agency_id')::uuid = public.current_agency_id()
);
end if;
end $$;