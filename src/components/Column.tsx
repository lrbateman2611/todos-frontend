import { AnimatePresence } from "framer-motion";
import type { Category, Todo, NoteColor } from "../types/todo";
import { StickyNote } from "./StickyNote";
import { AddNoteForm } from "./AddNoteForm";

interface ColumnProps {
  id: Category;
  title: string;
  dotColor: string;
  todos: Todo[];
  deletingId: string | null;
  isDragOver: boolean;
  columnRef: (el: HTMLDivElement | null) => void;
  openPopoverId: string | null;
  onPopoverToggle: (id: string | null) => void;
  onAdd: (text: string) => void;
  onMove: (id: string, category: Category) => void;
  onColorChange: (id: string, color: NoteColor) => void;
  onDelete: (id: string) => void;
  onNoteDropped: (todoId: string, fromCategory: Category, x: number, y: number) => void;
  onNoteDragging: (x: number, y: number) => void;
}

const COL_CLASS: Record<Category, string> = {
  todo: "col-todo",
  "in-progress": "col-inprogress",
  done: "col-done",
};

export function Column({
  id,
  title,
  dotColor,
  todos,
  deletingId,
  isDragOver,
  columnRef,
  openPopoverId,
  onPopoverToggle,
  onAdd,
  onMove,
  onColorChange,
  onDelete,
  onNoteDropped,
  onNoteDragging,
}: ColumnProps) {
  return (
    <div
      className={`column ${COL_CLASS[id]}${isDragOver ? " column-drag-over" : ""}`}
      ref={columnRef}
    >
      <div className="column-header">
        <div className="column-title-group">
          <div className="column-dot" style={{ background: dotColor }} />
          <span className="column-title">{title}</span>
        </div>
        <span className="column-count">{todos.length}</span>
      </div>

      <AddNoteForm onAdd={onAdd} />

      <div className="column-notes">
        <AnimatePresence initial={false}>
          {todos.map((todo) => (
            <StickyNote
              key={todo.id}
              todo={todo}
              isDeleting={deletingId === todo.id}
              openPopoverId={openPopoverId}
              onPopoverToggle={onPopoverToggle}
              onMove={onMove}
              onColorChange={onColorChange}
              onDelete={onDelete}
              onNoteDrag={onNoteDragging}
              onNoteDrop={(x, y) => onNoteDropped(todo.id, id, x, y)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
