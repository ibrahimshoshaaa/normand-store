"use client";

// Normand — newsletter signup: saves the email (server action) and confirms.
import { useState } from "react";
import { subscribeAction } from "@/lib/actions";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  return done ? (
    <p className="rounded-full bg-leaf/20 px-5 py-3 text-sm font-semibold text-leaf">
      You’re in — slow mail, once a month.
    </p>
  ) : (
    <form
      className="flex max-w-md flex-col gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!email.includes("@")) {
          setError("Enter a valid email address.");
          return;
        }
        setError(null);
        setSaving(true);
        try {
          await subscribeAction(email.trim());
          setDone(true);
        } catch {
          setError("Something went wrong — please try again.");
        } finally {
          setSaving(false);
        }
      }}
    >
      <div className="flex gap-2">
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
        <button
          type="submit"
          disabled={saving}
          className="shrink-0 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream disabled:opacity-50"
        >
          {saving ? "Joining…" : "Subscribe"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
