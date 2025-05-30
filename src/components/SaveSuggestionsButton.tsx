import React from "react";
import { Button } from "@/components/ui/button";

interface SaveSuggestionsButtonProps {
  disabled?: boolean;
  isLoading?: boolean;
  onClick: () => void;
}

const SaveSuggestionsButton: React.FC<SaveSuggestionsButtonProps> = ({ disabled, isLoading, onClick }) => {
  return (
    <Button type="button" disabled={disabled || isLoading} onClick={onClick}>
      {isLoading ? <span className="mr-2 animate-spin">⏳</span> : null}
      Save
    </Button>
  );
};

export default SaveSuggestionsButton;
