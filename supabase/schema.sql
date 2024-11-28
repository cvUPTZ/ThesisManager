-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint users_email_check check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Theses table
create table public.theses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  title text,
  field text,
  supervisor text,
  university text,
  citation_style text check (citation_style in ('APA', 'MLA', 'Chicago')),
  template text check (template in ('APA', 'MLA', 'Chicago')),
  keywords text[],
  abstract text,
  target_date date,
  language text default 'en',
  word_count_goal integer default 10000,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chapters table
create table public.chapters (
  id uuid default gen_random_uuid() primary key,
  thesis_id uuid references public.theses on delete cascade not null,
  title text not null,
  order_index integer not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sections table
create table public.sections (
  id uuid default gen_random_uuid() primary key,
  chapter_id uuid references public.chapters on delete cascade not null,
  title text not null,
  content text,
  order_index integer not null,
  status text check (status in ('draft', 'review', 'final')) default 'draft',
  word_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Figures table
create table public.figures (
  id uuid default gen_random_uuid() primary key,
  section_id uuid references public.sections on delete cascade not null,
  url text not null,
  caption text,
  alt_text text,
  source text,
  license text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- References table
create table public.references (
  id uuid default gen_random_uuid() primary key,
  thesis_id uuid references public.theses on delete cascade not null,
  title text not null,
  authors text[] not null,
  year integer not null,
  type text not null,
  url text,
  doi text,
  journal text,
  volume text,
  issue text,
  pages text,
  publisher text,
  notes text,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security Policies

-- Users table policies
alter table public.users enable row level security;

create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

-- Theses table policies
alter table public.theses enable row level security;

create policy "Users can view their own theses"
  on public.theses for select
  using (auth.uid() = user_id);

create policy "Users can create their own theses"
  on public.theses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own theses"
  on public.theses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own theses"
  on public.theses for delete
  using (auth.uid() = user_id);

-- Chapters table policies
alter table public.chapters enable row level security;

create policy "Users can view chapters of their theses"
  on public.chapters for select
  using (
    exists (
      select 1 from public.theses
      where theses.id = chapters.thesis_id
      and theses.user_id = auth.uid()
    )
  );

create policy "Users can create chapters in their theses"
  on public.chapters for insert
  with check (
    exists (
      select 1 from public.theses
      where theses.id = chapters.thesis_id
      and theses.user_id = auth.uid()
    )
  );

create policy "Users can update chapters in their theses"
  on public.chapters for update
  using (
    exists (
      select 1 from public.theses
      where theses.id = chapters.thesis_id
      and theses.user_id = auth.uid()
    )
  );

create policy "Users can delete chapters in their theses"
  on public.chapters for delete
  using (
    exists (
      select 1 from public.theses
      where theses.id = chapters.thesis_id
      and theses.user_id = auth.uid()
    )
  );

-- Sections table policies
alter table public.sections enable row level security;

create policy "Users can view sections of their theses"
  on public.sections for select
  using (
    exists (
      select 1 from public.chapters
      join public.theses on theses.id = chapters.thesis_id
      where chapters.id = sections.chapter_id
      and theses.user_id = auth.uid()
    )
  );

create policy "Users can create sections in their theses"
  on public.sections for insert
  with check (
    exists (
      select 1 from public.chapters
      join public.theses on theses.id = chapters.thesis_id
      where chapters.id = sections.chapter_id
      and theses.user_id = auth.uid()
    )
  );

create policy "Users can update sections in their theses"
  on public.sections for update
  using (
    exists (
      select 1 from public.chapters
      join public.theses on theses.id = chapters.thesis_id
      where chapters.id = sections.chapter_id
      and theses.user_id = auth.uid()
    )
  );

create policy "Users can delete sections in their theses"
  on public.sections for delete
  using (
    exists (
      select 1 from public.chapters
      join public.theses on theses.id = chapters.thesis_id
      where chapters.id = sections.chapter_id
      and theses.user_id = auth.uid()
    )
  );

-- Figures table policies
alter table public.figures enable row level security;

create policy "Users can view figures in their theses"
  on public.figures for select
  using (
    exists (
      select 1 from public.sections
      join public.chapters on chapters.id = sections.chapter_id
      join public.theses on theses.id = chapters.thesis_id
      where sections.id = figures.section_id
      and theses.user_id = auth.uid()
    )
  );

create policy "Users can create figures in their theses"
  on public.figures for insert
  with check (
    exists (
      select 1 from public.sections
      join public.chapters on chapters.id = sections.chapter_id
      join public.theses on theses.id = chapters.thesis_id
      where sections.id = figures.section_id
      and theses.user_id = auth.uid()
    )
  );

create policy "Users can update figures in their theses"
  on public.figures for update
  using (
    exists (
      select 1 from public.sections
      join public.chapters on chapters.id = sections.chapter_id
      join public.theses on theses.id = chapters.thesis_id
      where sections.id = figures.section_id
      and theses.user_id = auth.uid()
    )
  );

create policy "Users can delete figures in their theses"
  on public.figures for delete
  using (
    exists (
      select 1 from public.sections
      join public.chapters on chapters.id = sections.chapter_id
      join public.theses on theses.id = chapters.thesis_id
      where sections.id = figures.section_id
      and theses.user_id = auth.uid()
    )
  );

-- References table policies
alter table public.references enable row level security;

create policy "Users can view references in their theses"
  on public.references for select
  using (
    exists (
      select 1 from public.theses
      where theses.id = references.thesis_id
      and theses.user_id = auth.uid()
    )
  );

create policy "Users can create references in their theses"
  on public.references for insert
  with check (
    exists (
      select 1 from public.theses
      where theses.id = references.thesis_id
      and theses.user_id = auth.uid()
    )
  );

create policy "Users can update references in their theses"
  on public.references for update
  using (
    exists (
      select 1 from public.theses
      where theses.id = references.thesis_id
      and theses.user_id = auth.uid()
    )
  );

create policy "Users can delete references in their theses"
  on public.references for delete
  using (
    exists (
      select 1 from public.theses
      where theses.id = references.thesis_id
      and theses.user_id = auth.uid()
    )
  );

-- Functions and Triggers

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at
  before update on public.users
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.theses
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.chapters
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.sections
  for each row
  execute procedure public.handle_updated_at();

-- Function to update word count
create or replace function public.update_section_word_count()
returns trigger as $$
begin
  new.word_count = array_length(regexp_split_to_array(trim(new.content), '\s+'), 1);
  return new;
end;
$$ language plpgsql;

-- Create trigger for word count
create trigger update_section_word_count
  before insert or update of content on public.sections
  for each row
  execute procedure public.update_section_word_count();