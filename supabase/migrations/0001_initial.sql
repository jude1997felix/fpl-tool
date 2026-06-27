-- profiles
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  fpl_team_id integer unique,
  created_at  timestamptz default now()
);
alter table profiles enable row level security;
create policy "own profile" on profiles
  using (auth.uid() = id) with check (auth.uid() = id);

-- tracked_leagues
create table if not exists tracked_leagues (
  id          bigint generated always as identity primary key,
  user_id     uuid references profiles(id) on delete cascade,
  league_id   integer not null,
  league_name text,
  added_at    timestamptz default now(),
  unique (user_id, league_id)
);
alter table tracked_leagues enable row level security;
create policy "own leagues" on tracked_leagues
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- fpl_bootstrap_cache
create table if not exists fpl_bootstrap_cache (
  id            bigint generated always as identity primary key,
  season        text not null,
  fetched_at    timestamptz default now(),
  events        jsonb not null,
  teams         jsonb not null,
  elements      jsonb not null,
  element_types jsonb not null
);
create index if not exists idx_bootstrap_season_time on fpl_bootstrap_cache (season, fetched_at desc);

-- fpl_player_stats
create table if not exists fpl_player_stats (
  player_id                    integer primary key,
  season                       text not null,
  web_name                     text,
  team_id                      integer,
  element_type                 integer,
  now_cost                     integer,
  total_points                 integer,
  event_points                 integer,
  form                         numeric(4,1),
  selected_by_percent          numeric(5,2),
  ep_next                      numeric(5,2),
  minutes                      integer,
  goals_scored                 integer,
  assists                      integer,
  clean_sheets                 integer,
  bps                          integer,
  influence                    numeric(6,1),
  creativity                   numeric(6,1),
  threat                       numeric(6,1),
  ict_index                    numeric(6,1),
  transfers_in_event           integer,
  transfers_out_event          integer,
  status                       text,
  chance_of_playing_next_round integer,
  updated_at                   timestamptz default now()
);

-- fpl_fixtures_cache
create table if not exists fpl_fixtures_cache (
  id               bigint generated always as identity primary key,
  event            integer not null,
  fixture_id       integer not null unique,
  team_h           integer,
  team_a           integer,
  team_h_difficulty integer,
  team_a_difficulty integer,
  kickoff_time     timestamptz,
  finished         boolean,
  team_h_score     integer,
  team_a_score     integer,
  fetched_at       timestamptz default now()
);
create index if not exists idx_fixtures_event on fpl_fixtures_cache (event);

-- fpl_entry_cache
create table if not exists fpl_entry_cache (
  fpl_entry_id  integer not null,
  event         integer not null,
  picks         jsonb,
  active_chip   text,
  points        integer,
  total_points  integer,
  rank          integer,
  fetched_at    timestamptz default now(),
  primary key (fpl_entry_id, event)
);

-- fpl_entry_history_cache
create table if not exists fpl_entry_history_cache (
  fpl_entry_id  integer primary key,
  history       jsonb,
  chips         jsonb,
  fetched_at    timestamptz default now()
);

-- optimizer_squads
create table if not exists optimizer_squads (
  id          bigint generated always as identity primary key,
  user_id     uuid references profiles(id) on delete cascade,
  label       text,
  budget_used integer,
  total_ep    numeric(7,2),
  formation   text,
  squad       jsonb,
  created_at  timestamptz default now()
);
alter table optimizer_squads enable row level security;
create policy "own squads" on optimizer_squads
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
