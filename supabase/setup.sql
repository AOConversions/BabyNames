-- Baby Names app schema + policies
-- Run in Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

create table if not exists public.names (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  gender text not null check (gender in ('girl','boy','unisex')),
  origin text,
  meaning text,
  added_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (name, gender)
);

create table if not exists public.swipes (
  user_id uuid not null references auth.users(id) on delete cascade,
  name_id uuid not null references public.names(id) on delete cascade,
  liked boolean not null,
  created_at timestamptz not null default now(),
  primary key (user_id, name_id)
);

create table if not exists public.ratings (
  user_id uuid not null references auth.users(id) on delete cascade,
  name_id uuid not null references public.names(id) on delete cascade,
  stars int not null check (stars between 1 and 5),
  updated_at timestamptz not null default now(),
  primary key (user_id, name_id)
);

create or replace view public.matches as
select n.*
from public.names n
where (
  select count(*) from public.swipes s
  where s.name_id = n.id and s.liked = true
) >= 2;

-- RLS
alter table public.names enable row level security;
alter table public.swipes enable row level security;
alter table public.ratings enable row level security;

drop policy if exists "names: read all authenticated" on public.names;
create policy "names: read all authenticated" on public.names
  for select to authenticated using (true);

drop policy if exists "names: insert own" on public.names;
create policy "names: insert own" on public.names
  for insert to authenticated
  with check (added_by = auth.uid());

drop policy if exists "swipes: read own" on public.swipes;
create policy "swipes: read own" on public.swipes
  for select to authenticated using (user_id = auth.uid());

-- Allow counting matches across users without leaking who swiped what
drop policy if exists "swipes: read for match counts" on public.swipes;
create policy "swipes: read for match counts" on public.swipes
  for select to authenticated using (liked = true);

drop policy if exists "swipes: insert own" on public.swipes;
create policy "swipes: insert own" on public.swipes
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "swipes: update own" on public.swipes;
create policy "swipes: update own" on public.swipes
  for update to authenticated using (user_id = auth.uid());

drop policy if exists "ratings: read all authenticated" on public.ratings;
create policy "ratings: read all authenticated" on public.ratings
  for select to authenticated using (true);

drop policy if exists "ratings: upsert own" on public.ratings;
create policy "ratings: upsert own" on public.ratings
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "ratings: update own" on public.ratings;
create policy "ratings: update own" on public.ratings
  for update to authenticated using (user_id = auth.uid());

-- ============================================================
-- SEED DATA (209 curated names)
-- ============================================================

insert into public.names (name, gender, origin, meaning) values
  ('Aurora', 'girl', 'Latin', 'Dawn'),
  ('Amelia', 'girl', 'Germanic', 'Work'),
  ('Ava', 'girl', 'Latin', 'Bird, life'),
  ('Astrid', 'girl', 'Scandinavian', 'Divinely beautiful'),
  ('Beatrice', 'girl', 'Latin', 'She who brings happiness'),
  ('Camila', 'girl', 'Spanish', 'Young ceremonial attendant'),
  ('Charlotte', 'girl', 'French', 'Free one'),
  ('Chloe', 'girl', 'Greek', 'Blooming'),
  ('Clara', 'girl', 'Latin', 'Bright, clear'),
  ('Cora', 'girl', 'Greek', 'Maiden'),
  ('Daisy', 'girl', 'English', 'Day''s eye'),
  ('Delilah', 'girl', 'Hebrew', 'Delicate'),
  ('Eleanor', 'girl', 'Greek', 'Shining light'),
  ('Elena', 'girl', 'Greek', 'Bright, shining light'),
  ('Eliza', 'girl', 'Hebrew', 'Pledged to God'),
  ('Ella', 'girl', 'Germanic', 'All, completely'),
  ('Ellie', 'girl', 'English', 'Light'),
  ('Emma', 'girl', 'Germanic', 'Whole, universal'),
  ('Esme', 'girl', 'French', 'Beloved'),
  ('Evangeline', 'girl', 'Greek', 'Bearer of good news'),
  ('Evelyn', 'girl', 'English', 'Wished-for child'),
  ('Fiona', 'girl', 'Irish', 'Fair, white'),
  ('Freya', 'girl', 'Scandinavian', 'Noble lady'),
  ('Gemma', 'girl', 'Italian', 'Precious stone'),
  ('Genevieve', 'girl', 'French', 'Tribe woman'),
  ('Grace', 'girl', 'Latin', 'Charm, grace'),
  ('Hannah', 'girl', 'Hebrew', 'Grace, favor'),
  ('Harper', 'girl', 'English', 'Harp player'),
  ('Hazel', 'girl', 'English', 'The hazelnut tree'),
  ('Imogen', 'girl', 'Celtic', 'Maiden'),
  ('Iris', 'girl', 'Greek', 'Rainbow'),
  ('Isabella', 'girl', 'Hebrew', 'Devoted to God'),
  ('Isla', 'girl', 'Scottish', 'Island'),
  ('Ivy', 'girl', 'English', 'Faithfulness'),
  ('Jade', 'girl', 'Spanish', 'Stone of the side'),
  ('Josephine', 'girl', 'Hebrew', 'God will add'),
  ('Julia', 'girl', 'Latin', 'Youthful'),
  ('Juniper', 'girl', 'Latin', 'Young'),
  ('Kaia', 'girl', 'Scandinavian', 'Earth'),
  ('Lana', 'girl', 'Slavic', 'Light'),
  ('Layla', 'girl', 'Arabic', 'Night'),
  ('Leah', 'girl', 'Hebrew', 'Weary'),
  ('Lila', 'girl', 'Arabic', 'Night'),
  ('Lily', 'girl', 'English', 'Pure, the flower'),
  ('Lucia', 'girl', 'Latin', 'Light'),
  ('Lucy', 'girl', 'Latin', 'Light'),
  ('Luna', 'girl', 'Latin', 'Moon'),
  ('Maeve', 'girl', 'Irish', 'She who intoxicates'),
  ('Maisie', 'girl', 'Scottish', 'Pearl'),
  ('Margot', 'girl', 'French', 'Pearl'),
  ('Maya', 'girl', 'Sanskrit', 'Illusion, dream'),
  ('Mia', 'girl', 'Italian', 'Mine'),
  ('Mila', 'girl', 'Slavic', 'Gracious, dear'),
  ('Nora', 'girl', 'Irish', 'Light'),
  ('Olivia', 'girl', 'Latin', 'Olive tree'),
  ('Opal', 'girl', 'Sanskrit', 'Jewel'),
  ('Penelope', 'girl', 'Greek', 'Weaver'),
  ('Phoebe', 'girl', 'Greek', 'Radiant, shining'),
  ('Poppy', 'girl', 'English', 'Red flower'),
  ('Rose', 'girl', 'Latin', 'The flower'),
  ('Ruby', 'girl', 'Latin', 'Red gemstone'),
  ('Sadie', 'girl', 'Hebrew', 'Princess'),
  ('Sage', 'girl', 'Latin', 'Wise one'),
  ('Sienna', 'girl', 'Italian', 'Orange-red'),
  ('Sofia', 'girl', 'Greek', 'Wisdom'),
  ('Stella', 'girl', 'Latin', 'Star'),
  ('Tessa', 'girl', 'Greek', 'Harvester'),
  ('Thea', 'girl', 'Greek', 'Goddess'),
  ('Violet', 'girl', 'Latin', 'Purple flower'),
  ('Vivienne', 'girl', 'French', 'Alive'),
  ('Willa', 'girl', 'Germanic', 'Resolute protection'),
  ('Willow', 'girl', 'English', 'Willow tree'),
  ('Wren', 'girl', 'English', 'Small bird'),
  ('Zoe', 'girl', 'Greek', 'Life'),
  ('Amara', 'girl', 'African', 'Grace'),
  ('Anya', 'girl', 'Slavic', 'Grace'),
  ('Noor', 'girl', 'Arabic', 'Light'),
  ('Saoirse', 'girl', 'Irish', 'Freedom'),
  ('Aaliyah', 'girl', 'Arabic', 'Exalted'),
  ('Anika', 'girl', 'Sanskrit', 'Grace'),
  ('Suri', 'girl', 'Hebrew', 'Princess'),
  ('Yuki', 'girl', 'Japanese', 'Snow'),
  ('Sakura', 'girl', 'Japanese', 'Cherry blossom'),
  ('Kira', 'girl', 'Japanese', 'Glitter, shine'),
  ('Aaron', 'boy', 'Hebrew', 'Exalted, strong'),
  ('Adrian', 'boy', 'Latin', 'Son of Adria'),
  ('Alexander', 'boy', 'Greek', 'Defender of men'),
  ('Arlo', 'boy', 'Old English', 'Fortified hill'),
  ('Asher', 'boy', 'Hebrew', 'Happy, blessed'),
  ('Atlas', 'boy', 'Greek', 'To carry, endure'),
  ('August', 'boy', 'Latin', 'Great, magnificent'),
  ('Austin', 'boy', 'Latin', 'Majestic dignity'),
  ('Axel', 'boy', 'Scandinavian', 'Father of peace'),
  ('Beckett', 'boy', 'English', 'Bee cottage, stream'),
  ('Benjamin', 'boy', 'Hebrew', 'Son of the right hand'),
  ('Bodhi', 'boy', 'Sanskrit', 'Awakening, enlightenment'),
  ('Caleb', 'boy', 'Hebrew', 'Whole-hearted'),
  ('Callum', 'boy', 'Scottish', 'Dove'),
  ('Cameron', 'boy', 'Scottish', 'Crooked nose'),
  ('Charlie', 'boy', 'English', 'Free one'),
  ('Cillian', 'boy', 'Irish', 'War, strife'),
  ('Cole', 'boy', 'English', 'Coal, dark'),
  ('Conor', 'boy', 'Irish', 'Lover of hounds'),
  ('Cyrus', 'boy', 'Persian', 'Sun'),
  ('Daniel', 'boy', 'Hebrew', 'God is my judge'),
  ('Declan', 'boy', 'Irish', 'Man of prayer'),
  ('Desmond', 'boy', 'Irish', 'From South Munster'),
  ('Dominic', 'boy', 'Latin', 'Belonging to the Lord'),
  ('Eden', 'boy', 'Hebrew', 'Place of pleasure'),
  ('Edward', 'boy', 'English', 'Wealthy guardian'),
  ('Eli', 'boy', 'Hebrew', 'Ascended, uplifted'),
  ('Elias', 'boy', 'Hebrew', 'The Lord is my God'),
  ('Ellis', 'boy', 'Welsh', 'Benevolent'),
  ('Emilio', 'boy', 'Italian', 'Rival'),
  ('Emmett', 'boy', 'Germanic', 'Universal, truth'),
  ('Ethan', 'boy', 'Hebrew', 'Strong, enduring'),
  ('Ezra', 'boy', 'Hebrew', 'Helper'),
  ('Felix', 'boy', 'Latin', 'Happy, fortunate'),
  ('Finn', 'boy', 'Irish', 'Fair'),
  ('Finley', 'boy', 'Scottish', 'Fair-haired hero'),
  ('Gabriel', 'boy', 'Hebrew', 'God is my strength'),
  ('George', 'boy', 'Greek', 'Farmer, earth-worker'),
  ('Graham', 'boy', 'English', 'Gravelly homestead'),
  ('Grayson', 'boy', 'English', 'Son of the steward'),
  ('Gus', 'boy', 'Latin', 'Great'),
  ('Harrison', 'boy', 'English', 'Son of Harry'),
  ('Henry', 'boy', 'Germanic', 'Ruler of the home'),
  ('Holden', 'boy', 'English', 'Hollow valley'),
  ('Hudson', 'boy', 'English', 'Son of Hugh'),
  ('Hugo', 'boy', 'Germanic', 'Mind, intellect'),
  ('Ian', 'boy', 'Scottish', 'God is gracious'),
  ('Isaac', 'boy', 'Hebrew', 'He will laugh'),
  ('Jack', 'boy', 'English', 'God is gracious'),
  ('James', 'boy', 'Hebrew', 'Supplanter'),
  ('Jasper', 'boy', 'Persian', 'Treasurer'),
  ('Julian', 'boy', 'Latin', 'Youthful'),
  ('Kai', 'boy', 'Hawaiian', 'Sea'),
  ('Kieran', 'boy', 'Irish', 'Little dark one'),
  ('Leo', 'boy', 'Latin', 'Lion'),
  ('Levi', 'boy', 'Hebrew', 'Joined, attached'),
  ('Liam', 'boy', 'Irish', 'Strong-willed warrior'),
  ('Lincoln', 'boy', 'English', 'Lake settlement'),
  ('Lucas', 'boy', 'Latin', 'Light'),
  ('Luka', 'boy', 'Slavic', 'From Lucania'),
  ('Mateo', 'boy', 'Spanish', 'Gift of God'),
  ('Matthias', 'boy', 'Hebrew', 'Gift of God'),
  ('Maverick', 'boy', 'English', 'Independent'),
  ('Max', 'boy', 'Latin', 'Greatest'),
  ('Micah', 'boy', 'Hebrew', 'Who is like God'),
  ('Miles', 'boy', 'Latin', 'Soldier, merciful'),
  ('Milo', 'boy', 'Germanic', 'Soldier, merciful'),
  ('Nathan', 'boy', 'Hebrew', 'He gave'),
  ('Noah', 'boy', 'Hebrew', 'Rest, comfort'),
  ('Oliver', 'boy', 'Latin', 'Olive tree'),
  ('Orion', 'boy', 'Greek', 'Son of fire, hunter'),
  ('Oscar', 'boy', 'Irish', 'Deer-lover, friend'),
  ('Owen', 'boy', 'Welsh', 'Young warrior'),
  ('Patrick', 'boy', 'Latin', 'Noble'),
  ('Peter', 'boy', 'Greek', 'Rock'),
  ('Rafael', 'boy', 'Hebrew', 'God has healed'),
  ('Ronan', 'boy', 'Irish', 'Little seal'),
  ('Rowan', 'boy', 'Irish', 'Little red-haired one'),
  ('Ryder', 'boy', 'English', 'Horseman'),
  ('Samuel', 'boy', 'Hebrew', 'Heard by God'),
  ('Sebastian', 'boy', 'Greek', 'Venerable'),
  ('Silas', 'boy', 'Latin', 'Of the forest'),
  ('Soren', 'boy', 'Scandinavian', 'Stern'),
  ('Theo', 'boy', 'Greek', 'Gift of God'),
  ('Theodore', 'boy', 'Greek', 'Gift of God'),
  ('Thomas', 'boy', 'Aramaic', 'Twin'),
  ('Tobias', 'boy', 'Hebrew', 'God is good'),
  ('Wesley', 'boy', 'English', 'Western meadow'),
  ('William', 'boy', 'Germanic', 'Resolute protector'),
  ('Xavier', 'boy', 'Basque', 'New house'),
  ('Zayd', 'boy', 'Arabic', 'Abundance'),
  ('Haruki', 'boy', 'Japanese', 'Shining'),
  ('Ren', 'boy', 'Japanese', 'Lotus'),
  ('Kenji', 'boy', 'Japanese', 'Strong, vigorous'),
  ('Idris', 'boy', 'Welsh', 'Ardent lord'),
  ('Malachi', 'boy', 'Hebrew', 'My messenger'),
  ('Avery', 'unisex', 'English', 'Ruler of elves'),
  ('Blake', 'unisex', 'English', 'Fair-haired'),
  ('Cameron', 'unisex', 'Scottish', 'Crooked nose'),
  ('Casey', 'unisex', 'Irish', 'Brave in battle'),
  ('Dakota', 'unisex', 'Native American', 'Friend, ally'),
  ('Elliot', 'unisex', 'Hebrew', 'The Lord is my God'),
  ('Emerson', 'unisex', 'English', 'Brave, powerful'),
  ('Finley', 'unisex', 'Scottish', 'Fair-haired hero'),
  ('Hayden', 'unisex', 'English', 'Heather-grown hill'),
  ('Jordan', 'unisex', 'Hebrew', 'To flow down'),
  ('Juno', 'unisex', 'Latin', 'Queen of heaven'),
  ('Kai', 'unisex', 'Hawaiian', 'Sea'),
  ('Lennon', 'unisex', 'Irish', 'Little cloak'),
  ('Logan', 'unisex', 'Scottish', 'Little hollow'),
  ('Morgan', 'unisex', 'Welsh', 'Sea-born'),
  ('Parker', 'unisex', 'English', 'Park keeper'),
  ('Phoenix', 'unisex', 'Greek', 'Rising bird'),
  ('Quinn', 'unisex', 'Irish', 'Wise, intelligent'),
  ('Reese', 'unisex', 'Welsh', 'Enthusiasm'),
  ('Remy', 'unisex', 'French', 'Oarsman'),
  ('River', 'unisex', 'English', 'Flowing body of water'),
  ('Robin', 'unisex', 'English', 'Bright fame'),
  ('Rowan', 'unisex', 'Irish', 'Little red-haired one'),
  ('Sage', 'unisex', 'Latin', 'Wise one'),
  ('Sawyer', 'unisex', 'English', 'Woodcutter'),
  ('Skyler', 'unisex', 'Dutch', 'Scholar'),
  ('Sloan', 'unisex', 'Irish', 'Raider'),
  ('Tatum', 'unisex', 'English', 'Cheerful bringer of joy'),
  ('Wren', 'unisex', 'English', 'Small bird')
on conflict (name, gender) do nothing;
