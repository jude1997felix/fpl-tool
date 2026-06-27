import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBootstrap, getEntryHistory } from '@/lib/fpl/cache'
import { buildInsights } from '@/lib/fpl/analysis'
import SeasonSummaryStats from '@/components/analysis/SeasonSummaryStats'
import PointsPatternChart from '@/components/analysis/PointsPatternChart'
import InsightCard from '@/components/analysis/InsightCard'
import PastSeasonsTable from '@/components/analysis/PastSeasonsTable'

export default async function AnalysisPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('fpl_team_id')
    .eq('id', user.id)
    .single()

  if (!profile?.fpl_team_id) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-4">Season Analysis</h1>
        <p className="text-muted-foreground text-sm">Link your FPL team on the Dashboard first.</p>
      </div>
    )
  }

  const [history, bootstrap] = await Promise.all([
    getEntryHistory(profile.fpl_team_id),
    getBootstrap(),
  ])

  const current = history.current
  const averages = Object.fromEntries(
    bootstrap.events.filter((e) => e.finished).map((e) => [e.id, e.average_entry_score])
  )

  const totalPoints   = current.at(-1)?.total_points ?? 0
  const overallRank   = current.at(-1)?.overall_rank ?? 0
  const benchPointsLost = current.reduce((s, g) => s + g.points_on_bench, 0)
  const transferHitCost = current.reduce((s, g) => s + g.event_transfers_cost, 0)
  const sorted  = [...current].sort((a, b) => b.points - a.points)
  const bestGW  = sorted[0]  ?? { event: 0, points: 0 }
  const worstGW = sorted.at(-1) ?? { event: 0, points: 0 }
  const avgPoints     = current.length ? current.reduce((s, g) => s + g.points, 0) / current.length : 0
  const gwsAboveAvg   = current.filter((g) => g.points > (averages[g.event] ?? 0)).length
  const insights      = buildInsights(current, history.chips, averages)

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <div className="pt-2 pb-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Season Analysis</h1>
        <p className="text-sm text-muted-foreground mt-0.5">What worked, what didn&apos;t, and how to improve</p>
      </div>

      <SeasonSummaryStats
        totalPoints={totalPoints} overallRank={overallRank}
        benchPointsLost={benchPointsLost} transferHitCost={transferHitCost}
        bestGW={bestGW} worstGW={worstGW}
        avgPoints={avgPoints} gwsAboveAvg={gwsAboveAvg} totalGWs={current.length}
      />

      <div className="glass rounded-2xl p-5 border border-white/5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Points vs GW Average</p>
        <p className="text-[11px] text-muted-foreground mb-4">Blue = your points · Amber = bench · Green dashed = GW average</p>
        {current.length > 0
          ? <PointsPatternChart history={current} averages={averages} />
          : <p className="text-muted-foreground text-sm py-8 text-center">No gameweek data yet.</p>
        }
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Key Insights</p>
        {insights.length > 0 ? (
          <div className="space-y-2">
            {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Complete more gameweeks to unlock insights.</p>
        )}
      </div>

      {history.past.length > 0 && (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Past Seasons</p>
          </div>
          <PastSeasonsTable seasons={history.past} />
        </div>
      )}
    </div>
  )
}
