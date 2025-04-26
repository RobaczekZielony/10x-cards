-- Migration: create generations table
-- Description: Creates the generations table to store information about AI-generated flashcard batches
-- Date: 2025-04-26

-- create the table
create table if not exists generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  model text not null,
  flashcards_count integer not null,
  accepted_unedited_count integer,
  accepted_edited_count integer,
  duration integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  source_text text not null check (char_length(source_text) between 1000 and 10000)
);

-- add comments
comment on table public.generations is 'Stores information about AI-generated flashcard batches';
comment on column public.generations.id is 'Unique identifier for generation batch';
comment on column public.generations.user_id is 'Reference to user who initiated generation';
comment on column public.generations.model is 'Name of LLM model used for generation';
comment on column public.generations.flashcards_count is 'Number of flashcards generated with this generation attempt';
comment on column public.generations.accepted_unedited_count is 'Number of AI-generated flashcards accepted without edits';
comment on column public.generations.accepted_edited_count is 'Number of AI-generated flashcards accepted after edits';
comment on column public.generations.duration is 'Time taken for generation in milliseconds';
comment on column public.generations.created_at is 'Timestamp when generation was initiated';
comment on column public.generations.updated_at is 'Timestamp when generation was last updated';
comment on column public.generations.source_text is 'Original text used for generating flashcards (1000-10000 chars)';

-- create trigger to automatically update updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_generations_updated_at
before update on generations
for each row
execute function update_updated_at_column();

-- enable row level security
alter table generations enable row level security;

-- create policies
-- policy for authenticated users to select their own records
create policy "users can view their own generations"
  on generations
  for select
  to authenticated
  using (auth.uid() = user_id);

-- policy for authenticated users to insert their own records
create policy "users can insert their own generations"
  on generations
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- policy for authenticated users to update their own records
create policy "users can update their own generations"
  on generations
  for update
  to authenticated
  using (auth.uid() = user_id);

-- policy for authenticated users to delete their own records
create policy "users can delete their own generations"
  on generations
  for delete
  to authenticated
  using (auth.uid() = user_id); 