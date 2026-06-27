import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchEntry } from '@/lib/fpl/api'

export async function POST(req: Request) {
  const { fplTeamId } = await req.json()
  if (!fplTeamId || isNaN(fplTeamId)) {
    return NextResponse.json({ error: 'Invalid team ID' }, { status: 400 })
  }

  // Validate the team exists on FPL
  try {
    await fetchEntry(fplTeamId)
  } catch {
    return NextResponse.json({ error: 'FPL team not found. Check your team ID.' }, { status: 404 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('profiles')
    .update({ fpl_team_id: fplTeamId })
    .eq('id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
