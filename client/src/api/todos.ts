import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Todo,
  CreateTodoFormValues,
  UpdateTodoDescriptionFormValues,
  CompleteTodoRequest,
} from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";

// Helper to convert Date to ISO string and boolean to 'true'/'false' string for API
const formatTodoForApi = (todo: Partial<CreateTodoFormValues | UpdateTodoDescriptionFormValues> | Partial<CompleteTodoRequest>) => {
  const formatted: Record<string, unknown> = { ...todo };

  if ('dueDate' in formatted && formatted.dueDate instanceof Date) {
    formatted.dueDate = formatted.dueDate.toISOString();
  } else if ('dueDate' in formatted && formatted.dueDate === null) {
    formatted.dueDate = undefined; // OpenAPI says nullable, but better to omit if null
  }

  if ('isCompleted' in formatted && typeof formatted.isCompleted === 'boolean') {
    formatted.isCompleted = String(formatted.isCompleted); // 'true' or 'false'
  }

  return formatted;
};

export const useGetAllTodos = () => {
  return useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () => api.get<Todo[]>("/get-all-todos"),
  });
};

export const useGetTodoById = (id: string | null) => {
  return useQuery<Todo>({
    queryKey: ["todo", id],
    queryFn: () => api.get<Todo>(`/get-todo-by-id/${id}`),
    enabled: !!id, // Only run if id is provided
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (newTodo: CreateTodoFormValues) => {
      // Per instructions, do not send 'id' for create operations
      const { ...body } = formatTodoForApi(newTodo);
      return api.post<Todo>("/create-todo", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Success!",
        description: "Todo created successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create todo.",
        variant: "destructive",
      });
    },
  });
};

export const useCompleteTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: CompleteTodoRequest) => {
      const formattedData = formatTodoForApi(data);
      return api.post<Todo>("/complete-todo", formattedData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todo", data.id] });
      toast({
        title: "Success!",
        description: `Todo marked as ${data.isCompleted ? "completed" : "incomplete"}.`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update todo completion status.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => api.post<Todo>("/delete-todo", { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Success!",
        description: "Todo deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete todo.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTodoDescription = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (updatedTodo: UpdateTodoDescriptionFormValues) => {
      const { id, ...body } = formatTodoForApi(updatedTodo);
      return api.post<Todo>("/update-todo-description", { id, ...body });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todo", data.id] });
      toast({
        title: "Success!",
        description: "Todo updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update todo description.",
        variant: "destructive",
      });
    },
  });
};