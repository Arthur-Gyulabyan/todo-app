import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
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
import { UpdateTodoDescriptionInput, updateTodoDescriptionSchema } from "@/lib/validators";
import { useUpdateTodoDescription } from "@/api/todos";
import { toast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";

type Props = {
  id: string;
  currentDescription: string;
  triggerClassName?: string;
};

export default function UpdateTodoDialog({ id, currentDescription, triggerClassName }: Props) {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useUpdateTodoDescription();

  const form = useForm<z.infer<typeof updateTodoDescriptionSchema>>({
    resolver: zodResolver(updateTodoDescriptionSchema),
    defaultValues: {
      id,
      description: currentDescription,
    },
  });

  const onSubmit = async (values: UpdateTodoDescriptionInput) => {
    try {
      await mutateAsync(values);
      toast({
        title: "Todo updated",
        description: "Description has been updated.",
      });
      setOpen(false);
    } catch (err: any) {
      toast({
        title: "Failed to update",
        description: err?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !isPending && setOpen(o)}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className={triggerClassName}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Description</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...form.register("description")} />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}