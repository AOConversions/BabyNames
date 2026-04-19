"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import type { NameRow } from "@/lib/types";

export default function CelebrateClient({ name }: { name: NameRow }) {
  useEffect(() => {
    const end = Date.now() + 2600;
    const colors = ["#ff8a5c", "#8e72ff", "#3fc987", "#ffc73b", "#ffb88f"];
    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 70,
        startVelocity: 55,
        origin: { x: 0, y: 0.8 },
        colors,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 70,
        startVelocity: 55,
        origin: { x: 1, y: 0.8 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({
      particleCount: 140,
      spread: 160,
      startVelocity: 40,
      origin: { y: 0.35 },
      colors,
    });
  }, [name.id]);

  const letters = name.name.split("");

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "linear-gradient(135deg,#ffd6b8,#e6d7ff,#d1f5e5)",
            "linear-gradient(135deg,#fff3b0,#ffd6b8,#e6d7ff)",
            "linear-gradient(135deg,#d1f5e5,#fff3b0,#ffd6b8)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      />

      <motion.p
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-display text-xl font-bold uppercase tracking-[0.3em] text-peach-700"
      >
        Our first baby&apos;s name
      </motion.p>

      <div className="mt-6 flex flex-wrap justify-center gap-1">
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            initial={{ y: 60, opacity: 0, rotate: -10 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{
              delay: 0.1 + i * 0.08,
              type: "spring",
              damping: 10,
              stiffness: 240,
            }}
            className="font-display text-7xl font-bold text-slate-900 sm:text-8xl"
          >
            {ch}
          </motion.span>
        ))}
      </div>

      {name.meaning && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 max-w-xs text-base font-semibold text-slate-700"
        >
          {name.origin ? `${name.origin} · ` : ""}“{name.meaning}”
        </motion.p>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="mt-4 text-lg"
      >
        💛
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="mt-10 flex gap-3"
      >
        <Link
          href="/matches"
          className="rounded-2xl bg-white px-5 py-3 font-bold text-slate-700 shadow-soft"
        >
          Back to matches
        </Link>
        <Link
          href="/swipe"
          className="rounded-2xl bg-gradient-to-br from-peach-500 to-lavender-500 px-5 py-3 font-bold text-white shadow-pop"
        >
          Keep dreaming
        </Link>
      </motion.div>
    </main>
  );
}
