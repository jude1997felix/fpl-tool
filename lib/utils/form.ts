import type { HistoryGW } from '@/lib/fpl/types'

export function rollingForm(history: HistoryGW[], lastN = 6): number {
  const recent = history.slice(-lastN)
  if (!recent.length) return 0
  return recent.reduce((sum, gw) => sum + gw.points, 0) / recent.length
}
