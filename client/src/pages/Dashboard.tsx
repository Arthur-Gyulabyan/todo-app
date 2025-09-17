import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTodos } from "@/api/todos";
import { CheckCircle2, Clock3, ListTodo } from "lucide-react";
import CreateTodoDialog from "@/features/todos/CreateTodoDialog";
import TodosTable from "@/features/todos/TodosTable";

function getStats(todos: { dueDate?: string | null }[]) {
  const now = new Date();
  const total = todos.length;
  let withDue = 0;
  let overdue = 0;

  for (const t of todos) {
    if (!t.dueDate) continue;
    const d = new Date(t.dueDate);
    if (isNaN(d.getTime())) continue;
    withDue++;
    if (d < now) overdue++;
  }

  return { total, withDue, overdue };
}

export default function Dashboard() {
  const { data: todos = [] } = useGetTodos();
  const stats = getStats(todos);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <PageHeader
        title="Dashboard"
        description="Manage your todos and keep track of what's next."
        action={<CreateTodoDialog />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Todos</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All tracked items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Due Date</CardTitle>
            <Clock3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withDue}</div>
            <p className="text-xs text-muted-foreground">Have a date set</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Todos</h2>
        <TodosTable />
      </div>
    </div>
  );
}