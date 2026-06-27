'use client'
import { useState } from 'react'

export default function FplIdLinkForm({ onLinked }: { onLinked: () => void }) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/user/link-team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fplTeamId: parseInt(value) }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) setError(json.error ?? 'Failed to link team')
    else onLinked()
  }

  return (
    <div className="glass rounded-2xl p-6 border border-primary/20 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <h3 className="font-semibold text-sm text-foreground">Link your FPL team</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Find your team ID in the URL at{' '}
        <span className="font-mono text-xs text-primary">fantasy.premierleague.com/entry/<strong>[ID]</strong>/event/1</span>
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="number"
          placeholder="e.g. 1234567"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-white/8 transition-all"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-primary text-background text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all glow-cyan"
        >
          {loading ? 'Linking…' : 'Link'}
        </button>
      </form>
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
    </div>
  )
}
