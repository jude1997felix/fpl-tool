import type { HistoryGW, EntryPick, FplPlayer } from '@/lib/fpl/types'

interface CaptainEntry {
  gw: number
  playerName: string
  points: number
  captainPoints: number
}

interface Props { entries: CaptainEntry[] }

export default function CaptainLog({ entries }: Props) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-slate-700">
            <th className="text-left py-2 px-2">GW</th>
            <th className="text-left py-2 px-2">Captain</th>
            <th className="text-right py-2 px-2">Pts (×2)</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.gw} className="border-b border-slate-800 hover:bg-slate-800/40">
              <td className="py-2 px-2 text-slate-400">GW{e.gw}</td>
              <td className="py-2 px-2 text-white font-medium">{e.playerName}</td>
              <td className="py-2 px-2 text-right">
                <span className={`font-semibold ${e.captainPoints >= 12 ? 'text-green-400' : e.captainPoints >= 6 ? 'text-white' : 'text-red-400'}`}>
                  {e.captainPoints}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
