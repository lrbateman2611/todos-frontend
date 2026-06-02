export type Category = "todo" | "in-progress" | "done";

export type NoteColor = "yellow" | "pink" | "blue" | "green" | "orange" | "purple";

export interface Todo {
  id: string;
  text: string;
  category: Category;
  color: NoteColor;
  createdAt: string;
}

export const NOTE_COLORS: Record<NoteColor, string> = {
  yellow: "#fef08a",
  pink: "#fda4af",
  blue: "#93c5fd",
  green: "#86efac",
  orange: "#fdba74",
  purple: "#d8b4fe",
};
