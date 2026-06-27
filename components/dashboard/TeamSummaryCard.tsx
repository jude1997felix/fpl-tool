interface Props {
  teamName: string
  managerName: string
  gwPoints: number
  totalPoints: number
  overallRank: number
  teamValue: number
  itb: number
}

function StatBlock({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="stat-card glass rounded-xl p-4 text-center cursor-default">
      <div className={`text-2xl font-bold tracking-tight ${accent ? 'gradient-text' : 'text-foreground'}`}>{value}</div>
      <div className="text-[11px] text-muted-foreground mt-1 uppercase tracking-widest">{label}</div>
    </div>
  )
}

export default function TeamSummaryCard({ teamName, managerName, gwPoints, totalPoints, overallRank, teamValue, itb }: Props) {
  return (
    <div className="glass rounded-2xl p-6 border border-primary/15">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">{teamName}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{managerName}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs font-medium text-primary">Active</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatBlock label="GW Points"     value={gwPoints}                              accent />
        <StatBlock label="Total Points"  value={totalPoints.toLocaleString()}          />
        <StatBlock label="Overall Rank"  value={overallRank > 0 ? overallRank.toLocaleString() : '—'} />
        <StatBlock label="Team Value"    value={`£${(teamValue / 10).toFixed(1)}m`}    />
        <StatBlock label="In the Bank"   value={`£${(itb / 10).toFixed(1)}m`}         />
      </div>
    </div>
  )
}
