import React from "react";
import { Card, CardContent } from "../ui/Card";

export const FAQ: React.FC<{
  items: { q: string; a: string }[];
}> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item) => (
        <Card key={item.q}>
          <CardContent>
            <div className="font-medium">{item.q}</div>
            <p className="mt-2 text-neutral-600 dark:text-neutral-300">{item.a}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};



