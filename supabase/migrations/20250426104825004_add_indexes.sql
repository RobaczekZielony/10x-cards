-- Migration: add indexes to tables
-- Description: Creates indexes on foreign keys and frequently queried columns for better performance
-- Date: 2025-04-26

create index if not exists flashcards_user_id_idx on flashcards (user_id);
create index if not exists flashcards_generation_id_idx on flashcards (generation_id);
create index if not exists generations_user_id_idx on generations (user_id);
create index if not exists generation_error_logs_user_id_idx on generation_error_logs (user_id);
