"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);
  return (
    <div className="container-default py-24">
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">Please try again.</p>
      <button
        onClick={() => reset()}
        className="mt-6 inline-flex h-10 items-center rounded-md bg-neutral-900 px-4 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
      >
        Reset
      </button>
    </div>
  );
}



