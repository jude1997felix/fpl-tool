'use server'
import { createClient } from '@/lib/supabase/server'
import { getEntryPicks, getBootstrap } from '@/lib/fpl/cache'
import type { TransferSuggestion } from '@/lib/fpl/types'

interface PlayerRow {
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
  chance_of_playing_next_round: number | null
}

export async function getTransferSuggestions(params: {
  fplEntryId: number
  freeTransfers: number
  itbBudget: number // tenths
}): Promise<TransferSuggestion[]> {
  const { fplEntryId, itbBudget } = params
  const supabase = await createClient()

  const bootstrap = await getBootstrap()
  const currentGW = bootstrap.events.find((e) => e.is_current)?.id ?? 1
  const gwFinished = bootstrap.events.find((e) => e.id === currentGW)?.finished ?? false
  const picks = await getEntryPicks(fplEntryId, currentGW, gwFinished)

  const { data: allPlayers } = await supabase
    .from('fpl_player_stats')
    .select('*')
    .eq('season', '2025-26')

  if (!allPlayers) return []

  const playerMap = new Map<number, PlayerRow>(allPlayers.map((p: PlayerRow) => [p.player_id, p]))
  const currentSquadIds = new Set(picks.picks.map((p) => p.element))

  const myPlayers = picks.picks
    .map((p) => playerMap.get(p.element))
    .filter(Boolean) as PlayerRow[]

  const available = allPlayers.filter(
    (p: PlayerRow) =>
      !currentSquadIds.has(p.player_id) &&
      p.status === 'a' &&
      (p.chance_of_playing_next_round === null || p.chance_of_playing_next_round >= 75)
  )

  const suggestions: TransferSuggestion[] = []

  for (const outPlayer of myPlayers) {
    const budget = outPlayer.now_cost + itbBudget
    const candidates = available.filter(
      (p: PlayerRow) =>
        p.element_type === outPlayer.element_type &&
        p.now_cost <= budget
    )

    for (const inPlayer of candidates) {
      const ep_delta = inPlayer.ep_next - outPlayer.ep_next
      const form_delta = inPlayer.form - outPlayer.form
      const cost_premium = Math.max(0, inPlayer.now_cost - outPlayer.now_cost) / 10
      const fdr_bonus = 0 // would need fixture data
      const delta = ep_delta * 0.5 + form_delta * 0.3 - cost_premium * 0.1

      if (delta > 0) {
        suggestions.push({
          out: { ...outPlayer, score: 0 },
          in: { ...inPlayer, score: 0 },
          delta,
          ep_delta,
          form_delta,
          fdr_bonus,
          cost_premium,
          reasoning: `${inPlayer.web_name} has ${ep_delta > 0 ? '+' : ''}${ep_delta.toFixed(1)} EP advantage and ${form_delta > 0 ? 'better' : 'similar'} form over ${outPlayer.web_name}.`,
        })
      }
    }
  }

  suggestions.sort((a, b) => b.delta - a.delta)
  return suggestions.slice(0, 5)
}
