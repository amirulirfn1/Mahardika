import React from "react";
import { Card, CardContent } from "../ui/Card";

export const StatCard: React.FC<{
  label: string;
  value: string | number;
  change?: string;
}> = ({ label, value, change }) => {
  return (
    <Card>
      <CardContent>
        <div className="text-sm text-neutral-500">{label}</div>
        <div className="mt-1 text-2xl font-semibold">{value}</div>
        {change ? (
          <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">{change}</div>
        ) : null}
      </CardContent>
    </Card>
  );
};



