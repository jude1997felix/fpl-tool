import { Badge } from '@/components/ui/badge'
import type { TransferSuggestion } from '@/lib/fpl/types'
import FixtureDifficultyBar from './FixtureDifficultyBar'
import type { FdrLevel } from '@/lib/utils/fixtures'

interface Props {
  suggestion: TransferSuggestion
  outFdr: { gw: number; difficulty: FdrLevel; isHome: boolean }[]
  inFdr: { gw: number; difficulty: FdrLevel; isHome: boolean }[]
  rank: number
}

const POS_LABELS: Record<number, string> = { 1: 'GK', 2: 'DEF', 3: 'MID', 4: 'FWD' }

export default function TransferSuggestionCard({ suggestion, outFdr, inFdr, rank }: Props) {
  const { out, in: inPlayer, delta, ep_delta } = suggestion

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-purple-700 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
          {rank}
        </span>
        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
          {POS_LABELS[out.element_type]}
        </Badge>
        <span className={`ml-auto text-sm font-bold ${delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {delta > 0 ? '+' : ''}{delta.toFixed(1)} score
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* OUT */}
        <div className="flex-1 bg-red-900/20 border border-red-800/40 rounded-lg p-3">
          <div className="text-xs text-red-400 font-medium mb-1">OUT</div>
          <div className="font-bold text-white">{out.web_name}</div>
          <div className="text-slate-400 text-xs">£{(out.now_cost / 10).toFixed(1)}m · EP {out.ep_next.toFixed(1)}</div>
          <div className="mt-2">
            <FixtureDifficultyBar fixtures={outFdr} />
          </div>
        </div>

        <div className="text-slate-500 text-xl">→</div>

        {/* IN */}
        <div className="flex-1 bg-green-900/20 border border-green-800/40 rounded-lg p-3">
          <div className="text-xs text-green-400 font-medium mb-1">IN</div>
          <div className="font-bold text-white">{inPlayer.web_name}</div>
          <div className="text-slate-400 text-xs">£{(inPlayer.now_cost / 10).toFixed(1)}m · EP {inPlayer.ep_next.toFixed(1)}</div>
          <div className="mt-2">
            <FixtureDifficultyBar fixtures={inFdr} />
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-400 bg-slate-900/50 rounded-lg p-2">
        {suggestion.reasoning}
      </div>

      <div className="flex gap-4 mt-3 text-xs text-slate-500">
        <span>EP delta: <span className={ep_delta > 0 ? 'text-green-400' : 'text-red-400'}>{ep_delta > 0 ? '+' : ''}{ep_delta.toFixed(2)}</span></span>
        <span>Cost: <span className="text-white">£{((inPlayer.now_cost - out.now_cost) / 10).toFixed(1)}m</span></span>
        <span>Ownership: <span className="text-white">{inPlayer.selected_by_percent.toFixed(1)}%</span></span>
      </div>
    </div>
  )
}
