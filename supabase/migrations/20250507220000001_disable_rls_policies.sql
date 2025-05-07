-- Migration: disable RLS policies
-- Description: Disables RLS policies for all tables
-- Date: 2025-05-07

alter table flashcards disable row level security;
alter table generations disable row level security;
alter table generation_error_logs disable row level security;
