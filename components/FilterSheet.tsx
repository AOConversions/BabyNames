"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getDistinctOrigins } from "@/lib/queries";
import {
  DEFAULT_FILTERS,
  type Filters,
  type Gender,
  type LengthBucket,
  type SourceFilter,
} from "@/lib/types";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const GENDERS: { value: Gender; label: string }[] = [
  { value: "girl", label: "Girl" },
  { value: "boy", label: "Boy" },
  { value: "unisex", label: "Unisex" },
];
const LENGTHS: { value: LengthBucket; label: string }[] = [
  { value: "short", label: "Short (≤4)" },
  { value: "medium", label: "Medium (5–7)" },
  { value: "long", label: "Long (8+)" },
];
const SOURCES: { value: SourceFilter; label: string }[] = [
  { value: "all", label: "All names" },
  { value: "curated", label: "Curated only" },
  { value: "ours", label: "Just ours" },
];

function toggle<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export default function FilterSheet({
  open,
  filters,
  onClose,
  onChange,
}: {
  open: boolean;
  filters: Filters;
  onClose: () => void;
  onChange: (next: Filters) => void;
}) {
  const [draft, setDraft] = useState<Filters>(filters);
  const [origins, setOrigins] = useState<string[]>([]);

  useEffect(() => {
    setDraft(filters);
  }, [filters, open]);

  useEffect(() => {
    if (!open) return;
    const supabase = createClient();
    getDistinctOrigins(supabase).then(setOrigins).catch(() => setOrigins([]));
  }, [open]);

  function apply() {
    onChange(draft);
    onClose();
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
            aria-label="Filters"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto rounded-t-4xl bg-white p-6 shadow-2xl"
            style={{ paddingBottom: "calc(var(--safe-bottom) + 1.5rem)" }}
          >
            <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200" />
            <div className="mt-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-slate-800">
                Filters
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <section className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Gender
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {GENDERS.map((g) => {
                  const on = draft.genders.includes(g.value);
                  return (
                    <button
                      key={g.value}
                      onClick={() =>
                        setDraft((d) => ({ ...d, genders: toggle(d.genders, g.value) }))
                      }
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        on
                          ? "bg-gradient-to-br from-peach-300 to-lavender-300 text-slate-800 shadow-soft"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Length
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {LENGTHS.map((l) => {
                  const on = draft.lengths.includes(l.value);
                  return (
                    <button
                      key={l.value}
                      onClick={() =>
                        setDraft((d) => ({ ...d, lengths: toggle(d.lengths, l.value) }))
                      }
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        on
                          ? "bg-gradient-to-br from-mint-300 to-sunshine-300 text-slate-800 shadow-soft"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Starts with
              </h3>
              <div className="mt-2 grid grid-cols-7 gap-1.5">
                {ALPHABET.map((letter) => {
                  const on = draft.startsWith === letter;
                  return (
                    <button
                      key={letter}
                      onClick={() =>
                        setDraft((d) => ({
                          ...d,
                          startsWith: on ? null : letter,
                        }))
                      }
                      className={`h-9 rounded-xl text-sm font-bold transition ${
                        on
                          ? "bg-peach-500 text-white shadow-soft"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </section>

            {origins.length > 0 && (
              <section className="mt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Origin
                </h3>
                <div className="mt-2 flex max-h-40 flex-wrap gap-2 overflow-y-auto">
                  {origins.map((o) => {
                    const on = draft.origins.includes(o);
                    return (
                      <button
                        key={o}
                        onClick={() =>
                          setDraft((d) => ({ ...d, origins: toggle(d.origins, o) }))
                        }
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          on
                            ? "bg-lavender-300 text-slate-800 shadow-soft"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Source
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {SOURCES.map((s) => {
                  const on = draft.source === s.value;
                  return (
                    <button
                      key={s.value}
                      onClick={() => setDraft((d) => ({ ...d, source: s.value }))}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        on
                          ? "bg-gradient-to-br from-sunshine-300 to-peach-300 text-slate-800 shadow-soft"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setDraft(DEFAULT_FILTERS)}
                className="flex-1 rounded-2xl bg-slate-100 py-3 font-bold text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={apply}
                className="flex-1 rounded-2xl bg-gradient-to-br from-peach-500 to-lavender-500 py-3 font-bold text-white shadow-pop"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
