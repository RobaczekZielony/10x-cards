import React from "react";
import type { FlashcardSuggestionViewModel } from "@/types.frontend";
import FlashcardSuggestionItem from "./FlashcardSuggestionItem";
import InlineFlashcardEditor from "./InlineFlashcardEditor";

interface FlashcardSuggestionsListProps {
  suggestions: FlashcardSuggestionViewModel[];
  onAccept: (idx: number) => void;
  onEdit: (idx: number) => void;
  onReject: (idx: number) => void;
  onSaveEdit: (idx: number, front: string, back: string) => void;
  onCancelEdit: (idx: number) => void;
}

const FlashcardSuggestionsList: React.FC<FlashcardSuggestionsListProps> = ({
  suggestions,
  onAccept,
  onEdit,
  onReject,
  onSaveEdit,
  onCancelEdit,
}) => {
  return (
    <ul className="space-y-4 mb-8">
      {suggestions.map((s, idx) => (
        <li key={idx}>
          {s.isEditing ? (
            <InlineFlashcardEditor
              frontText={s.front_text}
              backText={s.back_text}
              accepted={s.accepted}
              edited={s.edited}
              onSave={(front, back) => onSaveEdit(idx, front, back)}
              onCancel={() => onCancelEdit(idx)}
            />
          ) : (
            <FlashcardSuggestionItem
              suggestion={s}
              accepted={s.accepted}
              edited={s.edited}
              onAccept={() => onAccept(idx)}
              onEdit={() => onEdit(idx)}
              onReject={() => onReject(idx)}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default FlashcardSuggestionsList;
