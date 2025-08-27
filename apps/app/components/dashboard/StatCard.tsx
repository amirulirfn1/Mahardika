import React from "react";
import { Card, CardContent } from "../ui/Card";

export const StatCard: React.FC<{
  label: string;
  value: string | number;
  change?: string;
}> = ({ label, value, change }) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120px_60px_at_10%_-10%,rgba(124,58,237,0.2),transparent)]" aria-hidden />
      <CardContent className="relative">
        <div className="text-xs uppercase tracking-wider text-white/60">{label}</div>
        <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
        {change ? (
          <div className="mt-1 text-xs text-white/70">{change}</div>
        ) : null}
      </CardContent>
    </Card>
  );
};



