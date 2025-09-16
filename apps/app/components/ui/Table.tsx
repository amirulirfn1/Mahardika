import type { HTMLAttributes, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";

export function Table({ children, className = "", ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className={`min-w-full text-sm text-foreground ${className}`} {...props}>
      {children}
    </table>
  );
}

export function THead({ children, className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`text-xs uppercase tracking-[0.2em] text-muted-foreground ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TBody({ children, className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={className} {...props}>{children}</tbody>
  );
}

export function TR({ children, className = "", ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`border-b border-border/60 last:border-0 hover:bg-muted/40 ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TH({ children, className = "", ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`py-2 pr-4 text-left font-medium ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TD({ children, className = "", ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`py-2 pr-4 text-sm text-foreground ${className}`} {...props}>
      {children}
    </td>
  );
}
