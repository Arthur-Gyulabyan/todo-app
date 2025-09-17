import { useState } from "react";
import { format } from "date-fns";
import { EllipsisVertical, Edit, Trash2 } from "lucide-react";

import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Todo } from "@/lib/validators";
import { useGetAllTodos } from "@/api/todos";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UpdateTodoForm } from "./UpdateTodoForm";
import { DeleteTodoDialog } from "./DeleteTodoDialog";
import { Badge } from "@/components/ui/badge";

export const TodoTable = () => {
  const { data: todos, isLoading, isError } = useGetAllTodos();

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleEditClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsUpdateDialogOpen(true);
  };

  const handleDeleteClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDeleteDialogOpen(true);
  };

  const columns = [
    {
      key: "description",
      header: "Description",
      cell: (row: Todo) => <span className="font-medium">{row.description}</span>,
      className: "w-1/2",
    },
    {
      key: "priority",
      header: "Priority",
      cell: (row: Todo) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
        if (row.priority === "High") variant = "destructive";
        if (row.priority === "Medium") variant = "default";
        if (row.priority === "Low") variant = "outline";
        return (
          <Badge variant={variant}>{row.priority || "N/A"}</Badge>
        );
      },
      className: "w-1/6",
    },
    {
      key: "dueDate",
      header: "Due Date",
      cell: (row: Todo) =>
        row.dueDate ? format(new Date(row.dueDate), "PPP") : "No due date",
      className: "w-1/6",
    },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      cell: (row: Todo) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditClick(row)} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteClick(row)} className="text-destructive focus:text-destructive cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "text-right",
    },
  ];

  return (
    <>
      <DataTable
        data={todos || []}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No todos found. Start by creating one!"
      />

      {/* Update Todo Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Todo</DialogTitle>
          </DialogHeader>
          {selectedTodo && (
            <UpdateTodoForm
              todoId={selectedTodo.id}
              onSuccess={() => {
                setIsUpdateDialogOpen(false);
                setSelectedTodo(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Todo Dialog */}
      {selectedTodo && (
        <DeleteTodoDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          todoId={selectedTodo.id}
          description={selectedTodo.description}
          onSuccess={() => {
            setIsDeleteDialogOpen(false);
            setSelectedTodo(null);
          }}
        />
      )}
    </>
  );
};