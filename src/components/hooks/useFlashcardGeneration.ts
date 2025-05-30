import { useState } from "react";
import type { GenerationSuggestionDto, CreateGenerationResponseDto } from "@/types";

interface UseFlashcardGenerationResult {
  isLoading: boolean;
  error: string | null;
  suggestions: GenerationSuggestionDto[];
  generate: (sourceText: string) => Promise<void>;
}

export function useFlashcardGeneration(): UseFlashcardGenerationResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<GenerationSuggestionDto[]>([]);

  const generate = async (sourceText: string) => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const res = await fetch("/api/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_text: sourceText }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to generate flashcards.");
      }
      const data: CreateGenerationResponseDto = await res.json();

      setSuggestions(data.flashcard_suggestions.map((s) => ({ ...s, generation_id: data.id })));
    } catch (e: unknown) {
      let message = "Failed to generate flashcards.";
      if (e instanceof Error) message = e.message;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, suggestions, generate };
}
