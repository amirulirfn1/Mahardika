import React from "react";

export const TableSimple: React.FC<{
  columns: { key: string; header: string }[];
  rows: Record<string, React.ReactNode>[];
}> = ({ columns, rows }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            {columns.map((c) => (
              <th key={c.key} className="py-2 pr-4 text-left text-neutral-600 dark:text-neutral-300">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-neutral-100 dark:border-neutral-900/50">
              {columns.map((c) => (
                <td key={c.key} className="py-2 pr-4">
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



