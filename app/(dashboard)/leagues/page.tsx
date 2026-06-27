'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface TrackedLeague { league_id: number; league_name: string }

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<TrackedLeague[]>([])
  const [leagueId, setLeagueId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('tracked_leagues').select('league_id, league_name').eq('user_id', user.id)
        .then(({ data }) => setLeagues(data ?? []))
    })
  }, [])

  async function addLeague(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/user/track-league', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leagueId: parseInt(leagueId) }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) setError(json.error)
    else {
      setLeagues((prev) => [...prev, { league_id: parseInt(leagueId), league_name: json.leagueName }])
      setLeagueId('')
    }
  }

  return (
    <div className="p-6 max-w-2xl space-y-5">
      <div className="pt-2 pb-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Mini-Leagues</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track standings and compare rivals</p>
      </div>

      {/* Add league */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Track a league</p>
        <form onSubmit={addLeague} className="flex gap-3">
          <input
            type="number"
            placeholder="League ID"
            value={leagueId}
            onChange={(e) => setLeagueId(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-primary text-background text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all glow-cyan"
          >
            {loading ? 'Adding…' : 'Add'}
          </button>
        </form>
        {error && <p className="text-destructive text-sm mt-2">{error}</p>}
        <p className="text-[11px] text-muted-foreground mt-3">Find league IDs in your FPL leagues tab</p>
      </div>

      {/* League list */}
      {leagues.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5">
          <div className="text-3xl mb-3 opacity-20">◈</div>
          <p className="text-muted-foreground text-sm">No leagues tracked yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leagues.map((l) => (
            <Link
              key={l.league_id}
              href={`/leagues/${l.league_id}`}
              className="flex items-center justify-between glass rounded-xl px-5 py-4 border border-white/5 hover:border-primary/20 hover:bg-white/5 transition-all group"
            >
              <div>
                <div className="font-semibold text-sm text-foreground">{l.league_name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">ID: {l.league_id}</div>
              </div>
              <span className="text-primary text-xs group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
