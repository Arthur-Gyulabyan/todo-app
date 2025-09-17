import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Todo Manager</CardTitle>
          </div>
          <CardDescription>Stay organized. Create, update, and manage your todos.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Head to your dashboard to get started.
          </p>
          <Button asChild>
            <Link to="/dashboard">Open Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}