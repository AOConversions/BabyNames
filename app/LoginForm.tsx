"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback`
              : undefined,
        },
      });
      if (error) throw error;
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-6 rounded-2xl bg-mint-100 p-4 text-center">
        <p className="font-semibold text-mint-700">Check your inbox!</p>
        <p className="mt-1 text-sm text-slate-600">
          We sent a magic link to <strong>{email}</strong>. Open it on this
          device to sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-3">
      <label className="block">
        <span className="text-sm font-semibold text-slate-600">Your email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg focus:border-peach-500 focus:outline-none focus:ring-2 focus:ring-peach-300"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-2xl bg-gradient-to-br from-peach-500 to-lavender-500 py-4 text-lg font-bold text-white shadow-pop transition disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send magic link"}
      </button>
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <p className="text-center text-xs text-slate-500">
        Both of you sign in with your own email to get your own swipe deck.
      </p>
    </form>
  );
}
