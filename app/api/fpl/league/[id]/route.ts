import { NextResponse } from 'next/server'
import { fetchLeagueStandings } from '@/lib/fpl/api'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? 1)
  const data = await fetchLeagueStandings(Number(id), page)
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' },
  })
}
