-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. profiles table (mirrors auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  role text check (role in ('admin','staff','customer')) not null default 'customer',
  full_name text,
  phone text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. vehicles table
create table vehicles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade,
  plate varchar(12) not null,
  make varchar(64),
  model varchar(64),
  year smallint check (year >= 1900 and year <= extract(year from now()) + 1),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. policies table
create table policies (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  type text check (type in ('first_party','third_party')) not null,
  insurer text not null,
  policy_number text,
  pdf_url text,
  start_date date not null,
  end_date date not null,
  premium_amount numeric(10,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint valid_date_range check (end_date > start_date)
);

-- 4. payments table
create table payments (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid references policies(id) on delete cascade,
  amount numeric(10,2) not null check (amount > 0),
  paid_at date not null,
  proof_url text,
  payment_method text,
  reference_number text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. loyalty_tiers table
create table loyalty_tiers (
  id serial primary key,
  name text not null unique,
  threshold numeric(10,2) not null check (threshold >= 0),
  multiplier numeric(3,2) not null check (multiplier > 0),
  color text default '#000000',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. points_ledger table
create table points_ledger (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  policy_id uuid references policies(id) on delete cascade,
  points integer not null,
  transaction_type text check (transaction_type in ('earned','redeemed','expired')) default 'earned',
  description text,
  created_at timestamptz default now()
);

-- 7. policy_renewals table (for tracking renewal reminders)
create table policy_renewals (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid references policies(id) on delete cascade,
  reminder_days integer not null check (reminder_days > 0),
  sent_at timestamptz,
  email_sent boolean default false,
  whatsapp_link text,
  created_at timestamptz default now()
);

-- Indexes for better performance
create index idx_profiles_role on profiles(role);
create index idx_vehicles_owner_id on vehicles(owner_id);
create index idx_policies_vehicle_id on policies(vehicle_id);
create index idx_policies_end_date on policies(end_date);
create index idx_policies_type on policies(type);
create index idx_payments_policy_id on payments(policy_id);
create index idx_payments_paid_at on payments(paid_at);
create index idx_points_ledger_profile_id on points_ledger(profile_id);
create index idx_points_ledger_policy_id on points_ledger(policy_id);
create index idx_policy_renewals_policy_id on policy_renewals(policy_id);
create index idx_policy_renewals_sent_at on policy_renewals(sent_at);

-- Row Level Security (RLS) Policies
alter table profiles enable row level security;
alter table vehicles enable row level security;
alter table policies enable row level security;
alter table payments enable row level security;
alter table loyalty_tiers enable row level security;
alter table points_ledger enable row level security;
alter table policy_renewals enable row level security;

-- Profiles policies
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Admin/Staff can view all profiles" on profiles
  for all using (
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() 
      and p.role in ('admin', 'staff')
    )
  );

-- Vehicles policies
create policy "Owner or staff can view vehicles" on vehicles
  for select using (
    owner_id = auth.uid() or
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() 
      and p.role in ('admin', 'staff')
    )
  );

create policy "Admin/Staff can manage all vehicles" on vehicles
  for all using (
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() 
      and p.role in ('admin', 'staff')
    )
  );

-- Policies policies (insurance policies)
create policy "Owner or staff can view policies" on policies
  for select using (
    exists (
      select 1 from vehicles v 
      where v.id = policies.vehicle_id 
      and (v.owner_id = auth.uid() or
           exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'staff')))
    )
  );

create policy "Admin/Staff can manage all policies" on policies
  for all using (
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() 
      and p.role in ('admin', 'staff')
    )
  );

-- Payments policies
create policy "Owner or staff can view payments" on payments
  for select using (
    exists (
      select 1 from policies pol
      join vehicles v on v.id = pol.vehicle_id
      where pol.id = payments.policy_id 
      and (v.owner_id = auth.uid() or
           exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'staff')))
    )
  );

create policy "Admin/Staff can manage all payments" on payments
  for all using (
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() 
      and p.role in ('admin', 'staff')
    )
  );

-- Loyalty tiers policies (read-only for all authenticated users)
create policy "All authenticated users can view loyalty tiers" on loyalty_tiers
  for select using (auth.uid() is not null);

create policy "Admin can manage loyalty tiers" on loyalty_tiers
  for all using (
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() 
      and p.role = 'admin'
    )
  );

-- Points ledger policies
create policy "Users can view own points" on points_ledger
  for select using (
    profile_id = auth.uid() or
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() 
      and p.role in ('admin', 'staff')
    )
  );

create policy "Admin/Staff can manage all points" on points_ledger
  for all using (
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() 
      and p.role in ('admin', 'staff')
    )
  );

-- Policy renewals policies
create policy "Admin/Staff can manage renewals" on policy_renewals
  for all using (
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() 
      and p.role in ('admin', 'staff')
    )
  );

-- Functions for automatic timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for automatic timestamps
create trigger update_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at_column();

create trigger update_vehicles_updated_at
  before update on vehicles
  for each row execute function update_updated_at_column();

create trigger update_policies_updated_at
  before update on policies
  for each row execute function update_updated_at_column();

create trigger update_payments_updated_at
  before update on payments
  for each row execute function update_updated_at_column();

create trigger update_loyalty_tiers_updated_at
  before update on loyalty_tiers
  for each row execute function update_updated_at_column();

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user profile creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to calculate loyalty points
create or replace function calculate_loyalty_points(amount numeric, profile_id uuid)
returns integer as $$
declare
  total_payments numeric;
  current_tier loyalty_tiers%rowtype;
  points integer;
begin
  -- Get total payments for this profile
  select coalesce(sum(p.amount), 0) into total_payments
  from payments p
  join policies pol on pol.id = p.policy_id
  join vehicles v on v.id = pol.vehicle_id
  where v.owner_id = profile_id;
  
  -- Find current loyalty tier
  select * into current_tier
  from loyalty_tiers
  where threshold <= total_payments
  order by threshold desc
  limit 1;
  
  -- If no tier found, use the lowest tier
  if current_tier.id is null then
    select * into current_tier
    from loyalty_tiers
    order by threshold asc
    limit 1;
  end if;
  
  -- Calculate points
  points := floor(amount * current_tier.multiplier);
  
  return points;
end;
$$ language plpgsql;

-- Function to auto-award points on payment
create or replace function award_loyalty_points()
returns trigger as $$
declare
  vehicle_owner_id uuid;
  points_earned integer;
begin
  -- Get the vehicle owner
  select v.owner_id into vehicle_owner_id
  from vehicles v
  join policies pol on pol.id = new.policy_id
  where v.id = pol.vehicle_id;
  
  -- Calculate points
  points_earned := calculate_loyalty_points(new.amount, vehicle_owner_id);
  
  -- Insert points into ledger
  insert into points_ledger (profile_id, policy_id, points, transaction_type, description)
  values (
    vehicle_owner_id,
    new.policy_id,
    points_earned,
    'earned',
    'Points earned from payment of RM ' || new.amount::text
  );
  
  return new;
end;
$$ language plpgsql;

-- Trigger to award points on payment insert
create trigger award_points_on_payment
  after insert on payments
  for each row execute function award_loyalty_points();

-- Seed data for loyalty tiers
insert into loyalty_tiers (name, threshold, multiplier, color) values
  ('Bronze', 0, 1.0, '#CD7F32'),
  ('Silver', 1000, 1.5, '#C0C0C0'),
  ('Gold', 5000, 2.0, '#FFD700'),
  ('Platinum', 15000, 3.0, '#E5E4E2'),
  ('Diamond', 50000, 5.0, '#B9F2FF');

-- Create storage bucket for policy documents
insert into storage.buckets (id, name, public) values ('policies', 'policies', false);

-- Storage policies
create policy "Admin/Staff can upload policy documents" on storage.objects
  for insert with check (
    bucket_id = 'policies' and
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() 
      and p.role in ('admin', 'staff')
    )
  );

create policy "Admin/Staff can view policy documents" on storage.objects
  for select using (
    bucket_id = 'policies' and
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() 
      and p.role in ('admin', 'staff')
    )
  );

create policy "Admin/Staff can delete policy documents" on storage.objects
  for delete using (
    bucket_id = 'policies' and
    exists (
      select 1 from profiles p 
      where p.id = auth.uid() 
      and p.role = 'admin'
    )
  ); 