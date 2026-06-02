import { useState, useRef } from "react";

interface AddNoteFormProps {
  onAdd: (text: string) => void;
}

export function AddNoteForm({ onAdd }: AddNoteFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleOpen() {
    setExpanded(true);
    // auto-focus after render
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
    setExpanded(false);
  }

  function handleCancel() {
    setText("");
    setExpanded(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleAdd();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  }

  if (expanded) {
    return (
      <div className="add-note-form">
        <textarea
          ref={textareaRef}
          className="add-note-input"
          placeholder="Write a note…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="add-note-actions">
          <button type="button" className="btn-add" onClick={handleAdd}>
            Add
          </button>
          <button type="button" className="btn-add-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button type="button" className="btn-add-new" onClick={handleOpen}>
      <span className="plus">+</span> Add a note
    </button>
  );
}
