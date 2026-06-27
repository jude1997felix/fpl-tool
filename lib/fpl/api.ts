import type {
  BootstrapStatic,
  EntryHistory,
  EntryPicks,
  Fixture,
  FplEntry,
  LeagueStandings,
} from './types'

const BASE = process.env.FPL_API_BASE ?? 'https://fantasy.premierleague.com/api'

async function fplFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'User-Agent': 'fpl-tool/1.0' },
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`FPL API ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

export const fetchBootstrap = () =>
  fplFetch<BootstrapStatic>('/bootstrap-static/')

export const fetchEntry = (id: number) =>
  fplFetch<FplEntry>(`/entry/${id}/`)

export const fetchEntryHistory = (id: number) =>
  fplFetch<EntryHistory>(`/entry/${id}/history/`)

export const fetchEntryPicks = (id: number, gw: number) =>
  fplFetch<EntryPicks>(`/entry/${id}/event/${gw}/picks/`)

export const fetchLeagueStandings = (id: number, page = 1) =>
  fplFetch<LeagueStandings>(`/leagues-classic/${id}/standings/?page_standings=${page}`)

export const fetchFixtures = (gw: number) =>
  fplFetch<Fixture[]>(`/fixtures/?event=${gw}`)
