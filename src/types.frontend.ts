// src/types.frontend.ts
// Frontend-only view models and UI state types for 10xCards

import type { GenerationSuggestionDto } from "@/types";

export type FlashcardSuggestionViewModel = GenerationSuggestionDto & {
  accepted: boolean; // true by default (false = rejected)
  edited: boolean; // false by default (true = user modified)
  isEditing: boolean;
  error?: string;
  generation_id?: string;
  // source is not needed in the ViewModel; it is derived when saving
};
