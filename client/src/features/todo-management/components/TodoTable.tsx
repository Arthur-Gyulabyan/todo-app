import { FC, useState } from "react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PenLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { Todo } from "@/lib/validators";
import { useCompleteTodo, useGetAllTodos } from "@/api/todos";
import { EditTodoDialog } from "./EditTodoDialog";
import { DeleteTodoAlertDialog } from "./DeleteTodoAlertDialog";
import { Skeleton } from "@/components/ui/skeleton";

export const TodoTable: FC = () => {
  const { data: todos, isLoading, isError, error } = useGetAllTodos();
  const completeTodoMutation = useCompleteTodo();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleEditClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsEditDialogOpen(true);
  };

  const handleCompleteChange = (todo: Todo, checked: boolean) => {
    completeTodoMutation.mutate({ id: todo.id, isCompleted: checked });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded-md">
        <h3 className="font-semibold">Error loading todos:</h3>
        <p>{error?.message || "An unknown error occurred."}</p>
      </div>
    );
  }

  const columns = [
    {
      key: "isCompleted",
      header: "Completed",
      className: "w-[80px] text-center",
      render: (todo: Todo) => (
        <Checkbox
          checked={todo.isCompleted}
          onCheckedChange={(checked) =>
            handleCompleteChange(todo, checked as boolean)
          }
          aria-label="Mark todo as complete"
          disabled={completeTodoMutation.isPending}
        />
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (todo: Todo) => (
        <span className={todo.isCompleted ? "line-through text-muted-foreground" : ""}>
          {todo.description}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (todo: Todo) =>
        todo.dueDate ? format(new Date(todo.dueDate), "PPP") : "N/A",
    },
    {
      key: "priority",
      header: "Priority",
      render: (todo: Todo) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
        if (todo.priority === "High") variant = "destructive";
        if (todo.priority === "Medium") variant = "default";
        return (
          <Badge variant={variant}>
            {todo.priority || "None"}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (todo: Todo) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-500"
            onClick={() => handleEditClick(todo)}
          >
            <PenLine className="h-4 w-4" />
          </Button>
          <DeleteTodoAlertDialog todo={todo} />
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={todos || []}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        error={error}
        emptyMessage="You have no todos yet. Click 'Create Todo' to add one!"
      />
      {selectedTodo && (
        <EditTodoDialog
          todo={selectedTodo}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </>
  );
};