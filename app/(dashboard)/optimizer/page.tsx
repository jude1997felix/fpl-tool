'use client'
import { useState } from 'react'
import { generateOptimalSquad } from '@/actions/optimizer'
import OptimizerControls from '@/components/optimizer/OptimizerControls'
import SquadPitchView from '@/components/optimizer/SquadPitchView'
import type { OptimizerResult } from '@/lib/fpl/types'

export default function OptimizerPage() {
  const [budget, setBudget] = useState(1000)
  const [formation, setFormation] = useState('4-3-3')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<OptimizerResult | null>(null)
  const [error, setError] = useState('')

  async function handleGenerate() {
    setLoading(true)
    setError('')
    try {
      const res = await generateOptimalSquad({ budget, formation })
      setResult(res)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to optimize')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      {/* Header */}
      <div className="pt-2 pb-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Squad Optimizer</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Build the highest-projected 15-man squad within budget</p>
      </div>

      <OptimizerControls
        budget={budget}
        formation={formation}
        loading={loading}
        onBudgetChange={setBudget}
        onFormationChange={setFormation}
        onGenerate={handleGenerate}
      />

      {error && (
        <div className="glass border border-destructive/40 rounded-xl p-4 text-sm text-destructive">{error}</div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Result summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Projected EP', value: result.totalEP.toFixed(1), accent: true },
              { label: 'Budget Used', value: `£${(result.budgetUsed / 10).toFixed(1)}m` },
              { label: 'In the Bank', value: `£${((1000 - result.budgetUsed) / 10).toFixed(1)}m` },
              { label: 'Captain', value: result.captain?.web_name ?? '—', accent: true },
              { label: 'Vice Captain', value: result.viceCaptain?.web_name ?? '—' },
            ].map((s) => (
              <div key={s.label} className="stat-card glass rounded-xl p-4 text-center">
                <div className={`text-xl font-bold tracking-tight ${s.accent ? 'gradient-text' : 'text-foreground'}`}>{s.value}</div>
                <div className="text-[11px] text-muted-foreground mt-1 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>

          <SquadPitchView startingXI={result.startingXI} bench={result.bench} />
        </div>
      )}

      {!result && !loading && (
        <div className="glass rounded-2xl p-14 text-center border border-white/5">
          <div className="text-3xl mb-3 opacity-30">◎</div>
          <p className="text-muted-foreground text-sm">Configure your settings above and click Generate</p>
        </div>
      )}
    </div>
  )
}
