import type { LeagueStanding } from '@/lib/fpl/types'

interface Props {
  standings: LeagueStanding[]
  onSelectRival?: (standing: LeagueStanding) => void
}

export default function StandingsTable({ standings, onSelectRival }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-slate-700 text-left">
            <th className="py-2 px-3 w-12">Rank</th>
            <th className="py-2 px-3">Manager</th>
            <th className="py-2 px-3">Team</th>
            <th className="py-2 px-3 text-right">GW</th>
            <th className="py-2 px-3 text-right">Total</th>
            <th className="py-2 px-3 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s) => {
            const moved = s.last_rank - s.rank
            return (
              <tr key={s.entry} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-white">{s.rank}</span>
                    {moved > 0 && <span className="text-green-400 text-xs">↑{moved}</span>}
                    {moved < 0 && <span className="text-red-400 text-xs">↓{Math.abs(moved)}</span>}
                    {moved === 0 && <span className="text-slate-600 text-xs">—</span>}
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-300">{s.player_name}</td>
                <td className="py-3 px-3 text-white font-medium">{s.entry_name}</td>
                <td className="py-3 px-3 text-right text-white font-semibold">{s.event_total}</td>
                <td className="py-3 px-3 text-right text-white font-bold">{s.total.toLocaleString()}</td>
                <td className="py-3 px-3">
                  {onSelectRival && (
                    <button
                      onClick={() => onSelectRival(s)}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
