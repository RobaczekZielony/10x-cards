# Implementation Plan for Flashcard Generation View (`/generate`)

## 1. View Description
The view allows the user to paste text (1000–10000 characters) and generate flashcard suggestions using AI. The user can review, accept, edit, or reject suggestions, and then save selected flashcards to their collection. The view provides validation, error handling, loading states, and accessibility.

## 2. View Routing
- Path: `/generate`
- Availability: only for logged-in users

## 3. Component Structure
```
FlashcardGenerationView
├── FlashcardGenerationForm
├── FlashcardSuggestionsList
│   ├── FlashcardSuggestionItem (xN)
│   │   └── InlineFlashcardEditor (if editing)
├── SaveSuggestionsButton
├── LoadingSpinner (conditional)
└── ErrorToast (conditional)
```

## 4. Component Details
### FlashcardGenerationForm
- **Description:** Form for pasting source text, character counter, generate button.
- **Elements:** `<textarea>`, counter, `<button>`, validation messages.
- **Events:** onTextChange, onGenerate
- **Validation:** 1000–10000 characters, required field
- **Types:** `CreateGenerationRequestDto`
- **Props:** none (manages state locally or via hook)

### FlashcardSuggestionsList
- **Description:** List of generated flashcard suggestions.
- **Elements:** `<ul>` list, FlashcardSuggestionItem
- **Events:** onAccept, onEdit, onReject, onSave
- **Validation:** front/back not empty, lengths according to API
- **Types:** `GenerationSuggestionDto[]`, `FlashcardSuggestionViewModel[]`
- **Props:** suggestions, onAccept, onEdit, onReject

### FlashcardSuggestionItem
- **Description:** Single flashcard suggestion with actions.
- **Elements:** front/back, action buttons (accept, edit, reject), icons
- **Events:** onAccept, onEdit, onReject, onChange
- **Validation:** front/back not empty, lengths according to API
- **Types:** `GenerationSuggestionDto`, `FlashcardSuggestionViewModel`
- **Props:** suggestion, onAccept, onEdit, onReject
- Accept and Reject icon buttons are disabled when the card is already accepted or rejected, respectively.
- All icon-only action buttons have accessible aria-labels for screen readers.
- There are no tooltips on these buttons by default.

### InlineFlashcardEditor
- **Description:** Inline editing of front/back.
- **Elements:** `<input>`/`<textarea>`, save/cancel buttons
- **Events:** onChange, onSave, onCancel
- **Validation:** front/back not empty, lengths according to API
- **Types:** local edit state
- **Props:** value, onChange, onSave, onCancel

### SaveSuggestionsButton
- **Description:** Saves accepted/edited flashcards.
- **Elements:** `<button>`
- **Events:** onClick
- **Validation:** at least one accepted/edited flashcard
- **Types:** `CreateFlashcardsRequestDto`
- **Props:** disabled, onClick

### LoadingSpinner
- **Description:** Shows loading state.
- **Elements:** spinner from Shadcn/ui
- **Events:** none
- **Validation:** none
- **Types:** none
- **Props:** show

### ErrorToast
- **Description:** Displays error messages.
- **Elements:** toast from Shadcn/ui
- **Events:** onClose
- **Validation:** none
- **Types:** string
- **Props:** message, onClose

## 5. Types
- **Backend DTOs:**
  - `CreateGenerationRequestDto` { source_text: string }
  - `CreateGenerationResponseDto` { id, flashcards_count, flashcard_suggestions: GenerationSuggestionDto[] }
  - `GenerationSuggestionDto` { front_text: string, back_text: string, source: "ai-full" }
  - `CreateFlashcardsRequestDto` { flashcards: CreateFlashcardDto[] }
  - `CreateFlashcardsResponseDto` { flashcards: FlashcardDto[], success_count: number, error_count: number }
- **Custom ViewModel:**
  - `FlashcardSuggestionViewModel` {
      front_text: string;
      back_text: string;
      accepted: boolean;
      edited: boolean;
      isEditing: boolean;
      error?: string;
      generation_id?: string;
    }

## 6. State Management
- `sourceText: string` — input text
- `charCount: number` — character count
- `isLoading: boolean` — generation loading
- `error: string | null` — generation error
- `suggestions: FlashcardSuggestionViewModel[]` — list of suggestions
- `isSaving: boolean` — saving loading
- `saveError: string | null` — saving error
- `saveSuccess: boolean` — saving success
- **Custom hooks:**
  - `useFlashcardGeneration` — handles generation, loading, error
  - `useFlashcardSuggestions` — handles suggestion state, accept, edit, reject, save

## 7. API Integration
- **POST /generations**
  - Triggered on "Generate" click
  - Request: `{ source_text }`
  - Response: `{ id, flashcards_count, flashcard_suggestions }`
- **POST /flashcards**
  - Triggered on "Save" click
  - Request: `{ flashcards: [{ front_text, back_text, source, generation_id }] }`
  - Response: `{ flashcards, success_count, error_count }`
- **Error handling:**
  - 400/401/500 — show toast with message

## 8. User Interactions
- Typing/pasting text — updates counter, validation
- Clicking "Generate" — validation, loading, API call
- Accepting suggestion — status remains "accepted"
- Editing suggestion — opens editor, validation, save
- Rejecting suggestion — remains visible in the review list with a red pastel background (not removed or hidden)
- Clicking "Save" — sends accepted/edited to API
- Error handling — toast, inline messages
- Accept and Reject icon buttons are disabled when the card is already accepted or rejected, respectively.
- All icon-only action buttons have accessible aria-labels for screen readers.
- There are no tooltips on these buttons by default.

## 9. Conditions and Validation
- **Input text:** 1000–10000 characters, required
- **Flashcards:** front_text 1–200, back_text 1–500, required
- **Save:** at least one accepted/edited flashcard
- **Buttons:** disabled on errors/loading

## 10. Error Handling
- Too short/long text — inline error, button disabled
- API error — toast with message
- No suggestions — info message
- Save error — toast, highlight failed
- Network error — toast, retry option

## 11. Implementation Steps
1. Create `/generate` routing in Astro.
2. Implement FlashcardGenerationForm with validation and state handling.
3. Add POST /generations handling, loading, and error.
4. Implement FlashcardSuggestionsList and FlashcardSuggestionItem with actions.
5. Add InlineFlashcardEditor with validation.
6. Add SaveSuggestionsButton with POST /flashcards handling.
7. Add LoadingSpinner and ErrorToast from Shadcn/ui.
8. Implement custom hooks for API and suggestion state handling.
9. Ensure full accessibility (ARIA, keyboard).
10. Test validations, error handling, and UX.

// Note: The 'source' value ('ai-full' or 'ai-edited') is derived at save time based on the 'accepted' and 'edited' booleans. 