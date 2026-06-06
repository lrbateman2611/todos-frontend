import { create } from "zustand";
import type { Todo, Category, NoteColor } from "../types/todo";

const STORAGE_KEY = "todos";

// Auth state

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

function loadFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Todo[];
  } catch {
    // ignore
  }
  return [];
}

function saveToStorage(todos: Todo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // ignore
  }
}

interface TodosState {
  todos: Todo[];
  addTodo: (text: string, category: Category, color?: NoteColor) => void;
  moveTodo: (id: string, category: Category) => void;
  deleteTodo: (id: string) => void;
  updateColor: (id: string, color: NoteColor) => void;
  // Auth
  user: AuthUser | null;
  accessToken: string | null;
  isAuthLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setAccessToken: (token: string | null) => void;
  setAuthLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useTodosStore = create<TodosState>((set) => ({
  todos: loadFromStorage(),

  // Auth initial state
  user: null,
  accessToken: null,
  isAuthLoading: true,

  setUser: (user) => set({ user }),
  setAccessToken: (token) => set({ accessToken: token }),
  setAuthLoading: (loading) => set({ isAuthLoading: loading }),
  clearAuth: () => set({ user: null, accessToken: null }),

  addTodo: (text, category, color = "yellow") => {
    set((state) => {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text,
        category,
        color,
        createdAt: new Date().toISOString(),
      };
      const todos = [...state.todos, newTodo];
      saveToStorage(todos);
      return { todos };
    });
  },

  moveTodo: (id, category) => {
    set((state) => {
      const todos = state.todos.map((t) => (t.id === id ? { ...t, category } : t));
      saveToStorage(todos);
      return { todos };
    });
  },

  deleteTodo: (id) => {
    set((state) => {
      const todos = state.todos.filter((t) => t.id !== id);
      saveToStorage(todos);
      return { todos };
    });
  },

  updateColor: (id, color) => {
    set((state) => {
      const todos = state.todos.map((t) => (t.id === id ? { ...t, color } : t));
      saveToStorage(todos);
      return { todos };
    });
  },
}));
