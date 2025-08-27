import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-default py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">
        Try our new App Router pages from the header navigation.
      </p>
      <div className="mt-6">
        <Link className="underline" href="/">Go home</Link>
      </div>
    </div>
  );
}



