// Regenerate supabase/seed.sql from data/seed-names.ts
// Usage: node scripts/generate-seed-sql.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(resolve(__dirname, "../data/seed-names.ts"), "utf8");

const match = src.match(/SEED_NAMES:\s*SeedName\[\]\s*=\s*\[([\s\S]*?)\];/);
if (!match) {
  console.error("Could not parse SEED_NAMES from data/seed-names.ts");
  process.exit(1);
}

const body = match[1];
const entries = [];
const re =
  /\{\s*name:\s*"([^"]+)"\s*,\s*gender:\s*"(girl|boy|unisex)"\s*,\s*origin:\s*"([^"]*)"\s*,\s*meaning:\s*"([^"]*)"\s*\}/g;
let m;
while ((m = re.exec(body)) !== null) {
  entries.push({ name: m[1], gender: m[2], origin: m[3], meaning: m[4] });
}

const esc = (s) => s.replace(/'/g, "''");
const values = entries
  .map(
    (e) =>
      `  ('${esc(e.name)}', '${e.gender}', '${esc(e.origin)}', '${esc(e.meaning)}')`,
  )
  .join(",\n");

const sql = `-- Generated from data/seed-names.ts — do not edit by hand.
insert into public.names (name, gender, origin, meaning) values
${values}
on conflict (name, gender) do nothing;
`;

writeFileSync(resolve(__dirname, "../supabase/seed.sql"), sql);
console.log(`Wrote ${entries.length} rows to supabase/seed.sql`);
