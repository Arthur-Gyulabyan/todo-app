import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Column<T> {
  key: keyof T | "actions";
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  isLoading,
  isError,
  error,
  emptyMessage = "No items found.",
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded-md">
        <h3 className="font-semibold">Error loading data:</h3>
        <p>{error?.message || "An unknown error occurred."}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? (
            data.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)} className={column.className}>
                    {column.render ? column.render(item) : String(item[column.key as keyof T])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}