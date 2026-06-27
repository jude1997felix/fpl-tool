'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface ManagerHistory {
  name: string
  history: { event: number; total: number; rank: number }[]
}

interface Props { managers: ManagerHistory[] }

const COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#ec4899', '#84cc16', '#f97316']

export default function LeagueRankChart({ managers }: Props) {
  if (!managers.length) return null

  const gwSet = new Set<number>()
  managers.forEach((m) => m.history.forEach((h) => gwSet.add(h.event)))
  const gws = Array.from(gwSet).sort((a, b) => a - b)

  const data = gws.map((gw) => {
    const row: Record<string, number | string> = { gw: `GW${gw}` }
    managers.forEach((m) => {
      const h = m.history.find((x) => x.event === gw)
      if (h) row[m.name] = h.rank
    })
    return row
  })

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="gw" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
        <YAxis reversed tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, color: '#fff' }} />
        <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 11 }} />
        {managers.map((m, i) => (
          <Line key={m.name} type="monotone" dataKey={m.name} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
