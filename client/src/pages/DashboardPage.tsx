import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { CreateTodoForm } from "@/features/todo-management/components/CreateTodoForm";
import { TodoTable } from "@/features/todo-management/components/TodoTable";

const DashboardPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Todo List"
        description="Manage your daily tasks and priorities."
        actions={
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Todo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Todo</DialogTitle>
              </DialogHeader>
              <CreateTodoForm onSuccess={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        }
        className="mb-8"
      />

      <Card>
        <CardContent className="p-0">
          <TodoTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;