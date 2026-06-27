import { createClient } from '@/lib/supabase/server'
import {
  fetchBootstrap,
  fetchEntryHistory,
  fetchEntryPicks,
  fetchFixtures,
} from './api'
import type { BootstrapStatic, EntryHistory, EntryPicks, Fixture } from './types'

const SEASON = '2025-26'
const BOOTSTRAP_TTL_MS = 60 * 60 * 1000 // 1 hour
const HISTORY_TTL_MS = 15 * 60 * 1000   // 15 min
const PICKS_LIVE_TTL_MS = 5 * 60 * 1000 // 5 min
const PICKS_DONE_TTL_MS = 24 * 60 * 60 * 1000 // 24 h

function isStale(fetchedAt: string, ttlMs: number) {
  return Date.now() - new Date(fetchedAt).getTime() > ttlMs
}

export async function getBootstrap(): Promise<BootstrapStatic> {
  const supabase = await createClient()

  const { data: cached } = await supabase
    .from('fpl_bootstrap_cache')
    .select('*')
    .eq('season', SEASON)
    .order('fetched_at', { ascending: false })
    .limit(1)
    .single()

  if (cached && !isStale(cached.fetched_at, BOOTSTRAP_TTL_MS)) {
    return {
      events: cached.events,
      teams: cached.teams,
      elements: cached.elements,
      element_types: cached.element_types,
      total_players: cached.elements.length,
    } as BootstrapStatic
  }

  const data = await fetchBootstrap()

  await supabase.from('fpl_bootstrap_cache').insert({
    season: SEASON,
    events: data.events,
    teams: data.teams,
    elements: data.elements,
    element_types: data.element_types,
    fetched_at: new Date().toISOString(),
  })

  // Flatten players into fpl_player_stats
  const rows = data.elements.map((p) => ({
    player_id: p.id,
    season: SEASON,
    web_name: p.web_name,
    team_id: p.team,
    element_type: p.element_type,
    now_cost: p.now_cost,
    total_points: p.total_points,
    event_points: p.event_points,
    form: parseFloat(p.form) || 0,
    selected_by_percent: parseFloat(p.selected_by_percent) || 0,
    ep_next: parseFloat(p.ep_next) || 0,
    minutes: p.minutes,
    goals_scored: p.goals_scored,
    assists: p.assists,
    clean_sheets: p.clean_sheets,
    bps: p.bps,
    influence: parseFloat(p.influence) || 0,
    creativity: parseFloat(p.creativity) || 0,
    threat: parseFloat(p.threat) || 0,
    ict_index: parseFloat(p.ict_index) || 0,
    transfers_in_event: p.transfers_in_event,
    transfers_out_event: p.transfers_out_event,
    status: p.status,
    chance_of_playing_next_round: p.chance_of_playing_next_round,
    updated_at: new Date().toISOString(),
  }))

  await supabase
    .from('fpl_player_stats')
    .upsert(rows, { onConflict: 'player_id' })

  return data
}

export async function getEntryHistory(fplId: number): Promise<EntryHistory> {
  const supabase = await createClient()

  const { data: cached } = await supabase
    .from('fpl_entry_history_cache')
    .select('*')
    .eq('fpl_entry_id', fplId)
    .single()

  if (cached && !isStale(cached.fetched_at, HISTORY_TTL_MS)) {
    return { current: cached.history, past: [], chips: cached.chips } as EntryHistory
  }

  const data = await fetchEntryHistory(fplId)

  await supabase.from('fpl_entry_history_cache').upsert({
    fpl_entry_id: fplId,
    history: data.current,
    chips: data.chips,
    fetched_at: new Date().toISOString(),
  })

  return data
}

export async function getEntryPicks(fplId: number, gw: number, gwFinished: boolean): Promise<EntryPicks> {
  const supabase = await createClient()
  const ttl = gwFinished ? PICKS_DONE_TTL_MS : PICKS_LIVE_TTL_MS

  const { data: cached } = await supabase
    .from('fpl_entry_cache')
    .select('*')
    .eq('fpl_entry_id', fplId)
    .eq('event', gw)
    .single()

  if (cached && !isStale(cached.fetched_at, ttl)) {
    return {
      picks: cached.picks,
      active_chip: cached.active_chip,
      entry_history: { event: gw, points: cached.points, total_points: cached.total_points, rank: cached.rank, overall_rank: cached.rank, bank: 0, value: 0, event_transfers: 0, event_transfers_cost: 0, points_on_bench: 0 },
      automatic_subs: [],
    } as EntryPicks
  }

  const data = await fetchEntryPicks(fplId, gw)

  await supabase.from('fpl_entry_cache').upsert({
    fpl_entry_id: fplId,
    event: gw,
    picks: data.picks,
    active_chip: data.active_chip,
    points: data.entry_history?.points ?? 0,
    total_points: data.entry_history?.total_points ?? 0,
    rank: data.entry_history?.rank ?? 0,
    fetched_at: new Date().toISOString(),
  })

  return data
}

export async function getFixtures(gw: number, finished: boolean): Promise<Fixture[]> {
  const supabase = await createClient()

  if (finished) {
    const { data: cached } = await supabase
      .from('fpl_fixtures_cache')
      .select('*')
      .eq('event', gw)
    if (cached && cached.length > 0) {
      return cached.map((f) => ({
        id: f.fixture_id,
        code: f.fixture_id,
        event: f.event,
        finished: f.finished,
        finished_provisional: f.finished,
        kickoff_time: f.kickoff_time,
        minutes: 90,
        provisional_start_time: false,
        started: true,
        team_a: f.team_a,
        team_a_score: f.team_a_score,
        team_h: f.team_h,
        team_h_score: f.team_h_score,
        team_h_difficulty: f.team_h_difficulty,
        team_a_difficulty: f.team_a_difficulty,
        pulse_id: f.fixture_id,
      })) as Fixture[]
    }
  }

  const data = await fetchFixtures(gw)

  await supabase.from('fpl_fixtures_cache').upsert(
    data.map((f) => ({
      event: f.event,
      fixture_id: f.id,
      team_h: f.team_h,
      team_a: f.team_a,
      team_h_difficulty: f.team_h_difficulty,
      team_a_difficulty: f.team_a_difficulty,
      kickoff_time: f.kickoff_time,
      finished: f.finished,
      team_h_score: f.team_h_score,
      team_a_score: f.team_a_score,
      fetched_at: new Date().toISOString(),
    })),
    { onConflict: 'fixture_id' }
  )

  return data
}
