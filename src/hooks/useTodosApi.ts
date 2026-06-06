import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { getApiTodo, postApiTodo, putApiTodoId, deleteApiTodoId } from "../services/api/generated";
import type { PostTodo, UpdateTodo } from "../services/api/generated";

export const TODO_QUERY_KEY = ["todos"] as const;

/** Fetch all todos from the API. Only enabled when user is authenticated. */
export function useTodosQuery() {
  const { isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: TODO_QUERY_KEY,
    queryFn: ({ signal }) => getApiTodo(signal),
    enabled: isAuthenticated,
  });
}

/** Create a new todo. */
export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PostTodo) => postApiTodo(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEY });
    },
  });
}

/** Update an existing todo by id. */
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateTodo }) => putApiTodoId(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEY });
    },
  });
}

/** Delete a todo by id. */
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteApiTodoId(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEY });
    },
  });
}
