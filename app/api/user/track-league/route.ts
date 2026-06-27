import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchLeagueStandings } from '@/lib/fpl/api'

export async function POST(req: Request) {
  const { leagueId } = await req.json()
  if (!leagueId || isNaN(leagueId)) {
    return NextResponse.json({ error: 'Invalid league ID' }, { status: 400 })
  }

  let leagueName = `League ${leagueId}`
  try {
    const data = await fetchLeagueStandings(leagueId)
    leagueName = data.league.name
  } catch {
    return NextResponse.json({ error: 'League not found.' }, { status: 404 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { error } = await supabase.from('tracked_leagues').upsert({
    user_id: user.id,
    league_id: leagueId,
    league_name: leagueName,
  }, { onConflict: 'user_id,league_id', ignoreDuplicates: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, leagueName })
}
