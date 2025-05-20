/*
  # Create profiles table and policies

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `email` (text)
      - `role` (text, check constraint for 'creator' or 'investor')
      - `avatar_url` (text)
      - `bio` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for:
      - Public read access
      - User can insert own profile
      - User can update own profile
    - Create indexes for performance
*/

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  role text check (role in ('creator', 'investor')),
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create indexes
create index profiles_id_index on profiles (id);
create index profiles_email_index on profiles (email);

-- Create a trigger to set updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

  -- allow a signed-in user to insert _their own_ profile row
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- allow a signed-in user to update _their own_ profile row
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING       (auth.uid() = id)
  WITH CHECK  (auth.uid() = id);
  
-- allow a signed-in user to select _their own_ profile row
Create POLICY "Authenticated users can read all profiles"
  on "public"."users"
  to authenticated
  using (
    true
  );