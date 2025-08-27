import React from "react";

import { Card, CardContent, CardHeader } from "../ui/Card";

export const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon?: React.ReactNode;
}> = ({ title, description, icon }) => {
  return (
    <Card className="group h-full relative overflow-hidden transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl">
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"
        aria-hidden
        style={{
          background:
            "radial-gradient(600px 200px at 0% 0%, rgba(124,58,237,.15), transparent), radial-gradient(600px 200px at 100% 0%, rgba(217,70,239,.10), transparent)",
        }}
      />
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md ring-1 ring-neutral-200 bg-neutral-50 dark:ring-white/10 dark:bg-white/10 flex items-center justify-center shadow-sm" aria-hidden>
            <span className="text-neutral-800 dark:text-white/90">{icon}</span>
          </div>
          <div className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white/90">{title}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-600 dark:text-white/70">{description}</p>
      </CardContent>
    </Card>
  );
};



