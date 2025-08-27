import React from "react";

import { Card, CardContent } from "../ui/Card";

export const Testimonial: React.FC<{
  quote: string;
  author: string;
  role?: string;
}> = ({ quote, author, role }) => {
  return (
    <Card>
      <CardContent>
        <blockquote className="text-lg leading-relaxed">“{quote}”</blockquote>
        <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
          — {author}
          {role ? <span className="text-neutral-500">, {role}</span> : null}
        </div>
      </CardContent>
    </Card>
  );
};



