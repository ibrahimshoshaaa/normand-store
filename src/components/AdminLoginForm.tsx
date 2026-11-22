"use client";

// Normand — admin sign-in form (password checked against ADMIN_PASSWORD).
import { useActionState } from "react";
import { adminLoginAction } from "@/lib/actions";

export function AdminLoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(adminLoginAction, { error: null });
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="admin-password" className="text-sm font-semibold">
          Admin password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="mt-1 w-full rounded-2xl border border-black/15 bg-surface px-4 py-3 outline-none focus:border-ink"
        />
      </div>
      {state.error && (
        <p role="alert" className="rounded-2xl bg-red-100 px-4 py-3 text-sm font-semibold text-red-800">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-ink py-3.5 font-semibold text-cream disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
