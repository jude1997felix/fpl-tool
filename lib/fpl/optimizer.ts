'use server'
import type { OptimizerPick, OptimizerResult } from './types'

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

const POSITION_COUNTS = { 1: 2, 2: 5, 3: 5, 4: 3 } as const

function scorePlayers(players: PlayerRow[]) {
  return players.map((p) => ({
    ...p,
    score: p.ep_next * 0.5 + p.form * 0.3 + (p.ict_index / 100) * 0.2,
  }))
}

export async function optimizeSquad(params: {
  players: PlayerRow[]
  budget: number // tenths
  formation: string // e.g. '4-4-2'
  excludeIds?: number[]
  mustIncludeIds?: number[]
}): Promise<OptimizerResult> {
  const { budget, formation, excludeIds = [], mustIncludeIds = [] } = params

  // Parse formation into starting XI position counts
  const [defCount, midCount, fwdCount] = formation.split('-').map(Number)
  const startingCounts: Record<number, number> = {
    1: 1,
    2: defCount,
    3: midCount,
    4: fwdCount,
  }

  const eligible = params.players.filter(
    (p) =>
      !excludeIds.includes(p.player_id) &&
      p.status === 'a' &&
      (p.chance_of_playing_next_round === null || p.chance_of_playing_next_round >= 75)
  )

  const scored = scorePlayers(eligible)
  scored.sort((a, b) => b.score - a.score)

  // Greedily build squad: must-includes first, then fill by score
  const squad: typeof scored = []
  const positionCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  const teamCounts: Record<number, number> = {}
  let budgetUsed = 0

  const mustPlayers = scored.filter((p) => mustIncludeIds.includes(p.player_id))
  const restPlayers = scored.filter((p) => !mustIncludeIds.includes(p.player_id))

  function canAdd(p: typeof scored[0]) {
    if (positionCounts[p.element_type] >= POSITION_COUNTS[p.element_type as keyof typeof POSITION_COUNTS]) return false
    if ((teamCounts[p.team_id] ?? 0) >= 3) return false
    if (budgetUsed + p.now_cost > budget) return false
    return true
  }

  for (const p of mustPlayers) {
    if (canAdd(p)) {
      squad.push(p)
      positionCounts[p.element_type]++
      teamCounts[p.team_id] = (teamCounts[p.team_id] ?? 0) + 1
      budgetUsed += p.now_cost
    }
  }

  for (const p of restPlayers) {
    if (squad.length >= 15) break
    if (canAdd(p)) {
      squad.push(p)
      positionCounts[p.element_type]++
      teamCounts[p.team_id] = (teamCounts[p.team_id] ?? 0) + 1
      budgetUsed += p.now_cost
    }
  }

  // Divide into starting XI vs bench based on formation
  const byPosition: Record<number, typeof scored> = { 1: [], 2: [], 3: [], 4: [] }
  for (const p of squad) byPosition[p.element_type].push(p)

  const startingXI: OptimizerPick[] = []
  const bench: OptimizerPick[] = []

  for (const posType of [1, 2, 3, 4]) {
    const sorted = [...byPosition[posType]].sort((a, b) => b.score - a.score)
    const startCount = startingCounts[posType]
    sorted.forEach((p, i) => {
      const pick: OptimizerPick = {
        player_id: p.player_id,
        web_name: p.web_name,
        team_id: p.team_id,
        element_type: p.element_type,
        now_cost: p.now_cost,
        ep_next: p.ep_next,
        form: p.form,
        score: p.score,
        is_captain: false,
        is_vice_captain: false,
        position: i + 1,
      }
      if (i < startCount) startingXI.push(pick)
      else bench.push(pick)
    })
  }

  // Sort starting XI: GK first, then field by position type
  startingXI.sort((a, b) => a.element_type - b.element_type)
  // Bench: GK first, then by ep_next desc
  bench.sort((a, b) => {
    if (a.element_type === 1) return -1
    if (b.element_type === 1) return 1
    return b.ep_next - a.ep_next
  })

  const allPicks = [...startingXI, ...bench]
  const captainIdx = [...startingXI].sort((a, b) => b.ep_next - a.ep_next)[0]
  const viceCaptainIdx = [...startingXI].sort((a, b) => b.ep_next - a.ep_next)[1]

  allPicks.forEach((p) => {
    p.is_captain = p.player_id === captainIdx?.player_id
    p.is_vice_captain = p.player_id === viceCaptainIdx?.player_id
  })

  const totalEP = startingXI.reduce((sum, p) => {
    if (p.is_captain) return sum + p.ep_next * 2
    return sum + p.ep_next
  }, 0)

  return {
    squad: allPicks,
    startingXI,
    bench,
    captain: captainIdx,
    viceCaptain: viceCaptainIdx,
    totalEP: Math.round(totalEP * 10) / 10,
    budgetUsed,
  }
}
