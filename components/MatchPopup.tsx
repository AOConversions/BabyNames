"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import type { NameRow } from "@/lib/types";
import Link from "next/link";

export default function MatchPopup({
  name,
  onClose,
}: {
  name: NameRow | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!name) return;
    const end = Date.now() + 900;
    const colors = ["#ff8a5c", "#8e72ff", "#3fc987", "#ffc73b"];
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, [name]);

  return (
    <AnimatePresence>
      {name && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 220 }}
          >
            <div className="w-full max-w-sm rounded-[2.5rem] bg-gradient-to-br from-peach-300 via-sunshine-300 to-lavender-300 p-1 shadow-pop">
              <div className="rounded-[2.25rem] bg-white/90 p-8 text-center backdrop-blur-xl">
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="font-display text-4xl font-bold text-peach-700"
                >
                  It&apos;s a match!
                </motion.p>
                <motion.h3
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 180 }}
                  className="mt-4 font-display text-6xl font-bold text-slate-900"
                >
                  {name.name}
                </motion.h3>
                {name.meaning && (
                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    {name.meaning} · {name.origin}
                  </p>
                )}
                <p className="mt-6 text-sm text-slate-600">
                  You both swiped love. Rate it on the matches page to see your
                  shared top picks.
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-2xl bg-slate-100 py-3 font-bold text-slate-700"
                  >
                    Keep swiping
                  </button>
                  <Link
                    href="/matches"
                    className="flex-1 rounded-2xl bg-gradient-to-br from-peach-500 to-lavender-500 py-3 font-bold text-white shadow-pop"
                  >
                    See matches
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
