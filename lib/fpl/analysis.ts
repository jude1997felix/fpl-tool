import type { HistoryGW, ChipUsed } from './types'

export interface SeasonInsight {
  icon: string
  title: string
  body: string
  type: 'good' | 'bad' | 'neutral' | 'tip'
}

export function buildInsights(
  history: HistoryGW[],
  chips: ChipUsed[],
  averages: Record<number, number>
): SeasonInsight[] {
  if (!history.length) return []

  const insights: SeasonInsight[] = []
  const totalBench = history.reduce((s, g) => s + g.points_on_bench, 0)
  const totalHits = history.reduce((s, g) => s + g.event_transfers_cost, 0)
  const avg = history.reduce((s, g) => s + g.points, 0) / history.length
  const gwsAboveAvg = history.filter((g) => g.points > (averages[g.event] ?? 0)).length
  const gwsBelowAvg = history.length - gwsAboveAvg

  // Bench points
  if (totalBench > 60) {
    insights.push({
      icon: '🪑',
      title: `${totalBench} points left on the bench`,
      body: `You left a significant amount on the bench this season. Consider using Bench Boost in a double gameweek to recover some of these points.`,
      type: 'bad',
    })
  } else if (totalBench > 0) {
    insights.push({
      icon: '🪑',
      title: `${totalBench} points left on the bench`,
      body: `You managed your bench reasonably well this season.`,
      type: 'neutral',
    })
  }

  // Transfer hits
  if (totalHits >= 20) {
    insights.push({
      icon: '🔄',
      title: `${totalHits} points lost to transfer hits`,
      body: `That's ${Math.floor(totalHits / 4)} hits taken. Hits are only worth it when the player you're bringing in scores 4+ more points than the one going out. Plan transfers earlier to avoid panic hits.`,
      type: 'bad',
    })
  } else if (totalHits > 0) {
    insights.push({
      icon: '🔄',
      title: `${totalHits} points lost to transfer hits`,
      body: `A relatively controlled use of hits. Just make sure each hit was planned and not reactive.`,
      type: 'neutral',
    })
  } else {
    insights.push({
      icon: '✅',
      title: 'No transfer hits taken',
      body: `You played the entire season without taking a hit — excellent discipline with your free transfers.`,
      type: 'good',
    })
  }

  // GW performance vs average
  const pct = Math.round((gwsAboveAvg / history.length) * 100)
  if (pct >= 60) {
    insights.push({
      icon: '📈',
      title: `Beat the GW average ${pct}% of the time`,
      body: `You finished above the gameweek average in ${gwsAboveAvg} out of ${history.length} gameweeks — a strong consistency rate.`,
      type: 'good',
    })
  } else if (pct < 45) {
    insights.push({
      icon: '📉',
      title: `Only beat the GW average ${pct}% of the time`,
      body: `You finished below average in ${gwsBelowAvg} gameweeks. Look at those weeks specifically — were fixtures bad, or were captaincy choices the issue?`,
      type: 'bad',
    })
  }

  // Identify streaks of bad weeks
  const badStreak = findLongestStreak(history, averages, 'below')
  if (badStreak.length >= 3) {
    insights.push({
      icon: '📊',
      title: `${badStreak.length}-week below-average streak (GW${badStreak[0]}–GW${badStreak[badStreak.length - 1]})`,
      body: `Your biggest slump was ${badStreak.length} consecutive gameweeks below the average. This is often a sign of fixture swings or an over-reliance on players from one team.`,
      type: 'bad',
    })
  }

  const goodStreak = findLongestStreak(history, averages, 'above')
  if (goodStreak.length >= 3) {
    insights.push({
      icon: '🔥',
      title: `${goodStreak.length}-week above-average streak (GW${goodStreak[0]}–GW${goodStreak[goodStreak.length - 1]})`,
      body: `Your best run was ${goodStreak.length} consecutive gameweeks above average. Identify what you had in your team during this period — those player types are worth targeting again.`,
      type: 'good',
    })
  }

  // Chip usage
  const chipNames = chips.map((c) => c.name)
  if (!chipNames.includes('wildcard')) {
    insights.push({
      icon: '🃏',
      title: 'Wildcard not used',
      body: `You didn't use a Wildcard this season. The Wildcard is one of the most powerful chips — using it at the right time after a bad run or before a good fixture swing can recover a lot of points.`,
      type: 'tip',
    })
  }
  if (!chipNames.includes('bboost')) {
    insights.push({
      icon: '💺',
      title: 'Bench Boost not used',
      body: `Bench Boost was unused. It's most effective in a double gameweek when your bench players also have fixtures. Plan it for DGW weeks next season.`,
      type: 'tip',
    })
  }
  if (!chipNames.includes('3xc')) {
    insights.push({
      icon: '🎯',
      title: 'Triple Captain not used',
      body: `Triple Captain wasn't played. Best used in a double gameweek on a premium captain option with two good fixtures.`,
      type: 'tip',
    })
  }

  // Highest bench week — missed opportunity
  const highestBenchGW = [...history].sort((a, b) => b.points_on_bench - a.points_on_bench)[0]
  if (highestBenchGW?.points_on_bench >= 20) {
    insights.push({
      icon: '😬',
      title: `GW${highestBenchGW.event}: ${highestBenchGW.points_on_bench} pts left on bench`,
      body: `Your worst bench week — you left ${highestBenchGW.points_on_bench} points on the bench. This could have been avoided with a better bench order or saved for a Bench Boost opportunity.`,
      type: 'bad',
    })
  }

  // Overall average vs global
  if (avg > 60) {
    insights.push({
      icon: '⭐',
      title: `Strong average of ${avg.toFixed(1)} pts/GW`,
      body: `Averaging over 60 points per gameweek is well above the typical FPL manager. Your consistency is your biggest asset.`,
      type: 'good',
    })
  }

  return insights
}

function findLongestStreak(
  history: HistoryGW[],
  averages: Record<number, number>,
  direction: 'above' | 'below'
): number[] {
  let best: number[] = []
  let current: number[] = []

  for (const gw of history) {
    const gwAvg = averages[gw.event] ?? 0
    const qualifies = direction === 'above' ? gw.points > gwAvg : gw.points < gwAvg
    if (qualifies) {
      current.push(gw.event)
      if (current.length > best.length) best = [...current]
    } else {
      current = []
    }
  }
  return best
}
