import type { CreateFlashcardDto, CreateFlashcardsResponseDto, FlashcardDto } from "../../types";
import type { SupabaseClient } from "../../db/supabase.client";

interface FlashcardSuccess {
  success: true;
  data: FlashcardDto;
}

interface FlashcardFailure {
  success: false;
}

type FlashcardInsertResult = FlashcardSuccess | FlashcardFailure;

export class FlashcardsService {
  constructor(private readonly supabase: SupabaseClient) {}

  async createFlashcards(userId: string, flashcards: CreateFlashcardDto[]): Promise<CreateFlashcardsResponseDto> {
    // Extract unique generation IDs from the request
    const generationIds = [
      ...new Set(flashcards.map((f) => f.generation_id).filter((id): id is string => id !== undefined)),
    ];

    // Validate generation IDs if any are provided
    if (generationIds.length > 0) {
      const { data: validGenerations, error } = await this.supabase
        .from("generations")
        .select("id")
        .in("id", generationIds)
        .eq("user_id", userId);

      if (error) {
        console.error("Error validating generation IDs:", error);
        throw new Error("Failed to validate generation IDs");
      }

      const validGenerationIds = new Set(validGenerations?.map((g) => g.id) || []);

      // Check if all provided generation IDs are valid
      const invalidIds = generationIds.filter((id) => !validGenerationIds.has(id));
      if (invalidIds.length > 0) {
        throw new Error(`Invalid or unauthorized generation IDs: ${invalidIds.join(", ")}`);
      }
    }

    // Process flashcards after validation
    const results = await Promise.all(flashcards.map((flashcard) => this.insertSingleFlashcard(userId, flashcard)));

    const successfulFlashcards = results
      .filter((result): result is FlashcardSuccess => result.success)
      .map((result) => result.data);

    const failedCount = results.filter((result) => !result.success).length;

    return {
      flashcards: successfulFlashcards,
      success_count: successfulFlashcards.length,
      error_count: failedCount,
    };
  }

  private async insertSingleFlashcard(userId: string, flashcard: CreateFlashcardDto): Promise<FlashcardInsertResult> {
    try {
      const { data, error } = await this.supabase
        .from("flashcards")
        .insert({
          ...flashcard,
          user_id: userId,
        })
        .select("id, front_text, back_text, source, generation_id, created_at, updated_at")
        .single();

      if (error) {
        console.error("Error inserting flashcard:", error);
        return { success: false };
      }

      if (!data) {
        console.error("No data returned from insert operation");
        return { success: false };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error inserting flashcard:", error);
      return { success: false };
    }
  }
}
