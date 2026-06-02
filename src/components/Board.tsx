import { useCallback, useRef, useState } from "react";
import { useTodos } from "../hooks/useTodos";
import { Column } from "./Column";
import type { Category } from "../types/todo";

const COLUMNS: { id: Category; title: string; dotColor: string }[] = [
  { id: "todo", title: "To Do", dotColor: "#94a3b8" },
  { id: "in-progress", title: "In Progress", dotColor: "#f59e0b" },
  { id: "done", title: "Done", dotColor: "#22c55e" },
];

export function Board() {
  const { todos, addTodo, moveTodo, deleteTodo, updateColor } = useTodos();
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<Category | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<Partial<Record<Category, HTMLDivElement>>>({});

  const registerColumn = useCallback(
    (id: Category) => (el: HTMLDivElement | null) => {
      if (el) columnRefs.current[id] = el;
      else delete columnRefs.current[id];
    },
    [],
  );

  function getDropTarget(x: number, y: number): Category | null {
    for (const [cat, el] of Object.entries(columnRefs.current) as [Category, HTMLDivElement][]) {
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return cat;
      }
    }
    return null;
  }

  function handleNoteDropped(todoId: string, fromCategory: Category, x: number, y: number) {
    const target = getDropTarget(x, y);
    setDragOverId(null);
    if (target && target !== fromCategory) {
      moveTodo(todoId, target);
    }
  }

  function handleNoteDragging(x: number, y: number) {
    setDragOverId(getDropTarget(x, y));
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    deleteTodo(id);
  }

  function handleBoardMouseDown(e: React.MouseEvent) {
    // Close popover if click is outside any note popover
    if (openPopoverId !== null) {
      const target = e.target as Element;
      if (!target.closest(".note-popover") && !target.closest(".note-menu-btn")) {
        setOpenPopoverId(null);
      }
    }
  }

  return (
    <div className="board" ref={boardRef} onMouseDown={handleBoardMouseDown}>
      {COLUMNS.map((col) => (
        <Column
          key={col.id}
          id={col.id}
          title={col.title}
          dotColor={col.dotColor}
          todos={todos.filter((t) => t.category === col.id)}
          deletingId={deletingId}
          isDragOver={dragOverId === col.id}
          columnRef={registerColumn(col.id)}
          openPopoverId={openPopoverId}
          onPopoverToggle={setOpenPopoverId}
          onAdd={(text) => addTodo(text, col.id)}
          onMove={moveTodo}
          onColorChange={updateColor}
          onDelete={handleDelete}
          onNoteDropped={handleNoteDropped}
          onNoteDragging={handleNoteDragging}
        />
      ))}
    </div>
  );
}
