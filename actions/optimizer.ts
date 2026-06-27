'use server'
import { createClient } from '@/lib/supabase/server'
import { optimizeSquad } from '@/lib/fpl/optimizer'
import type { OptimizerResult } from '@/lib/fpl/types'

export async function generateOptimalSquad(params: {
  budget: number
  formation: string
  excludeIds?: number[]
  mustIncludeIds?: number[]
}): Promise<OptimizerResult> {
  const supabase = await createClient()

  const { data: players, error } = await supabase
    .from('fpl_player_stats')
    .select('*')
    .eq('season', '2025-26')

  if (error || !players?.length) {
    throw new Error('Player data not available. Try refreshing bootstrap first.')
  }

  return optimizeSquad({ players, ...params })
}
