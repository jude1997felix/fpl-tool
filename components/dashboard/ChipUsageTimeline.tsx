import type { ChipUsed, HistoryGW } from '@/lib/fpl/types'

const CHIP_LABELS: Record<string, string> = {
  '3xc': 'Triple Captain',
  wildcard: 'Wildcard',
  freehit: 'Free Hit',
  bboost: 'Bench Boost',
}

interface Props {
  chips: ChipUsed[]
  history: HistoryGW[]
}

export default function ChipUsageTimeline({ chips, history }: Props) {
  const gwRange = history.map((h) => h.event)
  const chipMap = Object.fromEntries(chips.map((c) => [c.event, c.name]))

  return (
    <div className="flex gap-1 flex-wrap">
      {gwRange.map((gw) => {
        const chip = chipMap[gw]
        return (
          <div
            key={gw}
            title={chip ? `GW${gw}: ${CHIP_LABELS[chip] ?? chip}` : `GW${gw}`}
            className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold cursor-default transition-colors ${
              chip ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-500'
            }`}
          >
            {gw}
          </div>
        )
      })}
      {chips.length === 0 && (
        <p className="text-slate-500 text-sm">No chips played yet.</p>
      )}
    </div>
  )
}
