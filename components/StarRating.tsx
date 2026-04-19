"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 24,
  colorClass = "text-sunshine-500",
}: {
  value: number | null;
  onChange?: (n: number) => void;
  readOnly?: boolean;
  size?: number;
  colorClass?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (value ?? 0) >= n;
        return (
          <motion.button
            key={n}
            type="button"
            disabled={readOnly}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: readOnly ? 1 : 1.15 }}
            onClick={() => onChange?.(n)}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            className={`transition ${filled ? colorClass : "text-slate-300"}`}
          >
            <Star
              size={size}
              strokeWidth={2}
              fill={filled ? "currentColor" : "none"}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
