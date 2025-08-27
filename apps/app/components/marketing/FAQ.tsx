import React from "react";

export const FAQ: React.FC<{
  items: { q: string; a: string }[];
}> = ({ items }) => {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="divide-y divide-white/10 rounded-xl ring-1 ring-white/10">
        {items.map((it, i) => (
          <details key={i} className="group p-4">
            <summary className="flex list-none items-center justify-between cursor-pointer select-none font-medium text-white/90">
              <span>{it.q}</span>
              <svg className="h-4 w-4 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M10 3a1 1 0 01.832.445l6 8a1 1 0 01-1.664 1.11L10 5.882 4.832 12.555a1 1 0 11-1.664-1.11l6-8A1 1 0 0110 3z" clipRule="evenodd" />
              </svg>
            </summary>
            <div className="mt-2 text-white/70">{it.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
};



