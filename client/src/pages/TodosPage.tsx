import { FC } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { CreateTodoDialog } from "@/features/todo-management/components/CreateTodoDialog";
import { TodoTable } from "@/features/todo-management/components/TodoTable";
import { useGetAllTodos } from "@/api/todos";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TodosPage: FC = () => {
  const { data: todos, isLoading, isError } = useGetAllTodos();

  const completedCount = todos?.filter(todo => todo.isCompleted).length || 0;
  const totalCount = todos?.length || 0;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Todo List"
        description="Manage your tasks and keep track of your productivity."
        actions={<CreateTodoDialog />}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Todos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{totalCount}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{completedCount}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(0) : 0}% completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{pendingCount}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold tracking-tight mb-4">All Tasks</h3>
        <TodoTable />
      </div>
    </div>
  );
};

export default TodosPage;