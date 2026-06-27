export interface FplTeam {
  id: number
  name: string
  short_name: string
  code: number
  strength: number
  strength_overall_home: number
  strength_overall_away: number
  strength_attack_home: number
  strength_attack_away: number
  strength_defence_home: number
  strength_defence_away: number
}

export interface FplPlayer {
  id: number
  web_name: string
  first_name: string
  second_name: string
  team: number
  element_type: number // 1=GK 2=DEF 3=MID 4=FWD
  now_cost: number // tenths: 100 = £10.0m
  total_points: number
  event_points: number
  form: string
  selected_by_percent: string
  ep_next: string
  ep_this: string
  minutes: number
  goals_scored: number
  assists: number
  clean_sheets: number
  bps: number
  influence: string
  creativity: string
  threat: string
  ict_index: string
  transfers_in_event: number
  transfers_out_event: number
  status: string // 'a','d','i','s','u'
  chance_of_playing_next_round: number | null
  chance_of_playing_this_round: number | null
  news: string
  code: number
  photo: string
  squad_number: number | null
}

export interface FplGameweek {
  id: number
  name: string
  deadline_time: string
  finished: boolean
  is_current: boolean
  is_next: boolean
  is_previous: boolean
  average_entry_score: number
  highest_score: number
  highest_scoring_entry: number
  transfers_made: number
}

export interface BootstrapStatic {
  events: FplGameweek[]
  teams: FplTeam[]
  elements: FplPlayer[]
  element_types: ElementType[]
  total_players: number
}

export interface ElementType {
  id: number
  plural_name: string
  singular_name: string
  singular_name_short: string
}

export interface FplEntry {
  id: number
  player_first_name: string
  player_last_name: string
  player_region_name: string
  summary_overall_points: number
  summary_overall_rank: number
  summary_event_points: number
  summary_event_rank: number
  name: string // team name
  value: number // team value in tenths
  bank: number // ITB in tenths
  kit: string
  entered_events: number[]
  leagues: {
    classic: LeagueEntry[]
    h2h: LeagueEntry[]
  }
}

export interface LeagueEntry {
  id: number
  name: string
  short_name: string
  entry_rank: number
  entry_last_rank: number
  entry_can_leave: boolean
  entry_can_admin: boolean
}

export interface HistoryGW {
  event: number
  points: number
  total_points: number
  rank: number
  rank_sort: number
  overall_rank: number
  percentile_rank: number
  bank: number
  value: number
  event_transfers: number
  event_transfers_cost: number
  points_on_bench: number
}

export interface ChipUsed {
  name: string
  time: string
  event: number
}

export interface EntryHistory {
  current: HistoryGW[]
  past: { season_name: string; total_points: number; rank: number }[]
  chips: ChipUsed[]
}

export interface EntryPick {
  element: number
  position: number
  multiplier: number
  is_captain: boolean
  is_vice_captain: boolean
  selling_price: number
  purchase_price: number
}

export interface EntryPicks {
  active_chip: string | null
  automatic_subs: unknown[]
  entry_history: {
    event: number
    points: number
    total_points: number
    rank: number
    overall_rank: number
    bank: number
    value: number
    event_transfers: number
    event_transfers_cost: number
    points_on_bench: number
  }
  picks: EntryPick[]
}

export interface LeagueStanding {
  id: number
  entry_name: string
  player_name: string
  rank: number
  last_rank: number
  rank_sort: number
  total: number
  entry: number
  event_total: number
}

export interface LeagueStandings {
  league: {
    id: number
    name: string
    scoring: string
    admin_entry: number
    created: string
    closed: boolean
    max_entries: number | null
    league_type: string
    start_event: number
    code_privacy: string
    rank: number | null
  }
  new_entries: { has_next: boolean; results: unknown[] }
  standings: {
    has_next: boolean
    page: number
    results: LeagueStanding[]
  }
}

export interface Fixture {
  id: number
  code: number
  event: number
  finished: boolean
  finished_provisional: boolean
  kickoff_time: string
  minutes: number
  provisional_start_time: boolean
  started: boolean
  team_a: number
  team_a_score: number | null
  team_h: number
  team_h_score: number | null
  team_h_difficulty: number
  team_a_difficulty: number
  pulse_id: number
}

// Optimizer types
export interface OptimizerPlayer {
  player_id: number
  web_name: string
  team_id: number
  element_type: number
  now_cost: number
  ep_next: number
  form: number
  ict_index: number
  selected_by_percent: number
  status: string
  score: number
}

export interface OptimizerResult {
  squad: OptimizerPick[]
  startingXI: OptimizerPick[]
  bench: OptimizerPick[]
  captain: OptimizerPick
  viceCaptain: OptimizerPick
  totalEP: number
  budgetUsed: number
}

export interface OptimizerPick {
  player_id: number
  web_name: string
  team_id: number
  element_type: number
  now_cost: number
  ep_next: number
  form: number
  score: number
  is_captain: boolean
  is_vice_captain: boolean
  position: number
}

export interface TransferSuggestion {
  out: OptimizerPlayer
  in: OptimizerPlayer
  delta: number
  ep_delta: number
  form_delta: number
  fdr_bonus: number
  cost_premium: number
  reasoning: string
}
