import React from "react";

import { Card, CardContent } from "../ui/Card";

export const StatCard: React.FC<{
  label: string;
  value: string | number;
  change?: string;
}> = ({ label, value, change }) => {
  return (
    <Card radius="app" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-accent/50 to-primary/70" aria-hidden />
      <CardContent className="space-y-2">
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </div>
        <div className="text-2xl font-semibold text-foreground">{value}</div>
        {change ? <div className="text-xs text-muted-foreground">{change}</div> : null}
      </CardContent>
    </Card>
  );
};
