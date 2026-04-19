"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import type { NameRow } from "@/lib/types";

const GENDER_GRADIENT: Record<NameRow["gender"], string> = {
  girl: "from-peach-300 via-peach-500 to-lavender-300",
  boy: "from-mint-300 via-lavender-300 to-sunshine-300",
  unisex: "from-sunshine-300 via-peach-300 to-lavender-300",
};

export default function SwipeCard({
  nameRow,
  onSwipe,
  isTop,
  offset,
}: {
  nameRow: NameRow;
  onSwipe: (liked: boolean) => void;
  isTop: boolean;
  offset: number; // 0 = top card, 1 = behind, 2 = further back
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 0, 250], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [40, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -40], [1, 0]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const threshold = 110;
    if (info.offset.x > threshold || info.velocity.x > 600) {
      if (navigator.vibrate) navigator.vibrate(20);
      onSwipe(true);
    } else if (info.offset.x < -threshold || info.velocity.x < -600) {
      if (navigator.vibrate) navigator.vibrate(10);
      onSwipe(false);
    }
  }

  const scale = 1 - offset * 0.05;
  const y = offset * 12;

  return (
    <motion.div
      className="absolute inset-0 no-select"
      drag={isTop ? "x" : false}
      dragElastic={0.9}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x: isTop ? x : 0, rotate: isTop ? rotate : 0 }}
      animate={{ scale, y, opacity: offset > 2 ? 0 : 1 }}
      transition={{ type: "spring", damping: 22, stiffness: 240 }}
    >
      <div
        className={`flex h-full w-full flex-col justify-between rounded-4xl bg-gradient-to-br ${GENDER_GRADIENT[nameRow.gender]} p-7 text-slate-900 shadow-pop`}
      >
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-700">
            {nameRow.gender}
          </span>
          {nameRow.origin && (
            <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-slate-700">
              {nameRow.origin}
            </span>
          )}
        </div>

        <div className="flex flex-col items-center text-center">
          <h2 className="font-display text-6xl font-bold leading-tight drop-shadow-sm sm:text-7xl">
            {nameRow.name}
          </h2>
          {nameRow.meaning && (
            <p className="mt-4 max-w-[18rem] text-base font-semibold text-slate-800/80">
              “{nameRow.meaning}”
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-slate-700/80">
          <span>{nameRow.name.length} letters</span>
          <span>Swipe → love · Swipe ← pass</span>
        </div>

        {isTop && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="pointer-events-none absolute left-6 top-6 rotate-[-18deg] rounded-2xl border-4 border-mint-500 px-4 py-2 font-display text-3xl font-bold text-mint-700"
            >
              LOVE
            </motion.div>
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="pointer-events-none absolute right-6 top-6 rotate-[18deg] rounded-2xl border-4 border-peach-700 px-4 py-2 font-display text-3xl font-bold text-peach-700"
            >
              NOPE
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
