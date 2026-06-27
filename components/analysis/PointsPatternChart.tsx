'use client'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { HistoryGW } from '@/lib/fpl/types'

interface Props {
  history: HistoryGW[]
  averages: Record<number, number>
}

export default function PointsPatternChart({ history, averages }: Props) {
  const avg = history.reduce((s, g) => s + g.points, 0) / (history.length || 1)

  const data = history.map((gw) => ({
    gw: `GW${gw.event}`,
    points: gw.points,
    bench: gw.points_on_bench,
    hit: gw.event_transfers_cost,
    average: averages[gw.event] ?? 0,
    delta: gw.points - (averages[gw.event] ?? 0),
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="gw" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} interval={2} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, color: '#fff', fontSize: 12 }}
          formatter={(value, name) => {
            const labels: Record<string, string> = { points: 'Your pts', average: 'GW avg', bench: 'Bench pts', hit: 'Hit cost' }
            return [Number(value), labels[String(name)] ?? String(name)]
          }}
        />
        <ReferenceLine y={avg} stroke="#7c3aed" strokeDasharray="4 2" label={{ value: 'Your avg', fill: '#7c3aed', fontSize: 10 }} />
        <Bar dataKey="points" fill="#3b82f6" opacity={0.7} radius={[3, 3, 0, 0]} />
        <Bar dataKey="bench" fill="#f59e0b" opacity={0.5} radius={[3, 3, 0, 0]} />
        <Line type="monotone" dataKey="average" stroke="#10b981" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
