import { z } from "zod";

export const errorSchema = z.object({
  message: z.string(),
});

export const todoSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().optional(),
  priority: z.string().optional(),
});

export const createTodoSchema = todoSchema.omit({ id: true });

export const deleteTodoSchema = z.object({
  id: z.string(),
});

export const updateTodoDescriptionSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
});

export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type DeleteTodoInput = z.infer<typeof deleteTodoSchema>;
export type UpdateTodoDescriptionInput = z.infer<typeof updateTodoDescriptionSchema>;
export type ApiError = z.infer<typeof errorSchema>;