interface PastSeason {
  season_name: string
  total_points: number
  rank: number
}

interface Props { seasons: PastSeason[] }

export default function PastSeasonsTable({ seasons }: Props) {
  if (!seasons.length) {
    return <p className="text-slate-500 text-sm">No past season data available.</p>
  }

  const sorted = [...seasons].sort((a, b) => b.season_name.localeCompare(a.season_name))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-slate-700 text-left">
            <th className="py-2 px-3">Season</th>
            <th className="py-2 px-3 text-right">Total Points</th>
            <th className="py-2 px-3 text-right">Overall Rank</th>
            <th className="py-2 px-3 text-right">Percentile</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => {
            const percentile = s.rank > 0 ? ((1 - s.rank / 10_000_000) * 100).toFixed(1) : '—'
            return (
              <tr key={s.season_name} className="border-b border-slate-800 hover:bg-slate-800/40">
                <td className="py-3 px-3 text-white font-medium">{s.season_name}</td>
                <td className="py-3 px-3 text-right text-white font-bold">{s.total_points.toLocaleString()}</td>
                <td className="py-3 px-3 text-right text-slate-300">{s.rank > 0 ? s.rank.toLocaleString() : '—'}</td>
                <td className="py-3 px-3 text-right">
                  <span className={`font-medium ${Number(percentile) >= 90 ? 'text-green-400' : Number(percentile) >= 75 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {percentile !== '—' ? `Top ${(100 - Number(percentile)).toFixed(1)}%` : '—'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
