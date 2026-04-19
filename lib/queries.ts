import type { SupabaseClient } from "@supabase/supabase-js";
import type { Filters, Gender, NameRow } from "./types";

function applyClientFilters(rows: NameRow[], filters: Filters): NameRow[] {
  return rows.filter((r) => {
    if (filters.genders.length && !filters.genders.includes(r.gender)) return false;
    if (filters.origins.length && (!r.origin || !filters.origins.includes(r.origin)))
      return false;
    if (filters.startsWith) {
      const first = r.name.charAt(0).toLowerCase();
      if (first !== filters.startsWith.toLowerCase()) return false;
    }
    if (filters.lengths.length) {
      const len = r.name.length;
      const bucket = len <= 4 ? "short" : len <= 7 ? "medium" : "long";
      if (!filters.lengths.includes(bucket)) return false;
    }
    return true;
  });
}

export async function getNextNames(
  supabase: SupabaseClient,
  userId: string,
  filters: Filters,
  limit = 25,
): Promise<NameRow[]> {
  // Pull name ids already swiped by this user, exclude them
  const { data: swiped } = await supabase
    .from("swipes")
    .select("name_id")
    .eq("user_id", userId);
  const excludedIds = new Set((swiped ?? []).map((s) => s.name_id as string));

  let q = supabase.from("names").select("*").order("created_at", { ascending: false });

  if (filters.source === "curated") q = q.is("added_by", null);
  if (filters.source === "ours") q = q.not("added_by", "is", null);
  if (filters.genders.length) q = q.in("gender", filters.genders);
  if (filters.origins.length) q = q.in("origin", filters.origins);

  const { data, error } = await q.limit(500);
  if (error) throw error;
  const rows = (data ?? []) as NameRow[];

  const filtered = applyClientFilters(rows, filters).filter(
    (r) => !excludedIds.has(r.id),
  );

  // Surface the most recently added names first, then shuffle the rest for variety
  const fresh = filtered.slice(0, 10);
  const rest = filtered.slice(10);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [...fresh, ...rest].slice(0, limit);
}

export async function recordSwipe(
  supabase: SupabaseClient,
  userId: string,
  nameId: string,
  liked: boolean,
): Promise<{ matched: boolean }> {
  const { error } = await supabase
    .from("swipes")
    .upsert({ user_id: userId, name_id: nameId, liked });
  if (error) throw error;

  if (!liked) return { matched: false };

  const { count } = await supabase
    .from("swipes")
    .select("*", { count: "exact", head: true })
    .eq("name_id", nameId)
    .eq("liked", true);

  return { matched: (count ?? 0) >= 2 };
}

export type MatchRow = NameRow & {
  my_stars: number | null;
  partner_stars: number | null;
  combined_stars: number;
};

export async function getMatches(
  supabase: SupabaseClient,
  userId: string,
): Promise<MatchRow[]> {
  const { data: names, error } = await supabase.from("matches").select("*");
  if (error) throw error;
  const matches = (names ?? []) as NameRow[];
  if (matches.length === 0) return [];

  const ids = matches.map((n) => n.id);
  const { data: ratings } = await supabase
    .from("ratings")
    .select("name_id, user_id, stars")
    .in("name_id", ids);

  return matches
    .map<MatchRow>((n) => {
      const rs = (ratings ?? []).filter((r) => r.name_id === n.id);
      const mine = rs.find((r) => r.user_id === userId)?.stars ?? null;
      const theirs =
        rs.find((r) => r.user_id !== userId)?.stars ?? null;
      const combined = (mine ?? 0) + (theirs ?? 0);
      return {
        ...n,
        my_stars: mine,
        partner_stars: theirs,
        combined_stars: combined,
      };
    })
    .sort((a, b) => b.combined_stars - a.combined_stars || a.name.localeCompare(b.name));
}

export async function rateName(
  supabase: SupabaseClient,
  userId: string,
  nameId: string,
  stars: number,
) {
  const { error } = await supabase
    .from("ratings")
    .upsert({ user_id: userId, name_id: nameId, stars });
  if (error) throw error;
}

export async function addName(
  supabase: SupabaseClient,
  userId: string,
  input: { name: string; gender: Gender; origin?: string; meaning?: string },
): Promise<NameRow> {
  const { data, error } = await supabase
    .from("names")
    .insert({
      name: input.name.trim(),
      gender: input.gender,
      origin: input.origin?.trim() || null,
      meaning: input.meaning?.trim() || null,
      added_by: userId,
    })
    .select()
    .single();
  if (error) throw error;
  return data as NameRow;
}

export async function getDistinctOrigins(
  supabase: SupabaseClient,
): Promise<string[]> {
  const { data } = await supabase.from("names").select("origin");
  const set = new Set<string>();
  (data ?? []).forEach((r) => {
    if (r.origin) set.add(r.origin as string);
  });
  return Array.from(set).sort();
}
