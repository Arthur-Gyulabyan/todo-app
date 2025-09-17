import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTodo } from "@/api/todos";
import { CreateTodoInput, createTodoSchema } from "@/lib/validators";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const priorities = ["Low", "Medium", "High"];

export default function CreateTodoDialog() {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useCreateTodo();

  const form = useForm<z.infer<typeof createTodoSchema>>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      description: "",
      dueDate: "",
      priority: "",
    },
  });

  const onSubmit = async (values: CreateTodoInput) => {
    try {
      // Clean empty strings to undefined
      const payload: CreateTodoInput = {
        description: values.description,
        ...(values.dueDate ? { dueDate: values.dueDate } : {}),
        ...(values.priority ? { priority: values.priority } : {}),
      };
      await mutateAsync(payload);
      toast({
        title: "Todo created",
        description: "Your todo has been created successfully.",
      });
      setOpen(false);
      form.reset();
    } catch (err: any) {
      toast({
        title: "Failed to create todo",
        description: err?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !isPending && setOpen(o)}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Todo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Todo</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What needs to be done?"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              {...form.register("dueDate")}
            />
            {form.formState.errors.dueDate && (
              <p className="text-sm text-destructive">
                {form.formState.errors.dueDate.message as string}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Priority</Label>
            <Select
              value={form.watch("priority") || ""}
              onValueChange={(v) => form.setValue("priority", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.priority && (
              <p className="text-sm text-destructive">
                {form.formState.errors.priority.message as string}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}