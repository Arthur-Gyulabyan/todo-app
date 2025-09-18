import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  CreateTodoInput,
  DeleteTodoInput,
  Todo,
  UpdateTodoDescriptionInput,
} from "@/lib/validators";

export const useGetTodos = () => {
  return useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () => api.get<Todo[]>("/get-all-todos"),
  });
};

export const useGetTodoById = (id?: string) => {
  return useQuery<Todo>({
    queryKey: ["todos", id],
    enabled: !!id,
    queryFn: () => api.get<Todo>(`/get-todo-by-id/${id}`),
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTodoInput) => api.post<Todo>("/create-todo", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

export const useUpdateTodoDescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTodoDescriptionInput) =>
      api.post<Todo>("/update-todo-description", payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ["todos", data.id] });
      }
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DeleteTodoInput) => api.post<Todo>("/delete-todo", payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ["todos", data.id] });
      }
    },
  });
};