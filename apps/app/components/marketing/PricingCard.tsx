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
    <Card className={`h-full ${highlighted ? "ring-1 ring-[hsl(var(--accent))]" : ""}`}>
      <CardHeader>
        <div className="flex items-baseline justify-between">
          <div className="text-lg font-semibold tracking-tight text-white/90">{name}</div>
          <div className="text-2xl font-semibold text-white">{price}</div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-white/70">
          {features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <div className="mt-6">
          <Button className="w-full" variant={highlighted ? "primary" : "outline"}>{cta}</Button>
        </div>
      </CardContent>
    </Card>
  );
};


