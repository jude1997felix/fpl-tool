interface Props {
  totalPoints: number
  overallRank: number
  benchPointsLost: number
  transferHitCost: number
  bestGW: { event: number; points: number }
  worstGW: { event: number; points: number }
  avgPoints: number
  gwsAboveAvg: number
  totalGWs: number
}

function Stat({ label, value, sub, accent = false, warn = false }: {
  label: string; value: string | number; sub?: string; accent?: boolean; warn?: boolean
}) {
  return (
    <div className="stat-card glass rounded-xl p-4 text-center cursor-default">
      <div className={`text-2xl font-bold tracking-tight ${accent ? 'gradient-text' : warn ? 'text-amber-400' : 'text-foreground'}`}>{value}</div>
      <div className="text-[11px] text-muted-foreground mt-1 uppercase tracking-widest">{label}</div>
      {sub && <div className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function SeasonSummaryStats(props: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Stat label="Total Points"      value={props.totalPoints.toLocaleString()} accent />
      <Stat label="Overall Rank"      value={props.overallRank > 0 ? props.overallRank.toLocaleString() : '—'} />
      <Stat label="Avg Points / GW"   value={props.avgPoints.toFixed(1)} sub={`${props.gwsAboveAvg}/${props.totalGWs} above avg`} />
      <Stat label="Best GW"           value={props.bestGW.points} sub={`GW${props.bestGW.event}`} accent />
      <Stat label="Worst GW"          value={props.worstGW.points} sub={`GW${props.worstGW.event}`} />
      <Stat label="Bench Points Lost" value={props.benchPointsLost} sub="left on bench" warn={props.benchPointsLost > 40} />
      <Stat label="Hit Cost"          value={`-${props.transferHitCost}`} sub="pts deducted" warn={props.transferHitCost > 12} />
      <Stat label="Hit Efficiency"    value={props.transferHitCost === 0 ? 'Clean' : `${Math.floor(props.transferHitCost / 4)} hits`} />
    </div>
  )
}
