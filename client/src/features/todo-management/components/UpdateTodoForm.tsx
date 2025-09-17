import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpdateTodoDescriptionRequest, updateTodoDescriptionRequestSchema, todoPriorities } from "@/lib/validators";
import { useGetTodoById, useUpdateTodoDescription } from "@/api/todos";
import { Skeleton } from "@/components/ui/skeleton";

interface UpdateTodoFormProps {
  todoId: string;
  onSuccess: () => void;
}

export const UpdateTodoForm = ({ todoId, onSuccess }: UpdateTodoFormProps) => {
  const { data: todo, isLoading: isTodoLoading, isError: isTodoError } = useGetTodoById(todoId);
  const updateTodoMutation = useUpdateTodoDescription();

  const form = useForm<UpdateTodoDescriptionRequest>({
    resolver: zodResolver(updateTodoDescriptionRequestSchema),
    defaultValues: {
      id: todoId,
      description: "",
      dueDate: undefined,
      priority: undefined,
    },
  });

  useEffect(() => {
    if (todo) {
      form.reset({
        id: todo.id,
        description: todo.description,
        dueDate: todo.dueDate, // Keep as ISO string or undefined
        priority: todo.priority,
      });
    }
  }, [todo, form]);

  const onSubmit = (data: UpdateTodoDescriptionRequest) => {
    const formattedData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
    };
    updateTodoMutation.mutate(formattedData, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  if (isTodoLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isTodoError) {
    return <p className="text-destructive">Error loading todo details.</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter todo description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {todoPriorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={updateTodoMutation.isPending}>
          {updateTodoMutation.isPending ? "Updating..." : "Update Todo"}
        </Button>
      </form>
    </Form>
  );
};