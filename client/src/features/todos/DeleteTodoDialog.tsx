import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTodo } from "@/api/todos";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  id: string;
  description?: string;
  triggerClassName?: string;
};

export default function DeleteTodoDialog({ id, description, triggerClassName }: Props) {
  const { mutateAsync, isPending } = useDeleteTodo();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await mutateAsync({ id });
      toast({
        title: "Todo deleted",
        description: "The todo has been removed.",
      });
      setOpen(false);
    } catch (err: any) {
      toast({
        title: "Failed to delete",
        description: err?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(o) => !isPending && setOpen(o)}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className={triggerClassName}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this todo?</AlertDialogTitle>
          <AlertDialogDescription>
            {description ? (
              <>
                You are about to delete: <span className="font-medium">{description}</span>.
              </>
            ) : (
              "This action cannot be undone."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}