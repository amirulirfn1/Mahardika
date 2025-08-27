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
              className="mt-1 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2"
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
              className="mt-1 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2"
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
              className="mt-1 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit" className="inline-flex h-10 items-center rounded-md bg-neutral-900 px-4 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900">
              Send
            </button>
          </div>
        </form>
      </Section>
    </main>
  );
}



