import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTransferSuggestions } from '@/actions/transfers'
import { getBootstrap, getFixtures } from '@/lib/fpl/cache'
import { getTeamFdrForNextGWs } from '@/lib/utils/fixtures'
import TransferSuggestionCard from '@/components/transfers/TransferSuggestionCard'
import type { FdrLevel } from '@/lib/utils/fixtures'

export default async function TransfersPage() {
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
        <h1 className="text-2xl font-bold text-white mb-4">Transfer Planner</h1>
        <p className="text-slate-400">Link your FPL team on the Dashboard first.</p>
      </div>
    )
  }

  const bootstrap = await getBootstrap()
  const currentGW = bootstrap.events.find((e) => e.is_current)?.id ?? 1
  const nextGW = bootstrap.events.find((e) => e.is_next)?.id ?? currentGW + 1

  const [suggestions, fixtures] = await Promise.all([
    getTransferSuggestions({ fplEntryId: profile.fpl_team_id, freeTransfers: 1, itbBudget: 0 }),
    getFixtures(nextGW, false).catch(() => []),
  ])

  const fixturesByGW: Record<number, typeof fixtures> = { [nextGW]: fixtures }

  const teamMap = Object.fromEntries(bootstrap.teams.map((t) => [t.id, t.short_name]))

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Transfer Planner</h1>
        <p className="text-slate-400 text-sm mt-1">Top 5 recommended transfers for GW{nextGW}</p>
      </div>

      {suggestions.length === 0 ? (
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-10 text-center text-slate-500">
          No transfer suggestions found. Your squad looks well-optimized!
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((s, i) => {
            const outFdr = getTeamFdrForNextGWs(s.out.team_id, fixturesByGW, nextGW, 5)
            const inFdr = getTeamFdrForNextGWs(s.in.team_id, fixturesByGW, nextGW, 5)
            return (
              <TransferSuggestionCard
                key={i}
                suggestion={s}
                outFdr={outFdr as { gw: number; difficulty: FdrLevel; isHome: boolean }[]}
                inFdr={inFdr as { gw: number; difficulty: FdrLevel; isHome: boolean }[]}
                rank={i + 1}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
