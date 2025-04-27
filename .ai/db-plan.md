# 10xCards Database Schema

## 1. Tables

### 1.1. users

This table is managed by **Supabase Auth**.

- id: UUID PRIMARY KEY
- email: TEXt NOT NULL UNIQUE
- password_hash: TEXT NOT NULL
- created_at: TIMESTAMPTZ NOT NULL DEFAULT now()
- confirmed_at: TIMESTAMPTZ

### 1.2. flashcards

- id: UUID PRIMARY KEY
- front_text: TEXT NOT NULL CHECK (char_length(front_text) <= 200)
- back_text: TEXT NOT NULL CHECK (char_length(back) <= 500)
- source: ENUM ('ai-full', 'ai-edited', 'manual'))
- created_at: TIMESTAMPTZ NOT NULL DEFAULT now()
- updated_at: TIMESTAMPTZ NOT NULL DEFAULT now()
- generation_id: UUID REFERENCES generations(id) ON DELETE SET NULL
- user_id: UUID NOT NULL REFERENCES users(id)

*Trigger: Automatically update the `updated_at` column on record updates.*

### 1.3. generations

- id: UUID PRIMARY KEY
- user_id: UUID NOT NULL REFERENCES users(id)
- model: TEXT NOT NULL
- flashcards_count: INTEGER NOT NULL
- accepted_unedited_count: INTEGER NULLABLE
- accepted_edited_count: INTEGER NULLABLE
- duration: INTEGER NOT NULL
- created_at: TIMESTAMPTZ NOT NULL DEFAULT now()
- updated_at: TIMESTAMPTZ NOT NULL DEFAULT now()
- source_text: TEXT NOT NULL CHECK (char_length(source_text) BETWEEN 1000 AND 10000)

### 1.4. generation_error_logs

- id: UUID PRIMARY KEY
- user_id: UUID NOT NULL REFERENCES users(id)
- model: TEXT NOT NULL
- source_text: TEXT NOT NULL
- error_code: TEXT NOT NULL
- error_message: TEXT NOT NULL
- created_at: TIMESTAMPTZ NOT NULL DEFAULT now()

## 2. Relationships

- One user (`users`) has many records in `flashcards`.
- One user (`users`) has many records in `generations`.
- One user (`users`) has many records in `generation_error_logs`.
- Each flashcard (`flashcards`) can optionally refer to one generation (`generations`) via generation_id.

## 3. Indeksy

- Index on the `user_id` column in `flashcards`.
- Index on the `generation_id` column in `flashcards`.
- Index on the `user_id column` in `generations`.
- Index on the `user_id column` in `generation_error_logs`.

## 4. Row-Level Security (RLS) Policies

- For the flashcards, generations and generation_error_logs tables, implement RLS policies so that a user can access only those records where user_id equals to the authenticated user's ID (e.g. `auth.uid() = user_id`).
