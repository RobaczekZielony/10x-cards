-- Migration: create flashcards table
-- Description: Creates the flashcards table to store user's flashcards
-- Date: 2025-04-26

-- create enum for source types
create type flashcard_source as enum ('ai-full', 'ai-edited', 'manual');

-- create the table
create table if not exists flashcards (
  id uuid primary key default gen_random_uuid(), 
  front_text text not null check (char_length(front_text) <= 200), 
  back text not null check (char_length(back) <= 500), 
  source flashcard_source not null, 
  created_at timestamptz not null default now(), 
  updated_at timestamptz not null default now(), 
  generation_id uuid references generations(id) on delete set null, 
  user_id uuid not null references auth.users(id) on delete cascade,
  constraint ai_generation_link check (
    (source = 'manual' OR generation_id IS NOT NULL)
  )
);

-- add comments
comment on table public.flashcards is 'Stores user and AI generated flashcards';
comment on column public.flashcards.id is 'Unique identifier for flashcard';
comment on column public.flashcards.front_text is 'Question or prompt displayed on front of card (max 200 chars)';
comment on column public.flashcards.back is 'Answer or information displayed on back of card (max 500 chars)';
comment on column public.flashcards.source is 'Indicates how flashcard was created: ai-full (unedited AI generation), ai-edited (edited AI generation), or manual';
comment on column public.flashcards.created_at is 'Timestamp when flashcard was created';
comment on column public.flashcards.updated_at is 'Timestamp when flashcard was last updated';
comment on column public.flashcards.generation_id is 'Reference to generation batch if AI-generated, null if manually created';
comment on column public.flashcards.user_id is 'Reference to user who owns the flashcard';

-- create trigger to automatically update updated_at column
create trigger update_flashcards_updated_at
before update on flashcards
for each row
execute function update_updated_at_column();

-- enable row level security
alter table flashcards enable row level security;

-- create policies
-- policy for authenticated users to select their own records
create policy "users can view their own flashcards"
  on flashcards
  for select
  to authenticated
  using (auth.uid() = user_id);

-- policy for authenticated users to insert their own records
create policy "users can insert their own flashcards"
  on flashcards
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- policy for authenticated users to update their own records
create policy "users can update their own flashcards"
  on flashcards
  for update
  to authenticated
  using (auth.uid() = user_id);

-- policy for authenticated users to delete their own records
create policy "users can delete their own flashcards"
  on flashcards
  for delete
  to authenticated
  using (auth.uid() = user_id); 