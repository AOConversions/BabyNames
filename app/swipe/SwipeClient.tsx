"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, SlidersHorizontal, X } from "lucide-react";
import SwipeCard from "@/components/SwipeCard";
import MatchPopup from "@/components/MatchPopup";
import BottomNav from "@/components/BottomNav";
import AddNameFab from "@/components/AddNameFab";
import FilterSheet from "@/components/FilterSheet";
import ActiveFilterPills from "@/components/ActiveFilterPills";
import { createClient } from "@/lib/supabase/client";
import { getNextNames, recordSwipe } from "@/lib/queries";
import { loadFilters, saveFilters, filtersActiveCount } from "@/lib/filters";
import { DEFAULT_FILTERS, type Filters, type NameRow } from "@/lib/types";

export default function SwipeClient({ userId }: { userId: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [deck, setDeck] = useState<NameRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [matched, setMatched] = useState<NameRow | null>(null);

  useEffect(() => {
    setFilters(loadFilters());
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await getNextNames(supabase, userId, filters);
      setDeck(rows);
    } finally {
      setLoading(false);
    }
  }, [supabase, userId, filters]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleSwipe(liked: boolean) {
    const top = deck[0];
    if (!top) return;
    setDeck((d) => d.slice(1));
    try {
      const { matched } = await recordSwipe(supabase, userId, top.id, liked);
      if (matched) setMatched(top);
      if (deck.length <= 4) {
        const more = await getNextNames(supabase, userId, filters);
        setDeck((d) => {
          const existing = new Set(d.map((n) => n.id));
          return [...d, ...more.filter((n) => !existing.has(n.id))];
        });
      }
    } catch (err) {
      console.error(err);
      setDeck((d) => [top, ...d]);
    }
  }

  const activeCount = filtersActiveCount(filters);

  return (
    <main className="relative mx-auto flex min-h-dvh max-w-md flex-col px-4 pb-28 pt-[calc(var(--safe-top)+1rem)]">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-peach-700">
            Our baby name
          </p>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Swipe together ✨
          </h1>
        </div>
        <button
          onClick={() => setFiltersOpen(true)}
          aria-label="Filters"
          className="relative rounded-2xl bg-white px-3 py-3 text-slate-700 shadow-soft"
        >
          <SlidersHorizontal size={20} />
          {activeCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-peach-500 text-[11px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </header>

      <ActiveFilterPills
        filters={filters}
        onClear={(next) => {
          setFilters(next);
          saveFilters(next);
        }}
      />

      <div className="relative mx-auto mt-4 aspect-[3/4] w-full max-w-sm">
        <AnimatePresence>
          {deck.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-4xl bg-white/70 p-8 text-center shadow-soft backdrop-blur-xl"
            >
              <span className="text-5xl animate-float">🍼</span>
              <h2 className="mt-4 font-display text-2xl font-bold">
                You&apos;re all caught up!
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Loosen your filters, or tap the + button to add your own name.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {deck
          .slice(0, 3)
          .map((n, i) => (
            <SwipeCard
              key={n.id}
              nameRow={n}
              isTop={i === 0}
              offset={i}
              onSwipe={handleSwipe}
            />
          ))
          .reverse()}
      </div>

      <div className="mx-auto mt-6 flex items-center gap-6">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => handleSwipe(false)}
          disabled={deck.length === 0}
          aria-label="Pass"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-peach-700 shadow-soft disabled:opacity-40"
        >
          <X size={28} strokeWidth={3} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => handleSwipe(true)}
          disabled={deck.length === 0}
          aria-label="Love"
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-peach-500 to-lavender-500 text-white shadow-pop disabled:opacity-40"
        >
          <Heart size={32} strokeWidth={3} fill="currentColor" />
        </motion.button>
      </div>

      <BottomNav />
      <AddNameFab onAdded={refresh} />
      <FilterSheet
        open={filtersOpen}
        filters={filters}
        onClose={() => setFiltersOpen(false)}
        onChange={(next) => {
          setFilters(next);
          saveFilters(next);
        }}
      />
      <MatchPopup name={matched} onClose={() => setMatched(null)} />
    </main>
  );
}
