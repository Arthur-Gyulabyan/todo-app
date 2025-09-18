import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Todo } from "@/lib/validators";
import UpdateTodoDescriptionDialog from "./UpdateTodoDescriptionDialog";
import { useDeleteTodo } from "@/api/todos";
import { toast } from "@/hooks/use-toast";

type Props = {
  data?: Todo[];
  isLoading?: boolean;
};

export default function TodoTable({ data, isLoading }: Props) {
  const deleteMutation = useDeleteTodo();

  const onDelete = (id: string) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ description: "Todo deleted" });
        },
        onError: (err: any) => {
          toast({ description: err?.message || "Failed to delete todo" });
        },
      }
    );
  };

  return (
    <DataTable<Todo>
      data={data}
      isLoading={isLoading}
      rowKey={(row) => row.id}
      emptyMessage="No todos yet. Create your first one!"
      columns={[
        {
          header: "Description",
          cell: (row) => <span className="font-medium">{row.description}</span>,
        },
        {
          header: "Due",
          cell: (row) =>
            row.dueDate ? (
              <span className="text-sm text-muted-foreground">
                {formatDateSafe(row.dueDate)}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            ),
        },
        {
          header: "Priority",
          cell: (row) =>
            row.priority ? (
              <Badge variant={priorityVariant(row.priority)} className="capitalize">
                {row.priority}
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            ),
        },
        {
          header: "Actions",
          cell: (row) => (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="icon">
                <Link to={`/todos/${row.id}`} aria-label="View todo">
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <UpdateTodoDescriptionDialog
                todo={row}
                trigger={
                  <Button variant="ghost" size="icon" aria-label="Edit description">
                    <Pencil className="h-4 w-4" />
                  </Button>
                }
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Delete todo">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this todo?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the todo.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(row.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ),
        },
      ]}
    />
  );
}

function formatDateSafe(value: string) {
  try {
    const d = new Date(value);
    return format(d, "PPp");
  } catch {
    return value;
  }
}

function priorityVariant(priority: string): "default" | "secondary" | "destructive" | "outline" {
  const p = priority.toLowerCase();
  if (p === "high") return "destructive";
  if (p === "medium") return "default";
  if (p === "low") return "secondary";
  return "outline";
}