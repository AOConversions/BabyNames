"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import AddNameFab from "@/components/AddNameFab";
import StarRating from "@/components/StarRating";
import { createClient } from "@/lib/supabase/client";
import { getMatches, rateName, type MatchRow } from "@/lib/queries";

export default function MatchesClient({ userId }: { userId: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await getMatches(supabase, userId);
      setMatches(rows);
    } finally {
      setLoading(false);
    }
  }, [supabase, userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function setStars(nameId: string, stars: number) {
    setMatches((ms) =>
      ms
        .map((m) =>
          m.id === nameId
            ? {
                ...m,
                my_stars: stars,
                combined_stars: stars + (m.partner_stars ?? 0),
              }
            : m,
        )
        .sort(
          (a, b) => b.combined_stars - a.combined_stars || a.name.localeCompare(b.name),
        ),
    );
    try {
      await rateName(supabase, userId, nameId, stars);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="relative mx-auto flex min-h-dvh max-w-md flex-col px-4 pb-28 pt-[calc(var(--safe-top)+1rem)]">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-lavender-700">
          Both swiped love
        </p>
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Our matches 💖
        </h1>
      </header>

      {!loading && matches.length === 0 && (
        <div className="mt-10 rounded-4xl bg-white/70 p-8 text-center shadow-soft backdrop-blur-xl">
          <span className="text-5xl animate-float inline-block">💞</span>
          <h2 className="mt-4 font-display text-xl font-bold">No matches yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Keep swiping — names you both love will show up here for you to
            rate.
          </p>
          <Link
            href="/swipe"
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-peach-500 to-lavender-500 px-5 py-3 font-bold text-white shadow-pop"
          >
            <Sparkles size={18} /> Start swiping
          </Link>
        </div>
      )}

      <ul className="mt-4 space-y-3">
        {matches.map((m) => (
          <motion.li
            key={m.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white p-5 shadow-soft"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl font-bold text-slate-900">
                  {m.name}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {m.gender}
                  {m.origin ? ` · ${m.origin}` : ""}
                </p>
                {m.meaning && (
                  <p className="mt-1 text-sm text-slate-600">“{m.meaning}”</p>
                )}
              </div>
              <Link
                href={`/celebrate/${m.id}`}
                className="shrink-0 rounded-full bg-gradient-to-br from-sunshine-300 to-peach-500 px-3 py-2 text-xs font-bold text-white shadow-pop"
              >
                The one!
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  You
                </p>
                <StarRating
                  value={m.my_stars}
                  onChange={(n) => setStars(m.id, n)}
                  colorClass="text-peach-500"
                />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Partner
                </p>
                <StarRating
                  value={m.partner_stars}
                  readOnly
                  colorClass="text-lavender-500"
                />
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      <BottomNav />
      <AddNameFab onAdded={refresh} />
    </main>
  );
}
