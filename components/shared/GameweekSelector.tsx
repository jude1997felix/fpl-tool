'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Props {
  gameweeks: number[]
  value: number
  onChange: (gw: number) => void
}

export default function GameweekSelector({ gameweeks, value, onChange }: Props) {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className="w-36 bg-slate-800 border-slate-600 text-white">
        <SelectValue placeholder="Gameweek" />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-700 text-white">
        {gameweeks.map((gw) => (
          <SelectItem key={gw} value={String(gw)} className="hover:bg-slate-700">
            GW {gw}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
