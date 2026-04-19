# Our Baby Name 💛

A playful, mobile-first web app for couples to swipe on baby names together,
match on shared favorites, and rate them to find The One.

Built with Next.js 14, Tailwind CSS, Framer Motion, and Supabase.

## Features

- 📱 Mobile-first, designed for iPhone/iPad (add to Home Screen for PWA feel)
- 💞 Tinder-style swipe cards with spring animations and haptic nudges
- ✨ Match detection: names you both "love" land in a shared matches list
- ⭐️ Dual 1–5 star ratings, sorted by combined score
- 🎛 Rich filters: gender, origin, starts-with letter, name length, source
- ➕ One-tap floating button to add your own custom names from any screen
- 🎉 Confetti + bouncy letter celebration page when you pick The One

## Local setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com).
2. In the SQL editor, run:
   - `supabase/migrations/0001_init.sql` (schema + RLS + `matches` view)
   - `supabase/seed.sql` (209 curated names)
3. Copy `.env.local.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```
4. Install and run:
   ```
   npm install
   npm run dev
   ```
5. Open `http://localhost:3000` (or your LAN IP from an iPhone on the same Wi-Fi).

Both of you sign in with your own email via magic link. Each of you gets your
own swipe deck. A name becomes a match once both have swiped love.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import into Vercel and set the two env vars from above.
3. In Supabase **Authentication → URL Configuration**, add your Vercel URL to
   allowed redirect URLs so magic links work in production.

## Adding more names

- Tap the big **+** floating button on any screen.
- Or expand `data/seed-names.ts` and run `node scripts/generate-seed-sql.mjs` to
  regenerate `supabase/seed.sql`.

## Structure

```
app/
  page.tsx                # Login (magic link)
  swipe/                  # The main swipe deck
  matches/                # Matched names + dual ratings
  celebrate/[id]/         # "The One!" celebration page
  profile/                # Signed-in user info + sign out
components/
  SwipeCard, MatchPopup, StarRating, FilterSheet,
  ActiveFilterPills, AddNameFab, AddNameSheet, BottomNav
lib/
  supabase/{client,server,middleware}.ts
  queries.ts              # All DB access
  filters.ts              # Filter type + localStorage persistence
  types.ts
data/seed-names.ts        # Curated name list (source of truth)
supabase/
  migrations/0001_init.sql
  seed.sql                # Generated from data/seed-names.ts
```
