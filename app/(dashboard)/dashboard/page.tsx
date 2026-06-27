import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBootstrap, getEntryHistory } from '@/lib/fpl/cache'
import { fetchEntry } from '@/lib/fpl/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TeamSummaryCard from '@/components/dashboard/TeamSummaryCard'
import PointsHistoryChart from '@/components/dashboard/PointsHistoryChart'
import RankChart from '@/components/dashboard/RankChart'
import CaptainLog from '@/components/dashboard/CaptainLog'
import ChipUsageTimeline from '@/components/dashboard/ChipUsageTimeline'
import FplIdLinkFormWrapper from '@/components/shared/FplIdLinkFormWrapper'

export default async function DashboardPage() {
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
      <div className="p-8 max-w-2xl">
        <PageHeader title="Dashboard" sub="Your season at a glance" />
        <FplIdLinkFormWrapper />
      </div>
    )
  }

  const [entry, history, bootstrap] = await Promise.all([
    fetchEntry(profile.fpl_team_id),
    getEntryHistory(profile.fpl_team_id),
    getBootstrap(),
  ])

  const averages = Object.fromEntries(
    bootstrap.events.filter((e) => e.finished).map((e) => [e.id, e.average_entry_score])
  )

  const captainEntries = history.current.map((gw) => ({
    gw: gw.event,
    playerName: '—',
    points: gw.points,
    captainPoints: 0,
  }))

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <PageHeader title="Dashboard" sub="Your season at a glance" />

      <TeamSummaryCard
        teamName={entry.name}
        managerName={`${entry.player_first_name} ${entry.player_last_name}`}
        gwPoints={entry.summary_event_points}
        totalPoints={entry.summary_overall_points}
        overallRank={entry.summary_overall_rank}
        teamValue={entry.value}
        itb={entry.bank}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Points per Gameweek">
          <PointsHistoryChart history={history.current} averages={averages} />
        </SectionCard>
        <SectionCard title="Overall Rank">
          <RankChart history={history.current} />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Chip Usage">
          <ChipUsageTimeline chips={history.chips} history={history.current} />
        </SectionCard>
        <SectionCard title="Captain Log">
          <CaptainLog entries={captainEntries} />
        </SectionCard>
      </div>
    </div>
  )
}

function PageHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="pt-2 pb-1">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5 border border-white/5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">{title}</p>
      {children}
    </div>
  )
}
