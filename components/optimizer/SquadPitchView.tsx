'use client'
import type { OptimizerPick } from '@/lib/fpl/types'

const POS_COLOR: Record<number, string> = {
  1: 'border-amber-400/60 bg-amber-400/10 text-amber-300',
  2: 'border-sky-400/60 bg-sky-400/10 text-sky-300',
  3: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300',
  4: 'border-rose-400/60 bg-rose-400/10 text-rose-300',
}

function PlayerCard({ pick }: { pick: OptimizerPick }) {
  return (
    <div className="flex flex-col items-center gap-1.5 group">
      <div className={`relative w-14 h-14 rounded-full border-2 ${POS_COLOR[pick.element_type]} flex items-center justify-center transition-transform duration-150 group-hover:scale-105`}>
        {pick.is_captain && (
          <span className="absolute -top-1.5 -right-1.5 bg-primary text-background text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md shadow-primary/30">C</span>
        )}
        {pick.is_vice_captain && (
          <span className="absolute -top-1.5 -right-1.5 bg-white/20 text-foreground text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center">V</span>
        )}
        <span className="text-center leading-tight px-1 text-[10px] font-semibold">{pick.web_name}</span>
      </div>
      <div className="bg-white/5 border border-white/8 rounded-lg px-2 py-0.5 text-center">
        <div className="text-[11px] font-bold text-foreground">£{(pick.now_cost / 10).toFixed(1)}m</div>
        <div className="text-[10px] text-muted-foreground">EP {pick.ep_next.toFixed(1)}</div>
      </div>
    </div>
  )
}

function Row({ picks }: { picks: OptimizerPick[] }) {
  return (
    <div className="flex justify-center gap-3 flex-wrap">
      {picks.map((p) => <PlayerCard key={p.player_id} pick={p} />)}
    </div>
  )
}

export default function SquadPitchView({ startingXI, bench }: { startingXI: OptimizerPick[]; bench: OptimizerPick[] }) {
  const gks  = startingXI.filter((p) => p.element_type === 1)
  const defs = startingXI.filter((p) => p.element_type === 2)
  const mids = startingXI.filter((p) => p.element_type === 3)
  const fwds = startingXI.filter((p) => p.element_type === 4)

  return (
    <div className="glass rounded-2xl p-6 border border-white/5 space-y-5"
         style={{ background: 'linear-gradient(180deg, oklch(0.13 0.025 155 / 40%) 0%, oklch(0.09 0.015 250 / 60%) 100%)' }}>
      <Row picks={fwds} />
      <Row picks={mids} />
      <Row picks={defs} />
      <Row picks={gks} />
      <div className="border-t border-white/6 pt-4">
        <p className="text-[10px] text-muted-foreground mb-3 text-center uppercase tracking-widest">Bench</p>
        <Row picks={bench} />
      </div>
    </div>
  )
}
