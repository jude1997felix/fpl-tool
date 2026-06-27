import type { Fixture } from '@/lib/fpl/types'

export type FdrLevel = 1 | 2 | 3 | 4 | 5

export function getTeamFdrForNextGWs(
  teamId: number,
  fixturesByGW: Record<number, Fixture[]>,
  startGW: number,
  count = 5
): { gw: number; difficulty: FdrLevel; opponent: number; isHome: boolean }[] {
  const result = []
  for (let gw = startGW; gw < startGW + count; gw++) {
    const gws = fixturesByGW[gw] ?? []
    const fix = gws.find((f) => f.team_h === teamId || f.team_a === teamId)
    if (fix) {
      const isHome = fix.team_h === teamId
      result.push({
        gw,
        difficulty: (isHome ? fix.team_h_difficulty : fix.team_a_difficulty) as FdrLevel,
        opponent: isHome ? fix.team_a : fix.team_h,
        isHome,
      })
    }
  }
  return result
}

export function fdrColor(difficulty: FdrLevel): string {
  const colors: Record<FdrLevel, string> = {
    1: '#00ff85',
    2: '#01fc7a',
    3: '#e7e7e7',
    4: '#ff1751',
    5: '#80072d',
  }
  return colors[difficulty]
}
