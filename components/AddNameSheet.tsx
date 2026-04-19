"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { addName } from "@/lib/queries";
import type { Gender } from "@/lib/types";

export default function AddNameSheet({
  open,
  onClose,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("girl");
  const [origin, setOrigin] = useState("");
  const [meaning, setMeaning] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      await addName(supabase, user.id, { name, gender, origin, meaning });
      setName("");
      setOrigin("");
      setMeaning("");
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add that name");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label="Add a name"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-4xl bg-white p-6 shadow-2xl"
            style={{ paddingBottom: "calc(var(--safe-bottom) + 1.5rem)" }}
          >
            <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200" />
            <div className="mt-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-slate-800">
                Add a name
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submit} className="mt-4 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-600">Name</span>
                <input
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-semibold focus:border-peach-500 focus:outline-none focus:ring-2 focus:ring-peach-300"
                  placeholder="e.g. Rosalind"
                />
              </label>

              <div>
                <span className="text-sm font-semibold text-slate-600">
                  Gender
                </span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(["girl", "boy", "unisex"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`rounded-2xl px-3 py-2 text-sm font-bold capitalize transition ${
                        gender === g
                          ? "bg-gradient-to-br from-peach-300 to-lavender-300 text-slate-800 shadow-soft"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-600">
                  Origin <span className="font-normal text-slate-400">(optional)</span>
                </span>
                <input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-peach-500 focus:outline-none focus:ring-2 focus:ring-peach-300"
                  placeholder="e.g. Irish"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-600">
                  Meaning <span className="font-normal text-slate-400">(optional)</span>
                </span>
                <input
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-peach-500 focus:outline-none focus:ring-2 focus:ring-peach-300"
                  placeholder="e.g. Gentle horse"
                />
              </label>

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy || !name.trim()}
                className="w-full rounded-2xl bg-gradient-to-br from-peach-500 to-lavender-500 py-4 text-lg font-bold text-white shadow-pop transition disabled:opacity-60"
              >
                {busy ? "Adding…" : "Add to our deck"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
