// Extract rows from seed.sql whose name starts with A-z case range we want.
// Usage: node scripts/extract-a-names.mjs > supabase/updates/0002_more_a_names.sql
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seed = readFileSync(
  resolve(__dirname, "../supabase/seed.sql"),
  "utf8",
);

const rows = seed
  .split("\n")
  .filter((l) => /^\s*\('A/.test(l))
  .map((l) => l.replace(/,?\s*$/, ""));

process.stdout.write(
  `-- A-name expansion: inserts every row from seed.sql whose name starts with "A".\n` +
    `-- Safe to re-run: existing (name, gender) pairs are ignored via ON CONFLICT.\n` +
    `insert into public.names (name, gender, origin, meaning) values\n` +
    rows.join(",\n") +
    `\non conflict (name, gender) do nothing;\n`,
);
