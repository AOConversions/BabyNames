"use client";

import { X } from "lucide-react";
import { DEFAULT_FILTERS, type Filters } from "@/lib/types";

export default function ActiveFilterPills({
  filters,
  onClear,
}: {
  filters: Filters;
  onClear: (next: Filters) => void;
}) {
  const pills: { key: string; label: string; clear: () => void }[] = [];

  filters.genders.forEach((g) =>
    pills.push({
      key: `g-${g}`,
      label: g,
      clear: () =>
        onClear({ ...filters, genders: filters.genders.filter((x) => x !== g) }),
    }),
  );
  filters.origins.forEach((o) =>
    pills.push({
      key: `o-${o}`,
      label: o,
      clear: () =>
        onClear({ ...filters, origins: filters.origins.filter((x) => x !== o) }),
    }),
  );
  if (filters.startsWith) {
    const letter = filters.startsWith;
    pills.push({
      key: `s-${letter}`,
      label: `Starts ${letter}`,
      clear: () => onClear({ ...filters, startsWith: null }),
    });
  }
  filters.lengths.forEach((l) =>
    pills.push({
      key: `l-${l}`,
      label: l,
      clear: () =>
        onClear({ ...filters, lengths: filters.lengths.filter((x) => x !== l) }),
    }),
  );
  if (filters.source !== "all") {
    const src = filters.source;
    pills.push({
      key: "src",
      label: src === "curated" ? "Curated" : "Just ours",
      clear: () => onClear({ ...filters, source: "all" }),
    });
  }

  if (pills.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {pills.map((p) => (
        <button
          key={p.key}
          onClick={p.clear}
          className="flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold capitalize text-slate-700 shadow-soft"
        >
          {p.label}
          <X size={12} />
        </button>
      ))}
      {pills.length > 1 && (
        <button
          onClick={() => onClear(DEFAULT_FILTERS)}
          className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
