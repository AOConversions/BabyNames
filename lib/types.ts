export type Gender = "girl" | "boy" | "unisex";

export type NameRow = {
  id: string;
  name: string;
  gender: Gender;
  origin: string | null;
  meaning: string | null;
  added_by: string | null;
  created_at: string;
};

export type LengthBucket = "short" | "medium" | "long";
export type SourceFilter = "all" | "curated" | "ours";

export type Filters = {
  genders: Gender[]; // empty = all
  origins: string[]; // empty = all
  startsWith: string | null; // single letter A-Z or null
  lengths: LengthBucket[]; // empty = all
  source: SourceFilter;
};

export const DEFAULT_FILTERS: Filters = {
  genders: [],
  origins: [],
  startsWith: null,
  lengths: [],
  source: "all",
};
