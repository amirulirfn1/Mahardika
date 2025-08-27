import Link from "next/link";

export default function FourOhFour() {
  return (
    <div className="container-default py-24">
      <h1 className="text-3xl font-semibold tracking-tight">404 — Not found</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">The page you requested does not exist.</p>
      <div className="mt-6"><Link className="underline" href="/">Back to home</Link></div>
    </div>
  );
}



