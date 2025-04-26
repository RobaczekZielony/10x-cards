-- Migration: create generation_error_logs table
-- Description: Creates the generation_error_logs table to store errors during flashcard generation
-- Date: 2025-04-26

-- create the table
create table if not exists generation_error_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  model text not null,
  source_text text not null,
  error_code text not null,
  error_message text not null,
  created_at timestamptz not null default now()
);

-- add comments
comment on table public.generation_error_logs is 'Stores error logs from flashcard generation attempts';
comment on column public.generation_error_logs.id is 'Unique identifier for error log entry';
comment on column public.generation_error_logs.user_id is 'Reference to user who experienced the error';
comment on column public.generation_error_logs.model is 'Name of LLM model that was being used';
comment on column public.generation_error_logs.source_text is 'Original text that was submitted for generation';
comment on column public.generation_error_logs.error_code is 'Error code or type returned by the API';
comment on column public.generation_error_logs.error_message is 'Detailed error message for debugging';
comment on column public.generation_error_logs.created_at is 'Timestamp when error occurred';

-- enable row level security
alter table generation_error_logs enable row level security;

-- create policies
-- policy for authenticated users to select their own records
create policy "users can view their own generation error logs"
  on generation_error_logs
  for select
  to authenticated
  using (auth.uid() = user_id);

-- policy for authenticated users to insert their own records
create policy "users can insert their own generation error logs"
  on generation_error_logs
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- policy for authenticated users to delete their own records
create policy "users can delete their own generation error logs"
  on generation_error_logs
  for delete
  to authenticated
  using (auth.uid() = user_id); 