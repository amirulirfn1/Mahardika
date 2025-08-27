import React from "react";

export const TableSimple: React.FC<{
  columns: { key: string; header: string }[];
  rows: Record<string, React.ReactNode>[];
}> = ({ columns, rows }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((c) => (
              <th key={c.key} className="py-2 pr-4 text-left text-white/60 text-xs uppercase tracking-wide">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5">
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



