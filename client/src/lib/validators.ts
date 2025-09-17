import { z } from "zod";

export const todoPriorities = ["Low", "Medium", "High"] as const;

export const todoSchema = z.object({
  id: z.string().min(1, "ID is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().datetime().optional(), // OpenAPI example is datetime string
  priority: z.enum(todoPriorities).optional(),
});

export const createTodoRequestSchema = z.object({
  // ID is omitted here as per requirement "ID will be set on backend, do not include them in the forms."
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(todoPriorities).optional(),
});

export const updateTodoDescriptionRequestSchema = z.object({
  id: z.string().min(1, "Todo ID is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(todoPriorities).optional(),
});

export const deleteTodoRequestSchema = z.object({
  id: z.string().min(1, "Todo ID is required"),
});

export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoRequest = z.infer<typeof createTodoRequestSchema>;
export type UpdateTodoDescriptionRequest = z.infer<typeof updateTodoDescriptionRequestSchema>;
export type DeleteTodoRequest = z.infer<typeof deleteTodoRequestSchema>;

export type ErrorResponse = {
  message: string;
};