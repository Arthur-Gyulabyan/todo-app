import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader = ({
  title,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0",
        className
      )}
      {...props}
    >
      <div className="flex-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};