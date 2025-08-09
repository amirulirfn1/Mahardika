# Seeding and initial setup

Use Supabase Studio or SQL editor to create initial records.

1. Create an agency

```sql
insert into public.agencies (id, name, slug, owner_id, plan)
values (gen_random_uuid(), 'First Agency', 'first-agency', auth.uid(), 'Lite')
returning id;
```

2. Create a platform admin profile linked to your user and agency

```sql
insert into public.profiles (user_id, agency_id, role, full_name)
values (auth.uid(), (select id from public.agencies where slug = 'first-agency'), 'platform_admin', 'Admin');
```

3. Optionally create a staff profile for testing

```sql
insert into public.agency_staff (agency_id, user_id, role)
values ((select id from public.agencies where slug = 'first-agency'), auth.uid(), 'staff')
ON CONFLICT DO NOTHING;
```

Note: Replace auth.uid() with a specific user UUID when running outside of an authenticated session.
