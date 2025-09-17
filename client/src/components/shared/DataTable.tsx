import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

// Define a Column interface for type safety
interface Column<TData> {
  key: keyof TData | "actions" | string;
  header: string | React.ReactNode;
  cell: (row: TData) => React.ReactNode;
  className?: string;
}

interface DataTableProps<TData> {
  data: TData[];
  columns: Column<TData>[];
  isLoading: boolean;
  isError: boolean;
  emptyMessage?: string;
  loadingRowCount?: number;
}

export const DataTable = <TData extends { id?: string | number }>({
  data,
  columns,
  isLoading,
  isError,
  emptyMessage = "No data available.",
  loadingRowCount = 5,
}: DataTableProps<TData>) => {
  if (isError) {
    return (
      <div className="flex items-center justify-center p-4 text-sm text-destructive">
        <LucideIcon name="AlertTriangle" className="mr-2 h-4 w-4" />
        Failed to load data. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={column.key as string || index} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column, index) => (
                  <TableCell key={column.key as string || index} className={column.className}>
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Dummy icon for DataTable to compile, as LucideIcon is expected.
// In a real project, this would be a specific icon.
interface LucideIconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
  strokeWidth?: string | number;
  color?: string;
}
const AlertTriangle: React.FC<LucideIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// Map of icon names to components for the DataTable utility
const lucideIcons: { [key: string]: React.FC<LucideIconProps> } = {
  AlertTriangle: AlertTriangle,
  // Add other Lucide icons as needed by their string name here
};

// Re-export LucideIcon as a type for consumption
type LucideIconComponent = typeof AlertTriangle;

// Custom LucideIcon wrapper to dynamically render icons based on string name
const LucideIcon: React.FC<{ name: keyof typeof lucideIcons } & LucideIconProps> = ({ name, ...props }) => {
  const IconComponent = lucideIcons[name];
  return IconComponent ? <IconComponent {...props} /> : null;
};