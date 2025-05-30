import type { CreateGenerationResponseDto, GenerationSuggestionDto } from "../../types";
import type { SupabaseClient } from "../../db/supabase.client";

export class GenerationService {
  constructor(private readonly supabase: SupabaseClient) {}

  async generateFlashcards(userId: string, sourceText: string): Promise<CreateGenerationResponseDto> {
    try {
      // 1. Generate suggestions and measure duration
      const startTime = Date.now();
      const suggestions = await this.generateSuggestions(sourceText);
      const duration = Date.now() - startTime;

      // 2. Save generation metadata
      const generationId = await this.saveGenerationMetadata({
        userId,
        sourceText,
        suggestions,
        duration,
      });

      // 3. Return response
      return {
        id: generationId,
        flashcards_count: suggestions.length,
        flashcard_suggestions: suggestions,
      };
    } catch (error) {
      // Log error details
      await this.logGenerationError(userId, sourceText, error);
      throw error;
    }
  }

  private async generateSuggestions(sourceText: string): Promise<GenerationSuggestionDto[]> {
    // TODO: In the future, this will call OpenRouter API
    // For now, return mock data with a preview of the source text
    return [
      {
        front_text: `Q: ${sourceText.substring(0, 25)}...`,
        back_text: `A: ${sourceText.substring(0, 50)}...`,
        source: "ai-full",
      },
      {
        front_text: `Q: ${sourceText.substring(50, 75)}...`,
        back_text: `A: ${sourceText.substring(50, 100)}...`,
        source: "ai-full",
      },
    ];
  }

  private async saveGenerationMetadata(params: {
    userId: string;
    sourceText: string;
    suggestions: GenerationSuggestionDto[];
    duration: number;
  }): Promise<string> {
    const { data: generation, error: insertError } = await this.supabase
      .from("generations")
      .insert({
        user_id: params.userId,
        model: "mock-model",
        duration: params.duration,
        source_text: params.sourceText,
        flashcards_count: params.suggestions.length,
        accepted_edited_count: 0,
        accepted_unedited_count: 0,
      })
      .select("id")
      .single();

    if (insertError) {
      throw new Error(`Failed to insert generation: ${insertError.message}`);
    }

    return generation.id;
  }

  private async logGenerationError(userId: string, sourceText: string, error: unknown): Promise<void> {
    try {
      await this.supabase.from("generation_error_logs").insert({
        user_id: userId,
        model: "mock-model",
        source_text: sourceText,
        error_code: "INTERNAL_ERROR",
        error_message: error instanceof Error ? error.message : "Unknown error",
      });
    } catch (logError) {
      console.error("Failed to log generation error:", logError);
    }
  }
}
