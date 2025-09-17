import { useMemo } from "react";
import { DataTable, Column } from "@/components/shared/DataTable";
import { useGetTodos } from "@/api/todos";
import { Todo } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import UpdateTodoDialog from "./UpdateTodoDialog";
import DeleteTodoDialog from "./DeleteTodoDialog";
import { format } from "date-fns";
import { AlertCircle, RefreshCcw } from "lucide-react";

function safeFormatDate(dateString?: string) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "—";
  try {
    return format(d, "PPp");
  } catch {
    return "—";
  }
}

export default function TodosTable() {
  const { data, isLoading, isError, refetch, isFetching } = useGetTodos();

  const columns: Column<Todo>[] = useMemo(
    () => [
      {
        header: "Description",
        cell: (row) => (
          <div className="max-w-[40ch] truncate" title={row.description}>
            {row.description}
          </div>
        ),
      },
      { header: "Due", cell: (row) => safeFormatDate(row.dueDate) },
      { header: "Priority", cell: (row) => row.priority || "—" },
      {
        header: "Actions",
        className: "w-[120px]",
        cell: (row) => (
          <div className="flex items-center gap-1">
            <UpdateTodoDialog id={row.id} currentDescription={row.description} />
            <DeleteTodoDialog id={row.id} description={row.description} />
          </div>
        ),
      },
    ],
    []
  );

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-md border p-8 text-center">
        <AlertCircle className="h-6 w-6 text-destructive" />
        <p className="text-sm text-muted-foreground">Failed to load todos.</p>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <DataTable<Todo>
      columns={columns}
      data={data ?? []}
      isLoading={isLoading || isFetching}
      rowKey={(row) => row.id}
      caption="Your todos"
      emptyMessage="No todos yet. Create your first one!"
    />
  );
}