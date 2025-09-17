import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  CreateTodoInput,
  DeleteTodoInput,
  Todo,
  UpdateTodoDescriptionInput,
} from "@/lib/validators";

export const TODOS_KEY = ["todos"];

export const useGetTodos = () => {
  return useQuery<Todo[]>({
    queryKey: TODOS_KEY,
    queryFn: () => api.get<Todo[]>("/get-all-todos"),
  });
};

export const useGetTodoById = (id?: string) => {
  return useQuery<Todo>({
    queryKey: ["todo", id],
    queryFn: () => api.get<Todo>(`/get-todo-by-id/${id}`),
    enabled: !!id,
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTodoInput) => api.post<Todo>("/create-todo", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
    },
  });
};

export const useUpdateTodoDescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTodoDescriptionInput) =>
      api.post<Todo>("/update-todo-description", payload),
    onSuccess: (_data, variables) => {
      // Invalidate list and specific todo
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ["todo", variables.id] });
      }
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DeleteTodoInput) => api.post<Todo>("/delete-todo", payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: TODOS_KEY });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ["todo", variables.id] });
      }
    },
  });
};