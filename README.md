# Our Baby Name 💛

A playful, mobile-first web app for couples to swipe on baby names together,
match on shared favorites, and rate them to find The One.

Built with Next.js, Tailwind, Framer Motion, and Supabase.

---

## 🚀 Deploy it from your iPad (≈10 minutes)

You'll need two free accounts: a **Supabase** account (shared database) and a
**Vercel** account (hosting). Both sign up with GitHub in one tap.

### Step 1 — Create the Supabase database

1. On your iPad, open [supabase.com](https://supabase.com) → tap **Start your project** → sign in with GitHub.
2. Tap **New project**. Give it any name (e.g. `baby-names`), set a database password, pick the closest region, then **Create new project**. Wait ~1 minute for it to spin up.
3. In the left sidebar, tap the **SQL Editor** icon (`</>`) → **New query**.
4. In this repo, open [`supabase/setup.sql`](./supabase/setup.sql) and tap the **Copy raw file** button. Paste it into the Supabase SQL editor and tap **Run**. You should see "Success. No rows returned."

### Step 2 — Grab your Supabase keys

1. In Supabase, tap the **gear icon** (Project Settings) → **API**.
2. Copy two things somewhere (Notes app is fine):
   - **Project URL** — looks like `https://xxxxx.supabase.co`
   - **anon / public** key — a long string starting with `eyJ…`

### Step 3 — Deploy to Vercel

Tap this button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faoconversions%2Fbabynames%2Ftree%2Fclaude%2Fbaby-name-picker-app-FpszO&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Paste%20from%20your%20Supabase%20project%20settings%20(API%20tab).&envLink=https%3A%2F%2Fsupabase.com%2Fdashboard%2Fproject%2F_%2Fsettings%2Fapi&project-name=baby-names&repository-name=baby-names)

It will:
1. Ask you to sign in to Vercel with GitHub.
2. Fork this repo into your GitHub account.
3. Ask for the two environment variables — paste your **Project URL** and **anon key** from Step 2.
4. Hit **Deploy**. In ~1 minute you'll get a live URL like `https://baby-names-xxx.vercel.app`.

### Step 4 — Allow magic-link sign-in on the live URL

1. Back in Supabase → **Authentication** (left sidebar) → **URL Configuration**.
2. Set **Site URL** to your Vercel URL (e.g. `https://baby-names-xxx.vercel.app`).
3. Add that same URL to **Redirect URLs** as well.

### Step 5 — Sign in on both iPhones

1. Open the Vercel URL on your iPhone → enter your email → tap **Send magic link** → open the email and tap the link. You're in.
2. On your wife's iPhone, do the same with **her** email. You each get your own swipe deck.
3. On each iPhone, tap the Safari **Share** icon → **Add to Home Screen** so it launches full‑screen like a native app.

That's it — start swiping! 💛

---

## Features

- 📱 Mobile-first, designed for iPhone/iPad; add to Home Screen for PWA feel
- 💞 Tinder-style swipe cards with spring animations and haptic nudges
- ✨ Match detection: names you both "love" land in a shared matches list with confetti
- ⭐️ Dual 1–5 star ratings, sorted by combined score
- 🎛 Rich filters: gender, origin, starts-with letter, length, source
- ➕ One-tap floating button on every screen to add your own custom names
- 🎉 Full-screen celebration with bouncing letters + confetti for The One

## Local development (optional)

If you ever want to run on your laptop:

```bash
cp .env.local.example .env.local   # then fill in the two Supabase values
npm install
npm run dev
```

Open `http://localhost:3000` — or your LAN IP from a phone on the same Wi-Fi.

## Adding more names

- **Easiest:** tap the big **+** button on any screen in the app.
- **Bulk:** add entries to `data/seed-names.ts`, then run
  `node scripts/generate-seed-sql.mjs` and re-run the generated SQL in Supabase.

## Project structure

```
app/
  page.tsx                # Login (magic link)
  swipe/                  # Main swipe deck
  matches/                # Matched names + dual ratings
  celebrate/[id]/         # "The One!" celebration
  profile/                # Signed-in user + sign out
components/               # SwipeCard, MatchPopup, StarRating,
                          # FilterSheet, ActiveFilterPills,
                          # AddNameFab, AddNameSheet, BottomNav
lib/
  supabase/{client,server,middleware}.ts
  queries.ts              # All DB access
  filters.ts              # Filter type + localStorage persistence
  types.ts
data/seed-names.ts        # Curated name list (source of truth)
supabase/
  migrations/0001_init.sql
  seed.sql
  setup.sql               # Combined migration + seed — paste into Supabase
```
