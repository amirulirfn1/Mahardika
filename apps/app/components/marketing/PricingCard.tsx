import React from "react";
import { Card, CardContent, CardHeader } from "../ui/Card";
import { Button } from "../ui/Button";

export const PricingCard: React.FC<{
  name: string;
  price: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}> = ({ name, price, features, cta, highlighted }) => {
  return (
    <Card className={`h-full ${highlighted ? "ring-1" : ""}`} style={highlighted ? { boxShadow: "0 0 0 1px rgb(var(--accent))" } : undefined}>
      <CardHeader>
        <div className="text-lg font-semibold tracking-tight">{name}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{price}</div>
        <ul className="mt-4 space-y-2 text-sm">
          {features.map((f) => (
            <li key={f} className="text-neutral-700 dark:text-neutral-200">{f}</li>
          ))}
        </ul>
        <div className="mt-6">
          <Button className="w-full">{cta}</Button>
        </div>
      </CardContent>
    </Card>
  );
};


