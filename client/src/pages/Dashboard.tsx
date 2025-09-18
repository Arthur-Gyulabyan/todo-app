import { useMemo } from "react";
import { useGetTodos } from "@/api/todos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import TodoTable from "@/features/todos/TodoTable";
import CreateTodoDialog from "@/features/todos/CreateTodoDialog";

export default function Dashboard() {
  const { data, isLoading } = useGetTodos();

  const stats = useMemo(() => {
    const now = new Date();
    const total = data?.length ?? 0;
    const withDue = data?.filter((t) => !!t.dueDate).length ?? 0;
    const overdue =
      data?.filter((t) => t.dueDate && new Date(t.dueDate) < now).length ?? 0;
    const highPriority =
      data?.filter((t) => (t.priority ?? "").toLowerCase() === "high").length ?? 0;
    return { total, withDue, overdue, highPriority };
  }, [data]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Todo Dashboard"
        description="Manage your todos, track due dates and priorities."
        actions={
          <CreateTodoDialog
            trigger={
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Todo
              </Button>
            }
          />
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Todos" value={stats.total} />
        <StatCard title="With Due Date" value={stats.withDue} />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          badge={stats.overdue > 0 ? <Badge variant="destructive">Attention</Badge> : undefined}
        />
        <StatCard title="High Priority" value={stats.highPriority} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Todos</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoTable data={data} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, badge }: { title: string; value: number | string; badge?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {badge}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}