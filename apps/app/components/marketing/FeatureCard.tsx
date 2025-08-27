import React from "react";
import { Card, CardContent, CardHeader } from "../ui/Card";

export const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon?: React.ReactNode;
}> = ({ title, description, icon }) => {
  return (
    <Card className="h-full relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md ring-1 ring-white/10 bg-white/10 flex items-center justify-center" aria-hidden>
            <span className="text-white/90">{icon}</span>
          </div>
          <div className="text-lg font-semibold tracking-tight text-white/90">{title}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-white/70">{description}</p>
      </CardContent>
    </Card>
  );
};



