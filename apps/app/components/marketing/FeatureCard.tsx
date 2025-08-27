import React from "react";
import { Card, CardContent, CardHeader } from "../ui/Card";

export const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon?: React.ReactNode;
}> = ({ title, description, icon }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="text-2xl" aria-hidden>
            {icon}
          </div>
          <div className="text-lg font-semibold tracking-tight">{title}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-600 dark:text-neutral-300">{description}</p>
      </CardContent>
    </Card>
  );
};



