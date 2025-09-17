import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoDescriptionRequest,
  DeleteTodoRequest,
  ErrorResponse,
} from "@/lib/validators";
import { toast as sonnerToast } from "sonner";

export const useGetAllTodos = () => {
  return useQuery<Todo[], ErrorResponse>({
    queryKey: ["todos"],
    queryFn: () => api.get("/get-all-todos"),
  });
};

export const useGetTodoById = (id: string | undefined) => {
  return useQuery<Todo, ErrorResponse>({
    queryKey: ["todos", id],
    queryFn: () => api.get(`/get-todo-by-id/${id}`),
    enabled: !!id, // Only fetch if ID is available
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Todo, ErrorResponse, CreateTodoRequest>({
    mutationFn: (newTodo) => api.post("/create-todo", newTodo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      sonnerToast.success("Todo created successfully!", {
        description: `Todo "${data.description}" has been added.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create todo",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTodoDescription = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Todo, ErrorResponse, UpdateTodoDescriptionRequest>({
    mutationFn: (updatedTodo) => api.post("/update-todo-description", updatedTodo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] }); // Invalidate all todos list
      queryClient.invalidateQueries({ queryKey: ["todos", data.id] }); // Invalidate specific todo
      sonnerToast.success("Todo updated successfully!", {
        description: `Todo "${data.description}" has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update todo",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Todo, ErrorResponse, DeleteTodoRequest>({
    mutationFn: (todoToDelete) => api.post("/delete-todo", todoToDelete),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      sonnerToast.success("Todo deleted successfully!", {
        description: `Todo "${data.description}" has been removed.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete todo",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    },
  });
};