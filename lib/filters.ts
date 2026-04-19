"use client";

import { DEFAULT_FILTERS, type Filters } from "./types";

const KEY = "baby-names.filters.v1";

export function loadFilters(): Filters {
  if (typeof window === "undefined") return DEFAULT_FILTERS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_FILTERS;
    const parsed = JSON.parse(raw) as Partial<Filters>;
    return { ...DEFAULT_FILTERS, ...parsed };
  } catch {
    return DEFAULT_FILTERS;
  }
}

export function saveFilters(f: Filters) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(f));
}

export function filtersActiveCount(f: Filters): number {
  return (
    (f.genders.length ? 1 : 0) +
    (f.origins.length ? 1 : 0) +
    (f.startsWith ? 1 : 0) +
    (f.lengths.length ? 1 : 0) +
    (f.source !== "all" ? 1 : 0)
  );
}
