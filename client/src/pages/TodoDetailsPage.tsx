import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetTodoById, useDeleteTodo } from "@/api/todos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CalendarDays, Flag, Trash2 } from "lucide-react";
import { format } from "date-fns";
import UpdateTodoDescriptionDialog from "@/features/todos/UpdateTodoDescriptionDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

export default function TodoDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id as string | undefined;
  const { data, isLoading, isError, error } = useGetTodoById(id);
  const deleteMutation = useDeleteTodo();

  const handleDelete = () => {
    if (!id) return;
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ description: "Todo deleted" });
          navigate("/");
        },
        onError: (err: any) => {
          toast({ description: err?.message || "Failed to delete todo" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl p-4 sm:p-6">
        <Skeleton className="mb-4 h-8 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-56" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto w-full max-w-3xl p-4 sm:p-6">
        <div className="mb-4">
          <Button asChild variant="ghost">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Todo not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{(error as any)?.message ?? "The requested todo could not be found."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 p-4 sm:p-6">
      <div>
        <Button asChild variant="ghost">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {data.description}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Due:</span>
            <span className="font-medium text-foreground">
              {data.dueDate ? formatDateSafe(data.dueDate) : "—"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Flag className="h-4 w-4" />
            <span>Priority:</span>
            <span className="font-medium text-foreground capitalize">
              {data.priority ?? "—"}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <UpdateTodoDescriptionDialog
            todo={data}
            trigger={<Button variant="outline" size="sm">Edit Description</Button>}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
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
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
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