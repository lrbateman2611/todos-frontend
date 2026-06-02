import type { Todo, Category, NoteColor } from "../types/todo";

// Stub API service — implementation pending API spec confirmation

export async function fetchTodos(): Promise<Todo[]> {
  throw new Error("Not implemented");
}

export async function createTodo(
  _text: string,
  _category: Category,
  _color?: NoteColor,
): Promise<Todo> {
  throw new Error("Not implemented");
}

export async function updateTodoCategory(_id: string, _category: Category): Promise<Todo> {
  throw new Error("Not implemented");
}

export async function updateTodoColor(_id: string, _color: NoteColor): Promise<Todo> {
  throw new Error("Not implemented");
}

export async function removeTodo(_id: string): Promise<void> {
  throw new Error("Not implemented");
}
