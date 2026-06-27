'use client'
import { Slider } from '@/components/ui/slider'

const FORMATIONS = ['4-4-2', '4-3-3', '3-5-2', '3-4-3', '5-4-1', '5-3-2', '4-5-1']

interface Props {
  budget: number
  formation: string
  loading: boolean
  onBudgetChange: (v: number) => void
  onFormationChange: (f: string) => void
  onGenerate: () => void
}

export default function OptimizerControls({ budget, formation, loading, onBudgetChange, onFormationChange, onGenerate }: Props) {
  return (
    <div className="glass rounded-2xl p-5 border border-white/5 space-y-5">
      {/* Budget */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Budget</span>
          <span className="text-sm font-bold text-foreground tabular-nums">£{(budget / 10).toFixed(1)}m</span>
        </div>
        <Slider
          min={950} max={1000} step={5}
          value={[budget]}
          onValueChange={(vals) => { const v = Array.isArray(vals) ? vals[0] : vals; onBudgetChange(v) }}
          className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary/50 [&_[role=slider]]:shadow-none"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5">
          <span>£95.0m</span><span>£100.0m</span>
        </div>
      </div>

      {/* Formation */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-3">Formation</span>
        <div className="flex flex-wrap gap-2">
          {FORMATIONS.map((f) => (
            <button
              key={f}
              onClick={() => onFormationChange(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
                formation === f
                  ? 'bg-primary text-background shadow-md shadow-primary/25'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/8 hover:text-foreground border border-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-primary text-background font-semibold text-sm tracking-wide transition-all duration-150 hover:opacity-90 active:opacity-80 disabled:opacity-50 glow-cyan shadow-lg shadow-primary/20"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            Optimizing…
          </span>
        ) : (
          '⚡  Generate Optimal Squad'
        )}
      </button>
    </div>
  )
}
