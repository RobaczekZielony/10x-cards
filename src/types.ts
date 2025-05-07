// src/types.ts
// Shared DTOs and Command Models for the 10xCards API

import type { Tables, TablesInsert } from "./db/database.types";

// Generic pagination metadata used by list endpoints
export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
}

// -----------------------
// Flashcards DTOs
// -----------------------

// Core flashcard representation exposed via the API (excludes user_id)
export type FlashcardDto = Pick<
  Tables<"flashcards">,
  "id" | "front_text" | "back_text" | "source" | "generation_id" | "created_at" | "updated_at"
>;

// Response payload for GET /flashcards
export interface FlashcardsListResponseDto {
  flashcards: FlashcardDto[];
  pagination: PaginationDto;
}

// Payload for a single flashcard creation
// Omits user_id, id, created_at, updated_at (populated server-side)
export type CreateFlashcardDto = Pick<
  TablesInsert<"flashcards">,
  "front_text" | "back_text" | "source" | "generation_id"
>;

// Request payload for POST /flashcards
export interface CreateFlashcardsRequestDto {
  flashcards: CreateFlashcardDto[];
}

// Response payload for POST /flashcards
export interface CreateFlashcardsResponseDto {
  flashcards: FlashcardDto[];
  success_count: number;
  error_count: number;
}

// Payload for updating an existing flashcard (only front_text, back_text, source are updatable)
export type UpdateFlashcardDto = Partial<Pick<FlashcardDto, "front_text" | "back_text" | "source">>;

// Add response DTOs for single flashcard operations
export type FlashcardDetailResponseDto = FlashcardDto;
export type UpdateFlashcardResponseDto = FlashcardDto;
export interface DeleteFlashcardResponseDto {
  message: string;
}

// -----------------------
// Generations DTOs
// -----------------------

// Single suggestion of a flashcard returned from AI (front, back, source only)
export type GenerationSuggestionDto = Pick<Tables<"flashcards">, "front_text" | "back_text" | "source">;

// Request payload for POST /generations
export type CreateGenerationRequestDto = Pick<TablesInsert<"generations">, "source_text">;

// Response payload for POST /generations
export type CreateGenerationResponseDto = Pick<Tables<"generations">, "id" | "flashcards_count"> & {
  flashcard_suggestions: GenerationSuggestionDto[];
};

// Summary of a generation for list endpoints (excludes user_id and source_text)
export type GenerationDto = Pick<
  Tables<"generations">,
  | "id"
  | "model"
  | "duration"
  | "flashcards_count"
  | "accepted_edited_count"
  | "accepted_unedited_count"
  | "created_at"
  | "updated_at"
>;

// Response payload for GET /generations
export interface GenerationsListResponseDto {
  generations: GenerationDto[];
  pagination: PaginationDto;
}

// Response payload for GET /generations/{id}
export type GenerationDetailResponseDto = CreateGenerationResponseDto;

// -----------------------
// Generation Error Logs DTOs
// -----------------------

// Representation of a generation error log entry
export type GenerationErrorLogDto = Pick<
  Tables<"generation_error_logs">,
  "id" | "model" | "source_text" | "error_code" | "error_message" | "created_at"
>;

// Response payload for GET /generation-error-logs
export interface GenerationErrorLogsResponseDto {
  error_logs: GenerationErrorLogDto[];
}
