"use client";

// Normand — newsletter signup (demo: stores nothing, just confirms).
import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return done ? (
    <p className="rounded-full bg-leaf/20 px-5 py-3 text-sm font-semibold text-leaf">
      You’re in — slow mail, once a month.
    </p>
  ) : (
    <form
      className="flex max-w-md gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) setDone(true);
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-full border border-black/15 bg-surface px-5 py-3 text-sm outline-none focus:border-ink"
      />
      <button type="submit" className="shrink-0 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream">
        Subscribe
      </button>
    </form>
  );
}
