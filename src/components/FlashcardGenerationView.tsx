import React, { useState } from "react";
import FlashcardGenerationForm from "@/components/FlashcardGenerationForm";
import { useFlashcardGeneration } from "@/components/hooks/useFlashcardGeneration";
import FlashcardSuggestionsList from "@/components/FlashcardSuggestionsList";
import { useFlashcardSuggestions } from "@/components/hooks/useFlashcardSuggestions";
import SaveSuggestionsButton from "@/components/SaveSuggestionsButton";
import { Progress } from "@/components/ui/progress";
import { Toaster as Sonner } from "@/components/ui/sonner";
import type { CreateFlashcardsRequestDto } from "@/types";
import { toast } from "sonner";

const FlashcardGenerationView: React.FC = () => {
  const { isLoading, error, suggestions, generate } = useFlashcardGeneration();
  const suggestionsHook = useFlashcardSuggestions(suggestions);
  const [isSaving, setIsSaving] = useState(false);

  const canSave = suggestionsHook.suggestions.some((s) => s.accepted);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const toSave = suggestionsHook.suggestions.filter((s) => s.accepted);
      const payload: CreateFlashcardsRequestDto = {
        flashcards: toSave.map((s) => ({
          front_text: s.front_text,
          back_text: s.back_text,
          source: s.edited ? "ai-edited" : "ai-full",
          generation_id: s.generation_id || undefined,
        })),
      };
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to save flashcards.");
      }
      toast.success("Saved successfully!");
    } catch (err: unknown) {
      let message = "Failed to save flashcards.";
      if (err instanceof Error) message = err.message;
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <Sonner />
      <h1 className="text-3xl font-bold mb-6">Generate Flashcards</h1>
      <FlashcardGenerationForm onGenerate={generate} />
      {isLoading && (
        <div className="my-4">
          <Progress value={100} className="h-2" />
        </div>
      )}
      {error && <div className="my-4 text-red-500">{error}</div>}
      {suggestionsHook.suggestions.length > 0 && (
        <>
          <FlashcardSuggestionsList
            suggestions={suggestionsHook.suggestions}
            onAccept={suggestionsHook.accept}
            onEdit={suggestionsHook.edit}
            onReject={suggestionsHook.reject}
            onSaveEdit={suggestionsHook.saveEdit}
            onCancelEdit={suggestionsHook.cancelEdit}
          />
          <div className="mb-8">
            <SaveSuggestionsButton disabled={!canSave} isLoading={isSaving} onClick={handleSave} />
          </div>
        </>
      )}
    </main>
  );
};

export default FlashcardGenerationView;
