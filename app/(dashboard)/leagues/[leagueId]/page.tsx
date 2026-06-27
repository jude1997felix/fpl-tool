import { fetchLeagueStandings } from '@/lib/fpl/api'
import StandingsTable from '@/components/leagues/StandingsTable'
import LeagueRankChart from '@/components/leagues/LeagueRankChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function LeaguePage({ params }: { params: Promise<{ leagueId: string }> }) {
  const { leagueId } = await params
  const id = Number(leagueId)

  let standings
  try {
    standings = await fetchLeagueStandings(id)
  } catch {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-4">League not found</h1>
        <Link href="/leagues" className="text-purple-400 hover:underline">← Back to leagues</Link>
      </div>
    )
  }

  const results = standings.standings.results

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/leagues" className="text-slate-400 hover:text-white transition-colors text-sm">← Leagues</Link>
        <span className="text-slate-600">/</span>
        <h1 className="text-2xl font-bold text-white">{standings.league.name}</h1>
      </div>

      <Card className="bg-slate-800/60 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base">Standings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <StandingsTable standings={results} />
        </CardContent>
      </Card>

      <Card className="bg-slate-800/60 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base">League Rank Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm">Rank history requires fetching per-GW picks for each manager. Link your team and track rivals to enable this chart.</p>
        </CardContent>
      </Card>
    </div>
  )
}
