import React, { useState } from "react";

interface InlineFlashcardEditorProps {
  frontText: string;
  backText: string;
  accepted: boolean;
  edited: boolean;
  onChange?: (front: string, back: string) => void;
  onSave: (front: string, back: string) => void;
  onCancel: () => void;
}

const InlineFlashcardEditor: React.FC<InlineFlashcardEditorProps> = ({
  frontText,
  backText,
  accepted,
  edited,
  onChange,
  onSave,
  onCancel,
}) => {
  const [front, setFront] = useState(frontText);
  const [back, setBack] = useState(backText);
  const [touched, setTouched] = useState(false);

  const isValid = front.trim().length > 0 && back.trim().length > 0;
  const error = !touched || isValid ? null : "Both fields are required.";

  const handleSave = () => {
    setTouched(true);
    if (!isValid) return;
    onSave(front, back);
  };

  let bgClass = "bg-muted";
  if (accepted && !edited) bgClass = "bg-green-100";
  if (accepted && edited) bgClass = "bg-blue-100";
  if (!accepted) bgClass = "bg-red-100";

  return (
    <div className={`flex flex-col gap-2 p-4 border rounded ${bgClass}`}>
      <input
        className="w-full p-2 border rounded"
        value={front}
        onChange={(e) => {
          setFront(e.target.value);
          onChange?.(e.target.value, back);
        }}
        placeholder="Front text"
        aria-label="Front text"
      />
      <textarea
        className="w-full p-2 border rounded"
        value={back}
        onChange={(e) => {
          setBack(e.target.value);
          onChange?.(front, e.target.value);
        }}
        placeholder="Back text"
        aria-label="Back text"
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-2 mt-2">
        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={!isValid}>
          Save
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default InlineFlashcardEditor;
