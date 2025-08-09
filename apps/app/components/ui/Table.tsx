import React from "react";

export function Table({
  children,
  className = "",
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className={`min-w-full text-sm ${className}`} {...props}>
      {children}
    </table>
  );
}

export function THead({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props}>{children}</thead>;
}

export function TBody({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props}>{children}</tbody>;
}

export function TR({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`border-t ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TH({
  children,
  className = "",
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`py-2 pr-4 text-left text-gray-600 ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TD({
  children,
  className = "",
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`py-2 pr-4 ${className}`} {...props}>
      {children}
    </td>
  );
}
