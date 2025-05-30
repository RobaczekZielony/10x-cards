import { useState, useEffect } from "react";
import type { GenerationSuggestionDto } from "@/types";
import type { FlashcardSuggestionViewModel } from "@/types.frontend";

export function useFlashcardSuggestions(initial: GenerationSuggestionDto[]) {
  const [suggestions, setSuggestions] = useState<FlashcardSuggestionViewModel[]>(
    initial.map((s) => ({ ...s, accepted: true, edited: false, isEditing: false }))
  );

  // Reset suggestions when initial changes
  useEffect(() => {
    setSuggestions(initial.map((s) => ({ ...s, accepted: true, edited: false, isEditing: false })));
  }, [initial]);

  const accept = (idx: number) => {
    setSuggestions((prev) => prev.map((s, i) => (i === idx ? { ...s, accepted: true, isEditing: false } : s)));
  };

  const edit = (idx: number) => {
    setSuggestions((prev) => prev.map((s, i) => (i === idx ? { ...s, isEditing: true } : s)));
  };

  const reject = (idx: number) => {
    setSuggestions((prev) => prev.map((s, i) => (i === idx ? { ...s, accepted: false, isEditing: false } : s)));
  };

  const saveEdit = (idx: number, front: string, back: string) => {
    setSuggestions((prev) =>
      prev.map((s, i) =>
        i === idx
          ? {
              ...s,
              front_text: front,
              back_text: back,
              edited: true,
              isEditing: false,
            }
          : s
      )
    );
  };

  const cancelEdit = (idx: number) => {
    setSuggestions((prev) => prev.map((s, i) => (i === idx ? { ...s, isEditing: false } : s)));
  };

  return { suggestions, accept, edit, reject, saveEdit, cancelEdit };
}
