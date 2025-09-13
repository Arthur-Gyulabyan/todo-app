import { z } from "zod";

// Helper for 'true'/'false' string conversion
const booleanString = z.preprocess((val) => {
  if (typeof val === 'string') {
    return val.toLowerCase() === 'true';
  }
  return val;
}, z.boolean());

export const todoSchema = z.object({
  id: z.string().min(1, "ID is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().datetime().optional().nullable().transform((val) => val === null ? undefined : val), // Allow null for API, map to undefined for Zod
  priority: z.string().optional().nullable().transform((val) => val === null ? undefined : val), // Allow null for API, map to undefined for Zod
  isCompleted: booleanString,
});

export type Todo = z.infer<typeof todoSchema>;

export const createTodoFormSchema = z.object({
  description: z.string().min(1, "Description is required"),
  dueDate: z.date().optional().nullable(), // For form, use Date object
  priority: z.string().optional().nullable(),
});

export type CreateTodoFormValues = z.infer<typeof createTodoFormSchema>;

export const updateTodoDescriptionFormSchema = z.object({
  id: z.string().min(1, "ID is required for update"), // Include ID for updates
  description: z.string().min(1, "Description is required"),
  dueDate: z.date().optional().nullable(), // For form, use Date object
  priority: z.string().optional().nullable(),
});

export type UpdateTodoDescriptionFormValues = z.infer<typeof updateTodoDescriptionFormSchema>;

export const completeTodoRequestSchema = z.object({
  id: z.string().min(1, "ID is required"),
  isCompleted: z.boolean(), // For form, use boolean
});

export type CompleteTodoRequest = z.infer<typeof completeTodoRequestSchema>;

export const deleteTodoRequestSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export type DeleteTodoRequest = z.infer<typeof deleteTodoRequestSchema>;