import { useTodosStore } from "../store/todosStore";

export function useTodos() {
  const todos = useTodosStore((s) => s.todos);
  const addTodo = useTodosStore((s) => s.addTodo);
  const moveTodo = useTodosStore((s) => s.moveTodo);
  const deleteTodo = useTodosStore((s) => s.deleteTodo);
  const updateColor = useTodosStore((s) => s.updateColor);

  return { todos, addTodo, moveTodo, deleteTodo, updateColor };
}
