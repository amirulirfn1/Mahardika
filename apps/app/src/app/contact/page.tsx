"use client";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log({ name, email, message });
  }

  return (
    <main>
      <Section>
        <SectionHeading title="Contact" subtitle="We would love to hear from you." />
        <form onSubmit={onSubmit} className="max-w-xl space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <input
              id="name"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-muted-foreground">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <div>
            <Button type="submit">Send</Button>
          </div>
        </form>
      </Section>
    </main>
  );
}
