"use client";
import React from "react";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // For now, just log to console
    // eslint-disable-next-line no-console
    console.log({ name, email, message });
  }

  return (
    <main>
      <Section className="pt-10">
        <SectionHeading title="Contact" subtitle="We'd love to hear from you." />
        <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Name</label>
            <input
              id="name"
              className="mt-1 w-full rounded-lg ring-1 ring-neutral-300 bg-neutral-50 px-4 py-2 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-white/10 dark:bg-white/5 dark:text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              className="mt-1 w-full rounded-lg ring-1 ring-neutral-300 bg-neutral-50 px-4 py-2 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-white/10 dark:bg-white/5 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium">Message</label>
            <textarea
              id="message"
              rows={5}
              className="mt-1 w-full rounded-lg ring-1 ring-neutral-300 bg-neutral-50 px-4 py-2 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:ring-white/10 dark:bg-white/5 dark:text-white"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit" className="inline-flex h-10 items-center rounded-lg bg-[hsl(var(--accent))] px-4 text-white hover:opacity-90">
              Send
            </button>
          </div>
        </form>
      </Section>
    </main>
  );
}



