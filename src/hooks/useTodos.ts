import { useTodosStore } from "../store/todosStore";

export function useTodos() {
  // Using browser storage only - API disabled
  const storeTodos = useTodosStore((s) => s.todos);
  const storeAdd = useTodosStore((s) => s.addTodo);
  const storeMove = useTodosStore((s) => s.moveTodo);
  const storeDelete = useTodosStore((s) => s.deleteTodo);
  const storeUpdateColor = useTodosStore((s) => s.updateColor);

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
