import type { Category, NoteColor } from "../types/todo";
import { ColorPicker } from "./ColorPicker";

interface NoteActionsProps {
  category: Category;
  color: NoteColor;
  onMove: (category: Category) => void;
  onColorChange: (color: NoteColor) => void;
  onDelete: () => void;
}

const ALL_CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "todo", label: "To Do", icon: "📋" },
  { id: "in-progress", label: "In Progress", icon: "⚡" },
  { id: "done", label: "Done", icon: "✅" },
];

export function NoteActions({
  category,
  color,
  onMove,
  onColorChange,
  onDelete,
}: NoteActionsProps) {
  const otherCols = ALL_CATEGORIES.filter((c) => c.id !== category);

  return (
    <div className="note-popover open">
      <div className="popover-section">
        <div className="popover-label">Move to</div>
        {otherCols.map((col) => (
          <button
            key={col.id}
            type="button"
            className="popover-item"
            onClick={() => onMove(col.id)}
          >
            <span className="item-icon">{col.icon}</span>
            {col.label}
            <span className="item-arrow">›</span>
          </button>
        ))}
      </div>
      <div className="popover-section">
        <div className="popover-label">Color</div>
        <ColorPicker current={color} onChange={onColorChange} />
      </div>
      <div className="popover-section">
        <button type="button" className="popover-item danger" onClick={onDelete}>
          <span className="item-icon">🗑</span>
          Delete
        </button>
      </div>
    </div>
  );
}
