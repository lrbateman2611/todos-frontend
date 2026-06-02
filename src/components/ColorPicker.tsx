import type { NoteColor } from "../types/todo";
import { NOTE_COLORS } from "../types/todo";

interface ColorPickerProps {
  current: NoteColor;
  onChange: (color: NoteColor) => void;
}

const COLORS: NoteColor[] = ["yellow", "pink", "blue", "green", "orange", "purple"];

export function ColorPicker({ current, onChange }: ColorPickerProps) {
  return (
    <div className="popover-colors">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={`color-swatch swatch-${color}${current === color ? " selected" : ""}`}
          style={{ background: NOTE_COLORS[color] }}
          onClick={() => onChange(color)}
          aria-label={color}
          title={color}
        >
          {current === color && (
            <span style={{ fontSize: 10, lineHeight: 1, color: "rgba(0,0,0,0.5)" }}>✓</span>
          )}
        </button>
      ))}
    </div>
  );
}
