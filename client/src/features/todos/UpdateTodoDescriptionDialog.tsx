import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateTodoDescriptionSchema,
  UpdateTodoDescriptionInput,
  Todo,
} from "@/lib/validators";
import { useUpdateTodoDescription } from "@/api/todos";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
  todo: Todo;
  trigger?: React.ReactNode;
};

export default function UpdateTodoDescriptionDialog({ todo, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<UpdateTodoDescriptionInput>({
    resolver: zodResolver(updateTodoDescriptionSchema),
    defaultValues: {
      id: todo.id,
      description: todo.description,
    },
  });

  const updateMutation = useUpdateTodoDescription();

  const onSubmit = (values: UpdateTodoDescriptionInput) => {
    updateMutation.mutate(values, {
      onSuccess: () => {
        toast({ description: "Todo updated successfully" });
        setOpen(false);
      },
      onError: (err: any) => {
        toast({ description: err?.message || "Failed to update todo" });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button variant="outline" size="sm">Edit</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>Update the description of this todo</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={updateMutation.isPending} className="w-full sm:w-auto">
                {updateMutation.isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}