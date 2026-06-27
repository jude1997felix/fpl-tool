'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { HistoryGW } from '@/lib/fpl/types'

interface Props { history: HistoryGW[] }

export default function RankChart({ history }: Props) {
  const data = history.map((gw) => ({
    gw: `GW${gw.event}`,
    rank: gw.overall_rank,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="gw" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
        <YAxis reversed tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false}
          tickFormatter={(v: number) => v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : v >= 1e3 ? `${Math.round(v/1e3)}K` : String(v)} />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, color: '#fff' }}
          formatter={(v) => [Number(v).toLocaleString(), 'Overall rank']}
        />
        <Line type="monotone" dataKey="rank" stroke="#10b981" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
