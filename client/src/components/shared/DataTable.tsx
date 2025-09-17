import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type Column<T extends object> = {
  header: string;
  accessor?: keyof T;
  className?: string;
  cell?: (row: T) => ReactNode;
};

type DataTableProps<T extends object> = {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  caption?: string;
  emptyMessage?: string;
  rowKey: (row: T, index: number) => string;
  skeletonRows?: number;
};

export function DataTable<T extends object>({
  columns,
  data,
  isLoading,
  caption,
  emptyMessage = "No data to display.",
  rowKey,
  skeletonRows = 5,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {columns.map((col, idx) => (
              <TableHead key={idx} className={cn(col.className)}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                {columns.map((_, j) => (
                  <TableCell key={`s-${i}-${j}`}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow key={rowKey(row, i)}>
                {columns.map((col, idx) => (
                  <TableCell key={`${rowKey(row, i)}-${idx}`} className={cn(col.className)}>
                    {col.cell ? col.cell(row) : (row[col.accessor as keyof T] as ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}