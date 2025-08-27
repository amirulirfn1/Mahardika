import React from "react";

export const FAQ: React.FC<{
  items: { q: string; a: string }[];
}> = ({ items }) => {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="divide-y divide-white/10 rounded-xl ring-1 ring-white/10">
        {items.map((it, i) => (
          <details key={i} className="group p-4">
            <summary className="cursor-pointer select-none font-medium text-white/90">
              {it.q}
            </summary>
            <div className="mt-2 text-white/70">{it.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
};



