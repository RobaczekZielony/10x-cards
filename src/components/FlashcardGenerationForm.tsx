import React, { useState } from "react";

interface FlashcardGenerationFormProps {
  onGenerate?: (sourceText: string) => void;
}

const MIN_CHARS = 1000;
const MAX_CHARS = 10000;

const FlashcardGenerationForm: React.FC<FlashcardGenerationFormProps> = ({ onGenerate }) => {
  const [sourceText, setSourceText] = useState("");
  const [touched, setTouched] = useState(false);

  const charCount = sourceText.length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;
  const error =
    !touched || isValid
      ? null
      : charCount < MIN_CHARS
        ? `Text must be at least ${MIN_CHARS} characters.`
        : `Text must be at most ${MAX_CHARS} characters.`;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceText(e.target.value);
    if (!touched) setTouched(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onGenerate?.(sourceText);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <label htmlFor="source-text" className="block font-medium mb-2">
        Paste your text
      </label>
      <textarea
        id="source-text"
        className="w-full min-h-[180px] p-3 border rounded resize-vertical focus:outline-none focus:ring-2 focus:ring-primary"
        value={sourceText}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        maxLength={MAX_CHARS}
        required
        aria-invalid={!!error}
        aria-describedby="source-text-error source-text-counter"
      />
      <div className="flex items-center justify-between mt-2">
        <span
          id="source-text-counter"
          className={`text-sm ${charCount < MIN_CHARS || charCount > MAX_CHARS ? "text-red-500" : "text-muted-foreground"}`}
        >
          {charCount} / {MAX_CHARS} characters
        </span>
        <button type="submit" className="btn btn-primary" disabled={!isValid}>
          Generate
        </button>
      </div>
      {error && (
        <div id="source-text-error" className="text-red-500 text-sm mt-1">
          {error}
        </div>
      )}
    </form>
  );
};

export default FlashcardGenerationForm;
