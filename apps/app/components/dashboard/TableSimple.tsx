import React from "react";

export const TableSimple: React.FC<{
  columns: { key: string; header: string }[];
  rows: Record<string, React.ReactNode>[];
}> = ({ columns, rows }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-border/80 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {columns.map((column) => (
              <th key={column.key} className="py-2 pr-4 text-left">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
              {columns.map((column) => (
                <td key={column.key} className="py-2 pr-4 text-sm text-foreground">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
