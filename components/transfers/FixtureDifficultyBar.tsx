import { fdrColor, type FdrLevel } from '@/lib/utils/fixtures'

interface Props {
  fixtures: { gw: number; difficulty: FdrLevel; isHome: boolean }[]
}

export default function FixtureDifficultyBar({ fixtures }: Props) {
  return (
    <div className="flex gap-1">
      {fixtures.map((f) => (
        <div
          key={f.gw}
          title={`GW${f.gw} — FDR ${f.difficulty} (${f.isHome ? 'H' : 'A'})`}
          className="w-8 h-6 rounded text-xs font-bold flex items-center justify-center text-black"
          style={{ backgroundColor: fdrColor(f.difficulty) }}
        >
          {f.difficulty}
        </div>
      ))}
    </div>
  )
}
