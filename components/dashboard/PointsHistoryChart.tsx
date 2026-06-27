'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { HistoryGW } from '@/lib/fpl/types'

interface Props {
  history: HistoryGW[]
  averages: Record<number, number>
}

export default function PointsHistoryChart({ history, averages }: Props) {
  const data = history.map((gw) => ({
    gw: `GW${gw.event}`,
    points: gw.points,
    average: averages[gw.event] ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="pointsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="gw" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, color: '#fff' }} />
        <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
        <Area type="monotone" dataKey="points" stroke="#7c3aed" fill="url(#pointsGrad)" strokeWidth={2} name="Your points" />
        <Area type="monotone" dataKey="average" stroke="#0ea5e9" fill="none" strokeWidth={1.5} strokeDasharray="4 2" name="GW average" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
