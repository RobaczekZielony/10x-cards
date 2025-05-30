import React from "react";
import type { GenerationSuggestionDto } from "@/types";
import { Check, Pencil, X } from "lucide-react";

interface FlashcardSuggestionItemProps {
  suggestion: GenerationSuggestionDto;
  accepted: boolean;
  edited: boolean;
  onAccept?: () => void;
  onEdit?: () => void;
  onReject?: () => void;
}

const FlashcardSuggestionItem: React.FC<FlashcardSuggestionItemProps> = ({
  suggestion,
  accepted,
  edited,
  onAccept,
  onEdit,
  onReject,
}) => {
  let bgClass = "bg-muted";
  if (accepted && !edited) bgClass = "bg-green-100";
  if (accepted && edited) bgClass = "bg-blue-100";
  if (!accepted) bgClass = "bg-red-100";
  return (
    <div className={`flex flex-col gap-2 p-4 border rounded ${bgClass}`}>
      <div className="font-semibold">{suggestion.front_text}</div>
      <div className="text-muted-foreground mb-2">{suggestion.back_text}</div>
      <div className="flex gap-2">
        <button
          type="button"
          className="p-2 rounded-full bg-green-100 hover:bg-green-200 focus-visible:ring-2 focus-visible:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Accept"
          onClick={onAccept}
          disabled={accepted}
        >
          <Check className="w-5 h-5 text-green-700" />
        </button>
        <button
          type="button"
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-400"
          aria-label="Edit"
          onClick={onEdit}
        >
          <Pencil className="w-5 h-5 text-gray-700" />
        </button>
        <button
          type="button"
          className="p-2 rounded-full bg-red-100 hover:bg-red-200 focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Reject"
          onClick={onReject}
          disabled={!accepted}
        >
          <X className="w-5 h-5 text-red-700" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardSuggestionItem;
