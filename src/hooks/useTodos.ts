import { useAuth0 } from "@auth0/auth0-react";
import { useTodosStore } from "../store/todosStore";
import { useTodosQuery, useCreateTodo, useUpdateTodo, useDeleteTodo } from "./useTodosApi";
import type { Todo, Category, NoteColor } from "../types/todo";
import type { TodoItem } from "../services/api/generated";

function mapApiTodo(item: TodoItem): Todo {
  return {
    id: String(item.id ?? ""),
    text: item.title ?? "",
    category: (item.category as Category) ?? "todo",
    color: (item.color as NoteColor) ?? "yellow",
    createdAt: item.createdAt ?? new Date().toISOString(),
  };
}

export function useTodos() {
  const { isAuthenticated } = useAuth0();

  // --- API path (authenticated) ---
  const todosQuery = useTodosQuery();
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  // --- Guest path (local store) ---
  const storeTodos = useTodosStore((s) => s.todos);
  const storeAdd = useTodosStore((s) => s.addTodo);
  const storeMove = useTodosStore((s) => s.moveTodo);
  const storeDelete = useTodosStore((s) => s.deleteTodo);
  const storeUpdateColor = useTodosStore((s) => s.updateColor);

  if (isAuthenticated) {
    const todos: Todo[] = (todosQuery.data ?? []).map(mapApiTodo);

    const addTodo = (text: string, category: Category, color?: NoteColor) => {
      createTodo.mutate({
        title: text,
        category,
        color: color ?? "yellow",
        isCompleted: category === "done",
      });
    };

    const moveTodo = (id: string, category: Category) => {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) return;
      const existing = todosQuery.data?.find((t) => String(t.id) === id);
      updateTodo.mutate({
        id: numericId,
        body: {
          id: numericId,
          title: existing?.title,
          description: existing?.description,
          isCompleted: category === "done",
          category,
          color: existing?.color,
        },
      });
    };

    const deleteTodoAction = (id: string) => {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) return;
      deleteTodo.mutate(numericId);
    };

    const updateColor = (id: string, color: NoteColor) => {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) return;
      const existing = todosQuery.data?.find((t) => String(t.id) === id);
      updateTodo.mutate({
        id: numericId,
        body: {
          id: numericId,
          title: existing?.title,
          description: existing?.description,
          isCompleted: existing?.isCompleted,
          category: existing?.category,
          color,
        },
      });
    };

    return {
      todos,
      addTodo,
      moveTodo,
      deleteTodo: deleteTodoAction,
      updateColor,
      isLoading: todosQuery.isLoading,
      isError: todosQuery.isError,
      isUsingApi: true,
    };
  }

  // Guest path
  return {
    todos: storeTodos,
    addTodo: storeAdd,
    moveTodo: storeMove,
    deleteTodo: storeDelete,
    updateColor: storeUpdateColor,
    isLoading: false,
    isError: false,
    isUsingApi: false,
  };
}
