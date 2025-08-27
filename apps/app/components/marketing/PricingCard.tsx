import React from "react";

import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader } from "../ui/Card";
import { AnimatedPrice } from "./AnimatedPrice";

export const PricingCard: React.FC<{
  name: string;
  price?: string;
  animatedPrice?: number;
  pricePrefix?: string;
  priceSuffix?: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}> = ({ name, price, animatedPrice, pricePrefix = "$", priceSuffix = "/mo", features, cta, highlighted }) => {
  return (
    <Card
      className={`h-full transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl ${
        highlighted ? "ring-1 ring-[hsl(var(--accent))]" : ""
      }`}
    >
      <CardHeader>
        <div className="flex items-baseline justify-between">
          <div className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white/90">{name}</div>
          <div className="text-2xl font-semibold text-neutral-900 dark:text-white">
            {typeof animatedPrice === "number" ? (
              <AnimatedPrice value={animatedPrice} prefix={pricePrefix} suffix={priceSuffix} />
            ) : (
              price
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-neutral-600 dark:text-white/70">
          {features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <div className="mt-6">
          <Button className="w-full btn-sheen" variant={highlighted ? "primary" : "outline"}>{cta}</Button>
        </div>
      </CardContent>
    </Card>
  );
};
